<template>
	<main class="font-text container mt-5">
		<AddedProducts :key="productsVersion" />
	</main>

	<Panel :open="state" @pressed="state = false" @productsEdited="productsVersion++" />

	<BottomBar @pressed="state = true" />

	<ReloadPrompt />
</template>

<script setup>
	import { ref } from "vue";

	const state = ref(false);
	const productsVersion = ref(0);
</script>

<style lang="scss">
	html {
		-webkit-tap-highlight-color: transparent;
	}
	img {
		-webkit-user-drag: none;
		user-select: none;
	}
	.icon {
		@apply align-middle;
	}
</style>