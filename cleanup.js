"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
function cleanup(mem) {
    fs.writeFileSync("nodemem.json", JSON.stringify(mem), "utf8");
}
exports.default = cleanup;
//# sourceMappingURL=cleanup.js.map