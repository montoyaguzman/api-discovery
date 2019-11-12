//version inicial

var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

var path = require('path');
var movimientosV2 = require('./movimientosV2.json')
var user = require('./user.json')

var bodyParse = require('body-parser')
app.use(bodyParse.json())
app.use( (req, res, next)=> {
  res.header('Access-Control-Allow-Origin', '*'),
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

var requestjson =  require('request-json')
var urlClientesMLab = 'https://api.mlab.com/api/1/databases/jmontoya/collections/Customers?apiKey=GOLqWa850qO8tsdCUdby6eq9eKPInBkt'
var clienteMLab = requestjson.createClient(urlClientesMLab)


var baseURL = 'https://api.mlab.com/api/1/databases/jmontoya/collections/'
var apiKey = 'apiKey=GOLqWa850qO8tsdCUdby6eq9eKPInBkt'
var mlabUrl = ''


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

app.put('/v2/movimientos', (req, res) => {
  res.send('hemos recibido PUT en MOVIMIENTOS')
})


/*M LAB*/

app.get('/v3/customers', (req, res) => {
  clienteMLab.get('', (err, resM, body) => {
    if(err) {
      console.log('body: ', body)
    } else {
      res.send(body)
    }
  })
})

app.post('/v3/customers', (req, res) => {
  clienteMLab.post('' , req.body, (err, resM, body) => {
    res.send(body)
  })
})

app.post('/v4/login', (req, res) => {
  let email = req.body.email
  let password = req.body.password
  let query = `q={ "email":"${email}", "password":"${password}" }`

  clienteMLab = requestjson.createClient(`${baseURL}/users?${apiKey}&${query}`)
  console.log('url : ', `${baseURL}/users?${apiKey}&query`)

  clienteMLab.get('', (err, resM, body) => {
    if(!err) {
      if(body.length === 1) {
        res.status(200).send('¡Usuario válido!')
      } else {
        res.status(404).send('¡Usuario no encontrado!')
      }
    } else {
      console.log(body)
    }
  })

})



/*DOMICILIACIONES*/
app.post('/login', (req, res)=> {
  console.log('body', req.body)
  let email = req.body.email || ''
  let password = req.body.password || ''
  console.log(`email: ${email} - password: ${password}`)
  if(email === 'montoyaguzman7@gmail.com' && password === '1234') {
    res.status(200).send( { 
      code: 200, 
      message: 'login exitoso!', 
      login: true,
      email: 'montoyaguzman7@gmail.com',
      perfil: 'customer',
    })
    // perfil: 'manage',
  } else {
    res.status(404).send({ code: 404, message:'no encontrado', login: false})
  }
})

app.post('/signup', (req, res)=> {
  console.log('body', req.body)
  let user = req.body.user || {}
  console.log(`body.user: ${user}`)
  if(user) {
    res.status(200).send( { 
      code: 200, 
      message: 'registro exitoso!', 
    })
  } else {
    res.status(404).send({ code: 404, message:'no se realizo el registro', login: false})
  }
})





app.get('/v0.1/user', (req, res)=> {
  res.json(user)
})

app.get('/v0.1/user/:index', (req, res)=> {
  let indexElement = req.params.index - 1
  console.log('llegue...', indexElement)
  res.json(user[indexElement])
})

app.post('/v0.1/user', (req, res) => {
  let newUser = req.body
  user.push(newUser)
  res.send('Movimiento dado de alta')
  console.log(newUser)
})