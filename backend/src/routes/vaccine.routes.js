const router = require('express').Router({ mergeParams: true });
const c = require('../controllers/vaccine.controller');

// mounted at /api/pets/:petId/vaccines
router.get('/',       c.listByPet);
router.post('/',      c.create);
router.put('/:id',    c.update);
router.delete('/:id', c.remove);

module.exports = router;
