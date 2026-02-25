import Link from 'next/link';
import { Linkedin, Twitter, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Column 1: Brand */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex aspect-square size-9 items-center justify-center rounded-lg bg-[#0f4c81] text-white">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold tracking-tight text-[#0f4c81]"><strong>MindAudit</strong></span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              Servicios profesionales de auditoría y consultoría para empresas 
              que buscan excelencia y transparencia.
            </p>
            <ul className="space-y-2 pt-2">
              <li>
                <Link href="/sobre-nosotros" className="text-slate-500 hover:text-[#0f4c81] text-xs font-semibold uppercase tracking-wider transition-colors">
                  Sobre Nosotros
                </Link>
              </li>
              <li>
                <Link href="/trabaja-con-nosotros" className="text-slate-500 hover:text-[#0f4c81] text-xs font-semibold uppercase tracking-wider transition-colors">
                  Trabaja con nosotros
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Servicios */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Servicios</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/servicios#cuentas" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Auditoría de Cuentas
                </Link>
              </li>
              <li>
                <Link href="/servicios#fiscal" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Consultoría Fiscal
                </Link>
              </li>
              <li>
                <Link href="/servicios#due-diligence" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Due Diligence
                </Link>
              </li>
              <li>
                <Link href="/servicios#forensic" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Forensic
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Legal</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/legal/aviso-legal" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Aviso Legal
                </Link>
              </li>
              <li>
                <Link href="/legal/privacidad" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link href="/legal/cookies" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/canal-etico" className="text-slate-500 hover:text-[#0f4c81] text-sm font-medium transition-colors">
                  Canal Ético
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Siguenos */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-widest">Síguenos</h3>
            <div className="flex gap-4">
              <Link href="#" className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0f4c81] hover:text-white transition-all">
                <Linkedin className="h-4 w-4" />
              </Link>
              <Link href="#" className="h-8 w-8 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 hover:bg-[#0f4c81] hover:text-white transition-all">
                <Twitter className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-medium text-slate-400">
            © 2024 <strong>MindAudit Spain SLP</strong>. Todos los derechos reservados.
          </p>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Sistemas Operativos</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
