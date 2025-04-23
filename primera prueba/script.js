class Evento {
  constructor(nombre, fecha, ubicacion, categoria, inscrito = false) {
    this.nombre = nombre;
    this.fecha = fecha;
    this.ubicacion = ubicacion;
    this.categoria = categoria;
    this.inscrito = inscrito;
  }

  inscribirse() {
    this.inscrito = true;
  }

  cancelarInscripcion() {
    this.inscrito = false;
  }
}

class GestorEventos {
  constructor() {
    this.eventos = this.cargarEventos();
    this.listaDOM = document.getElementById("events-list");
    this.filtro = document.getElementById("search");
    this.filtro.addEventListener("input", () => this.render());
    this.render();
  }

  agregarEvento(evento) {
    this.eventos.push(evento);
    this.guardarEventos();
    this.render();
  }

  render() {
    const query = this.filtro.value.toLowerCase();
    this.listaDOM.innerHTML = "";

    this.eventos
      .filter(e => e.nombre.toLowerCase().includes(query) || e.categoria.toLowerCase().includes(query))
      .forEach((evento, index) => {
        const div = document.createElement("div");
        div.className = "event-card";

        div.innerHTML = `
          <h3>\${evento.nombre}</h3>
          <p><strong>Fecha:</strong> \${evento.fecha}</p>
          <p><strong>Ubicación:</strong> \${evento.ubicacion}</p>
          <p><strong>Categoría:</strong> \${evento.categoria}</p>
          <button onclick="gestor.\${evento.inscrito ? 'cancelar' : 'inscribir'}(\${index})">
            \${evento.inscrito ? 'Cancelar Inscripción' : 'Inscribirse'}
          </button>
        `;

        this.listaDOM.appendChild(div);
      });
  }

  inscribir(index) {
    this.eventos[index].inscribirse();
    this.guardarEventos();
    this.render();
  }

  cancelar(index) {
    this.eventos[index].cancelarInscripcion();
    this.guardarEventos();
    this.render();
  }

  guardarEventos() {
    localStorage.setItem("eventos", JSON.stringify(this.eventos));
  }

  cargarEventos() {
    const datos = localStorage.getItem("eventos");
    if (datos) {
      return JSON.parse(datos).map(e => new Evento(e.nombre, e.fecha, e.ubicacion, e.categoria, e.inscrito));
    } else {
      return [
        new Evento("Conferencia Tech 2025", "2025-05-10", "Lima", "Tecnología"),
        new Evento("Expo Salud", "2025-06-15", "Arequipa", "Salud"),
        new Evento("Festival de Música", "2025-07-20", "Cusco", "Entretenimiento")
      ];
    }
  }
}

const gestor = new GestorEventos();


document.getElementById("form-nuevo-evento").addEventListener("submit", function(e) {
  e.preventDefault();
  const nombre = document.getElementById("nombre").value.trim();
  const fecha = document.getElementById("fecha").value;
  const ubicacion = document.getElementById("ubicacion").value.trim();
  const categoria = document.getElementById("categoria").value.trim();

  if (nombre && fecha && ubicacion && categoria) {
    gestor.agregarEvento(new Evento(nombre, fecha, ubicacion, categoria));
    this.reset();
  }
});