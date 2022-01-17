const dotenv = require("dotenv");
dotenv.config();

const readline = require("readline");
const fetch = require("cross-fetch");
const { JSDOM } = require("jsdom");
const { ScratchSession } = require("./auth.js");
const disallowed = require("./disallow.json");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const getComments = async (user, page = 1) => {
  const commentFetch = await fetch(
    `https://scratch.mit.edu/site-api/comments/user/${user}/?page=${page}`
  );
  if (!commentFetch.ok) {
    if (page == 1) {
      throw new Error("! Error in fetching comments");
    } else {
      return [];
    }
  }
  const commentHTML = await commentFetch.text();
  const dom = new JSDOM(commentHTML);
  const items = dom.window.document.getElementsByClassName("top-level-reply");

  let comments = [];
  for (let elID in items) {
    const element = items[elID];
    if (typeof element == "function") break;
    const commentID = element.getElementsByClassName("comment")[0].id;
    const commentPoster = element
      .getElementsByClassName("comment")[0]
      .getElementsByTagName("a")[0]
      .getAttribute("data-comment-user");
    const commentContent = element
      .getElementsByClassName("comment")[0]
      .getElementsByClassName("info")[0]
      .getElementsByClassName("content")[0]
      .innerHTML.trim();
    comments.push({
      id: commentID,
      username: commentPoster,
      content: commentContent,
      apiID: commentID.substring(9),
    });
  }
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
      } else {
        print("No more comments able to be found.");
        ready = true;
        break;
      }
    }

    print(`Found ${comments.length} comment thread starters!`);
    if (
      !(
        (
          await ask("Would you like to go to the next page? (Y/n) ")
        ).toLowerCase() == "y"
      )
    ) {
      ready = true;
    }
    pages++;
  }

  print("Starting checking...");

  let badComments = [];
  comments.forEach((comment) => {
    disallowed.forEach((element) => {
      if (comment.content.includes(element)) {
        print(
          `${comment.username} posted "${comment.content}" which includes a disallowed char/string.`
        );
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
  print(
    "Please review the logs above to check if you would like to delete comments."
  );
  if (
    !(
      (
        await ask(
          "Ready to delete all comments? This may be a destructive action! (y/N) "
        )
      ).toLowerCase() == "y"
    )
  ) {
    print("You can always restart the script again if you would like.");
    rl.close();
    return;
  }
  print("Getting ready to get rid of comments...");
  const session = new ScratchSession();
  await session.init(
    process.env["SCRATCH_USERNAME"],
    process.env["SCRATCH_PASSWORD"]
  );
  print("Logged in!");
  print("Deleting comments...");
  badComments.forEach(async (element) => {
    print(`Deleting comment "${element.content}" by ${element.username}...`);
    print(
      `Deleted comment with status ${await session.deleteComment(
        element.apiID
      )}`
    );
    print("Waiting responsibly (5 seconds)...");
    await sleep(5000);
  });
  print(`Deleted ${badComments.length} comments!`);
  rl.close();
})();
