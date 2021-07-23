<template>
	<template v-if="props.expired">
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
				<p class="text-white font-heading">
					{{ shortString(product.name, 25) }}
					({{ product.quantity }})
				</p>
				<p class="text-white font-text uppercase text-sm">
					Scaduto
					<ExclamationIcon class="icon w-4 h-4 text-tidal-gold" />
				</p>
			</div>
		</div>
	</template>
	<template v-else>
		<div v-for="product in validProducts" :key="product.id" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-2 mb-2">
			<div class="autofit-col autofit-col-gutters pr-0 pl-3">
				<button type="button" @click="deleteDoc(product.id)" class="grid content-center w-full h-full">
					<CheckCircleIcon class="icon w-6 h-6 text-tidal-cyan mx-auto" />
				</button>
			</div>
			<div class="autofit-col autofit-col-gutters autofit-col-expand">
				<p class="font-heading text-white">
					{{ shortString(product.name, 25) }}
					({{ product.quantity }})
				</p>
				<p class="text-white font-text">{{ remainingTime(product.date) }} giorni rimanenti</p>
			</div>
		</div>
	</template>
</template>

<script setup>
	import { onMounted, computed, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { ExclamationIcon } from "@heroicons/vue/solid";
	import { CheckCircleIcon } from "@heroicons/vue/outline";
	import { XCircleIcon } from "@heroicons/vue/outline";
	import { defineProps } from "vue";

	const props = defineProps({
		expired: Boolean,
	});

	const allProducts = ref([]);
	const db = firebase.firestore();

	onMounted(() => {
		moment.locale("it");
	});

	const removeQuantity = (obj) => {
		if (obj.quantity - 1 == 0) {
			deleteDoc(obj.id);
		} else {
			db.collection("products")
				.doc(obj.id)
				.update({
					quantity: obj.quantity - 1,
				})
				.then(() => {
					console.log("updated product successfully");
					getAddedProducts();
				})
				.catch((err) => {
					console.error("Error adding product", err);
				});
		}
	};

	const getAddedProducts = () => {
		allProducts.value = [];
		db.collection("products")
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					console.log("product: ", doc.data());
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

	const deleteDoc = (id) => {
		db.collection("products")
			.doc(id)
			.delete()
			.then(() => {
				console.log("product deleted successfully");
				getAddedProducts();
			})
			.catch((err) => {
				console.error("error deleting product: ", err);
			});
	};

	const remainingTime = (date) => {
		return moment(date).diff(moment(new Date()), "days");
	};

	const shortString = (str, num) => {
		if (str.length > num) {
			return str.substring(0, num) + "...";
		} else {
			return str;
		}
	};

	getAddedProducts();

	const expiredProducts = computed(() => {
		return allProducts.value.filter((prod) => {
			return remainingTime(prod.date) < 1;
		});
	});

	const validProducts = computed(() => {
		return allProducts.value.filter((prod) => {
			return remainingTime(prod.date) >= 1;
		});
	});
</script>