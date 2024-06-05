import { fetchData } from "../APICalls";
import { getTripDetailsForTraveler, calculateTotalAmountSpent } from "../Logic Functions/tripProcessor";


//querySelectors
const totalAmountSpentElement = document.querySelector('.sub-container4 .card-price')

const updateTotalAmountSpent = (amount) => {
    if (totalAmountSpentElement) {
        totalAmountSpentElement.innerHTML = `You have spent $${amount.toFixed(2)} on trips this year!`;
    }
}

export { updateTotalAmountSpent }

