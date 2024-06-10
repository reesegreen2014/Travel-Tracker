import { fetchData } from "../APICalls";
import { getTripDetailsForTraveler, calculateTotalAmountSpent, categorizeTrips } from "../Logic Functions/tripProcessor";


//querySelectors
const totalAmountSpentElement = document.querySelector('.sub-container4 .card-DOMUpdates')
const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates')

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

export { updateTotalAmountSpent, updatePastTrips, showLoginForm, hideLoginForm }

