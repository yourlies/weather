var exec = require("child_process").exec;
function execute(cmd) {
  exec(cmd, function (error, stdout, stderr) {
    if (error) {
      console.error(error);
    } else {
      console.log("success");
    }
  });
}

setInterval(() => {
  execute(
    "browserify src/index.ts -w -p [ tsify --noImplicitAny ] > bundle.js"
  );
}, 5000);
