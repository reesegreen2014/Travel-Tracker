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
    const submitMessage = document.getElementById('messageSection')
    const selectedDestination = document.getElementById('destination').selectedOptions[0].textContent;
    submitMessage.innerText = '';
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

    postTripRequest(newTrip.id, newTrip.userID, newTrip.destinationID, newTrip.travelers, newTrip.date, newTrip.duration, newTrip.status, newTrip.suggestedActivities)
        .then(data => {
            if (data) {
                console.log('Trip request submitted successfully:', data);
                submitMessage.innerText = 'Your trip request has been submitted and is pending approval! Craving more adventure? Book another!'
                setTimeout(() => {
                    submitMessage.innerText = '';
                }, 5000);
                const pendingTripsElement = document.querySelector('.pending-card-DOMUpdates');
                if (pendingTripsElement) {
                    if (pendingTripsElement.textContent === 'No pending trips!') {
                        pendingTripsElement.innerHTML = ''; 
                    }
                    const listItem = document.createElement('ul');
                    listItem.classList.add('API-location');
                    listItem.textContent = selectedDestination;
                    pendingTripsElement.appendChild(listItem);
                }
                document.getElementById('tripRequestFormInner').reset();
            }
        })
        .catch(error => {
            console.error('Error submitting trip request:', error);
            alert('There was an error submitting your trip request. Please try again.');
        });
};

export { handleTripRequestSubmission };

