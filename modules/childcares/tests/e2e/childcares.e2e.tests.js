'use strict';

describe('Childcares E2E Tests:', function () {
  describe('Test Childcares page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/childcares');
      expect(element.all(by.repeater('childcare in childcares')).count()).toEqual(0);
    });
  });
});
