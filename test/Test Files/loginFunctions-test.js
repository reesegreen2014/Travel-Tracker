const chai = require('chai');
import { expect } from 'chai';
const { validateCredentials, extractTravelerId } = require('../../src/Logic Functions/loginFunctions');
const { loginTestData } = require('../Datasets for Tests/loginFunctions-data');

describe('loginFunctions', () => {
    describe('validateCredentials', () => {
        let validCredentials;
        let invalidCredentials;

        beforeEach(() => {
            validCredentials = loginTestData.validCredentials;
            invalidCredentials = loginTestData.invalidCredentials;
        });

        it('should return true for valid traveler credentials', () => {
            expect(validateCredentials(validCredentials.username, validCredentials.password)).to.be.true;
        });

        it('should return false for invalid traveler credentials', () => {
            expect(validateCredentials(invalidCredentials.username, invalidCredentials.password)).to.be.false;
        });

        it('should return false for correct username and incorrect password', () => {
            expect(validateCredentials(validCredentials.username, invalidCredentials.password)).to.be.false;
        });

        it('should return false for incorrect username and correct password', () => {
            expect(validateCredentials(invalidCredentials.username, validCredentials.password)).to.be.false;
        });

        it('should return false for empty username and password', () => {
            expect(validateCredentials('', '')).to.be.false;
        });

        it('should return false for valid username and empty password', () => {
            expect(validateCredentials(validCredentials.username, '')).to.be.false;
        });

        it('should return false for empty username and valid password', () => {
            expect(validateCredentials('', validCredentials.password)).to.be.false;
        });
    });

    describe('extractTravelerId', () => {
        let travelerUsernames;
        let travelerIds;

        beforeEach(() => {
            travelerUsernames = loginTestData.travelerUsernames;
            travelerIds = loginTestData.travelerIds;
        });

        it('should return the traveler ID from the username', () => {
            travelerUsernames.forEach((username, index) => {
                const expectedId = travelerIds[index];
                expect(extractTravelerId(username)).to.equal(expectedId);
            });
        });

        it('should return -1 for an invalid username format', () => {
            expect(extractTravelerId('invalidUsername')).to.equal(-1);
        });

        it('should return -1 for an empty username', () => {
            expect(extractTravelerId('')).to.equal(-1);
        });
    });
});
