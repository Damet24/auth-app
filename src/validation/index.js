import {AuthValidationSchema} from './AuthValidationSchema.js'
function validate (schema)  {
    return function (req, res, next) {
        const { error } = schema.validate(req.body);
    
        if (error) {
            return res.status(400).json({data: error.details[0].message});
        }
    
        next()
    }
}

export {
    validate,
    AuthValidationSchema
}