import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Actualizando paquetes de horas...");

  // Desactivar paquetes antiguos
  await prisma.paqueteHoras.updateMany({
    where: { activo: true },
    data: { activo: false },
  });

  const nuevosPaquetes = [
    {
      nombre: "Plan Premium",
      descripcion: "Para despachos con consultas recurrentes y constantes (aprox. 25 horas/mes)",
      horas: 25,
      precio: 1199,
      destacado: false,
      orden: 1,
      activo: true,
    },
    {
      nombre: "Plan Profesional",
      descripcion: "Ideal para un flujo regular de consultas técnicas",
      horas: 10,
      precio: 699,
      destacado: true, // Más popular
      orden: 2,
      activo: true,
    },
    {
      nombre: "Plan Estándar",
      descripcion: "Perfecto para consultas puntuales y seguimiento",
      horas: 5,
      precio: 399,
      destacado: false,
      orden: 3,
      activo: true,
    },
    {
      nombre: "Consulta Única",
      descripcion: "Acceso inmediato para una consulta específica",
      horas: 1,
      precio: 89,
      destacado: false,
      orden: 4,
      activo: true,
    },
  ];

  for (const paquete of nuevosPaquetes) {
    await prisma.paqueteHoras.create({
      data: paquete,
    });
    console.log(`Paquete creado: ${paquete.nombre}`);
  }

  console.log("Paquetes actualizados exitosamente.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
