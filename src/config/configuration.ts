export default () => ({
  appName: process.env.APP_NAME,
  port: parseInt(process.env.APP_PORT, 10) || 3000,
  env: process.env.NODE_ENV,
  appURL: process.env.APP_URL,
  aws: {
    key: process.env.AWS_ACCESS_KEY,
    secret: process.env.AWS_SECRET,
    endpoint: process.env.AWS_ENDPOINT,
    host: process.env.AWS_HOST,
  },
  fileOperationsProvider: process.env.DEFAULT_PROVIDER,
});
