import { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, login } = useAuth();
  const from = location.state?.from?.pathname || '/mascotas';

  const [form, setForm] = useState({ email: '', password: '' });
  // const [form, setForm] = useState({ email: 'admin@vetcare.local', password: 'VetCare123!' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const update = (field, value) => {
    setForm(current => ({ ...current, [field]: value }));
  };

  const handleSubmit = async event => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const loggedUser = await login(form);
      if (loggedUser.mustChangePassword) {
        navigate('/cambiar-contrasena', { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (submitError) {
      setError(submitError.response?.data?.error || 'No se pudo iniciar sesión');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen relative overflow-hidden bg-slate-950 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(20,184,166,0.34),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.2),_transparent_28%)]" />

      <div className="relative max-w-6xl mx-auto min-h-screen grid lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden lg:flex flex-col justify-center px-10 xl:px-16 py-16">
          <span className="inline-flex items-center gap-2 w-fit rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-teal-200">
            VetCare acceso
          </span>
          <h1 className="mt-6 text-5xl xl:text-6xl font-extrabold leading-tight max-w-xl">
            Bienvenido al panel de control de mascotas
          </h1>

          <div className="mt-10 grid grid-cols-2 gap-4 max-w-xl">
            {[
              ['👥', 'Gestiona dueños', 'Información de contacto y mascotas asociadas'],
              ['🐾', 'Mascotas', 'Datos completos de cada mascota registrada'],
              ['💉', 'Vacunas', 'Control de vacunas aplicadas y próximas aplicaciones'],
              ['🩺', 'Consultas', 'Registro y seguimiento de consultas veterinarias'],
            ].map(([icon, title, detail]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
                <p className="font-semibold text-white flex items-center gap-2">
                  <span aria-hidden="true">{icon}</span>
                  <span>{title}</span>
                </p>
                <p className="mt-1 text-sm text-white/65">{detail}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="flex items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="w-full max-w-md rounded-3xl border border-white/20 bg-white/95 p-8 shadow-2xl text-slate-900 backdrop-blur">
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-600 text-2xl text-white shadow-lg shadow-teal-600/30">
                  🐾
                </div>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">VetCare</p>
                  <h2 className="text-2xl font-extrabold text-slate-900">Iniciar sesión</h2>
                </div>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-slate-500">
                Entra con tu usuario para administrar el sistema.
              </p>
            </div>

            {error && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="label">Correo electrónico</label>
                <input
                  className="input"
                  type="email"
                  required
                  autoComplete="email"
                  value={form.email}
                  onChange={event => update('email', event.target.value)}
                  placeholder="admin@vetcare.local"
                />
              </div>

              <div>
                <label className="label">Contraseña</label>
                <input
                  className="input"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={form.password}
                  onChange={event => update('password', event.target.value)}
                  placeholder="••••••••"
                />
              </div>

              <button type="submit" disabled={submitting} className="btn-primary w-full py-3">
                {submitting ? 'Validando...' : 'Entrar'}
              </button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}