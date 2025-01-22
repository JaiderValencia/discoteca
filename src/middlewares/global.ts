import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']
    if (!token) {
        res.status(401).send('Unauthorized')
        return
    }
    next()
}

export const hasErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).send(errors.mapped())
        return
    }
    next()
}