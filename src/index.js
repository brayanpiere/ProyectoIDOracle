const express = require('express');
const session = require('express-session');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

app.set('view engine','ejs');
app.use(session({
    secret :'123456789',
    resave : false,
    saveUninitialized : false
}));
app.set('views', path.join(__dirname, '../views'))
const router = require('../routes/routes.js')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended :true
}))
app.use(express.static('assets'));
/** configuraciones*/
app.set('port', 2020);

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));
app.use(router);

app.listen(app.get('port'),()=>{
    console.log('Server status 200 en port 2020');
})
