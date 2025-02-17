import { Request, Response, NextFunction } from 'express'
import { validationResult, param } from 'express-validator'

export const hasErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).send(errors.mapped())
        return
    }
    next()
}

export const hasParamId = [
    param('id')
        .notEmpty().withMessage('Must have ID param').bail()
        .isNumeric().withMessage('ID param must be a number')
]