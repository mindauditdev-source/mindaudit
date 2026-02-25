"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PartnerApiService, PartnerProfile } from "@/services/partner-api.service";
import { toast } from "sonner";
import { CheckCircle2, ChevronLeft, FileText, PenTool } from "lucide-react";
import Link from "next/link";
import { SignaturePad } from "@/components/partner/SignaturePad";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export default function SignContractPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [signed, setSigned] = useState(false);
  const [signatureData, setSignatureData] = useState<string | null>(null);
  const [profile, setProfile] = useState<PartnerProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await PartnerApiService.getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast.error("Error al cargar datos del perfil");
      } finally {
        setLoadingProfile(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSign = async () => {
    if (!signatureData) {
      toast.error("Por favor, estampa tu firma en el recuadro");
      return;
    }

    setLoading(true);
    try {
      await PartnerApiService.signContract(signatureData);
      setSigned(true);
      toast.success("¡Contrato firmado con éxito!");
      setTimeout(() => router.push("/partner/dashboard"), 2000);
    } catch (error) {
      console.error("Error signing contract:", error);
      toast.error("Error al procesar la firma");
    } finally {
      setLoading(false);
    }
  };

  if (signed) {
    return (
      <div className="container max-w-2xl mx-auto py-20 px-4">
        <Card className="text-center p-8 space-y-6">
          <div className="flex justify-center">
            <div className="bg-green-100 p-4 rounded-full">
              <CheckCircle2 className="h-16 w-16 text-green-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-slate-900">¡Contrato Firmado!</h1>
          <p className="text-slate-600 text-lg">
            Gracias por unirte oficialmente al equipo de <strong>MindAudit Spain</strong>. 
            Tus beneficios como Partner han sido activados.
          </p>
          <p className="text-sm text-slate-400">
            Redirigiendo a tu dashboard en unos segundos...
          </p>
          <Button asChild className="w-full bg-[#0a3a6b]">
            <Link href="/partner/dashboard">Ir al Dashboard ahora</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl mx-auto py-10 px-4">
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" asChild size="sm">
          <Link href="/partner/dashboard">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Volver
          </Link>
        </Button>
      </div>

      <Card className="shadow-xl border-none overflow-hidden">
        <CardHeader className="bg-[#0a3a6b] text-white p-8">
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-6 w-6" />
            <span className="text-sm font-medium uppercase tracking-wider opacity-80">Acuerdo de Colaboración Oficial</span>
          </div>
          <CardTitle className="text-3xl font-bold italic">MindAudit Partners Program</CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="h-[600px] overflow-y-auto p-10 prose prose-slate max-w-none bg-white border-b border-slate-100 custom-scrollbar">
            {loadingProfile ? (
              <div className="space-y-4">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="space-y-8 text-slate-700 leading-relaxed text-sm">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">CONTRATO DE COLABORACIÓN COMERCIAL</h2>
                  <p className="text-slate-500 font-bold italic text-right">En Barcelona, a {new Date().toLocaleDateString()}</p>
                </div>
                
                <section className="space-y-4">
                  <h3 className="text-lg font-black border-b-2 border-slate-900 inline-block pb-1">REUNIDOS</h3>
                  <p>
                    De una parte,<br />
                    <span className="font-bold">MIND AUDIT SPAIN, S.L.P.</span>, sociedad profesional inscrita en el Registro Oficial de Auditores de
                    Cuentas, con número ROAC S2711, con domicilio social en Gran Vía Carles III nº 98 10ª Planta 08028
                    Barcelona, NIF B22980593, debidamente representada por D. Emilio José Silva Fernández,
                    auditor de cuentas ROAC 23.066, en calidad de administrador único.
                  </p>
                  <p>
                    Y de otra parte,<br />
                    <span className="font-bold uppercase tracking-wide">{profile?.companyName || "[RAZÓN SOCIAL]"}</span>, con NIF <span className="font-bold">{profile?.cif || "[NIF]"}</span>, domicilio social en <span className="font-bold">{profile?.address ? `${profile.address}, ${profile.postalCode || ""} ${profile.city || ""} (${profile.province || ""})` : "[DOMICILIO SOCIAL]"}</span>,
                    debidamente representada por <span className="font-bold">{profile?.user.name || "[NOMBRE REPRESENTANTE]"}</span>, en su condición de Administrador/Representante Legal.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-lg font-black border-b-2 border-slate-900 inline-block pb-1">EXPONEN</h3>
                  <div className="space-y-2">
                    <p>(I) Que MindAudit es una sociedad profesional autorizada para el ejercicio de la actividad de auditoría de cuentas conforme a la Ley 22/2015 de 20 de julio.</p>
                    <p>(II) Que el Colaborador es un despacho profesional dedicado al asesoramiento profesional.</p>
                    <p>(III) Que ambas partes desean establecer un marco de colaboración comercial en los términos y condiciones que se detallan en el presente contrato.</p>
                  </div>
                </section>

                <section className="space-y-6">
                  <h3 className="text-lg font-black border-b-2 border-slate-900 inline-block pb-1">ACUERDAN</h3>
                  
                  <div className="space-y-6">
                    <div>
                      <p className="font-bold underline">PRIMERA. - Naturaleza jurídica y objeto:</p>
                      <p>
                        El presente acuerdo tiene por objeto regular la colaboración comercial entre MindAudit y el Colaborador
                        para la canalización de clientes interesados en servicios de auditoría prestados por MindAudit.
                      </p>
                      <p>
                        La presente relación tiene carácter estrictamente mercantil y no constituye sociedad, agencia, franquicia,
                        joint venture ni relación laboral alguna entre las partes. Cada parte mantiene plena autonomía jurídica,
                        organizativa y funcional.
                      </p>
                      <p>
                        MindAudit actúa como firma de auditoría independiente, inscrita en el Registro Oficial de Auditores de
                        Cuentas, siendo la única responsable de la prestación de los servicios de auditoría, de la emisión del
                        correspondiente informe y del cumplimiento de la normativa profesional aplicable.
                      </p>
                      <p>
                        La utilización de la plataforma tecnológica de MindAudit por parte del colaborador tiene como única
                        finalidad facilitar la gestión del flujo de información comercial y no implica integración estructural ni
                        compartición de políticas de control de calidad, ni constituye red en el sentido previsto en la Ley 22/2015
                        y su normativa de desarrollo.
                      </p>
                      <p>
                        En todo caso, la normativa reguladora de la actividad de auditoría prevalecerá sobre cualquier
                        estipulación contractual, especialmente en materia de independencia, ética profesional y control de
                        calidad.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold underline">SEGUNDA. - Régimen económico e incentivos de colaboración</p>
                      <p>
                        Como contraprestación por la canalización efectiva de clientes cuyo contrato principal de auditoría haya
                        sido formalizado y el trabajo finalizado, el colaborador tendrá derecho a un incentivo económico
                        calculado sobre los honorarios facturados por MindAudit correspondientes exclusivamente al contrato
                        inicial de auditoría, conforme a la siguiente escala:
                      </p>
                      <ul className="list-disc pl-5 font-bold text-blue-900 bg-blue-50/50 p-4 rounded-xl border border-blue-100 my-4">
                        <li>9% hasta 18.000,00 euros</li>
                        <li>12% entre 18.000,01 y 40.000,00 euros</li>
                        <li>15% a partir de 40.000,01 euros</li>
                      </ul>
                      <p>
                        El incentivo se calculará en el momento del devengo de la factura correspondiente al trabajo finalizado y
                        será liquidado el 30 de septiembre de cada año o en el momento de la resolución del contrato, lo que
                        ocurra antes.
                      </p>
                      <p>
                        No generarán incentivo las sucesivas renovaciones del contrato principal ni los servicios adicionales
                        contratados directamente por el cliente sin intervención del colaborador.
                      </p>
                      <p>
                        En caso de que el volumen anual de los honorarios devengados no supere los 5.000 euros anuales, la
                        compensación de incentivos se realizará mediante un bono de hasta cinco horas de consultas técnicas
                        mediante el contrato de iguala de horas de la plataforma www.mindaudit.es. Dicho bono tendrá vigencia
                        de 1 año a contar desde el 30 de septiembre de cada año. En el caso que el importe anual de los
                        honorarios devengados no supere los 2.000 euros, la compensación de incentivos se realizará mediante un
                        bono de 1 hora de consultas en contrato de iguala anteriormente mencionado.
                      </p>
                      <p>
                        Si con posterioridad al devengo los honorarios resultaran definitivamente incobrables o el contrato se
                        resolviera por causa imputable al cliente o al colaborador, MindAudit podrá compensar o regularizar el
                        incentivo previamente reconocido.
                      </p>
                      <p>
                        Con el fin de preservar la independencia y evitar situaciones de dependencia económica, cuando el
                        volumen de facturación derivado de un mismo colaborador supere el 25% del total de la facturación anual
                        de MindAudit, los nuevos contratos formalizados a partir de ese momento no generarán derecho a
                        incentivo económico. Dicha situación será comunicada al colaborador cuando el volumen de facturación
                        sobrepase el umbral del 20% del total de la facturación anual de MindAudit.
                      </p>
                      <p>
                        En ningún caso el colaborador podrá influir en la fijación de honorarios, que serán determinados
                        exclusivamente por MindAudit conforme a criterios técnicos y de independencia profesional.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold underline">TERCERA. – Duración del contrato</p>
                      <p>El presente contrato tendrá una duración inicial de 1 año desde la fecha de su firma.</p>
                      <p>
                        Transcurrido dicho plazo, se entenderá prorrogado tácitamente por períodos anuales sucesivos, salvo
                        denuncia expresa por cualquiera de las partes comunicada por escrito con una antelación mínima de 15
                        días a la fecha de vencimiento.
                      </p>
                      <p>
                        La vigencia del contrato no genera obligación mínima de canalización de clientes ni compromiso de
                        volumen de actividad entre las partes.
                      </p>
                      <p>
                        La extinción del contrato no implicará en ningún caso la continuidad automática de relaciones
                        comerciales ni la generación de derecho alguno a indemnización, salvo disposición legal imperativa en
                        contrario.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold underline">CUARTA. - Independencia profesional, incompatibilidades y no constitución de red</p>
                      <p>
                        MindAudit desarrollará su actividad con plena sujeción a la Ley 22/2015, de 20 de julio, al Real Decreto
                        2/2021 y a la normativa técnica y de control de calidad aplicable, manteniendo en todo momento su
                        independencia profesional respecto de las entidades auditadas y de terceros.
                      </p>
                      <p>
                        La relación contractual establecida entre MindAudit y el colaborador tiene naturaleza estrictamente
                        mercantil y no constituye, en ningún caso, red en el sentido previsto en el artículo 3 de la Ley 22/2015 y
                        en el Capítulo III del Reglamento de desarrollo aprobado por Real Decreto 2/2021. En particular, las
                        partes manifiestan expresamente que:
                      </p>
                      <ul className="list-[lower-alpha] pl-8 space-y-1 my-2">
                        <li>No comparten costes ni beneficios relevantes.</li>
                        <li>No comparten recursos profesionales significativos.</li>
                        <li>No existe política común de control de calidad.</li>
                        <li>No existe estrategia empresarial común.</li>
                        <li>No utilizan nombre comercial común.</li>
                        <li>No existe estructura organizativa integrada.</li>
                        <li>No existe dirección común ni coordinación estratégica.</li>
                      </ul>
                      <p>
                        La plataforma tecnológica de MindAudit constituye una herramienta de gestión comercial y no implica
                        integración operativa, organizativa ni estructural. La concurrencia de cualquier circunstancia que pudiera
                        alterar esta situación deberá ser comunicada de forma inmediata y dará lugar a la revisión del presente
                        acuerdo.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold underline">QUINTA. – Declaración anual de independencia y obligaciones de información</p>
                      <p>
                        Con el fin de preservar el cumplimiento de la normativa reguladora de la actividad de auditoría de cuentas
                        y garantizar la adecuada identificación y evaluación de amenazas a la independencia, el colaborador se
                        obliga a suscribir anualmente una declaración formal y expresa de independencia respecto de MindAudit
                        y de los clientes canalizados en virtud del presente acuerdo.
                      </p>
                      <p>
                        El colaborador deberá comunicar de forma inmediata a MindAudit cualquier circunstancia sobrevenida
                        que pudiera afectar a su independencia o generar amenazas a la misma, a efectos de que MindAudit pueda
                        evaluar las salvaguardas necesarias o, en su caso, abstenerse de aceptar o continuar el encargo.
                      </p>
                      <p>
                        MindAudit, por su parte, mantendrá su propio sistema de gestión de calidad conforme a la normativa
                        aplicable y evaluará las amenazas y salvaguardas que puedan derivarse de la relación con el colaborador,
                        documentando internamente dicha evaluación.
                      </p>
                      <p>
                        La falta de suscripción de la declaración anual o la existencia de circunstancias incompatibles dará lugar a
                        la suspensión automática de la canalización de nuevos encargos hasta su regularización, sin perjuicio de
                        las causas de resolución previstas en el presente contrato.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold underline">SEXTA. – Compromiso de las partes</p>
                      <p>
                        Las partes se comprometen a desarrollar la relación de colaboración con arreglo a los principios de buena
                        fe contractual, diligencia profesional, integridad y respeto a la normativa aplicable.
                      </p>
                      <p>
                        MindAudit y el colaborador actuarán con plena autonomía organizativa, técnica y económica, sin que
                        exista subordinación, integración estructural ni dirección común. El colaborador reconoce que la
                        prestación de los servicios de auditoría corresponde exclusivamente a MindAudit, quien asumirá
                        íntegramente la responsabilidad técnica del encargo.
                      </p>
                      <p>En este sentido, el colaborador se compromete a:</p>
                      <ul className="list-disc pl-5 space-y-2 mt-2">
                        <li>Facilitar información veraz, suficiente y actualizada sobre los clientes canalizados.</li>
                        <li>No retrasar injustificadamente la tramitación de propuestas ni la comunicación de respuestas del cliente.</li>
                        <li>No influir directa ni indirectamente en la fijación de honorarios ni en el contenido técnico del encargo.</li>
                        <li>No realizar actuaciones que puedan generar amenazas a la independencia de MindAudit.</li>
                        <li>No utilizar la marca MindAudit de forma que pueda inducir a error sobre la naturaleza de la relación entre las partes.</li>
                        <li>No realizar manifestaciones comerciales engañosas respecto de los servicios de auditoría.</li>
                        <li>No participar en conductas que impliquen fraude, mala fe, ocultación de información relevante o actuaciones que puedan inducir a engaño.</li>
                        <li>Comunicar cualquier circunstancia que pudiera generar conflicto de intereses o incompatibilidad profesional.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold underline">SÉPTIMA. – Causas de resolución</p>
                      <p>
                        El presente contrato podrá resolverse por cualquiera de las partes mediante comunicación escrita, sin
                        perjuicio de las demás causas previstas en la legislación aplicable, en los siguientes supuestos:
                      </p>
                      <ul className="list-[lower-alpha] pl-8 space-y-2 mt-2">
                        <li><strong>Incumplimiento grave:</strong> Cuando afecte especialmente a la independencia profesional, la integridad en la canalización de los clientes en la plataforma, la injerencia en la actividad técnica de auditoría, el no cumplimiento de las obligaciones de deber de información o la utilización indebida de la marca MindAudit.</li>
                        <li><strong>Conductas contrarias a la buena fe e integridad profesional</strong></li>
                        <li><strong>Incompatibilidades o amenazas no mitigables</strong></li>
                        <li><strong>Dependencia económica estructural:</strong> En este sentido, se entenderá que existe una relación de dependencia económica entre el colaborador e MindAudit cuando la facturación de un mismo colaborador supere el 25% del total de la facturación de MindAudit.</li>
                        <li><strong>Inactividad prolongada:</strong> Entendida como la ausencia de uso de la plataforma bien sea por la inexistencia de solicitudes de encargos o bien por la no contratación de los servicios de consultas ofrecidos en la plataforma.</li>
                        <li><strong>Incumplimiento de la declaración anual de independencia.</strong></li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold underline">OCTAVA. – Efectos de la resolución</p>
                      <p>
                        La resolución del presente contrato, por cualquier causa, producirá efectos desde la fecha de notificación
                        escrita o desde la fecha acordada entre las partes.
                      </p>
                      <p className="font-bold mt-4">a) Encargos en curso</p>
                      <p>
                        La resolución no afectará a los contratos de auditoría ya formalizados entre MindAudit y los
                        clientes, los cuales continuarán ejecutándose conforme a la normativa reguladora de la actividad
                        de auditoría y a los términos contractuales suscritos con cada cliente. En ningún caso la
                        resolución del presente acuerdo facultará al colaborador para intervenir en la continuidad,
                        renovación o terminación de dichos encargos.
                      </p>
                      <p className="font-bold mt-4">b) Derechos económicos</p>
                      <p>
                        El colaborador conservará exclusivamente el derecho a los incentivos ya devengados conforme a
                        la cláusula segunda, sin perjuicio de las regularizaciones que pudieran proceder en caso de
                        incobrabilidad u otras circunstancias previstas contractualmente. No se generará derecho alguno
                        respecto de: prórrogas o renovaciones de contratos, nuevos servicios contratados con
                        posterioridad a la resolución, otros clientes operados por el colaborador que contraten
                        directamente con MindAudit sin intervención posterior del colaborador.
                      </p>
                      <p className="font-bold mt-4">c) Cese de uso de marca y referencias</p>
                      <p>
                        Desde la fecha de resolución, el colaborador deberá cesar inmediatamente cualquier uso de la
                        denominación MindAudit en soportes comerciales, digitales o documentales, salvo autorización
                        expresa y por escrito.
                      </p>
                    </div>

                    <div>
                      <p className="font-bold underline">NOVENA. – Confidencialidad y protección de datos</p>
                      <p>
                        Las partes se obligan a mantener la más estricta confidencialidad respecto de toda información,
                        documentación, datos o antecedentes a los que tengan acceso con ocasión de la presente relación
                        contractual, cualquiera que sea su soporte o formato. El deber de confidencialidad subsistirá con carácter
                        indefinido, incluso tras la finalización del contrato.
                      </p>
                      <p>
                        El deber de secreto profesional de MindAudit se regirá por lo dispuesto en la Ley 22/2015 y su normativa
                        de desarrollo, prevaleciendo en todo caso dicha normativa sobre lo previsto en el presente contrato.
                      </p>
                      <p>
                        Las partes se comprometen a cumplir íntegramente el Reglamento (UE) 2016/679 (RGPD), la Ley
                        Orgánica 3/2018 y demás normativa aplicable en materia de protección de datos personales.
                      </p>
                      <p>
                        Cada parte actuará como responsable independiente del tratamiento respecto de los datos personales que
                        trate en el ámbito de su propia actividad profesional.
                      </p>
                      <p>
                        El colaborador únicamente podrá comunicar a MindAudit los datos estrictamente necesarios para la
                        elaboración de la propuesta de servicios, garantizando que dispone de base jurídica suficiente para dicha
                        comunicación.
                      </p>
                      <p>MindAudit tratará los datos personales recibidos exclusivamente para:</p>
                      <ul className="list-[lower-alpha] pl-8 space-y-1 mt-2">
                        <li>La elaboración de propuestas.</li>
                        <li>La evaluación de independencia.</li>
                        <li>La formalización y ejecución del encargo de auditoría.</li>
                      </ul>
                    </div>

                    <div>
                      <p className="font-bold underline">DÉCIMA. – Normativa aplicable y jurisdicción</p>
                      <p>
                        El presente contrato tiene naturaleza mercantil y se regirá e interpretará conforme al Derecho español.
                      </p>
                      <p>
                        En todo lo no expresamente previsto en el mismo, será de aplicación la normativa civil y mercantil
                        vigente, sin perjuicio de la prevalencia de la Ley 22/2015, de 20 de julio, de Auditoría de Cuentas, su
                        Reglamento de desarrollo aprobado por Real Decreto 2/2021 y demás normativa reguladora de la
                        actividad de auditoría de cuentas, en cuanto resulte aplicable.
                      </p>
                      <p>
                        Las partes acuerdan que cualquier controversia, discrepancia o reclamación que pudiera derivarse de la
                        interpretación, ejecución o resolución del presente contrato será sometida a los Juzgados y Tribunales de la
                        ciudad de <strong>Tarragona</strong>, con renuncia expresa a cualquier otro fuero que pudiera corresponderles.
                      </p>
                    </div>
                  </div>
                </section>

                <div className="mt-16 pt-12 border-t border-slate-100 italic text-xs text-slate-400">
                  Y en prueba de conformidad, ambas partes firman el presente contrato, por duplicado y a un solo efecto.
                </div>

                <div className="mt-8 pt-4">
                  <div className="grid grid-cols-2 gap-12">
                    <div className="text-center space-y-4">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Por MindAudit Spain, S.L.P.:</p>
                      <div className="h-24 flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-100">
                        <span className="text-slate-300 italic text-[10px] mb-1">Firmado Digitalmente</span>
                        <span className="font-black text-[#0a3a6b]">Emilio José Silva Fernández</span>
                      </div>
                    </div>

                    <div className="text-center space-y-4">
                      <p className="text-[10px] uppercase font-black text-slate-400 tracking-widest">Por el Colaborador:</p>
                      <div className="h-24 flex items-center justify-center bg-emerald-50/30 rounded-2xl border-2 border-emerald-100 overflow-hidden">
                        {signatureData ? (
                          <img src={signatureData} alt="Tu firma" className="h-full object-contain mix-blend-multiply" />
                        ) : (
                          <span className="text-amber-500 font-bold italic text-sm text-[10px]">Pendiente de firma</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 bg-blue-50/50 p-6 rounded-2xl border border-blue-100/50">
                  <h4 className="text-blue-900 font-bold mb-2 flex items-center gap-2">
                    <PenTool className="h-4 w-4" />
                    Área de Firma Digital
                  </h4>
                  <p className="text-blue-700 text-xs mb-4 underline">
                    Por favor, estampa tu firma en el recuadro inferior utilizando tu ratón o pantalla táctil.
                  </p>
                  <SignaturePad 
                    onSign={setSignatureData} 
                    onClear={() => setSignatureData(null)} 
                  />
                </div>
              </div>
            )}
          </div>

          <div className="p-8 bg-white flex flex-col items-center gap-4 border-t">
            <p className="text-slate-500 text-[10px] italic text-center max-w-md">
              Al hacer clic en &quot;Firmar y Aceptar&quot;, declaras que has leído y aceptas los términos del acuerdo de colaboración de MindAudit Spain, S.L.P.
            </p>
            <Button 
              size="lg" 
              className="w-full sm:w-auto px-12 h-14 bg-[#0a3a6b] hover:bg-[#082e56] text-lg font-bold shadow-xl transition-all active:scale-95 disabled:opacity-50"
              onClick={handleSign}
              disabled={loading || !signatureData || loadingProfile}
            >
              {loading ? "Procesando..." : "Firmar Contrato y Unirme"}
              <PenTool className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
