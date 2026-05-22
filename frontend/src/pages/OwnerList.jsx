import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../api/client';

export default function OwnerList() {
  const [owners,  setOwners]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/owners', { params: search ? { search } : {} });
      setOwners(data);
    } catch { /* ignore */ }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    load();
  };

  const del = async (id, name) => {
    if (!confirm(`¿Eliminar a ${name}? También se eliminarán sus mascotas.`)) return;
    await api.delete(`/owners/${id}`);
    load();
  };

  return (
    <>
      <Navbar />
      <main className="pt-16 min-h-screen bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Dueños de mascotas</h1>
              <p className="text-gray-500 text-sm">{owners.length} registrado{owners.length !== 1 ? 's' : ''}</p>
            </div>
            <Link to="/duenos/nuevo" className="btn-primary text-sm">+ Nuevo dueño</Link>
          </div>

          <form onSubmit={handleSearch} className="flex gap-3 mb-6">
            <input className="input max-w-xs" placeholder="Buscar por nombre, email o teléfono..."
              value={search} onChange={e => setSearch(e.target.value)} />
            <button type="submit" className="btn-outline text-sm px-4">Buscar</button>
          </form>

          {loading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="rounded-xl bg-gray-200 animate-pulse h-16" />)}</div>
          ) : owners.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <p className="text-4xl mb-3">👤</p>
              <p>No hay dueños registrados</p>
              <Link to="/duenos/nuevo" className="mt-4 inline-block btn-primary">Registrar dueño</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {owners.map(o => (
                <div key={o.id} className="card flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-sm flex-shrink-0">
                    {o.name[0]?.toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-800">{o.name}</p>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-400">
                      <span>✉️ {o.email}</span>
                      {o.phone && <span>📞 {o.phone}</span>}
                      <span>🐾 {o.pets?.length || 0} mascota{(o.pets?.length || 0) !== 1 ? 's' : ''}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/duenos/${o.id}/editar`} className="text-xs btn-outline py-1 px-3">Editar</Link>
                    <button onClick={() => del(o.id, o.name)} className="text-xs text-red-500 border border-red-200 rounded-lg px-3 py-1 hover:bg-red-50 transition-colors">
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
