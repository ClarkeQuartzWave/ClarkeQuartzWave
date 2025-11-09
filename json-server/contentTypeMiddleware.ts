import type { MiddlewareHandler } from "hono";

export const contentTypeMiddleware: MiddlewareHandler = async (c, next) => {
	if (c.req.method !== "POST") {
		return next();
	}

	const contentType = c.req.header("content-type");

	if (contentType === undefined || contentType !== "application/json") {
		return c.json(
			{
				error: "Unsupported Content-Type",
				detail:
					'The provided Content-Type doesn\'t match the supported Content-Type of "application/json"',
			},
			415,
		);
	}

	await next();
};
