import { Request, Response } from 'express'
import { Product } from '../db/schema'
import { eq } from 'drizzle-orm'
import db from '../db'

export default {
    create: async (req: Request, res: Response) => {
        const newProduct: typeof Product.$inferInsert = {
            name: req.body.name,
            price: req.body.price
        }

        await db.insert(Product).values(newProduct)

        res.status(200).send({
            statusCode: 200,
            message: 'Product created'
        })
    },
    readById: async (req: Request, res: Response) => {
        const id = Number(req.params.id)

        const product = await db.query.Product.findFirst({
            where: ({ id: ProductId }, { eq }) => (
                eq(ProductId, id)
            )
        })

        if (!product) {
            res.status(404).send({
                statusCode: 404,
                message: 'Product not found'
            })
            return
        }

        res.status(200).send(product)
    },
    readByName: async (req: Request, res: Response) => {
        const name = String(req.query.name)

        const product = await db.query.Product.findFirst({
            where: ({ name: productName }, { eq }) => (
                eq(productName, name)
            )
        })

        if (!product) {
            res.status(404).send({
                statusCode: 404,
                message: 'Product not found'
            })
            return
        }

        res.status(200).send(product)
    },
    readAll: async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const offset = limit * (page - 1)

        const totalInDB = await db.$count(Product)

        const limitPage = Math.ceil(totalInDB / limit)

        if (page > limitPage) {
            res.status(404).send({
                statusCode: 404,
                message: 'Page not found'
            })
            return
        }

        const products = await db.select().from(Product).offset(offset).limit(limit)

        const next = (page >= 1 && products.length == limit && page < limitPage) ? `${req.protocol}://${req.get('host')}/api/product/?page=${(page + 1)}&limit=${limit}` : null
        const prev = (page > 1) ? `${req.protocol}://${req.get('host')}/api/product/?page=${(page - 1)}&limit=${limit}` : null

        res.status(200).send({
            next,
            prev,
            page,
            limit,
            limitPage,
            totalInDB,
            data: products
        })
    },
    update: async (req: Request, res: Response) => {
        const id = Number(req.params.id)

        const { name, price } = req.body

        await db.update(Product).set({ name, price }).where(eq(Product.id, id))

        res.status(200).send({
            statusCode: 200,
            message: 'Product updated'
        })
    },
    delete: async (req: Request, res: Response) => {
        const id = Number(req.params.id)

        await db.delete(Product).where(eq(Product.id, id))

        res.status(200).send({
            statusCode: 200,
            message: 'Product deleted'
        })
    }
}