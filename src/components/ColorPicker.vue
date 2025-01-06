<style scoped>
	.main {
		position: relative;

		background-color: #eeeeee;

		height: 50px;
		width: 500px;

		border-radius: 8px;
		box-shadow: 5px 5px 30px rgba(0, 0, 0, 0.3);

		display: flex;
		gap: 10px;

		padding: 10px;
	}

	.place {
		width: 30%;

		text-transform: uppercase;
		font-size: 0.9em;
		font-weight: bold;

		color: white;

		transition: background-color 0.2s, color 0.2s;
	}
	
	.color {
		width: 13%;

		transition: background-color 0.2s;
	}

	.color-selector {
		width: 13%;

		position: relative;

		overflow: hidden;

		background-color: gray;
	}

	.color-selector::after {
		content: "";

		position: absolute;
		inset: 0;

		height: 100%;
		width: 100%;

		background: conic-gradient(#FD004C, #FE9000, #FFF020, #3EDF4B, #3363FF, #B102B7, #FD004C);
		background-size: 200%, 200%;
		background-position: center;

		filter: blur(5px);
		transform: scale(150%);
		transition: transform 0.4s;
	}

	.color-selector:hover::after {
		transform: rotate(90deg) scale(150%);
	}

	.palette-item {
		border: none;
		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
		border-radius: 8px;
	}

	.palette-item:hover {
		opacity: 0.8;
	}

	.slide-container {
		position: absolute;

		top: 0;
		left: 0;

		transform: translateY(-90%);

		background-color: #eeeeee;

		height: 60px;
		width: 100%;

		border-radius: 8px 8px 0 0;

		display: flex;

		justify-content: center;
		align-items: center;
	}

	.slide-container > input {
		background-image: linear-gradient(
			to right,
			hsl(0, 100%, 50%),
			hsl(60, 100%, 50%),
		    hsl(120, 100%, 50%),
			hsl(180, 100%, 50%),
		    hsl(240, 100%, 50%),
			hsl(300, 100%, 50%),
		    hsl(360, 100%, 50%)
		);

		border: none;
		outline: none;
		appearance: none;

		height: 15px;
		width: 95%;

		border-radius: 50px;
	}

	.slide-container > input::-webkit-slider-thumb,
	.slide-container > input::-moz-range-thumb {
		background-color: white;
		
		border: none;

		transform: scale(150%);

		box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.3);
	}
</style>

<script setup lang="ts">
	import { getColorBrightness, HslColor, RawColor, RgbColor } from "../helpers/color";
	import { ref, Ref } from "vue";

	let lsPastColors: RawColor[];
	try {
		lsPastColors = JSON.parse(
			localStorage.getItem("pastColors") || "[]"
		);

		if (!Array.isArray(lsPastColors) || lsPastColors.length > 5) {
			lsPastColors = [];
		}
	} catch {
		lsPastColors = [];
	}

	const pastColors: Ref<RgbColor[]> = ref([]);

	for (const color of lsPastColors) {
		if (!Array.isArray(color) || color.length != 3) {
			continue;
		}

		const [r, g, b] = color;

		try {
			pastColors.value.push(new RgbColor(r, g, b));
		} catch {}
	}

	const defaultColors = [
		new RgbColor(255, 0, 0),
		new RgbColor(0, 255, 0),
		new RgbColor(0, 0, 255),
		new RgbColor(255, 255, 0),
		new RgbColor(0, 0, 0)
	];

	while (pastColors.value.length < 5) {
		pastColors.value.push(defaultColors[pastColors.value.length]);
	}

	localStorage.setItem("pastColors", JSON.stringify(
		pastColors
			.value
			.map(color => color.rawColor)
	));

	let lsCurrentColor: RawColor;
	try {
		lsCurrentColor = JSON.parse(
			localStorage.getItem("currentColor") || "[]"
		);

		if (!Array.isArray(lsCurrentColor) || lsCurrentColor.length != 3) {
			lsCurrentColor = [160, 32, 240];
		}
	} catch {
		lsCurrentColor = [160, 32, 240];
	}

	localStorage.setItem("currentColor", JSON.stringify(
		lsCurrentColor
	));

	const currentColor = ref(new RgbColor(...lsCurrentColor));

	const sliderVisibility = ref(false);

	function setColorChange(color: RgbColor) {
		if (!pastColors.value.some(c => c.r == color.r && c.g == color.g && c.b == color.b)) {
			pastColors.value.unshift(currentColor.value as RgbColor)
			pastColors.value.pop();
		}

		currentColor.value = color;

		localStorage.setItem("pastColors", JSON.stringify(pastColors.value.map(color => color.rawColor)));
		localStorage.setItem("currentColor", JSON.stringify(currentColor.value.rawColor));
	}

	function changeColorFromSlide(event: Event) {
		const target = event.target as HTMLInputElement;
		const color = new HslColor(target.valueAsNumber, 100, 50)
			.toRgb();

		sliderVisibility.value = false;

		setColorChange(color);
	}
</script>

<template>
	<div :class="`main ${$attrs.class}`">
		<button
			class="place palette-item"
			:style="{
				backgroundColor: currentColor.cssColor,
				color: getColorBrightness(currentColor as RgbColor) < 125 ? 'white' : 'black'
			}"
			@click="$emit('paintCell', currentColor)"
		>
			Paint
		</button>

		<div class="color-selector palette-item" @click="() => sliderVisibility = !sliderVisibility"/>

		<div
			v-for="color of pastColors"
			:style="{backgroundColor: color.cssColor}"
			class="color palette-item"
			@click="setColorChange(color)"
		/>

		<div class="slide-container" :style="{visibility: sliderVisibility ? 'unset' : 'hidden'}">
			<input type="range" min="0" max="360" :value="360 / 2" @change="changeColorFromSlide" />
		</div>
	</div>
</template>
