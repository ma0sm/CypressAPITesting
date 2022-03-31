Cypress.Commands.add('getNameData', (parameter) => {
  let callURL = '/';
  if (parameter) {
    callURL = `/?name=${parameter}`;
  }

  cy.request({
    method: 'GET',
    url: callURL,
    failOnStatusCode: false,
  }).then((call) => {
    return call;
  });
});

