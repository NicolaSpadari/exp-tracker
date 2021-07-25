<template>
	<Installer />

	<div class="pt-10">
		<MyProducts />
	</div>

	<Panel :id="'main'" :visible="mainState" @close="mainState = false">
		<div class="grid grid-cols-6 gap-6 space-y-2 md:space-y-0">
			<div class="col-span-6 sm:col-span-3">
				<label for="product-name" class="block text-sm font-medium text-white">Prodotto</label>
				<input type="text" v-model="product.name" id="product-name" class="bg-tidal-dark-300 mt-1 block w-full shadow-sm sm:text-sm text-white rounded-md outline-none p-2" />
			</div>
			<div class="col-span-6 sm:col-span-3">
				<label for="product-date" class="block text-sm font-medium text-white">Data di scadenza</label>
				<input readonly @click="openDatepicker()" :value="product.date == null ? '' : moment(product.date).format('DD MMMM YYYY')" id="product-date" class="bg-tidal-dark-300 mt-1 block w-full shadow-sm sm:text-sm text-white rounded-md outline-none p-2" />
			</div>
			<div class="col-span-6 sm:col-span-3 md:col-span-6">
				<label class="block text-sm font-medium text-white">Quantità</label>
				<div class="flex space-x-4 mt-2">
					<div>
						<button type="button" v-cyan-ripple @click="product.quantity--" class="outline-none bg-tidal-dark-active rounded-full shadow-none w-6 h-6" :class="{ 'opacity-40': product.quantity < 2 }" :disabled="product.quantity < 2">
							<MinusIcon class="icon text-white w-4 h-4 mb-1" />
						</button>
					</div>
					<div class="my-auto">
						<p class="text-white align-middle">{{ product.quantity }}</p>
					</div>
					<div>
						<button type="button" v-cyan-ripple @click="product.quantity++" class="outline-none bg-tidal-dark-active rounded-full shadow-none w-6 h-6">
							<PlusIcon class="icon text-white w-4 h-4 mb-1" />
						</button>
					</div>
				</div>
			</div>
		</div>

		<Modal :visible="datepickerVisible" @close="closeDatepicker()">
			<template v-slot:content>
				<div class="text-center">
					<DatePicker v-model="product.date" :min-date="minDate" @dayclick="closeDatepicker()" is-dark color="orange" />
				</div>
			</template>
			<template v-slot:actions>
				<button type="button" v-dark-ripple @click="closeDatepicker()" class="btn-app-gold mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
			</template>
		</Modal>

		<div class="flex justify-center space-x-4 mt-4">
			<button type="button" v-dark-ripple @click="mainState = false" class="btn-app-dark">Chiudi</button>
			<button type="button" v-dark-ripple @click="addDoc()" class="text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-tidal-cyan bg-tidal-cyan-highlight outline-none" :class="{ 'opacity-40': product.name == '' || product.date == null }" :disabled="product.name == '' || product.date == null">Aggiungi</button>
		</div>
	</Panel>

	<Panel :id="'list'" :visible="listState" @close="listState = false">
		<div class="space-y-6 mt-3">
			<ul class="flex flex-col space-y-3">
				<li class="flex flex-row rounded-md" :class="store.order == 'date' ? 'bg-tidal-cyan-highlight' : 'bg-tidal-dark-highlight'">
					<button type="button" v-dark-ripple @click="store.order = 'date'" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex flex-col w-10 h-10 justify-center items-center">
							<SelectorIcon class="mx-auto w-6 h-6" :class="store.order == 'date' ? 'text-tidal-cyan' : 'text-tidal-gold'" />
						</div>
						<div class="flex-1">
							<div class="text-left font-medium" :class="store.order == 'date' ? 'text-tidal-cyan' : 'text-white'">Ordina per data</div>
						</div>
					</button>
				</li>
				<li class="flex flex-row rounded-md" :class="store.order == 'nameAsc' ? 'bg-tidal-cyan-highlight' : 'bg-tidal-dark-highlight'">
					<button type="button" v-dark-ripple @click="store.order = 'nameAsc'" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex flex-col w-10 h-10 justify-center items-center">
							<SortAscendingIcon class="mx-auto w-6 h-6" :class="store.order == 'nameAsc' ? 'text-tidal-cyan' : 'text-tidal-gold'" />
						</div>
						<div class="flex-1">
							<div class="text-left font-medium" :class="store.order == 'nameAsc' ? 'text-tidal-cyan' : 'text-white'">Ordina per nome</div>
						</div>
					</button>
				</li>
				<li class="flex flex-row rounded-md" :class="store.order == 'nameDesc' ? 'bg-tidal-cyan-highlight' : 'bg-tidal-dark-highlight'">
					<button type="button" v-dark-ripple @click="store.order = 'nameDesc'" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex flex-col w-10 h-10 justify-center items-center">
							<SortDescendingIcon class="mx-auto w-6 h-6" :class="store.order == 'nameDesc' ? 'text-tidal-cyan' : 'text-tidal-gold'" />
						</div>
						<div class="flex-1">
							<div class="text-left font-medium" :class="store.order == 'nameDesc' ? 'text-tidal-cyan' : 'text-white'">Ordina per nome</div>
						</div>
					</button>
				</li>
			</ul>

			<div class="flex justify-center space-x-4 mt-4">
				<button type="button" v-dark-ripple @click="listState = false" class="btn-app-dark">Chiudi</button>
			</div>
		</div>
	</Panel>

	<Panel :id="'settings'" :visible="settingsState" @close="settingsState = false">
		<ul class="flex flex-col space-y-3">
			<template v-if="store.signedIn">
				<li class="flex flex-row bg-tidal-dark-highlight rounded-md">
					<div v-dark-ripple class="select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex flex-col w-10 h-10 justify-center items-center">
							<img :src="store.userPicture" class="mx-auto object-cover rounded-full h-8 w-8" :alt="store.userName" />
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
			</template>
			<li v-else class="flex flex-row bg-tidal-dark-highlight rounded-md">
				<button type="button" v-dark-ripple @click="login()" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
					<div class="flex flex-col w-10 h-10 justify-center items-center">
						<UserAddIcon class="mx-auto w-6 h-6 text-tidal-gold" />
					</div>
					<div class="flex-1">
						<div class="text-left font-medium text-white">Accedi</div>
					</div>
				</button>
			</li>
			<li class="flex flex-row bg-tidal-dark-highlight rounded-md">
				<button type="button" v-dark-ripple @click="deleteAllVisible = true" class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
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
			<button type="button" v-dark-ripple @click="settingsState = false" class="btn-app-dark outline-none">Chiudi</button>
		</div>

		<Modal :visible="logoutVisible" @close="logoutVisible = false">
			<template v-slot:content>
				<div class="sm:flex sm:items-start">
					<div class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-tidal-gold-highlight sm:mx-0 sm:h-10 sm:w-10">
						<UserRemoveIcon class="icon h-6 w-6 text-tidal-gold" />
					</div>
					<div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
						<h3 class="text-lg leading-6 font-medium text-white">Eseguire il logout?</h3>
						<div class="mt-2">
							<p class="text-sm text-gray-300">Non potrai riaggiungere prodotti finché non rieffettuerai il login.</p>
						</div>
					</div>
				</div>
			</template>
			<template v-slot:actions>
				<button
					type="button"
					v-dark-ripple
					@click="
						logout();
						logoutVisible = false;
					"
					class="btn-app-cyan w-full inline-flex justify-center rounded-md border border-transparent sm:ml-3 sm:w-auto sm:text-sm outline-none"
				>
					Esci
				</button>
				<button type="button" v-dark-ripple @click="deleteAllVisible = false" class="btn-app-dark mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
			</template>
		</Modal>

		<Modal :visible="deleteAllVisible" @close="deleteAllVisible = false">
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
						deleteAllVisible = false;
					"
					class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-tidal-cyan-highlight text-base font-medium text-tidal-cyan sm:ml-3 sm:w-auto sm:text-sm outline-none"
				>
					Elimina
				</button>
				<button type="button" v-dark-ripple @click="deleteAllVisible = false" class="mt-3 w-full inline-flex justify-center rounded-md shadow-sm px-4 py-2 bg-tidal-dark-300 text-base font-medium text-white sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm outline-none">Annulla</button>
			</template>
		</Modal>
	</Panel>

	<BottomBar @openPanel="mainState = true" @openList="listState = true" @openSettings="settingsState = true" />
</template>

<script setup>
	import { onMounted, reactive, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { DatePicker } from "v-calendar";
	import { MinusIcon, PlusIcon, SortAscendingIcon, SortDescendingIcon } from "@heroicons/vue/outline";
	import { UserIcon, UserAddIcon, UserRemoveIcon, TrashIcon, SelectorIcon, SunIcon, MoonIcon } from "@heroicons/vue/solid";
	import { store, login, logout, getProducts } from "@/store";

	const db = firebase.firestore();
	const datepickerVisible = ref(false);
	const deleteAllVisible = ref(false);
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
		settingsState.value = false;
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
	.container {
		@apply mx-auto max-w-sm px-3 sm:max-w-md;
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
			@apply text-tidal-cyan;
		}
	}
</style>