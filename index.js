const readline = require("readline");
const fetch = require("cross-fetch");
const { JSDOM } = require("jsdom");
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});
// helpers
const ask = (query) => new Promise((resolve) => rl.question(query, resolve));
const print = (query) => console.log(query);
// main code
(async () => {
	print(`Scratch Spam v${require("./package.json").version}`);
	const userToCheck = await ask("What user would you like to check for spam? ");
	const commentFetch = await fetch(
		`https://scratch.mit.edu/site-api/comments/user/${userToCheck}/?page=1`
	);
	if (!commentFetch.ok) {
    print(commentFetch)
    console.log("! Error in fetching comments.");
    rl.close();
    return;
	}
  const commentHTML = await commentFetch.text();
  const dom = new JSDOM(commentHTML);
  const items = dom.window.document.getElementsByClassName("top-level-reply");

  const comments = [];
  for(let elID in items) {
    const element = items[elID];
    if (typeof element == "function") break;
    const commentID = element.getElementsByClassName("comment")[0].id;
    const commentPoster = element.getElementsByClassName("comment")[0].getElementsByTagName("a")[0].getAttribute('data-comment-user');
    const commentContent = element.getElementsByClassName("comment")[0].getElementsByClassName("info")[0].getElementsByClassName("content")[0].innerHTML.trim();

		comments.push({
			id: commentID,
			username: commentPoster,
			content: commentContent,
		});
	}
	print(`Found ${comments.length} comments!`);
  print("Starting checking...");
  comments.forEach((comment) => {
    // RTL override!
    if (comment.content.includes("\u202E") || comment.content.includes("\u200B") || comment.content.includes("\u202D")) {
      print(`${comment.username} posted "${comment.content}" which includes a disallowed char/string.`)
    }
  });

	rl.close();
})();
