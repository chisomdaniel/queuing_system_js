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

(async () => {
    await client.connect();
})();

async function reserveStockById(itemId, stock) {
    await client.set(`item.${itemId}`, stock);
}

async function getCurrentReservedStockById(itemId) {
    return await client.get(`item.${itemId}`);
}

// reserveStockById(2, 3);
// getCurrentReservedStockById(2).then((value) => {
//     console.log('value is ', value);
// });

app.get('/list_products', (req, res) => {
    const newList = listProducts.map((obj) => {
        return {
            itemId: obj.id,
            itemName: obj.name,
            price: obj.price,
            initialAvailableQuantity: obj.stock
        }
    })
    res.send(JSON.stringify(newList));
})

app.get('/list_products/:itemId', async (req, res) => {
    const { itemId } = req.params;
    let item = getItemById(Number(itemId));
    if (item === undefined) {
        res.send(JSON.stringify({'status': 'Product not found'}))
    }
    item = {
        itemId: item.id,
        itemName: item.name,
        price: item.price,
        initialAvailableQuantity: item.stock,
        currentQuantity: await getCurrentReservedStockById(itemId)
    }
    // getCurrentReservedStockById(itemId).then((value) => {
    //     item.currentQuantity = value;
    //     res.send(JSON.stringify(item));
    // })
    res.send(JSON.stringify(item))
})

app.get('/reserve_product/:itemId', async (req, res) => {
    const { itemId } = req.params;
    let item = getItemById(Number(itemId));
    if (item === undefined) {
        res.send(JSON.stringify({'status': 'Product not found'}))
    }
    if (item && item.stock < 1) {
        res.send(JSON.stringify({'status': 'Not enough stock available', 'itemId': itemId}));
    } else {
        await reserveStockById(itemId, 1);
        res.send(JSON.stringify({'status': 'Reservation confirmed','itemId': itemId}));
    }
})

app.listen(port, () => console.log('Listening...'));
