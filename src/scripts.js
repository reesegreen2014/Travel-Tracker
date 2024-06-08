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
        const isLoggedIn = loginButton.innerText === 'Logout';
        if (isLoggedIn) {
            handleLogout();
        } else {
            showLoginForm();
        }
    });
  
    loginFormInner.addEventListener('submit', handleFormSubmission);
  });
  

const handleLogout = () => {
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    usernameInput.value = '';
    passwordInput.value = '';
    const loginButton = document.getElementById('loginButton');
    loginButton.innerText = 'Login';
    const totalAmountSpentElement = document.querySelector('.sub-container4 .card-DOMUpdates');
    totalAmountSpentElement.innerHTML = 'Login to see how much you\'ve spent this year on trips!';
    const pendingTripsText = document.querySelector('.pending-card-DOMUpdates')
    const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
    const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates');
    pastTripsElement.innerHTML = 'Login to see your past trips!';
    pendingTripsText.innerText = 'Login to see your pending trips!';
    upcomingTripsText.innerText = 'Login to see your upcoming trips!'
};

const handleFormSubmission = (event) => {
    event.preventDefault();
  
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginText = document.querySelector('.nav-login-button')
    const pendingTripsText = document.querySelector('.pending-card-DOMUpdates')
    const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
    if (validateCredentials(username, password)) {
        const travelerId = extractTravelerId(username);
        fetchUserData(travelerId);
        loginText.innerText = 'Logout'
        pendingTripsText.innerText = `You don't have any pending trips!`
        upcomingTripsText.innerText = `You don't have any upcoming trips!`
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
  .then(([tripsData, destinationsData]) => {
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



