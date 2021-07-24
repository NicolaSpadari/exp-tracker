<template>
	<template v-if="store.signedIn">
		<template v-if="prods.length == 0 && props.showImage">
			<img src="/empty.svg" class="w-[70%] mx-auto mt-5 mb-3 md:w-[400px]" />
			<p class="text-white text-center">Nessun prodotto nella lista.<br />Inizia aggiungendo un prodotto col pulsante in basso</p>
		</template>
		<template v-else>
			<template v-if="props.expired && expiredProducts.length > 0">
				<div class="card-row space-x-2 mb-3">
					<div class="autofit-col autofit-col-gutters">
						<p class="text-white font-heading">Prodotti scaduti ({{ expiredProducts.length }})</p>
					</div>
				</div>
				<div v-for="product in expiredProducts" :key="product.id" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-2 mb-2">
					<div class="autofit-col autofit-col-gutters pr-0 pl-3">
						<button type="button" @click="removeQuantity(product)" class="grid content-center w-full h-full outline-none">
							<XCircleIcon class="icon w-6 h-6 text-tidal-gold mx-auto" />
						</button>
					</div>
					<div class="autofit-col autofit-col-gutters autofit-col-expand">
						<p class="flex text-white font-heading space-x-1">
							<span>{{ shortString(product.name, 25) }}</span>
							<ExclamationIcon class="icon w-4 h-4 text-tidal-gold my-auto" />
							<span class="text-sm my-auto">({{ product.quantity }})</span>
						</p>
						<p class="text-white font-text text-sm">
							Scaduto
							<template v-if="remainingTime(product.date) == 0"> oggi </template>
							<template v-else> il {{ moment(product.date).format("DD MMMM") }} </template>
						</p>
					</div>
				</div>
			</template>

			<template v-if="!props.expired && validProducts.length > 0">
				<div v-for="product in validProducts" :key="product.id" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-2 mb-2">
					<div class="autofit-col autofit-col-gutters pr-0 pl-3">
						<button type="button" @click="askDelete(product)" class="grid content-center w-full h-full outline-none">
							<CheckCircleIcon class="icon w-6 h-6 text-tidal-cyan mx-auto" />
						</button>
					</div>
					<div class="autofit-col autofit-col-gutters autofit-col-expand">
						<p class="font-heading text-white">
							{{ shortString(product.name, 25) }}
							<span class="text-sm">({{ product.quantity }})</span>
						</p>
						<p class="text-white font-text">{{ remainingTime(product.date) }} giorni rimanenti</p>
					</div>
				</div>
			</template>
		</template>

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
									<h3 class="text-lg leading-6 font-medium text-white">Eliminare {{ toDelete.name }}?</h3>
									<div class="mt-2">
										<p class="text-sm text-gray-300">Questa azione non può essere interrotta. Vuoi procedere?</p>
									</div>
								</div>
							</div>
						</div>
						<div class="bg-tidal-dark-200 px-4 py-3 justify-center sm:px-6 sm:flex sm:flex-row-reverse">
							<button type="button" @click="removeQuantity(toDelete)" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tidal-cyan-highlight text-base font-medium text-tidal-cyan sm:ml-3 sm:w-auto sm:text-sm outline-none">Elimina</button>
							<button
								type="button"
								@click="
									toDelete = {};
									modalVisible = false;
								"
								class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-tidal-dark-300 text-base font-medium text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none"
							>
								Annulla
							</button>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</template>
	<template v-else>
		<template v-if="props.showImage">
			<img src="/login.svg" class="w-[70%] mx-auto mt-5 mb-4 md:w-[400px]" />
			<p class="text-white text-center">Effettua il login col tuo account Google dal pulsante in basso a sinistra</p>
		</template>
	</template>
</template>

<script setup>
	import { defineProps, onMounted, computed, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { ExclamationIcon } from "@heroicons/vue/solid";
	import { CheckCircleIcon, XCircleIcon, TrashIcon } from "@heroicons/vue/outline";
	import { store, getProducts } from "@/store";

	const props = defineProps({
		expired: Boolean,
		showImage: Boolean,
	});

	const modalVisible = ref(false);
	const toDelete = ref({});
	const db = firebase.firestore();

	onMounted(() => {
		moment.locale("it");
	});

	const prods = computed(() => {
		return store.products;
	});

	const expiredProducts = computed(() => {
		return prods.value.filter((prod) => {
			return remainingTime(prod.date) <= 0;
		});
	});

	const validProducts = computed(() => {
		return prods.value.filter((prod) => {
			return remainingTime(prod.date) > 0;
		});
	});

	const removeQuantity = (obj) => {
		if (obj.quantity - 1 == 0) {
			deleteDoc(obj.id);
		} else {
			db.collection("products_" + store.userId)
				.doc(obj.id)
				.update({
					quantity: obj.quantity - 1,
				})
				.then(() => {
					console.log("updated product successfully");
					toDelete.value = {};
					modalVisible.value = false;
					getProducts();
				})
				.catch((err) => {
					console.error("Error adding product", err);
				});
		}
	};

	const askDelete = (obj) => {
		toDelete.value = obj;
		modalVisible.value = true;
	};

	const deleteDoc = (id) => {
		db.collection("products_" + store.userId)
			.doc(id)
			.delete()
			.then(() => {
				console.log("product deleted successfully");
				toDelete.value = {};
				modalVisible.value = false;
				getProducts();
			})
			.catch((err) => {
				console.error("error deleting product: ", err);
			});
	};

	const remainingTime = (date) => {
		return Math.ceil(moment(date).diff(new Date(), "days", true));
	};

	const shortString = (str, num) => {
		if (str.length > num) {
			return str.substring(0, num) + "...";
		} else {
			return str;
		}
	};
</script>