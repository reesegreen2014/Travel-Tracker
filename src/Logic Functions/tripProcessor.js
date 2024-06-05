import { fetchData } from "../APICalls";

const baseUrl = 'http://localhost:3001/api/v1';

const fetchAllTrips = () => {
  return fetchData(`${baseUrl}/trips`)
  .then(data => data.trips);
}

const fetchAllDestinations = () => {
  return fetchData(`${baseUrl}/destinations`)
  .then(data => data.destinations);
}

const fetchAllTravelers = () => {
  return fetchData(`${baseUrl}/travelers`)
  .then(data => data.travelers);
}


//LOGIC FUNCTIONS 
const filterTripsByTraveler = (trips, travelerId) => {
  return trips.filter(trip => trip.userID === travelerId);
}

const categorizeTrips = (trips) => {
  const currentDate = new Date();
  const pastTrips = [];
  const upcomingTrips = [];
  const pendingTrips = [];

  trips.forEach(trip => {
    const tripDate = new Date(trip.date);
    if (trip.status === 'pending') {
      pendingTrips.push(trip);
    } else if (tripDate < currentDate) {
      pastTrips.push(trip);
    } else {
      upcomingTrips.push(trip);
    }
  });

  return { pastTrips, upcomingTrips, pendingTrips };
}

const calculateTotalAmountSpent = (pastTrips, destinations, currentYear) => {
  const agentFee = 0.10;
  let totalAmountSpent = 0;

  console.log('Current Year:', currentYear);
  console.log('Past Trips:', pastTrips);

  pastTrips.forEach(trip => {
    const tripDate = new Date(trip.date);
    const tripYear = tripDate.getFullYear();
    console.log('Trip Date:', tripDate, 'Trip Year:', tripYear);

    if (tripYear === currentYear) {
      const destination = destinations.find(dest => dest.id === trip.destinationID);
      console.log('Destination:', destination);

      if (destination) {
        const tripCost = (destination.estimatedLodgingCostPerDay * trip.duration) + (destination.estimatedFlightCostPerPerson * trip.travelers);
        console.log('Trip Cost:', tripCost);
        totalAmountSpent += tripCost + (tripCost * agentFee);
      } else {
        console.log(`Destination not found for ID: ${trip.destinationID}`);
      }
    }
  });

  console.log('Total Amount Spent:', totalAmountSpent);
  return totalAmountSpent;
}


const getTripDetailsForTraveler = (travelerId) => {
  return Promise.all([fetchAllTrips(), fetchAllDestinations(), fetchAllTravelers()])
    .then(([trips, destinations]) => {
      const travelerTrips = filterTripsByTraveler(trips, travelerId);
      const categorizedTrips = categorizeTrips(travelerTrips);
      const currentYear = 2020;
      const totalAmountSpent = calculateTotalAmountSpent(categorizedTrips.pastTrips, destinations, currentYear);

      return {
        ...categorizedTrips,
        totalAmountSpent
      };
    })
    .catch(error => {
      console.error('Error getting trip details:', error);
    });
}

export { getTripDetailsForTraveler, calculateTotalAmountSpent };
