const { request, response } = require('express');
const Event = require('../models/event');

const getEvents = async(req = request, res = response) => {
    const events = await Event.find({ user: req.uid })
                            .populate('user', 'name');

    res.json({
        ok: true,
        eventos: events
    });
};

const createEvent = async(req = request, res = response) => {
    const event = new Event(req.body);

    try {
        event.user = req.uid;

        const eventSaved = await event.save();

        res.json({
            ok: true,
            message: 'Crear evento',
            evento: eventSaved
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error en la BD'
        });
    }
};

const updateEvent = async(req = request, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);

        if(!event) {
            return res.status(404).json({
                ok: false,
                message: 'No existe un evento con ese id'
            });
        }

        if(event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio de editar este evento'
            });
        }

        const newEvent = { 
            ...req.body,
            user: uid 
        };

        const eventUpdated = await Event.findByIdAndUpdate(eventId, newEvent, { new: true });

        res.json({
            ok: true,
            evento: eventUpdated
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error en la BD'
        });
    }
};

const deleteEvent = async(req = request, res = response) => {
    const eventId = req.params.id;
    const uid = req.uid;

    try {
        const event = await Event.findById(eventId);

        if(!event) {
            return res.status(404).json({
                ok: false,
                message: 'No existe un evento con ese id'
            });
        }

        if(event.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                message: 'No tiene privilegio de eliminar este evento'
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({ ok: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            message: 'Ocurrio un error en la BD'
        });
    }
};

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
};