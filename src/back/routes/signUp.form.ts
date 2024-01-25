import { Context } from "koa";
import { tempstream } from "tempstream";
import {
	Form,
	FormData,
	FormDataValue,
	Fields,
	Controls,
	FormReaction,
} from "@sealcode/sealgen";
import html from "../html";
import { EmailTemplates } from "sealious";
import { Users } from "../collections/collections";

export const actionName = "SignUp";

const fields = {
	username: new Fields.CollectionField(true, Users.fields.username),
	email: new Fields.CollectionField(true, Users.fields.email),
	password: new Fields.SimpleFormField(true),
};

export const SignUpShape = Fields.fieldsToShape(fields);

export default new (class SignUpForm extends Form<typeof fields, void> {
	fields = fields;

	controls = [
		new Controls.SimpleInput(fields.username, {
                        label: "Username:",
                        type: "text",
                        placeholder: "username",
                }),
		new Controls.SimpleInput(fields.email, { label: "Email:", type: "email" }),
		new Controls.SimpleInput(fields.password, {
			label: "Password:",
			type: "password",
		}),
	];

	async validateValues(
		ctx: Context,
		data: Record<string, FormDataValue>
	): Promise<{ valid: boolean; error: string }> {
		const { parsed: email } = await this.fields.email.getValue(ctx, data);
		const { parsed: password } = await this.fields.password.getValue(ctx, data);

		if ((password || "").length >= 8) {
			const user = await Users.suList().filter({ email: email }).fetch();
			if (user.empty) {
				return { valid: true, error: `` };
			}
			return { valid: false, error: `Email is arleady taken` };
		} else {
			return {
				valid: false,
				error: "Password must contain a minimum of 8 characters",
			};
		}
	}

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	async canAccess(ctx: Context) {
		if (ctx.$context.session_id) {
			return { canAccess: false, message: "" };
		}
		return { canAccess: true, message: "" };
	}

	async onError(
		ctx: Context,
		data: FormData<string>,
		error: unknown
	): Promise<FormReaction> {
		const reaction: FormReaction = {
			action: "stay",
			content: this.render(ctx, data, true),
			messages: [
				{
					type: "error",
					text: `An unexpected error occurred, try again. <br> Error${
						error as string
					}`,
				},
			],
		};

		return reaction;
	}

	async onSuccess(ctx: Context, data: FormData): Promise<FormReaction> {
		const username: FormDataValue = data.raw_values.username;
		const reaction: FormReaction = {
			action: "stay",
			content: `Hello ${String(
				username
			)}. <p class="success-notify">Check your inbox for confirmation link.</p>
					<a href="/" class="nav-logo">
						<img
							src="/assets/logo"
							alt="${ctx.$app.manifest.name} - logo"
							width="50"
							height="50"
						/>
						Sealious App
					</a>`,
			messages: [
				{
					type: "success",
					text: "",
				},
			],
		};

		return reaction;
	}

	async onSubmit(ctx: Context, data: FormData) {
		const username: string =
			typeof data.raw_values.username === "string" ? data.raw_values.username : "";
		const password: string =
			typeof data.raw_values.password === "string" ? data.raw_values.password : "";
		const email: string =
			typeof data.raw_values.email === "string" ? data.raw_values.email : "";

		try {
			const user = await Users.suCreate({
				username: username,
				password: password,
				email: email,
				roles: [],
                                confirmed: false,
                                creationDate: new Date().getTime(),
			});
                        const token = user.get('secretToken') as string;
                        const manifest = ctx.$app.manifest;
                        const message = await EmailTemplates.Simple(ctx.$app, {
                          to: email,
                          subject: "Sealple registration",
                          text: `
                             User registered. Click the link to confirm.
                             ${manifest.link_schema}://${manifest.base_url}/confirm?token=${token}
                          `,
                        });
                        message.send(ctx.$app);
			console.log("A user was created successfully.");
		} catch (error) {
			console.error("Error during user creation:", error);
			throw new Error(String(error));
		}
		return;
	}

	async render(ctx: Context, data: FormData, show_field_errors: boolean) {
		return html(ctx, "SignUp", tempstream`
                        <div class="sign-form">
                                ${await super.render(ctx, data, show_field_errors)}
                        </div>
                `
                );
	}
})();
