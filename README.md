# EPFL Exchange Exporter - EEE

## What is EEE ?

EEE stand for EPFL Exchange Exporter. This app is used to return all calendars event of conference room, inside a data file as csv, json...

## What does technologies uses ?

### Next.js
Next.js is an open-source framework, powered by React.js and node.js.

### Tailwind CSS
Tailwind CSS is a CSS framework for rapidly building modern websites without ever leaving your HTML.

### NextAuth.js
Next-auth is an open-source authentication librabry designed for next.js. Its goal here is to give microsoft entra id authentication.

### NextIntl.js
Next-auth is an internationalization librabry designed for next.js. Its goal here is to let user chose his favorite language among proposed.



## CONFIGURATION

### Environment file

Create a `.env.local` file, or rename `.env.example` and push this content inside :

```bash
AUTH_SECRET=
AUTH_MICROSOFT_ENTRA_ID_ID=
AUTH_MICROSOFT_ENTRA_ID_SECRET=
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=
```

with :


**AUTH_SECRET** : generated with **`npx auth`**. Read more: https://cli.authjs.dev>

**AUTH_MICROSOFT_ENTRA_ID_ID** : the **id** of **Microsoft entra id** app

**AUTH_MICROSOFT_ENTRA_ID_SECRET** : the **secret** of **Microsoft entra id** app

**AUTH_MICROSOFT_ENTRA_ID_TENANT_ID** : the **tenant** id of **Microsoft entra id** app

## INSTALLATION

After confuring, now you can start this application by the command below :

```bash
npm i
# or
npm install
```

After that, when all dependencies are installed, you can do  this command to run this app :

```bash
npm run dev
```