const dotenv = require("dotenv");
dotenv.config();

const readline = require("readline");
const fs = require("fs");
const { ScratchSession } = require("meowclient");
const session = new ScratchSession();
const disallowed = JSON.parse(fs.readFileSync("disallow.json", "utf-8"));
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getComments = async (user, page = 1) => {
  const comments = await session.getProfile(user).getComments(page);
  if (comments.length == 0) {
    throw new Error("No comments found.");
  }
  return comments;
};

// helpers
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));
const print = (query) => console.log(query);
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
// main code
(async () => {
  print(`Scratch Spam v${require("./package.json").version}`);
  const userToCheck = await ask("What user would you like to check for spam? ");
  let ready = false;
  let pages = 1;
  let comments = [];
  while (!ready) {
    try {
      comments.push(...(await getComments(userToCheck, pages)));
    } catch {
      if (pages == 1) {
        print("! Comments not found.");
        rl.close();
        return;
      } else {
        print("No more comments able to be found.");
        ready = true;
        break;
      }
    }

    print(`Found ${comments.length} comment thread starters!`);
    if (!((await ask("Would you like to go to the next page? (Y/n) ")).toLowerCase() == "y")) {
      ready = true;
    }
    pages++;
  }

  print("Starting checking...");

  let badComments = [];
  comments.forEach((comment) => {
    disallowed.forEach((element) => {
      if (comment.content.includes(element)) {
        print(`${comment.username} posted "${comment.content}" which includes a disallowed char/string.`);
        badComments.push(comment);
      }
    });
  });
  print(`${badComments.length} bad comment(s) found!`);
  if (badComments.length == 0) {
    print("Exiting program...");
    rl.close();
    return;
  }
  print("Please review the logs above to check if you would like to delete comments.");
  if (!((await ask("Ready to delete all comments? This may be a destructive action! (y/N) ")).toLowerCase() == "y")) {
    print("You can always restart the script again if you would like.");
    rl.close();
    return;
  }
  print("Getting ready to get rid of comments...");
  await session.init(process.env["SCRATCH_USERNAME"], process.env["SCRATCH_PASSWORD"]);
  print("Logged in!");
  print("Deleting comments...");
  badComments.forEach(async (element) => {
    print(`Deleting comment "${element.content}" by ${element.username}...`);
    print(`Deleted comment with status ${await session.getProfile(userToCheck).deleteComment(element.apiID)}`);
    print("Waiting responsibly (4 seconds)...");
    await sleep(4000);
  });
  print(`Deleted ${badComments.length} comments!`);
  rl.close();
})();
