import type { MiddlewareHandler } from "hono";
import { SERVER_XCSRF_TOKEN } from "./config.ts";

export const csrfMiddleware: MiddlewareHandler = async (c, next) => {
	const method = c.req.method.toUpperCase();
	const requiresCsrf = ["POST", "PUT", "DELETE", "PATCH"].includes(method);

	if (requiresCsrf) {
		const token = c.req.header("x-csrf-token");

		if (token !== SERVER_XCSRF_TOKEN) {
			return c.json({ error: "Invalid or missing CSRF token" }, 403);
		}
	}

	await next();
};
