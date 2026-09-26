<script lang="ts">
import DropdownItem from "@/components/common/DropdownItem.svelte";
import Icon from "@/components/common/Icon.svelte";
import { displaySettingsConfig } from "@/config";
import {
	WALLPAPER_BANNER,
	WALLPAPER_FULLSCREEN,
	WALLPAPER_NONE,
	WALLPAPER_OVERLAY,
} from "@/constants/constants";
import I18nKey from "@/i18n/i18nKey";
import { i18n } from "@/i18n/translation";
import type { WALLPAPER_MODE } from "@/types/config";
import {
	getStoredWallpaperMode,
	setWallpaperMode,
} from "@/utils/setting-utils";
import { onMount } from "svelte";

const options: { mode: WALLPAPER_MODE; icon: string; label: I18nKey }[] = [
	{
		mode: WALLPAPER_BANNER,
		icon: "material-symbols:image-outline",
		label: I18nKey.wallpaperBannerMode,
	},
	{
		mode: WALLPAPER_FULLSCREEN,
		icon: "material-symbols:wallpaper-rounded",
		label: I18nKey.wallpaperFullscreenMode,
	},
	{
		mode: WALLPAPER_OVERLAY,
		icon: "material-symbols:full-coverage-outline-rounded",
		label: I18nKey.wallpaperOverlayMode,
	},
	{
		mode: WALLPAPER_NONE,
		icon: "material-symbols:hide-image-outline-rounded",
		label: I18nKey.wallpaperNoneMode,
	},
];

let mode = $state<WALLPAPER_MODE>(WALLPAPER_BANNER);
let open = $state(false);
let root: HTMLDivElement;
let trigger: HTMLButtonElement;

const currentIcon = $derived(
	options.find((option) => option.mode === mode)?.icon ?? options[0].icon,
);

function closePanel() {
	open = false;
}

function togglePanel() {
	open = !open;
}

function switchWallpaperMode(nextMode: WALLPAPER_MODE) {
	mode = nextMode;
	setWallpaperMode(nextMode);
	window.scrollTo({ top: 0 });
	closePanel();
}

onMount(() => {
	mode = getStoredWallpaperMode();
	const handleWallpaperChange = (event: Event) => {
		const nextMode = (event as CustomEvent<{ mode?: WALLPAPER_MODE }>).detail
			?.mode;
		if (nextMode) mode = nextMode;
	};
	const handlePointerDown = (event: PointerEvent) => {
		if (event.target instanceof Node && !root.contains(event.target)) closePanel();
	};
	const handleKeydown = (event: KeyboardEvent) => {
		if (event.key !== "Escape") return;
		closePanel();
		trigger.focus();
	};
	window.addEventListener("wallpaperModeChange", handleWallpaperChange);
	document.addEventListener("pointerdown", handlePointerDown);
	document.addEventListener("keydown", handleKeydown);
	return () => {
		window.removeEventListener("wallpaperModeChange", handleWallpaperChange);
		document.removeEventListener("pointerdown", handlePointerDown);
		document.removeEventListener("keydown", handleKeydown);
	};
});
</script>

{#if displaySettingsConfig.wallpaperModeSwitchable}
	<div class="relative z-50" bind:this={root}>
		<button
			bind:this={trigger}
			id="wallpaper-mode-switch"
			type="button"
			aria-label={i18n(I18nKey.wallpaperMode)}
			aria-haspopup="menu"
			aria-controls="wallpaper-mode-panel"
			aria-expanded={open}
			title={i18n(I18nKey.wallpaperMode)}
			class="btn-plain scale-animation rounded-lg h-11 w-11 active:scale-90"
			onclick={togglePanel}
		>
			<Icon icon={currentIcon} class="text-[1.25rem]" />
		</button>

		<div
			id="wallpaper-mode-panel"
			class="float-panel absolute transition-all top-11 -right-2 p-2 w-42"
			class:float-panel-closed={!open}
			role="menu"
			aria-labelledby="wallpaper-mode-switch"
			aria-hidden={!open}
			inert={!open}
		>
			{#each options as option, index}
				<DropdownItem
					role="menuitem"
					isActive={mode === option.mode}
					isLast={index === options.length - 1}
					onclick={() => switchWallpaperMode(option.mode)}
				>
					<Icon icon={option.icon} class="text-[1.25rem] mr-3" />
					{i18n(option.label)}
				</DropdownItem>
			{/each}
		</div>
	</div>
{/if}
