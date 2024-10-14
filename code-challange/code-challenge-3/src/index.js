document.addEventListener("DOMContentLoaded", () => {
  let currentMovieId;
  let currentTicketsSold;
  let currentCapacity;

  // Function to fetch movie details
  function getMovieDetails() {
      fetch('http://localhost:3000/films/1')  
          .then(response => response.json())
          .then(movie => {
              currentMovieId = movie.id; // Store the current movie ID
              currentTicketsSold = movie.tickets_sold; // Store the current tickets sold
              currentCapacity = movie.capacity; // Store the current capacity
              updateMovieDetails(movie); // Call the new function to update movie details
          })
          .catch(error => console.error('Error fetching movie details:', error));
  }

  // Function to update movie details in the DOM
  function updateMovieDetails(movie) {
      const availableTickets = movie.capacity - movie.tickets_sold;

      // Update the DOM with movie details
      document.getElementById('movie-title').textContent = movie.title;
      document.getElementById('movie-runtime').textContent = movie.runtime;
      document.getElementById('movie-showtime').textContent = movie.showtime;
      document.getElementById('movie-tickets').textContent = availableTickets;
      document.getElementById('film-info').textContent = movie.description;
      document.getElementById('movie-poster').src = movie.poster;

      // Add event listener for the buy button
      const buyButton = document.getElementById("buy-ticket");
      buyButton.onclick = () => {
          if (availableTickets > 0) {
              updateTicketsSold(currentMovieId, currentTicketsSold + 1);
          } else {
              alert('No tickets available for this movie.');
          }
      };
  }

  // Function to fetch all movies and populate the menu
  function getAllMovies() {
      fetch('http://localhost:3000/films')
          .then(response => response.json())
          .then(movies => {
              const filmsList = document.getElementById('films');
              filmsList.innerHTML = '';

              // Loop through the movie data and create a list item for each movie
              movies.forEach(movie => {
                  const li = document.createElement('li');
                  li.classList.add('film', 'item');
                  li.textContent = movie.title;

                  // Add a click event to load the movie details when clicked
                  li.addEventListener('click', () => displayMovieDetails(movie));

                  // Append the list item to the films menu
                  filmsList.appendChild(li);
              });
          })
          .catch(error => console.error('Error fetching movies:', error));
  }
  

  // Function to display movie details in the movie-details section
  function displayMovieDetails(movie) {
      currentMovieId = movie.id; // Store the current movie ID
      currentTicketsSold = movie.tickets_sold; // Store the current tickets sold
      currentCapacity = movie.capacity; // Store the current capacity
      updateMovieDetails(movie); // Call the new function to update movie details
  }

  // Function to update tickets sold on the server
  function updateTicketsSold(movieId, newTicketsSold) {
      fetch(`http://localhost:3000/films/${movieId}`, {
          method: 'PATCH',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              tickets_sold: newTicketsSold,
          }),
      })
      .then(response => response.json())
      .then(updatedMovie => {
          // Update UI after ticket purchase
          currentTicketsSold = updatedMovie.tickets_sold; // Update current tickets sold
          const availableTickets = updatedMovie.capacity - updatedMovie.tickets_sold;
          document.getElementById('movie-tickets').textContent = availableTickets;

          // Disable button if sold out
          document.getElementById('buy-ticket').disabled = availableTickets <= 0;

          if (availableTickets <= 0) {
              alert('Tickets sold out!');
          } else {
              alert('Ticket purchased successfully!');
          }
      })
      .catch(error => console.error('Error updating tickets sold:', error));
  }

  // Fetch all movies and populate the menu when the page loads
  getAllMovies();
  // Call the function to get the movie details when the page loads
  getMovieDetails();
});

 