import NextAuth from "next-auth";
import MicrosoftEntraID from "@auth/core/providers/microsoft-entra-id";
import { logAuth } from "./services/logs";


/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
async function refreshAccessToken(token) {
  try {
    const url = `https://login.microsoftonline.com/${process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID}/oauth2/v2.0/token?`

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
    })

    const refreshedTokens = await response.json()

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
    console.error(error);

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
      authorization: {
        params: {
          scope: "offline_access openid profile email User.Read Calendars.Read Calendars.Read.Shared",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // Initial sign in
      if (account) {
        return {
          accessToken: account.access_token,
          accessTokenExpires: Date.now() + account.expires_in * 1000,
          refreshToken: account.refresh_token,
          user : user,
        }
      }

      // Return previous token if the access token has not expired yet
      if (Date.now() < token.accessTokenExpires) {
        return token
      }
      // Access token has expired, try to update it
      return refreshAccessToken(token);
    },
    async session({ session, token }) {
      if (token){
        session.user = token.user
        session.accessToken = token.accessToken
        session.error = token.error
      }

      return session
    },
    async signIn({ user, account, profile, email, credentials }) {
      const usr = {...user};
      delete usr.image;
      delete usr.name;
      const log = {
        user: usr,
      };
      logAuth("signin", log);
      return true
    },
  },
  secret: process.env.AUTH_SECRET
});