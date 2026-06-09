import { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';

export default function ChangePassword() {
  const navigate = useNavigate();
  const { user, loading, updateSession } = useAuth();

  const isForced = user?.mustChangePassword;

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  if (!loading && !user) return <Navigate to="/login" replace />;

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    if (form.newPassword !== form.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (form.newPassword.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres');
      return;
    }

    setSaving(true);
    try {
      const body = { newPassword: form.newPassword };
      if (!isForced) body.currentPassword = form.currentPassword;

      const { data } = await api.post('/auth/change-password', body);
      updateSession(data);
      navigate('/mascotas', { replace: true });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al cambiar contraseña');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          {isForced && (
            <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
              <p className="font-semibold text-amber-800 text-sm">🔑 Primer inicio de sesión</p>
              <p className="text-amber-700 text-sm mt-1">
                Por seguridad debes establecer una nueva contraseña antes de continuar.
              </p>
            </div>
          )}

          <div className="card">
            <h1 className="text-xl font-extrabold text-gray-900 mb-1">
              {isForced ? 'Establece tu contraseña' : 'Cambiar contraseña'}
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              {isForced
                ? 'Crea una contraseña segura de al menos 8 caracteres.'
                : 'Ingresa tu contraseña actual y la nueva.'}
            </p>

            {error && (
              <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              {!isForced && (
                <div>
                  <label className="label">Contraseña actual</label>
                  <input
                    className="input"
                    type="password"
                    required
                    autoComplete="current-password"
                    value={form.currentPassword}
                    onChange={e => set('currentPassword', e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              )}

              <div>
                <label className="label">Nueva contraseña</label>
                <input
                  className="input"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.newPassword}
                  onChange={e => set('newPassword', e.target.value)}
                  placeholder="Mínimo 8 caracteres"
                />
              </div>

              <div>
                <label className="label">Confirmar contraseña</label>
                <input
                  className="input"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={e => set('confirmPassword', e.target.value)}
                  placeholder="Repite la nueva contraseña"
                />
              </div>

              <div className="flex gap-3 pt-1">
                {!isForced && (
                  <button type="button" onClick={() => navigate(-1)} className="btn-outline flex-1">
                    Cancelar
                  </button>
                )}
                <button type="submit" disabled={saving} className="btn-primary flex-1">
                  {saving ? 'Guardando...' : 'Guardar contraseña'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>
    </>
  );
}
