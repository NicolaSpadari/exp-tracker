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

	<Modal :visible="appInstalled" @close="appInstalled = false">
		<template v-slot:content>
			<div class="sm:flex sm:items-start">
				<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-tidal-cyan-highlight sm:mx-0 sm:h-10 sm:w-10">
					<CheckIcon class="icon h-6 w-6 text-tidal-cyan" />
				</div>
				<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
					<h3 class="text-lg leading-6 font-medium text-white">App installata</h3>
					<div class="mt-2">
						<p class="text-sm text-gray-300">Potrai riaprire questo sito direttamente dalle tue app.</p>
					</div>
				</div>
			</div>
		</template>
		<template v-slot:actions>
			<button type="button" v-dark-ripple @click="appInstalled = false" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tidal-cyan-highlight text-base font-medium text-tidal-cyan sm:ml-3 sm:w-auto sm:text-sm outline-none">Ho capito</button>
		</template>
	</Modal>
</template>

<script setup>
	import { onMounted, computed, ref } from "vue";
	import { DownloadIcon, CheckIcon } from "@heroicons/vue/outline";
	import { store } from "@/store";

	const deferredPrompt = ref();
	const isVisible = ref(false);
	const appInstalled = ref(false);
	const pwaInstall = computed(() => store.pwaInstall);

	if (import.meta.env.MODE === "production" && typeof window !== "undefined") {
		onMounted(async () => {
			window.addEventListener("beforeinstallprompt", (e) => {
				e.preventDefault();
				deferredPrompt.value = e;
				isVisible.value = true;

				console.log("beforeinstallprompt event was fired");
			});
		});
	}

	const installPWA = async () => {
		isVisible.value = false;
		deferredPrompt.value.prompt();

		const { outcome } = await deferredPrompt.value.userChoice;

		console.log("User response to A2HS: ", outcome);

		deferredPrompt.value = null;
	};
</script>