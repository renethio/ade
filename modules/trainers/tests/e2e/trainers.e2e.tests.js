'use strict';

describe('Trainers E2E Tests:', function () {
  describe('Test Trainers page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/trainers');
      expect(element.all(by.repeater('trainer in trainers')).count()).toEqual(0);
    });
  });
});
