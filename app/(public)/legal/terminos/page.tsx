import { LegalLayout } from "@/components/layout/LegalLayout";

export default function TerminosPage() {
  return (
    <LegalLayout 
      title="Términos de Uso" 
      lastUpdated="11 de Marzo, 2026"
      icon="terms"
    >
      <section>
        <h2>1. Información General</h2>
        <p>
          El presente documento regula los términos y condiciones de uso de la plataforma digital de <strong>MindAudit Spain SLP</strong>. 
          Al acceder o utilizar nuestros servicios, usted acepta quedar vinculado por estos términos en su totalidad.
        </p>
      </section>

      <section>
        <h2>2. Uso de la Plataforma</h2>
        <p>
          Esta plataforma está diseñada para la gestión profesional de servicios de auditoría y consultoría. El usuario se compromete a:
        </p>
        <ul>
          <li>Proporcionar información veraz y actualizada en los procesos de registro.</li>
          <li>No utilizar la plataforma para fines ilícitos o fraudulentos.</li>
          <li>Mantener la confidencialidad de sus credenciales de acceso.</li>
          <li>Respetar la integridad técnica del sistema.</li>
        </ul>
      </section>

      <section>
        <h2>3. Propiedad Intelectual</h2>
        <p>
          Todos los contenidos, marcas, logos, dibujos, documentación, programas informáticos o cualquier otro elemento susceptible de protección por la legislación de propiedad intelectual o industrial que sean accesibles en la plataforma corresponden exclusivamente a MindAudit Spain SLP o a sus legítimos titulares.
        </p>
      </section>

      <section>
        <h2>4. Responsabilidades</h2>
        <p>
          MindAudit Spain SLP realiza los máximos esfuerzos para garantizar la disponibilidad técnica de la plataforma. No obstante, no se hace responsable de:
        </p>
        <ul>
          <li>Interrupciones debidas a causas de fuerza mayor o mantenimiento técnico.</li>
          <li>Uso incorrecto o malintencionado por parte de los usuarios.</li>
          <li>Daños derivados de ataques informáticos de terceros fuera de nuestro control razonable.</li>
        </ul>
      </section>

      <section>
        <h2>5. Modificaciones</h2>
        <p>
          Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios significativos serán notificados a través de la propia plataforma o mediante comunicación directa a los usuarios registrados.
        </p>
      </section>

      <section>
        <h2>6. Jurisdicción</h2>
        <p>
          Para la resolución de cualquier controversia judicial que pudiera derivarse de la interpretación o cumplimiento de estos términos, las partes se someten a la legislación española y a los Juzgados y Tribunales de la ciudad de Madrid, con renuncia expresa a cualquier otro fuero.
        </p>
      </section>
    </LegalLayout>
  );
}
