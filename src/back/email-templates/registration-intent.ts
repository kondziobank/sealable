import { App, EmailTemplates } from "sealious";

export default async function RegistrationIntentTemplate(
	app: App,
	{ email_address, token }: { email_address: string; token: string }
) {
        const manifest: any = app.manifest;
        return EmailTemplates.Simple(app, {
		subject: app.i18n("registration_intent_email_subject", [app.manifest.name]),
		to: email_address,
		text: `
         ${app.i18n("registration_intent_email_text", [app.manifest.name])}`,
		buttons: [
			{
				text: app.i18n("registration_intent_cta"),
				href: `${manifest.link_schema}://${manifest.base_url}/account/reset?token=${token}`,
			},
		],
	});
}
