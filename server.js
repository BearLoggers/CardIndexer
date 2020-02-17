const nunjucks = require('nunjucks');
const express = require("express");
const app = express();

nunjucks.configure('views', {
    autoescape: true,
    express: app
});

app.get('/', (req, res) => {
    res.render('test.html', {name: "Vasya"});
});

app.use(express.static('public'));

app.listen(3000, () => {
    console.log("App is listening at :3000");
});