export default () => {
  it('Test button : reset', () => {
    //Write data inside element which doesn't have value by default
    cy.get("input#floating_outlined_room").type("aaa")

    //Test to click and deny the resetting
    cy.get("button#ResetButton").click()
    cy.get("input#ChoicesDenyButton").click()

    //Check if data is not empty => deny resetting
    cy.get("input#floating_outlined_room").invoke('val').should('not.be.empty');
    cy.get("input#datepickerInput").invoke('val').should("not.be.empty");
    cy.get("input#floating_outlined").invoke('val').should("not.be.empty");
    cy.get("#extension-csv").should("be.checked");
    cy.get("#extension-json").should("not.be.checked");

    //Test to click and accept the resetting
    cy.get("button#ResetButton").click()
    cy.get("input#ChoicesConfirmButton").click()

    //Check if data is empty => accept resetting
    cy.get("input#floating_outlined_room").invoke('val').should('be.empty');
    cy.get("input#datepickerInput").invoke('val').should('be.empty');
    cy.get("input#floating_outlined").invoke('val').should('be.empty');
    cy.get("#extension-csv").should("not.be.checked");
    cy.get("#extension-json").should("not.be.checked");
  })
}