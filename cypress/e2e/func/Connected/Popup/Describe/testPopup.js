export default () => {
  describe('Pop-up', () => {
    beforeEach(() => {
      //Clear form
      cy.get("button#ResetButton").click()
      cy.get("input#ChoicesConfirmButton").click()

      //Fill resource
      cy.get("input#floating_outlined_resource").type("aaa@epfl.ch");

      //Fill date
      cy.get("input#datepickerInput").click();
      cy.wait(100);
      cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click(); //Sélectionner la date de début
      cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click(); //Sélectionner la date de fin
      cy.get('.md\\:w-auto > .bg-red-500').click(); //Confirmer la sélection

      //Fill filename
      cy.get("#floating_outlined").type("exportation");

      //Fill extension
      cy.get("#extension-csv-checkbox").click();
    })
    afterEach(() => {
      //Confirm form
      cy.get("button[type=submit]").click()

      //Check if loader
      cy.get('#loadingImg', { timeout: 10000 }).should('exist');

      //Check if pop-up is open
      cy.get('#errorMsg', { timeout: 10000 }).should('exist');

      //Close the pop-up with the OK button
      cy.get("ConfirmButton").click();

      //Check if pop-up and loader is closed
      cy.get('#loadingImg', { timeout: 10000 }).should('not.exist');
      cy.get('#errorMsg', { timeout: 10000 }).should('not.exist');

      //Open again the pop-up
      cy.get("button[type=submit]").click()
      cy.wait(100)

      //Check if loader
      cy.get('#loadingImg', { timeout: 10000 }).should('exist');

      //Check if pop-up is open
      cy.get('#errorMsg', { timeout: 10000 }).should('exist');

      //Close the pop-up with ESC key
      cy.get("#errorMsg").type('{esc}')

      //Check if pop-up is closed
      cy.get('#loadingImg', { timeout: 10000 }).should('not.exist');
      cy.get('#errorMsg', { timeout: 10000 }).should('not.exist');
    })

    describe("Test resource", () => {
      it("test resource : wrong email", () => {
        cy.wait(100)
      })
    })

    describe("Test date", () => {
      it("test date : too high period", () => {
        //Make highest period
        cy.get("input#datepickerInput").click();
        cy.wait(100);
        cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click(); //Sélectionner la date de fin
        cy.get(':nth-child(1) > .border > .flex > :nth-child(2) > .w-full').click() //Sélectionner l'année de début
        cy.get(':nth-child(1) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Sélectionner l'année de début
        cy.get(':nth-child(1) > .px-0\\.5 > .grid > :nth-child(1)').click() //Sélectionner l'année de début
        cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click(); //Sélectionner la date de début
        cy.get('.md\\:w-auto > .bg-red-500').click(); //Confirmer la sélection
      })
      it("test date : no data", () => {
        //Make period without data ?resource=${process.env.JEST_REsource_ENTRA}&start=2000-02-07&end=2001-12-19
        cy.get("input#floating_outlined_resource").clear();
        cy.get("input#floating_outlined_resource").type(Cypress.env("CYPRESS_REsource"));
        cy.get("input#datepickerInput").click();
        cy.wait(100);
        cy.get(':nth-child(1) > .border > .flex > :nth-child(2) > .w-full').click() //Clique sur l'année de début
        cy.get(':nth-child(1) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de début
        cy.get(':nth-child(1) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de début
        cy.get(':nth-child(1) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de début
        cy.get(':nth-child(1) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de début
        // cy.get(':nth-child(1) > .px-0\\.5 > .grid').children().then((x) => { for (let y of x) { cy.get(y).invoke("text").then(val => { cy.log(val) }) } });

        // let isMissing = true;
        // while (isMissing) {
        //   let rangeData = []
        //   let data = []
        //   // cy.get(':nth-child(1) > .px-0\\.5 > .grid').children().then((x) => { for (let y of x) { cy.get(y).invoke("text").then(val => { rangeData.push({ object: y, value: val }) }) }  });
        //   cy.get(':nth-child(1) > .px-0\\.5 > .grid').children().then((x) => data = x);
        //   cy.log(data);
        //   for (let y of data) {
        //     let val = ""
        //     cy.get(y).invoke("text").then(val => val = val)
        //     cy.log(y);
        //     cy.log(val);
        //     rangeData.push({ object: y, value: val })
        //   }
        //   cy.log(rangeData);
        //   cy.log(rangeData[0]);

        //   data = []
        //   cy.get(':nth-child(1) > .px-0\\.5 > .grid').children().each((button) => data.push(button.text()))
        //   cy.then(() => {
        //     cy.log(data);
        //     cy.log(data);
        //   })
        //   isMissing = false;
        //   break;
        // }
        // cy.get(':nth-child(1) > .px-0\\.5 > .grid').children().then((x) => { cy.get(x[0]).invoke("text").then(val => { cy.log(val) }); cy.get(x.length - 1).invoke("text").then(val => { cy.log(val) }) });

        cy.get(':nth-child(1) > .px-0\\.5 > .grid > :nth-child(1)').click() //Sélectionner l'année de début
        cy.get('.items-stretch > :nth-child(1) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(19)').click(); //Sélectionner la date de début

        cy.wait(100)

        cy.get('.items-stretch > :nth-child(3) > .border > .flex > :nth-child(2) > .w-full').click() //Clique sur l'année de fin
        cy.get(':nth-child(3) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de fin
        cy.get(':nth-child(3) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de fin
        cy.get(':nth-child(3) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de fin
        cy.get(':nth-child(3) > .border > :nth-child(1) > .dark\\:text-white\\/70').click() //Change de page de l'année de fin
        cy.get(':nth-child(3) > .px-0\\.5 > .grid > :nth-child(2)').click() //Sélectionner l'année de fin
        cy.get('.items-stretch > :nth-child(3) > .px-0\\.5 > .gap-y-0\\.5 > :nth-child(24)').click(); //Sélectionner la date de fin
        cy.get('.md\\:w-auto > .bg-red-500').click(); //Confirmer la sélection
      })
    })
  })
}