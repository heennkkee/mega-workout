const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const app = express();

const port = 80;

app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: path.join(__dirname, 'views/layouts')
}));


app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, 'views'));


// Cookie middleware
app.use(cookieParser());

//Static files
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    // console.log('cookies: ', req.cookies);
    // console.log(Object.keys(req));
    // console.log(req.url);
    next();
});

app.get('/', (req, res) => {
    res.render('card', {
        title: 'Hem',
        cardTitle: 'Testkort',
        cardText: 'Hejsan'
    });
});

app.get('/ovningar', (req, res) => {
    res.render('table', {
        title: 'Övningar',
        headers: '<tr><th>Titel</th><th>Igen</th><th>Tre</th></tr>',
        rows: '<tr><td class="mdl-data-table__cell--non-numeric">Test</td><td class="mdl-data-table__cell--non-numeric">Hej</td><td class="mdl-data-table__cell--non-numeric">Idag</td></tr>',
        addButton: true
    });
});

app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send('Something broke!');
});

app.listen(port, (err) => {
    if (err) {
        return console.log('someting bad happened', err);
    }
    console.log(`server is listening on port ${port}`);
})
