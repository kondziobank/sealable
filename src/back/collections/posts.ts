import { Collection, FieldTypes, Policies } from "sealious";

export default class Posts extends Collection {
	fields = {
		content: new FieldTypes.Text(),
                author: new FieldTypes.Text(),
                date: new FieldTypes.Text(),
	};

        // Policies described here
        // https://hub.sealcode.org/source/sealious/browse/dev/src/chip-types/creating-collections.remarkup
	policies = {
                edit: new Policies.Owner(),
                delete: new Policies.Owner(),
                create: new Policies.LoggedIn(),
	};

	defaultPolicy = new Policies.Public();
}
