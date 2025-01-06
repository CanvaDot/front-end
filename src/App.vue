<style>
	* {
		font-family: sans-serif;
	}

	body {
		background-color: #dddddd;
	}
</style>

<style scoped>
	.picker {
		position: absolute;

		top: 98%;
		left: 1%;

		transform: translateY(-100%);
	}
</style>

<script setup lang="ts">
	import ColorPicker from "./components/ColorPicker.vue";
	import { RgbColor } from "./helpers/color";
</script>

<template>
	<ColorPicker
		class="picker"
		@paint-cell="(color: RgbColor) => console.log(color.cssColor)"
	/>
</template>
