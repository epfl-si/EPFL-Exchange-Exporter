// import NextAuth from "next-auth";
// import MicrosoftEntraID from "next-auth/providers/microsoft-entra-id";

// const { handlers, auth, signIn, signOut } = NextAuth({
//   providers: [
//     MicrosoftEntraID({
//       clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
//       clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
//       issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_ISSUER,
//     }),
//   ],
// })

// export default {handlers, auth, signIn, signOut};


// import NextAuth from "next-auth";
// import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";

// export const { handlers, auth } = NextAuth({
//   providers: [
//     MicrosoftEntraID({
//       clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
//       issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
//       clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
//       authorization: {
//         params: {
//           scope: "openid profile email User.Read Calendars.Read Calendars.Read.Shared",
//         },
//       },
//     }),
//   ],
//   secret: process.env.AUTH_SECRET
// });

import NextAuth from "next-auth";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";



const ENTRA_AUTHORIZATION_URL =
  `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/authorize?` +
  new URLSearchParams({
    prompt: "consent",
    grant_type: "authorization_code",
    scope: "offline_access openid profile email User.Read Calendars.Read Calendars.Read.Shared",
    response_type: "code",
  })



/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    console.log("a");
    // console.log(token);
    const url =
      // `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/token?`;
      // `${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/token?` +
      `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/token?`
      // new URLSearchParams({
      //   client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      //   client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      //   grant_type: "authorization_code",
      //   code: token.refreshToken,
      //   scope: 'https://graph.microsoft.com/.default',
      //   redirect_uri : "http://localhost:3000/api/auth/callback/microsoft-entra-id"
      // })

    // const formData = new URLSearchParams();
    // formData.append('client_id', process.env.AUTH_MICROSOFT_ENTRA_ID_ID);
    // formData.append('client_secret', process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET);
    // formData.append('refresh_token', token.refreshToken);
    // formData.append('grant_type', 'refresh_token');
    // formData.append('scope', 'openid profile email User.Read offline_access');

    const response = await fetch(url, {
      method: "POST",
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
        scope: `https://graph.microsoft.com/.default`,
        refresh_token: token.refreshToken,
        redirect_uri : "http://localhost:3000/api/auth/callback/microsoft-entra-id",
        grant_type: "refresh_token",
        client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      })
      // body: formData.toString()
    })

    // console.log("before");

    // throw {response: response, params : {
    //   client_id: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
    //   scope: `${process.env.AUTH_MICROSOFT_ENTRA_ID_ID}%2f.default openid profile offline_access`,
    //   refresh_token: token.refreshToken,
    //   redirect_uri : "http://localhost:3000/api/auth/callback/microsoft-entra-id",
    //   grant_type: "refresh_token",
    //   client_secret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
    // }, url:url};

    //Error of refresh token here
    const refreshedTokens = await response.json()

    console.log("after");
    console.log(token.refreshToken);
    console.log(refreshedTokens);
    console.log("after");

    if (!response.ok) {
      throw {refreshedTokens: refreshedTokens, url:url}
    }

    return {
      ...token,
      accessToken: refreshedTokens.access_token,
      accessTokenExpires: Date.now() + refreshedTokens.expires_in * 1000,
      refreshToken: refreshedTokens.refresh_token ?? token.refreshToken, // Fall back to old refresh token
    }
  }
  catch (error) {
    console.log(error)

    return {
      ...token,
      error: "RefreshAccessTokenError",
    }
  }
}

































export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      issuer: `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/v2.0`,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      // authorizationUrl : ENTRA_AUTHORIZATION_URL
      authorization: {
        params: {
          scope: "offline_access openid profile email User.Read Calendars.Read Calendars.Read.Shared",
        },
      },
      // profilePhotoSize : 360 // break site
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      console.log(token);
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user : user,
        }
      }

      console.log("a");
      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        console.log("b");
        return token
      }
      console.log("c");
      // Access token has expired, try to update it
      let updated = refreshAccessToken(token);
      console.log(updated);
      return updated;
    },
    async session({ session, token }) {
      if (token){
        session.user = token.user
        session.accessToken = token.accessToken
        session.error = token.error
      }

      return session
    },
  },
  secret: process.env.AUTH_SECRET
});