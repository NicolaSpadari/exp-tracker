<template>
	<div v-show="isVisible" @click="installPWA()" v-dark-ripple class="bg-tidal-cyan-highlight rounded-md mt-3 max-w-sm mx-auto">
		<div class="mx-auto py-3 px-3 sm:px-6 lg:px-8">
			<div class="flex items-center justify-between flex-wrap">
				<div class="w-0 flex-1 flex items-center space-x-2">
					<p class="ml-3 font-medium text-tidal-cyan font-heading">Installa app</p>
					<DownloadIcon class="w-5 h-5 text-tidal-cyan" />
				</div>
				<div class="flex-shrink-0 sm:ml-3">
					<button type="button" @click="closePopup($event)" class="btn-app-dark p-2">
						<XIcon class="icon w-6 h-6 text-white" />
					</button>
				</div>
			</div>
		</div>
	</div>

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
	import { DownloadIcon, CheckIcon, XIcon } from "@heroicons/vue/outline";
	import { store } from "@/store";

	const deferredPrompt = ref();
	const isVisible = ref(false);
	const appInstalled = ref(false);

	const isIos = () => {
		const userAgent = window.navigator.userAgent.toLowerCase();
		return /iphone|ipad|ipod/.test(userAgent);
	};

	if (import.meta.env.MODE === "production" && typeof window !== "undefined") {
		onMounted(async () => {
			if (!isIos()) {
				await window.addEventListener("beforeinstallprompt", (e) => {
					e.preventDefault();
					deferredPrompt.value = e;
					isVisible.value = true;

					console.log("beforeinstallprompt event was fired");
				});
			}
		});
	}

	const closePopup = (e) => {
		e.stopPropagation();
		isVisible.value = false;
	};

	const installPWA = async () => {
		isVisible.value = false;
		deferredPrompt.value.prompt();

		const { outcome } = await deferredPrompt.value.userChoice;

		console.log("User response to A2HS: ", outcome);

		appInstalled.value = true;
		deferredPrompt.value = null;
	};
</script>