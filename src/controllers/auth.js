const { request, response } = require('express');
const bcrypt = require('bcryptjs');
const { generateJWT } = require('../helpers/jwt');
const User = require('../models/user');

const createUser = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if(user) {
            return res.status(400).json({
                ok: false,
                message: `Ya existe un usuario con el correo ${ email }`
            });
        }

        user = new User(req.body);

        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync(password, salt);

        await user.save();

        const token = generateJWT(user.id, user.name);

        res.status(201).json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrió un error en la BD'
        });
    }
};

const loginUser = async(req = request, res = response) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if(!user) {
            return res.status(400).json({
                ok: false,
                message: `No existe un usuario con el correo ${ email }`
            });
        }

        const validPassword = bcrypt.compareSync(password, user.password);

        if(!validPassword) {
            return res.status(400).json({
                ok: false,
                message: 'Contraseña incorrecta'
            });
        }

        const token = generateJWT(user.id, user.name);

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrió un error en la BD'
        });
    }
};

const revalidateToken = (req = request, res = response) => {
    const { uid, name } = req;

    const token = generateJWT(uid, name);

    res.json({
        ok: true,
        token
    });
};

module.exports = {
    createUser,
    loginUser,
    revalidateToken
};