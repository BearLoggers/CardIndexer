const nunjucks = require('nunjucks');
const fs = require('fs');
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

let cards = require('./json/cards.json');

app.get('/', (req, res) => {
    res.render('index.html', { cards });
});

app.get('/print', (req, res) => {
    res.render('print.html', { cards });
});

app.get('/edit/:id', (req, res) => {
    // Конвертация в число или NaN
    let id = +req.params.id;
    if (isNaN(id)) return res.sendStatus(400);

    let card = cards.find(x => x.id == id);

    if (!card) return res.sendStatus(400);

    res.render('edit.html', { card });
});

app.post('/postedit/:id', (req, res) => {
    // Конвертация в число или NaN
    let id = +req.params.id;
    if (isNaN(id)) return res.sendStatus(400);

    req.body.id = id;

    for (let i = 0; i < cards.length; i++) {
        if (cards[i].id == id) {
            cards[i] = req.body;
            console.log(req.body);
            writeCards();
            break;
        }
    }

    res.send({ok: true, error: null});
});

app.post('/postcard', (req, res) => {
    console.log('Got body:', req.body);
    do {
        req.body.id = Math.floor(Math.random() * 10000);
    }
    while(cards.find(x => x.id == req.body.id));

    cards.push(req.body);
    writeCards();

    res.send({ok: true, error: null});
});

app.post('/delete', (req, res) => {
    let id = +req.body.id;
    if (isNaN(id)) return res.sendStatus(400);

    cards = cards.filter(x => x.id != id);
    writeCards();

    res.send({ok: true, error: null});
});

app.listen(3000, () => {
    console.log("App is listening at :3000");
});

function writeCards() {
    fs.writeFileSync('./json/cards.json', JSON.stringify(cards), "utf8");
}

function readCards() {
    cards = JSON.parse( fs.readFileSync('./json/cards.json', "utf8") );
}