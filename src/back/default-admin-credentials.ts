const ADMIN_CREDENTIALS = {
	username: process.env.SEALIOUS_ADMIN_USERNAME ? process.env.SEALIOUS_ADMIN_USERNAME : "admin",
	password: process.env.SEALIOUS_ADMIN_PASSWORD ? process.env.SEALIOUS_ADMIN_PASSWORD : "safePassword$#",
	email: process.env.SEALIOUS_ADMIN_EMAIL ? process.env.SEALIOUS_ADMIN_EMAIL : "admin@example.faketld",
};

export default ADMIN_CREDENTIALS;
