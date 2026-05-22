const router = require('express').Router({ mergeParams: true });
const c = require('../controllers/consultation.controller');

// mounted at /api/pets/:petId/consultations
router.get('/',           c.listByPet);
router.get('/timeline',   c.timeline);
router.post('/',          c.create);
router.put('/:id',        c.update);
router.delete('/:id',     c.remove);

module.exports = router;
