import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { PartnerProfile } from "@/services/partner-api.service";

export const generatePartnerContractPDF = async (profile: PartnerProfile) => {
  const doc = new jsPDF({
    orientation: "p",
    unit: "mm",
    format: "a4",
  });

  const margin = 20;
  const pageWidth = doc.internal.pageSize.width;
  const contentWidth = pageWidth - margin * 2;
  let cursorY = 20;

  const today = new Date().toLocaleDateString("es-ES");
  const companyName = profile.companyName.toUpperCase();
  const addressParts = [profile.address, profile.postalCode, profile.city].filter(Boolean);
  const addressLine = addressParts.join(", ");
  const addressBlock = profile.province ? `${addressLine} (${profile.province})` : addressLine;

  // Helper functions for content layout
  const addText = (text: string, isBold: boolean = false, align: "left" | "center" | "right" = "left", indentX: number = 0, fontSize: number = 10) => {
    doc.setFont("helvetica", isBold ? "bold" : "normal");
    doc.setFontSize(fontSize);
    
    const lines = doc.splitTextToSize(text, contentWidth - indentX);
    
    // Page break handling
    if (cursorY + (lines.length * 5) > 275) {
      doc.addPage();
      cursorY = margin;
    }

    const xPos = align === "center" ? pageWidth / 2 : align === "right" ? pageWidth - margin : margin + indentX;
    doc.text(lines, xPos, cursorY, { align });
    
    // Advance Y proportionally
    cursorY += (lines.length * 5) + 3;
  };

  const addSpace = (y: number = 5) => {
    cursorY += y;
  };

  // Header
  addText("CONTRATO DE COLABORACIÓN COMERCIAL", true, "center", 0, 12);
  addSpace(5);
  addText(`En Barcelona, a ${today}`, false, "left");
  addSpace(5);
  addText("REUNIDOS", true, "center");
  addSpace(5);
  addText("De una parte,", false);
  addText("MIND AUDIT SPAIN, S.L.P., sociedad profesional inscrita en el Registro Oficial de Auditores de Cuentas, con número ROAC S2711, con domicilio social en Gran Vía Carles III nº 98 10ª Planta 08028 Barcelona , NIF B22980593, debidamente representada en este acto por D. Emilio José Silva Fernández, auditor de cuentas inscrito en el ROAC con número 23.066, en su condición de administrador único, en adelante, “MindAudit”", false);
  addSpace(2);
  addText("Y de otra parte,", false);
  
  const repName = `${profile.user.name} ${profile.primerApellido || ""} ${profile.segundoApellido || ""}`.trim().toUpperCase();
  const repDni = profile.dniParticular || "---";
  const repMandato = profile.mandato === "En representación propia" ? "su propia representación" : `su condición de ${profile.mandato || "colaborador"}`;

  addText(`${companyName}, con NIF ${profile.cif}, domicilio social en ${addressBlock}, debidamente representada en este acto por D./Dª ${repName}, con DNI ${repDni}, en ${repMandato}, en adelante, “el Colaborador”.`, false);
  addSpace(5);
  
  addText("EXPONEN", true, "center");
  addSpace(5);
  addText(`(I) Que MindAudit es una sociedad profesional autorizada para el ejercicio de la actividad de auditoría de cuentas conforme a la Ley 22/2015 de 20 de julio, de Auditoría de cuentas y su normativa de desarrollo.`, false);
  addText(`(II) Que el Colaborador es un despacho profesional dedicado a asesoramiento empresarial y consultoría.`, false);
  addText(`(III) Que ambas partes desean establecer un marco de colaboración comercial en los términos y condiciones que se detallan en el presente contrato, y en virtud de todo lo anterior,`, false);
  addSpace(5);
  
  addText("ACUERDAN", true, "center");
  addSpace(5);

  // Clauses
  addText("PRIMERA. - Naturaleza jurídica y objeto:", true);
  addText("El presente acuerdo tiene por objeto regular la colaboración comercial entre MindAudit y el Colaborador para la canalización de clientes interesados en servicios de auditoría prestados por MindAudit.");
  addText("La presente relación tiene carácter estrictamente mercantil y no constituye sociedad, agencia, franquicia, joint venture ni relación laboral alguna entre las partes. Cada parte mantiene plena autonomía jurídica, organizativa y funcional.");
  addText("MindAudit actúa como firma de auditoría independiente, inscrita en el Registro Oficial de Auditores de Cuentas, siendo la única responsable de la prestación de los servicios de auditoría, de la emisión del correspondiente informe y del cumplimiento de la normativa profesional aplicable.");
  addText("La utilización de la plataforma tecnológica de MindAudit por parte del colaborador tiene como única finalidad facilitar la gestión del flujo de información comercial y no implica integración estructural ni compartición de políticas de control de calidad, ni constituye red en el sentido previsto en la Ley 22/2015 y su normativa de desarrollo.");
  addText("En todo caso, la normativa reguladora de la actividad de auditoría prevalecerá sobre cualquier estipulación contractual, especialmente en materia de independencia, ética profesional y control de calidad.");
  addSpace(4);

  addText("SEGUNDA. - Régimen económico e incentivos de colaboración", true);
  addText("Como contraprestación por la canalización efectiva de clientes cuyo contrato principal de auditoría haya sido formalizado y el trabajo finalizado, el colaborador tendrá derecho a un incentivo económico calculado sobre los honorarios facturados por MindAudit correspondientes exclusivamente al contrato inicial de auditoría, conforme a la siguiente escala:");
  addText("•  7% hasta 18.000,00 euros", false, "left", 10);
  addText("•  9% entre 18.000,01 y 40.000,00 euros", false, "left", 10);
  addText("•  12% a partir de 40.000,01 euros", false, "left", 10);
  addText("El incentivo se calculará en el momento del devengo de la factura correspondiente al trabajo finalizado y será liquidado el 30 de septiembre de cada año o en el momento de la resolución del contrato, lo que ocurra antes.");
  addText("No generarán incentivo las sucesivas renovaciones del contrato principal ni los servicios adicionales contratados directamente por el cliente sin intervención del colaborador.");
  addText("En caso de que el volumen anual de los honorarios facturados por MindAudit a clientes remitidos por el colaborador no supere los 5.000,00 euros anuales, la compensación de incentivos se realizará mediante un bono de hasta tres horas de consultas técnicas mediante el contrato de iguala de horas de la plataforma www.mindaudit.es. Dicho bono tendrá vigencia de 1 año a contar desde el 30 de septiembre de cada año.");
  addText("Si con posterioridad al devengo los honorarios resultaran definitivamente incobrables o el contrato se resolviera por causa imputable al cliente o al colaborador, MindAudit podrá compensar o regularizar el incentivo previamente reconocido.");
  addText("Con el fin de preservar la independencia y evitar situaciones de dependencia económica, cuando el volumen de facturación derivado de un mismo colaborador supere el 25% del total de la facturación anual de MindAudit, los nuevos contratos formalizados a partir de ese momento no generarán derecho a incentivo económico. Dicha situación será comunicada al colaborador cuando el volumen de facturación sobrepase el umbral del 20% del total de la facturación anual de MindAudit.");
  addText("En ningún caso el colaborador podrá influir en la fijación de honorarios, que serán determinados exclusivamente por MindAudit conforme a criterios técnicos y de independencia profesional.");
  addSpace(4);

  addText("TERCERA. – Duración del contrato", true);
  addText("El presente contrato tendrá una duración inicial de 1 año desde la fecha de su firma.");
  addText("Transcurrido dicho plazo, se entenderá prorrogado tácitamente por períodos anuales sucesivos, salvo denuncia expresa por cualquiera de las partes comunicada por escrito con una antelación mínima de 15 días a la fecha de vencimiento.");
  addText("La vigencia del contrato no genera obligación mínima de canalización de clientes ni compromiso de volumen de actividad entre las partes.");
  addText("La extinción del contrato no implicará en ningún caso la continuidad automática de relaciones comerciales ni la generación de derecho alguno a indemnización, salvo disposición legal imperativa en contrario.");
  addSpace(4);

  addText("CUARTA. - Independencia profesional, incompatibilidades y no constitución de red", true);
  addText("MindAudit desarrollará su actividad con plena sujeción a la Ley 22/2015, de 20 de julio, al Real Decreto 2/2021 y a la normativa técnica y de control de calidad aplicable, manteniendo en todo momento su independencia profesional respecto de las entidades auditadas y de terceros.");
  addText("La relación contractual establecida entre MindAudit y el colaborador tiene naturaleza estrictamente mercantil y no constituye, en ningún caso, red en el sentido previsto en el artículo 3 de la Ley 22/2015 y en el Capítulo III del Reglamento de desarrollo aprobado por Real Decreto 2/2021. En particular, las partes manifiestan expresamente que:");
  addText("a)  No comparten costes ni beneficios relevantes.", false, "left", 10);
  addText("b)  No comparten recursos profesionales significativos.", false, "left", 10);
  addText("c)  No existe política común de control de calidad.", false, "left", 10);
  addText("d)  No existe estrategia empresarial común.", false, "left", 10);
  addText("e)  No utilizan nombre comercial común.", false, "left", 10);
  addText("f)  No existe estructura organizativa integrada.", false, "left", 10);
  addText("g)  No existe dirección común ni coordinación estratégica.", false, "left", 10);
  addText("La plataforma tecnológica de MindAudit constituye una herramienta de gestión comercial y no implica integración operativa, organizativa ni estructural. La concurrencia de cualquier circunstancia que pudiera alterar esta situación deberá ser comunicada de forma inmediata y dará lugar a la revisión del presente acuerdo.");
  addSpace(4);

  addText("QUINTA. – Declaración anual de independencia y obligaciones de información", true);
  addText("Con el fin de preservar el cumplimiento de la normativa reguladora de la actividad de auditoría de cuentas y garantizar la adecuada identificación y evaluación de amenazas a la independencia, el colaborador se obliga a suscribir anualmente una declaración formal y expresa de independencia respecto de MindAudit y de los clientes canalizados en virtud del presente acuerdo.");
  addText("El colaborador deberá comunicar de forma inmediata a MindAudit cualquier circunstancia sobrevenida que pudiera afectar a su independencia o generar amenazas a la misma, a efectos de que MindAudit pueda evaluar las salvaguardas necesarias o, en su caso, abstenerse de aceptar o continuar el encargo.");
  addText("MindAudit, por su parte, mantendrá su propio sistema de gestión de calidad conforme a la normativa aplicable y evaluará las amenazas y salvaguardas que puedan derivarse de la relación con el colaborador, documentando internamente dicha evaluación.");
  addText("La falta de suscripción de la declaración anual o la existencia de circunstancias incompatibles dará lugar a la suspensión automática de la canalización de nuevos encargos hasta su regularización, sin perjuicio de las causas de resolución previstas en el presente contrato.");
  addSpace(4);

  addText("SEXTA. – Compromiso de las partes", true);
  addText("Las partes se comprometen a desarrollar la relación de colaboración con arreglo a los principios de buena fe contractual, diligencia profesional, integridad y respeto a la normativa aplicable.");
  addText("MindAudit y el colaborador actuarán con plena autonomía organizativa, técnica y económica, sin que exista subordinación, integración estructural ni dirección común. El colaborador reconoce que la prestación de los servicios de auditoría corresponde exclusivamente a MindAudit, quien asumirá íntegramente la responsabilidad técnica del encargo.");
  addText("En este sentido, el colaborador se compromete a:");
  addText("•  Facilitar información veraz, suficiente y actualizada sobre los clientes canalizados.", false, "left", 10);
  addText("•  No retrasar injustificadamente la tramitación de propuestas ni la comunicación de respuestas del cliente.", false, "left", 10);
  addText("•  No influir directa ni indirectamente en la fijación de honorarios ni en el contenido técnico del encargo.", false, "left", 10);
  addText("•  No realizar actuaciones que puedan generar amenazas a la independencia de MindAudit.", false, "left", 10);
  addText("•  No utilizar la marca MindAudit de forma que pueda inducir a error sobre la naturaleza de la relación entre las partes.", false, "left", 10);
  addText("•  No realizar manifestaciones comerciales engañosas respecto de los servicios de auditoría.", false, "left", 10);
  addText("•  No participar en conductas que impliquen fraude, mala fe, ocultación de información relevante o actuaciones que puedan inducir a engaño.", false, "left", 10);
  addText("•  Comunicar cualquier circunstancia que pudiera generar conflicto de intereses o incompatibilidad profesional.", false, "left", 10);
  addSpace(4);

  addText("SÉPTIMA. – Causas de resolución", true);
  addText("El presente contrato podrá resolverse por cualquiera de las partes mediante comunicación escrita, sin perjuicio de las demás causas previstas en la legislación aplicable, en los siguientes supuestos:");
  addText("a)  Incumplimiento grave: Cuando afecte especialmente a la independencia profesional, la integridad en la canalización de los clientes en la plataforma, la injerencia en la actividad técnica de auditoría, el no cumplimiento de las obligaciones de deber de información o la utilización indebida de la marca MindAudit.", false, "left", 10);
  addText("b)  Conductas contrarias a la buena fe e integridad profesional.", false, "left", 10);
  addText("c)  Incompatibilidades o amenazas no mitigables.", false, "left", 10);
  addText("d)  Dependencia económica estructural. En este sentido, se entenderá que existe una relación de dependencia económica entre el colaborador y MindAudit cuando la facturación derivada de la colaboración con un mismo colaborador supere el 25% del total de la facturación de MindAudit.", false, "left", 10);
  addText("e)  Inactividad prolongada, entendida como la ausencia de uso de la plataforma bien sea por la inexistencia de solicitudes de encargos o bien por la no contratación de los servicios de consultas ofrecidos en la plataforma.", false, "left", 10);
  addText("f)  Incumplimiento de la declaración anual de independencia.", false, "left", 10);
  addSpace(4);

  addText("OCTAVA. – Efectos de la resolución", true);
  addText("La resolución del presente contrato, por cualquier causa, producirá efectos desde la fecha de notificación escrita o desde la fecha acordada entre las partes.");
  addText("a) Encargos en curso", true, "left", 10);
  addText("La resolución no afectará a los contratos de auditoría ya formalizados entre MindAudit y los clientes, los cuales continuarán ejecutándose conforme a la normativa reguladora de la actividad de auditoría y a los términos contractuales suscritos con cada cliente. En ningún caso la resolución del presente acuerdo facultará al colaborador para intervenir en la continuidad, renovación o terminación de dichos encargos.", false, "left", 10);
  addText("b) Derechos económicos", true, "left", 10);
  addText("El colaborador conservará exclusivamente el derecho a los incentivos ya devengados conforme a la cláusula segunda, sin perjuicio de las regularizaciones que pudieran proceder en caso de incobrabilidad u otras circunstancias previstas contractualmente. No se generará derecho alguno respecto de: prórrogas o renovaciones de contratos, nuevos servicios contratados con posterioridad a la resolución, otros clientes operados por el colaborador que contraten directamente con MindAudit sin intervención posterior del colaborador.", false, "left", 10);
  addText("c) Cese de uso de marca y referencias", true, "left", 10);
  addText("Desde la fecha de resolución, el colaborador deberá cesar inmediatamente cualquier uso de la denominación MindAudit en soportes comerciales, digitales o documentales, salvo autorización expresa y por escrito.", false, "left", 10);
  addSpace(4);

  addText("NOVENA. – Confidencialidad y protección de datos", true);
  addText("Las partes se obligan a mantener la más estricta confidencialidad respecto de toda información, documentación, datos o antecedentes a los que tengan acceso con ocasión de la presente relación contractual, cualquiera que sea su soporte o formato. El deber de confidencialidad subsistirá con carácter indefinido, incluso tras la finalización del contrato.");
  addText("El deber de secreto profesional de MindAudit se regirá por lo dispuesto en la Ley 22/2015 y su normativa de desarrollo, prevaleciendo en todo caso dicha normativa sobre lo previsto en el presente contrato.");
  addText("Las partes se comprometen a cumplir íntegramente el Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica 3/2018 y demás normativa aplicable en materia de protección de datos personales.");
  addText("Cada parte actuará como responsable independiente del tratamiento respecto de los datos personales que trate en el ámbito de su propia actividad profesional.");
  addText("El colaborador únicamente podrá comunicar a MindAudit los datos estrictamente necesarios para la elaboración de la propuesta de servicios, garantizando que dispone de base jurídica suficiente para dicha comunicación.");
  addText("MindAudit tratará los datos personales recibidos exclusivamente para:");
  addText("a)  La elaboración de propuestas.", false, "left", 10);
  addText("b)  La evaluación de independencia.", false, "left", 10);
  addText("c)  La formalización y ejecución del encargo de auditoría.", false, "left", 10);
  addSpace(4);

  addText("DÉCIMA. – Normativa aplicable y jurisdicción", true);
  addText("El presente contrato tiene naturaleza mercantil y se regirá e interpretará conforme al Derecho español.");
  addText("En todo lo no expresamente previsto en el mismo, será de aplicación la normativa civil y mercantil vigente, sin perjuicio de la prevalencia de la Ley 22/2015, de 20 de julio, de Auditoría de Cuentas, su Reglamento de desarrollo aprobado por Real Decreto 2/2021 y demás normativa reguladora de la actividad de auditoría de cuentas, en cuanto resulte aplicable.");
  addText("Las partes acuerdan que cualquier controversia, discrepancia o reclamación que pudiera derivarse de la interpretación, ejecución o resolución del presente contrato será sometida a los Juzgados y Tribunales de la ciudad de Tarragona, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.");
  addSpace(5);
  
  addText("Y en prueba de conformidad, ambas partes firman el presente contrato, por duplicado y a un solo efecto, en el lugar y fecha indicados a continuación.", false, "center");
  addSpace(5);
  addText(`En Barcelona a ${today}`, false, "left", 0);

  // Signatures Section
  // Check if we need a page break before signatures
  if (cursorY > 230) {
    doc.addPage();
    cursorY = margin + 10;
  } else {
    cursorY += 10;
  }

  // Load CEO signature Image if available
  try {
    const signatureUrl = "/images/ceo-signature.png";
    const img = new Image();
    img.src = signatureUrl;
    await new Promise((resolve) => {
      img.onload = resolve;
      img.onerror = resolve;
    });
    
    if (img.width > 0) {
      doc.addImage(img, "PNG", margin, cursorY + 5, 40, 20); 
    }
  } catch (e) {
    console.warn("Could not load CEO signature image", e);
  }

  cursorY += 30;
  
  // Left side: MindAudit
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(10, 58, 107);
  doc.text("FIRMADO POR: MIND AUDIT SPAIN, S.L.P.", margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.text("D. Emilio José Silva Fernández", margin, cursorY + 5);

  // Right side: Colaborador
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);
  doc.text("Firma: ________________________", pageWidth / 2, cursorY - 5);
  
  doc.setFont("helvetica", "bold");
  doc.text(`FIRMADO POR: ${profile.companyName.toUpperCase()}`, pageWidth / 2, cursorY, { maxWidth: contentWidth / 2 });
  doc.setFont("helvetica", "normal");
  doc.text(`D./Dª. ${profile.user.name.toUpperCase()}`, pageWidth / 2, cursorY + 5);

  const filename = `Contrato_Partner_MindAudit_${profile.companyName.replace(/\s+/g, '_')}.pdf`;
  doc.save(filename);
  return doc.output("blob");
};
