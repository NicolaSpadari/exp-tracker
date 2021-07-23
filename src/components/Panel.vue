<template>
	<div @click="emit('close')" class="transition-all duration-300 ease-in-out bg-dark-900/40 fixed w-screen h-screen z-5 inset-0" :class="props.open ? 'opacity-100' : 'pointer-events-none opacity-0 '"></div>
	<div class="bg-white transition-all duration-300 ease-in-out absolute w-screen h-[65vh] rounded-t-2xl z-15 shadow-top" :class="props.open ? 'bottom-0' : '-bottom-full'">
		<div class="container">
			<div class="px-4 py-5 bg-white sm:p-6">
				<div class="grid grid-cols-6 gap-6">
					<div class="col-span-6 sm:col-span-3">
						<label for="product-name" class="block text-sm font-medium text-gray-900">Prodotto</label>
						<input type="text" v-model="product.name" id="product-name" class="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md" />
					</div>

					<div class="col-span-6 sm:col-span-3">
						<label for="product-date" class="block text-sm font-medium text-gray-900">Data di scadenza</label>
						<input type="date" v-model="product.date" id="product-date" class="mt-1 block w-full shadow-sm sm:text-sm border border-gray-300 rounded-md" />
					</div>
				</div>
			</div>

			<div class="flex justify-center space-x-4">
				<button type="button" @click="emit('close')" class="text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-900 bg-white hover:bg-gray-50">Chiudi</button>
				<button type="button" @click="addDoc()" class="text-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-gray-50" :class="{ 'pointer-events-none opacity-50': product.name == '' || product.date == null }" :disabled="product.name == '' || product.date == null">Carica</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import firebase from "@/firebase.config";
	import { defineProps, defineEmits, onMounted, reactive } from "vue";
	import moment from "moment/min/moment-with-locales";

	const emit = defineEmits(["close", "productsEdited"]);

	const props = defineProps({
		open: Boolean,
	});

	const db = firebase.firestore();

	onMounted(() => {
		moment.locale("it");
	});

	const product = reactive({
		name: "",
		picture: "",
		date: null,
		quantity: 1,
	});

	const addDoc = () => {
		db.collection("products")
			.add({
				name: product.name,
				expirationDate: moment(product.date).toDate(),
				picture: "",
				quantity: 1,
			})
			.then(() => {
				console.log("added product successfully");
				product.date = null;
				product.name = "";
				emit("productsEdited");
				emit("close");
			})
			.catch((err) => {
				console.error("Error adding product", err);
			});
	};
</script>

<style scoped>
	.shadow-top {
		box-shadow: 0px -3px 5px 0px rgba(50, 50, 50, 0.25);
	}
</style>