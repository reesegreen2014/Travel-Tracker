const validateCredentials = (username, password) => {
    const travelerId = extractTravelerId(username);
    if (travelerId !== -1) {
        return username.startsWith('traveler') && password === 'travel';
    }
    return false;
}

const extractTravelerId = (username) => {
    const travelerUserID= username.slice(8);
    const travelerId = parseInt(travelerUserID);
    return (travelerId >= 1 && travelerId <= 50) ? travelerId : -1;
};

export { validateCredentials, extractTravelerId };
