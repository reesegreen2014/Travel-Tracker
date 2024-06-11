# TripTrove

TripTrove is an application designed to make travel planning easy and stress-free. With TripTrove, users can log in to their personalized dashboard, which recaps their travel adventures and allows them to search destinations and submit trip requests hassle-free.

## Overview

TripTrove is a comprehensive travel planning tool aimed at providing users with a seamless experience for managing their travels. The main goals of this project are to:
- Simplify the process of booking trips and exploring new destinations.
- Offer a user-friendly dashboard where users can review their travel history and plan future trips.
- Ensure accessibility for all users, including those with disabilities, through thoughtful design and implementation.

## Features

- **Explore Destinations**: Discover over 50 dream destinations with expert planning.
- **Review Your Travel History**: Review your travel history within your dashboard - from your past, upcoming, and pending trips to the amount you've spent YTD on travel.
- **Submit Trip Requests**: Tailor your travel experience by submitting trip requests, and let the travel agents handle the rest.

## Technologies Used

- **HTML/CSS/JS**: Frontend development.
- **Fetch API**: For making HTTP requests to the backend.
- **Mocha and Chai**: Testing framework for unit testing.
- **WAI ARIA**: Ensuring accessibility for all users.
- **Color-Blind Friendly Styling**: Design considerations for color-blind users.
- **Screen Reader Compatibility**: Semantic HTML and accessible styling for screen reader compatibility.

## Installation

### Back End
1. Clone the backend API: `git clone https://github.com/turingschool-examples/travel-tracker-api`
2. Navigate to the API directory: `cd travel-tracker-api`
3. Install dependencies: `npm install`
4. Start the local server: `npm start`

### Front End
1. Clone the repository: `git clone https://github.com/reesegreen2014/TripTrove`
2. Navigate to the project directory: `cd TripTrove`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

## Usage

- Once the front-end and back-end servers are running, log in using username `traveler35` and password `travel`
- Review your travel recap and submit trip requests.

## Challenges

One of the main challenges I faced was understanding the separation of concerns in my code. Determining whether certain logic should reside in my main script file, in logic functions, or in domUpdates was a learning curve. This is an area I continue to work on and improve.

## Wins

- **Comfort with the Application**: Gaining confidence and familiarity with the application as I developed it.
- **Accessibility**: Building with accessibility in mind from the start and ensuring that the app is usable by all users.
- **Creative Flexibility**: Enjoying the process of designing and refining the UI to create a sleek and user-friendly interface.
- **Connecting Front-End to Back-End**: Successfully integrating the front-end with the back-end API.

## Reflections

Building TripTrove was a challenging, yet rewarding experience. It provided valuable insights into full-stack development, from designing accessible and visually appealing interfaces to managing data flow between the front-end and back-end. This project helped me hone my skills in CSS, JavaScript, and overall application structure.

## Screenshots/GIFs

![Landing Page](./src/images/Landing%20Page.png)
*Screenshot of the application landing page.*

![User Dashboard](./src/images/User%20Dashboard.png)
*Screenshot of the application user dashboard.*

![Trip Request](./src/images/Booking%20Form.png)
*Screenshot of the trip request form.*

## Testing

- Run tests in your terminal using Mocha and Chai: `npm test`

## Acknowledgements

- [Google Fonts](https://fonts.google.com) for fonts.
- [CSS Tricks](https://css-tricks.com/) for CSS inspiration.
- [Turing](https://turing.edu/) for education.
