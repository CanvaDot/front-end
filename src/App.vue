<script setup lang="ts">
	import { ref } from "vue";

	const count = ref(0);
</script>

<script onmounted lang="ts">
	export default {
		name: "App"
	};
</script>

<template>
	<button @click="count++">{{ count }}</button>
</template>
