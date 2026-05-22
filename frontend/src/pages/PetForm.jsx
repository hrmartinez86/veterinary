import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/client';

export default function PetForm() {
  const { id } = useParams(); // si existe → editar
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [owners,  setOwners]  = useState([]);
  const [form,    setForm]    = useState({
    ownerId: '', name: '', species: 'dog', breed: '', age: '', weight: '',
    sex: 'male', color: '', notes: '',
  });
  const [photo,   setPhoto]   = useState(null);
  const [preview, setPreview] = useState(null);
  const [saving,  setSaving]  = useState(false);
  const [error,   setError]   = useState('');

  useEffect(() => {
    api.get('/owners').then(r => setOwners(r.data));
    if (isEdit) {
      api.get(`/pets/${id}`).then(r => {
        const p = r.data;
        setForm({
          ownerId: p.ownerId, name: p.name, species: p.species, breed: p.breed || '',
          age: p.age || '', weight: p.weight || '', sex: p.sex, color: p.color || '', notes: p.notes || '',
        });
        if (p.photo) setPreview(`/${p.photo}`);
      });
    }
  }, [id]);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPhoto(file);
    const reader = new FileReader();
    reader.onload = ev => setPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => { if (v !== '') fd.append(k, v); });
      if (photo) fd.append('photo', photo);

      if (isEdit) await api.put(`/pets/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      else        await api.post('/pets',       fd, { headers: { 'Content-Type': 'multipart/form-data' } });

      navigate('/mascotas');
    } catch (err) {
      setError(err.response?.data?.error || 'Error al guardar');
    } finally { setSaving(false); }
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link to="/mascotas" className="text-teal-600 text-sm hover:underline mb-6 inline-block">← Volver</Link>
          <h1 className="text-2xl font-extrabold text-gray-900 mb-6">
            {isEdit ? 'Editar mascota' : 'Registrar mascota'}
          </h1>

          {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-4 py-3 mb-5 text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="card space-y-5">
            {/* Foto */}
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-teal-50 flex items-center justify-center text-4xl flex-shrink-0">
                {preview ? <img src={preview} alt="" className="w-full h-full object-cover" /> : '🐾'}
              </div>
              <div>
                <label className="btn-outline text-sm cursor-pointer">
                  📷 Subir foto
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhoto} />
                </label>
                <p className="text-xs text-gray-400 mt-1">JPG, PNG · máx 3 MB</p>
              </div>
            </div>

            <div>
              <label className="label">Dueño *</label>
              <select className="input" required value={form.ownerId} onChange={e => set('ownerId', e.target.value)}>
                <option value="">Selecciona un dueño</option>
                {owners.map(o => <option key={o.id} value={o.id}>{o.name} — {o.email}</option>)}
              </select>
              <Link to="/duenos/nuevo" className="text-xs text-teal-600 mt-1 inline-block hover:underline">+ Registrar nuevo dueño</Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Nombre *</label>
                <input className="input" required placeholder="ej. Luna" value={form.name} onChange={e => set('name', e.target.value)} />
              </div>
              <div>
                <label className="label">Especie *</label>
                <select className="input" value={form.species} onChange={e => set('species', e.target.value)}>
                  <option value="dog">Perro 🐶</option>
                  <option value="cat">Gato 🐱</option>
                  <option value="bird">Ave 🐦</option>
                  <option value="rabbit">Conejo 🐰</option>
                  <option value="other">Otro 🐾</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Raza</label>
                <input className="input" placeholder="ej. Labrador" value={form.breed} onChange={e => set('breed', e.target.value)} />
              </div>
              <div>
                <label className="label">Sexo</label>
                <select className="input" value={form.sex} onChange={e => set('sex', e.target.value)}>
                  <option value="male">Macho ♂</option>
                  <option value="female">Hembra ♀</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="label">Edad (años)</label>
                <input className="input" type="number" step="0.1" placeholder="3" value={form.age} onChange={e => set('age', e.target.value)} />
              </div>
              <div>
                <label className="label">Peso (kg)</label>
                <input className="input" type="number" step="0.1" placeholder="8.5" value={form.weight} onChange={e => set('weight', e.target.value)} />
              </div>
              <div>
                <label className="label">Color</label>
                <input className="input" placeholder="Dorado" value={form.color} onChange={e => set('color', e.target.value)} />
              </div>
            </div>

            <div>
              <label className="label">Notas</label>
              <textarea className="input" rows={3} placeholder="Alergias, condiciones especiales..."
                value={form.notes} onChange={e => set('notes', e.target.value)} />
            </div>

            <div className="flex gap-3">
              <button type="button" onClick={() => navigate('/mascotas')} className="btn-outline flex-1">Cancelar</button>
              <button type="submit" disabled={saving} className="btn-primary flex-1">
                {saving ? 'Guardando...' : isEdit ? 'Actualizar' : 'Registrar mascota'}
              </button>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}
