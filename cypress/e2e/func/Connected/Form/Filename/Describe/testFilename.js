export default () => {
  describe('Field : Filename', () => {
    beforeEach(() => {
      //Write correct syntax email address
      cy.get("input#floating_outlined_room").type("aaa@epfl.ch");

      //Write correct date
      cy.get("input#datepickerInput").click();
      cy.wait(100);
      cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click(); //Sélectionner la date de début
      cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click(); //Sélectionner la date de fin
      cy.get('.md\\:w-auto > .bg-red-500').click(); //Confirmer la sélection
    })
    afterEach(() => {
      cy.get("button[type=submit]").click()
      cy.wait(100)
      cy.get('#loadingImg').should("not.exist") //Check only if loader appeard
    })
    it("Test fill filename and check if it's correct", () => {
      cy.get("#floating_outlined").type("oeifsoijfeouf");
    })
    it("Test fill filename with 'export' tag and check if it create a full built-in name file", () => {
      cy.get("#floating_outlined").type("exportation");

      //exportation_meetings_aaa_from_2025-03-31_to_2025-04-28
      let dateFieldValue = ""
      let dateFieldPlaceholder = ""
      let dateFieldPlaceholderChar = ""
      let room = ""
      cy.get("#datepickerInput").invoke("val").then(val => { dateFieldValue = val; return dateFieldValue })
      cy.get("#floating_outlined_room").invoke("val").then(val => { room = val; return room })
      cy.get("#datepickerInput").invoke("attr", "placeholder").then(val => { dateFieldPlaceholder = val; dateFieldPlaceholderChar = val.replaceAll("DD/MM/YYYY", "").replaceAll(" ", ""); return dateFieldPlaceholder }) //   DD/MM/YYYY ~ DD/MM/YYYY
      cy.then(() => {
        const [start, end] = dateFieldValue.replaceAll(" ", "").split(dateFieldPlaceholderChar).map((date) => date.split("/").reverse().join("-"))
        cy.get("#floating_outlined").invoke("val").should("eq", ["exportation", "meetings", room.split('@')[0], "from", start, "to", end].join("_"))
      })
    })
    it("Test cross to delete and value in url query string", () => {
      //Define text to write
      let text = "oamfseofise"

      //Check if the cross hidden by default
      cy.get("#floating_outlined-remover").should("be.hidden");

      //Write content and check if it's printed
      cy.get("input#floating_outlined").type(text)
      cy.get("input#floating_outlined").invoke('val').should('eq', text);

      //Check if the cross is now visible and the value come in url
      cy.get("#floating_outlined-remover").should("be.visible");
      cy.url().should('include', `filename=${text}`);

      //Click on the cross and check if it disappeard and if the text are now deleted
      cy.get("#floating_outlined-remover").click();
      cy.get("input#floating_outlined").invoke('val').should('eq', "");

      //Check if the cross is now hidden and the value removed in url
      cy.get("#floating_outlined-remover").should("be.hidden");
      cy.url().should('not.include', `filename=${text}`);
    })
  })
}