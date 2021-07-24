<template>
	<div class="pt-5">
		<div class="overflow-y-auto max-h-[75vh]">
			<div class="container">
				<div class="flex flex-row mb-3">
					<div class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex flex-col w-6 h-10 justify-center items-center"></div>
						<div class="flex-1">
							<p class="font-heading text-3xl text-white">I tuoi prodotti</p>
						</div>
					</div>
				</div>
				<MyProducts :showImage="true" :expired="false" />
			</div>
			<div class="container pt-3">
				<MyProducts :showImage="false" :expired="true" />
			</div>
		</div>
	</div>

	<Panel :id="'main'" :visible="mainState" @close="mainState = false">
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
					<input readonly @click="openDatepicker()" :value="product.date == null ? '' : moment(product.date).format('DD MMMM YYYY')" id="product-date" class="bg-tidal-dark-300 mt-1 block w-full shadow-sm sm:text-sm text-white rounded-md outline-none p-2" />
				</div>
			</div>
			<div class="col-12 col-md-6 col-lg-4">
				<div class="form-group">
					<label class="block text-sm font-medium text-white">Quantità</label>
					<div class="flex space-x-4 mt-2">
						<div>
							<button type="button" v-cyan-ripple @click="product.quantity--" class="btn btn-monospaced outline-none bg-tidal-dark-active rounded-full shadow-none w-6 h-6" :class="{ 'opacity-40': product.quantity < 2 }" :disabled="product.quantity < 2">
								<MinusIcon class="icon text-white w-4 h-4" />
							</button>
						</div>
						<div class="my-auto">
							<p class="text-white align-middle">{{ product.quantity }}</p>
						</div>
						<div>
							<button type="button" v-cyan-ripple @click="product.quantity++" class="btn btn-monospaced outline-none bg-tidal-dark-active rounded-full shadow-none w-6 h-6">
								<PlusIcon class="icon text-white w-4 h-4" />
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<Modal :visible="datepickerVisible" @close="datepickerVisible = false">
			<template v-slot:content>
				<DatePicker v-model="product.date" :min-date="minDate" @dayclick="closeDatepicker()" is-dark color="orange" />
			</template>
			<template v-slot:actions>
				<button type="button" v-dark-ripple @click="datePickerVisible = false" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-tidal-gold-highlight text-base font-medium text-tidal-gold sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
			</template>
		</Modal>

		<div class="flex justify-center space-x-4 mt-4">
			<button type="button" v-dark-ripple @click="mainState = false" class="btn btn-app-dark">Chiudi</button>
			<button type="button" v-dark-ripple @click="addDoc()" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-tidal-cyan bg-tidal-cyan-highlight outline-none" :class="{ 'opacity-40': product.name == '' || product.date == null }" :disabled="product.name == '' || product.date == null">Aggiungi</button>
		</div>
	</Panel>

	<Panel :id="'settings'" :visible="settingsState" @close="settingsState = false">
		<ul class="flex flex-col space-y-3">
			<li class="flex flex-row bg-tidal-dark-highlight rounded-md">
				<button type="button" v-dark-ripple @click="logoutVisible = true" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
					<div class="flex flex-col w-10 h-10 justify-center items-center">
						<TrashIcon class="mx-auto w-6 h-6 text-tidal-gold" />
					</div>
					<div class="flex-1">
						<div class="text-left font-medium text-white">Elimina tutto</div>
					</div>
				</button>
			</li>
		</ul>
		<div class="flex justify-center space-x-4 mt-4">
			<button type="button" v-dark-ripple @click="settingsState = false" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
		</div>

		<Modal :visible="modalVisible" @close="modalVisible = false">
			<template v-slot:content>
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
			</template>
			<template v-slot:actions>
				<button
					type="button"
					v-dark-ripple
					@click="
						deleteAll();
						modalVisible = false;
					"
					class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tidal-cyan-highlight text-base font-medium text-tidal-cyan sm:ml-3 sm:w-auto sm:text-sm outline-none"
				>
					Elimina
				</button>
				<button type="button" v-dark-ripple @click="modalVisible = false" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-tidal-dark-300 text-base font-medium text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
			</template>
		</Modal>
	</Panel>

	<Panel :id="'list'" :visible="listState" @close="listState = false">
		<div class="space-y-6 mt-3">
			<button v-if="!store.signedIn" v-cyan-ripple type="button" @click="login()" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-3 outline-none">
				<div class="autofit-col autofit-col-gutters pr-0 pl-3">
					<div class="grid content-center w-full h-full">
						<UserAddIcon class="icon w-6 h-6 text-tidal-gold mx-auto" />
					</div>
				</div>
				<div class="autofit-col autofit-col-gutters autofit-col-expand">
					<p class="flex text-white font-heading space-x-1">Accedi</p>
				</div>
			</button>

			<template v-if="store.signedIn">
				<ul class="flex flex-col space-y-3">
					<li class="flex flex-row bg-tidal-dark-highlight rounded-md">
						<div v-dark-ripple class="select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
							<div class="flex flex-col w-10 h-10 justify-center items-center">
								<img :src="store.userPicture" class="mx-auto object-cover rounded-full h-10 w-10" :alt="store.userName" />
							</div>
							<div class="flex-1">
								<div class="text-left font-medium text-white">Sei autenticato come {{ store.userName }}</div>
							</div>
						</div>
					</li>
					<li class="flex flex-row bg-tidal-dark-highlight rounded-md">
						<button type="button" v-dark-ripple @click="logoutVisible = true" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
							<div class="flex flex-col w-10 h-10 justify-center items-center">
								<UserRemoveIcon class="mx-auto w-6 h-6 text-tidal-gold" />
							</div>
							<div class="flex-1">
								<div class="text-left font-medium text-white">Esci</div>
							</div>
						</button>
					</li>
				</ul>
			</template>

			<div class="flex justify-center space-x-4 mt-4">
				<button type="button" v-dark-ripple @click="listState = false" class="btn btn-app-dark">Chiudi</button>
			</div>
		</div>

		<Modal :visible="logoutVisible" @close="logoutVisible = false">
			<template v-slot:content>
				<div class="sm:flex sm:items-start">
					<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-tidal-gold-highlight sm:mx-0 sm:h-10 sm:w-10">
						<TrashIcon class="icon h-6 w-6 text-tidal-gold" />
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-white">Eseguire il logout?</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-300">Non potrai aggiungere prodotti finché non rieffettuerai l'accesso. Vuoi procedere?</p>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:actions>
				<button type="button" v-dark-ripple @click="logoutVisible = false" class="btn btn-app-dark mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm">Annulla</button>
			</template>
		</Modal>
	</Panel>

	<BottomBar @openPanel="mainState = true" @mainMenuOpen="listState = true" @secondaryMenuOpen="settingsState = true" />
