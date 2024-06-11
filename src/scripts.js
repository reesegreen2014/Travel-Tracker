import './css/styles.css';
import { fetchData } from './APICalls'; 
import { getTripDetailsForTraveler } from './Logic Functions/tripProcessor';
import { updateWelcomeMessage, updatePendingTrips, hideTripRequestForm, updateTotalAmountSpent, updatePastTrips, updateUpcomingTrips, showLoginForm, hideLoginForm, handleLogout, updateContainerHeaders } from './domUpdates/domUpdates';
import { validateCredentials, extractTravelerId } from './Logic Functions/loginFunctions';
import { handleTripRequestSubmission } from './Logic Functions/bookingFunctions';

//CONSTANTS
const baseUrl = 'http://localhost:3001/api/v1';

//querySelectors
const loginButton = document.getElementById('loginButton');
const bookTripButton = document.querySelector('.nav-book-button');
const calculateCostButton = document.querySelector('.calculate-cost-button');
const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
const bookingSection = document.querySelector('.booking-section');
bookTripButton.style.display = 'none';
const tripRequestForm = document.getElementById('tripRequestForm')


document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const toggleLoginForm = () => {
        loginForm.classList.toggle('login-form-hidden');
    };
    loginButton.addEventListener('click', () => {
        const isLoggedIn = loginButton.innerText === 'Logout';
        if (isLoggedIn) {
            handleLogout();
        } else {
            toggleLoginForm(); 
        }
    });

    loginForm.addEventListener('submit', handleFormSubmission);

    if (tripRequestForm) {
        tripRequestForm.addEventListener('submit', handleTripRequestSubmission);
    }

    fetchData(`${baseUrl}/destinations`)
        .then(data => {
            populateDestinationOptions(data.destinations);
        })
        .catch(error => {
            console.error('Error fetching destinations:', error);
        });

    if (calculateCostButton) {
        calculateCostButton.addEventListener('click', calculateEstimatedCost);
    }
});

const handleFormSubmission = (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginText = document.querySelector('.nav-login-button');
    const invalidLoginDetails = document.querySelector('.invalidLoginDetailsMessage')
    invalidLoginDetails.innerText = '';
    if (validateCredentials(username, password)) {
        const travelerId = extractTravelerId(username);
        fetchUserData(travelerId);
        loginText.innerText = 'Logout';
        updateWelcomeMessage("Welcome back, adventurer!", "Let's recap your adventures!");
        pendingTripsText.innerText = `You don't have any pending trips!`;
        upcomingTripsText.innerText = `You don't have any upcoming trips!`;
        bookingSection.style.display = 'block';
        hideLoginForm(); 
    } else {
        invalidLoginDetails.innerText = 'Incorrect username or password! Please try again.'
        setTimeout(() => {
            invalidLoginDetails.innerText = '';
        }, 5000); 
    }
};

const fetchUserData = (travelerId) => {
    const currentYear = 2022; 
  
    Promise.all([
        fetchData(`${baseUrl}/trips`),
        fetchData(`${baseUrl}/destinations`),
        fetchData(`${baseUrl}/travelers/${travelerId}`)
    ])
    .then(([tripsData, destinationsData]) => {
        const trips = tripsData.trips || [];
        const destinations = destinationsData.destinations || [];
        
        const travelerTrips = trips.filter(trip => trip.userID === travelerId);
        const tripDetails = getTripDetailsForTraveler(travelerId, travelerTrips, destinations, currentYear);
  
        if (tripDetails) {
            updateContainerHeaders(tripDetails);
            updateTotalAmountSpent(travelerTrips, destinations, currentYear); 
            updatePastTrips(tripDetails.pastTrips, destinations);
            updateUpcomingTrips(tripDetails.upcomingTrips, destinations)
            updatePendingTrips(travelerTrips, destinations, travelerId); 
            const bookTripButton = document.querySelector('.nav-book-button');
            bookTripButton.style.display = 'block';
        }
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
};

const populateDestinationOptions = (destinations) => {
    const destinationSelect = document.getElementById('destination');
    destinations.forEach(destination => {
        const option = document.createElement('option');
        option.value = destination.id;
        option.textContent = destination.destination;
        destinationSelect.appendChild(option);
    });
};

const calculateEstimatedCost = () => {
    const tripDateInput = document.getElementById('tripDate');
    const durationInput = document.getElementById('duration');
    const numTravelersInput = document.getElementById('numTravelers');
    const destinationSelect = document.getElementById('destination');
    const incompleteFields = document.getElementById('incompleteFields')
    incompleteFields.innerText = '';
    if (tripDateInput.value && durationInput.value && numTravelersInput.value && destinationSelect.value) {
        const numTravelers = parseInt(numTravelersInput.value);
        const duration = parseInt(durationInput.value);
        const destinationId = parseInt(destinationSelect.value);
        fetchData(`${baseUrl}/destinations`)
            .then(data => {
                const destination = data.destinations.find(destination => destination.id === destinationId);
                if (destination) {
                    const lodgingCost = destination.estimatedLodgingCostPerDay * duration;
                    const flightCost = destination.estimatedFlightCostPerPerson * numTravelers;
                    const totalCost = lodgingCost + flightCost;
                    const totalCostWithFee = totalCost + (totalCost * 0.10); 
                    document.getElementById('estimatedCost').value = `$${totalCostWithFee.toFixed(2)}`;
                }
            })
            .catch(error => {
                console.error('Error fetching destination:', error);
            });
    } else {
        incompleteFields.innerText = 'Please fill out all required fields before calculating the cost.';
        setTimeout(() => {
            incompleteFields.innerText = '';
        }, 3000); 
    }
};

document.addEventListener("DOMContentLoaded", function() {
    const bookButton = document.querySelector(".nav-book-button");
    const bookingSection = document.querySelector(".booking-section");
  
    bookButton.addEventListener("click", function() {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    });
  });

