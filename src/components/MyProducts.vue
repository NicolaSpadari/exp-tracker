<template>
	<template v-if="allProducts.length == 0 && props.showImage">
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
					<button type="button" @click="removeQuantity(product)" class="grid content-center w-full h-full">
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
					<button type="button" @click="deleteDoc(product)" class="grid content-center w-full h-full">
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
</template>

<script setup>
	import { defineProps, onMounted, computed, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { ExclamationIcon } from "@heroicons/vue/solid";
	import { CheckCircleIcon, XCircleIcon } from "@heroicons/vue/outline";

	const props = defineProps({
		expired: Boolean,
		showImage: Boolean,
	});

	const allProducts = ref([]);
	const db = firebase.firestore();

	onMounted(() => {
		moment.locale("it");

		getProducts();
	});

	const getProducts = () => {
		allProducts.value = [];
		db.collection("products")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					allProducts.value.push({
						id: doc.id,
						name: doc.data().name,
						date: doc.data().expirationDate.toDate(),
						picture: doc.data().picture,
						quantity: doc.data().quantity,
					});
				});
			});
	};

	const expiredProducts = computed(() => {
		return allProducts.value.filter((prod) => {
			return remainingTime(prod.date) <= 0;
		});
	});

	const validProducts = computed(() => {
		return allProducts.value.filter((prod) => {
			return remainingTime(prod.date) > 0;
		});
	});

	const removeQuantity = (obj) => {
		if (obj.quantity - 1 == 0) {
			deleteDoc(obj);
		} else {
			db.collection("products")
				.doc(obj.id)
				.update({
					quantity: obj.quantity - 1,
				})
				.then(() => {
					console.log("updated product successfully");
					getProducts();
				})
				.catch((err) => {
					console.error("Error adding product", err);
				});
		}
	};

	const deleteDoc = (obj) => {
		if (confirm("Eliminare " + obj.name + "?")) {
			db.collection("products")
				.doc(obj.id)
				.delete()
				.then(() => {
					console.log("product deleted successfully");
					getProducts();
				})
				.catch((err) => {
					console.error("error deleting product: ", err);
				});
		}
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