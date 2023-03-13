import express from 'express'
import {v4} from 'uuid'

const app = express()
app.use(express.json())
const port = 3000
const orders = []

const checkId = (request, response, next) => {
    const {id} = request.params
    const index = orders.findIndex(order => order.id === id)
    if(index < 0) {
        return response.status(404).json({error: "Order not found"})
    }
    request.orderId = id
    request.orderIndex = index
    next()
}

const methodRequisition = (request, response, next) => {
    const url = request.url
    const method = request.method
    console.log(`A url é ${url} e o método é ${method}`)
    next()
}

app.get("/order", methodRequisition, (request, response) => {
    return response.json(orders)
})

app.post("/order", methodRequisition, (request, response) => {
    const {order, clienteName, price, status} = request.body
    const newOrder = {id: v4(), order, clienteName, price, status}
    orders.push(newOrder)
    return response.status(201).json({message: "Pedido criado com sucesso", order})
})

app.put("/order/:id", checkId, methodRequisition, (request, response) => {
    const id = request.orderId
    const index = request.orderIndex
    const {order, clienteName, price, status} = request.body
    const attOrder = {id, order, clienteName, price, status}
    orders[index] = attOrder
    return response.status(200).json(attOrder)
})

app.delete("/order/:id", checkId, methodRequisition, (request, response) => {
    const index = request.orderIndex
    orders.splice(index, 1)
    return response.status(204).json()
})

app.get("/order/:id", checkId, methodRequisition, (request, response) => {
    const index = request.orderIndex
    return response.status(200).json(orders[index])
})

app.patch("/order/:id", checkId, methodRequisition, (request, response) => {
    const index = request.orderIndex
    const {id, order, clienteName, price, status} = orders[index]
    const newStatus = "Pronto"
    orders[index] = {id, order, clienteName, price, newStatus}
    return response.status(204).json()
    
})

app.listen(port, () => {console.log(`Sucessful start server in port ${port} 🚀`)})