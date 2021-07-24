<template>
	<div @click="emit('close')" class="transition-all duration-300 ease-in-out bg-dark-900/40 fixed w-screen h-screen z-5 inset-0" :class="props.open ? 'opacity-100' : 'pointer-events-none opacity-0 '"></div>
	<div class="bg-tidal-dark-200 transition-all duration-300 ease-in-out absolute w-screen h-auto rounded-t-2xl z-15 shadow-top" :class="props.open ? 'bottom-0' : '-bottom-full'">
		<div class="pill h-[4px] w-15 rounded-full bg-tidal-gold-highlight mx-auto absolute inset-x-0 top-3"></div>
		<div class="container">
			<div class="px-4 py-5 sm:p-6">
				<div class="space-y-6 mt-3">
					<button type="button" @click="modalVisible = true" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-3 outline-none">
						<div class="autofit-col autofit-col-gutters pr-0 pl-3">
							<div class="grid content-center w-full h-full">
								<TrashIcon class="icon w-6 h-6 text-tidal-gold mx-auto" />
							</div>
						</div>
						<div class="autofit-col autofit-col-gutters autofit-col-expand">
							<p class="flex text-white font-heading space-x-1">Elimina tutto</p>
						</div>
					</button>
				</div>
			</div>

			<div class="flex justify-center space-x-4 mb-4">
				<button type="button" @click="emit('close')" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
			</div>
		</div>
	</div>

	<transition name="fade">
		<div v-if="modalVisible" class="fixed z-10 inset-0 overflow-y-auto z-15" role="dialog">
			<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
				<div @click="modalVisible = false" class="fixed inset-0 bg-tidal-dark-200/90 transition-opacity"></div>
				<span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
				<div class="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
					<div class="bg-tidal-dark-300 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
						<div class="sm:flex sm:items-start">
							<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-tidal-gold-highlight sm:mx-0 sm:h-10 sm:w-10">
								<TrashIcon class="icon h-6 w-6 text-tidal-gold" />
							</div>
							<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
								<h3 class="text-lg leading-6 font-medium text-white">Eliminare tutti i prodotti?</h3>
								<div class="mt-2">
									<p class="text-sm text-gray-300">Questa azione non può essere interrotta. Vuoi procedere?</p>
								</div>
							</div>
						</div>
					</div>
					<div class="bg-tidal-dark-200 px-4 py-3 justify-center sm:px-6 sm:flex sm:flex-row-reverse">
						<button
							type="button"
							@click="
								deleteAll();
								modalVisible = false;
							"
							class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tidal-cyan-highlight text-base font-medium text-tidal-cyan sm:ml-3 sm:w-auto sm:text-sm outline-none"
						>
							Elimina
						</button>
						<button type="button" @click="modalVisible = false" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-tidal-dark-300 text-base font-medium text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script setup>
	import firebase from "@/firebase.config";
	import { defineProps, defineEmits, reactive, ref } from "vue";
	import { MinusIcon, PlusIcon } from "@heroicons/vue/outline";
	import { TrashIcon } from "@heroicons/vue/solid";
	import { store } from "@/store";

	const emit = defineEmits(["close"]);

	const props = defineProps({
		open: Boolean,
	});

	const db = firebase.firestore();

	const allProducts = reactive([]);
	const modalVisible = ref(false);

	const deleteAll = () => {
		db.collection("products_" + store.userId)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					allProducts.push({
						id: doc.id,
						name: doc.name,
					});
				});
			})
			.then(() => {
				allProducts.forEach((doc) => {
					db.collection("products")
						.doc(doc.id)
						.delete()
						.then(() => {
							console.log("doc deleted successfully: " + doc.name);
						})
						.catch((err) => {
							console.error("error deleting product: ", err);
						});
				});
			})
			.then(() => {
				window.location.reload();
			});
	};
</script>

<style scoped>
	.shadow-top {
		box-shadow: 0px -3px 5px 0px rgba(50, 50, 50, 0.25);
	}
</style>