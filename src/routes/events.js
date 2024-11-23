const router = require('express').Router();
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validateJWT } = require('../middlewares/validate-jwt');
const { validateFields } = require('../middlewares/validate-fields');
const { getEvents, createEvent, updateEvent, deleteEvent } = require('../controllers/events');

// Middlewares
router.use(validateJWT);

// Routes
router.get('/', getEvents);

router.post('/', [
    check('title', 'El título es obligatorio').not().isEmpty(),
    check('start', 'Fecha de inicio es obligatoria').custom(isDate),
    check('end', 'Fecha de finalización es obligatoria').custom(isDate),
    validateFields
], createEvent);

router.put('/:id', updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;