import express from 'express'
import Order from '../models/orderModels.js'
import Fuse from 'fuse.js'


const routOrder = express.Router()

// Відправка інфо про всі проекти з або без фільтрів
routOrder.get('/takeOrders', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = 5

        const {status, data} = req.query
        const filter = {}
        if(status) filter.status = status
        if(data) {
            const start = new Date(data)
            start.setHours(0, 0, 0, 0)

            const end = new Date(data)
            end.setHours(23, 59, 59, 999)
            filter.createdAt = {$gte: start, $lte: end}
        }

        const [ordersAll, total] = await Promise.all([
            Order.find(filter)
                 .sort({createdAt: -1})
                 .skip((page-1) * pageSize)
                 .limit(pageSize)
                 .select('-__v')
                 .lean(),

            Order.countDocuments(filter)
        ])
        res.json({
                orders: ordersAll,
                sum: total
            })
        
        
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `ERROR: ${error}`})
    }
})


routOrder.get('/takeOrderForEdit', async (req, res) => {
    try {
        const idOrder = req.query.idOrder
        const order = await Order.findById(idOrder)
        res.json(order)
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `ERROR: ${error}`})
    }
})




// Отримання інфо про проект та збереження в бд
routOrder.post('/createOrder', async (req, res) => {
    try {
        const newOrder = new Order(req.body)
        await newOrder.save()
        res.status(200).send({newOrder})
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `ERROR: ${error}`})
    }
})

routOrder.post('/sendEdit', async (req, res) => {
    try {
        const {editOrder, id} = req.body
        const oldOrder = await Order.findById(id)
        // Перевірка на зміну данних
        const fieldsToCompare = ['typeProject', 'name', 'phone', 'email', 'budjet', 'status'];
        const isSame = fieldsToCompare.every(
            key => oldOrder[key]?.toString() === editOrder[key]?.toString()
        )
        if(isSame){
            return res.json({message: 'Ви не змінили дані',})
        }
        const newEdit = await Order.findByIdAndUpdate(
            id,
            {$set: editOrder},
            {new: true}
        )
        res.json({
            message: 'Дані оновлено',
            newEdit: newEdit
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `ERROR: ${error}`})
    }
})

// Пошукова система
routOrder.post('/searchOrder', async (req, res) => {
    try {

        const page = Number(req.query.page) || 1
        const pageSize = 5
        const {query, filterBody = {}} = req.body
        
        const trimmedQuery = query.trim()

        const filter = {}
        if(filterBody.status) filter.status = filterBody.status
        if(filterBody.data) {
            const start = new Date(filterBody.data)
            start.setHours(0, 0, 0, 0)

            const end = new Date(filterBody.data)
            end.setHours(23, 59, 59, 999)
            filter.createdAt = {$gte: start, $lte: end}
        }
        // Якщо строка пошуку пуста повернути першу сторінку
        if (!trimmedQuery) {
            const [ordersAll, total] = await Promise.all([
                Order.find(filter)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select('-__v')
                .lean(),
                Order.countDocuments(filter)
            ])

            return res.json({
                finalSearch: ordersAll,
                sum: total,
                page
            })
        }
        // пошук обраних полів
        const all = await Order.find(filter, {
            typeProject: 1,
            name: 1,
            phone: 1,
            email: 1,
            budjet: 1,
            createdAt: 1,
            status: 1
        })
        
        const prepared = all.map((o) => ({
            ...o._doc,
            budjet: o.budjet.toString(),
            createdAt: o.createdAt.toISOString()
        }))
        // Параметри для пошуку fuse
        const options = {
            keys: ['typeProject', 'name', 'phone', 'email', 'status', 'budjet', 'createdAt'  ],
            threshold : 0.5
        }
        // Створюєио fuse 
        const fuse = new Fuse(prepared, options)
        // шукаємо
        const result = fuse.search(trimmedQuery)
        // Повертаємо знайдені елементи
        const finalSearch = result.map(r => r.item)
        const total = finalSearch.length

        const start = (page - 1) * pageSize 
        const pagination = finalSearch.slice(start, start + pageSize)
        res.json({
            finalSearch: pagination,
            sum: total,
            page
        })
    } catch (error) {
        res.status(500).send({message: 'Помилка пошуку'})
    }
})


export default routOrder