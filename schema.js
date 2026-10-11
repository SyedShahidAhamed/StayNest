const joi=require("joi");
const schema=joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        image:joi.string().required().allow("",null),
        price:joi.string().required().min(0),
        location:joi.string().required(),
        country:joi.string().required(),
});

const reviewSchema=joi.object({
        rating:joi.number().required().min(1).max(5),
        comments:joi.string().required(),
});
module.exports={schema,reviewSchema};