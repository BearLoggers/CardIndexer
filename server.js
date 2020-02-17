const nunjucks = require('nunjucks');
const express = require("express");
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.use(express.static('public'));

app.get('/', (req, res) => {
    let cards = require('./json/cards.json');
    res.render('index.html', { cards });
});

app.get('/print', (req, res) => {
    let cards = require('./json/cards.json');
    res.render('print.html', { cards });
});

app.get('/edit/:id', (req, res) => {
    // Конвертация в число или NaN
    let id = +req.params.id;
    if (isNaN(req.params.id)) return res.sendStatus(400);

    let cards = require('./json/cards.json');
    let card = cards.find(x => x.id == id);

    if (!card) return res.sendStatus(400);

    res.render('edit.html', { card });
});

app.post('/postcard', (req, res) => {
    console.log('Got body:', req.body);
    res.send({ok: true, error: null});
});

app.listen(3000, () => {
    console.log("App is listening at :3000");
});