import { BaseContext } from "koa";
import { SignUpURL, SignInURL, PostURL, LogoutURL } from "../urls";

export default async function navbar(ctx: BaseContext) {
	const isLoggedIn = !!ctx.$context.session_id;

	const linkData = isLoggedIn
		? [
				{ text: "Logout", url: LogoutURL },
				{ text: "Make post", url: PostURL },
		  ]
		: [
				{ text: "Sign in", url: SignInURL },
				{ text: "Sign up", url: SignUpURL },
		  ];

	const linksHTML = linkData
		.map((link) => `<li><a href="${link.url}">${link.text}</a></li>`)
		.join("\n");

	return /* HTML */ ` <nav class="navbar">
		<a href="/" class="nav-logo">
			<img
				src="/assets/logo"
				alt="${ctx.$app.manifest.name} - logo"
				width="50"
				height="50"
			/>
			Sealple
		</a>
		<ul>
			${linksHTML}
		</ul>
	</nav>`;
}
