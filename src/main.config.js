const { join } = require("path");

module.exports = {
  apps: [
    {
      name: "main",
      script: join(__dirname, "./main.js"),
      instances: "max",
      exec_mode: "cluster",
      instance_var: "INSTANCE_ID",
    },
  ],
};
