const path = require('path');
const { Pet, Owner, Vaccine, Consultation } = require('../models');

exports.list = async (req, res, next) => {
  try {
    const where = {};
    if (req.query.ownerId) where.ownerId = req.query.ownerId;
    const pets = await Pet.findAll({
      where,
      include: [{ model: Owner, as: 'owner', attributes: ['id','name','phone','email'] }],
      order: [['name','ASC']],
    });
    res.json(pets);
  } catch (e) { next(e); }
};

exports.get = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id, {
      include: [
        { model: Owner, as: 'owner' },
        { model: Vaccine, as: 'vaccines', order: [['appliedAt', 'DESC']] },
        { model: Consultation, as: 'consultations', order: [['date', 'DESC']] },
      ],
    });
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    res.json(pet);
  } catch (e) { next(e); }
};

exports.create = async (req, res, next) => {
  try {
    const { ownerId, name, species, breed, age, weight, sex, color, notes } = req.body;
    if (!ownerId || !name) return res.status(400).json({ error: 'ownerId y name son requeridos' });
    const photo = req.file ? `uploads/${req.file.filename}` : null;
    const pet = await Pet.create({ ownerId, name, species, breed, age, weight, sex, color, notes, photo });
    res.status(201).json(pet);
  } catch (e) { next(e); }
};

exports.update = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    if (req.file) req.body.photo = `uploads/${req.file.filename}`;
    await pet.update(req.body);
    res.json(pet);
  } catch (e) { next(e); }
};

exports.remove = async (req, res, next) => {
  try {
    const pet = await Pet.findByPk(req.params.id);
    if (!pet) return res.status(404).json({ error: 'Mascota no encontrada' });
    await pet.destroy();
    res.json({ message: 'Eliminado' });
  } catch (e) { next(e); }
};
