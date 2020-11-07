const express      = require('express')
const app          = express()
const cors         = require('cors')
const bodyParser   = require('body-parser')
const cookieParser = require('cookie-parser');
const validator = require('express-validator');
const mysql        = require('mysql')
const myConnection = require('express-myconnection')
const configdata   = require('./confix')
const routes       = require('./route')
const moment       = require('moment')
const confix = require('./confix')
const fileUpload = require('express-fileupload')
const multer = require('multer')

require('dotenv').config()

const PORT = 3022;

app.use(cors())
app.use(
    bodyParser.urlencoded({
        limit: "50mb",
        extended: true
    })
);
app.use(
    bodyParser.json({
        limit: "50mb"
    })
);
app.use(cookieParser());
app.use(fileUpload());
var connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '12345678',
    port: 3306,
    database: 'sila-management',
   });

   connection.connect((err) => {
    if (err) {
        return console.error(err);
    }
});

app.use(myConnection(mysql, configdata.dbOption, "pool"));
routes(app);

app.listen(PORT, () => {
 console.log("ready server on http://128.199.179.127:" + PORT);
});

// d   = new Date()
// d2  = new Date()
// d.setDate(d.getDate() - 30)
// d2.setHours(d2.getHours() + 10)

d = moment().format('YYYY-MM-DD HH:mm:ss')
d2 = moment().add(2, 'month').format('YYYY/MM/DD')
d3 = moment().add(6, 'month').format('YYYY/MM/DD HH:mm:ss')
d4 = moment('Tue Sep 29 2020 18:50:10 GMT+0700').format('YYYY-MM-DD HH:mm:ss')
// d = d.toISOString().slice(0, 19).replace('T', ' ');
// d2 = d2.toISOString().slice(0, 19).replace('T', ' ');

// date = d.getDate()-1
console.log(d)
console.log(d2)
console.log(d3)
console.log(d4)
console.log(process.env.SPACES_ACCESS_KEY_ID)
console.log(process.env.SPACES_SECRET_ACCESS_KEY)
console.log(process.env.BUCKET_NAME)