export const checkRequiredEnvVars = (vars: string[]) => {
  const missingVars = [];
  for (const variable of vars) {
    if (!process.env.hasOwnProperty(variable)) {
      missingVars.push(variable);
    }
  }
  if (missingVars.length > 0) {
    throw new Error(
      `Missing the following required environment variable(s): ${missingVars.join(
        ", "
      )}`
    );
  }
};
