//LOGIC FUNCTIONS 
const filterTripsByTraveler = (trips = [], travelerId) => {
  return trips.filter(trip => trip.userID === travelerId);
}

const categorizeTrips = (trips = []) => {
  const currentDate = new Date();
  const pastTrips = trips.filter(trip => new Date(trip.date) < currentDate);
  const upcomingTrips = [];
  const pendingTrips = [];

  trips.forEach(trip => {
    const tripDate = new Date(trip.date);
    if (trip.status === 'pending') {
      pendingTrips.push(trip);
    } else if (tripDate >= currentDate) {
      upcomingTrips.push(trip);
    }
  });

  return { pastTrips, upcomingTrips, pendingTrips };
}


const calculateTotalAmountSpent = (pastTrips = [], destinations = [], currentYear) => {
  const agentFee = 0.10;
  let totalAmountSpent = 0;

  console.log("Past Trips:", pastTrips);
  console.log("Destinations:", destinations);
  console.log("Current Year:", currentYear);

  pastTrips.forEach(trip => {
    const tripDate = new Date(trip.date);
    const tripYear = tripDate.getFullYear();

    if (tripYear === currentYear) {
      const destination = destinations.find(dest => dest.id === trip.destinationID);
      console.log("Trip:", trip);
      console.log("Destination:", destination);

      if (destination) {
        const tripCost = (destination.estimatedLodgingCostPerDay * trip.duration) + (destination.estimatedFlightCostPerPerson * trip.travelers);
        totalAmountSpent += tripCost + (tripCost * agentFee);
      }
    }
  });

  console.log("Total Amount Spent:", totalAmountSpent);
  return totalAmountSpent;
}

const getTripDetailsForTraveler = (travelerId, trips = [], destinations = [], currentYear = 2020) => {
  try {
    const travelerTrips = filterTripsByTraveler(trips, travelerId);
    const categorizedTrips = categorizeTrips(travelerTrips);
    const totalAmountSpent = calculateTotalAmountSpent(categorizedTrips.pastTrips, destinations, currentYear);

    return {
      ...categorizedTrips,
      totalAmountSpent
    };
  } catch (error) {
    console.error('Error getting trip details:', error);
    return null;
  }
}

export { getTripDetailsForTraveler, calculateTotalAmountSpent, categorizeTrips };
