import { BaseContext } from "koa";

function sanitizeString(str: string){
    str = str.replace(/[^a-z0-9áéíóúñü \.,_-]/gim,"");
    return str.trim();
}

export async function PostList(ctx: BaseContext) {
        const isLoggedIn = !!ctx.$context.session_id;
	const { items: posts } = await ctx.$app.collections.posts
                .list(ctx.$context)
                .sort({ date: "desc"})
                .paginate({ page: 1, items: 25 })
                .fetch();
        
        const likeForm = (postId: string) => `
            <form class="like-form" method="post">
                <input type="hidden" name="postId" value="${postId}">
                <input type="submit" value="Like"/>
            </form>
        `;
        const likeCount = async (postId: string) => {
                const likeListResults = await ctx.$app.collections.likes
                    .list(ctx.$context)
                    .filter({ post: postId })
                    .fetch();
                return likeListResults.items.length
        }

	const postsHTML = await Promise.all(
                posts.map(async (post) => `
                        <div class="post">
                                <span class="post-author">${post.get("author") as string}</span>
                                <span class="post-date">${post.get("date") as string}</span>
                                <p>${sanitizeString(post.get("content") as string)}<p>
                                ${ await likeCount(post.id) } likes
                                ${ isLoggedIn ? likeForm(post.id) : "" }
                        </div>
                    `)
                )
                

	return `
                <div class="posts-grid">
                        ${postsHTML.join("\n")}
                </div>
            `;
}
