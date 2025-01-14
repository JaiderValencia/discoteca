import { Request, Response, NextFunction } from 'express'

export const checkToken = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']
    if (!token) {
        res.status(401).send('Unauthorized')
        return
    }
    next()
}