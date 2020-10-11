module.exports = {
  apps: [
    {
      name: "users-service",
      script: "ts-node users-service.ts",
    },
    { 
      name: "pinterest-service-1", 
      script: "ts-node pinterest-service.ts",
     },
     { 
      name: "pinterest-service-2", 
      script: "ts-node pinterest-service.ts",
     },
     { 
      name: "pinterest-service-3", 
      script: "ts-node pinterest-service.ts",
     },
  ],
};
