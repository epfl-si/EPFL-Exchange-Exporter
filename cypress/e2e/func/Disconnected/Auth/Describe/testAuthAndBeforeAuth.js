export default () => {
  describe('Welcome page disconnected', () => {
  beforeEach(() => {
    // Ignore known network errors from external links
    Cypress.on('uncaught:exception', (err, runnable) => {
      if (err.message.includes('NetworkError')) {
        return false; // prevents Cypress from failing the test
      }
    });
    cy.visit("/")
  })

  it('Check url website', () => {
    cy.url({ decode: true }).should('contain', Cypress.env("SITE_NAME"))
  })

  it('Check default languages', () => {
    cy.url({ decode: true }).should('contain', '/en')
  })

  it('Change languages', () => {

    let msgArray = "source code";

    //Check lang To French
    cy.get('select').select('🇫🇷 FR').should('have.value', 'fr')
    cy.url({ decode: true }).should('contain', '/fr')
    cy.get('a#SourceCode').contains(msgArray.split(" ").reverse().join(" "))

    //Check lang To English
    cy.get('select').select('🇬🇧 EN').should('have.value', 'en')
    cy.url({ decode: true }).should('contain', '/en')
    cy.get('a#SourceCode').contains(msgArray.split(" ").join(" "))

  })

  it('Check Footer Source Code link', () => {
    cy.get('a#SourceCode').invoke('removeAttr', 'target').click();
    cy.origin('https://github.com', () => {
      // Assert that the URL includes "github.com"
      cy.url().should('include', 'github.com');
    });
  })

  it("Login with Entra Id", () => {
    const username = Cypress.env("ENTRA_USER")
    const password = Cypress.env("ENTRA_PASSWORD")
    const loginUrl = Cypress.env("SITE_NAME")
    const cookieName = Cypress.env("COOKIE_NAME")
    const socialLoginOptions = {
      username,
      password,
      loginUrl,
      headless: true,
      logs: false,
      isPopup: true,
      loginSelector: `#LoginButton`,
      postLoginSelector: "#LogoutButton",
    }

    return cy
      .task("MicrosoftSocialLogin", socialLoginOptions)
      .then(({ cookies }) => {
        cy.clearCookies()

        const cookie = cookies
          .filter((cookie) => cookie.name === cookieName)
          .pop()
        if (cookie) {
          cy.setCookie(cookie.name, cookie.value, {
            domain: cookie.domain,
            expiry: cookie.expires,
            httpOnly: cookie.httpOnly,
            path: cookie.path,
            secure: cookie.secure,
          })

          Cypress.Cookies.defaults({
            preserve: cookieName,
          })
        }
      })
  })
})
}