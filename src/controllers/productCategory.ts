import { Request, Response } from 'express'
import db from '../db'
import { ProductCategory } from '../db/schema'
import { eq } from 'drizzle-orm'

export default {
    create: async (req: Request, res: Response) => {
        const { name } = req.body

        await db.insert(ProductCategory).values({ name })

        res.status(200).send({
            statusCode: 200,
            message: 'Client table created'
        })
    },
    readAll: async (req: Request, res: Response) => {
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const offset = limit * (page - 1)

        const totalInDB = await db.$count(ProductCategory)

        const limitPage = Math.ceil(totalInDB / limit)

        if (page > limitPage) {
            res.status(404).send({
                statusCode: 404,
                message: 'Page not found'
            })
            return
        }

        const categories = await db.select().from(ProductCategory).offset(offset).limit(limit)

        const next = (page >= 1 && categories.length == limit && page < limitPage) ? `${req.protocol}://${req.get('host')}/api/product_category/?page=${(page + 1)}&limit=${limit}` : null
        const prev = (page > 1) ? `${req.protocol}://${req.get('host')}/api/product_category/?page=${(page - 1)}&limit=${limit}` : null

        res.status(200).send({
            next,
            prev,
            page,
            limit,
            limitPage,
            totalInDB,
            data: categories
        })
    },
    readOne: async (req: Request, res: Response) => {
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

        res.status(200).send(category)
    },
    update: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)
        const { name } = req.body

        await db.update(ProductCategory).set({ name }).where(eq(ProductCategory.id, id))

        res.status(200).json({
            statusCode: 200,
            message: 'Category updated'
        })
    },
    delete: async (req: Request, res: Response) => {
        const id = Number(req.params?.id)

        await db.delete(ProductCategory).where(eq(ProductCategory.id, id))

        res.status(200).json({
            statusCode: 200,
            message: 'category deleted'
        })
    }
}