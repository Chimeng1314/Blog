import { type CollectionEntry, getCollection } from "astro:content";
import { url } from "@/utils/url-utils";

export type HubWithPosts = CollectionEntry<"hubs"> & {
	posts: CollectionEntry<"posts">[];
};

export type HubTreeNode = HubWithPosts & {
	children: HubTreeNode[];
	totalPostCount: number;
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

function calculateTotalPostCount(node: HubTreeNode): number {
	const postIds = new Set(node.posts.map((post) => post.id));
	for (const child of node.children) {
		calculateTotalPostCount(child);
		for (const post of child.posts) postIds.add(post.id);
		for (const descendant of getDescendants(child)) {
			for (const post of descendant.posts) postIds.add(post.id);
		}
	}
	node.totalPostCount = postIds.size;
	return node.totalPostCount;
}

function getDescendants(node: HubTreeNode): HubTreeNode[] {
	return node.children.flatMap((child) => [child, ...getDescendants(child)]);
}

function createsCycle(
	node: HubTreeNode,
	parent: HubTreeNode,
	nodesById: Map<string, HubTreeNode>,
): boolean {
	const visited = new Set<string>();
	let ancestor: HubTreeNode | undefined = parent;
	while (ancestor && !visited.has(ancestor.id)) {
		if (ancestor.id === node.id) return true;
		visited.add(ancestor.id);
		const parentId = ancestor.data.parent.trim();
		ancestor = parentId ? nodesById.get(parentId) : undefined;
	}
	return false;
}

/**
 * 构建专题树：未声明 parent、父专题不存在或会形成循环的专题都视为一级专题，
 * 从而保证配置错误不会让专题从页面中消失。
 */
export async function getHubTree(): Promise<HubTreeNode[]> {
	const [hubs, posts] = await Promise.all([
		getCollection("hubs"),
		getPublishedPosts(),
	]);
	const nodes = hubs
		.map(
			(hub): HubTreeNode => ({
				...hub,
				posts: posts
					.filter((post) => post.data.hubs.includes(hub.id))
					.sort(comparePosts),
				children: [],
				totalPostCount: 0,
			}),
		)
		.sort(compareHubs);
	const nodesById = new Map(nodes.map((node) => [node.id, node]));
	const roots: HubTreeNode[] = [];

	for (const node of nodes) {
		const parent = node.data.parent.trim();
		const parentNode = parent ? nodesById.get(parent) : undefined;
		if (!parentNode || createsCycle(node, parentNode, nodesById)) {
			roots.push(node);
			continue;
		}
		parentNode.children.push(node);
	}

	const sortAndCount = (node: HubTreeNode) => {
		node.children.sort(compareHubs);
		for (const child of node.children) sortAndCount(child);
		calculateTotalPostCount(node);
	};
	for (const root of roots) sortAndCount(root);
	return roots.sort(compareHubs);
}

export async function getHubList(): Promise<HubTreeNode[]> {
	return getHubTree();
}

export async function getPostsForHub(
	hubId: string,
): Promise<CollectionEntry<"posts">[]> {
	const posts = await getPublishedPosts();
	return posts
		.filter((post) => post.data.hubs.includes(hubId))
		.sort(comparePosts);
}

export function findHubInTree(
	hubs: HubTreeNode[],
	hubId: string,
): HubTreeNode | undefined {
	for (const hub of hubs) {
		if (hub.id === hubId) return hub;
		const descendant = findHubInTree(hub.children, hubId);
		if (descendant) return descendant;
	}
	return undefined;
}

export function getHubTreePostCount(hubs: HubTreeNode[]): number {
	const postIds = new Set<string>();
	for (const hub of hubs) {
		for (const node of [hub, ...getDescendants(hub)]) {
			for (const post of node.posts) postIds.add(post.id);
		}
	}
	return postIds.size;
}

export function getHubUrl(hubId: string): string {
	return url(`/hubs/${hubId}/`);
}
