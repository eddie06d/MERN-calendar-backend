const router = require('express').Router();
const { check } = require('express-validator');
const { validateFields } = require('../middlewares/validate-fields');
const { createUser, loginUser, revalidateToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-jwt');

router.post('/new', [
    check('name', 'El nombre es obligatorio').not().isEmpty(),
    check('email', 'El email no es válido').isEmail(),
    check('password', 'El password debe tener como mínimo 6 caracteres').isLength({ min: 6 }),
    validateFields
], createUser);

router.post('/', [
    check('email', 'El email no es válido').isEmail(),
    check('password', 'El password debe tener como mínimo 6 caracteres').isLength({ min: 6 }),
    validateFields
], loginUser);

router.get('/renew', validateJWT, revalidateToken);

module.exports = router;