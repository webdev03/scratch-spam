# scratch-spam
Scratch spam detection and removal

## using it
first of all you need to copy the things in `.env.example` into a file called `.env`.

replace `kaj` and `kajdahecker` with your username and password (if you're deleting comments, this has to be the same username and password as the account you are deleting comments from. scratch has no oauth, but the authentication is fully open source, so inspect it yourself).

this uses the pnpm package manager mainly. but you can also decide to use npm if you want.

```bash
pnpm install
node index.js
```

note that it may take some time to show up on your profile - must be cache or something.

## customising it
I've never personally faced spam bots, so I only put a few obvious things in the disallow list, like empty characters. in the `disallow.json` file you can add more strings/characters to filter for.
