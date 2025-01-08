const config = {
  development: {
    apiUrl: 'http://localhost:3000'
  },
  production: {
    apiUrl: 'https://training.ols.design'  // Replace with your actual production URL
  }
};

// Use production config by default, development only if explicitly set
const isDevelopment = false;
export const apiUrl = isDevelopment ? config.development.apiUrl : config.production.apiUrl; 