<template>
	<main class="font-text mt-5">
		<div class="overflow-y-auto max-h-[75vh]">
			<div class="container">
				<div class="card-row space-x-2 mb-4">
					<div class="autofit-col autofit-col-gutters">
						<div class="w-6 h-6"></div>
					</div>
					<div class="autofit-col autofit-col-gutters autofit-col-expand">
						<p class="font-heading text-3xl text-white">I tuoi prodotti</p>
					</div>
				</div>
				<AddedProducts :key="productsVersion" :expired="false" />
			</div>
			<div class="container pt-3">
				<AddedProducts :key="productsVersion" :expired="true" />
			</div>
		</div>
	</main>

	<Panel :open="openState" @close="openState = false" @productsEdited="productsVersion++" />

	<BottomBar @openPanel="openState = true" @mainMenuOpen="log('main')" @secondaryMenuOpen="log('secondary')" />

	<ReloadPrompt />
</template>

<script setup>
	import { ref } from "vue";

	const openState = ref(false);
	const productsVersion = ref(0);

	const log = (msg) => {
		console.log(msg);
	};
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