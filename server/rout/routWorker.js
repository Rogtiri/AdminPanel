import express from 'express'
import Worker from '../models/workerModel.js'
import Fuse from 'fuse.js'

const routWorker = new express.Router()

routWorker.get('/takeWorker', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = 5

        const [allWorker, sumWorker] = await Promise.all([
            Worker.find({status: 'Робочий'})
                  .sort({createdAt: -1})
                  .skip((page-1) * pageSize)
                  .limit(pageSize)
                  .select('-__v')
                  .lean(),
            Worker.countDocuments({status: 'Робочий'}) 
        ])
        
        res.send({
            allWorker: allWorker,
            sumWorker: sumWorker
        })
    } catch (error) {
       res.status(500).send({message: `Помилка відображення. ERROR: ${error}`})
    }
})
routWorker.get('/takeArhiveWorker', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = 5
        const [arhiveWorker, sumWorker] = await Promise.all([
            Worker.find({status: 'Архів'})
                  .sort({createdAt: -1})
                  .skip((page-1) * pageSize)
                  .limit(pageSize)
                  .select('-__v')
                  .lean(),
            Worker.countDocuments({status: 'Архів'}) 
        ])
        res.send({
            arhiveWorker: arhiveWorker,
            sumWorker: sumWorker
        })
    } catch (error) {
        res.status(500).send({message: `Помилка відображення. ERROR: ${error}`})
    }  
})

routWorker.get('/takeWorkerForEdit', async (req, res) => {
    try {
        const idWork = req.query.idWorker
        const worker = await Worker.findById(idWork)
        res.json(worker)
    } catch (error) {
        console.log(error)
        res.status(400).send({message: `ERROR: ${error}`})
    }
})

routWorker.delete('/deleteWorker/:id', async (req, res) => {
    try {
        const {id} = req.params
        await Worker.findByIdAndDelete(id)
        res.status(200).send({message: 'Успішно звільнений)'})
    } catch (error) {
        res.status(500).send({message: `Помилка видалення. ERROR: ${error}`})
    }
    
})

routWorker.post('/addNewWorker', async (req, res) => {
    try {
        const data = req.body
        const allField = Object.values(data).every(value => value && value.trim() !== '')
        if(!allField){
             res.status(400).send({message: 'Не всі поля заповнені'})
             return
        } 
        const newWorker = new Worker(data)
        await newWorker.save()
        res.status(200).send({
            newWorker,
            message: 'Додано нового працівника'
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({message: `Помилка додавання користувача. ERROR: ${error}`})
    }
})

routWorker.post('/sendEdit', async (req, res) => {
    try {
        const {editWorker, id} = req.body
        const oldWorkerInfo = await Worker.findById(id)
        // Перевірка на зміну данних
        const fieldsToCompare = ['name', 'surname', 'pobatkovi', 'phone', 'typeWorker', 'city', 'nameWorkType', 'stavka'];
        const isSame = fieldsToCompare.every(
            key => oldWorkerInfo[key]?.toString() === editWorker[key]?.toString()
        )
        if(isSame){
            return res.json({message: 'Ви не змінили дані',})
        }
        const newEdit = await Worker.findByIdAndUpdate(
            id,
            {$set: editWorker},
            {new: true}
        )
        res.json({
            message: 'Дані оновлено',
            newEdit: newEdit
        })
    } catch (error) {
        console.log(error)
        res.status(400).send({message: `ERROR: ${error}`})
    }
})

routWorker.post('/inArhive/:id', async (req, res) => {
    try {
        const {id} = req.params
        const findWorker = await Worker.findById(id)
        if(findWorker.status === 'Робочий'){
            findWorker.status = 'Архів'
        }
        await findWorker.save()
        res.status(200).send({message: 'Переведено до архіву'})
    } catch (error) {
        res.status(500).send({message: `Помилка архівування. ERROR: ${error}`})
    }
})
routWorker.post('/inWork/:id', async (req, res) => {
    try {
        const {id} = req.params
        const findWorker = await Worker.findById(id)
        if(findWorker.status === 'Архів'){
            findWorker.status = 'Робочий'
        }
        await findWorker.save()
        res.status(200).send({message: 'Переведено до роботи'})
    } catch (error) {
        res.status(500).send({message: `Помилка відновлення. ERROR: ${error}`})
    }
})

routWorker.post('/findForData', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = 5
        const {filterBody } = req.body

        const filter = {}
        if(filterBody ) {
            const start = new Date(filterBody  + 'T00:00:00')
            const end = new Date(filterBody  + 'T23:59:59.999')
            filter.createdAt = {$gte: start, $lte: end}
        }

        const find = await Worker.find({status: 'Робочий', ...filter})
        const sumOrder = await Worker.countDocuments({status: 'Робочий', ...filter})

        const start = (page - 1) * pageSize
        const pagination = find.slice(start, start + pageSize)

        res.json({
            filter: pagination,
            sum: sumOrder
        })

    } catch (error) {
        console.log(error)
        res.status(400).send({message: `ERROR: ${error}`})
    }
})

// Пошукова система
routWorker.post('/searchWorker', async (req, res) => {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = 5

        const {query, status, filterDate} = req.body
        // Якщо пошуковий запит пустий із урахуванням дати
        if (!query || query.trim() === '') {
            if (filterDate) {
                const start = new Date(filterDate + 'T00:00:00')
                const end = new Date(filterDate + 'T23:59:59.999')
                filterDate.createdAt = { $gte: start, $lte: end }
            }
            const [workers, total] = await Promise.all([
                Worker.find(filterDate)
                .sort({ createdAt: -1 })
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .select('-__v')
                .lean(),
                Worker.countDocuments(filterDate)
            ])

            return res.json({
                finalSearch: workers,
                sum: total,
                page
            })
        }
        let findFilter = {status}
        if (filterDate) {
            const start = new Date(filterDate + 'T00:00:00')
            const end = new Date(filterDate + 'T23:59:59.999')
            findFilter.createdAt = { $gte: start, $lte: end }
        }
        // пошук обраних полів
        const all = await Worker.find(findFilter, {
            name: 1,
            surname: 1,
            pobatkovi: 1,
            phone: 1,
            typeWorker: 1,
            nameWorkType: 1,
            stavka: 1,
            createdAt: 1,
        })
        
        const prepared = all.map((w) => ({
            ...w._doc,
            createdAt: w.createdAt.toISOString()
        }))
        // Параметри для пошуку fuse
        const options = {
            keys: ['name', 'surname', 'pobatkovi', 'phone', 'typeWorker', 'stavka', 'nameWorkType' ],
            threshold : 0.5
        }
        // Створюєио fuse 
        const fuse = new Fuse(prepared, options)
        // шукаємо
        const result = fuse.search(query)
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
        res.status(400).send({message: 'Помилка пошуку'})
    }
})



export default routWorker