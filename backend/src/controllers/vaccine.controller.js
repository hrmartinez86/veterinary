const { Vaccine, Pet } = require('../models');

exports.listByPet = async (req, res, next) => {
  try {
    const vaccines = await Vaccine.findAll({
      where: { petId: req.params.petId },
      order: [['appliedAt', 'DESC']],
    });
    res.json(vaccines);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { petId } = req.params;
    const pet = await Pet.findByPk(petId);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });

    const { name, brand, lot, appliedAt, nextDueAt, appliedBy, notes } = req.body;
    if (!name || !appliedAt) return res.status(400).json({ error: 'name y appliedAt son requeridos' });

    const vaccine = await Vaccine.create({ petId, name, brand, lot, appliedAt, nextDueAt, appliedBy, notes });
    res.status(201).json(vaccine);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Vacuna no encontrada' });
    await vaccine.update(req.body);
    res.json(vaccine);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const vaccine = await Vaccine.findByPk(req.params.id);
    if (!vaccine) return res.status(404).json({ error: 'Vacuna no encontrada' });
    await vaccine.destroy();
    res.json({ message: 'Eliminado' });
  } catch (e) { next(e); }
};
