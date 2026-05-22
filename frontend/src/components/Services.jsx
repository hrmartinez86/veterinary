const SERVICES = [
  {
    icon: '🩺',
    title: 'Consultas Médicas',
    desc: 'Diagnóstico y tratamiento por veterinarios certificados. Atención preventiva y de emergencias.',
    color: 'bg-blue-50 text-blue-600',
    border: 'border-blue-100',
  },
  {
    icon: '💉',
    title: 'Vacunación',
    desc: 'Esquema completo de vacunas para perros, gatos y más. Registro digital y recordatorios automáticos.',
    color: 'bg-teal-50 text-teal-600',
    border: 'border-teal-100',
  },
  {
    icon: '✂️',
    title: 'Estética y Grooming',
    desc: 'Baño, corte, peinado y cuidado de uñas. Dejamos a tu mascota radiante y perfumada.',
    color: 'bg-pink-50 text-pink-600',
    border: 'border-pink-100',
  },
  {
    icon: '🛒',
    title: 'Tienda de Productos',
    desc: 'Alimentos premium, accesorios, juguetes, antiparasitarios y suplementos vitamínicos.',
    color: 'bg-amber-50 text-amber-600',
    border: 'border-amber-100',
  },
  {
    icon: '🔬',
    title: 'Laboratorio Clínico',
    desc: 'Análisis de sangre, orina, cultivos y más con resultados el mismo día.',
    color: 'bg-purple-50 text-purple-600',
    border: 'border-purple-100',
  },
  {
    icon: '🏥',
    title: 'Cirugía y Hospitalización',
    desc: 'Quirófano equipado y área de recuperación con monitoreo 24/7.',
    color: 'bg-red-50 text-red-600',
    border: 'border-red-100',
  },
];

export default function Services() {
  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-14">
          <span className="text-teal-600 font-bold text-sm uppercase tracking-widest">Lo que ofrecemos</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mt-2">
            Nuestros Servicios
          </h2>
          <p className="text-gray-500 mt-3 max-w-xl mx-auto">
            Todo lo que tu mascota necesita en un solo lugar, con la más alta calidad y calidez.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map(s => (
            <div key={s.title} className={`rounded-2xl border ${s.border} p-6 hover:shadow-md transition-shadow`}>
              <div className={`w-12 h-12 rounded-xl ${s.color} flex items-center justify-center text-2xl mb-4`}>
                {s.icon}
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{s.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
