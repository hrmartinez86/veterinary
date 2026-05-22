import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/client';

export default function OwnerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [form,   setForm]   = useState({ name: '', email: '', phone: '', address: '' });
  const [saving, setSaving] = useState(false);
  const [error,  setError]  = useState('');

  useEffect(() => {
    if (isEdit) api.get(`/owners/${id}`).then(r => setForm({ name: r.data.name, email: r.data.email, phone: r.data.phone || '', address: r.data.address || '' }));
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setSaving(true);
    try {
      if (isEdit) await api.put(`/owners/${id}`, form);
      else        await api.post('/owners', form);
      navigate('/duenos');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    } finally { setSaving(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-10">
          <Link to="/duenos" className="text-teal-600 text-sm hover:underline mb-6 inline-block">← Volver</Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
            {isEdit ? 'Editar dueño' : 'Registrar dueño'}
          </h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="card space-y-4">
            <div>
              <label className="label">Nombre completo *</label>
              <input className="input" required placeholder="Ana García" value={form.name} onChange={e => set('name', e.target.value)} />
            </div>
            <div>
              <label className="label">Correo electrónico *</label>
              <input className="input" type="email" required placeholder="ana@ejemplo.com" value={form.email} onChange={e => set('email', e.target.value)} />
            </div>
            <div>
              <label className="label">Teléfono</label>
              <input className="input" type="tel" placeholder="55 1234 5678" value={form.phone} onChange={e => set('phone', e.target.value)} />
            </div>
            <div>
              <label className="label">Dirección</label>
              <input className="input" placeholder="Calle, Colonia, Ciudad" value={form.address} onChange={e => set('address', e.target.value)} />
            </div>
            <div className="flex gap-3 pt-1">
              <button type="button" onClick={() => navigate('/duenos')} className="btn-outline flex-1">Cancelar</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Registrar'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
