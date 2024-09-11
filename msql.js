const bodyParser=require('body-parser');
const { Client } = require('pg');
const express =require('express');
const port=3000;
const app=express();
const path = require('path');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended:true}));
app.use(express.static(path.join(__dirname)));
app.use(express.json());

app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/registro.html');
});

app.get('/', (req,res)=>{
  res.sendFile(__dirname + '/index.html');
});


const dbclient = new Client({
  user: 'postgres',
  host: 'localhost',
  database: 'flota',
  password: '7020',
  port: 5432,
});

dbclient.connect()
  .then(() => console.log("Conectado a PostgreSQL"))
  .catch(err => console.error("Error de conexión", err.stack));

app.post('/procesarformulario', (req, res) => {
  console.log(req)
  console.log(res)
  const { nombre, telefono, correo, mensaje } = req.body;

  const query = `
    INSERT INTO contacto (nombre, telefono, correo, mensaje)
    VALUES ($1, $2, $3, $4)
  `;
  const values = [nombre, telefono, correo, mensaje];

  dbclient.query(query, values)
    .then(() => {
      res.send("Datos insertados correctamente.");
    })
    .catch(err => {
      console.error("Error al insertar los datos:", err.stack);
      res.status(500).send("Error al insertar los datos.");
    });
});


app.post('/contacto', (req, res) => {
  console.log(req)
  console.log(res)
  const { nombre, direccion, telefono, correo, password } = req.body;

  
  const query = `
    INSERT INTO usuario (nombre, direccion, telefono, email, password)
    VALUES ($1, $2, $3, $4, $5)
  `;
  const values = [nombre, direccion, telefono, correo, password];

  
  dbclient.query(query, values)
    .then(() => {
      res.send("Datos insertados correctamente.");
    })
    .catch(err => {
      console.error("Error al insertar los datos:", err.stack);
      res.status(500).send("Error al insertar los datos.");
    });
});


app.post('/login', (req, res) => {
  const { nombre, password } = req.body;

  
  const query = 'SELECT * FROM usuario WHERE nombre = $1 AND password = $2';
  const values = [nombre, password];

  dbclient.query(query, values)
      .then(result => {
          if (result.rows.length > 0) {
              
              res.send('Inicio de sesión exitoso');
          } else {
              
              res.send('Nombre de usuario o contraseña incorrectos');
          }
      })
      .catch(err => {
          console.error('Error al verificar las credenciales', err.stack);
          res.status(500).send('Error en el servidor');
      });
});


function burbuja(arr) {
  let n = arr.length;
  let swapped;
  do {
    swapped = false;
    for (let i = 0; i < n - 1; i++) {
      if (arr[i].nombre > arr[i + 1].nombre) {
        let temp = arr[i];
        arr[i] = arr[i + 1];
        arr[i + 1] = temp;
        swapped = true;
      }
    }
  } while (swapped);
  return arr;
}

// Ruta para mostrar los datos ordenados
app.get('/usuarios-ordenados', (req, res) => {
  const query = 'SELECT id_usuario, nombre, direccion, telefono, email FROM usuario';

  dbclient.query(query, (err, result) => {
    if (err) {
      console.error('Error al obtener datos:', err);
      res.status(500).send('Error al obtener datos.');
    } else {
      let usuarios = result.rows;

      // Aplicar el algoritmo de burbuja para ordenar los usuarios por nombre
      usuarios = burbuja(usuarios);

      // Renderizar la vista con los usuarios ordenados
      res.render('usuarios-ordenados', { usuarios });
    }
  });
});

app.set('view engine', 'ejs');




app.post('/login', (req, res) => {
  const { nombre, password } = req.body;



  console.log('Nombre:', nombre, 'Contraseña:', password);

  if (nombre === "usuarioValido" && password === "contraseñaValida") {
      res.json({ success: true });
  } else {
      res.json({ success: false, message: "Usuario o contraseña incorrectos" });
  }
});

app.post('/login', (req, res) => {
  const { nombre, password } = req.body;
  console.log('Datos recibidos: ', nombre, password);
  // El resto del código de verificación.
});




// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
  console.log("Servidor iniciado en http://localhost:3000");
});


