const config = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: 'https://training.ols.to'
  }
};

// Use production config by default
const isDevelopment = false;
export const apiUrl = isDevelopment ? config.development.apiUrl : config.production.apiUrl; 