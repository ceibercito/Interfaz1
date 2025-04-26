import { Event } from './Event';

const STORAGE_KEY = 'event-manager-events';

export class EventManager {
  constructor(eventData) {
    this.events = eventData.map(data => new Event(data));
    this.registeredEventIds = new Set();
    const storedEvents = this.loadEventsFromStorage();
    this.events = storedEvents.length > 0 
      ? storedEvents.map(data => new Event(data))
      : eventData.map(data => new Event(data));
    this.registeredEventIds = new Set();
    
    this.saveEventsToStorage();
  }

  loadEventsFromStorage() {
    const storedData = localStorage.getItem(STORAGE_KEY);
    return storedData ? JSON.parse(storedData) : [];
  }

  saveEventsToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.events));
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
    this.saveEventsToStorage();
    return newEvent;
  }

  registerForEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event && !event.isAtCapacity()) {
      event.register();
      this.registeredEventIds.add(eventId);
      this.saveEventsToStorage();
    }
  }

  unregisterFromEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.unregister();
      this.registeredEventIds.delete(eventId);
      this.saveEventsToStorage();
    }
  }

  isRegisteredForEvent(eventId) {
    return this.registeredEventIds.has(eventId);
  }

  getRegisteredEventCount() {
    return this.registeredEventIds.size;
  }
}