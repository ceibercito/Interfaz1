class Evento {
    constructor(id, nombre, fecha, ubicacion, categoria, inscrito = false) {
      this.id = id;
      this.nombre = nombre;
      this.fecha = fecha;
      this.ubicacion = ubicacion;
      this.categoria = categoria;
      this.inscrito = inscrito;
    }
  
    registrar() {
      this.inscrito = true;
    }
  
    cancelar() {
      this.inscrito = false;
    }
  }
  