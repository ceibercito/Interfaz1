import { eventData } from './data.js';
import { EventManager } from './EventManager.js';

class App {
  constructor() {
    this.eventManager = new EventManager(eventData);
    this.searchInput = document.getElementById('search');
    this.categorySelect = document.getElementById('category');
    this.eventsContainer = document.getElementById('events-container');
    this.noEventsMessage = document.getElementById('no-events');
    this.registeredCountElement = document.querySelector('.registered-count');
    this.createEventBtn = document.getElementById('create-event-btn');
    this.modal = document.getElementById('create-event-modal');
    this.modal.classList.add('hidden'); // Hide modal initially
    this.closeModalBtn = document.getElementById('close-modal');
    this.createEventForm = document.getElementById('create-event-form');

    this.initialize();
  }

  initialize() {
    
    this.populateCategories();
    this.setupEventListeners();
    this.renderEvents();
  }

  populateCategories() {
    const categories = this.eventManager.getCategories();
    categories.forEach(category => {
      const option = document.createElement('option');
      option.value = category;
      option.textContent = category;
      this.categorySelect.appendChild(option);
    });
  }

  setupEventListeners() {
    this.searchInput.addEventListener('input', () => this.handleFilters());
    this.categorySelect.addEventListener('change', () => this.handleFilters());
    this.createEventBtn.addEventListener('click', () => this.openModal());
    this.closeModalBtn.addEventListener('click', () => this.closeModal());
    this.createEventForm.addEventListener('submit', (e) => this.handleCreateEvent(e));
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
      if (e.target === this.modal) {
        this.closeModal();
      }
    });
  }

  openModal() {
    this.modal.classList.add('show');
  }

  closeModal() {
    
    this.modal.classList.remove('show');
    this.createEventForm.reset();
  }

  handleCreateEvent(e) {
    e.preventDefault();
    
    const newEvent = {
      title: document.getElementById('event-title').value,
      description: document.getElementById('event-description').value,
      date: document.getElementById('event-date').value,
      location: document.getElementById('event-location').value,
      capacity: parseInt(document.getElementById('event-capacity').value),
      category: document.getElementById('event-category').value,
      image: document.getElementById('event-image').value
    };

    this.eventManager.createEvent(newEvent);
    
    this.populateCategories();
    this.renderEvents();
    this.closeModal();
  }

  handleFilters() {
    this.renderEvents();
  }

  updateRegisteredCount() {
    const count = this.eventManager.getRegisteredEventCount();
    this.registeredCountElement.textContent = `${count} events registered`;
  }

  createEventCard(event) {
    
    const isRegistered = this.eventManager.isRegisteredForEvent(event.id);
    
    const card = document.createElement('div');
    card.className = 'event-card';
    
    card.innerHTML = `
      <img src="${event.image}" alt="${event.title}" class="event-image">
      <div class="event-content">
        <div class="event-header">
          <h3 class="event-title">${event.title}</h3>
          <span class="event-category">${event.category}</span>
        </div>
        <p class="event-description">${event.description}</p>
        <div class="event-details">
          <div class="event-detail">
            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
            <span>${event.getFormattedDate()}</span>
          </div>
          <div class="event-detail">
            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <span>${event.location}</span>
          </div>
          <div class="event-detail">
            <svg class="detail-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
            <span>${event.registeredCount} / ${event.capacity} registered</span>
          </div>
        </div>
        <button 
          class="register-button ${isRegistered ? 'registered' : ''}"
          ${!isRegistered && event.isAtCapacity() ? 'disabled' : ''}
        >
          ${isRegistered ? 'Unregister' : 'Register'}
        </button>
      </div>
    `;

    const button = card.querySelector('.register-button');
    button.addEventListener('click', () => {
      if (isRegistered) {
        this.eventManager.unregisterFromEvent(event.id);
      } else {
        this.eventManager.registerForEvent(event.id);
      }
      this.renderEvents();
    });

    return card;
  }

  renderEvents() {
    const searchQuery = this.searchInput.value;
    const selectedCategory = this.categorySelect.value;
    const filteredEvents = this.eventManager.filterEvents(searchQuery, selectedCategory);

    this.eventsContainer.innerHTML = '';
    
    if (filteredEvents.length === 0) {
      this.noEventsMessage.classList.remove('hidden');
    } else {
      this.noEventsMessage.classList.add('hidden');
      filteredEvents.forEach(event => {
        this.eventsContainer.appendChild(this.createEventCard(event));
      });
    }

    this.updateRegisteredCount();
  }
}

// Initialize the application
new App();