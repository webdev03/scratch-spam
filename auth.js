// manages authentication
const fetch = require("cross-fetch");
/**
 * Logs into Scratch and manages deletion of comments too
 * Run Scratch
 */
class ScratchSession {
	async init(user, pass) {
    // a lot of this code is taken from
    // https://github.com/CubeyTheCube/scratchclient/blob/main/scratchclient/ScratchSession.py
    // thanks!
		const headers = {
			"x-csrftoken": "a",
			"x-requested-with": "XMLHttpRequest",
			Cookie: "scratchcsrftoken=a;scratchlanguage=en;",
			referer: "https://scratch.mit.edu",
			"user-agent":
				"Mozilla/5.0 ScratchSpamProtection",
		};
    const loginReq = await fetch("https://scratch.mit.edu/login/", {
      method: "POST",
      body: JSON.stringify({
        username: user,
        password: pass
      }),
      headers: headers
    });
    if(!loginReq.ok) {
      throw new Error("Login failed.");
    }
    this._headersLogin = loginReq.headers
    
    // Awesome regexes by ScratchClient - https://github.com/CubeyTheCube/scratchclient/blob/main/scratchclient/ScratchSession.py
    this.csrfToken = /scratchcsrftoken=(.*?);/gm.exec(loginReq.headers.get('set-cookie'))[1];
    this.token = /"(.*)"/gm.exec(loginReq.headers.get('set-cookie'))[1]
	}
}

module.exports.ScratchSession = ScratchSession;
