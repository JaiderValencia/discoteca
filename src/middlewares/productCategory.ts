import { Request, Response, NextFunction } from 'express'
import { body } from 'express-validator'
import db from '../db'

export const hasFields = [body('name')
    .notEmpty().withMessage('Name field must not be empty').bail()
    .custom(async value => {
        const category = await db.query.ProductCategory.findFirst({
            where: ({ name }, { eq }) => (
                eq(name, value)
            )
        })

        if (category) {
            return Promise.reject('This name is already in use')
        }

        return true
    })]

export const isExist = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params?.id)

    const category = await db.query.ProductCategory.findFirst({
        where: ({ id: categoryId }, { eq }) => (
            eq(categoryId, id)
        )
    })

    if (!category) {
        res.status(404).send({
            statusCode: 404,
            message: 'Category not found'
        })
        return
    }

    next()
}