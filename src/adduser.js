/*eslint n/no-process-exit: "off"*/
import ServerContext from "./utils/servercontext.js";
import { createInterface } from 'node:readline/promises';

const serverContext = new ServerContext();
const users = serverContext.users();

const stop = (code) => {
	process.exit(code);
}

// Get username and password from command line arguments or interactive prompt
let username, password, email;
const args = process.argv.slice(2);

if (args.length >= 2) {
	// Use command line arguments
	username = args[0];
	password = args[1];
	email = args[2] || null;
} else {
	// Use interactive prompts
	const rl = createInterface({
		input: process.stdin,
		output: process.stdout
	});
	
	const closeRl = () => {
		rl.close();
	}
	
	username = await rl.question('Enter a username: ');
	if (!username || username.length < 4) {
		console.error("Username must be at least 4 characters long.");
		closeRl();
		stop(1);
	}
	
	password = await rl.question('Enter a password: ');
	if (!password || password.length < 4) {
		console.error("Password must be at least 4 characters long.");
		closeRl();
		stop(1);
	}
	
	email = await rl.question('Enter an email address (optional): ');
	if (!email || email.length < 6) {
		email = null;
	}
	
	closeRl();
}

// Validate username and password
if (!username || username.length < 4) {
	console.error("Username must be at least 4 characters long.");
	stop(1);
}

const exists = await users.exists(username);
if (exists) {
	console.error("User with the given name already exists.");
	stop(1);
}

if (!password || password.length < 4) {
	console.error("Password must be at least 4 characters long.");
	stop(1);
}

try {
	await users.register(username, password, email);
	console.log('User created!');
	stop(0);
} catch (err) {
	console.error(err);
	stop(1);
}
