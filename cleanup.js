"use strict";
const fs = require("fs");
function cleanup(mem) {
    console.log("Bye!");
    mem.lastExit = Date.now();
    fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}
module.exports = cleanup;
//# sourceMappingURL=cleanup.js.map