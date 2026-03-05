import { getAuthenticatedUser } from '@/middleware/api-auth'
import { requireColaborador } from '@/middleware/api-rbac'
import { successResponse, serverErrorResponse } from '@/lib/api-response'
import { prisma } from '@/lib/db/prisma'
import { supabaseAdmin } from '@/lib/supabase/client'
import { EmailService } from '@/lib/email/email-service'
import { v4 as uuidv4 } from 'uuid'

/**
 * POST /api/colaboradores/me/sign-contract
 * Recibe el PDF firmado, lo guarda en Supabase y activa el estado de comisionado
 */
export async function POST(req: Request) {
  try {
    // Autenticar usuario
    const user = await getAuthenticatedUser()
    requireColaborador(user)

    const formData = await req.formData()
    const file = formData.get('contractFile') as File

    if (!file) {
      return serverErrorResponse('No se ha proporcionado el archivo del contrato')
    }

    // 1. Subir a Supabase Storage
    const fileExt = file.name.split('.').pop()
    const fileName = `${uuidv4()}.${fileExt}`
    const filePath = `contratos/signed/${user.id}/${fileName}`
    
    const buffer = Buffer.from(await file.arrayBuffer())
    
    const { error: uploadError } = await supabaseAdmin.storage
      .from('documentos')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: true
      })

    if (uploadError) {
      throw new Error(`Error subiendo contrato: ${uploadError.message}`)
    }

    // Obtener URL pública (o firmada si es privado, pero usamos publicUrl según el patrón anterior)
    const { data: urlData } = supabaseAdmin.storage
      .from('documentos')
      .getPublicUrl(filePath)

    const contractUrl = urlData.publicUrl

    // 2. Actualizar Colaborador y User
    const [colaborador] = await prisma.$transaction([
      prisma.colaborador.update({
        where: { userId: user.id },
        data: {
          contractSignedAt: new Date(),
          contractUrl: contractUrl,
        },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: {
          isCommissioning: true,
        },
      }),
    ])

    // 3. Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        userRole: user.role,
        action: 'UPDATE',
        entity: 'Colaborador',
        entityId: colaborador.id,
        description: 'Contrato PDF subido y activación de comisionado',
      },
    })

    // 4. Notificar a Admin con el archivo adjunto
    try {
      await EmailService.notifyContractSignedToAdmin(
        { name: user.name, email: user.email, companyName: colaborador.companyName },
        contractUrl,
        buffer,
        file.name
      )
    } catch (emailError) {
      console.error('Error enviando notificación de contrato a admin:', emailError)
      // No fallamos la petición principal si el email falla
    }

    return successResponse({
      contractSignedAt: colaborador.contractSignedAt,
      contractUrl: colaborador.contractUrl
    }, 'Contrato subido correctamente. ¡Bienvenido al plan de partners!')
  } catch (error: unknown) {
    console.error('Error en POST /api/colaboradores/me/sign-contract:', error)
    const e = error as Error;
    return serverErrorResponse(e.message)
  }
}
