export default () => {
  it('Test button : link generator', () => {

    //Test to click
    cy.get("button#LinkButton").click()

    //Check if element are disabled or not
    cy.get("input#resource").should('be.disabled') //Disabled because resource value is missing
    cy.get("input#period").should('not.be.disabled')
    cy.get("input#filename").should('not.be.disabled')
    cy.get("input#extension").should('not.be.disabled')
    cy.get("input#download").should('be.disabled')

    //Check if element not empty are checked
    cy.get("input#resource").should('not.be.checked')
    cy.get("input#period").should('be.checked')
    cy.get("input#filename").should('be.checked')
    cy.get("input#extension").should('be.checked')
    cy.get("input#download").should('not.be.checked')

    //Click on it and check if state change
    cy.get("input#period").click()
    cy.get("input#filename").click()
    cy.get("input#extension").click()

    //Check if all elements are unchecked
    cy.get("input#resource").should('not.be.checked')
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

    //Go back and fill resource
    cy.get("button#CloseButton").click()

    //Fill email resource
    cy.get("input#floating_outlined_resource").type("aaa")

    //Test to click
    cy.get("button#LinkButton").click()

    //Check if element are disabled or not
    cy.get("input#resource").should('not.be.disabled')
    cy.get("input#period").should('not.be.disabled')
    cy.get("input#filename").should('not.be.disabled')
    cy.get("input#extension").should('not.be.disabled')
    cy.get("input#download").should('not.be.disabled')

    //Check if element not empty are checked
    cy.get("input#resource").should('be.checked')
    cy.get("input#period").should('be.checked')
    cy.get("input#filename").should('be.checked')
    cy.get("input#extension").should('be.checked')
    cy.get("input#download").should('not.be.checked')

    //Click on download
    cy.get("input#download").click()

    //Check if element not empty are checked
    cy.get("input#resource").should('be.checked')
    cy.get("input#period").should('be.checked')
    cy.get("input#filename").should('be.checked')
    cy.get("input#extension").should('be.checked')
    cy.get("input#download").should('be.checked')

    //Copy link
    cy.get("button#CopyButton").click()

    //Check link
    let resourceValue = ""
    let dateValue = ""
    let filenameValue = ""
    let extensionValue = "csv"
    cy.get('input#floating_outlined_resource').invoke('val').then(text => resourceValue = text);
    cy.get('input#datepickerInput').invoke('val').then(text => dateValue = text);
    cy.get('input#floating_outlined').invoke('val').then(text => filenameValue = text);
    cy.then(() => {
      dateValue = dateValue.replaceAll(" ", "").split("~").map(x => x.split("/").reverse().join("-"))
      let start = dateValue[0]
      let end = dateValue[1]
      cy.assertCopiedToClipboard(`${Cypress.env("SITE_NAME")}?resource=${resourceValue}&start=${start}&end=${end}&filename=${filenameValue}&extension=${extensionValue}&download`)
    })

    //Check if copied text is the same that text showed
    cy.assertCopiedToClipboardFromComponent("div#linkPreview")
  })
}