import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV_LINKS = [
  { to: '/#servicios',  label: 'Servicios'   },
  { to: '/#nosotros',  label: 'Nosotros'    },
  { to: '/#contacto',  label: 'Contacto'    },
  { to: '/mascotas',   label: 'Sistema'     },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const isApp = pathname !== '/';

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
      scrolled || isApp ? 'bg-white shadow-md' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-2xl">🐾</span>
          <span className={`font-extrabold text-lg tracking-tight ${
            scrolled || isApp ? 'text-teal-700' : 'text-white'
          }`}>VetCare</span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-medium hover:text-teal-600 transition-colors ${
                scrolled || isApp ? 'text-gray-700' : 'text-white'
              }`}>
              {l.label}
            </Link>
          ))}
          <Link to="/mascotas" className="btn-primary text-sm py-2">Ver mascotas</Link>
        </div>

        {/* Mobile hamburger */}
        <button className="md:hidden p-2" onClick={() => setOpen(o => !o)}>
          <div className={`w-5 h-0.5 mb-1 transition-all ${scrolled || isApp ? 'bg-gray-700' : 'bg-white'}`} />
          <div className={`w-5 h-0.5 mb-1 transition-all ${scrolled || isApp ? 'bg-gray-700' : 'bg-white'}`} />
          <div className={`w-5 h-0.5 transition-all ${scrolled || isApp ? 'bg-gray-700' : 'bg-white'}`} />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          {NAV_LINKS.map(l => (
            <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
              className="block py-2 text-gray-700 font-medium">
              {l.label}
            </Link>
          ))}
          <Link to="/mascotas" onClick={() => setOpen(false)} className="btn-primary w-full text-sm">Ver mascotas</Link>
        </div>
      )}
    </nav>
  );
}
