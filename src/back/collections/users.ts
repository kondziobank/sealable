import { App, Collections, Context, FieldTypes, Policies } from "sealious";
import assert from "assert";
import TheApp from "../app";
import ADMIN_CREDENTIALS from "../default-admin-credentials";

export default class Users extends Collections.users {
	fields = {
		...App.BaseCollections.users.fields,
		email: new FieldTypes.Email().setRequired(true),
		username: new FieldTypes.Username().setRequired(true),
		roles: new FieldTypes.ReverseSingleReference({
			referencing_collection: "user-roles",
			referencing_field: "user",
		}),
                confirmed: new FieldTypes.Boolean().setRequired(true),
                creationDate: new FieldTypes.DateTime().setRequired(true),
                secretToken: new FieldTypes.SecretToken(),
	};

	defaultPolicy = new Policies.Themselves();

	async init(app: App, name: string) {
		assert(app instanceof TheApp);
		await super.init(app, name);
		app.on("started", async () => {
			const username = ADMIN_CREDENTIALS.username;
			const users = await app.collections.users
				.suList()
				.filter({ username })
				.fetch();
			if (users.empty) {
				app.Logger.warn(
					"ADMIN",
					`Creating an admin account for ${app.manifest.admin_email}`
				);
				await app.collections.users.suCreate({
					username,
					password: ADMIN_CREDENTIALS.password,
					email: ADMIN_CREDENTIALS.email,
					roles: [],
                                        confirmed: true,
                                        creationDate: new Date().getTime(),
                                        secretToken: "",
				});
			}
		});
	}

	public static async getRoles(ctx: Context) {
		const rolesEntries = await ctx.app.collections["user-roles"]
			.list(ctx)
			.filter({ user: ctx.user_id || "" })
			.fetch();

		return rolesEntries.items.map((item) => item.get("role"));
	}
}
