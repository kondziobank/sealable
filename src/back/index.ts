import kill from "kill-port";
import _locreq from "locreq";
import Sealple from "./app";
import { mainRouter } from "./routes";
const locreq = _locreq(__dirname);

const app = new Sealple();

kill(app.config["www-server"].port)
	.then(() => app.start())
	.then(async () => {
		if (process.env.SEALIOUS_SANITY === "true") {
			console.error("Exiting with error code 0");
			process.exit(0);
		}
		mainRouter(app.HTTPServer.router);
	})
	.catch((error) => {
		console.error(error);
		if (process.env.SEALIOUS_SANITY === "true") {
			console.error("EXITING WITH STATUS 1");
			process.exit(1);
		}
	});

app.HTTPServer.addStaticRoute("/", locreq.resolve("public"));
