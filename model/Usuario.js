const { leerArchivo, escribirArchivo } = require("../utils/operaciones.js")

class Usuario {
	constructor (id, nombre, apellido, email) {
		this.id = id
		this.nombre = nombre
		this.apellido = apellido
		this.email = email
	}

	async findAll () {
		return await leerArchivo("personas.json")
	}

	async findById (id) {
		let data = await leerArchivo("personas.json")
		let found = data.usuarios.find((usuario) => usuario.id == id)
		return found
	}

	findByEmail (email) {
		console.log("Buscando usuario por email")
	}

	async save () {
		let data = await leerArchivo("personas.json")
		let usuario = {
			id: this.id,
			nombre: this.nombre,
			apellido: this.apellido,
			email: this.email,
		}
		data.usuarios.push(usuario)
		return await escribirArchivo("personas.json", data)
	}

	async update (usuario) {
		let data = await leerArchivo("personas.json")
		let result = await this.findById(usuario.id)
		let newUser = {
			id: result.id,
			nombre: usuario.nombre,
			apellido: usuario.apellido,
			email: usuario.email,
		}

		let findIdx = data.usuarios.findIndex(user => user.id === result.id)

		data.usuarios[findIdx] = newUser
		return await escribirArchivo("personas.json", data)
	}

	async delete (id) {
		let data = await leerArchivo("personas.json")
		let result = await this.findById(id)

		let findIdx = data.usuarios.findIndex(user => user.id === result.id)
		data.usuarios.splice(findIdx, 1)
		return await escribirArchivo("personas.json", data)
	}
}

module.exports = Usuario
