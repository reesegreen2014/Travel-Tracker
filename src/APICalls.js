function handleFetchError(error) {
  console.error('Fetch error:', error);
  const errorMessageContainer = document.createElement('div');
  errorMessageContainer.style.position = 'fixed';
  errorMessageContainer.style.top = '0';
  errorMessageContainer.style.left = '0';
  errorMessageContainer.style.width = '100%';
  errorMessageContainer.style.height = '100%';
  errorMessageContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  errorMessageContainer.style.color = '#fff';
  errorMessageContainer.style.fontSize = '25px';
  errorMessageContainer.style.display = 'flex';
  errorMessageContainer.style.justifyContent = 'center';
  errorMessageContainer.style.alignItems = 'center';
  errorMessageContainer.style.zIndex = '9999';
  const errorMessageText = document.createElement('div');
  errorMessageText.textContent = "Oops! Our hamsters fell asleep on the wheel. We're waking them up to get our website running again. Please check back later.";
  errorMessageText.style.textAlign = 'center';
  errorMessageContainer.appendChild(errorMessageText);
  document.body.appendChild(errorMessageContainer);
}

window.onerror = function(error) {
  handleFetchError(error);
  return true; 
};

function fetchData(url, options = {}) {
  return fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .catch(handleFetchError)
    .then(result => {
      console.log('Fetch attempt finished.');
      return result;
    }, error => {
      console.log('Fetch attempt finished.');
      throw error;
    });
};

//FETCH REQUESTS
fetchData('http://localhost:3001/api/v1/travelers')
.then(data => {
  console.log('Travelers:', data);
})
.catch(handleFetchError);

fetchData('http://localhost:3001/api/v1/trips')
.then(data => {
  console.log('Trips:', data);
})
.catch(handleFetchError);

fetchData('http://localhost:3001/api/v1/destinations')
.then(data => {
  console.log('Destinations:', data);
})
.catch(handleFetchError);

//POST REQUESTS
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

export {postTripRequest, fetchData}