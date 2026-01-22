import { PrismaClient, UserRole, UserStatus, ColaboradorStatus, EmpresaStatus, EmpresaOrigen, AuditoriaStatus, TipoServicio, ComisionStatus } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Limpiar datos existentes
  console.log('🧹 Cleaning existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.documento.deleteMany()
  await prisma.comision.deleteMany()
  await prisma.auditoria.deleteMany()
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
      email: 'garcia@gestoria.es',
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
  const empresaDirectaUser = await prisma.user.create({
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
    include: {
      empresa: true,
    },
  })

  // 5. EMPRESAS traídas por Colaborador 1
  console.log('🏢 Creating companies brought by collaborators...')
  
  const empresa1 = await prisma.empresa.create({
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
      status: EmpresaStatus.IN_AUDIT,
      notes: 'Cliente importante, facturación creciente',
    },
  })

  const empresa2 = await prisma.empresa.create({
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
  const empresa3 = await prisma.empresa.create({
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
      status: EmpresaStatus.AUDITED,
    },
  })

  // 7. AUDITORÍAS
  console.log('📋 Creating audits...')

  // Auditoría 1: Empresa directa (sin comisión)
  const auditoria1 = await prisma.auditoria.create({
    data: {
      empresaId: empresaDirectaUser.empresa!.id,
      tipoServicio: TipoServicio.AUDITORIA_CUENTAS,
      fiscalYear: 2024,
      description: 'Auditoría de cuentas anuales 2024',
      urgente: false,
      status: AuditoriaStatus.EN_PROCESO,
      presupuesto: 8500.00,
      presupuestoNotas: 'Incluye revisión completa de estados financieros',
      presupuestoValidoHasta: new Date('2026-02-28'),
      fechaSolicitud: new Date('2026-01-15'),
      fechaPresupuesto: new Date('2026-01-18'),
      fechaAprobacion: new Date('2026-01-20'),
      fechaInicio: new Date('2026-01-22'),
    },
  })

  // Auditoría 2: Empresa traída por colaborador 1 (CON comisión)
  const auditoria2 = await prisma.auditoria.create({
    data: {
      empresaId: empresa1.id,
      colaboradorId: colaborador1User.colaborador!.id,
      tipoServicio: TipoServicio.AUDITORIA_CUENTAS,
      fiscalYear: 2024,
      description: 'Auditoría obligatoria cuentas anuales 2024',
      urgente: true,
      status: AuditoriaStatus.COMPLETADA,
      presupuesto: 12000.00,
      presupuestoNotas: 'Auditoría completa con revisión de inventarios',
      comisionRate: 12.00, // 12%
      comisionAmount: 1440.00, // 12% de 12000
      comisionPagada: true,
      fechaSolicitud: new Date('2025-12-01'),
      fechaPresupuesto: new Date('2025-12-05'),
      fechaAprobacion: new Date('2025-12-10'),
      fechaInicio: new Date('2025-12-15'),
      fechaFinalizacion: new Date('2026-01-15'),
    },
  })

  // Auditoría 3: Empresa traída por colaborador 2 (CON comisión, completada)
  const auditoria3 = await prisma.auditoria.create({
    data: {
      empresaId: empresa3.id,
      colaboradorId: colaborador2User.colaborador!.id,
      tipoServicio: TipoServicio.AUDITORIA_CONSOLIDADA,
      fiscalYear: 2023,
      description: 'Auditoría de cuentas consolidadas 2023',
      urgente: false,
      status: AuditoriaStatus.COMPLETADA,
      presupuesto: 18000.00,
      presupuestoNotas: 'Incluye filiales y matriz',
      comisionRate: 10.00, // 10%
      comisionAmount: 1800.00, // 10% de 18000
      comisionPagada: true,
      fechaSolicitud: new Date('2025-11-01'),
      fechaPresupuesto: new Date('2025-11-05'),
      fechaAprobacion: new Date('2025-11-10'),
      fechaInicio: new Date('2025-11-15'),
      fechaFinalizacion: new Date('2025-12-20'),
    },
  })

  // Auditoría 4: Pendiente de presupuestar
  const auditoria4 = await prisma.auditoria.create({
    data: {
      empresaId: empresa2.id,
      colaboradorId: colaborador1User.colaborador!.id,
      tipoServicio: TipoServicio.DUE_DILIGENCE,
      fiscalYear: 2024,
      description: 'Due diligence para posible venta',
      urgente: true,
      status: AuditoriaStatus.SOLICITADA,
      fechaSolicitud: new Date('2026-01-20'),
    },
  })

  // 8. COMISIONES
  console.log('💰 Creating commissions...')

  // Comisión 1: Pagada (auditoría 2)
  await prisma.comision.create({
    data: {
      colaboradorId: colaborador1User.colaborador!.id,
      auditoriaId: auditoria2.id,
      montoBase: 12000.00,
      porcentaje: 12.00,
      montoComision: 1440.00,
      status: ComisionStatus.PAGADA,
      fechaPago: new Date('2026-01-20'),
      referenciaPago: 'TRANS-2026-001',
      notas: 'Pago realizado por transferencia bancaria',
    },
  })

  // Comisión 2: Pagada (auditoría 3)
  await prisma.comision.create({
    data: {
      colaboradorId: colaborador2User.colaborador!.id,
      auditoriaId: auditoria3.id,
      montoBase: 18000.00,
      porcentaje: 10.00,
      montoComision: 1800.00,
      status: ComisionStatus.PAGADA,
      fechaPago: new Date('2025-12-28'),
      referenciaPago: 'TRANS-2025-045',
      notas: 'Pago realizado por transferencia bancaria',
    },
  })

  // Actualizar totales de comisiones en colaboradores
  await prisma.colaborador.update({
    where: { id: colaborador1User.colaborador!.id },
    data: {
      totalCommissions: 1440.00,
      pendingCommissions: 0,
    },
  })

  await prisma.colaborador.update({
    where: { id: colaborador2User.colaborador!.id },
    data: {
      totalCommissions: 1800.00,
      pendingCommissions: 0,
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

  console.log('✅ Database seeding completed successfully!')
  console.log('')
  console.log('📊 Summary:')
  console.log(`- Users created: ${await prisma.user.count()}`)
  console.log(`- Colaboradores created: ${await prisma.colaborador.count()}`)
  console.log(`- Empresas created: ${await prisma.empresa.count()}`)
  console.log(`- Auditorías created: ${await prisma.auditoria.count()}`)
  console.log(`- Comisiones created: ${await prisma.comision.count()}`)
  console.log('')
  console.log('🔑 Test credentials:')
  console.log('Admin: admin@mindaudit.es / admin123')
  console.log('Colaborador 1: garcia@gestoria.es / colaborador123')
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
