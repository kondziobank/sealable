// DO NOT EDIT! This file is generated automaticaly with 'npm run generate-collections'
import { App } from "sealious";

import _GroupsToUsers from "./groups-to-users";
import _Groups from "./groups";
import _Likes from "./likes";
import _PasswordResetIntents from "./password-reset-intents";
import _Posts from "./posts";
import _Secrets from "./secrets";
import _UserRoles from "./user-roles";
import _Users from "./users";

export const GroupsToUsers = new _GroupsToUsers();
export const Groups = new _Groups();
export const Likes = new _Likes();
export const PasswordResetIntents = new _PasswordResetIntents();
export const Posts = new _Posts();
export const Secrets = new _Secrets();
export const UserRoles = new _UserRoles();
export const Users = new _Users();

export const collections = {
	...App.BaseCollections,
	"groups-to-users": GroupsToUsers,
	groups: Groups,
	likes: Likes,
	"password-reset-intents": PasswordResetIntents,
	posts: Posts,
	secrets: Secrets,
	"user-roles": UserRoles,
	users: Users,
};
