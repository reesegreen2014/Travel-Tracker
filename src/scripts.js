// This is the JavaScript entry file - your code begins here
// Do not delete or rename this file ********

// An example of how you tell webpack to use a CSS (SCSS) file
import './css/styles.css';

// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import './images/turing-logo.png'
import './images/Beach.jpg'
import './images/Jungle.jpg'
import './images/Rome.jpg'

console.log('This is the JavaScript entry file - your code begins here.');

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


export {fetchData}