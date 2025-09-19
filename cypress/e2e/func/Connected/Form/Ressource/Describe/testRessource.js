export default () => {
  describe('Field : Resource', () => {
    afterEach(() => {
      cy.get("button[type=submit]").click()
      cy.wait(100)
      cy.get('#loadingImg').should("not.exist") //Check only if loader appeard
    })
    it("Test resource input", () => {
      cy.get('input#floating_outlined_resource').should('have.attr', 'required');
      cy.get('input#floating_outlined_resource').should('have.attr', 'pattern', '.+@epfl\\.ch');;
    })

    it("Test fill resource and check if it's correct (not email)", () => {
      cy.get("input#floating_outlined_resource").type("aaa")
      cy.get("input#floating_outlined_resource").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill resource and check if it's correct (wrong email)", () => {
      cy.get("input#floating_outlined_resource").type("aaa@aaa.a")
      cy.get("input#floating_outlined_resource").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill resource and check if it's correct (wrong email - partial domain)", () => {
      cy.get("input#floating_outlined_resource").type("aaa@epfl.a")
      cy.get("input#floating_outlined_resource").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill resource and check if it's correct (wrong email - partial country)", () => {
      cy.get("input#floating_outlined_resource").type("aaa@aaa.ch")
      cy.get("input#floating_outlined_resource").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill resource and check if it's correct (good email)", () => {
      cy.get("input#floating_outlined_resource").type("aaa@epfl.ch")
      cy.get("input#floating_outlined_resource").invoke('val').should('match', /(.+@epfl.ch)+/);
    })

    it("Test cross to delete and value in url query string", () => {
      //Define text to write
      let text = "aaa@epfl.ch"
      let textInQuery = text.replace("@", "%40")

      //Check if the cross hidden by default
      cy.get("#floating_outlined_resource-remover").should("be.hidden");

      //Write content and check if it's printed and added in url
      cy.get("input#floating_outlined_resource").type(text)
      cy.wait(100)
      cy.url().should('include', `resource=${textInQuery}`);
      cy.get("input#floating_outlined_resource").invoke('val').should('eq', text);

      //Check if the cross is now visible
      cy.get("#floating_outlined_resource-remover").should("be.visible");

      //Click on the cross and check if it disappeard and if the text are now deleted and removed in url
      cy.get("#floating_outlined_resource-remover").click();
      cy.wait(100)
      cy.url().should('not.include', `resource=${textInQuery}`);
      cy.get("input#floating_outlined_resource").invoke('val').should('eq', "");

      //Check if the cross is now hidden
      cy.get("#floating_outlined_resource-remover").should("be.hidden");
    })

    //Make an it to check for propal (unavailable now because i bypass auth.js so this app cannot do request to graph api)
  })
}