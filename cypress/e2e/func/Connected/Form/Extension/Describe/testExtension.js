export default () => {
  describe('Field : Extension', () => {
    beforeEach(() => {
      //Write correct syntax email address
      cy.get("input#floating_outlined_room").type("aaa@epfl.ch");

      //Write correct date
      cy.get("input#datepickerInput").click();
      cy.wait(100);
      cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click(); //Sélectionner la date de début
      cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click(); //Sélectionner la date de fin
      cy.get('.md\\:w-auto > .bg-red-500').click(); //Confirmer la sélection

      //Write correct filename
      cy.get("#floating_outlined").type("exportation");
    })
    afterEach(() => {
      cy.get("button[type=submit]").click()
      cy.wait(100)
      cy.get('#loadingImg').should("exist") //Check only if loader appeard
    })
    it("test checkbox extension : csv", () => {
      //Check if all chebox are unchecked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("not.be.checked");

      //Click in CSV button
      cy.get("#extension-csv-checkbox").click();

      //Check if CSV checkbox are checked
      cy.get("#extension-csv").should("be.checked");
      cy.get("#extension-json").should("not.be.checked");
    })
    it("test checkbox extension : json", () => {
      //Check if all chebox are unchecked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("not.be.checked");

      //Click in JSON button
      cy.get("#extension-json-checkbox").click();

      //Check if JSON checkbox are checked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("be.checked");
    })
    it("test checkbox extension : csv to json", () => {
      //Check if all chebox are unchecked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("not.be.checked");

      //Click in CSV button
      cy.get("#extension-csv-checkbox").click();

      //Check if CSV checkbox are checked
      cy.get("#extension-csv").should("be.checked");
      cy.get("#extension-json").should("not.be.checked");

      //Click in JSON button
      cy.get("#extension-json-checkbox").click();

      //Check if JSON checkbox are checked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("be.checked");
    })
    it("test checkbox extension : json to csv", () => {
      //Check if all chebox are unchecked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("not.be.checked");

      //Click in CSV button
      cy.get("#extension-json-checkbox").click();

      //Check if CSV checkbox are checked
      cy.get("#extension-csv").should("not.be.checked");
      cy.get("#extension-json").should("be.checked");

      //Click in JSON button
      cy.get("#extension-csv-checkbox").click();

      //Check if JSON checkbox are checked
      cy.get("#extension-csv").should("be.checked");
      cy.get("#extension-json").should("not.be.checked");
    })
  })
}