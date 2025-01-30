import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const hasErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).send(errors.mapped())
        return
    }
    next()
}