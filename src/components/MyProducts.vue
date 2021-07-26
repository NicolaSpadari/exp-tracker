<template>
	<div v-if="store.signedIn" class="container">
		<template v-if="prods.length == 0">
			<img src="/empty.svg" class="w-[70%] mx-auto mt-5 mb-3 md:w-[400px]" />
			<p class="text-white text-center">Nessun prodotto nella lista.</p>
			<p class="text-white text-center">Inizia aggiungendo un prodotto col pulsante in basso</p>
		</template>
		<template v-else>
			<div class="flex flex-row mb-3">
				<div class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
					<div class="flex flex-col w-6 h-10 justify-center items-center"></div>
					<div class="flex-1">
						<p class="font-heading text-3xl text-white">I tuoi prodotti</p>
					</div>
				</div>
			</div>

			<swiper v-if="validProducts.length > 0" slidesPerView="auto" :resistanceRatio="0.6" :spaceBetween="15" direction="vertical">
				<swiper-slide v-for="product in validProducts" :key="product.id">
					<swiper :initialSlide="1" @slideChange="dismiss($event, product)">
						<swiper-slide />
						<swiper-slide>
							<div class="flex flex-row bg-tidal-dark-highlight rounded-md">
								<div v-dark-ripple class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
									<button
										type="button"
										@click="
											toDelete = product;
											removeQuantity(toDelete);
										"
										class="flex flex-col w-6 h-10 justify-center items-center"
									>
										<MinusCircleIcon class="mx-auto w-6 h-6 text-tidal-cyan" />
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
							</div>
						</swiper-slide>
						<swiper-slide />
					</swiper>
				</swiper-slide>
			</swiper>

			<template v-if="expiredProducts.length > 0">
				<div class="flex flex-row mb-3">
					<div class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
						<div class="flex-1">
							<p class="text-white font-heading">Prodotti scaduti ({{ expiredProducts.length }})</p>
						</div>
					</div>
				</div>
				<swiper slidesPerView="auto" :spaceBetween="15" direction="vertical" class="overflow-y-hidden">
					<swiper-slide v-for="product in expiredProducts" :key="product.id">
						<swiper :initialSlide="1" @slideChange="dismiss($event, product)">
							<swiper-slide />
							<swiper-slide>
								<div class="flex flex-row bg-tidal-dark-highlight rounded-md">
									<div v-dark-ripple class="outline-none select-none cursor-pointer flex flex-1 items-center space-x-3 py-2 px-3">
										<button type="button" @click="askDelete(product)" class="flex flex-col w-6 h-10 justify-center items-center">
											<TrashIcon class="mx-auto w-6 h-6 text-tidal-gold" />
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
								</div>
							</swiper-slide>
							<swiper-slide />
						</swiper>
					</swiper-slide>
				</swiper>
			</template>
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
				<button type="button" v-dark-ripple @click="deleteDoc(toDelete.id)" class="btn-app-cyan w-full inline-flex justify-center sm:ml-3 sm:w-auto sm:text-sm">Elimina</button>
				<button
					type="button"
					v-dark-ripple
					@click="
						toDelete = {};
						modalVisible = false;
					"
					class="btn-app-dark mt-3 w-full inline-flex justify-center sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
				>
					Annulla
				</button>
			</template>
		</Modal>
	</div>

	<div v-else class="container">
		<img src="/login.svg" class="w-[70%] mx-auto mt-5 mb-4 md:w-[400px]" />
		<p class="text-white text-center">Effettua il login col tuo account Google dal pulsante in basso a destra</p>
	</div>
</template>

<script setup>
	import { onMounted, computed, ref } from "vue";
	import firebase from "@/firebase.config";
	import moment from "moment/min/moment-with-locales";
	import { ExclamationIcon } from "@heroicons/vue/solid";
	import { MinusCircleIcon, TrashIcon } from "@heroicons/vue/outline";
	import { store, getProducts } from "@/store";
	import SwiperCore from "swiper";
	import { Swiper, SwiperSlide } from "swiper/vue";
	import "swiper/swiper.scss";

	const modalVisible = ref(false);
	const toDelete = ref({});
	const db = firebase.firestore();

	onMounted(() => {
		moment.locale("it");
	});

	const prods = computed(() => {
		const products = store.products;

		if (store.order == "date") {
			products.value = products.sort(function (a, b) {
				return new Date(a.date) - new Date(b.date);
			});
		} else if (store.order == "nameDesc") {
			products.value = products.sort(function (a, b) {
				return a.name.localeCompare(b.name);
			});
		} else if (store.order == "nameAsc") {
			products.value = products.sort(function (a, b) {
				return b.name.localeCompare(a.name);
			});
		}

		return products;
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

	const dismiss = (swiper, product) => {
		if (swiper.activeIndex != 1) {
			askDelete(product);
			swiper.slideTo(1);
		}
	};

	const removeQuantity = (obj) => {
		if (obj.quantity - 1 == 0) {
			askDelete(obj);
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