# scratch-spam
Scratch spam detection and removal

## using it
first of all you need to copy the things in `.env.example` into a file called `.env`.

replace `kaj` and `kajdahecker` with your username and password (if you're deleting comments, this has to be the same username and password as the account you are deleting comments from. scratch has no oauth, but the authentication is fully open source, so inspect it yourself).

```bash
pnpm install
node index.js
```

## customising it
in the `disallow.json` file you can add strings to filter for.
