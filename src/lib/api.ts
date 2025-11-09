import ky from "ky";

// Typically here we'd do things like inserting auth headers, etc, but not required for this task as
// we're just fetching from a local endpoint
export const api = ky.create();
