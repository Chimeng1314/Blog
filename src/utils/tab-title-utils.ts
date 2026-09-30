const AWAY_TITLE = "🥺 真的要离开了嘛...";
const RETURN_TITLE = "✨ 欢迎回来，继续阅读吧！";
const RETURN_TITLE_DURATION = 2000;

/** 离开时显示提示，返回时短暂欢迎，再恢复当前页面标题。 */
export function initTabTitle(): void {
	let pageTitle = document.title;
	let restoreTimer: number | undefined;

	const updateTitle = (): void => {
		if (document.title !== AWAY_TITLE && document.title !== RETURN_TITLE) {
			pageTitle = document.title;
		}
		const title = document.hidden
			? AWAY_TITLE
			: restoreTimer !== undefined
				? RETURN_TITLE
				: pageTitle;
		if (document.title !== title) document.title = title;
	};

	document.addEventListener("visibilitychange", () => {
		window.clearTimeout(restoreTimer);
		restoreTimer = undefined;
		if (!document.hidden) {
			restoreTimer = window.setTimeout(() => {
				restoreTimer = undefined;
				updateTitle();
			}, RETURN_TITLE_DURATION);
		}
		updateTitle();
	});
	// Swup 可能在后台或欢迎提示期间替换 <title>，同步保存新标题。
	const observer = new MutationObserver(updateTitle);
	observer.observe(document.head, {
		childList: true,
		characterData: true,
		subtree: true,
	});
	updateTitle();
}
