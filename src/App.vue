<template>
	<main class="font-text divide-y divide-gray-200 mt-5">
		<div class="container">
			<div class="card-row space-x-2 mb-4">
				<div class="autofit-col autofit-col-gutters">
					<MinusSmIcon class="icon w-6 h-6 text-white opacity-0" />
				</div>
				<div class="autofit-col autofit-col-gutters autofit-col-expand">
					<p class="font-heading text-3xl text-gray-900">I tuoi prodotti</p>
				</div>
			</div>
			<AddedProducts :key="productsVersion" :expired="false" />
		</div>
		<div class="container pt-3">
			<AddedProducts :key="productsVersion" :expired="true" />
		</div>
	</main>

	<Panel :open="openState" @close="openState = false" @productsEdited="productsVersion++" />

	<BottomBar @addProduct="openState = true" @mainMenuOpen="log('main')" @secondaryMenuOpen="log('secondary')" />

	<ReloadPrompt />
</template>

<script setup>
	import { ref } from "vue";
	import { MinusSmIcon } from "@heroicons/vue/solid";

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