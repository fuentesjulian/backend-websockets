// Importo filesystem
const { promises: fs } = require("fs");

// creo la clase Contenedor
class ContenedorProductos {
  // como constructor le pongo el nombre del archivo ej: productos
  constructor(name) {
    // guardo el nombre de la clase
    this.name = name;
    // guardo la ruta del archivo
    this.filePath = `./db/${this.name}.txt`;
  }

  // metodo para grabar un objeto
  async save(obj) {
    // corro getAll para obtener todos los items en forma de array
    const items = await this.getAll();
    // calculo el #id. Si el array tiene longitud, busco el id del ultimo item dentro de items
    // si el array tiene longitud cero (esta vacia) por default el id es 1
    const id = items.length > 0 ? items[items.length - 1].id + 1 : 1;
    // hago un spread del objeto y le agrego el id
    obj = { ...obj, id };
    // agrego el objeto al array de items
    items.push(obj);
    // convierto a string el array de items
    const data = JSON.stringify(items, null, 2);
    // corro las instrucciones para escribir el archivo
    try {
      await fs.writeFile(this.filePath, data);
      // el return es el id
      return id;
    } catch (error) {
      console.error(error);
    }
  }

  async getById(id) {
    // corro getAll para obtener todos los items en forma de array
    const items = await this.getAll();
    // hago un return con un find para que me devuelva el id
    // por las dudas hago un parseInt de id, es innecesario ahora,
    // pero puede que algun form envie el id como string
    // si no encuentra nada hago que retorne false, me parecio prolijo plantearlo asi
    return items.find((item) => item.id === parseInt(id)) ?? false;
  }

  async getRandom() {
    // corro getAll para obtener todos los items en forma de array
    const items = await this.getAll();
    // creo un random
    return items[Math.floor(items.length * Math.random())];
  }

  // hago un un método parecido al que explicó el profe en el after
  async getAll() {
    try {
      // leo el archivo
      const data = await fs.readFile(this.filePath, "utf-8");
      // si el archivo tiene datos hago el parse, si no tiene datos falla el parse y cae en el catch
      // aca hay una oportunidad de diferenciar la falla de lectura vs la falla del parseo...
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  async deleteById(id) {
    // corro getAll para obtener todos los items en forma de array
    let items = await this.getAll();
    // reemplazo el array de items por un array que no contenga el item con el id indicado
    // hago un parseInt por las dudas: puede que en el futuro reciba un string en vez q un int
    items = items.filter((item) => item.id != parseInt(id));
    // hago el JSON
    const data = JSON.stringify(items, null, 2);
    try {
      await fs.writeFile(this.filePath, data);
    } catch (error) {
      console.error(error);
    }
  }

  async deleteAll() {
    await fs.writeFile(this.filePath, "");
  }

  async update(obj, id) {
    // corro getAll para obtener todos los items en forma de array
    let items = await this.getAll();
    // primero checkea que exista un producto con el id indicado, sino no puede actualizar
    if (items.filter((item) => item.id != parseInt(id)).length === 0) return { error: "producto no encontrado" };
    // convierto a float el precio
    obj.price = parseFloat(obj.price);
    // actualizo con un map al objeto del array que tenga un id que coincida con el id que recibo como parametro
    items = items.map((item) => {
      if (item.id === parseInt(id)) return { id: parseInt(id), ...obj };
      // devuelvo el prod
      return item;
    });
    // grabo
    await fs.writeFile(this.filePath, data);
  }
}

module.exports = ContenedorProductos;
