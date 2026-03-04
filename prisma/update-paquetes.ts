import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Updating Iguala plans...');

  // Deactivate all existing packages (preserves FK references from CompraHoras)
  await prisma.paqueteHoras.updateMany({ data: { activo: false } });
  console.log('Deactivated existing packages.');

  const plans = [
    {
      nombre: 'Iguala Básica',
      descripcion: 'Perfecta para consultas ocasionales',
      horas: 3,
      precio: 360.00,
      descuento: null as number | null,
      destacado: false,
      activo: true,
      orden: 1,
    },
    {
      nombre: 'Iguala Standard',
      descripcion: 'Para estar siempre cubierto – Ahorra un 5%',
      horas: 8,
      precio: 960.00,
      descuento: 5,
      destacado: true,
      activo: true,
      orden: 2,
    },
    {
      nombre: 'Iguala Premium',
      descripcion: 'Para los despachos más exigentes',
      horas: 20,
      precio: 2400.00,
      descuento: 10,
      destacado: false,
      activo: true,
      orden: 3,
    },
  ];

  for (const plan of plans) {
    const existing = await prisma.paqueteHoras.findFirst({ where: { nombre: plan.nombre } });
    if (existing) {
      await prisma.paqueteHoras.update({ where: { id: existing.id }, data: plan });
      console.log(`Updated: ${plan.nombre}`);
    } else {
      await prisma.paqueteHoras.create({ data: plan });
      console.log(`Created: ${plan.nombre}`);
    }
  }

  console.log('All Iguala plans updated successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
