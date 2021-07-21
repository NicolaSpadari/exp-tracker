<template>
	<p><u>Added products:</u></p>

	<ul>
		<li v-for="product in allProducts" :key="product.id" class="mb-10">
			<img :src="product.picture" style="max-height: 100px" class="object-contain" />
			<p>{{ product.name }}</p>
			<p>Quantità: {{ product.quantity }}</p>

			<p v-if="remainingTime(product.date) < 0" class="text-red-600">SCADUTO</p>
			<p v-else>{{ remainingTime(product.date) }} giorni rimanenti</p>

			<button @click="deleteDoc(product.id)" class="border-2">elimina</button>
			<button @click="removeQuantity(product)" v-if="product.quantity > 1" class="border-2 ml-2">- 1</button>
		</li>
	</ul>
</template>

<script setup>
	import { onMounted, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";

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

	getAddedProducts();
</script>