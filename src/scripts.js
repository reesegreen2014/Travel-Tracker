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

const loginButton = document.getElementById('loginButton');
const loginFormInner = document.getElementById('loginFormInner');
const bookTripButton = document.querySelector('.nav-book-button');
const tripRequestForm = document.getElementById('tripRequestFormInner');
const calculateCostButton = document.querySelector('.calculate-cost-button');
const pendingTripsText = document.querySelector('.pending-card-DOMUpdates');
const upcomingTripsText = document.querySelector('.upcoming-card-DOMUpdates');
const totalAmountSpentElement = document.querySelector('.sub-container4 .card-DOMUpdates');
const pastTripsElement = document.querySelector('.sub-container2 .card-DOMUpdates');
const upcomingTripsHeader = document.querySelector('.sub-container1 .card-titles');
const pastTripsHeader = document.querySelector('.sub-container2 .card-titles');
const pendingTripsHeader = document.querySelector('.sub-container3 .card-titles');
const amountSpentHeader = document.querySelector('.sub-container4 .card-titles');
const bookingSection = document.querySelector('.booking-section');
bookTripButton.style.display = 'none';

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
};

const handleFormSubmission = (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const loginText = document.querySelector('.nav-login-button');
    if (validateCredentials(username, password)) {
        const travelerId = extractTravelerId(username);
        fetchUserData(travelerId);
        loginText.innerText = 'Logout';
        pendingTripsText.innerText = `You don't have any pending trips!`;
        upcomingTripsText.innerText = `You don't have any upcoming trips!`;
        bookingSection.style.display = 'block';
    } else {
        alert('Invalid username or password');
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
        
        const tripDetails = getTripDetailsForTraveler(travelerId, trips, destinations);
        if (tripDetails) {
            updateContainerHeaders(tripDetails);
            updateTotalAmountSpent(trips, destinations, currentYear); 
            updatePastTrips(tripDetails.pastTrips, destinations);
            updatePendingTrips(trips, destinations, travelerId); 
            const bookTripButton = document.querySelector('.nav-book-button');
            bookTripButton.style.display = 'block';
        }
        hideLoginForm();
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });
};

const updateContainerHeaders = (tripDetails) => {
    upcomingTripsHeader.textContent = 'Your upcoming trips';
    pastTripsHeader.textContent = 'Your past trips';
    pendingTripsHeader.textContent = 'Your pending trips';
    amountSpentHeader.textContent = 'Amount Spent This year';
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
                const totalCostWithFee = totalCost + (totalCost * 0.10); 
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

const updatePendingTrips = (trips = [], destinations = [], travelerId) => {
    const pendingTripsElement = document.querySelector('.pending-card-DOMUpdates');
    if (pendingTripsElement) {
        const pendingTrips = trips.filter(trip => trip.status === 'pending' && trip.userID === travelerId);

        if (pendingTrips.length > 0) {
            const tripLocations = pendingTrips.map(trip => {
                const destination = destinations.find(dest => dest.id === trip.destinationID);
                return destination ? destination.destination : 'Unknown';
            });
            const listItems = tripLocations.map(location => `<li class="API-location">${location}</li>`).join('');
            const list = `<ul>${listItems}</ul>`;
            pendingTripsElement.innerHTML = `<h3 class="pending-trip-text">Your pending trips:</h3> ${list}`;
        } else {
            pendingTripsElement.innerHTML = 'You have no pending trips!';
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