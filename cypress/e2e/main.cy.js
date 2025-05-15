const dayjs = require('dayjs')
const customParseFormat = require("dayjs/plugin/customParseFormat");

dayjs.extend(customParseFormat);

const formatDate = "DD/MM/YYYY";

// describe('Welcome page disconnected', () => {
//   beforeEach(() => {
//     // Ignore known network errors from external links
//     Cypress.on('uncaught:exception', (err, runnable) => {
//       if (err.message.includes('NetworkError')) {
//         return false; // prevents Cypress from failing the test
//       }
//     });
//     cy.visit("/")
//   })

//   it('Check url website', () => {
//     cy.url({ decode: true }).should('contain', Cypress.env("SITE_NAME"))
//   })

//   it('Check default languages', () => {
//     cy.url({ decode: true }).should('contain', '/en')
//   })

//   it('Change languages', () => {

//     let msgArray = "source code";

//     //Check lang To French
//     cy.get('select').select('🇫🇷 FR').should('have.value', 'fr')
//     cy.url({ decode: true }).should('contain', '/fr')
//     cy.get('a#SourceCode').contains(msgArray.split(" ").reverse().join(" "))

//     //Check lang To English
//     cy.get('select').select('🇬🇧 EN').should('have.value', 'en')
//     cy.url({ decode: true }).should('contain', '/en')
//     cy.get('a#SourceCode').contains(msgArray.split(" ").join(" "))

//   })

//   it('Check Footer Source Code link', () => {
//     cy.get('a#SourceCode').invoke('removeAttr', 'target').click();
//     cy.origin('https://github.com', () => {
//       // Assert that the URL includes "github.com"
//       cy.url().should('include', 'github.com');
//     });
//   })

//   it("Login with Entra Id", () => {
//     const username = Cypress.env("ENTRA_USER")
//     const password = Cypress.env("ENTRA_PASSWORD")
//     const loginUrl = Cypress.env("SITE_NAME")
//     const cookieName = Cypress.env("COOKIE_NAME")
//     const socialLoginOptions = {
//       username,
//       password,
//       loginUrl,
//       headless: true,
//       logs: false,
//       isPopup: true,
//       loginSelector: `#LoginButton`,
//       postLoginSelector: "#LogoutButton",
//     }

//     return cy
//       .task("MicrosoftSocialLogin", socialLoginOptions)
//       .then(({ cookies }) => {
//         cy.clearCookies()

//         const cookie = cookies
//           .filter((cookie) => cookie.name === cookieName)
//           .pop()
//         if (cookie) {
//           cy.setCookie(cookie.name, cookie.value, {
//             domain: cookie.domain,
//             expiry: cookie.expires,
//             httpOnly: cookie.httpOnly,
//             path: cookie.path,
//             secure: cookie.secure,
//           })

//           Cypress.Cookies.defaults({
//             preserve: cookieName,
//           })
//         }
//       })
//   })
// })

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

  it('Check default values : room', () => {
    cy.get("input#floating_outlined_room").then(val => expect(val).to.be.empty)
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

    //Test to click and deny the resetting
    cy.get("button#ResetButton").click()
    cy.get("input#ChoicesConfirmButton").click()

    //Check if data is empty => accept resetting
    cy.get("input#floating_outlined_room").invoke('val').should('be.empty');
    cy.get("input#datepickerInput").invoke('val').should('be.empty');
    cy.get("input#floating_outlined").invoke('val').should('be.empty');
    cy.get("#extension-csv").should("not.be.checked");
    cy.get("#extension-json").should("not.be.checked");
  })
});

describe('Welcome page connected (filling form and pop-up test)', () => {
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

  describe('Field : Room', () => {
    afterEach(() => {
      cy.get("button[type=submit]").click()
      cy.wait(100)
      cy.get('#loadingImg').should("not.exist") //Check only if loader appeard
    })
    it("Test room input", () => {
      cy.get('input#floating_outlined_room').should('have.attr', 'required');
      cy.get('input#floating_outlined_room').should('have.attr', 'pattern', '.+@epfl\\.ch');;
    })

    it("Test fill room and check if it's correct (not email)", () => {
      cy.get("input#floating_outlined_room").type("aaa")
      cy.get("input#floating_outlined_room").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill room and check if it's correct (wrong email)", () => {
      cy.get("input#floating_outlined_room").type("aaa@aaa.a")
      cy.get("input#floating_outlined_room").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill room and check if it's correct (wrong email - partial domain)", () => {
      cy.get("input#floating_outlined_room").type("aaa@epfl.a")
      cy.get("input#floating_outlined_room").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill room and check if it's correct (wrong email - partial country)", () => {
      cy.get("input#floating_outlined_room").type("aaa@aaa.ch")
      cy.get("input#floating_outlined_room").invoke('val').should('not.match', /(.+@epfl.ch)+/);
    })

    it("Test fill room and check if it's correct (good email)", () => {
      cy.get("input#floating_outlined_room").type("aaa@epfl.ch")
      cy.get("input#floating_outlined_room").invoke('val').should('match', /(.+@epfl.ch)+/);
    })

    //Make an it to check for propal (unavailable now because i bypass auth.js so this app cannot do request to graph api)
  })

  describe('Field : Date', () => {
    beforeEach(() => {
      //Write correct syntax email address
      cy.get("input#floating_outlined_room").type("aaa@epfl.ch");
    })
    afterEach(() => {
      cy.get("button[type=submit]").click()
      cy.wait(100)
      cy.get('#loadingImg').should("not.exist") //Check only if loader appeard
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
  })

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
  })

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