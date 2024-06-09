import './css/styles.css';
import './images/turing-logo.png';
import './images/Beach.jpg';
import './images/Jungle.jpg';
import './images/Rome.jpg';
import './images/Money.jpg';
import { fetchData, postTripRequest } from './APICalls'; 
import { getTripDetailsForTraveler } from './Logic Functions/tripProcessor';
import { updateTotalAmountSpent, updatePastTrips, showLoginForm, hideLoginForm } from './domUpdates/domUpdates';
import { validateCredentials, extractTravelerId } from './Logic Functions/loginFunctions';

const baseUrl = 'http://localhost:3001/api/v1';

document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const loginFormInner = document.getElementById('loginFormInner');
    const bookTripButton = document.querySelector('.nav-book-button');

    bookTripButton.style.display = 'none';

    loginButton.addEventListener('click', () => {
        const isLoggedIn = loginButton.innerText === 'Logout';
        if (isLoggedIn) {
            handleLogout();
        } else {
            showLoginForm();
        }
    });

    loginFormInner.addEventListener('submit', handleFormSubmission);

    const tripRequestForm = document.getElementById('tripRequestFormInner');
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

    const calculateCostButton = document.querySelector('.calculate-cost-button');
    if (calculateCostButton) {
        calculateCostButton.addEventListener('click', calculateEstimatedCost);
    }
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
    const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
    const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
    const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates');
    pastTripsElement.innerHTML = 'Login to see your past trips!';
    pendingTripsText.innerText = 'Login to see your pending trips!';
    upcomingTripsText.innerText = 'Login to see your upcoming trips!';

    const bookTripButton = document.querySelector('.nav-book-button');
    bookTripButton.style.display = 'none';
};

const handleFormSubmission = (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginText = document.querySelector('.nav-login-button');
    const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
    const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
    if (validateCredentials(username, password)) {
        const travelerId = extractTravelerId(username);
        fetchUserData(travelerId);
        loginText.innerText = 'Logout';
        pendingTripsText.innerText = `You don't have any pending trips!`;
        upcomingTripsText.innerText = `You don't have any upcoming trips!`;
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
    const destinationSelect = document.getElementById('destination');
    const numTravelers = parseInt(document.getElementById('numTravelers').value);
    const duration = parseInt(document.getElementById('duration').value);

    const selectedDestination = destinationSelect.options[destinationSelect.selectedIndex];
    const destinationId = parseInt(selectedDestination.value);

    fetchData(`${baseUrl}/destinations`)
        .then(data => {
            const destination = data.destinations.find(dest => dest.id === destinationId);
            if (destination) {
                const lodgingCost = destination.estimatedLodgingCostPerDay * duration;
                const flightCost = destination.estimatedFlightCostPerPerson * numTravelers;
                const totalCost = lodgingCost + flightCost;
                const totalCostWithFee = totalCost + (totalCost * 0.10); // Adding 10% travel agent fee
                document.getElementById('estimatedCost').value = `$${totalCostWithFee.toFixed(2)}`;
            }
        })
        .catch(error => {
            console.error('Error fetching destination:', error);
        });
};

const handleTripRequestSubmission = (event) => {
    event.preventDefault();
    const tripDate = document.getElementById('tripDate').value;
    const duration = parseInt(document.getElementById('duration').value);
    const numTravelers = parseInt(document.getElementById('numTravelers').value);
    const destinationId = parseInt(document.getElementById('destination').value);
    const estimatedCost = parseFloat(document.getElementById('estimatedCost').value.replace('$', ''));
    const username = document.getElementById('username').value;
    const userID = extractTravelerId(username);
    const newTrip = {
      id: Date.now(),
      userID: userID,
      destinationID: destinationId,
      travelers: numTravelers,
      date: tripDate.split("-").join("/"),
      duration: duration,
      status: 'pending',
      suggestedActivities: []
    };
  
    console.log('Submitting new trip request:', newTrip); 
  
    postTripRequest(newTrip.id, newTrip.userID, newTrip.destinationID, newTrip.travelers, newTrip.date, newTrip.duration, newTrip.status, newTrip.suggestedActivities)
      .then(data => {
        if (data) {
          console.log('Trip request submitted successfully:', data);
          alert('Your trip request has been submitted and is pending approval.');
          updatePendingTrips();
          hideTripRequestForm();
        }
      })
      .catch(error => {
        console.error('Error submitting trip request:', error);
        alert('There was an error submitting your trip request. Please try again.');
      });
  };

const updatePendingTrips = () => {
    const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
    pendingTripsText.innerText = `Your trip request is pending approval! You will hear back from your travel agent soon.`;
};

const hideTripRequestForm = () => {
    const tripRequestForm = document.getElementById('tripRequestForm');
    tripRequestForm.classList.add('trip-request-form-hidden');
};
