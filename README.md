# Carbonado JS
This is the official implementation of Carbonado in NodeJS

<p align="center"><img src="https://carbonado-site.dexiethesheep.repl.co/CarbonadoLogo.png"
	width="42" height="42"></p>

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
in the project directory. Then, run `node index.js` to begin. If you're
writing TypeScript code, make sure to keep `npx tsc --watch` open in a
terminal to run the incremental transpiler for near instant transpilation.
