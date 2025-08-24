import 'dotenv/config';

export default ({ config }) => {
  return {
    ...config,
    extra: {
      BACKEND_URL: process.env.BACKEND_URL,
    },
  };
};