const readline = require("readline");
const fetch = require("cross-fetch");
const JSDOM = require("jsdom");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
// helpers
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));
const print = (query) => console.log(query);

// main code
(async () => {
  print(`Scratch Spam v${require('./package.json').version}`)
  rl.close();
})();
