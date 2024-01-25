import { Context } from "koa";
import { Mountable } from "@sealcode/sealgen";
import { Users } from "../collections/collections";
import Router from "@koa/router";

class ConfirmRedirect extends Mountable {

    canAccess = async (_: Context) => {
            return { canAccess: true, message: "" };
    }

    mount = (router: Router, _: string) => {
            // I cannot use a path with trailing slash here!
            // It redirects users to the same url without query params
            router.get('/confirm', async (ctx) => {
                    try {
                            const token = ctx.query["token"]
                            const user = await Users.suList().filter({ secretToken: token }).fetch();
                            if (user.empty) {
                                new Error("Invalid token!")
                            }
                            
                            user.items[0].set('confirmed', true)
                            user.items[0].set('secretToken', "")
                            user.items[0].save(new ctx.$app.SuperContext())
                            
                            ctx.response.body= "Account confirmed. Redirecting to main page"
                            ctx.status = 200;
                            ctx.redirect("/");
                    } catch (error) {
                            console.error("Error during confirm:", error);
                    }
            });
    }

}

export const actionName = "Confirm";
export default new ConfirmRedirect();
