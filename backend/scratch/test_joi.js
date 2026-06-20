import Joi from "joi";

const schema = Joi.object({
  name: Joi.string().required(),
});

const result = schema.validate(undefined || {});
console.log("Result for undefined || {}:", result.error ? result.error.message : "No error");

const resultNull = schema.validate(null);
console.log("Result for null:", resultNull.error ? resultNull.error.message : "No error");

const resultEmpty = schema.validate({});
console.log("Result for empty object:", resultEmpty.error ? resultEmpty.error.message : "No error");
