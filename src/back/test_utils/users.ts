import { Users } from "../collections/collections";
import { CollectionItem, TestUtils } from "sealious";
import TheApp from "../app";

type Unpromisify<T> = T extends Promise<infer R> ? R : T;

export function createAUser(app: TheApp, username: string) {
	return app.collections.users.suCreate({
		username,
		email: `${username}@example.com`,
		password: "password",
		roles: [],
                confirmed: true,
                creationDate: new Date(),
                secretToken: "",
	});
}

export async function createAdmin(
	app: TheApp,
	rest_api: TestUtils.MockRestApi
): Promise<
	[CollectionItem<typeof Users>, Unpromisify<ReturnType<typeof rest_api.login>>]
> {
	const user = await createAUser(app, "super_user");
	await app.collections["user-roles"].suCreate({
		user: user.id,
		role: "admin",
	});
	const session = await rest_api.login({
		username: "super_user",
		password: "password",
	});
	return [user, session];
}
