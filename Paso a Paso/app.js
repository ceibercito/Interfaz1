// Clase para representar un evento
class Evento {
    constructor(id, nombre, fecha, ubicacion, categoria) {
      this.id = id;
      this.nombre = nombre;
      this.fecha = fecha;
      this.ubicacion = ubicacion;
      this.categoria = categoria;
      this.inscrito = false;
    }
  
    // Método para inscribirse o cancelar
    toggleInscripcion() {
      this.inscrito = !this.inscrito;
    }
  }
  
  // Lista base de eventos
  const eventos = [
    new Evento(1, "Fiesta Tech", "10/05/2025", "Lima", "tech"),
    new Evento(2, "Expo Innovación", "12/05/2025", "Cusco", "negocios"),
    new Evento(3, "EduHack", "15/05/2025", "Arequipa", "educacion"),
  ];
  
  let filtroCategoria = "";
  let verMisEventos = false;
  
  // Renderiza todos los eventos (filtrados o no)
  function renderEventos() {
    const contenedor = document.getElementById("listaEventos");
    contenedor.innerHTML = "";
  
    let eventosFiltrados = eventos.filter((e) => {
      if (filtroCategoria && e.categoria !== filtroCategoria) return false;
      if (verMisEventos && !e.inscrito) return false;
      return true;
    });
  
    if (eventosFiltrados.length === 0) {
      contenedor.innerHTML = "<p>No hay eventos disponibles.</p>";
      return;
    }
  
    eventosFiltrados.forEach((evento) => {
      const tarjeta = document.createElement("div");
      tarjeta.classList.add("evento");
  
      tarjeta.innerHTML = `
        <h3>🗓️ ${evento.nombre}</h3>
        <p><strong>Fecha:</strong> ${evento.fecha}</p>
        <p><strong>Ubicación:</strong> ${evento.ubicacion}</p>
        <button class="${evento.inscrito ? "cancelar" : ""}" data-id="${evento.id}">
          ${evento.inscrito ? "Cancelar Inscripción" : "Inscribirse"}
        </button>
      `;
  
      contenedor.appendChild(tarjeta);
    });
  }


  
  // Eventos del DOM
  document.getElementById("filtroCategoria").addEventListener("change", (e) => {
    filtroCategoria = e.target.value;
    renderEventos();
  });
  
  document.getElementById("btnMisEventos").addEventListener("click", () => {
    verMisEventos = true;
    renderEventos();
  });
  
  document.getElementById("btnInicio").addEventListener("click", () => {
    verMisEventos = false;
    renderEventos();
  });
  
  // Delegación de eventos para botones dinámicos
  document.getElementById("listaEventos").addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const id = parseInt(e.target.getAttribute("data-id"));
      const evento = eventos.find((ev) => ev.id === id);
      if (evento) {
        evento.toggleInscripcion();
        renderEventos();
      }
    }
  });
  
  document.getElementById("formCrearEvento").addEventListener("submit", (e) => {
    e.preventDefault();
  
    const nombre = document.getElementById("nombreEvento").value.trim();
    const fecha = document.getElementById("fechaEvento").value;
    const ubicacion = document.getElementById("ubicacionEvento").value.trim();
    const categoria = document.getElementById("categoriaEvento").value;
  
    if (!nombre || !fecha || !ubicacion || !categoria) {
      alert("Por favor, completa todos los campos.");
      return;
    }
  
    const nuevoId = eventos.length ? eventos[eventos.length - 1].id + 1 : 1;
    const nuevoEvento = new Evento(nuevoId, nombre, fecha, ubicacion, categoria);
    eventos.push(nuevoEvento);
  
    // Limpiar formulario
    document.getElementById("formCrearEvento").reset();
  
    // Mostrar evento nuevo
    renderEventos();
  });
  

  // Inicial
  renderEventos();
  