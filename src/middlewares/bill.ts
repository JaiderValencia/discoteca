import { Request, Response, NextFunction } from 'express'
import db from '../db'
import { body } from 'express-validator'
import { ProductOnBill } from '../utils/bill'
import { count, eq } from 'drizzle-orm'
import { Product, BillhasProducts } from '../db/schema'

export const hasFields = [
    body('note')
        .isString().withMessage('Note field must be a string').bail()
        .custom((value: String) => {

            if (value != '' && value.length < 3) {
                return Promise.reject('Note field needs a long text')
            }

            return true
        }),
    body('table_id')
        .notEmpty().withMessage('client table ID is required').bail()
        .custom(async (value) => {
            const client_table = await db.query.Client_table.findFirst({
                where: ({ id, active }, { eq, and }) => (and(
                    eq(id, value),
                    eq(active, true)
                ))
            })

            if (!client_table) {
                return Promise.reject('The client table ID does not exist or is inactive')
            }

            return true
        }),
    body('products')
        .notEmpty().withMessage('Products field is required').bail()
        .isArray({ min: 1 }).withMessage('Products field must be an array with one or more elements').bail()
        .custom(async (products: ProductOnBill[]) => {
            const seenIds = new Set<number>()

            for (const actualProduct of products) {
                const productExist = (await db.select({ count: count() }).from(Product).where(eq(Product.id, actualProduct.product_id)))[0].count

                if (!productExist) {
                    return Promise.reject(`Product ID #${actualProduct.product_id} do not exist`)
                }

                if (actualProduct.quantity < 1 || !Number(actualProduct.quantity)) {
                    return Promise.reject(`The quantity of the Product ID #${actualProduct.product_id} must be 1 or superior`)
                }

                if (seenIds.has(actualProduct.product_id)) {
                    return Promise.reject(`The products field must have one object per product`)
                }

                if (actualProduct.delete != true && actualProduct.delete != false) {
                    return Promise.reject(`The delete field of the Product ID #${actualProduct.product_id} must be a boolean`)
                }

                seenIds.add(actualProduct.product_id)
            }

            return true
        })
]

export const calculateTotal = async (req: Request, _: Response, next: NextFunction) => {
    let total = 0

    const products: ProductOnBill[] = req.body.products

    for (const product of products) {
        if (!product.delete) {
            const productFound = await db.query.Product.findFirst({
                where: ({ id }, { eq }) => (
                    eq(id, product.product_id)
                ),
                columns: { id: false, name: false, price: true }
            })

            total += Number(productFound?.price) * product.quantity
        }
    }

    req.body.total = total

    next()
}

export const checkProductsObjectDB = async (req: Request, res: Response, next: NextFunction) => {
    let products: ProductOnBill[] = req.body.products

    const idsOnDB: number[] = (await db.query.BillhasProducts.findMany({
        where: ({ bill_id }, { eq }) => (
            eq(bill_id, Number(req.params.id))
        ),
        columns: { product_id: true, bill_id: false, quantity: false }
    })).map(actual => actual.product_id)

    for (const idOnDB of idsOnDB) {
        if (!products.some(product => product.product_id == idOnDB)) {
            res.status(400).send({
                products: {
                    type: 'field',
                    msg: 'You must send the products field equals to database',
                    path: 'products',
                    location: 'body'
                }
            })

            return
        }
    }

    next()
}

export const updateProductsBill = async (req: Request, _: Response, next: NextFunction) => {
    const id = Number(req.params.id)

    const products: ProductOnBill[] = req.body.products

    for (const actualProduct of products) {
        if (actualProduct.delete) {
            await db.delete(BillhasProducts).where(eq(BillhasProducts.product_id, actualProduct.product_id))
            continue
        }

        const productFound = await db.query.BillhasProducts.findFirst({
            where: ({ product_id, bill_id }, { eq, and }) => (
                and(
                    eq(bill_id, id),
                    eq(product_id, actualProduct.product_id)
                )
            ),
        })

        if (productFound) {
            await db.update(BillhasProducts).set({ quantity: actualProduct.quantity })
            continue
        }

        await db.insert(BillhasProducts).values({
            bill_id: id,
            product_id: actualProduct.product_id,
            quantity: actualProduct.quantity
        })
    }


    next()
}

export const isExist = async (req: Request, res: Response, next: NextFunction) => {
    const id = Number(req.params?.id) || -1

    const billFound = await db.query.Bill.findFirst({
        where: (billTable, { eq }) => (eq(billTable.id, id))
    })

    if (!billFound) {
        res.status(404).send({
            statusCode: 404,
            message: 'Bill not found'
        })

        return
    }

    next()
}