import { Context } from "koa";
import { Form, FormData, Fields, Controls } from "@sealcode/sealgen";
import html from "../html";
import { PasswordResetIntents } from "../collections/collections";

export const actionName = "Forgot";

const fields = { // TODO this causes email to be checked if it exists
	email: new Fields.CollectionField(true, PasswordResetIntents.fields.email),
};

export const ForgotShape = Fields.fieldsToShape(fields);

export default new (class ForgotForm extends Form<typeof fields, void> {
	defaultSuccessMessage = "Form filled correctly";
	fields = fields;

	controls = [
		new Controls.SimpleInput(fields.email, { label: "Email:", type: "email" }),
	];

	async canAccess(_: Context) {
		return { canAccess: true, message: "" };
	}

	async onSubmit(_: Context, data: FormData) {
		try {
                        const email: string = data.raw_values.email as string
			await PasswordResetIntents.suCreate({ email });
			console.log("Password reset link was sent");
		} catch (error) {
			console.error("Error during user password reset:", error);
			throw new Error(String(error));
		}
	}

	async render(ctx: Context, data: FormData, show_field_errors: boolean) {
		return html(ctx, "Forgot", await super.render(ctx, data, show_field_errors));
	}
})();
