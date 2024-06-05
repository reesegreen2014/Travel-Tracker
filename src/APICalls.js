

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


export {fetchData }