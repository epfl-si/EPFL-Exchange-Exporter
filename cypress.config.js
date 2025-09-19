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
      ENTRA_USER: process.env.CYPRESS_MICROSOFT_ENTRA_ID_USERNAME,
      ENTRA_PASSWORD: process.env.CYPRESS_MICROSOFT_ENTRA_ID_PASSWORD,
      COOKIE_NAME: process.env.CYPRESS_COOKIE_NAME,
      SITE_NAME: process.env.CYPRESS_BASE_URL,
      CYPRESS_RESOURCE: process.env.JEST_RESOURCE,
      CYPRESS_RESOURCE_ENTRA: process.env.JEST_RESOURCE_ENTRA
    },
  },
});
