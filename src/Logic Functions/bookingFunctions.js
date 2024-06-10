import { postTripRequest } from "../APICalls";
import { extractTravelerId } from "./loginFunctions";
import { updatePendingTrips } from "../scripts";

const handleTripRequestSubmission = (event) => {
    event.preventDefault();
    const tripDate = document.getElementById('tripDate').value;
    const duration = parseInt(document.getElementById('duration').value);
    const numTravelers = parseInt(document.getElementById('numTravelers').value);
    const destinationId = parseInt(document.getElementById('destination').value);
    const estimatedCost = parseFloat(document.getElementById('estimatedCost').value.replace('$', ''));
    const username = document.getElementById('username').value;
    const userID = extractTravelerId(username);
    const pendingTripsElement = document.querySelector('.pending-card-DOMUpdates');
    const selectedDestination = document.getElementById('destination').selectedOptions[0].textContent; // Get the selected option text
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

    pendingTripsElement.innerHTML = '';

    postTripRequest(newTrip.id, newTrip.userID, newTrip.destinationID, newTrip.travelers, newTrip.date, newTrip.duration, newTrip.status, newTrip.suggestedActivities)
        .then(data => {
            if (data) {
                console.log('Trip request submitted successfully:', data);
                alert('Your trip request has been submitted and is pending approval.');

                const pendingTripsElement = document.querySelector('.pending-card-DOMUpdates');
                if (pendingTripsElement) {
                    const destination = document.createElement('ul');
                    destination.classList.add('API-location');
                    destination.textContent = selectedDestination; 
                    pendingTripsElement.appendChild(destination);
                }
            }
        })
        .catch(error => {
            console.error('Error submitting trip request:', error);
            alert('There was an error submitting your trip request. Please try again.');
        });
};

export {handleTripRequestSubmission}