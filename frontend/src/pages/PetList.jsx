import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar  from '../components/Navbar';
import Footer  from '../components/Footer';
import api     from '../api/client';

const SPECIES_ICON = { dog: '🐶', cat: '🐱', bird: '🐦', rabbit: '🐰', other: '🐾' };
const SPECIES_LABEL = { dog: 'Perro', cat: 'Gato', bird: 'Ave', rabbit: 'Conejo', other: 'Otro' };

export default function PetList() {
  const [pets,     setPets]     = useState([]);
  const [owners,   setOwners]   = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [ownerFilter, setOwnerFilter] = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (ownerFilter) params.ownerId = ownerFilter;
      const [petsRes, ownersRes] = await Promise.all([
        api.get('/pets', { params }),
        api.get('/owners'),
      ]);
      setPets(petsRes.data);
      setOwners(ownersRes.data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, [ownerFilter]);

  const filtered = pets.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.breed || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-10">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Mascotas registradas</h1>
              <p className="text-gray-500 text-sm">{filtered.length} mascota{filtered.length !== 1 ? 's' : ''}</p>
            </div>
            <div className="flex gap-3 flex-wrap">
              <Link to="/mascotas/nueva" className="btn-primary text-sm">+ Nueva mascota</Link>
              <Link to="/duenos" className="btn-outline text-sm">Gestionar dueños</Link>
            </div>
          </div>

          {/* Filtros */}
          <div className="flex gap-3 mb-6 flex-wrap">
            <input className="input max-w-xs" placeholder="Buscar por nombre o raza..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <select className="input max-w-xs" value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}>
              <option value="">Todos los dueños</option>
              {owners.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-gray-200 animate-pulse h-48" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-5xl mb-3">🐾</p>
              <p className="font-medium">No hay mascotas registradas</p>
              <Link to="/mascotas/nueva" className="mt-4 inline-block btn-primary">Registrar mascota</Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map(pet => (
                <Link key={pet.id} to={`/mascotas/${pet.id}`}
                  className="card hover:shadow-md transition-shadow group">
                  {/* Foto */}
                  <div className="h-32 rounded-xl overflow-hidden bg-gradient-to-br from-teal-100 to-emerald-100 mb-3 flex items-center justify-center text-5xl">
                    {pet.photo
                      ? <img src={`/${pet.photo}`} alt={pet.name} className="w-full h-full object-cover"
                          onError={e => { e.target.style.display='none'; e.target.nextSibling.style.display='flex'; }} />
                      : null}
                    <span>{SPECIES_ICON[pet.species] || '🐾'}</span>
                  </div>

                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{pet.name}</h3>
                      <p className="text-xs text-gray-500">{pet.breed || SPECIES_LABEL[pet.species]}</p>
                    </div>
                    <span className="badge bg-teal-100 text-teal-700">{SPECIES_ICON[pet.species]}</span>
                  </div>

                  <div className="flex gap-3 mt-3 text-xs text-gray-400">
                    {pet.age && <span>🎂 {pet.age} años</span>}
                    {pet.weight && <span>⚖️ {pet.weight} kg</span>}
                  </div>

                  {pet.owner && (
                    <p className="text-xs text-gray-400 mt-2 truncate">👤 {pet.owner.name}</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
