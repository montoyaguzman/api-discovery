//version inicial

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

var path = require('path');
var movimientosV2 = require('./movimientosV2.json')

var bodyParse = require('body-parser')
app.use(bodyParse.json())


app.listen(port);

console.log('todo list RESTful API server started on: ' + port);

app.get('/', (req, res) => {
    // res.send('hemos recibido su peticion')
    res.sendFile(path.join(__dirname, 'index.html'))
})

app.post('/', (req, res)=>{
  res.send('hemos recibido su peticion POST')
})

app.put('/', (req, res) => {
  res.send('hemos recibido su peticion PUT')
})

app.delete('/', (req, res) => {
  res.send('hemos recibido su peticion DELETE')
})

app.get('/v1/customers/:customerId', (req, res) => {
  res.send(`id recibido: ${req.params.customerId}`)
})

app.get('/v2/customers', (req, res) => {
  res.send(`nombre: ${req.query.nombre}`)
})


/*V1*/
app.post('/v1/customers/:customerId', (req, res) => {
  res.send(`id recibido | POST: ${req.params.customerId}`)
})

app.put('/v1/customers/:customerId', (req, res) => {
  res.send(`id recibido | PUT: ${req.params.customerId}`)
})

app.delete('/v1/customers/:customerId', (req, res) => {
  res.send(`id recibido | DELETE: ${req.params.customerId}`)
})


/*JSON v1*/
app.get('/movimientos', (req, res)=> {
  res.sendFile(path.join(__dirname, 'movimientosV1.json'))
})

/*JSON v2*/
app.get('/v2/movimientos', (req, res)=> {
  res.json(movimientosV2)
})

/*JSON v2 with filters*/
app.get('/v2/movimientos/:index', (req, res)=> {
  let indexElement = req.params.index - 1
  res.json(movimientosV2[indexElement])
})

/*JSON v3 with query params*/
app.get('/v2/movimientosquery', (req, res)=> {
  console.log('query', req.query)
})

app.post('/v2/movimientos', (req, res) => {
  let nuevo = req.body
  nuevo.id = movimientosV2.length + 1
  movimientosV2.push(nuevo)
  console.log('nuevo: ', nuevo)
  res.send('Movimiento dado de alta')
})