const express = require("express")
const { create } = require("express-handlebars")
const { v4: uuid } = require("uuid")
const Usuario = require("./model/Usuario.js")

//instancia de express.
const app = express()

//crear instancia de handlebars
const hbs = create({
	partialsDir: ["views/partials/"],
})

//configuramos express-handlebars como motor de plantilla del proyecto para renderizar vistas
app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")
app.set("views", __dirname + "/views")

//MIDDLEWARES

//permite procesar la información enviada por el body (payload) en un request.
app.use(express.json())

//establecemos el directorio public en modo público.
app.use(express.static("public"))

//publicamos carpeta dist de boostrap
app.use(
	"/bootstrap",
	express.static(__dirname + "/node_modules/bootstrap/dist/")
)

//indicamos el puerto por el cual nuestro servidor escuchará las peticiones
const PORT = 3000
app.listen(
	PORT,
	console.log("Servidor escuchando en http://localhost:" + PORT)
)

//RUTAS DE VISTAS
app.get(["/", "/home"], (req, res) => {
	res.render("home", {
		home: true
	})
})

app.get("/about", (req, res) => {
	res.render("about", {
		about: true
	})
})

app.get("/products", (req, res) => {
	res.render("products", {
		productos: ["Pera", "Manzana", "Sandia", "Naranja", "Melón"],
		products: true
	})
})

//VISTA ACTUALIZAR USUARIOS
app.get("/updateuser/:id", async (req, res) => {
	try {
		const { id } = req.params
		let usuario = new Usuario()
		let found = await usuario.findById(id)
		res.render("update_user", {
			usuario: found,
		})
	} catch (error) {
		res.render("update_user", {
			error: true,
		})
	}
})

app.get("/users", async (req, res) => {
	let usuario = new Usuario()
	let respuesta = usuario.findAll()
	respuesta
		.then((data) => {
			res.render("users", {
				usuarios: data.usuarios,
				users: true
			})
		})
		.catch((error) => {
			res.render("users", {
				error,
			})
		})
})

// get - usuarios/:id
app.put("/updateuser/:id", async (req, res) => {
	try {
		const { id } = req.params
		const { nombre, apellido, email } = req.body

		let usuario = new Usuario()
		let found = await usuario.findById(id)
		found.nombre = nombre
		found.apellido = apellido
		found.email = email

		let newUsuario = await usuario.update(found)
		res.send({
			code: 200,
			message: 'Usuario actualizado con exito'
		})
	}
	catch (error) {
		console.log(error)
		res.status(500).send({
			code: 500,
			message: "error al actualizar el usuario en la bd.",
		})
	}
})

//RUTAS DE ENDPOINTS

app.post("/usuarios", async (req, res) => {
	try {
		let { nombre, apellido, email } = req.body
		let id = uuid().slice(0, 6)
		let newUser = new Usuario(id, nombre, apellido, email)
		let respuesta = await newUser.save()
		res.status(201).send({ code: 201, message: respuesta })
	} catch (error) {
		console.log(error)
		res.status(500).send({
			code: 500,
			message: "error al guardar el usuario en la bd.",
		})
	}
})

app.delete("/usuarios/:id", async (req, res) => {
	try {
		const { id } = req.params
		let user = new Usuario()
		let respuesta = user.delete(id)
		res.status(200).send({ code: 200, message: respuesta })
	} catch (error) {
		console.log(error)
		res.status(500).send({
			code: 500,
			message: "error al eliminar el usuario en la bd.",
		})
	}
})
