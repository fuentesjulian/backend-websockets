// Importo filesystem
const { promises: fs } = require("fs");

// creo la clase Contenedor
class ContenedorMensajes {
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
    // agrego el objeto al array de items
    items.push(obj);
    // convierto a string el array de items
    const data = JSON.stringify(items, null, 2);
    // corro las instrucciones para escribir el archivo
    try {
      await fs.writeFile(this.filePath, data);
    } catch (error) {
      console.error(error);
    }
  }

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
}

module.exports = ContenedorMensajes;
