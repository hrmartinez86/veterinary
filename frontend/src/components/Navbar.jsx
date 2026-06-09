import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const NAV_LINKS = [
  { id: 'servicios', label: 'Servicios' },
  { id: 'nosotros', label: 'Nosotros' },
  { id: 'contacto', label: 'Contacto' },
];

export default function Navbar() {
  const [open,     setOpen]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname, hash } = useLocation();
  const navigate = useNavigate();
  const isApp = pathname !== '/';

  const scrollToSection = sectionId => {
    const target = document.getElementById(sectionId);
    if (!target) return;

    const navOffset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - navOffset;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  const handleSectionClick = sectionId => {
    setOpen(false);

    if (pathname !== '/') {
      navigate(`/#${sectionId}`);
      return;
    }

    scrollToSection(sectionId);
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  useEffect(() => {
    if (pathname !== '/' || !hash) return;

    const id = hash.replace('#', '');
    requestAnimationFrame(() => scrollToSection(id));
  }, [pathname, hash]);

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
            <button key={l.id} type="button" onClick={() => handleSectionClick(l.id)}
              className={`text-sm font-medium hover:text-teal-600 transition-colors ${
                scrolled || isApp ? 'text-gray-700' : 'text-white'
              }`}>
              {l.label}
            </button>
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
            <button key={l.id} type="button" onClick={() => handleSectionClick(l.id)}
              className="block py-2 text-gray-700 font-medium">
              {l.label}
            </button>
          ))}
          <Link to="/mascotas" onClick={() => setOpen(false)} className="btn-primary w-full text-sm">Ver mascotas</Link>
        </div>
      )}
    </nav>
  );
}
