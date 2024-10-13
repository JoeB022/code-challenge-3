// Define the base URL for your API
const BASE_URL = 'http://localhost:3000';

// Get DOM elements
const filmsList = document.getElementById('films');
const filmDetails = document.getElementById('film-details');
const buyTicketButton = document.getElementById('buy-ticket');
const ticketCount = document.getElementById('available-tickets');

// Fetch and display the first movie's details on page load
window.onload = function() {
  fetchFilm(1);
  fetchFilms();
};

// Fetch a film's details
function fetchFilm(id) {
  fetch(`${BASE_URL}/films/${id}`)
    .then(response => response.json())
    .then(film => {
      displayFilmDetails(film);
    })
    .catch(error => console.error('Error fetching film:', error));
}

// Display film details
function displayFilmDetails(film) {
  filmDetails.innerHTML = `
    <h2>${film.title}</h2>
    <img src="${film.poster}" alt="${film.title} Poster">
    <p>Runtime: ${film.runtime} minutes</p>
    <p>Showtime: ${film.showtime}</p>
    <p id="available-tickets">Available Tickets: ${film.capacity - film.tickets_sold}</p>
  `;
  
  // Update the buy ticket button
  if (film.tickets_sold >= film.capacity) {
    buyTicketButton.textContent = 'Sold Out';
    buyTicketButton.disabled = true;
    filmDetails.classList.add('sold-out');
  } else {
    buyTicketButton.textContent = 'Buy Ticket';
    buyTicketButton.disabled = false;
    buyTicketButton.onclick = () => buyTicket(film);
  }
}

// Fetch all films and populate the list
function fetchFilms() {
  fetch(`${BASE_URL}/films`)
    .then(response => response.json())
    .then(films => {
      filmsList.innerHTML = ''; // Clear existing films
      films.forEach(film => {
        const li = document.createElement('li');
        li.classList.add('film', 'item');
        li.innerText = film.title;

        // Add delete button for each film
        const deleteButton = document.createElement('button');
        deleteButton.innerText = 'Delete';
        deleteButton.onclick = () => deleteFilm(film.id, li);
        
        li.appendChild(deleteButton);
        filmsList.appendChild(li);
      });
    })
    .catch(error => console.error('Error fetching films:', error));
}

// Buy a ticket
function buyTicket(film) {
  const updatedTicketsSold = film.tickets_sold + 1;

  // Update the tickets sold on the server
  fetch(`${BASE_URL}/films/${film.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ tickets_sold: updatedTicketsSold }),
  })
  .then(response => response.json())
  .then(updatedFilm => {
    displayFilmDetails(updatedFilm);
    
    // Post new ticket purchase
    fetch(`${BASE_URL}/tickets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        film_id: updatedFilm.id,
        number_of_tickets: 1,
      }),
    })
    .then(ticketResponse => ticketResponse.json())
    .then(ticket => console.log('Ticket purchased:', ticket))
    .catch(error => console.error('Error posting ticket:', error));
  })
  .catch(error => console.error('Error updating tickets sold:', error));
}

// Delete a film
function deleteFilm(id, li) {
  fetch(`${BASE_URL}/films/${id}`, {
    method: 'DELETE',
  })
  .then(() => {
    filmsList.removeChild(li);
    console.log('Film deleted successfully');
  })
  .catch(error => console.error('Error deleting film:', error));
}
