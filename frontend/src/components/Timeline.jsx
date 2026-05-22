const TYPE_CONFIG = {
  consultation: { icon: '🩺', color: 'bg-blue-100 text-blue-700',   border: 'border-blue-200',   label: 'Consulta'  },
  grooming:     { icon: '✂️', color: 'bg-pink-100 text-pink-700',   border: 'border-pink-200',   label: 'Estética'  },
  vaccine:      { icon: '💉', color: 'bg-teal-100 text-teal-700',   border: 'border-teal-200',   label: 'Vacuna'    },
  surgery:      { icon: '🔪', color: 'bg-red-100  text-red-700',    border: 'border-red-200',    label: 'Cirugía'   },
  emergency:    { icon: '🚨', color: 'bg-orange-100 text-orange-700', border: 'border-orange-200', label: 'Urgencia'  },
  checkup:      { icon: '📋', color: 'bg-gray-100 text-gray-700',   border: 'border-gray-200',   label: 'Revisión'  },
};

export default function Timeline({ items }) {
  if (items.length === 0) return (
    <div className="text-center py-14 text-gray-400">
      <p className="text-5xl mb-3">📋</p>
      <p>No hay eventos registrados aún</p>
    </div>
  );

  return (
    <div className="relative">
      {/* Línea vertical */}
      <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200" />

      <div className="space-y-6">
        {items.map((item, idx) => {
          const cfg = TYPE_CONFIG[item.type] || TYPE_CONFIG.consultation;

          return (
            <div key={item.id} className="relative flex gap-5 pl-14">
              {/* Icono en la línea */}
              <div className={`absolute left-0 w-10 h-10 rounded-full border-2 ${cfg.border} ${cfg.color} flex items-center justify-center text-base flex-shrink-0`}>
                {cfg.icon}
              </div>

              {/* Tarjeta */}
              <div className={`flex-1 bg-white rounded-2xl border ${cfg.border} shadow-sm p-4`}>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`badge ${cfg.color}`}>{cfg.label}</span>
                      <h3 className="font-bold text-gray-900">{item.title}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(item.date + 'T12:00:00').toLocaleDateString('es-MX', {
                        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
                      })}
                    </p>
                  </div>
                  {item.vet && (
                    <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">👨‍⚕️ {item.vet}</span>
                  )}
                </div>

                {/* Métricas (consultas) */}
                {(item.weight || item.temperature) && (
                  <div className="flex gap-3 mt-2">
                    {item.weight      && <span className="badge bg-gray-100 text-gray-600">⚖️ {item.weight} kg</span>}
                    {item.temperature && <span className="badge bg-gray-100 text-gray-600">🌡️ {item.temperature}°C</span>}
                  </div>
                )}

                {/* Métricas (vacunas) */}
                {item.kind === 'vaccine' && (
                  <div className="flex flex-wrap gap-3 mt-2">
                    {item.brand    && <span className="badge bg-teal-50 text-teal-600">Marca: {item.brand}</span>}
                    {item.lot      && <span className="badge bg-teal-50 text-teal-600">Lote: {item.lot}</span>}
                    {item.nextDueAt && (
                      <span className="badge bg-amber-50 text-amber-700">
                        Próxima: {new Date(item.nextDueAt + 'T12:00:00').toLocaleDateString('es-MX')}
                      </span>
                    )}
                    {item.appliedBy && <span className="text-xs text-gray-400">Aplicó: {item.appliedBy}</span>}
                  </div>
                )}

                {/* Cuerpo */}
                {item.description && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 font-semibold uppercase mb-1">Descripción</p>
                    <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.description}</p>
                  </div>
                )}
                {item.diagnosis && (
                  <div className="mt-3 bg-amber-50 rounded-xl p-3">
                    <p className="text-xs text-amber-600 font-semibold uppercase mb-1">🔍 Diagnóstico</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.diagnosis}</p>
                  </div>
                )}
                {item.treatment && (
                  <div className="mt-3 bg-green-50 rounded-xl p-3">
                    <p className="text-xs text-green-600 font-semibold uppercase mb-1">💊 Tratamiento</p>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{item.treatment}</p>
                  </div>
                )}
                {item.notes && (
                  <p className="text-sm text-gray-500 mt-2 italic">{item.notes}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
