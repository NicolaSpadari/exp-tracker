<template>
	<main class="font-text pt-5">
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
				<MyProducts :key="productsVersion" :showImage="true" :expired="false" />
			</div>
			<div class="container pt-3">
				<MyProducts :key="productsVersion" :showImage="false" :expired="true" />
			</div>
		</div>
	</main>

	<MainPanel :open="openState" @close="openState = false" @productsEdited="productsVersion++" />

	<ListPanel :open="listState" @close="listState = false" />

	<SettingsPanel :open="settingsState" @close="settingsState = false" />

	<BottomBar @openPanel="openState = true" @mainMenuOpen="log('main')" @secondaryMenuOpen="settingsState = true" />
</template>

<script setup>
	import { ref } from "vue";

	const openState = ref(false);
	const listState = ref(false);
	const settingsState = ref(false);

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

	.fade-enter-active,
	.fade-leave-active {
		transition: opacity 0.5s ease;
	}

	.fade-enter-from,
	.fade-leave-to {
		opacity: 0;
	}
</style>