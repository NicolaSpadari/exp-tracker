<template>
	<div @click="emit('close')" class="transition-all duration-300 ease-in-out bg-dark-900/40 fixed w-screen h-screen z-5 inset-0" :class="props.open ? 'opacity-100' : 'pointer-events-none opacity-0 '"></div>
	<div class="bg-tidal-dark-200 transition-all duration-300 ease-in-out absolute w-screen h-auto rounded-t-2xl z-15 shadow-top" :class="props.open ? 'bottom-0' : '-bottom-full'">
		<div class="pill h-[4px] w-15 rounded-full bg-tidal-gold-highlight mx-auto absolute inset-x-0 top-3"></div>
		<div class="container">
			<div class="px-4 py-5 sm:p-6">
				<div class="space-y-6 mt-3">
					<button type="button" class="bg-tidal-dark-highlight card-row space-x-2 rounded-md py-3 outline-none">
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
			</div>

			<div class="flex justify-center space-x-4 mb-4">
				<button type="button" @click="emit('close')" class="btn text-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-tidal-dark-300 outline-none">Chiudi</button>
			</div>
		</div>
	</div>
</template>

<script setup>
	import firebase from "@/firebase.config";
	import { defineProps, defineEmits, ref } from "vue";
	import moment from "moment/min/moment-with-locales";
	import { MinusIcon, PlusIcon } from "@heroicons/vue/outline";
	import { TrashIcon } from "@heroicons/vue/solid";

	const emit = defineEmits(["close"]);

	const props = defineProps({
		open: Boolean,
	});
</script>

<style scoped>
	.shadow-top {
		box-shadow: 0px -3px 5px 0px rgba(50, 50, 50, 0.25);
	}
</style>