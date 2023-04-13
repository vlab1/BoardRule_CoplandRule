import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
});

const update = Joi.object({
    id: Joi.number().required(),
    name: Joi.string(),
});

const remove = Joi.object({
    id: Joi.number().required(),
});

const find = Joi.object({
    id: Joi.number(),
    name: Joi.string(),
});

const generate = Joi.object({
    count: Joi.number().required()
});

const createMany = Joi.object({
    voters: Joi.array().items({
        name: Joi.string().required()
    })
});


export default { create, update, remove, find, generate, createMany};
