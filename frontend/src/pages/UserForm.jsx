import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/client';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function UserForm() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'staff' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async e => {
    e.preventDefault();
    setError(''); setSuccess(''); setSaving(true);
    try {
      await api.post('/users', form);
      setSuccess(`Usuario "${form.name}" creado correctamente. Al iniciar sesión deberá cambiar su contraseña.`);
      setForm({ name: '', email: '', password: '', role: 'staff' });
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-10">
          <Link to="/mascotas" className="text-teal-600 text-sm hover:underline mb-6 inline-block">
            ← Volver a mascotas
          </Link>

          <h1 className="text-2xl font-extrabold text-gray-900 mb-1">Dar de alta usuario</h1>
          <p className="text-gray-500 text-sm mb-6">
            El usuario recibirá acceso al sistema y deberá cambiar su contraseña en el primer inicio de sesión.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              ✅ {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label className="label">Nombre completo *</label>
              <input
                className="input"
                required
                placeholder="Ej. María López"
                value={form.name}
                onChange={e => set('name', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Correo electrónico *</label>
              <input
                className="input"
                type="email"
                required
                placeholder="maria@vetcare.local"
                value={form.email}
                onChange={e => set('email', e.target.value)}
              />
            </div>

            <div>
              <label className="label">Contraseña inicial *</label>
              <input
                className="input"
                type="password"
                required
                minLength={8}
                placeholder="Mínimo 8 caracteres"
                value={form.password}
                onChange={e => set('password', e.target.value)}
              />
              <p className="text-xs text-gray-400 mt-1">
                El usuario deberá cambiarla en su primer inicio de sesión.
              </p>
            </div>

            <div>
              <label className="label">Rol</label>
              <select className="input" value={form.role} onChange={e => set('role', e.target.value)}>
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => navigate('/mascotas')} className="btn-outline flex-1">
                Cancelar
              </button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Creando...' : 'Dar de alta'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
