const express = require("express")
const app = express()
const mysql = require('mysql');
const myconn = require('express-myconnection');

const port = 4000

app.set('port', port)

app.use(myconn(mysql, {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'bibliotech'
}))

app.use(express.urlencoded({extended: true}))
app.use(express.json());

app.use('/api/libros', require('./routes/libros'))
app.use('/api/users', require('./routes/users'))

app.listen(app.get('port'), () => {
    console.log(`Server on port  ${app.get('port')}`)
})