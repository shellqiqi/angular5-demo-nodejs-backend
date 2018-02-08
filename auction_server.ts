import * as express from 'express';
import * as path from 'path';
import {comments, products} from "./test_data/data";
import {Server} from "ws";

const app = express();

app.use('/', express.static(path.join(__dirname, '..', 'dist'))); // 静态页面根目录

app.get('/api/products', (req, res) => {
    let result = products;
    let params = req.query;

    if (params.title) {
        result = result.filter(p => p.title.indexOf(params.title) !== -1);
    }
    if (params.price && result.length > 0) {
        result = result.filter(p => p.price <= parseInt(params.price));
    }
    if (params.category && params.category != -1 && result.length > 0) {
        result = result.filter(p => p.categories.indexOf(params.category) !== -1);
    }

    res.json(result);
});

app.get('/api/product/:id', (req, res) => {
    res.json(products.find(product => product.id == req.params.id));
});

app.get('/api/product/:id/comments', (req, res) => {
   res.json(comments.filter(comment => comment.productId == req.params.id));
});

const server = app.listen(8000, 'localhost', () => {
    console.log('Server started, http://localhost:8000'); // http服务器地址
});

const subscriptions = new Map<any, number[]>(); // webSocket, productIds
const currentBids = new Map<number, number>(); // id, price

const wsServer = new Server({port: 8085}); // webSocket服务器端口
wsServer.on('connection', ws => {
    ws.on('message', message => {
        console.log(message);
        let jsonObj = JSON.parse(message.toString());
        let productIds = subscriptions.get(ws) || [];
        subscriptions.set(ws, [...productIds, jsonObj.productId]);
    });
    ws.on('close', data => {
        console.log(data);
    });
    ws.on('error', error => {
        console.log(error);
    });
});

setInterval(() => {

    products.forEach(p => {
        let currentBid = currentBids.get(p.id) || p.price;
        let newBid = currentBid + Math.random() * 5;
        currentBids.set(p.id, newBid);
    });

    subscriptions.forEach((productsId: number[], ws) => {
        if (ws.readyState === 1) {
            let newBids = productsId.map(pid => ({
                productId: pid,
                bid: currentBids.get(pid)
            }));
            ws.send(JSON.stringify(newBids));
        } else {
            subscriptions.delete(ws);
        }
    });

}, 2000);