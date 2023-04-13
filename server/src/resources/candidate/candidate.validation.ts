import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null),
});

const update = Joi.object({
    id: Joi.number().required(),
    name: Joi.string(),
    description: Joi.string().allow(null),
});

const remove = Joi.object({
    id: Joi.number().required(),
});

const find = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
    description: Joi.string().allow(null),
});

const generate = Joi.object({
    count: Joi.number().required(),
});

const createMany = Joi.object({
    candidates: Joi.array().items({
        name: Joi.string().required(),
        description: Joi.string().allow(null),
    })
});



export default { create, update, remove, find, generate, createMany};
