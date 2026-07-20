import { Configuration, PublicClientApplication, LogLevel } from '@azure/msal-browser';

// MSAL Configuration for your Hemy 360 app
export const msalConfig: Configuration = {
  auth: {
    clientId: 'b803e462-b15d-4173-b74e-eea251f95179', // Hemy 360 - Rayfin Portal
    authority: 'https://login.microsoftonline.com/ead65215-ebfd-4a8d-9e73-b403a85a7e04',
    redirectUri: 'https://kind-whirl-780273fc10-norwayeast.webapp.fabricapps.net/',
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message) => {
        if (level === LogLevel.Info) {
          console.log(message);
        }
      },
    },
  },
};

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);
