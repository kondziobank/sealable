import html from "../../html";
import { BaseContext } from "koa";
import { Readable } from "stream";
import { tempstream } from "tempstream";
import { PostList } from "./post-list"

export function MainView(ctx: BaseContext): Readable{
	return html(
		ctx,
		"Main",
		tempstream/* HTML */ `
                   ${PostList(ctx)} 
		`
	);
}
