import Joi from 'joi';

const create = Joi.object({
    candidateId: Joi.number().required(),
    voterId: Joi.number().required(),
    place: Joi.number().min(1).required()
});

const update = Joi.object({
    candidateId: Joi.number().required(),
    voterId: Joi.number().required(),
    place: Joi.number().min(1)
});

const remove = Joi.object({
    candidateId: Joi.number().required(),
    voterId: Joi.number().required(),
});

const find = Joi.object({
    candidateId: Joi.number(),
    voterId: Joi.number(),
    place: Joi.number()
});


const createMany = Joi.object({
    votes: Joi.array().items({
        candidateId: Joi.number().required(),
        voterId: Joi.number().required(),
        place: Joi.number().min(1).required()
    })
});



export default { create, update, remove, find, createMany};
