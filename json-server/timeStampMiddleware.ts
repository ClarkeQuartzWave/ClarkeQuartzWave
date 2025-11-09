import type { MiddlewareHandler } from "hono";

export const timeStampMiddleware: MiddlewareHandler = async (c, next) => {
	if (c.req.method !== "POST") {
		return next();
	}

	const body = await c.req.json().catch(() => ({})); // gracefully handle no JSON

	const created_date = new Date();
	const expiry_date = new Date();
	expiry_date.setDate(expiry_date.getDate() + 30);

	const updatedBody = {
		...body,
		date_created: created_date.toISOString(),
		expiry_date: expiry_date.toISOString(),
	};

	c.set("bodyWithTimestamps", updatedBody);

	await next();
};
