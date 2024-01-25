import assert from "assert";
import _locreq from "locreq";
import { default as Sealious, App, LoggerMailer, SMTPMailer } from "sealious";
import { LoggerLevel } from "sealious/@types/src/app/logger";
import { collections } from "./collections/collections";
import ADMIN_CREDENTIALS from "./default-admin-credentials";
const locreq = _locreq(__dirname);

const PORT = process.env.SEALIOUS_PORT ? parseInt(process.env.SEALIOUS_PORT) : 8080;
assert(PORT != 0, "SEALIOUS_PORT not specified")

const BASE_URL = process.env.SEALIOUS_BASE_URL || "localhost"
assert(BASE_URL != "", "SEALIOUS_BASE_URL not specified")

const MONGO_PORT = process.env.SEALIOUS_MONGO_PORT ? parseInt(process.env.SEALIOUS_MONGO_PORT) : 20747;
assert(MONGO_PORT != 0, "SEALIOUS_MONGO_PORT not specified")

const MONGO_HOST = process.env.SEALIOUS_MONGO_HOST || "localhost"
assert(MONGO_HOST != "", "SEALIOUS_MONGO_HOST not specified")

declare module "koa" {
	interface BaseContext {
		$context: Sealious.Context;
		$app: Sealple;
	}
}

export default class Sealple extends App {
	config = {
		upload_path: locreq.resolve("uploaded_files"),
		datastore_mongo: {
			host: MONGO_HOST,
			port: MONGO_PORT,
			db_name: "sealious-app",
		},
		email: {
			from_address: "sealious-app@example.com",
			from_name: "sealious-app app",
		},
		logger: {
			// eslint-disable-next-line @typescript-eslint/consistent-type-assertions
			level: "info" as LoggerLevel,
		},
		"www-server": {
			port: PORT,
		},
		core: {
			environment: <const>"production", // to send the full html emails
		},
	};
	manifest = {
		name: "Sealple",
		logo: locreq.resolve("assets/logo.png"),
		version: "0.0.1",
		default_language: "en",
		base_url: `${BASE_URL}:8080`,
                link_schema: "http",
		admin_email: ADMIN_CREDENTIALS.email,
		colors: {
			primary: "#5294a1",
		},
	};
	collections = collections;
	mailer = new SMTPMailer({
                host: "127.0.0.1",
                port: 1026,
                user: "any",
                password: "any",
        })

	// eslint-disable-next-line @typescript-eslint/no-explicit-any

	async start() {
		await super.start();
	}

	async stop() {
		await super.stop();
	} }
