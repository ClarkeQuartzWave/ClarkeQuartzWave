export const applicationQueryKeys = {
	all: () => ["application"],
	infinite: () => [...applicationQueryKeys.all(), "infinite"],
} as const;
