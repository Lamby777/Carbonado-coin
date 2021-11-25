# Carbonado JS
This is the official implementation of Carbonado in NodeJS

## Configurations
The `config.hjson` file contains config data for end users. If you don't
want to mine, and just want to serve as a "transmission" node in the
network, you can disable mining in the config. Put your wallet address
in there if you're mining, and you'll be rewarded at that address.
You can also modify the list of routers for mining.

## Building (for devs)
Make sure you have TypeScript and all the other dependencies installed.
(run `npm i` in the project directory)

When you're ready to transpile the TypeScript code into JS, run `npx tsc`
in the project directory. Then, run `node index.js` to begin.
