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

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    MicrosoftEntraID({
      clientId: process.env.AUTH_MICROSOFT_ENTRA_ID_ID,
      issuer: process.env.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID,
      clientSecret: process.env.AUTH_MICROSOFT_ENTRA_ID_SECRET,
      authorization: {
        params: {
          scope: "offline_access openid profile email User.Read Calendars.Read Calendars.Read.Shared",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken = account.access_token
        token.id = profile.id
        token.refresh_token = account.refresh_token
      }
      return token
    },
    async session({ session, token, user }) {
      session.accessToken = token.accessToken
      session.user.id = token.id
      session.user.exp = token.exp
      session.user.refresh_token = token.refresh_token

      return session
    },
  },
  secret: process.env.AUTH_SECRET
});