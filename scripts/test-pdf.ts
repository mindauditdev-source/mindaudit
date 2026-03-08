import { PDFDocument, rgb } from "pdf-lib";
import * as fs from "fs";
import * as path from "path";

async function run() {
  const templatePath = path.join(process.cwd(), "public/contrato_template.pdf");
  const existingPdfBytes = fs.readFileSync(templatePath);

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const lastPage = pages[pages.length - 1];

  const font = await pdfDoc.embedFont("Helvetica");
  const boldFont = await pdfDoc.embedFont("Helvetica-Bold");

  const today = "07/03/2026";
  const companyName = "EMPRESA DE PRUEBA S.L.";
  const representativeName = "JESUS HURTADO";
  const addressBlock = "Calle Falsa 123, 08001 Barcelona (Barcelona)";
  const cif = "B12345678";

  // Coordinates from our file (adjusted based on user feedback)
  // Date is at top right: "En Barcelona, a _______________"
  firstPage.drawText(today, { x: 425, y: 708, size: 10, font });
  
  // "Y de otra parte," paragraph starts around y: 565
  // We need to place:
  // 1. Company Name (after "Y de otra parte, ") -> ~x: 130, y: 540
  // 2. CIF (after "con NIF ") -> ~x: 140, y: 525 
  // 3. Address (after "domicilio social en ") -> ~x: 230, y: 525
  // 4. Representative (after "D./Dª ") -> ~x: 430, y: 525
  
  firstPage.drawText(companyName, { x: 130, y: 540, size: 10, font: boldFont, color: rgb(0, 0, 0) });
  firstPage.drawText(cif, { x: 140, y: 525, size: 10, font: boldFont });
  firstPage.drawText(addressBlock, { x: 230, y: 525, size: 9, font });
  firstPage.drawText(representativeName, { x: 430, y: 525, size: 10, font: boldFont });

  // Signature on the last page at bottom
  lastPage.drawText(companyName, { x: 300, y: 200, size: 10, font: boldFont });

  const pdfBytes = await pdfDoc.save();
  fs.writeFileSync(path.join(process.cwd(), "test_output.pdf"), pdfBytes);
  console.log("PDF generated at test_output.pdf");
}

run().catch(console.error);
