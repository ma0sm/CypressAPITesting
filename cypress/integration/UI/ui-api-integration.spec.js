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

    it("UI data response is identical with real API data response", () => {
      cy.get("div.jss159 > div")
        .invoke("text")
        .then((uiData) => {
          expect(callData).to.deep.equal(JSON.parse(uiData));
        });
    });

    it("UI try me button return identical JSON with API", () => {
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

    it("UI and API return different result with different parameter", () => {
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
