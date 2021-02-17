module.exports = {
  apps: [
    {
      name: "users-service",
      script: "ts-node ./src/services/users/users-service.ts",
    },
    {
      name: "pinterest-service-1",
      script: "ts-node ./src/services/pinterest/pinterest-service.ts",
     },
     {
      name: "pinterest-service-2",
      script: "ts-node ./src/services/pinterest/pinterest-service.ts",
     },
     {
      name: "facebook-service-1",
      script: "ts-node ./src/services/facebook/facebook-service.ts",
     },
  ],
};
