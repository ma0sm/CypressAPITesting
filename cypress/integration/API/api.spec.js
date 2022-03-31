/// <reference types="Cypress" />
describe(Cypress.config().baseUrl + ` API validation`, () => {
  let callData;

  context("Calls without setting the parameter", () => {
    before(() => {
      cy.getNameData().then((resp) => {
        callData = resp;
      });
    });

    it("Check the call status was 422", () => {
      expect(callData.status).to.be.eq(422);
    });

    it("Throw an error if the call returns in more than one second", () => {
      expect(callData.duration).to.be.lessThan(1000);
    });

    it("Check an error is returned if the parameter is not set", () => {
      expect(callData.body.error).to.exist;
    });

    it("Check the correct error name is thrown if the parameter is not set", () => {
      expect(callData.body.error).to.eq("Missing 'name' parameter");
    });
  });

  context("Calls with parameters set", () => {
    const name = Cypress.env("name");
    const count = Cypress.env("count");
    const gender = Cypress.env("gender");
    const probability = Cypress.env("probability");

    before(() => {
      cy.getNameData(name).then((resp) => {
        callData = resp;
      });
    });

    it("Check the call status was 200", () => {
      expect(callData.status).to.be.eq(200);
    });

    it("Check the success call returns in less than one second", () => {
      expect(callData.duration).to.be.lessThan(1000);
    });

    it("Check the body properties have the correct types", () => {
      expect(typeof callData.body.count).to.eq("number");
      expect(typeof callData.body.gender).to.eq("string");
      expect(typeof callData.body.name).to.eq("string");
      expect(typeof callData.body.probability).to.eq("number");
    });

    it("Check API call returns the correct object", () => {
      const objectForComparing = {
        count,
        gender,
        name,
        probability,
      };
      expect(callData.body).to.deep.equal(objectForComparing);
    });
  });

  context("Call with an invalid parameter", () => {
    const name = "??????";
    before(() => {
      cy.getNameData(name).then((resp) => {
        callData = resp;
      });
    });

    it("Check the call status was 200", () => {
      expect(callData.status).to.be.eq(200);
    });

    it("Check the success call returns in less than one second", () => {
      expect(callData.duration).to.be.lessThan(1000);
    });

    it("Check the body properties have the correct types", () => {
      expect(typeof callData.body.count).to.eq("number");
      expect(typeof callData.body.gender).to.eq("object");
      expect(typeof callData.body.name).to.eq("string");
      expect(typeof callData.body.probability).to.eq("number");
    });

    it("Check API call returns the correct object", () => {
      const objectForComparing = {
        name,
        gender: null,
        probability: 0,
        count: 0,
      };
      expect(callData.body).to.deep.equal(objectForComparing);
    });
  });
});
