import { PrismaClient, UserRole, UserStatus, ColaboradorStatus, EmpresaStatus, EmpresaOrigen } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Limpiar datos existentes
  console.log('🧹 Cleaning existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.documento.deleteMany()
  await prisma.comision.deleteMany()
  
  // Cleanup consultation system
  await prisma.archivoConsulta.deleteMany()
  await prisma.compraHoras.deleteMany()
  await prisma.consulta.deleteMany()
  await prisma.categoriaConsulta.deleteMany()
  await prisma.paqueteHoras.deleteMany()
  
  await prisma.empresa.deleteMany()
  await prisma.colaborador.deleteMany()
  await prisma.user.deleteMany()
  await prisma.configuracionSistema.deleteMany()

  // Crear configuración del sistema
  console.log('⚙️ Creating system configuration...')
  await prisma.configuracionSistema.create({
    data: {
      id: 'default-config',
      comisionDefaultRate: 10.00,
      diasValidezPresupuesto: 30,
      emailNotificaciones: 'info@mindaudit.es',
    },
  })

  // Crear usuarios de prueba
  console.log('👤 Creating test users...')

  // 1. ADMIN
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mindaudit.es',
      name: 'Administrador MindAudit',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      hashedPassword: await hash('admin123', 10),
      emailVerified: new Date(),
    },
  })

  // 2. COLABORADOR 1 (Gestoría García)
  const colaborador1User = await prisma.user.create({
    data: {
      email: 'jjhurtado017@gmail.com',
      name: 'Juan García López',
      role: UserRole.COLABORADOR,
      status: UserStatus.ACTIVE,
      hashedPassword: await hash('colaborador123', 10),
      emailVerified: new Date(),
      colaborador: {
        create: {
          companyName: 'Gestoría García & Asociados',
          cif: 'B12345678',
          phone: '+34912345678',
          address: 'Calle Mayor 123',
          city: 'Madrid',
          province: 'Madrid',
          postalCode: '28001',
          website: 'https://gestoriagarcia.es',
          status: ColaboradorStatus.ACTIVE,
          commissionRate: 12.00, // 12% de comisión
          totalCommissions: 0,
          pendingCommissions: 0,
        },
      },
    },
    include: {
      colaborador: true,
    },
  })

  // 3. COLABORADOR 2 (Asesoría Martínez)
  const colaborador2User = await prisma.user.create({
    data: {
      email: 'martinez@asesoria.es',
      name: 'Laura Martínez Ruiz',
      role: UserRole.COLABORADOR,
      status: UserStatus.ACTIVE,
      hashedPassword: await hash('colaborador123', 10),
      emailVerified: new Date(),
      colaborador: {
        create: {
          companyName: 'Asesoría Martínez SL',
          cif: 'B87654321',
          phone: '+34923456789',
          address: 'Avenida Libertad 45',
          city: 'Barcelona',
          province: 'Barcelona',
          postalCode: '08001',
          status: ColaboradorStatus.ACTIVE,
          commissionRate: 10.00, // 10% de comisión
          totalCommissions: 0,
          pendingCommissions: 0,
        },
      },
    },
    include: {
      colaborador: true,
    },
  })

  // 4. EMPRESA DIRECTA (sin colaborador)
  await prisma.user.create({
    data: {
      email: 'info@techsolutions.es',
      name: 'Carlos Pérez (Tech Solutions)',
      role: UserRole.EMPRESA,
      status: UserStatus.ACTIVE,
      hashedPassword: await hash('empresa123', 10),
      emailVerified: new Date(),
      empresa: {
        create: {
          origen: EmpresaOrigen.DIRECTA,
          companyName: 'Tech Solutions SL',
          cif: 'B11111111',
          contactName: 'Carlos Pérez',
          contactEmail: 'info@techsolutions.es',
          contactPhone: '+34934567890',
          address: 'Calle Innovación 10',
          city: 'Valencia',
          province: 'Valencia',
          postalCode: '46001',
          employees: 25,
          revenue: 500000.00,
          fiscalYear: 2024,
          status: EmpresaStatus.ACTIVE,
        },
      },
    },
  })

  // 5. EMPRESAS traídas por Colaborador 1
  console.log('🏢 Creating companies brought by collaborators...')
  
  await prisma.empresa.create({
    data: {
      origen: EmpresaOrigen.COLABORADOR,
      colaboradorId: colaborador1User.colaborador!.id,
      companyName: 'Comercial Ibérica SA',
      cif: 'A22222222',
      contactName: 'Ana Rodríguez',
      contactEmail: 'ana@comercialiberica.es',
      contactPhone: '+34945678901',
      address: 'Polígono Industrial Norte 5',
      city: 'Sevilla',
      province: 'Sevilla',
      postalCode: '41001',
      employees: 50,
      revenue: 1200000.00,
      fiscalYear: 2024,
      status: EmpresaStatus.ACTIVE,
      notes: 'Cliente importante, facturación creciente',
    },
  })

  await prisma.empresa.create({
    data: {
      origen: EmpresaOrigen.COLABORADOR,
      colaboradorId: colaborador1User.colaborador!.id,
      companyName: 'Distribuciones López SL',
      cif: 'B33333333',
      contactName: 'Miguel López',
      contactEmail: 'miguel@distlopez.es',
      contactPhone: '+34956789012',
      address: 'Calle Comercio 78',
      city: 'Málaga',
      province: 'Málaga',
      postalCode: '29001',
      employees: 15,
      revenue: 350000.00,
      fiscalYear: 2024,
      status: EmpresaStatus.PROSPECT,
    },
  })

  // 6. EMPRESA traída por Colaborador 2
  await prisma.empresa.create({
    data: {
      origen: EmpresaOrigen.COLABORADOR,
      colaboradorId: colaborador2User.colaborador!.id,
      companyName: 'Construcciones Catalanas SL',
      cif: 'B44444444',
      contactName: 'Jordi Puig',
      contactEmail: 'jordi@constcatalanas.es',
      contactPhone: '+34967890123',
      address: 'Paseo Gracia 234',
      city: 'Barcelona',
      province: 'Barcelona',
      postalCode: '08002',
      employees: 80,
      revenue: 2500000.00,
      fiscalYear: 2024,
      status: EmpresaStatus.ACTIVE,
    },
  })

  // 9. AUDIT LOGS
  console.log('📝 Creating audit logs...')
  await prisma.auditLog.create({
    data: {
      userId: adminUser.id,
      userRole: UserRole.ADMIN,
      action: 'CREATE',
      entity: 'User',
      entityId: adminUser.id,
      description: 'Usuario administrador creado durante seed',
    },
  })

  // 10. CATEGORÍAS DE CONSULTA
  console.log('📚 Creating consultation categories...')
  
  await prisma.categoriaConsulta.create({
    data: {
      nombre: 'Consulta Básica',
      descripcion: 'Consultas simples y rápidas (ej: dudas sobre declaraciones)',
      horas: 1,
      isCustom: false,
      orden: 1,
      activo: true,
    },
  })

  await prisma.categoriaConsulta.create({
    data: {
      nombre: 'Consulta Estándar',
      descripcion: 'Consultas de complejidad media (ej: revisión de documentos)',
      horas: 3,
      isCustom: false,
      orden: 2,
      activo: true,
    },
  })

  await prisma.categoriaConsulta.create({
    data: {
      nombre: 'Consulta Avanzada',
      descripcion: 'Consultas complejas (ej: planificación fiscal, restructuraciones)',
      horas: 5,
      isCustom: false,
      orden: 3,
      activo: true,
    },
  })

  await prisma.categoriaConsulta.create({
    data: {
      nombre: 'Consulta Urgente',
      descripcion: 'Atención prioritaria inmediata',
      horas: 2,
      isCustom: false,
      orden: 4,
      activo: true,
    },
  })

  await prisma.categoriaConsulta.create({
    data: {
      nombre: 'Personalizado',
      descripcion: 'El auditor asigna horas manualmente',
      horas: 0,
      isCustom: true,
      orden: 99,
      activo: true,
    },
  })

  // 11. PAQUETES DE HORAS
  console.log('⏱️ Creating hour packages...')

  await prisma.paqueteHoras.create({
    data: {
      nombre: 'Paquete Básico',
      descripcion: 'Perfect para consultas ocasionales',
      horas: 10,
      precio: 500.00,
      descuento: 0,
      destacado: false,
      orden: 1,
      activo: true,
    },
  })

  await prisma.paqueteHoras.create({
    data: {
      nombre: 'Paquete Estándar',
      descripcion: 'El más popular - Ahorra 15%',
      horas: 25,
      precio: 1062.50, // 25 * 50 = 1250, con 15% descuento = 1062.50
      descuento: 15,
      destacado: true,
      orden: 2,
      activo: true,
    },
  })

  await prisma.paqueteHoras.create({
    data: {
      nombre: 'Paquete Premium',
      descripcion: 'Máximo ahorro - 25% de descuento',
      horas: 50,
      precio: 1875.00, // 50 * 50 = 2500, con 25% descuento = 1875
      descuento: 25,
      destacado: false,
      orden: 3,
      activo: true,
    },
  })

  // Dar 5 horas iniciales al colaborador 1 para testing
  await prisma.user.update({
    where: { id: colaborador1User.id },
    data: {
      horasDisponibles: 5,
    },
  })

  console.log('✅ Database seeding completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`- Users created: ${await prisma.user.count()}`)
  console.log(`- Colaboradores created: ${await prisma.colaborador.count()}`)
  console.log(`- Empresas created: ${await prisma.empresa.count()}`)
  console.log(`- Categorías de Consulta: ${await prisma.categoriaConsulta.count()}`)
  console.log(`- Paquetes de Horas: ${await prisma.paqueteHoras.count()}`)
  console.log('')
  console.log('🔑 Test credentials:')
  console.log('Admin: admin@mindaudit.es / admin123')
  console.log('Colaborador 1: jjhurtado017@gmail.com / colaborador123 (5 horas disponibles)')
  console.log('Colaborador 2: martinez@asesoria.es / colaborador123')
  console.log('Empresa Directa: info@techsolutions.es / empresa123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
