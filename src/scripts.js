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


import { getTripDetailsForTraveler } from './Logic Functions/tripProcessor';
import { updateTotalAmountSpent, updatePastTrips } from './domUpdates/domUpdates';

const travelerId = 10; 

document.addEventListener('DOMContentLoaded', () => {
    getTripDetailsForTraveler(travelerId)
      .then(tripDetails => {
        console.log('Past Trips:', tripDetails.pastTrips);
        console.log('Upcoming Trips:', tripDetails.upcomingTrips);
        console.log('Pending Trips:', tripDetails.pendingTrips);
        console.log('Total Amount Spent This Year:', tripDetails.totalAmountSpent);        
        updateTotalAmountSpent(tripDetails.totalAmountSpent); 
        updatePastTrips(tripDetails.pastTrips)
      })
      .catch(error => {
        console.error('Error:', error);
      });
});



