const deliveryController = require('./controllers/delivery-controller');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(express.json());
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");

app.get("/deliverycheap", (req, res) => {
    res.render("pages/delivery-cheap");
});
app.get("/deliveryroute", (req, res) => {
    res.render("pages/delivery-route");
});
app.post("/api/deliveryCheap", deliveryController.getCheapestDelivery);
app.post("/api/deliveryCost", deliveryController.getCostDelivery);
app.post("/api/deliveryPosible", deliveryController.getPosibleDelivery);
app.get("/", (req, res) => {
    res.render("pages/delivery-cost");
});
app.get("*", (req, res) => {
    res.render("pages/not-found");
});

app.listen(3000, ()=> {
    console.log("already done!");
});