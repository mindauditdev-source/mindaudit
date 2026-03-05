import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { PartnerProfile } from "@/services/partner-api.service";

export const generatePartnerContractPDF = (profile: PartnerProfile) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  let cursorY = 20;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(10, 58, 107); // #0a3a6b
  doc.text("CONTRATO DE COLABORACIÓN COMERCIAL", pageWidth / 2, cursorY, { align: "center" });
  
  cursorY += 10;
  doc.setFontSize(10);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(100, 100, 100);
  const today = new Date().toLocaleDateString("es-ES");
  doc.text(`En Barcelona, a ${today}`, pageWidth - margin, cursorY, { align: "right" });

  cursorY += 15;
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 0, 0);
  doc.text("REUNIDOS", margin, cursorY);
  
  cursorY += 7;
  doc.setFont("helvetica", "normal");
  const reunitText = `De una parte, MIND AUDIT SPAIN, S.L.P., con NIF B22980593 y domicilio en Gran Vía Carles III nº 98 10ª Planta 08028 Barcelona, representada por D. Emilio José Silva Fernández.\n\nY de otra parte, ${profile.companyName.toUpperCase()}, con CIF ${profile.cif} y domicilio en ${profile.address || ""}, ${profile.postalCode || ""} ${profile.city || ""} (${profile.province || ""}), representada por ${profile.user.name.toUpperCase()}.`;
  
  const splitReunit = doc.splitTextToSize(reunitText, pageWidth - (margin * 2));
  doc.text(splitReunit, margin, cursorY);
  cursorY += (splitReunit.length * 5) + 5;

  doc.setFont("helvetica", "bold");
  doc.text("EXPONEN", margin, cursorY);
  cursorY += 7;
  doc.setFont("helvetica", "normal");
  const exponenText = `(I) Que MindAudit® es una sociedad profesional autorizada para el ejercicio de la actividad de auditoría.\n(II) Que el Colaborador es un despacho profesional dedicado al asesoramiento.\n(III) Que ambas partes desean establecer un marco de colaboración mercantil.`;
  doc.text(exponenText, margin, cursorY);
  cursorY += 20;

  doc.setFont("helvetica", "bold");
  doc.text("ACUERDAN", margin, cursorY);
  cursorY += 7;

  const clauses = [
    "PRIMERA. - Naturaleza jurídica y objeto: El presente acuerdo tiene por objeto regular la colaboración comercial entre MindAudit y el Colaborador para la canalización de clientes interesados en servicios de auditoría prestados por MindAudit. La presente relación tiene carácter estrictamente mercantil y no constituye sociedad, agencia, franquicia, joint venture ni relación laboral alguna entre las partes. Cada parte mantiene plena autonomía jurídica, organizativa y funcional. MindAudit actúa como firma de auditoría independiente, siendo la única responsable de la prestación de los servicios de auditoría, de la emisión del informe y del cumplimiento de la normativa profesional aplicable. La utilización de la plataforma tecnológica de MindAudit tiene como única finalidad facilitar la gestión del flujo de información comercial y no implica integración estructural ni constituye red en el sentido previsto en la Ley 22/2015. En todo caso, la normativa reguladora de la actividad de auditoría prevalecerá sobre cualquier estipulación contractual.",
    "SEGUNDA. - Régimen económico e incentivos de colaboración: Como contraprestación por la canalización efectiva de clientes cuyo contrato principal de auditoría haya sido formalizado y el trabajo finalizado, el colaborador tendrá derecho a un incentivo económico calculado sobre los honorarios facturados por MindAudit correspondientes exclusivamente al contrato inicial de auditoría: 9% hasta 18.000€, 12% entre 18.000€ y 40.000€, 15% a partir de 40.000€. El incentivo se liquidará el 30 de septiembre de cada año. No generarán incentivo las sucesivas renovaciones ni servicios adicionales directos. En caso de honorarios inferiores a 5.000€ o 2.000€ al año, el incentivo se compensará con bonos de horas de consulta técnica. MindAudit se reserva el derecho de regularizar incentivos si los honorarios resultan incobrables. Si la facturación derivada de un colaborador supera el 25% del total de MindAudit, los nuevos contratos no generarán incentivo para preservar la independencia.",
    "TERCERA. - Duración del contrato: El presente contrato tendrá una duración inicial de 1 año desde la fecha de su firma, prorrogable tácitamente por períodos anuales sucesivos, salvo denuncia expresa con 15 días de antelación. La extinción no genera derecho a indemnización.",
    "CUARTA. - Independencia profesional, incompatibilidades y no constitución de red: MindAudit desarrollará su actividad con plena sujeción a la Ley 22/2015, manteniendo su independencia. La relación es estrictamente mercantil y no constituye red. Las partes no comparten costes, beneficios, recursos ni políticas de control de calidad comunes.",
    "QUINTA. - Declaración anual de independencia: El colaborador se obliga a suscribir anualmente una declaración formal de independencia. Cualquier circunstancia que afecte a la misma deberá ser comunicada de inmediato para evaluar salvaguardas.",
    "SEXTA. - Compromiso de las partes: Las partes actuarán bajo principios de buena fe y diligencia. El colaborador se compromete a facilitar información veraz, no influir en honorarios, no realizar actos que amenacen la independencia y no utilizar la marca MindAudit de forma engañosa.",
    "SÉPTIMA. - Causas de resolución: Incumplimiento grave de independencia o integridad, conductas contrarias a la buena fe, incompatibilidades, dependencia económica (>25%) o inactividad prolongada en la plataforma.",
    "OCTAVA. - Efectos de la resolución: La resolución no afectará a los encargos en curso, que continuarán según la normativa. El colaborador conservará el derecho a incentivos ya devengados, pero no a renovaciones o nuevos servicios tras la resolución.",
    "NOVENA. - Confidencialidad y protección de datos: Deber de secreto profesional indefinido. Cumplimiento íntegro del RGPD (UE) 2016/679. Cada parte actúa como responsable independiente del tratamiento de los datos personales.",
    "DÉCIMA. - Normativa aplicable y jurisdicción: El contrato se rige por Derecho español, con prevalencia de la Ley 22/2015 de Auditoría. Cualquier controversia será sometida a los Juzgados y Tribunales de la ciudad de Tarragona."
  ];

  clauses.forEach(clause => {
    const splitText = doc.splitTextToSize(clause, pageWidth - (margin * 2));
    if (cursorY + (splitText.length * 5) > 270) {
      doc.addPage();
      cursorY = margin;
    }
    doc.setFont("helvetica", "normal");
    doc.text(splitText, margin, cursorY);
    cursorY += (splitText.length * 5) + 5;
  });

  cursorY += 10;
  doc.setFont("helvetica", "italic");
  doc.setFontSize(8);
  doc.text("Este documento es una copia generada para su firma física y posterior carga en la plataforma MindAudit®.", margin, cursorY);

  cursorY += 20;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`FIRMADO POR: ${profile.companyName.toUpperCase()}`, margin, cursorY);
  
  cursorY += 20;
  doc.setFont("helvetica", "normal");
  doc.text("Firma: ________________________", margin, cursorY);

  const filename = `Contrato_Partner_MindAudit_${profile.companyName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return doc.output("blob");
};
