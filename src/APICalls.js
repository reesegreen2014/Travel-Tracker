

function fetchData(url, options = {}) {
    return fetch(url, options)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error fetching data:', error);
        throw error; 
      })
      .finally(() => {
        console.log('Fetch attempt finished.');
      });
  }

fetchData('http://localhost:3001/api/v1/travelers')
.then(data => {
  console.log('Travelers:', data);
})
.catch(error => {
});


fetchData('http://localhost:3001/api/v1/trips')
.then(data => {
  console.log('Trips:', data);
})
.catch(error => {
});

fetchData('http://localhost:3001/api/v1/destinations')
.then(data => {
  console.log('Destinations:', data);
})
.catch(error => {
});


//POST FUNCTION
function postTripRequest(id, userID, destinationID, travelers, date, duration, status, suggestedActivities) {
  const requestBody = {
    id,
    userID,
    destinationID,
    travelers,
    date,
    duration,
    status,
    suggestedActivities
  };

  return fetch('http://localhost:3001/api/v1/trips', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not successful: ' + response.statusText);
    }
    return response.json();
  })
  .then(data => {
    console.log('Success:', data);
    return data;
  })
  .catch(error => {
    console.error('Error:', error);
  });
}

export {fetchData, postTripRequest }