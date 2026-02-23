"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AdminColaborador } from "@/services/admin-api.service";
import { FileText, Download } from "lucide-react";
import { jsPDF } from "jspdf";

interface ContractViewerModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  colaborador: AdminColaborador | null;
}

export function ContractViewerModal({ isOpen, onOpenChange, colaborador }: ContractViewerModalProps) {
  if (!colaborador) return null;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const date = colaborador.contractSignedAt ? new Date(colaborador.contractSignedAt).toLocaleDateString() : new Date().toLocaleDateString();
    
    // Header
    doc.setFontSize(18);
    doc.setTextColor(10, 58, 107); // #0a3a6b
    doc.text("CONTRATO DE COLABORACIÓN COMERCIAL", 105, 20, { align: "center" });
    
    doc.setFontSize(10);
    doc.setTextColor(100);
    doc.text(`En Barcelona, a ${date}`, 190, 30, { align: "right" });
    
    // Body
    doc.setTextColor(0);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("REUNIDOS", 20, 45);
    
    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const textReunidosMind = `De una parte, MIND AUDIT SPAIN, S.L.P., sociedad profesional inscrita en el Registro Oficial de Auditores de Cuentas (ROAC) S2711, con domicilio en Gran Vía Carles III nº 98 10ª Planta 08028 Barcelona, NIF B22980593, representada por D. Emilio José Silva Fernández.`;
    const addressStr = colaborador.address ? `${colaborador.address}, ${colaborador.postalCode || ""} ${colaborador.city || ""} (${colaborador.province || ""})` : "---";
    const textReunidosColab = `Y de otra parte, el COLABORADOR: ${colaborador.companyName}, con CIF ${colaborador.cif}, domicilio en ${addressStr}, representado por ${colaborador.user.name}.`;
    
    let currentY = 52;
    const splitReunidos1 = doc.splitTextToSize(textReunidosMind, 170);
    doc.text(splitReunidos1, 20, currentY);
    currentY += (splitReunidos1.length * 5) + 2;
    
    const splitReunidos2 = doc.splitTextToSize(textReunidosColab, 170);
    doc.text(splitReunidos2, 20, currentY);
    currentY += (splitReunidos2.length * 5) + 8;
    
    doc.setFont("helvetica", "bold");
    doc.text("ACUERDAN", 20, currentY);
    currentY += 7;
    
    doc.setFont("helvetica", "normal");
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
      const splitClause = doc.splitTextToSize(clause, 170);
      if (currentY + (splitClause.length * 5) > 280) {
        doc.addPage();
        currentY = 20;
      }
      doc.text(splitClause, 20, currentY);
      currentY += (splitClause.length * 5) + 3;
    });
    
    // Signatures
    if (currentY + 40 > 280) {
      doc.addPage();
      currentY = 20;
    }
    
    doc.line(20, currentY + 20, 90, currentY + 20);
    doc.line(120, currentY + 20, 190, currentY + 20);
    
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text("Por MindAudit Spain, S.L.P.", 20, currentY + 25);
    doc.text("Emilio José Silva Fernández", 20, currentY + 30);
    
    doc.text("Por el Colaborador", 120, currentY + 25);
    doc.text(colaborador.user.name, 120, currentY + 30);
    
    if (colaborador.contractUrl) {
      try {
        doc.addImage(colaborador.contractUrl, 'PNG', 120, currentY + 35, 40, 15);
      } catch (e) {
        console.error("Could not add signature image to PDF", e);
      }
    }
    
    doc.save(`Contrato_${colaborador.companyName.replace(/\s+/g, '_')}.pdf`);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] rounded-3xl max-h-[90vh] flex flex-col p-0 overflow-hidden border-none shadow-2xl">
        <div className="p-8 bg-[#0a3a6b] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/10 rounded-2xl border border-white/20">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-black tracking-tight">Contrato Digital</h2>
                <p className="text-blue-100 text-sm font-medium">Documento oficial de colaboración</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleDownloadPDF}
                className="text-white hover:bg-white/10 rounded-xl"
              >
                <Download className="h-4 w-4 mr-2" />
                Descargar PDF
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-10 py-8 bg-white custom-scrollbar text-sm">
          <div className="prose prose-slate max-w-none space-y-8 text-slate-700 leading-relaxed">
            <h2 className="text-xl font-black text-center text-slate-900 border-b pb-4 uppercase tracking-tighter">CONTRATO DE COLABORACIÓN COMERCIAL</h2>

            <p className="text-right italic font-bold text-slate-400">
              Barcelona, a {colaborador.contractSignedAt ? new Date(colaborador.contractSignedAt).toLocaleDateString() : '---'}
            </p>

            <section>
              <h3 className="text-lg font-black text-slate-900 mb-3 border-b-2 border-slate-900 inline-block pb-1">REUNIDOS</h3>
              <div className="space-y-4">
                <p>
                  De una parte, <span className="font-bold uppercase">MIND AUDIT SPAIN, S.L.P.</span>, sociedad profesional (ROAC S2711), con domicilio en Barcelona, representada por D. Emilio José Silva Fernández.
                </p>
                <p>
                  Y de otra parte, el <span className="font-bold uppercase">COLABORADOR</span>, cuyos datos son:
                </p>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 grid grid-cols-2 gap-6">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Razón Social</span>
                    <span className="font-black text-slate-900">{colaborador.companyName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">NIF / CIF</span>
                    <span className="font-black text-slate-900">{colaborador.cif}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Domicilio Social</span>
                    <span className="font-black text-slate-900">
                      {colaborador.address ? `${colaborador.address}, ${colaborador.postalCode || ""} ${colaborador.city || ""} (${colaborador.province || ""})` : "---"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Representante</span>
                    <span className="font-black text-slate-900">{colaborador.user.name}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Email</span>
                    <span className="font-black text-slate-900">{colaborador.user.email}</span>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-black text-slate-900 mb-3 border-b-2 border-slate-900 inline-block pb-1">EXPONEN</h3>
              <div className="space-y-4">
                <p>(I) Que MindAudit es una sociedad profesional autorizada para el ejercicio de la actividad de auditoría de cuentas conforme a la Ley 22/2015 de 20 de julio, de Auditoría de cuentas y su normativa de desarrollo.</p>
                <p>(II) Que el Colaborador es un despacho profesional dedicado al asesoramiento profesional.</p>
                <p>(III) Que ambas partes desean establecer un marco de colaboración comercial en los términos y condiciones que se detallan en el presente contrato, y en virtud de todo lo anterior,</p>
              </div>
            </section>

            <section>
              <h3 className="text-lg font-black text-slate-900 mb-4 border-b-2 border-slate-900 inline-block pb-1">ACUERDAN</h3>
              <div className="space-y-6">
                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">PRIMERA. - Naturaleza jurídica y objeto:</p>
                  <p>El presente acuerdo tiene por objeto regular la colaboración comercial entre MindAudit y el Colaborador para la canalización de clientes interesados en servicios de auditoría prestados por MindAudit.</p>
                  <p>La presente relación tiene carácter estrictamente mercantil y no constituye sociedad, agencia, franquicia, joint venture ni relación laboral alguna entre las partes. Cada parte mantiene plena autonomía jurídica, organizativa y funcional.</p>
                  <p>MindAudit actúa como firma de auditoría independiente, inscrita en el Registro Oficial de Auditores de Cuentas, siendo la única responsable de la prestación de los servicios de auditoría, de la emisión del correspondiente informe y del cumplimiento de la normativa profesional aplicable.</p>
                  <p>La utilización de la plataforma tecnológica de MindAudit por parte del colaborador tiene como única finalidad facilitar la gestión del flujo de información comercial y no implica integración estructural ni compartición de políticas de control de calidad, ni constituye red en el sentido previsto en la Ley 22/2015 y su normativa de desarrollo.</p>
                  <p>En todo caso, la normativa reguladora de la actividad de auditoría prevalecerá sobre cualquier estipulación contractual, especialmente en materia de independencia, ética profesional y control de calidad.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">SEGUNDA. - Régimen económico e incentivos de colaboración</p>
                  <p>Como contraprestación por la canalización efectiva de clientes cuyo contrato principal de auditoría haya sido formalizado y el trabajo finalizado, el colaborador tendrá derecho a un incentivo económico calculado sobre los honorarios facturados por MindAudit correspondientes exclusivamente al contrato inicial de auditoría, conforme a la siguiente escala:</p>
                  <ul className="list-disc pl-5 font-bold text-blue-900 bg-blue-50/50 p-4 rounded-xl border border-blue-100 my-4 text-xs">
                    <li>9% hasta 18.000,00 euros</li>
                    <li>12% entre 18.000,01 y 40.000,00 euros</li>
                    <li>15% a partir de 40.000,01 euros</li>
                  </ul>
                  <p>El incentivo se calculará en el momento del devengo de la factura correspondiente al trabajo finalizado y será liquidado el 30 de septiembre de cada año o en el momento de la resolución del contrato, lo que ocurra antes.</p>
                  <p>No generarán incentivo las sucesivas renovaciones del contrato principal ni los servicios adicionales contratados directamente por el cliente sin intervención del colaborador.</p>
                  <p>En caso de que el volumen anual de los honorarios devengados no supere los 5.000 euros anuales, la compensación de incentivos se realizará mediante un bono de hasta cinco horas de consultas técnicas mediante el contrato de iguala de horas de la plataforma www.mindaudit.es. Dicho bono tendrá vigencia de 1 año a contar desde el 30 de septiembre de cada año. En el caso que el importe anual de los honorarios devengados no supere los 2.000 euros, la compensación de incentivos se realizará mediante un bono de 1 hora de consultas en contrato de iguala anteriormente mencionado.</p>
                  <p>Si con posterioridad al devengo los honorarios resultaran definitivamente incobrables o el contrato se resolviera por causa imputable al cliente o al colaborador, MindAudit podrá compensar o regularizar el incentivo previamente reconocido.</p>
                  <p>Con el fin de preservar la independencia y evitar situaciones de dependencia económica, cuando el volumen de facturación derivado de un mismo colaborador supere el 25% del total de la facturación anual de MindAudit, los nuevos contratos formalizados a partir de ese momento no generarán derecho a incentivo económico. Dicha situación será comunicada al colaborador cuando el volumen de facturación sobrepase el umbral del 20% del total de la facturación anual de MindAudit.</p>
                  <p>En ningún caso el colaborador podrá influir en la fijación de honorarios, que serán determinados exclusivamente por MindAudit conforme a criterios técnicos y de independencia profesional.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">TERCERA. – Duración del contrato:</p>
                  <p>El presente contrato tendrá una duración inicial de 1 año desde la fecha de su firma.</p>
                  <p>Transcurrido dicho plazo, se entenderá prorrogado tácitamente por períodos anuales sucesivos, salvo denuncia expresa por cualquiera de las partes comunicada por escrito con una antelación mínima de 15 días a la fecha de vencimiento.</p>
                  <p>La vigencia del contrato no genera obligación mínima de canalización de clientes ni compromiso de volumen de actividad entre las partes.</p>
                  <p>La extinción del contrato no implicará en ningún caso la continuidad automática de relaciones comerciales ni la generación de derecho alguno a indemnización, salvo disposición legal imperativa en contrario.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">CUARTA. - Independencia profesional, incompatibilidades y no constitución de red:</p>
                  <p>MindAudit desarrollará su actividad con plena sujeción a la Ley 22/2015, de 20 de julio, al Real Decreto 2/2021 y a la normativa técnica y de control de calidad aplicable, manteniendo en todo momento su independencia profesional respecto de las entidades auditadas y de terceros.</p>
                  <p>La relación contractual establecida entre MindAudit y el colaborador tiene naturaleza estrictamente mercantil y no constituye, en ningún caso, red. En particular, las partes manifiestan expresamente que:</p>
                  <ul className="list-[lower-alpha] pl-8 space-y-1 text-xs my-2">
                    <li>No comparten costes ni beneficios relevantes.</li>
                    <li>No comparten recursos profesionales significativos.</li>
                    <li>No existe política común de control de calidad.</li>
                    <li>No existe estrategia empresarial común.</li>
                    <li>No utilizan nombre comercial común.</li>
                    <li>No existe estructura organizativa integrada.</li>
                    <li>No existe dirección común ni coordinación estratégica.</li>
                  </ul>
                  <p>La plataforma tecnológica de MindAudit constituye una herramienta de gestión comercial y no implica integración operativa, organizativa ni estructural.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">QUINTA. – Declaración anual de independencia:</p>
                  <p>Con el fin de preservar el cumplimiento de la normativa reguladora de la actividad de auditoría de cuentas y garantizar la adecuada identificación y evaluación de amenazas a la independencia, el colaborador se obliga a suscribir anualmente una declaración formal y expresa de independencia respecto de MindAudit y de los clientes canalizados en virtud del presente acuerdo.</p>
                  <p>El colaborador deberá comunicar de forma inmediata a MindAudit cualquier circunstancia sobrevenida que pudiera afectar de forma adversa a su independencia.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">SEXTA. – Compromiso de las partes:</p>
                  <p>Las partes se comprometen a desarrollar la relación de colaboración con arreglo a los principios de buena fe contractual, diligencia profesional, integridad y respeto a la normativa aplicable.</p>
                  <p>El colaborador se compromete a: facilitar información veraz, no retrasar injustificadamente la tramitación de propuestas, no influir en la fijación de honorarios, no realizar actuaciones que puedan generar amenazas a la independencia, no utilizar la marca MindAudit de forma engañosa, no participar en conductas que impliquen fraude y comunicar cualquier conflicto de intereses.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">SÉPTIMA. – Causas de resolución:</p>
                  <p>El presente contrato podrá resolverse por: incumplimiento grave, conductas contrarias a la buena fe, incompatibilidades o amenazas no mitigables, dependencia económica estructural (&gt;25% de la facturación), inactividad prolongada o incumplimiento de la declaración anual de independencia.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">OCTAVA. – Efectos de la resolución:</p>
                  <p>La resolución no afectará a los contratos de auditoría ya formalizados entre MindAudit y los clientes, los cuales continuarán ejecutándose conforme a la normativa reguladora.</p>
                  <p>El colaborador conservará exclusivamente el derecho a los incentivos ya devengados conforme a la cláusula segunda.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">NOVENA. – Confidencialidad y protección de datos:</p>
                  <p>Las partes se obligan a mantener la más estricta confidencialidad respecto de toda información a la que tengan acceso. El deber de confidencialidad subsistirá con carácter indefinido.</p>
                  <p>Las partes se comprometen a cumplir íntegramente el Reglamento (UE) 2016/679 (RGPD), la Ley Orgánica 3/2018 y demás normativa aplicable.</p>
                </div>

                <div>
                  <p className="font-bold text-slate-900 underline mb-2 tracking-tight">DÉCIMA. – Normativa aplicable y jurisdicción:</p>
                  <p>El presente contrato tiene naturaleza mercantil y se regirá e interpretará conforme al Derecho español.</p>
                  <p>Las partes acuerdan que cualquier controversia, discrepancia o reclamación que pudiera derivarse de la interpretación, ejecución o resolución del presente contrato será sometida a los Juzgados y Tribunales de la ciudad de <strong>Tarragona</strong>.</p>
                </div>
              </div>
            </section>

            <div className="mt-16 pt-12 border-t border-slate-100">
              <div className="grid grid-cols-2 gap-12">
                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">Por MindAudit Spain, S.L.P.:</p>
                  <div className="h-32 flex flex-col items-center justify-center bg-slate-50/50 rounded-3xl border-2 border-dashed border-slate-100">
                    <span className="text-slate-300 italic text-xs mb-1">Firmado Digitalmente</span>
                    <span className="font-black text-[#0a3a6b]">Emilio José Silva Fernández</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest text-center">Por el Colaborador:</p>
                  <div className="h-32 flex items-center justify-center bg-emerald-50/30 rounded-3xl border-2 border-emerald-100 overflow-hidden relative">
                    {colaborador.contractUrl ? (
                      <img src={colaborador.contractUrl} alt="Firma del partner" className="h-[80%] object-contain mix-blend-multiply transition-transform hover:scale-110 duration-500" />
                    ) : (
                      <span className="text-amber-500 font-bold italic text-sm">Pendiente de firma</span>
                    )}
                    {colaborador.contractSignedAt && (
                      <div className="absolute top-2 right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg">
                        <FileText className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <p className="text-center text-[10px] font-bold text-slate-400 italic">
                    {colaborador.contractSignedAt ? `Firmado el ${new Date(colaborador.contractSignedAt).toLocaleString()}` : 'Aún no firmado'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <p className="text-xs text-slate-400 font-medium">Este documento tiene validez legal como acuerdo de colaboración mercantil.</p>
          <Button onClick={() => onOpenChange(false)} className="rounded-xl font-bold bg-[#0a3a6b] hover:bg-slate-900 text-white shadow-lg shadow-blue-900/10">
            Cerrar Visor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
