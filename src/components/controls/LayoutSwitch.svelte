<script lang="ts">
import Icon from "@/components/common/Icon.svelte";
import { displaySettingsConfig, siteConfig } from "@/config";
import { onMount } from "svelte";

type LayoutMode = "list" | "grid";

let currentLayout = $state<LayoutMode>(siteConfig.postListLayout.defaultMode);
let mounted = $state(false);
let isSwitching = $state(false);

function getDefaultLayout(): LayoutMode {
	return window.innerWidth < 780
		? (siteConfig.postListLayout.mobileDefaultMode ??
			siteConfig.postListLayout.defaultMode)
		: siteConfig.postListLayout.defaultMode;
}

function switchLayout() {
	if (isSwitching) return;

	isSwitching = true;
	currentLayout = currentLayout === "list" ? "grid" : "list";
	localStorage.setItem("postListLayout", currentLayout);
	window.dispatchEvent(
		new CustomEvent("layoutChange", { detail: { layout: currentLayout } }),
	);
	window.setTimeout(() => {
		isSwitching = false;
	}, 500);
}

onMount(() => {
	const storedLayout = localStorage.getItem("postListLayout");
	currentLayout =
		storedLayout === "list" || storedLayout === "grid"
			? storedLayout
			: getDefaultLayout();
	mounted = true;

	const handleLayoutChange = (event: Event) => {
		const layout = (event as CustomEvent<{ layout?: LayoutMode }>).detail
			?.layout;
		if (layout === "list" || layout === "grid") currentLayout = layout;
	};
	window.addEventListener("layoutChange", handleLayoutChange);
	return () => window.removeEventListener("layoutChange", handleLayoutChange);
});
</script>

{#if mounted && displaySettingsConfig.layoutSwitchable}
	<button
		type="button"
		aria-label={currentLayout === "list" ? "切换为网格布局" : "切换为列表布局"}
		aria-pressed={currentLayout === "grid"}
		title={currentLayout === "list" ? "切换为网格布局" : "切换为列表布局"}
		class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90 flex items-center justify-center"
		class:switching={isSwitching}
		onclick={switchLayout}
		disabled={isSwitching}
	>
		<div class="icon-container w-5 h-5 flex items-center justify-center">
			{#if currentLayout === "list"}
				<Icon icon="material-symbols:format-list-bulleted-rounded" class="text-[1.25rem] icon-transition" />
			{:else}
				<Icon icon="material-symbols:grid-view-rounded" class="text-[1.25rem] icon-transition" />
			{/if}
		</div>
	</button>
{/if}

<style>
	.icon-transition {
		transition:
			transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
			opacity 0.3s ease;
	}

	.switching .icon-transition {
		animation: icon-rotate 0.5s cubic-bezier(0.4, 0, 0.2, 1);
	}

	button:not(.switching):hover .icon-transition {
		transform: scale(1.1);
	}

	@keyframes icon-rotate {
		0% {
			transform: rotate(0) scale(1);
			opacity: 1;
		}
		50% {
			transform: rotate(180deg) scale(0.8);
			opacity: 0.5;
		}
		100% {
			transform: rotate(360deg) scale(1);
			opacity: 1;
		}
	}
</style>
