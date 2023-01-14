var exec = require("child_process").exec;
function execute(cmd) {
  exec(cmd);
}

setInterval(() => {
  execute(
    "browserify src/index.ts -w -p [ tsify --noImplicitAny ] > bundle.js"
  );
}, 5000);
