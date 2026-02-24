import { Request, Response, NextFunction } from "express";
import Joi from "joi";

function validate(schema: Joi.ObjectSchema) {
    return (req: Request, res: Response, next: NextFunction): void => {
        const { error } = schema.validate(req.body, { abortEarly: false });
        if (error) {
            const errors = error.details.map((d) => d.message);
            res.status(422).json({ message: "Validation failed", errors });
            return;
        }
        next();
    };
}

export default validate;
