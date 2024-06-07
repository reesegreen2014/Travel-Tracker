const testData = {
  travelers: [
    {
      id: 10,
      name: 'Reese Green',
      age: 28,
      trips: [1, 2, 3], 
    },
    {
      id: 20,
      name: 'Heather Faerber',
      age: 25,
      trips: [4], 
    },
  ],
  trips: [
    {
      id: 1,
      userID: 10,
      destinationID: 26,
      travelers: 1,
      date: '2024/08/31',
      duration: 16,
      status: 'past'
    },
    {
      id: 2,
      userID: 10,
      destinationID: 35,
      travelers: 4,
      date: '2024/09/01',
      duration: 16,
      status: 'past'
    },
    {
      id: 3,
      userID: 10,
      destinationID: 47,
      travelers: 5,
      date: '2024/09/02',
      duration: 20,
      status: 'upcoming'
    },
    {
      id: 4,
      userID: 20,
      destinationID: 26,
      travelers: 2,
      date: '2024/10/01',
      duration: 10,
      status: 'upcoming'
    },
  ],
  destinations: [
    {
      id: 26,
      destination: 'London',
      estimatedLodgingCostPerDay: 100,
      estimatedFlightCostPerPerson: 1000
    },
    {
      id: 35,
      destination: 'Anchorage',
      estimatedLodgingCostPerDay: 200,
      estimatedFlightCostPerPerson: 100
    },
    {
      id: 47,
      destination: 'Zurich',
      estimatedLodgingCostPerDay: 1100,
      estimatedFlightCostPerPerson: 110
    },
  ],
};

export {testData}
