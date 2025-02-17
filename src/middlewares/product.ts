import { Request, Response, NextFunction } from 'express'
import db from '../db'
import { body } from 'express-validator'

export const hasFields = [
    body('name')
        .notEmpty().withMessage('Name field must not be empty').bail()
        .isLength({ min: 2 }).withMessage('Name fild must have more letter').bail(),
    body('price')
        .notEmpty().withMessage('Price field must not be empty').bail()
        .isNumeric().withMessage('Price field must be a number'),
    body('category_id')
        .notEmpty().withMessage('Category field must not be empty').bail()
        .custom(async (value) => {
            const category = await db.query.ProductCategory.findFirst({
                where: ({ id: categoryId }, { eq }) => (
                    eq(categoryId, value)
                ),
            })

            if (!category) return Promise.reject('Category not found')

            return true
        })
]

export const validateNameToCreate = body('name').custom(async value => {
    const product = await db.query.Product.findFirst({
        where: ({ name }, { eq }) => (
            eq(name, value)
        ),
    })

    if (product) return Promise.reject('Name already exist')

    return true
})

export const validateNameToUpdate = body('name').custom(async (value, { req }) => {
    const paramId = Number(req.params?.id)

    if (!paramId) {
        return true
    }

    const product = await db.query.Product.findFirst({
        where: ({ name, id }, { eq, and, ne }) => (
            and(
                eq(name, value),
                ne(id, paramId)
            )
        ),
    })

    if (product) return Promise.reject('Name is already in use')

    return true
})

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
            message: 'Product not found'
        })
        return
    }

    next()
}