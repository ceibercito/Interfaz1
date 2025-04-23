import { Event } from './Event';

export class EventManager {
  constructor(eventData) {
    this.events = eventData.map(data => new Event(data));
    this.registeredEventIds = new Set();
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

  registerForEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event && !event.isAtCapacity()) {
      event.register();
      this.registeredEventIds.add(eventId);
    }
  }

  unregisterFromEvent(eventId) {
    const event = this.events.find(e => e.id === eventId);
    if (event) {
      event.unregister();
      this.registeredEventIds.delete(eventId);
    }
  }

  isRegisteredForEvent(eventId) {
    return this.registeredEventIds.has(eventId);
  }

  getRegisteredEventCount() {
    return this.registeredEventIds.size;
  }
}