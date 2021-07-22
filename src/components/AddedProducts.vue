<template>
	<p class="font-heading text-4xl text-gray-900 mb-4">I tuoi prodotti</p>

	<div class="divide-y divide-gray-200 max-h-[68vh] overflow-x-hidden overflow-y-auto">
		<div v-for="product in allProducts" :key="product.id" class="row py-2" :class="{ 'bg-red-50': remainingTime(product.date) < 0 }">
			<div class="col-2 text-center">
				<button type="button" @click="deleteDoc(product.id)" class="grid content-center w-full h-full">
					<CheckIcon class="icon w-6 h-6 text-green-500 mx-auto" />
				</button>
			</div>
			<div class="col-10">
				<p class="text-lg font-heading">
					{{ shortString(product.name, 25) }}
					<span class="text-sm">({{ product.quantity }})</span>
				</p>

				<p v-if="remainingTime(product.date) < 0" class="text-red-600">
					SCADUTO
					<ExclamationIcon class="icon w-5 h-5 text-red-600" />
				</p>
				<p v-else>{{ remainingTime(product.date) }} giorni rimanenti</p>
			</div>
		</div>
	</div>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { TrashIcon } from "@heroicons/vue/solid";
	import { ExclamationIcon } from "@heroicons/vue/solid";
	import { CheckIcon } from "@heroicons/vue/solid";

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
</script>