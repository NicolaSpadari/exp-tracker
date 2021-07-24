<template>
	<li v-if="isVisible" class="flex flex-row bg-tidal-dark-highlight rounded-md">
		<button type="button" v-dark-ripple @click="installPWA()" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
			<div class="flex flex-col w-10 h-10 justify-center items-center">
				<DownloadIcon class="mx-auto w-6 h-6 text-tidal-gold" />
			</div>
			<div class="flex-1">
				<div class="text-left font-medium text-white">Installa App</div>
			</div>
		</button>
	</li>
</template>

<script setup>
	import { computed, ref } from "vue";
	import { DownloadIcon } from "@heroicons/vue/outline";
	import { store } from "@/store";

	const deferredPrompt = ref();
	const isVisible = ref(false);
	const pwaInstall = computed(() => store.pwaInstall);

	if (pwaInstall.value?.type == "beforeIinstallprompt") {
		deferredPrompt.value = pwaInstall.value;
		isVisible.value = true;
	}

	const installPWA = () => {
		isVisible.value = false;
		deferredPrompt.value.prompt();

		deferredPrompt.value.userChoice.then((res) => {
			if (res.outcome == "accepted") {
				console.log("User accepted A2HS");
			} else {
				console.log("User rejected A2HS");
			}
		});
	};
</script>