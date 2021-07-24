<template>
	<template v-if="store.signedIn">
		<template v-if="prods.length == 0 && props.showImage">
			<img src="/empty.svg" class="w-[70%] mx-auto mt-5 mb-3 md:w-[400px]" />
			<p class="text-white text-center">Nessun prodotto nella lista.<br />Inizia aggiungendo un prodotto col pulsante in basso</p>
		</template>
		<template v-else>
			<ul v-if="props.expired && expiredProducts.length > 0" class="flex flex-col space-y-3">
				<li class="flex flex-row">
					<div v-dark-ripple class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex-1">
							<p class="text-white font-heading">Prodotti scaduti ({{ expiredProducts.length }})</p>
						</div>
					</div>
				</li>
				<li v-for="product in expiredProducts" :key="product.id" class="flex flex-row bg-tidal-dark-highlight rounded-md">
					<div v-dark-ripple class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<button type="button" @click="askDelete(product)" class="flex flex-col w-6 h-10 justify-center items-center">
							<XCircleIcon class="mx-auto w-6 h-6 text-tidal-gold" />
						</button>
						<div class="flex-1">
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
				</li>
			</ul>

			<ul v-if="!props.expired && validProducts.length > 0" class="flex flex-col space-y-3">
				<li v-for="product in validProducts" :key="product.id" class="flex flex-row bg-tidal-dark-highlight rounded-md">
					<div v-dark-ripple class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<button type="button" @click="askDelete(product)" class="flex flex-col w-6 h-10 justify-center items-center">
							<CheckCircleIcon class="mx-auto w-6 h-6 text-tidal-cyan" />
						</button>
						<div class="flex-1">
							<p class="font-heading text-white">
								{{ shortString(product.name, 25) }}
								<span class="text-sm">({{ product.quantity }})</span>
							</p>
							<p v-if="remainingTime(product.date) == 1" class="animate-pulse text-tidal-gold font-text">Scade domani</p>
							<p v-else class="text-white font-text">{{ remainingTime(product.date) }} giorni rimanenti</p>
						</div>
					</div>
				</li>
			</ul>
		</template>

		<Modal :visible="modalVisible">
			<template v-slot:content>
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
			</template>
			<template v-slot:actions>
				<button type="button" v-dark-ripple @click="removeQuantity(toDelete)" class="btn btn-app-cyan w-full inline-flex justify-center sm:ml-3 sm:w-auto sm:text-sm">Elimina</button>
				<button
					type="button"
					v-dark-ripple
					@click="
						toDelete = {};
						modalVisible = false;
					"
					class="btn btn-app-dark mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
				>
					Annulla
				</button>
			</template>
		</Modal>
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