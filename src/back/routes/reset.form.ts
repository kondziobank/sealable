import { Context } from "koa";
import { Form, FormData, FormDataValue, Fields, Controls } from "@sealcode/sealgen";
import html from "../html";
import { Users } from "../collections/collections";
import { PasswordResetIntents } from "../collections/collections";

export const actionName = "Reset";

const fields = {
        password: new Fields.SimpleFormField(true),
};

export const ResetShape = Fields.fieldsToShape(fields);

export default new (class ResetForm extends Form<typeof fields, void> {
        defaultSuccessMessage = "Form filled correctly";
        fields = fields;
        action = ""

        controls = [
                new Controls.SimpleInput(fields.password, { label: "Password:", type: "password" }),
        ];

        async validateValues(
                ctx: Context,
                data: Record<string, FormDataValue>
        ): Promise<{ valid: boolean; error: string }> {
                const { parsed: password } = await this.fields.password.getValue(ctx, data);

                if ((password || "").length >= 8) {
                        return { valid: true, error: `` };
                } else {
                        return {
                                valid: false,
                                error: "Password must contain a minimum of 8 characters",
                        };
                }
        }

        async canAccess(ctx: Context) {
                const token = ctx.query["token"] as string

                if (!token) {
                        console.log("Logged password reset attempt without valid token:", token)
                        return { canAccess: false, message: "No token provided!" };
                }

                const users = await PasswordResetIntents.suList().filter({ token: token }).fetch();
                if (!users.empty) {
                        return { canAccess: true, message: "" };
                }

                return { canAccess: false, message: "Invalid token!" };
        }

        async onSubmit(ctx: Context, data: FormData) {
                try {
                        const sudo = new ctx.$app.SuperContext();

                        const token = ctx.query["token"];
                        const resetIntents = await PasswordResetIntents.suList().filter({ token: token }).fetch();
                        const email = resetIntents.items[0].get('email');
                        const users = await Users.suList().filter({email: email}).fetch();
                        const newPassword = data.raw_values.password as string;
                        const user = users.items[0];

                        user.set('password', newPassword)
                        await resetIntents.items[0].delete(sudo);
                        console.info("Reset intent cleared");
                        await user.save(sudo)
                        console.info("User saved");
                } catch (error) {
                        console.error("Error during user password reset:", error);
                        throw new Error(String(error));
                }
        }

        async render(ctx: Context, data: FormData, show_field_errors: boolean) {
                return html(ctx, "Reset", await super.render(ctx, data, show_field_errors));
        }
})();
