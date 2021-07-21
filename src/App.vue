<template>
	<AddedProducts />

	<ReloadPrompt />
</template>

<script setup>
	import { onMounted } from "vue";

	onMounted(() => {
		console.log("mounted");
	});

	if (import.meta.hot) {
		import.meta.hot.on("module-update", () => {
			console.clear();

			console.log("updated");
		});
	}
</script>

<style lang="scss">
	html {
		-webkit-tap-highlight-color: transparent;
	}
	img {
		-webkit-user-drag: none;
		user-select: none;
	}
</style>