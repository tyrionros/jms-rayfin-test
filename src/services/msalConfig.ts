import { Configuration, LogLevel } from '@azure/msal-browser';

// Dynamically determine redirect URI based on window context
const getRedirectUri = () => {
  if (typeof window !== 'undefined') {
    // If running locally, matches localhost; otherwise returns the hosted fabricapps.net URL
    return window.location.origin + '/';
  }
  return 'https://kind-whirl-780273fc10-norwayeast.webapp.fabricapps.net/';
};

export const msalConfig: Configuration = {
  auth: {
    clientId: 'b803e462-b15d-4173-b74e-eea251f95179', 
    authority: 'https://login.microsoftonline.com/ead65215-ebfd-4a8d-9e73-b403a85a7e04',
    redirectUri: getRedirectUri(), // ◄ Automatically swaps between local and production environment
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
