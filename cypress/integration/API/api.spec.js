/// <reference types="Cypress" />

describe(Cypress.config().baseUrl + ` API validation`, () => {
  let callData;

  context("Calls without setting the parameter", () => {
    before(() => {
      cy.getNameData().then((resp) => {
        callData = resp;
      });
    });

    it("Call status was 422", () => {
      expect(callData.status).to.be.eq(422);
    });

    it("Error call return less then 1s", () => {
      expect(callData.duration).to.be.lessThan(1000);
    });

    it("Call return error if parameter is not set", () => {
      expect(callData.body.error).to.exist;
    });

    it("Call return correct error name if parameter is not set", () => {
      expect(callData.body.error).to.eq("Missing 'name' parameter");
    });
  });

  context("Calls with parameter set", () => {
    const name = "Steven";
    before(() => {
      cy.getNameData(name).then((resp) => {
        callData = resp;
      });
    });

    it("Call status was 200", () => {
      expect(callData.status).to.be.eq(200);
    });

    it("Success call return less then 1s", () => {
      expect(callData.duration).to.be.lessThan(1000);
    });

    it("Body properties has correct types", () => {
      expect(typeof callData.body.count).to.eq("number");
      expect(typeof callData.body.gender).to.eq("string");
      expect(typeof callData.body.name).to.eq("string");
      expect(typeof callData.body.probability).to.eq("number");
    });

    it("API call return correct object", () => {
      const objectForComparing = {
        count: 61542,
        gender: "male",
        name,
        probability: 0.99,
      };
      expect(callData.body).to.deep.equal(objectForComparing);
    });
  });

  context("Call with wrong parameter", () => {
    const name = "??????";
    before(() => {
      cy.getNameData(name).then((resp) => {
        callData = resp;
      });
    });

    it("Call status was 200", () => {
      expect(callData.status).to.be.eq(200);
    });

    it("Success call return less then 1s", () => {
      expect(callData.duration).to.be.lessThan(1000);
    });

    it("Body properties has correct types", () => {
      expect(typeof callData.body.count).to.eq("number");
      expect(typeof callData.body.gender).to.eq("object");
      expect(typeof callData.body.name).to.eq("string");
      expect(typeof callData.body.probability).to.eq("number");
    });

    it("API call return correct object", () => {
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
