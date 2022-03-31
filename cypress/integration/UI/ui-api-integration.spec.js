/// <reference types="Cypress" />

describe(
  "Comparison of " +
    Cypress.config().baseUrl.replace("api.", "") +
    " and " +
    Cypress.config().baseUrl,
  () => {
    let callData;

    beforeEach(() => {
      cy.visit(Cypress.config().baseUrl.replace("api.", ""));

      cy.get("span.jss156")
        .first()
        .invoke("text")
        .then((firstTryMeSection) => {
          const parameterName = firstTryMeSection.substring(
            firstTryMeSection.indexOf("=") + 1
          );

          cy.getNameData(parameterName).then((resp) => {
            callData = resp.body;
          });
        });
    });

    it("Check the UI data response is identical to the real API data response", () => {
      cy.get("div.jss159 > div")
        .invoke("text")
        .then((uiData) => {
          expect(callData).to.deep.equal(JSON.parse(uiData));
        });
    });

    it("Check the try me button in the UI returns the same JSON as the API", () => {
      cy.get('[data-click="api-test"]')
        .first()
        .invoke("removeAttr", "target")
        .click();
      cy.get("body")
        .invoke("text")
        .then((uiReproText) => {
          expect(callData).to.deep.equal(JSON.parse(uiReproText));
        });
    });

    it("Check that the UI and API return different results when provided different parameters", () => {
      cy.get('[data-click="api-test"]')
        .first()
        .invoke("removeAttr", "target")
        .click();
      cy.get("body")
        .invoke("text")
        .then((uiReproText) => {
          cy.getNameData("test").then((resp) => {
            expect(resp.body).not.to.deep.equal(JSON.parse(uiReproText));
          });
        });
    });
  }
);