</template>

<script setup>
	import { onMounted, reactive, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { DatePicker } from "v-calendar";
	import { MinusIcon, PlusIcon } from "@heroicons/vue/outline";
	import { UserIcon, UserAddIcon, UserRemoveIcon, TrashIcon } from "@heroicons/vue/solid";
	import { store, login, logout, getProducts } from "@/store";

	const db = firebase.firestore();
	const datepickerVisible = ref(false);
	const modalVisible = ref(false);
	const logoutVisible = ref(false);
	const mainState = ref(false);
	const listState = ref(false);
	const settingsState = ref(false);
	const minDate = moment(new Date()).add(1, "day").toDate();

	onMounted(() => {
		moment.locale("it");
	});

	const product = reactive({
		name: "",
		picture: "",
		date: null,
		quantity: 1,
	});

	const openDatepicker = () => {
		datepickerVisible.value = true;
		listState.value = false;
		settingsSetate.value = false;
	};

	const closeDatepicker = () => {
		datepickerVisible.value = false;
		listState.value = false;
		settingsState.value = false;
	};

	const addDoc = () => {
		db.collection("products_" + store.userId)
			.add({
				name: product.name,
				expirationDate: moment(product.date).toDate(),
				picture: "",
				quantity: product.quantity,
			})
			.then(() => {
				console.log("Product added successfully");

				product.date = null;
				product.name = "";
				product.quantity = 1;
				getProducts();
				mainState.value = false;
			})
			.catch((err) => {
				console.error("Error adding product", err);
			});
	};

	const deleteAll = () => {
		db.collection("products_" + store.userId)
			.get()
			.then((querySnapshot) => {
				querySnapshot.forEach((doc) => {
					db.collection("products_" + store.userId)
						.doc(doc.id)
						.delete()
						.then(() => {
							console.log("Doc deleted successfully: " + doc.name);
						})
						.catch((err) => {
							console.error("Error deleting product: ", err);
						});
				});
			})
			.then(() => {
				getProducts();
			});
	};
</script>

<style lang="scss">
	html {
		-webkit-tap-highlight-color: transparent;
	}
	img {
		-webkit-user-drag: none;
		user-select: none;
	}
	.icon {
		@apply align-middle;
	}

	.btn-app-light {
		@apply bg-tidal-dark-highlight text-white space-x-2 rounded-md py-3 outline-none;
	}

	.btn-app-dark {
		@apply text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none;
	}

	.btn-app-cyan {
		@apply text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-tidal-cyan bg-tidal-cyan-highlight outline-none;
	}

	.btn-app-gold {
		@apply text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-tidal-gold bg-tidal-gold-highlight outline-none;
	}

	.fade-enter-active,
	.fade-leave-active {
		@apply transition-opacity duration-300 ease-in-out;
	}

	.fade-enter-from,
	.fade-leave-to {
		@apply opacity-0;
	}

	.shadow-top {
		box-shadow: 0px -3px 5px 0px rgba(50, 50, 50, 0.25);
	}

	.vc-container {
		@apply bg-tidal-dark-300 border-none;

		.vc-weekday {
			@apply text-tidal-gold;
		}
	}
</style>