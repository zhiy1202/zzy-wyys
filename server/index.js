const express = require('express');
const bodyParser = require('body-parser');
const router = require('./router/index')
const ejs = require('ejs')
const path = require('path')
const app = express()

app.listen(8080, function(res,rep) {
    console.log('服务已启动在 8080 端口');
})

app.use('/static',express.static('static'))
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use('/',router)
app.engine('.html',ejs.__express)
app.set('view engine','html')
app.set('views',path.join(__dirname, 'views'))

