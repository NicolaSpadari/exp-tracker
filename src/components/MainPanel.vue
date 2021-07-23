<template>
	<div @click="emit('close')" class="transition-all duration-300 ease-in-out bg-dark-900/40 fixed w-screen h-screen z-5 inset-0" :class="props.open ? 'opacity-100' : 'pointer-events-none opacity-0 '"></div>
	<div class="bg-tidal-dark-200 transition-all duration-300 ease-in-out absolute w-screen h-auto rounded-t-2xl z-15 shadow-top" :class="props.open ? 'bottom-0' : '-bottom-full'">
		<div class="pill h-[4px] w-15 rounded-full bg-tidal-gold-highlight mx-auto absolute inset-x-0 top-3"></div>
		<div class="container">
			<div class="px-4 pt-5 pb-4 sm:p-6">
				<div class="row">
					<div class="col-12 col-md-6 col-lg-4">
						<div class="form-group">
							<label for="product-name" class="block text-sm font-medium text-white">Prodotto</label>
							<input type="text" v-model="product.name" id="product-name" class="bg-tidal-dark-300 mt-1 block w-full shadow-sm sm:text-sm text-white rounded-md outline-none p-2" />
						</div>
					</div>
					<div class="col-12 col-md-6 col-lg-4">
						<div class="form-group">
							<label for="product-date" class="block text-sm font-medium text-white">Data di scadenza</label>
							<input type="date" v-model="product.date" :min="moment(new Date()).format('YYYY-MM-DD')" id="product-date" class="bg-tidal-dark-300 mt-1 block w-full shadow-sm sm:text-sm text-white rounded-md outline-none p-2" />
						</div>
					</div>
					<div class="col-12 col-md-6 col-lg-4">
						<div class="form-group">
							<label class="block text-sm font-medium text-white">Quantità</label>
							<div class="flex space-x-4 mt-2">
								<div>
									<button type="button" @click="product.quantity--" class="btn btn-monospaced outline-none bg-tidal-dark-active rounded-full w-6 h-6" :class="{ 'opacity-40': product.quantity < 2 }" :disabled="product.quantity < 2">
										<MinusIcon class="icon text-white w-4 h-4" />
									</button>
								</div>
								<div class="my-auto">
									<p class="font-text text-white align-middle">{{ product.quantity }}</p>
								</div>
								<div>
									<button type="button" @click="product.quantity++" class="btn btn-monospaced outline-none bg-tidal-dark-active rounded-full w-6 h-6">
										<PlusIcon class="icon text-white w-4 h-4" />
									</button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="flex justify-center space-x-4 mb-4">
				<button type="button" @click="emit('close')" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
				<button type="button" @click="addDoc()" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-tidal-cyan bg-tidal-cyan-highlight outline-none" :class="{ 'opacity-40': product.name == '' || product.date == null }" :disabled="product.name == '' || product.date == null">Carica</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import firebase from "@/firebase.config";
	import { defineProps, defineEmits, onMounted, reactive } from "vue";
	import moment from "moment/min/moment-with-locales";
	import { MinusIcon, PlusIcon } from "@heroicons/vue/outline";

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
				quantity: product.quantity,
			})
			.then(() => {
				console.log("added product successfully");
				product.date = null;
				product.name = "";
				product.quantity = 1;
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