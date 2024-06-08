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

console.log('This is the JavaScript entry file - your code begins here.');

import { fetchData } from './APICalls';
import { getTripDetailsForTraveler } from './Logic Functions/tripProcessor';
import { updateTotalAmountSpent, updatePastTrips, showLoginForm } from './domUpdates/domUpdates';

const travelerId = 10; 
const baseUrl = 'http://localhost:3001/api/v1'

document.addEventListener('DOMContentLoaded', () => {
  const loginButton = document.getElementById('loginButton'); 
  const loginForm = document.getElementById('loginForm');

  loginButton.addEventListener('click', () => {
    loginForm.classList.toggle('login-form-hidden'); // Use toggle to add/remove the class
  });

  const loginFormInner = document.getElementById('loginFormInner');
  loginFormInner.addEventListener('submit', handleFormSubmission); // Corrected the form's event listener to use the inner form
});

const handleFormSubmission = (event) => {
  event.preventDefault(); 

  fetchData(`${baseUrl}/trips`)
    .then(tripsData => {
      return Promise.all([
        tripsData,
        fetchData(`${baseUrl}/destinations`),
        fetchData(`${baseUrl}/travelers`)
      ]);
    })
    .then(([tripsData, destinationsData]) => {
      const trips = tripsData.trips || [];
      const destinations = destinationsData.destinations || [];

      const tripDetails = getTripDetailsForTraveler(travelerId, trips, destinations);

      if (tripDetails) {
        updateTotalAmountSpent(tripDetails.totalAmountSpent);
        updatePastTrips(tripDetails.pastTrips, destinations); 
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
    });
};




