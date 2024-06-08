// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import './images/Beach.jpg'
import './images/Jungle.jpg'
import './images/Rome.jpg'
import './images/Money.jpg'
import './APICalls'
import { fetchData } from './APICalls';
import { getTripDetailsForTraveler } from './Logic Functions/tripProcessor';
import { updateTotalAmountSpent, updatePastTrips, showLoginForm, hideLoginForm } from './domUpdates/domUpdates';
import { validateCredentials, extractTravelerId } from './Logic Functions/loginFunctions';

const baseUrl = 'http://localhost:3001/api/v1'

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton');
  const loginFormInner = document.getElementById('loginFormInner');

  loginButton.addEventListener('click', () => {
      showLoginForm();
  });

  loginFormInner.addEventListener('submit', handleFormSubmission);
});

const handleFormSubmission = (event) => {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  if (validateCredentials(username, password)) {
      const travelerId = extractTravelerId(username);
      fetchUserData(travelerId);
  } else {
      alert('Invalid username or password');
  }
};


const fetchUserData = (travelerId) => {
  Promise.all([
      fetchData(`${baseUrl}/trips`),
      fetchData(`${baseUrl}/destinations`),
      fetchData(`${baseUrl}/travelers/${travelerId}`)
  ])
  .then(([tripsData, destinationsData, travelerData]) => {
      const trips = tripsData.trips || [];
      const destinations = destinationsData.destinations || [];

      const tripDetails = getTripDetailsForTraveler(travelerId, trips, destinations);

      if (tripDetails) {
          updateTotalAmountSpent(tripDetails.totalAmountSpent);
          updatePastTrips(tripDetails.pastTrips, destinations);
      }

      hideLoginForm();
  })
  .catch(error => {
      console.error('Error fetching data:', error);
  });
};



