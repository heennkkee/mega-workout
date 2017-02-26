const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const cookieParser = require('cookie-parser');

const data = require('./modules/data');

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
    data.query("SELECT * FROM OVNINGAR");
    data.fetch(function() {

        res.render('table', {
            title: 'Hem',
            headers: data.MDLTableHeaders([]),
            rows: data.MDLTableRows([]),
            addButton: true
        });
    });

});

app.get('/ovningar', (req, res) => {
    data.query("SELECT ID, NAMN FROM OVNINGAR");
    data.fetch(function() {
        res.render('table', {
            title: 'Övningar',
            rows: data.MDLTableRows([]),
            addButton: true
        });
    });
});

app.get('/ovningar/edit/:id', (req, res) =>  {
    var id = req.params.id;

    if (isNaN(id)) {
        res.render('card', {
            title: 'Övningar, edit',
            cardTitle: 'Övning saknas'
        });
    } else {
        data.query("SELECT ID, NAMN FROM OVNINGAR WHERE ID = $id");
        data.setParam('$id', id);
        data.fetch(() => {
            if (!data.isDataSet()) {
                res.render('card', {
                    title: 'Övningar, edit',
                    cardTitle: 'Övning saknas',
                    cardText: 'id: ' + req.params.id + ' finns ej.'
                });
            } else {
                res.render('card', {
                    title: 'Övningar, edit',
                    cardTitle: 'Redigera övning',
                    cardText: 'id: ' + req.params.id
                });
            }
        });
    }
});

app.get('/setup', (req, res) => {

    data.setup();

    res.render('card', {
        title: 'Setup',
        cardTitle: 'Setup',
        cardText: 'Skapande av tabeller utförd.'
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
