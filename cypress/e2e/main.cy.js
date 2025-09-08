const describeTestAuthAndBeforeAuth = require('./func/Disconnected/Auth/Describe/testAuthAndBeforeAuth')
const itTestLinkGenerator = require('./func/Connected/Form/Button/LinkGenerator/It/testLinkGenerator')
const itTestReset = require('./func/Connected/Form/Button/Reset/It/testReset')
const describeTestRessource = require('./func/Connected/Form/Ressource/Describe/testRessource')
const describeTestDate = require('./func/Connected/Form/Date/Describe/testDate')
const describeTestFilename = require('./func/Connected/Form/Filename/Describe/testFilename')
const describeTestExtension = require('./func/Connected/Form/Extension/Describe/testExtension')
const describeTestPopup = require('./func/Connected/Popup/Describe/testPopup')

const dayjs = require('dayjs')
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const formatDate = "DD/MM/YYYY";

describeTestAuthAndBeforeAuth();

describe('Welcome page connected (form)', () => {
  beforeEach(() => {
    cy.visit("/")
    cy.document().then((doc) => {
      doc.body.focus(); // ensure document has focus
    });
    cy.wait(200);

    //Line to ignore error because of bypassing auth (wait to get id and password for testing)
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })

    cy.wrap(
      Cypress.automation('remote:debugger:protocol', {
          command: 'Browser.grantPermissions',
          params: {
            permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
            origin: window.location.origin,
          },
      }),
    );
  })

  it('Check url website', () => {
    cy.url({ decode: true }).should('contain', Cypress.env("SITE_NAME"))
  })

  it('Check default values : ressource', () => {
    cy.get("input#floating_outlined_ressource").then(val => expect(val).to.be.empty)
  })

  it('Check default values : date', () => {
    cy.checkDateValidity();
  })

  it('Check default values : filename', () => {
    //Get all values of component : Filename
    cy.get("#floating_outlined").invoke("val").then(val => expect(val).not.to.be.empty)
  })

  it('Check default values : extension', () => {
    //Check values of component : extension
    cy.get("#extension-csv").should("be.checked")
    cy.get("#extension-json").should("not.be.checked")
  })

  itTestLinkGenerator()

  itTestReset()
});

describe('Welcome page connected (filling form and url test)', () => {
  beforeEach(() => {
    cy.visit("/")
    cy.wait(200);

    //Clear all default data
    cy.get("button#ResetButton").click()
    cy.get("input#ChoicesConfirmButton").click()

    //Line to ignore error because of bypassing auth (wait to get id and password for testing)
    Cypress.on('uncaught:exception', (err, runnable) => {
      return false
    })
  })

  describeTestRessource()
  describeTestDate()
  describeTestFilename()
  describeTestExtension()
  describeTestPopup()
});




Cypress.Commands.add('assertCopiedToClipboard', value => {
  cy.window().then(win => {
    win.focus();
    win.navigator.clipboard.readText().then(text => {
      expect(text).to.eq(value)
    })
  })
})

Cypress.Commands.add('assertCopiedToClipboardFromComponent', id => {
  cy.get(id).invoke("text").then(val => {
    cy.window().then(win => {
      win.focus();
      win.navigator.clipboard.readText().then(text => {
        expect(text).to.eq(val)
      })
    })
  })
})

Cypress.Commands.add('checkDateValidity', () => {
  let dateFieldValue = ""
  let dateFieldPlaceholder = ""
  let dateFieldPlaceholderChar = ""
  cy.get("#datepickerInput").invoke("val").then(val => { dateFieldValue = val; return dateFieldValue })
  cy.get("#datepickerInput").invoke("attr", "placeholder").then(val => { dateFieldPlaceholder = val; dateFieldPlaceholderChar = val.replaceAll("DD/MM/YYYY", "").replaceAll(" ", ""); return dateFieldPlaceholder }) //   DD/MM/YYYY ~ DD/MM/YYYY
  cy.then(() => {
    for (let date of dateFieldValue.replaceAll(" ", "").split(dateFieldPlaceholderChar)) {
      expect(dayjs(date, formatDate, true).isValid()).to.be.true;
    }
  })
})