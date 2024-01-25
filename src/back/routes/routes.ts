// DO NOT EDIT! This file is generated automaticaly with npm run generate-routes

import Router from "@koa/router";
import { mount } from "@sealcode/sealgen";
import * as URLs from "./urls";

import { default as Confirm } from "./confirm.redirect";
import { default as Forgot } from "./forgot.form";
import { default as Logout } from "./logout.redirect";
import { default as Post } from "./post.form";
import { default as Reset } from "./reset.form";
import { default as SignIn } from "./signIn.form";
import { default as SignUp } from "./signUp.form";

export default function mountAutoRoutes(router: Router) {
	mount(router, URLs.ConfirmURL, Confirm);
	mount(router, URLs.ForgotURL, Forgot);
	mount(router, URLs.LogoutURL, Logout);
	mount(router, URLs.PostURL, Post);
	mount(router, URLs.ResetURL, Reset);
	mount(router, URLs.SignInURL, SignIn);
	mount(router, URLs.SignUpURL, SignUp);
}
