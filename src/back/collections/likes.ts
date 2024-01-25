import { Collection, FieldTypes, Policies } from "sealious";

export default class Likes extends Collection {
	fields = {
		user: new FieldTypes.SingleReference("users"),
		post: new FieldTypes.SingleReference("posts"),
	};
	policies = {
                edit: new Policies.Owner(),
                delete: new Policies.Owner(),
                create: new Policies.LoggedIn(),
	};
	defaultPolicy = new Policies.Public();
}
