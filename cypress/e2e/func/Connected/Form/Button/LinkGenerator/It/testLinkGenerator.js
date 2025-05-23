export default () => {
  it('Test button : link generator', () => {

    //Test to click
    cy.get("button#LinkButton").click()

    //Check if element are disabled or not
    cy.get("input#room").should('be.disabled') //Disabled because room value is missing
    cy.get("input#period").should('not.be.disabled')
    cy.get("input#filename").should('not.be.disabled')
    cy.get("input#extension").should('not.be.disabled')
    cy.get("input#download").should('be.disabled')

    //Check if element not empty are checked
    cy.get("input#room").should('not.be.checked')
    cy.get("input#period").should('be.checked')
    cy.get("input#filename").should('be.checked')
    cy.get("input#extension").should('be.checked')
    cy.get("input#download").should('not.be.checked')

    //Click on it and check if state change
    cy.get("input#period").click()
    cy.get("input#filename").click()
    cy.get("input#extension").click()

    //Check if all elements are unchecked
    cy.get("input#room").should('not.be.checked')
    cy.get("input#period").should('not.be.checked')
    cy.get("input#filename").should('not.be.checked')
    cy.get("input#extension").should('not.be.checked')
    cy.get("input#download").should('not.be.checked')

    //Copy link
    cy.get("button#CopyButton").click()

    //Check link
    cy.assertCopiedToClipboard(Cypress.env("SITE_NAME"))

    //Check if copied text is the same that text showed
    cy.assertCopiedToClipboardFromComponent("div#linkPreview")

    //Go back and fill room
    cy.get("button#CloseButton").click()

    //Fill email room
    cy.get("input#floating_outlined_room").type("aaa")

    //Test to click
    cy.get("button#LinkButton").click()

    //Check if element are disabled or not
    cy.get("input#room").should('not.be.disabled')
    cy.get("input#period").should('not.be.disabled')
    cy.get("input#filename").should('not.be.disabled')
    cy.get("input#extension").should('not.be.disabled')
    cy.get("input#download").should('not.be.disabled')

    //Check if element not empty are checked
    cy.get("input#room").should('be.checked')
    cy.get("input#period").should('be.checked')
    cy.get("input#filename").should('be.checked')
    cy.get("input#extension").should('be.checked')
    cy.get("input#download").should('not.be.checked')

    //Click on download
    cy.get("input#download").click()

    //Check if element not empty are checked
    cy.get("input#room").should('be.checked')
    cy.get("input#period").should('be.checked')
    cy.get("input#filename").should('be.checked')
    cy.get("input#extension").should('be.checked')
    cy.get("input#download").should('be.checked')

    //Copy link
    cy.get("button#CopyButton").click()

    //Check link
    let roomValue = ""
    let dateValue = ""
    let filenameValue = ""
    let extensionValue = "csv"
    cy.get('input#floating_outlined_room').invoke('val').then(text => roomValue = text);
    cy.get('input#datepickerInput').invoke('val').then(text => dateValue = text);
    cy.get('input#floating_outlined').invoke('val').then(text => filenameValue = text);
    cy.then(() => {
      dateValue = dateValue.replaceAll(" ", "").split("~").map(x => x.split("/").reverse().join("-"))
      let start = dateValue[0]
      let end = dateValue[1]
      cy.assertCopiedToClipboard(`${Cypress.env("SITE_NAME")}?room=${roomValue}&start=${start}&end=${end}&filename=${filenameValue}&extension=${extensionValue}&download`)
    })

    //Check if copied text is the same that text showed
    cy.assertCopiedToClipboardFromComponent("div#linkPreview")
  })
}