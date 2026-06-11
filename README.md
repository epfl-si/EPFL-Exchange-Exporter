# Summary

<!-- Put after theses lines, ctrl + shift + p and write "Markdown" and click to "Markdwon all ine one" extension -->
- [Summary](#summary)
  - [❓ WHAT IS EEEE ?](#-what-is-eeee-)
  - [🦾 WHICH TECHNOLOGIES DOES IT USES ?](#-which-technologies-does-it-uses-)
    - [⚛️➡️ Next.js](#️️-nextjs)
    - [🌊 Tailwind CSS](#-tailwind-css)
    - [🆔 NextAuth.js](#-nextauthjs)
    - [🈵 NextIntl.js](#-nextintljs)
  - [📋 PREREQUISITES](#-prerequisites)
  - [⚙️ CONFIGURATION](#️-configuration)
    - [🔏 Environment file](#-environment-file)
    - [📥 Installation](#-installation)
  - [🛠️ DEVELOPMENT](#️-development)
    - [▶️ Run in development](#️-run-in-development)
    - [🈳 Mutli-lang](#-mutli-lang)
      - [✏️ Modify existing text](#️-modify-existing-text)
      - [➕ Add a new language](#-add-a-new-language)
  - [🚀 DEPLOY IN TEST / PROD](#-deploy-in-test--prod)
    - [✉️ Makefile](#️-makefile)
    - [👣 Steps to follow](#-steps-to-follow)
      - [🎯 Push all changes to main](#-push-all-changes-to-main)
      - [🏷️ Change version](#️-change-version)
      - [Deployment prerequies](#deployment-prerequies)
      - [💉 Deployment](#-deployment)
  - [READ LOGS](#read-logs)
    - [Console View](#console-view)
      - [Get log content (console)](#get-log-content-console)
      - [Read log content (live)](#read-log-content-live)
      - [Export log file](#export-log-file)
- [🖼️ Icons used](#️-icons-used)

## ❓ WHAT IS EEEE ?

EEEE stand for EPFL Exchange Events Exporter. This app is used to return all calendars event of resources (conference room, equipments..), inside a data file as csv and json. There is also an API to get theses informations in JSON format too, with more flexibility.

## 🦾 WHICH TECHNOLOGIES DOES IT USES ?

### ⚛️➡️ Next.js
Next.js is an open-source framework, powered by ⚛︎ React.js and node.js.
[Next Documentation here](https://nextjs.org/docs)

### 🌊 Tailwind CSS
Tailwind CSS is a CSS framework for rapidly building modern websites without ever leaving your HTML.
[Tailwind CSS Documentation here](https://tailwindcss.com/docs)

### 🆔 NextAuth.js
Next-auth is an open-source authentication librabry designed for next.js. Its goal here is to give microsoft entra id authentication.
[NextAuth.js Documentation here](https://next-auth.js.org/getting-started/introduction)

### 🈵 NextIntl.js
Next-intl is an internationalization library designed for next.js. Its goal here is to let user chose his favorite language among proposed.
[NextIntl.js Documentation here](https://next-intl.dev/docs/getting-started)

## 📋 PREREQUISITES

1. Rights to group `epfl_sopec` in **keybase**, to access to secrets.
2. Clone this repository and [sopec repository](https://github.com/epfl-si/sopec)
3. Access to quay

## ⚙️ CONFIGURATION

### 🔏 Environment file

Duplicate `.env.example` file and rename it `.env.local`. Don't forget to complete at least theses values:

```bash
AUTH_SECRET=
AUTH_MICROSOFT_ENTRA_ID_ID=
AUTH_MICROSOFT_ENTRA_ID_SECRET=
AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=
AUTH_EWS_CREDENTIALS_USERNAME=
AUTH_EWS_CREDENTIALS_PASSWORD=
AUTH_EWS_SERVICE_ENDPOINT=
```

with :


**AUTH_SECRET** : generated with **`npx auth`**. Read more: https://cli.authjs.dev>

**AUTH_MICROSOFT_ENTRA_ID_ID** : the **id** of **Microsoft entra id** app

**AUTH_MICROSOFT_ENTRA_ID_SECRET** : the **secret** of **Microsoft entra id** app

**AUTH_MICROSOFT_ENTRA_ID_TENANT_ID** : the **tenant** id of **Microsoft entra id** app

**AUTH_EWS_CREDENTIALS_USERNAME** : the **credentials username** of **on premise** app

**AUTH_EWS_CREDENTIALS_PASSWORD** : the **credentials password** of **on premise** app

**AUTH_EWS_SERVICE_ENDPOINT** : the **service endpoint** of **on premise** app

### 📥 Installation

After configuring, now you can start this application by the command below :

```bash
npm install
```

>[!NOTE]
>If there vulnerabilities, try to solve them by using
> ```bash
> npm audit fix
> ```
> If it is not enough, try this command
> ```bash
> npm audit fix --force
> ```
>
> If it still not enough, try to replace dependancies by another

## 🛠️ DEVELOPMENT

### ▶️ Run in development

After that, when all dependencies are installed, you can do  this command to run this app :

```bash
npm run dev
```

### 🈳 Mutli-lang

#### ✏️ Modify existing text

To modify exiting text, you need to go to the [translations/](translations/) folder, select the file in the language you wanna change the text, and edit it.
>[!TIP]
>Filename is defined with the country code 2 letters of the language

#### ➕ Add a new language

There is multiple steps to add a new language (here, we will take german) :

- First, you need to go to the [translations/](translations/) folder
- Duplicate one of existing file, and change the filename to the language name (2 letters format, so here it's "de")
- The file is a JSON, with key-value pair, please change only value to avoid break changes, to translate all text.
- Next, go to the [routing.js](src/i18n/routing.js) file, and inside the list added to `locales` (line 5 normally), add your 2 letters language format, so here "de", from
  ```js
  locales: ['en', 'fr']
  ```
  to
  ```js
  locales: ['en', 'fr', 'de']
  ```
>[!NOTE]
>The last step is important to have the /de, like https://example.com/de

## 🚀 DEPLOY IN TEST / PROD

For this project, some feature has been created or is used to improve the deployment:
- [A Makefile](#✉️-makefile) (to change version of package.json and package-lock.json, and commit / push in gitHub)
- A Workflow (to create a release, create a docker image with version and push the docker image to quay)
- [A Script](#📮-sopsible) (deploy the app with image of the version selected, in test or prod)

### ✉️ Makefile
With this makefile, you can change the version depend to type of change, and you can if you want git add, commit or push automaticaly. There is multiple type of command where all here :

- `help` => **get help guide**
- `version` => **define version manually (respecting X.X.X synthax)**
- `v` => **define version manually (respecting X.X.X synthax)**
- `patch` => **patch**
- `pt` => **patch**
- `pta` => **patch add**
- `ptc` => **patch commit**
- `ptp` => **patch push**
- `minor` => **minor**
- `mn` => **minor**
- `mna` => **minor add**
- `mnc` => **minor commit**
- `mnp` => **minor push**
- `major` => **major**
- `mj` => **major**
- `mja` => **major add**
- `mjc` => **major commit**
- `mjp` => **major push**

If you push or commit with one of theses command (ptc, ptp, mnc...), the commit message are the following (file format) :
```
[version] bump to v$(version)

modified version in package


From:   v$(old_version_package)
To:        v$(version)
```

>[!TIP]
> If you want, you can define a version manually with the command below :
> ```bash
> make version X.X.X
> ```

>[!WARNING]
> If you write manually the version, please take care about version. Write version like `X.X.X`, so for example `1.11.11`, but no `01.12` or no `1.11.11-test`. It is important because the makefile need to get 3 values (numeric only, integer values) separated with dots, to manage version with previous parameters.

### 👣 Steps to follow

#### 🎯 Push all changes to main

>[!NOTE]
>If you are in a branch, push to your branch and merge it to the main branch.

#### 🏷️ Change version

Now, do a commit following this documentation

#### Deployment prerequies

1. Clone [sopec](https://github.com/epfl-si/sopec) repository if it's not already done
2. Change version of EEEE in [`apps/eeee/base/web.yaml`](https://github.com/epfl-si/sopec) file, to the new version (line content is **image: quay-its.epfl.ch/svc0176/eeee:<version>**)
3. Push changes

#### 💉 Deployment

1. Go to ArgoCD [test](https://go.epfl.ch/osat) or [prod](https://go.epfl.ch/osa)
2. Connect with OpenShift -> ldap-idp account
3. Select **openshift-gitops/sopec-eeee**
4. Click on **sync** button
>[!NOTE]
> If auto sync is enables, you can only click on **refresh** button

## READ LOGS

To read logs in local, just open `logs/data.log` file (created by the app).
To access EEEE's logs in test or prod, you need to use one of these solution.

### Console View

1. Login to OpenShift in console with the command below.
```sh
# Log in OpenShift Cluster (TEST)
oc login --web --server=https://api.ocpitst0001.xaas.epfl.ch:6443

# Log in OpenShift Cluster (PROD)
oc login --web --server=https://api.ocpitsp0001.xaas.epfl.ch:6443
```
2. Follow login steps in your favorite navigator (Firefox, or other)
3. Change to select the correct project with the command below.
```sh
# Select project (TEST)
oc project svc0176t-isas-fsd

# Select project (PROD)
oc project svc0176p-isas-fsd
```

There is multiples ways to read logs, as following.

#### Get log content (console)

```sh
kubectl exec -it $(oc get pods -o name | grep pod/eeee) -- cat logs/data.log
```

#### Read log content (live)

```sh
kubectl exec -it $(oc get pods -o name | grep pod/eeee) -- watch cat logs/data.log
```

#### Export log file

```sh
kubectl exec -it $(oc get pods -o name | grep pod/eeee) -- cat logs/data.log > eeee_export.log
```

# 🖼️ Icons used
Icons used here comes from:
- [LordIcon](https://lordicon.com/) (used for animated icons)
- [Freepik](https://www.freepik.com/) and [heroicons](https://heroicons.com/) (used for static icons)