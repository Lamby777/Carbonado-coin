"use strict";
let blockchain = [];
const Express = require("express"), HJSON = require("hjson"), fs = require("fs"), ALPHA58 = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz", base58 = require("base-x")(ALPHA58), cleanup = require("./cleanup");
const { Block, Transaction, TxI, TxO, hash, } = require("./writeup.js")(blockchain);
const configContent = fs.readFileSync("config.hjson", "utf8");
const memoryFileContent = fs.readFileSync("nodemem.json", "utf8");
const config = HJSON.parse(configContent);
let mem = {};
let peers = [];
try {
    mem = JSON.parse(memoryFileContent);
}
catch (e) {
    fs.writeFileSync("./nodemem.json", JSON.stringify(mem), "utf8");
}
const PORT = 11870;
const MINER_REWARD = 1;
let c = 50;
const app = Express();
app.use(Express.json());
let tx = new Transaction([
    new TxI(0, "id of txo", 2),
], [
    new TxO("public key", 2, false),
]);
const genesis = new Block(0, "", {
    content: [],
}, 1636962514638);
blockchain.push(genesis);
console.log(blockchain);
let {} = app.get("/", (req, res) => {
    res.json(blockchain);
});
let {} = app.get("/ping", (req, res) => {
    console.log("yo");
    res.json({
        miner: config.miner,
    });
});
if (config.miner) {
    const axios = require("axios").default;
    let routersPush = config.pushToRouters;
    let routersPull = config.pullFromRouters;
    routersPush.forEach((r) => {
        let {} = axios.post(r, {}).catch((error) => {
            console.error(error);
        });
    });
    routersPull.forEach((r) => {
        let {} = axios.get(r).then((res) => {
            let miners = res.data.content.miners;
            let ominers = miners.filter(async (peer) => {
                let val = null;
                axios.get("http://" + peer + "/ping").then((res) => {
                    console.log("Active Peer " + peer);
                    val = true;
                }).catch((e) => {
                    console.error(e.message);
                    val = false;
                }).finally(() => {
                    return val;
                });
            });
            peers = combineArrays(peers, ominers);
            console.log(peers);
        }).catch((e) => { console.error(e); }).finally(() => {
        });
    });
    let {} = app.post("/newBlock", (req, res) => {
        if (true) {
            Block.generate();
        }
    });
}
;
let {} = app.listen(PORT, () => {
    console.log("Carbonado listening on port " + PORT);
    if (config.miner) {
        let {} = runCarbon(genesis);
    }
});
function runCarbon(block) {
    let res, solved = false, nonce = generateNonce();
    let difficulty = 3;
    let difficultyString = "0".repeat(difficulty);
    do {
        res = Block.hash(block, nonce, "hex");
        if (hexToBinary(res)
            .startsWith(difficultyString))
            solved = true;
        if (false) {
            res = null;
            break;
        }
        nonce++;
    } while (!solved);
    if (res) {
        console.log(`Verified block ${block.num} nonce ${nonce}`);
        return res;
    }
}
function doCleanup() {
    cleanup(mem);
}
let {} = process.on("exit", doCleanup);
let {} = process.on("SIGINT", () => {
    process.exit(2);
});
function verifyBlockchain(blockchain) {
    return blockchain.every(n => Block.verify(n));
}
function blockchainLengthDilemma(newChain) {
    if (newChain.length > blockchain.length &&
        verifyBlockchain(newChain)) {
        blockchain = newChain;
    }
}
function generateNonce() {
    return Math.random() * Date.now();
}
function hexToBinary(hex) {
    hex = hex.replace("0x", "").toLowerCase();
    var out = "";
    for (var c of hex) {
        switch (c) {
            case "0":
                out += "0000";
                break;
            case "1":
                out += "0001";
                break;
            case "2":
                out += "0010";
                break;
            case "3":
                out += "0011";
                break;
            case "4":
                out += "0100";
                break;
            case "5":
                out += "0101";
                break;
            case "6":
                out += "0110";
                break;
            case "7":
                out += "0111";
                break;
            case "8":
                out += "1000";
                break;
            case "9":
                out += "1001";
                break;
            case "a":
                out += "1010";
                break;
            case "b":
                out += "1011";
                break;
            case "c":
                out += "1100";
                break;
            case "d":
                out += "1101";
                break;
            case "e":
                out += "1110";
                break;
            case "f":
                out += "1111";
                break;
            default: return "";
        }
    }
    return out;
}
function combineArrays(a, b) {
    return a.concat(b.filter((val) => !a.includes(val)));
}
function addressFromPubkey(key) {
    key = hash(key, "hex");
    let addr = base58.encode(Buffer.from(key));
}
function validateWalletAddress(addr) {
}
//# sourceMappingURL=index.js.map