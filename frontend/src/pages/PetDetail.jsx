import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import Timeline from '../components/Timeline';
import api from '../api/client';

const SPECIES_ICON = { dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', other: '🐾' };

export default function PetDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [pet,      setPet]      = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState('timeline'); // timeline | vaccines | info
  const [showVaccineForm,  setShowVaccineForm]  = useState(false);
  const [showConsultForm,  setShowConsultForm]  = useState(false);

  const loadPet = async () => {
    try {
      const [petRes, tlRes] = await Promise.all([
        api.get(`/pets/${id}`),
        api.get(`/pets/${id}/consultations/timeline`),
      ]);
      setPet(petRes.data);
      setTimeline(tlRes.data);
    } catch { navigate('/mascotas'); }
    setLoading(false);
  };

  useEffect(() => { loadPet(); }, [id]);

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar a ${pet?.name}? Esta acción no se puede deshacer.`)) return;
    await api.delete(`/pets/${id}`);
    navigate('/mascotas');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-gray-400 animate-pulse">
      Cargando mascota...
    </div>
  );

  if (!pet) return null;

  const icon = SPECIES_ICON[pet.species] || '🐾';

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          {/* Breadcrumb */}
          <Link to="/mascotas" className="text-teal-600 text-sm hover:underline mb-6 inline-block">
            ← Volver a mascotas
          </Link>

          {/* Header mascota */}
          <div className="card mb-6 flex flex-col sm:flex-row gap-6 items-start">
            <div className="w-28 h-28 rounded-2xl overflow-hidden bg-gradient-to-br from-teal-100 to-emerald-100 flex items-center justify-center text-5xl flex-shrink-0">
              {pet.photo
                ? <img src={`/${pet.photo}`} alt={pet.name} className="w-full h-full object-cover" />
                : <span>{icon}</span>}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-start gap-3 flex-wrap">
                <h1 className="text-2xl font-extrabold text-gray-900">{pet.name}</h1>
                <span className="badge bg-teal-100 text-teal-700 text-sm">{icon} {pet.species}</span>
                <span className={`badge ${pet.sex === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'}`}>
                  {pet.sex === 'male' ? '♂ Macho' : '♀ Hembra'}
                </span>
              </div>
              {pet.breed && <p className="text-gray-500 mt-1">{pet.breed}</p>}

              <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-600">
                {pet.age    && <span>🎂 {pet.age} años</span>}
                {pet.weight && <span>⚖️ {pet.weight} kg</span>}
                {pet.color  && <span>🎨 {pet.color}</span>}
              </div>

              {pet.owner && (
                <div className="mt-3 text-sm">
                  <span className="text-gray-400">Dueño: </span>
                  <span className="font-medium text-gray-700">{pet.owner.name}</span>
                  {pet.owner.phone && <span className="text-gray-400 ml-2">· {pet.owner.phone}</span>}
                </div>
              )}
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Link to={`/mascotas/${id}/editar`} className="btn-outline text-sm py-1.5 px-3">Editar</Link>
              <button onClick={handleDelete} className="btn-danger text-sm py-1.5 px-3">Eliminar</button>
            </div>
          </div>

          {/* Acciones rápidas */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <button onClick={() => setShowConsultForm(true)} className="btn-primary text-sm">
              + Nueva consulta
            </button>
            <button onClick={() => setShowVaccineForm(true)} className="btn-outline text-sm">
              💉 Registrar vacuna
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
            {[
              { k: 'timeline', l: '📋 Historial' },
              { k: 'vaccines', l: '💉 Vacunas' },
              { k: 'info',     l: 'ℹ️ Datos' },
            ].map(t => (
              <button key={t.k} onClick={() => setTab(t.k)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.k ? 'bg-white shadow text-teal-700' : 'text-gray-500 hover:text-gray-700'
                }`}>
                {t.l}
              </button>
            ))}
          </div>

          {/* Contenido de tab */}
          {tab === 'timeline' && (
            <Timeline items={timeline} petId={id} onRefresh={loadPet} />
          )}

          {tab === 'vaccines' && (
            <VaccineList vaccines={pet.vaccines || []} petId={id} onRefresh={loadPet} />
          )}

          {tab === 'info' && (
            <div className="card">
              <h2 className="font-bold text-gray-800 mb-4">Datos completos</h2>
              <dl className="grid grid-cols-2 gap-4 text-sm">
                {[
                  ['ID', pet.id],
                  ['Nombre', pet.name],
                  ['Especie', pet.species],
                  ['Raza', pet.breed || '—'],
                  ['Edad', pet.age ? `${pet.age} años` : '—'],
                  ['Peso', pet.weight ? `${pet.weight} kg` : '—'],
                  ['Sexo', pet.sex === 'male' ? 'Macho' : 'Hembra'],
                  ['Color', pet.color || '—'],
                  ['Notas', pet.notes || '—'],
                ].map(([k, v]) => (
                  <div key={k}>
                    <dt className="text-xs text-gray-400 font-semibold uppercase">{k}</dt>
                    <dd className="font-medium text-gray-700">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Modal Consulta */}
        {showConsultForm && (
          <ConsultModal petId={id} onClose={() => setShowConsultForm(false)} onSaved={() => { setShowConsultForm(false); loadPet(); }} />
        )}

        {/* Modal Vacuna */}
        {showVaccineForm && (
          <VaccineModal petId={id} onClose={() => setShowVaccineForm(false)} onSaved={() => { setShowVaccineForm(false); loadPet(); }} />
        )}
      </main>
      <Footer />
    </>
  );
}

// ── VaccineList ──────────────────────────────────────────────────────────────
function VaccineList({ vaccines, petId, onRefresh }) {
  const del = async (id) => {
    if (!confirm('¿Eliminar esta vacuna?')) return;
    await api.delete(`/pets/${petId}/vaccines/${id}`);
    onRefresh();
  };

  if (vaccines.length === 0) return (
    <div className="text-center py-12 text-gray-400">
      <p className="text-4xl mb-2">💉</p>
      <p>No hay vacunas registradas</p>
    </div>
  );

  return (
    <div className="space-y-3">
      {vaccines.map(v => (
        <div key={v.id} className="card flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-600 flex items-center justify-center text-xl flex-shrink-0">
            💉
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-800">{v.name}</p>
            <div className="flex flex-wrap gap-3 text-xs text-gray-400 mt-0.5">
              <span>Aplicada: {new Date(v.appliedAt).toLocaleDateString('es-MX')}</span>
              {v.nextDueAt && <span className="text-amber-600 font-medium">Próxima: {new Date(v.nextDueAt).toLocaleDateString('es-MX')}</span>}
              {v.brand && <span>Marca: {v.brand}</span>}
              {v.appliedBy && <span>Vet: {v.appliedBy}</span>}
            </div>
          </div>
          <button onClick={() => del(v.id)} className="text-red-400 hover:text-red-600 text-xs font-medium">Eliminar</button>
        </div>
      ))}
    </div>
  );
}

// ── Modals ───────────────────────────────────────────────────────────────────
function ConsultModal({ petId, onClose, onSaved }) {
  const [form, setForm] = useState({
    type: 'consultation', title: '', description: '', diagnosis: '', treatment: '', vet: '',
    weight: '', temperature: '', date: new Date().toISOString().split('T')[0],
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.title || !form.date) return;
    setSaving(true);
    try {
      await api.post(`/pets/${petId}/consultations`, form);
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <ModalWrapper title="Nueva consulta / evento" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Tipo</label>
            <select className="input" value={form.type} onChange={e => set('type', e.target.value)}>
              <option value="consultation">Consulta</option>
              <option value="grooming">Estética</option>
              <option value="vaccine">Vacuna</option>
              <option value="surgery">Cirugía</option>
              <option value="emergency">Urgencia</option>
              <option value="checkup">Revisión</option>
            </select>
          </div>
          <div>
            <label className="label">Fecha *</label>
            <input className="input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Título / Motivo *</label>
          <input className="input" placeholder="ej. Revisión anual, Vacuna anti-rábica..."
            value={form.title} onChange={e => set('title', e.target.value)} />
        </div>
        <div>
          <label className="label">Descripción / Observaciones</label>
          <textarea className="input" rows={2} value={form.description} onChange={e => set('description', e.target.value)} />
        </div>
        <div>
          <label className="label">Diagnóstico</label>
          <textarea className="input" rows={2} value={form.diagnosis} onChange={e => set('diagnosis', e.target.value)} />
        </div>
        <div>
          <label className="label">Tratamiento</label>
          <textarea className="input" rows={2} value={form.treatment} onChange={e => set('treatment', e.target.value)} />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="label">Veterinario</label>
            <input className="input" placeholder="Dr. García" value={form.vet} onChange={e => set('vet', e.target.value)} />
          </div>
          <div>
            <label className="label">Peso (kg)</label>
            <input className="input" type="number" step="0.1" value={form.weight} onChange={e => set('weight', e.target.value)} />
          </div>
          <div>
            <label className="label">Temp (°C)</label>
            <input className="input" type="number" step="0.1" value={form.temperature} onChange={e => set('temperature', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline flex-1">Cancelar</button>
          <button onClick={save} disabled={saving || !form.title} className="btn-primary flex-1">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function VaccineModal({ petId, onClose, onSaved }) {
  const [form, setForm] = useState({
    name: '', brand: '', lot: '', appliedAt: new Date().toISOString().split('T')[0],
    nextDueAt: '', appliedBy: '', notes: '',
  });
  const [saving, setSaving] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const save = async () => {
    if (!form.name || !form.appliedAt) return;
    setSaving(true);
    try {
      await api.post(`/pets/${petId}/vaccines`, form);
      onSaved();
    } finally { setSaving(false); }
  };

  return (
    <ModalWrapper title="Registrar vacuna" onClose={onClose}>
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Vacuna *</label>
            <input className="input" placeholder="ej. Anti-rábica" value={form.name} onChange={e => set('name', e.target.value)} />
          </div>
          <div>
            <label className="label">Marca</label>
            <input className="input" placeholder="ej. Nobivac" value={form.brand} onChange={e => set('brand', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Fecha aplicación *</label>
            <input className="input" type="date" value={form.appliedAt} onChange={e => set('appliedAt', e.target.value)} />
          </div>
          <div>
            <label className="label">Próxima dosis</label>
            <input className="input" type="date" value={form.nextDueAt} onChange={e => set('nextDueAt', e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="label">Lote</label>
            <input className="input" value={form.lot} onChange={e => set('lot', e.target.value)} />
          </div>
          <div>
            <label className="label">Aplicado por</label>
            <input className="input" placeholder="Dr. García" value={form.appliedBy} onChange={e => set('appliedBy', e.target.value)} />
          </div>
        </div>
        <div>
          <label className="label">Notas</label>
          <textarea className="input" rows={2} value={form.notes} onChange={e => set('notes', e.target.value)} />
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onClose} className="btn-outline flex-1">Cancelar</button>
          <button onClick={save} disabled={saving || !form.name} className="btn-primary flex-1">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}

function ModalWrapper({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto py-10">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-gray-900 text-lg">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
