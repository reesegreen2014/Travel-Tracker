import { fetchData } from "../APICalls";
import { getTripDetailsForTraveler, calculateTotalAmountSpent, categorizeTrips } from "../Logic Functions/tripProcessor";
import { hideTripRequestForm } from "../scripts";

//querySelectors
const totalAmountSpentElement = document.querySelector('.sub-container4 .card-DOMUpdates')
const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates')
const loginButton = document.getElementById('loginButton');
const bookTripButton = document.querySelector('.nav-book-button');
const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
const upcomingTripsHeader = document.querySelector('.sub-container1 .card-titles');
const pastTripsHeader = document.querySelector('.sub-container2 .card-titles');
const pendingTripsHeader = document.querySelector('.sub-container3 .card-titles');
const amountSpentHeader = document.querySelector('.sub-container4 .card-titles');
const bookingSection = document.querySelector('.booking-section');
bookTripButton.style.display = 'none';
const tripMessage = document.querySelector('.trip-message');
const tripMessageSubContainer = document.querySelector('.sub-container-text');

const updateTotalAmountSpent = (trips = [], destinations = [], currentYear) => {
  const approvedTrips = trips.filter(trip => {
      const tripDate = new Date(trip.date);
      const tripYear = tripDate.getFullYear();
      return trip.status === 'approved' && tripYear === currentYear;
  });

  const totalAmountSpent = calculateTotalAmountSpent(approvedTrips, destinations, currentYear);

  if (totalAmountSpentElement) {
      totalAmountSpentElement.innerHTML = `You have spent $${totalAmountSpent.toFixed(2)} on trips this year!`;
  }
};


const updatePastTrips = (trips = [], destinations = []) => {
  const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates');
  if (pastTripsElement) {
      const approvedTrips = trips.filter(trip => trip.status === 'approved');
      if (approvedTrips.length > 0) {
          const tripLocations = approvedTrips.slice(0, 6).map(trip => {
              const destination = destinations.find(dest => dest.id === trip.destinationID);
              return destination ? destination.destination : 'Unknown';
          });
          const listItems = tripLocations.map(location => `<li class="API-location">${location}</li>`).join('');
          const list = `<ul>${listItems}</ul>`;
          pastTripsElement.innerHTML = `${list}`;
      } else {
          pastTripsElement.innerHTML = 'No past trips recorded.';
      }
  }
};


const showLoginForm = () => {
  const loginForm = document.getElementById('loginForm');
  loginForm.classList.remove("login-form-hidden"); 
}

const hideLoginForm = () => {
  const loginForm = document.getElementById('loginForm');
  loginForm.classList.add("login-form-hidden");
};

const handleLogout = () => {
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');
  usernameInput.value = '';
  passwordInput.value = '';
  upcomingTripsHeader.textContent = 'Explore the World Stress-Free!';
  upcomingTripsText.textContent = 'Discover over 50 dream destinations hassle-free with our expert planning. Let us handle every detail while you focus on the adventure!';
  pastTripsHeader.textContent = 'Unlock Your Wanderlust with Ease!';
  pastTripsElement.textContent = 'With a nominal 10% agent fee, enjoy the convenience of seamless travel planning. Leave the logistics to us and embrace the joy of exploration!';
  pendingTripsHeader.textContent = 'Your Journey, Our Expertise';
  pendingTripsText.innerHTML = "From booking to boarding, we've got you covered. Trust our seasoned agents to curate your perfect getaway, ensuring a memorable experience every step of the way!";
  amountSpentHeader.textContent = "Let's get started!";
  totalAmountSpentElement.textContent = 'Begin your journey by logging in. Your adventure awaits just a click away!';
  bookTripButton.style.display = 'none';
  loginButton.innerText = "Login";
  bookingSection.style.display = 'none';
  tripMessage.textContent = 'Welcome, adventurer!';
  tripMessageSubContainer.lastElementChild.textContent = 'Let us book your travel experience!';
  hideTripRequestForm();
};


export { updateTotalAmountSpent, updatePastTrips, showLoginForm, hideLoginForm, handleLogout }

