import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { JSONFilePreset } from "lowdb/node";

import { SERVER_XCSRF_TOKEN } from "./config.ts";
import { contentTypeMiddleware } from "./contentTypeMiddleware.ts";
import { csrfMiddleware } from "./csrfMiddleware.ts";
import { createDb } from "./db.ts";
import { timeStampMiddleware } from "./timeStampMiddleware.ts";

const app = new Hono();
const db = await JSONFilePreset("db.json", createDb());

const DELAY = 500;
const API_BASE = "/api";
const PORT = 3001;

app.use(
	"*",
	cors({
		origin: "*",
		allowHeaders: ["Content-Type", "x-csrf-token"],
		allowMethods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
		exposeHeaders: ["X-Total-Count"],
		credentials: true,
		maxAge: 600,
	}),
);

app.use("*", async (c, next) => {
	c.header("Content-Type", "application/json");
	await next();
});

app.use("*", csrfMiddleware);
app.use("*", contentTypeMiddleware);

app.use("*", async (c, next) => {
	await new Promise((r) => setTimeout(r, DELAY));
	await next();
});

app.use("*", timeStampMiddleware);

app.get(`${API_BASE}/auth/xcsrftoken`, (c) =>
	c.json({ xcsrftoken: SERVER_XCSRF_TOKEN }),
);

app.get(`${API_BASE}/*`, (c) => {
	const [collection] = c.req.path.replace(`${API_BASE}/`, "").split("/");
	const data = db.data[collection];

	if (!Array.isArray(data)) {
		return c.json({ error: "Not found" }, 404);
	}

	const url = new URL(c.req.url);

	const page = parseInt(url.searchParams.get("_page") ?? "1", 10);
	const limit = parseInt(url.searchParams.get("_limit") ?? "10", 10);

	const start = (page - 1) * limit;
	const end = start + limit;
	const paginated = data.slice(start, end);

	const sortKey = url.searchParams.get("_sort");
	const order = url.searchParams.get("_order") ?? "asc";
	if (sortKey) {
		paginated.sort((a, b) => {
			const valA = a[sortKey];
			const valB = b[sortKey];
			if (valA < valB) return order === "asc" ? -1 : 1;
			if (valA > valB) return order === "asc" ? 1 : -1;
			return 0;
		});
	}

	c.header("X-Total-Count", String(data.length));
	c.header("Access-Control-Expose-Headers", "X-Total-Count");

	return c.json(paginated);
});

app.post(`${API_BASE}/*`, async (c) => {
	const [collection] = c.req.path.replace(`${API_BASE}/`, "").split("/");
	const body = await c.req.json().catch(() => ({}));

	if (!Array.isArray(db.data[collection])) {
		return c.json({ error: "Invalid collection" }, 400);
	}

	const record = {
		...body,
		id: Date.now(),
		createdAt: new Date().toISOString(),
	};

	db.data[collection].push(record);
	await db.write();

	return c.json(record, 201);
});

app.onError((err, c) => {
	console.error("🔥 Server Error:", err);
	return c.json({ error: "Internal Server Error", message: err.message }, 500);
});

serve({ fetch: app.fetch, port: PORT });
console.log(`🚀 Mock API running on http://localhost:${PORT}`);
