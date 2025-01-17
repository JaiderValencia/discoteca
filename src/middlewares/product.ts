import { Request, Response, NextFunction } from 'express'
import db from '../db'
import { body, validationResult } from 'express-validator'

export const hasFields = [
    body('name')
        .notEmpty().withMessage('Name field must not be empty').bail()
        .isLength({ min: 2 }).withMessage('Name fild must have more letter').bail()
        .custom(async (value) => {
            const product = await db.query.Product.findFirst({
                where: ({ name }, { eq }) => (
                    eq(name, value)
                )
            })

            if (product) {
                return Promise.reject('This name is already in use')
            }

            return true
        }),
    body('price')
        .notEmpty().withMessage('Price field must not be empty').bail()
        .isNumeric().withMessage('Price field must be a number')
]

export const hasErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).send(errors.mapped())
        return
    }

    next()
}

export const isExist = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params?.id)

    const product = await db.query.Product.findFirst({
        where: ({ id: productId }, { eq }) => (
            eq(productId, id)
        ),
    })

    if (!product) {
        res.status(404).send({
            statusCode: 404,
            message: 'Product not foun'
        })
        return
    }

    next()
}