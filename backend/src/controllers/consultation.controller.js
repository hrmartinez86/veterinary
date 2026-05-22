const { Consultation, Pet } = require('../models');

exports.listByPet = async (req, res, next) => {
  try {
    const consultations = await Consultation.findAll({
      where: { petId: req.params.petId },
      order: [['date', 'DESC']],
    });
    res.json(consultations);
  } catch (e) { next(e); }
};

exports.timeline = async (req, res, next) => {
  try {
    const { Vaccine } = require('../models');
    const petId = req.params.petId;

    const [consultations, vaccines] = await Promise.all([
      Consultation.findAll({ where: { petId }, order: [['date', 'DESC']] }),
      Vaccine.findAll({ where: { petId }, order: [['appliedAt', 'DESC']] }),
    ]);

    const items = [
      ...consultations.map(c => ({
        id:          `c-${c.id}`,
        kind:        'consultation',
        type:        c.type,
        title:       c.title,
        date:        c.date,
        description: c.description,
        diagnosis:   c.diagnosis,
        treatment:   c.treatment,
        vet:         c.vet,
        weight:      c.weight,
        temperature: c.temperature,
        attachments: c.attachments,
      })),
      ...vaccines.map(v => ({
        id:        `v-${v.id}`,
        kind:      'vaccine',
        type:      'vaccine',
        title:     v.name,
        date:      v.appliedAt,
        brand:     v.brand,
        lot:       v.lot,
        nextDueAt: v.nextDueAt,
        appliedBy: v.appliedBy,
        notes:     v.notes,
      })),
    ];

    items.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(items);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findByPk(petId);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });

    const { type, title, description, diagnosis, treatment, vet, weight, temperature, date } = req.body;
    if (!title || !date) return res.status(400).json({ error: 'title y date son requeridos' });

    const consultation = await Consultation.create({
      petId, type, title, description, diagnosis, treatment, vet, weight, temperature, date,
    });
    res.status(201).json(consultation);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) return res.status(404).json({ error: 'Consulta no encontrada' });
    await consultation.update(req.body);
    res.json(consultation);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const consultation = await Consultation.findByPk(req.params.id);
    if (!consultation) return res.status(404).json({ error: 'Consulta no encontrada' });
    await consultation.destroy();
    res.json({ message: 'Eliminado' });
  } catch (e) { next(e); }
};
