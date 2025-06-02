import express from 'express';
import { createClient } from 'redis';

const listProducts = [
    {
        id: 1,
        name: 'SuitCase 250',
        price: 50,
        stock: 4,
    },
    {
        id: 2,
        name: 'SuitCase 450',
        price: 100,
        stock: 10,
    },
    {
        id: 3,
        name: 'SuitCase 650',
        price: 350,
        stock: 2,
    },
    {
        id: 4,
        name: 'SuitCase 1050',
        price: 550,
        stock: 5,
    }
]

function getItemById(id) {
    return listProducts.find((value) => value.id === id)
}

const app = express();
const port = 1245;

const client = createClient();
client.on('error', (err) => console.log('Error connecting to Redis:', err));
client.on('connect', () => console.log('Connected to Redis'));

async function reserveStockById(itemId, stock) {
    await client.connect();
    await client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    return await client.get(`item.${itemId}`);
}

app.get('/list_products', (req, res) => {
    res.send(JSON.stringify(listProducts));
})

app.get('/list_products/:itemId', (req, res) => {
    const {itemId} = req.params;
    let item = getItemById(itemId);
    if (item === undefined) {
        res.send(JSON.stringify({'status': 'Product not found'}))
    }
    item.currentQuantity = getCurrentReservedStockById(itemId);
    res.send(JSON.stringify(item))
})

app.listen(port, () => console.log('Listening...'));
