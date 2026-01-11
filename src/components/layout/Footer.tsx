import Link from 'next/link';
import { Facebook, Linkedin, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-white pt-16 pb-8">
      <div className="container mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Columna 1: Brand */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                <span className="text-xl font-bold">M</span>
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-lg font-bold">MindAudit</span>
                <span className="text-xs text-gray-400">SPAIN SLP</span>
              </div>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Excellence in auditing services for the modern business landscape. Registered in ROAC nº S0XXXX.
            </p>
            <div className="flex gap-4 pt-2">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Columna 2: Services */}
          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wide">SERVICES</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/servicios#financiera" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Financial Audit
                </Link>
              </li>
              <li>
                <Link href="/servicios#subvenciones" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Grant Justification
                </Link>
              </li>
              <li>
                <Link href="/servicios#ecoembes" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Ecoembes Reports
                </Link>
              </li>
              <li>
                <Link href="/servicios#due-diligence" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Due Diligence
                </Link>
              </li>
              <li>
                <Link href="/servicios#forensic" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Forensic Audit
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Company */}
          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wide">COMPANY</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/sobre-nosotros" className="text-gray-400 hover:text-white text-sm transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/colaboradores" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Our Partners
                </Link>
              </li>
              <li>
                <Link href="/carreras" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Press & News
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-400 hover:text-white text-sm transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 4: Contact */}
          <div>
            <h3 className="font-semibold text-lg mb-6 tracking-wide">CONTACT</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <MapPin className="h-5 w-5 text-blue-500 shrink-0" />
                <span>
                  Gran Via Carles III nº98 10ª
                  <br />
                  08028 Barcelona, Spain
                </span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Phone className="h-5 w-5 text-blue-500 shrink-0" />
                <span>+34 900 933 233</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <Mail className="h-5 w-5 text-blue-500 shrink-0" />
                <a href="mailto:info@mindaudit.es" className="hover:text-white transition-colors">
                  info@mindaudit.es
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <p>© 2026 MindAudit Spain SLP. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/legal/privacidad" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/legal/terminos" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="/legal/cookies" className="hover:text-white transition-colors">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
