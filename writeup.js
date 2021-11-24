"use strict";
const crypto = require("crypto");
const EC = require("elliptic").ec;
const ec = new EC("secp256k1");
function exp(blockchain) {
    class Block {
        constructor(num, previous, body, timestamp) {
            this.num = num ? num : blockchain.length,
                this.previous = previous,
                this.body = body !== undefined ? body : null,
                this.timestamp = timestamp || new Date().getTime(),
                this.difficultyLocale = null,
                this.nonces = [],
                this.hash = Block.hash(this);
        }
        static hash(block, nonce, format) {
            if (block instanceof Block) {
                let trueNonce = nonce ? nonce : block.nonces[0];
                let input = block.num + block.previous +
                    block.body + block.timestamp;
                if (trueNonce)
                    input += trueNonce;
                return hash(input, format);
            }
            else {
                throw TypeError("Attempt to get hash of non-block");
            }
        }
        static generate(body) {
            let prevBlock, previous, num;
            if (blockchain.length === 0) {
                prevBlock = null;
                previous = "";
                num = 0;
            }
            else {
                prevBlock = blockchain[blockchain.length - 1];
                previous = prevBlock.hash;
                num = prevBlock.num + 1;
            }
            if (!body) {
                console.log("Attempt to create empty block " + num);
                return null;
            }
            let block = new Block(num, previous, body);
            blockchain.push(block);
            return block;
        }
        static verify(block) {
            let valid = true;
            let prevBlock = blockchain.filter(val => val.num === block.num - 1)[0];
            if ((block.num !== 0 &&
                (!prevBlock ||
                    (prevBlock.hash !== block.previous)))
                ||
                    (Block.hash(block) !== block.hash)) {
                valid = false;
            }
            return valid;
        }
    }
    class Transaction {
        constructor(inputs, outputs) {
            this.inputs = inputs,
                this.outputs = outputs;
        }
        get id() {
            let inputData = this.inputs
                .map((txI) => txI.fromNum + txI.fromId + txI.amount)
                .reduce((a, b) => a + b, "");
            let outputData = this.outputs
                .map((txO) => txO.num + txO.addr + txO.amount)
                .reduce((a, b) => a + b, "");
            return Transaction.hash(inputData, outputData);
        }
        static hash(inputs, outputs) {
            return hash(inputs + outputs);
        }
    }
    class TxI {
        constructor(fromNum, fromId, amount) {
            this.fromNum = fromNum,
                this.fromId = fromId,
                this.amount = amount,
                this.sig = "";
        }
        static sign(transaction, txI, privKey, UTXOs) {
            if (txI instanceof Number) {
                txI = transaction.inputs[txInum];
            }
            const sigData = transaction.id();
            const referencedUTXO = TxO.getUnspentByNum(txI.fromNum, UTXOs);
            const key = ec.keyFromPrivate(privKey, "hex");
            return key.sign(sigData).toDER();
        }
    }
    class TxO {
        constructor(addr, amount, spent) {
            this.num = TxO.list.length,
                this.addr = addr,
                this.amount = amount;
            this.spent = !!spent;
            TxO.list.push(this);
        }
        static getUnspentByNum(num) {
            return TxO.list.find(val => (val.num === num) && (!val.spent));
        }
        static get unspent() {
            return TxO.filter(val => !val.spent);
        }
        static updateUnspent() {
        }
    }
    TxO.list = [];
    function hash(input, format) {
        return crypto.createHash("sha256")
            .update(input).digest(format ? format : "hex");
    }
    return {
        Block: Block,
        Transaction: Transaction,
        TxI: TxI,
        TxO: TxO,
        hash: hash,
    };
}
module.exports = exp;
//# sourceMappingURL=writeup.js.map