import { Event } from './Event.js';

const STORAGE_KEY = 'event-manager-events';

export class EventManager {
  constructor(eventData) {
    // Cargar eventos desde localStorage si existen, de lo contrario usar los datos iniciales
    const storedEvents = this.loadEventsFromStorage();
    this.events = storedEvents.length > 0 
      ? storedEvents.map(data => new Event(data)) // Convertir a instancias de Event
      : eventData.map(data => new Event(data));   // Convertir a instancias de Event
    this.registeredEventIds = new Set();
  }

  saveEventsToStorage() {
    // Guardar solo los datos planos, no las instancias de Event
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events.map(event => event.toJSON())));
  }

  loadEventsFromStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  getAllEvents() {
    return this.events;
  }

  getCategories() {
    return Array.from(new Set(this.events.map(event => event.category)));
  }

  filterEvents(searchQuery, category) {
    return this.events.filter(event => {
      const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = !category || event.category === category;
      return matchesSearch && matchesCategory;
    });
  }

  createEvent(eventData) {
    const newEvent = new Event({
      id: (this.events.length + 1).toString(),
      registeredCount: 0,
      ...eventData
    });
    this.events.push(newEvent);
    this.saveEventsToStorage(); // Guardar en localStorage
    return newEvent;
  }

  registerForEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event && !event.isAtCapacity()) {
      event.register();
      this.registeredEventIds.add(eventId);
      this.saveEventsToStorage(); // Guardar en localStorage
    }
  }

  unregisterFromEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.unregister();
      this.registeredEventIds.delete(eventId);
      this.saveEventsToStorage(); // Guardar en localStorage
    }
  }

  isRegisteredForEvent(eventId) {
    return this.registeredEventIds.has(eventId);
  }

  getRegisteredEventCount() {
    return this.registeredEventIds.size;
  }
}