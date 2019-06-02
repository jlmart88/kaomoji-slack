let configVars = {
  SLACK_CLIENT_ID: process.env.SLACK_CLIENT_ID,
  SLACK_CLIENT_SECRET: process.env.SLACK_CLIENT_SECRET,
  SLACK_VERIFICATION_TOKEN: process.env.SLACK_VERIFICATION_TOKEN,
  SLACK_SIGNING_SECRET: process.env.SLACK_SIGNING_SECRET,
  SERVER_URL: process.env.SERVER_URL,
  MONGODB_URI: process.env.MONGODB_URI,
};

Object.keys(configVars).forEach(key => {
  if (configVars[(key as keyof typeof configVars)] === undefined) {
    throw new Error(`Missing configuration value ${key}`);
  }
});

export const config = (configVars as { [k in keyof typeof configVars]: string; });