import { PrismaClient, UserRole, UserStatus, PartnerStatus } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data (optional - comment out if you want to keep existing data)
  console.log('🧹 Cleaning existing data...')
  await prisma.auditLog.deleteMany()
  await prisma.document.deleteMany()
  await prisma.consultationMessage.deleteMany()
  await prisma.consultation.deleteMany()
  await prisma.meeting.deleteMany()
  await prisma.invoice.deleteMany()
  await prisma.news.deleteMany()
  await prisma.budget.deleteMany()
  await prisma.client.deleteMany()
  await prisma.partner.deleteMany()
  await prisma.auditor.deleteMany()
  await prisma.user.deleteMany()

  // Create Admin User
  console.log('👤 Creating admin user...')
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@mindaudit.es',
      name: 'Administrador MindAudit',
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
      hashedPassword: adminPassword,
      emailVerified: new Date(),
    },
  })

  // Create Auditor User
  console.log('🔍 Creating auditor user...')
  const auditorPassword = await bcrypt.hash('auditor123', 10)
  const auditorUser = await prisma.user.create({
    data: {
      email: 'auditor@mindaudit.es',
      name: 'Carlos Rodríguez',
      role: UserRole.AUDITOR,
      status: UserStatus.ACTIVE,
      hashedPassword: auditorPassword,
      emailVerified: new Date(),
      auditor: {
        create: {
          specialization: 'Auditoría de Cuentas Anuales',
          certifications: ['ROAC', 'Certified Public Accountant'],
        },
      },
    },
  })

  // Create Partner Users
  console.log('🤝 Creating partner users...')
  
  // Partner 1
  const partner1Password = await bcrypt.hash('partner123', 10)
  const partner1User = await prisma.user.create({
    data: {
      email: 'partner1@example.com',
      name: 'María García',
      role: UserRole.PARTNER,
      status: UserStatus.ACTIVE,
      hashedPassword: partner1Password,
      emailVerified: new Date(),
      partner: {
        create: {
          companyName: 'Asesoría García & Asociados',
          cif: 'B12345678',
          address: 'Calle Mayor 123',
          city: 'Madrid',
          province: 'Madrid',
          postalCode: '28001',
          phone: '+34 91 123 45 67',
          website: 'https://www.garcia-asesores.com',
          status: PartnerStatus.ACTIVE,
          rating: 4.5,
          totalCommissions: 5000.00,
          contractSignedAt: new Date(),
        },
      },
    },
  })

  // Partner 2
  const partner2Password = await bcrypt.hash('partner123', 10)
  const partner2User = await prisma.user.create({
    data: {
      email: 'partner2@example.com',
      name: 'Juan Martínez',
      role: UserRole.PARTNER,
      status: UserStatus.ACTIVE,
      hashedPassword: partner2Password,
      emailVerified: new Date(),
      partner: {
        create: {
          companyName: 'Despacho Martínez SL',
          cif: 'B87654321',
          address: 'Avenida Diagonal 456',
          city: 'Barcelona',
          province: 'Barcelona',
          postalCode: '08008',
          phone: '+34 93 987 65 43',
          status: PartnerStatus.ACTIVE,
          rating: 4.8,
          totalCommissions: 8500.00,
          contractSignedAt: new Date(),
        },
      },
    },
  })

  // Get partner IDs for creating related data
  const partner1 = await prisma.partner.findUnique({
    where: { userId: partner1User.id },
  })
  const partner2 = await prisma.partner.findUnique({
    where: { userId: partner2User.id },
  })

  if (!partner1 || !partner2) {
    throw new Error('Partners not found')
  }

  // Create Clients
  console.log('👥 Creating clients...')
  
  const client1 = await prisma.client.create({
    data: {
      partnerId: partner1.id,
      companyName: 'Tech Solutions SL',
      cif: 'B11111111',
      contactName: 'Pedro López',
      contactEmail: 'pedro@techsolutions.com',
      contactPhone: '+34 91 111 11 11',
      address: 'Calle Tecnología 1',
      city: 'Madrid',
      province: 'Madrid',
      postalCode: '28002',
      fiscalYears: [2023, 2024],
      employees: 50,
      revenue: 2000000.00,
      status: 'ACTIVE',
    },
  })

  const client2 = await prisma.client.create({
    data: {
      partnerId: partner1.id,
      companyName: 'Comercial Barcelona SA',
      cif: 'A22222222',
      contactName: 'Ana Fernández',
      contactEmail: 'ana@comercialbarcelona.com',
      contactPhone: '+34 93 222 22 22',
      address: 'Paseo de Gracia 100',
      city: 'Barcelona',
      province: 'Barcelona',
      postalCode: '08009',
      fiscalYears: [2024],
      employees: 120,
      revenue: 5000000.00,
      status: 'ACTIVE',
    },
  })

  const client3 = await prisma.client.create({
    data: {
      partnerId: partner2.id,
      companyName: 'Industrias del Norte SL',
      cif: 'B33333333',
      contactName: 'Roberto Sánchez',
      contactEmail: 'roberto@industriasnorte.com',
      contactPhone: '+34 94 333 33 33',
      address: 'Polígono Industrial Norte',
      city: 'Bilbao',
      province: 'Vizcaya',
      postalCode: '48001',
      fiscalYears: [2023, 2024],
      employees: 200,
      revenue: 10000000.00,
      status: 'ACTIVE',
    },
  })

  // Create Budgets
  console.log('💰 Creating budgets...')
  
  await prisma.budget.create({
    data: {
      clientId: client1.id,
      partnerId: partner1.id,
      serviceType: 'AUDIT_ACCOUNTS',
      fiscalYears: [2024],
      description: 'Auditoría de cuentas anuales ejercicio 2024',
      status: 'APPROVED',
      amount: 3500.00,
      responseNotes: 'Presupuesto aprobado. Inicio previsto para febrero 2025.',
      validUntil: new Date('2025-12-31'),
      commissionRate: 15.00,
      commissionAmount: 525.00,
      respondedAt: new Date(),
      approvedAt: new Date(),
    },
  })

  await prisma.budget.create({
    data: {
      clientId: client2.id,
      partnerId: partner1.id,
      serviceType: 'AUDIT_ACCOUNTS',
      fiscalYears: [2024],
      description: 'Auditoría de cuentas anuales ejercicio 2024',
      status: 'PENDING',
      urgency: true,
    },
  })

  await prisma.budget.create({
    data: {
      clientId: client3.id,
      partnerId: partner2.id,
      serviceType: 'AUDIT_CONSOLIDATED',
      fiscalYears: [2023, 2024],
      description: 'Auditoría de cuentas consolidadas',
      specialRequests: 'Requiere revisión de filiales internacionales',
      status: 'IN_REVIEW',
    },
  })

  // Create Consultations
  console.log('💬 Creating consultations...')
  
  const consultation1 = await prisma.consultation.create({
    data: {
      partnerId: partner1.id,
      subject: 'Consulta sobre plazo de auditoría',
      status: 'RESOLVED',
      priority: 3,
      resolvedAt: new Date(),
      messages: {
        create: [
          {
            senderId: partner1User.id,
            senderRole: UserRole.PARTNER,
            message: '¿Cuál es el plazo estimado para completar la auditoría de cuentas anuales?',
          },
          {
            senderId: auditorUser.id,
            senderRole: UserRole.AUDITOR,
            message: 'El plazo estimado es de 4-6 semanas desde el inicio, dependiendo de la complejidad y disponibilidad de documentación.',
          },
        ],
      },
    },
  })

  const consultation2 = await prisma.consultation.create({
    data: {
      partnerId: partner2.id,
      subject: 'Documentación necesaria para auditoría',
      status: 'OPEN',
      priority: 2,
      messages: {
        create: [
          {
            senderId: partner2User.id,
            senderRole: UserRole.PARTNER,
            message: '¿Qué documentación necesito preparar para la auditoría de mi cliente?',
          },
        ],
      },
    },
  })

  // Create News
  console.log('📰 Creating news...')
  
  const auditor = await prisma.auditor.findUnique({
    where: { userId: auditorUser.id },
  })

  if (auditor) {
    await prisma.news.create({
      data: {
        authorId: auditor.id,
        title: 'Nuevas normativas de auditoría para 2025',
        slug: 'nuevas-normativas-auditoria-2025',
        content: `
          <p>Estimados partners,</p>
          <p>Les informamos sobre las nuevas normativas de auditoría que entrarán en vigor en 2025...</p>
          <ul>
            <li>Cambios en la normativa ISA</li>
            <li>Nuevos requisitos de documentación</li>
            <li>Plazos actualizados</li>
          </ul>
        `,
        excerpt: 'Información importante sobre las nuevas normativas de auditoría para 2025',
        status: 'PUBLISHED',
        featured: true,
        publishedAt: new Date(),
        category: 'Normativa',
        tags: ['normativa', 'auditoría', '2025'],
      },
    })

    await prisma.news.create({
      data: {
        authorId: auditor.id,
        title: 'Recordatorio: Plazos de cierre fiscal',
        slug: 'recordatorio-plazos-cierre-fiscal',
        content: `
          <p>Les recordamos los plazos importantes para el cierre fiscal del ejercicio 2024:</p>
          <ul>
            <li>Cierre contable: 31 de diciembre 2024</li>
            <li>Aprobación de cuentas: Antes del 30 de junio 2025</li>
            <li>Depósito de cuentas: Antes del 30 de julio 2025</li>
          </ul>
        `,
        excerpt: 'Plazos importantes para el cierre fiscal del ejercicio 2024',
        status: 'PUBLISHED',
        publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        category: 'Recordatorio',
        tags: ['plazos', 'cierre fiscal', '2024'],
      },
    })
  }

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Users created: ${await prisma.user.count()}`)
  console.log(`- Partners created: ${await prisma.partner.count()}`)
  console.log(`- Auditors created: ${await prisma.auditor.count()}`)
  console.log(`- Clients created: ${await prisma.client.count()}`)
  console.log(`- Budgets created: ${await prisma.budget.count()}`)
  console.log(`- Consultations created: ${await prisma.consultation.count()}`)
  console.log(`- News created: ${await prisma.news.count()}`)
  
  console.log('\n🔑 Test credentials:')
  console.log('Admin: admin@mindaudit.es / admin123')
  console.log('Auditor: auditor@mindaudit.es / auditor123')
  console.log('Partner 1: partner1@example.com / partner123')
  console.log('Partner 2: partner2@example.com / partner123')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
