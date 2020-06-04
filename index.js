const port = 8000;
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const axios = require('axios');
const cheerio = require('cheerio');
const request = require('request-promise');

const sassMiddleware = require('node-sass-middleware');

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'extended',
    prefix: '/css'
}))

app.use(express.urlencoded());
app.use(express.static('./assets'));
app.use(expressLayouts);

app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

app.set('view engine', 'ejs');
app.set('views', './views');

app.use('/', require('./routes/index'));

app.listen(port, (err)=>{
    if(err){console.log(`error: ${err}`); }

    console.log(`app up and running on port ${port}`);
})