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
const apiUrl = isDevelopment ? config.development.apiUrl : config.production.apiUrl;

// Log the API URL for debugging
console.log('API URL:', apiUrl);

export { apiUrl }; 