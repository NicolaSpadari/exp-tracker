<template>
	<div v-if="needRefresh" class="fixed z-10 inset-0 overflow-y-auto" role="dialog">
		<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
			<div class="fixed inset-0 bg-tidal-dark-200/65 transition-opacity"></div>
			<span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
			<div class="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
				<div class="bg-tidal-dark-300 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
					<div class="sm:flex sm:items-start">
						<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-tidal-gold-highlight sm:mx-0 sm:h-10 sm:w-10">
							<RefreshIcon class="icon h-6 w-6 text-tidal-gold" />
						</div>
						<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
							<h3 class="text-lg leading-6 font-medium text-white">Aggiornamento disponibile</h3>
							<div class="mt-2">
								<p class="text-sm text-gray-300">Una nuova versione dell'app è disponibile per l'installazione. Procedere con l'aggiornamento?</p>
							</div>
						</div>
					</div>
				</div>
				<div class="bg-tidal-dark-200 px-4 py-3 justify-center sm:px-6 sm:flex sm:flex-row-reverse">
					<button type="button" @click="updateServiceWorker()" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tidal-cyan-highlight text-base font-medium text-white sm:ml-3 sm:w-auto sm:text-sm outline-none">Aggiorna</button>
					<button type="button" @click="close()" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-tidal-dark-300 text-base font-medium text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
				</div>
			</div>
		</div>
	</div>

	<div v-if="offlineReady" class="font-text bg-tidal-dark-200 fixed-top z-10 rounded-md m-3 max-w-[300px] mx-auto">
		<div class="card-row space-x-4 px-3">
			<div class="autofit-col autofit-col-expand">
				<div class="autofit-section">
					<p class="text-white">Contenuto offline pronto</p>
				</div>
			</div>
			<div class="autofit-col">
				<div class="autofit-section">
					<button type="button" @click="close()" class="btn btn-monospaced outline-none">
						<XIcon class="icon w-6 h-6 text-white" />
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup >
	import { useRegisterSW } from "virtual:pwa-register/vue";
	import { RefreshIcon } from "@heroicons/vue/outline";
	import { XIcon } from "@heroicons/vue/outline";

	const { offlineReady, needRefresh, updateServiceWorker } = useRegisterSW();
	const close = async () => {
		offlineReady.value = needRefresh.value = false;
	};
</script>