import './css/styles.css';
import { fetchData } from './APICalls'; 
import { getTripDetailsForTraveler } from './Logic Functions/tripProcessor';
import { updateTotalAmountSpent, updatePastTrips, showLoginForm, hideLoginForm, handleLogout, updateContainerHeaders } from './domUpdates/domUpdates';
import { validateCredentials, extractTravelerId } from './Logic Functions/loginFunctions';
import { handleTripRequestSubmission } from './Logic Functions/bookingFunctions';
const baseUrl = 'http://localhost:3001/api/v1';
const loginButton = document.getElementById('loginButton');
const bookTripButton = document.querySelector('.nav-book-button');
const calculateCostButton = document.querySelector('.calculate-cost-button');
const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
const upcomingTripsHeader = document.querySelector('.sub-container1 .card-titles');
const pastTripsHeader = document.querySelector('.sub-container2 .card-titles');
const pendingTripsHeader = document.querySelector('.sub-container3 .card-titles');
const amountSpentHeader = document.querySelector('.sub-container4 .card-titles');
const bookingSection = document.querySelector('.booking-section');
bookTripButton.style.display = 'none';
const tripRequestForm = document.getElementById('tripRequestForm')
const tripMessage = document.querySelector('.trip-message');
const tripMessageSubContainer = document.querySelector('.sub-container-text');

document.addEventListener('DOMContentLoaded', () => {
    loginButton.addEventListener('click', () => {
        const isLoggedIn = loginButton.innerText === 'Logout';
        if (isLoggedIn) {
            handleLogout();
        } else {
            showLoginForm();
        }
    });

    loginFormInner.addEventListener('submit', handleFormSubmission);

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
    if (validateCredentials(username, password)) {
        const travelerId = extractTravelerId(username);
        fetchUserData(travelerId);
        loginText.innerText = 'Logout';
        updateWelcomeMessage("Welcome back, adventurer!", "Let's recap your adventures!");
        pendingTripsText.innerText = `You don't have any pending trips!`;
        upcomingTripsText.innerText = `You don't have any upcoming trips!`;
        bookingSection.style.display = 'block';
    } else {
        alert('Invalid username or password');
    }
};

const updateWelcomeMessage = (headingText, subheadingText) => {
    tripMessage.innerText = headingText;
    tripMessageSubContainer.lastElementChild.innerText = subheadingText;
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
        const tripDetails = getTripDetailsForTraveler(travelerId, travelerTrips, destinations);

        if (tripDetails) {
            updateContainerHeaders(tripDetails);
            updateTotalAmountSpent(travelerTrips, destinations, currentYear); 
            updatePastTrips(tripDetails.pastTrips, destinations);
            updatePendingTrips(travelerTrips, destinations, travelerId); 
            const bookTripButton = document.querySelector('.nav-book-button');
            bookTripButton.style.display = 'block';
        }
        hideLoginForm();
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
        alert('Please fill out all required fields before calculating the cost.');
    }
};

const updatePendingTrips = (trips = [], destinations = [], travelerId) => {
    const pendingTripsElement = document.querySelector('.pending-card-DOMUpdates');
    if (pendingTripsElement) {
        const filteredPendingTrips = trips.filter(trip => trip.status === 'pending' && trip.userID === travelerId);
        if (filteredPendingTrips.length > 0) {
            pendingTripsElement.innerHTML = '';
            const tripLocations = filteredPendingTrips.map(trip => {
                const destination = destinations.find(dest => dest.id === trip.destinationID);
                return destination ? destination.destination : 'Unknown';
            });
            const listItems = tripLocations.map(location => `<li class="API-location">${location}</li>`).join(''); // Correct use of <li>
            const list = `<ul>${listItems}</ul>`;
            pendingTripsElement.innerHTML = list; 
        } else {
            pendingTripsElement.innerHTML = '<p>No pending trips!</p>'; 
        }
    }
};

const hideTripRequestForm = () => {
    const tripRequestForm = document.getElementById('tripRequestForm');
    tripRequestForm.classList.add('trip-request-form-hidden');
};

document.addEventListener("DOMContentLoaded", function() {
    const bookButton = document.querySelector(".nav-book-button");
    const bookingSection = document.querySelector(".booking-section");
  
    bookButton.addEventListener("click", function() {
      bookingSection.scrollIntoView({ behavior: "smooth" });
    });
  });

export {updatePendingTrips, hideTripRequestForm }