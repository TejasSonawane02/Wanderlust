import Joi from "joi";

const listingSchema = Joi.object({
    listing : Joi.object({
    title: Joi.string().required().min(1).max(100),
    description: Joi.string().required().min(1).max(1000),
    price: Joi.number().required().min(0),
    location: Joi.string().required().min(1).max(100),
    country: Joi.string().required().min(1).max(100),
    image: Joi.string().allow("",null)
    }).required()
})

export { listingSchema };