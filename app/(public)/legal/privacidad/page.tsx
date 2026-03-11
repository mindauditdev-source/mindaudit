import { LegalLayout } from "@/components/layout/LegalLayout";

export default function PrivacidadPage() {
  return (
    <LegalLayout 
      title="Política de Privacidad" 
      lastUpdated="11 de Marzo, 2026"
      icon="privacy"
    >
      <section>
        <h2>1. Responsable del Tratamiento</h2>
        <p>
          El responsable del tratamiento de sus datos personales es <strong>MindAudit Spain SLP</strong>, con domicilio social en Madrid, España. Puede contactar con nuestro Delegado de Protección de Datos a través del correo electrónico facilitado en nuestra sección de contacto.
        </p>
      </section>

      <section>
        <h2>2. Datos Recogidos</h2>
        <p>
          Recogemos la información necesaria para la prestación de nuestros servicios profesionales, incluyendo:
        </p>
        <ul>
          <li>Datos identificativos (nombre, apellidos, DNI/CIF).</li>
          <li>Datos de contacto (email, teléfono, dirección corporativa).</li>
          <li>Datos profesionales y de empresa necesarios para los procesos de auditoría.</li>
          <li>Información técnica de navegación recogida a través de cookies propias.</li>
        </ul>
      </section>

      <section>
        <h2>3. Finalidad del Tratamiento</h2>
        <p>
          Sus datos serán tratados con las siguientes finalidades:
        </p>
        <ul>
          <li>Gestionar su registro como colaborador o empresa cliente.</li>
          <li>Prestar los servicios de auditoría y consultoría solicitados.</li>
          <li>Mantener la comunicación necesaria para la correcta ejecución del servicio.</li>
          <li>Cumplir con las obligaciones legales y normativas aplicables al sector de la auditoría.</li>
        </ul>
      </section>

      <section>
        <h2>4. Legitimación</h2>
        <p>
          La base legal para el tratamiento de sus datos es la ejecución del contrato de servicios en el que usted es parte (como usuario registrado) y el cumplimiento de obligaciones legales de MindAudit Spain SLP.
        </p>
      </section>

      <section>
        <h2>5. Destinatarios</h2>
        <p>
          Sus datos no serán cedidos a terceros, salvo obligación legal o cuando sea estrictamente necesario para la prestación del servicio solicitado (ej: organismos reguladores si la normativa lo exige).
        </p>
      </section>

      <section>
        <h2>6. Derechos del Usuario</h2>
        <p>
          Usted tiene derecho a acceder, rectificar y suprimir sus datos, así como a la portabilidad de los mismos y a la limitación u oposición a su tratamiento, enviando una solicitud a nuestro departamento legal.
        </p>
      </section>

      <section>
        <h2>7. Medidas de Seguridad</h2>
        <p>
          MindAudit Spain SLP ha implementado medidas técnicas y organizativas de seguridad de alto nivel para proteger sus datos personales contra accesos no autorizados, pérdida o alteración, cumpliendo con los estándares del RGPD.
        </p>
      </section>
    </LegalLayout>
  );
}
