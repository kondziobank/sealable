import { Posts, Users } from "./../collections/collections";
import { tempstream } from "tempstream";
import { Context } from "koa";
import { Form, FormData, FormDataValue, Fields, Controls } from "@sealcode/sealgen";
import { CollectionItem } from "sealious";
import html from "../html";

export const actionName = "Post";

const fields = {
	content: new Fields.CollectionField(true, Posts.fields.content),
}

export const PostShape = Fields.fieldsToShape(fields);

export default new (class PostForm extends Form<typeof fields, void> {
	defaultSuccessMessage = "Post created!";

	fields = fields;

        controls = [
		new Controls.Textarea(fields.content, {
			label: "Post content",
                        rows: 3,
			type: "text",
			placeholder: "Nyaaa....",
		}),
                new Controls.HTML("decoration", (fctx) => {
                    return `<input
                        type="hidden"
                        id="action"
                        name="action"
                        value="create"
                        form="${fctx.form_id}"
                    />`;
                })
        ]

        validateValues = async (
            ctx: Context,
            data: Record<string, FormDataValue>
        ) : Promise<{ valid: boolean; error: string }> => {

            const { parsed: content } = await this.fields.content.getValue(ctx, data);
            if (!content) {
                return {
                    valid: false,
                    error: "Post content cannot be empty",
                }
            }
            if (content.length > 500 ) {
                return {
                    valid: false,
                    error: "Post content cannot longer then 500 characters",
                }
            }
            return {
                valid: true,
                error: "",
            }
        }

	canAccess = async (ctx: Context) => {
		if (ctx.$context.session_id) {
			return { canAccess: true, message: "" };
		}
		return { canAccess: false, message: "" };
	}

        onSubmit = async (ctx: Context, data: FormData) => {
		const action: FormDataValue = data.raw_values.action;
                console.debug(data.raw_values.action);

		switch (action) {
			case "create": {
                            const userData = await ctx.$context.getUserData(ctx.$app) as CollectionItem<typeof Users>;
                            await ctx.$app.collections.posts.create(ctx.$context, {
                                    content: String(data.raw_values.content),
                                    // Yes - I know it won't work for other TZs
                                    date: new Date().toLocaleString(), 
                                    author: userData.get("username") as string,
                            });
                            console.debug("Post created");
                            break;
			}
			default: {
                            console.warn(`Wrong action: ${action}`);
                            break;
			}
		}
		return;
        }

        render = async (ctx: Context, data: FormData, show_field_errors: boolean) => {
                return html(
                        ctx,
                        "Make a post",
			tempstream`
                            <div class="post-form">
                                ${await super.render(ctx, data, show_field_errors)}
                            </div>
                        `
                )
        }
})
