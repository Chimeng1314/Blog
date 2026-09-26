import { type CollectionEntry, getCollection } from "astro:content";
import { url } from "@/utils/url-utils";

export type HubWithPosts = CollectionEntry<"hubs"> & {
	posts: CollectionEntry<"posts">[];
};

function compareHubs(a: CollectionEntry<"hubs">, b: CollectionEntry<"hubs">) {
	const aOrder = a.data.order;
	const bOrder = b.data.order;
	if (aOrder !== undefined && bOrder !== undefined && aOrder !== bOrder) {
		return aOrder - bOrder;
	}
	if (aOrder !== undefined && bOrder === undefined) return -1;
	if (aOrder === undefined && bOrder !== undefined) return 1;
	return a.data.title.localeCompare(b.data.title, "zh-CN");
}

function comparePosts(
	a: CollectionEntry<"posts">,
	b: CollectionEntry<"posts">,
) {
	return b.data.published.getTime() - a.data.published.getTime();
}

async function getPublishedPosts() {
	return getCollection("posts", ({ data }) =>
		import.meta.env.PROD ? data.draft !== true : true,
	);
}

export async function getHubList(): Promise<HubWithPosts[]> {
	const [hubs, posts] = await Promise.all([
		getCollection("hubs"),
		getPublishedPosts(),
	]);

	return hubs
		.map((hub) => ({
			...hub,
			posts: posts
				.filter((post) => post.data.hubs.includes(hub.id))
				.sort(comparePosts),
		}))
		.sort(compareHubs);
}

export async function getPostsForHub(
	hubId: string,
): Promise<CollectionEntry<"posts">[]> {
	const posts = await getPublishedPosts();
	return posts
		.filter((post) => post.data.hubs.includes(hubId))
		.sort(comparePosts);
}

export function getHubUrl(hubId: string): string {
	return url(`/hubs/${hubId}/`);
}
