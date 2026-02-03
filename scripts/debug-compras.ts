import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const compras = await prisma.compraHoras.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      paquete: true,
      colaborador: {
        select: {
          email: true,
          horasDisponibles: true
        }
      }
    }
  });

  console.log("Recent Purchases:");
  compras.forEach(c => {
    console.log(`- ID: ${c.id}`);
    console.log(`  Status: ${c.status}`);
    console.log(`  Horas: ${c.horas}`);
    console.log(`  User: ${c.colaborador.email}`);
    console.log(`  Current User Horas: ${c.colaborador.horasDisponibles}`);
    console.log(`  SessionID: ${c.stripeSessionId}`);
    console.log(`  Metadata Tipo (from DB lookup if available): ${c.paquete.nombre}`);
    console.log("-------------------");
  });
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
