import { withProdApp } from "../test_utils/with-prod-app";
import { LONG_TEST_TIMEOUT, webhintURL } from "../test_utils/webhint";
import { ForgotURL } from "./urls";

describe("Forgot", () => {
	it("doesn't crash", async function () {
		this.timeout(LONG_TEST_TIMEOUT);
		return withProdApp(async ({ base_url, rest_api }) => {
			await rest_api.get(ForgotURL);
			await webhintURL(base_url + ForgotURL);
			// alternatively you can use webhintHTML for faster but less precise scans
			// or for scanning responses of requests that use some form of authorization:
			// const response = await rest_api.get(ForgotURL);
			// await webhintHTML(response);
		});
	});
});
