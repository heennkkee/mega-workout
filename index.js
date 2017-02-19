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

app.use((req, res, next) => {
    //console.log('cookies: ', req.cookies);
    next();
});

app.use((req, res, next) => {
    // console.log(req);
    next();
});

app.get('/', (req, res) => {
    res.render('home', {
        name: 'John'
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
