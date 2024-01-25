import Router from "@koa/router";
import { Middlewares } from "sealious";
import { MainView } from "./common/main-view";
import mountAutoRoutes from "./routes";

export const mainRouter = (router: Router): void => {
	router.get("/", Middlewares.extractContext(), async (ctx) => {
		ctx.body = MainView(ctx);
	});

	router.post("/", Middlewares.parseBody(), Middlewares.extractContext(), async (ctx) => {
                const postItem = await ctx.$app.collections.posts.getByID(ctx.$context, String(ctx.$body.postId));
                const wantedLike = {
                        user: String(ctx.$context.user_id),
                        post: postItem.id,
                };
                const likeListResults = await ctx.$app.collections.likes
                    .list(ctx.$context)
                    .filter(wantedLike)
                    .fetch();

                if (likeListResults.items.length) {
                    await likeListResults.items[0].delete(ctx.$context);
                } else {
                    await ctx.$app.collections.likes.create(ctx.$context, wantedLike);
                }

		ctx.body = MainView(ctx);
                ctx.status = 422
	});

	router.use(Middlewares.extractContext());

	mountAutoRoutes(router);
};
