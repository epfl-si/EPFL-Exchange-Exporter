export default () => {
  describe('Field : Date', () => {
    beforeEach(() => {
      //Write correct syntax email address
      cy.get("input#floating_outlined_resource").type("aaa@epfl.ch");
    })
    afterEach(() => {
      switch(Cypress.currentTest.title) {
        case "Test cross to delete and value in url query string":
          break;
        default:
          cy.get("button[type=submit]").click()
          cy.wait(100)
          cy.get('#loadingImg').should("not.exist") //Check only if loader appeard
        break;
      }
    })
    it("Test fill Date and check if it's correct", () => {
      //Ouvrir le calendrier
      cy.get("input#datepickerInput").click();
      cy.wait(100);

      //Sélectionner la date de début
      cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click();

      //Sélectionner la date de fin
      cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click();

      //Confirmer la sélection
      cy.get('.md\\:w-auto > .bg-red-500').click();

      //Vérifier que les dates entrées soit de vrai dates
      cy.checkDateValidity();
    })
    it("Test cross to delete and value in url query string", () => {

      //Ouvrir le calendrier
      cy.get("input#datepickerInput").click();
      cy.wait(100);

      //Sélectionner la date de début
      cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click();

      //Sélectionner la date de fin
      cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click();

      //Confirmer la sélection
      cy.get('.md\\:w-auto > .bg-red-500').click();

      let dateFieldValue = ""
      let dateFieldPlaceholder = ""
      let dateFieldPlaceholderChar = ""
      cy.get("#datepickerInput").invoke("val").then(val => { dateFieldValue = val; return dateFieldValue })
      cy.get("#datepickerInput").invoke("attr", "placeholder").then(val => { dateFieldPlaceholder = val; dateFieldPlaceholderChar = val.replaceAll("DD/MM/YYYY", "").replaceAll(" ", ""); return dateFieldPlaceholder }) //   DD/MM/YYYY ~ DD/MM/YYYY
      cy.then(() => {
        const [start, end] = dateFieldValue.replaceAll(" ", "").split(dateFieldPlaceholderChar).map((date) => date.split("/").reverse().join("-"));

        //Check if the cross is now visible and the value come in url
        cy.get('.right-0').should("be.visible");
        cy.url().should('include', `start=${start}&end=${end}`);

        //Click on the cross and check if it disappeard and if the text are now deleted
        cy.get('.right-0').click();
        cy.get("input#datepickerInput").invoke('val').should('eq', "");

        //Check if the value removed in url
        cy.url().should('not.include', `start=${start}&end=${end}`);
      })
    })
  })
}