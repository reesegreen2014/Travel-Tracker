import { fetchData } from "../APICalls";
import { getTripDetailsForTraveler, calculateTotalAmountSpent, categorizeTrips } from "../Logic Functions/tripProcessor";


//querySelectors
const totalAmountSpentElement = document.querySelector('.sub-container4 .card-DOMUpdates')
const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates')

const updateTotalAmountSpent = (amount) => {
    if (totalAmountSpentElement) {
        totalAmountSpentElement.innerHTML = `You have spent $${amount.toFixed(2)} on trips this year!`;
    }
}

const updatePastTrips = (trips = [], destinations = []) => {
    if (pastTripsElement) {
      if (trips.length > 0) {
        const tripLocations = trips.map(trip => {
          const destination = destinations.find(dest => dest.id === trip.destinationID);
          return destination ? destination.destination : 'Unknown';
        });
        const listItems = tripLocations.map(location => `<li class="API-location">${location}</li>`).join('');
        const list = `<ul>${listItems}</ul>`;
        pastTripsElement.innerHTML = `<h3 class="past-trip-text">Your past trips were to:</h3> ${list}`;
      } else {
        pastTripsElement.innerHTML = 'No past trips recorded.';
      }
    }
}


export { updateTotalAmountSpent, updatePastTrips }

