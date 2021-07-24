<template>
	<div class="pt-5">
		<div class="overflow-y-auto max-h-[75vh]">
			<div class="container">
				<div class="card-row space-x-2 mb-4">
					<div class="autofit-col autofit-col-gutters">
						<div class="w-6 h-6"></div>
					</div>
					<div class="autofit-col autofit-col-gutters autofit-col-expand">
						<p class="font-heading text-3xl text-white">I tuoi prodotti</p>
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
					<input type="date" v-model="product.date" :min="moment(new Date()).format('YYYY-MM-DD')" id="product-date" class="bg-tidal-dark-300 mt-1 block w-full shadow-sm sm:text-sm text-white rounded-md outline-none p-2" />
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

		<div class="flex justify-center space-x-4 mt-4">
			<button type="button" v-dark-ripple @click="mainState = false" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
			<button type="button" v-dark-ripple @click="addDoc()" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-tidal-cyan bg-tidal-cyan-highlight outline-none" :class="{ 'opacity-40': product.name == '' || product.date == null }" :disabled="product.name == '' || product.date == null">Aggiungi</button>
		</div>
	</Panel>

	<Panel :id="'settings'" :visible="settingsState" @close="settingsState = false">
		<div class="space-y-6 mt-3">
			<button type="button" v-gold-ripple @click="modalVisible = true" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-3 outline-none">
				<div class="autofit-col autofit-col-gutters pr-0 pl-3">
					<div class="grid content-center w-full h-full">
						<TrashIcon class="icon w-6 h-6 text-tidal-gold mx-auto" />
					</div>
				</div>
				<div class="autofit-col autofit-col-gutters autofit-col-expand">
					<p class="flex text-white font-heading space-x-1">Elimina tutto</p>
				</div>
			</button>
		</div>
		<div class="flex justify-center space-x-4 mt-4">
			<button type="button" v-dark-ripple @click="settingsState = false" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
		</div>

		<teleport to="body">
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
										<h3 class="text-lg leading-6 font-medium text-white">Eliminare tutti i prodotti?</h3>
										<div class="mt-2">
											<p class="text-sm text-gray-300">Questa azione non può essere interrotta. Vuoi procedere?</p>
										</div>
									</div>
								</div>
							</div>
							<div class="bg-tidal-dark-200 px-4 py-3 justify-center sm:px-6 sm:flex sm:flex-row-reverse">
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
							</div>
						</div>
					</div>
				</div>
			</transition>
		</teleport>
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
				<button type="button" v-dark-ripple class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-3 outline-none">
					<div class="autofit-col autofit-col-gutters pr-0 pl-3">
						<div class="grid content-center w-full h-full">
							<img :src="store.userPicture" class="w-6 h-6 rounded-full" />
						</div>
					</div>
					<div class="autofit-col autofit-col-gutters autofit-col-expand">
						<p class="flex text-white font-heading space-x-1 text-left">Sei autenticato come {{ store.userName }}</p>
					</div>
				</button>
				<button type="button" v-gold-ripple @click="logout()" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-3 outline-none">
					<div class="autofit-col autofit-col-gutters pr-0 pl-3">
						<div class="grid content-center w-full h-full">
							<UserRemoveIcon class="icon w-6 h-6 text-tidal-gold mx-auto" />
						</div>
					</div>
					<div class="autofit-col autofit-col-gutters autofit-col-expand">
						<p class="flex text-white font-heading space-x-1">Esci</p>
					</div>
				</button>
			</template>

			<div class="flex justify-center space-x-4 mt-4">
				<button type="button" v-dark-ripple @click="listState = false" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
			</div>
		</div>
	</Panel>

	<BottomBar @openPanel="mainState = true" @mainMenuOpen="listState = true" @secondaryMenuOpen="settingsState = true" />
</template>

<script setup>
	import { reactive, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { MinusIcon, PlusIcon } from "@heroicons/vue/outline";
	import { UserIcon, UserAddIcon, UserRemoveIcon, TrashIcon } from "@heroicons/vue/solid";
	import { store, login, logout, getProducts } from "@/store";

	const db = firebase.firestore();
	const modalVisible = ref(false);
	const mainState = ref(false);
	const listState = ref(false);
	const settingsState = ref(false);

	const product = reactive({
		name: "",
		picture: "",
		date: null,
		quantity: 1,
	});

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
</style>