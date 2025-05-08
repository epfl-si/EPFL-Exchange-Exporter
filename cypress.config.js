const { defineConfig } = require("cypress");
const { MicrosoftSocialLogin } = require("cypress-social-logins").plugins
require('dotenv').config({ path: '.env.local' })

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on("task", {
        MicrosoftSocialLogin: MicrosoftSocialLogin,
      })
    },
    baseUrl: process.env.CYPRESS_BASE_URL,
    chromeWebSecurity: false,
    env: {
      ENTRA_USER: process.env.CYPRESS_TEST_MICROSOFT_ENTRA_ID_USERNAME,
      ENTRA_PASSWORD: process.env.CYPRESS_TEST_MICROSOFT_ENTRA_ID_PASSWORD,
      COOKIE_NAME: process.env.CYPRESS_COOKIE_NAME,
      SITE_NAME: process.env.CYPRESS_BASE_URL
    },
  },
});
