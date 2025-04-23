export class Event {
  constructor(data) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.date = data.date;
    this.location = data.location;
    this.capacity = data.capacity;
    this.registeredCount = data.registeredCount;
    this.category = data.category;
    this.image = data.image;
  }

  isAtCapacity() {
    return this.registeredCount >= this.capacity;
  }

  getFormattedDate() {
    return new Date(this.date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  register() {
    if (!this.isAtCapacity()) {
      this.registeredCount++;
    }
  }

  unregister() {
    if (this.registeredCount > 0) {
      this.registeredCount--;
    }
  }
}