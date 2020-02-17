const nunjucks = require('nunjucks');
const express = require("express");
const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app,
    noCache: true
});

const content = "Привет, это первое объяснение, которое уходит на много буков. Привет, это первое объяснение, которое уходит на много буков. Привет, это первое объяснение, которое уходит на много буков. Привет, это первое объяснение, которое уходит на много буков.";
const cards = [
    {
        title: "Слово 1", 
        content: content, 
        sources: [
            {author: "Танаев В.В.", title: "Книга Влада", link: "стр. 24 строка 20"},
            {author: "Зубенко М.П.", title: "Книга Пэтровича", link: "стр. 1337 строка 420"}
        ]
    },
    {
        title: "Слово 2", 
        subtitle: "В значении 'Кек'", 
        content: content,
        sources: [
            {author: "Танаев В.В.", title: "Книга Влада #2", link: "стр. 42 строка 2"},
            {author: "Зубенко М.П.", title: "Книга Пэтровича", link: "стр. 420 строка 12"}
        ]
    }
];

app.get('/', (req, res) => {
    res.render('viewer.html', { cards });
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("App is listening at :3000");
});