const nunjucks = require('nunjucks');
const fs = require('fs');
const express = require("express");
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const app = express();

const PORT = 80;

app.use(cookieParser());
app.use(bodyParser.json());

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

app.use(express.static('public'));

if (!fs.existsSync('./json/cards.json')) fs.writeFileSync('./json/cards.json', '[]', 'utf8');
let cards = require('./json/cards.json');

if (!fs.existsSync('./json/sources.json')) fs.writeFileSync('./json/sources.json', '{}', 'utf8');
let sources = require('./json/sources.json');

app.post('/secretpassword', (req, res) => {
    if (!req.body.password) return res.sendStatus(400);

    return res.cookie('totallyNotAPassword', req.body.password, {maxAge: 24 * 60 * 60 * 1000}).send({resp: 'ok then'});
});

app.get('*', (req, res, next) => {
    if (!req.cookies['totallyNotAPassword'])
        return res.render('password.html');

    if (req.cookies['totallyNotAPassword'] != 'b34rl0663r5')
        return res.render('password.html', { wrong: true });

    next();
});

app.post('*', (req, res, next) => {
    if (req.cookies['totallyNotAPassword'] != 'b34rl0663r5')
        return res.send({updatePage: true});

    next();
})

app.get('/exit', (req, res) => {
    res.clearCookie('totallyNotAPassword');
    return res.redirect('/');
});

app.get('/', (req, res) => {
    res.render('index.html', { cards, sources, sourcesArr: sourcesToArray() });
});

app.get('/print', (req, res) => {
    res.render('print.html', { cards, sources, sourcesArr: sourcesToArray() });
});

app.get('/edit/:id', (req, res) => {
    // Конвертация в число или NaN
    let id = +req.params.id;
    if (isNaN(id)) return res.sendStatus(400);

    let card = cards.find(x => x.id == id);

    if (!card) return res.sendStatus(400);

    res.render('edit.html', { card, sources, sourcesArr: sourcesToArray() });
});

app.get('/begins/:start', (req, res) => {
    let wordStart = req.params.start.toLocaleLowerCase();

    let filteredCards = cards.filter(x => {
        let a = x.title.toLocaleLowerCase().replace(/\u0301/gi, ''); // Удаляем знак ударения

        return a.startsWith(wordStart);
    });

    res.render('index.html', { cards: filteredCards, sources, sourcesArr: sourcesToArray(), filter: wordStart });
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

app.post('/postsource', (req, res) => {
    console.log('Got body:', req.body);
    let id = -1;
    do {
        id = Math.floor(Math.random() * 10000);
    }
    while(sources[id]);

    sources[id] = req.body;
    writeSources();

    res.send({ok: true, error: null, id});
});

app.post('/deletesource', (req, res) => {
    let id = +req.body.id;
    if (isNaN(id)) return res.sendStatus(400);

    delete sources[id];
    writeSources();

    res.send({ok: true, error: null});
});

app.listen(PORT, () => {
    console.log(`App is listening at :${PORT}`);
});

let writeCardsTimer = null;
function writeCards() {
    if (writeCardsTimer) clearTimeout(writeCardsTimer);

    sortBy(cards, "title");

    writeCardsTimer = setTimeout(() => {
        fs.writeFileSync('./json/cards.json', JSON.stringify(cards), "utf8");
    }, 200);
}

let writeSourcesTimer = null;
function writeSources() {
    if (writeSourcesTimer) clearTimeout(writeSourcesTimer);

    // sortBy(sources, "title");

    writeSourcesTimer = setTimeout(() => {
        fs.writeFileSync('./json/sources.json', JSON.stringify(sources), "utf8");
    }, 200);
}

function readCards() {
    cards = JSON.parse( fs.readFileSync('./json/cards.json', "utf8") );
}

function deepCopy(arr) {
    return JSON.parse(JSON.stringify(arr));
}

function sortBy(array, field) {
    array.sort((x,y) => {
        let a = x[field].toLocaleLowerCase();
        let b = y[field].toLocaleLowerCase();

        a = a.replace(/\u0301/gi, ''); // Удаляем знак ударения
        b = b.replace(/\u0301/gi, ''); // Удаляем знак ударения

        if (a > b) return 1;
        if (a == b) return 0;
        return -1;
    });
}

function sourcesToArray() {
    let arr = [];
    for (let id in sources) {
        let obj = {id, author: sources[id].author, title: sources[id].title};
        arr.push(obj);
    }

    return arr;
}