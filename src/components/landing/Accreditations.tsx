import { ShieldCheck, Award, Building2 } from 'lucide-react';

export function Accreditations() {
  const accreditations = [
    {
      icon: Building2,
      label: 'REGISTRO OFICIAL',
      title: 'Inscrito en el ROAC',
      description: 'Registro Oficial de Auditores de Cuentas'
    },
    {
      icon: ShieldCheck,
      label: 'ESTÁNDAR DE SEGURIDAD',
      title: 'Certificación ISO 27001',
      description: 'Gestión de Seguridad de la Información'
    },
    {
      icon: Award,
      label: 'MIEMBRO DE',
      title: 'ICJCE España',
      description: 'Instituto de Censores Jurados de Cuentas de España'
    }
  ];

  return (
    <section className="bg-gray-50 pt-32 pb-16 lg:pt-60">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold tracking-widest text-gray-400 uppercase border border-gray-200 rounded-full px-3 py-1 bg-white">
            Acreditaciones Corporativas y Cumplimiento
          </span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {accreditations.map((item, index) => (
            <div key={index} className="flex items-center gap-4 bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                <item.icon className="h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{item.label}</span>
                <span className="text-base font-bold text-gray-900">{item.title}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
