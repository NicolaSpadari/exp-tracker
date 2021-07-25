<template>
	<div class="fixed bottom-0 w-screen z-10">
		<nav class="flex flex-row">
			<div class="bottom-tab bg-tidal-dark-200 rounded-tr-[30px] flex justify-start">
				<button type="button" v-dark-ripple @click="emit('openList')" class="outline-none shadow-none px-2 pt-2">
					<MenuIcon class="transition-colors duration-300 icon w-5 h-5 text-white hover:text-tidal-dark-active" />
				</button>
			</div>
			<div class="curved bg-tidal-dark-200 w-15 h-[25px] mt-auto">
				<button v-if="store.signedIn" type="button" v-dark-ripple @click="emit('openPanel')" class="absolute inset-x-0 bottom-5 bg-tidal-cyan-highlight w-13 h-13 rounded-full pointer-events-auto mx-auto shadow-lg outline-none p-0">
					<PlusIcon class="icon w-6 h-6 dark:text-gray-50 text-tidal-cyan mx-auto" />
				</button>
				<button v-else type="button" class="absolute inset-x-0 bottom-5 bg-tidal-cyan-highlight w-13 h-13 rounded-full pointer-events-auto mx-auto shadow-lg outline-none p-0">
					<LockClosedIcon class="icon w-6 h-6 dark:text-gray-50 text-tidal-cyan mx-auto" />
				</button>
			</div>
			<div class="bottom-tab bg-tidal-dark-200 rounded-tl-[30px] flex justify-end">
				<button type="button" v-dark-ripple @click="emit('openSettings')" class="outline-none shadow-none px-2 pt-2">
					<DotsVerticalIcon class="transition-colors duration-300 icon w-5 h-5 text-white hover:text-tidal-dark-active" />
				</button>
			</div>
		</nav>
		<div class="bg-tidal-dark-200 h-[15px]"></div>
	</div>
</template>

<script setup>
	import { computed, defineEmits, ref } from "vue";
	import { MenuIcon, PlusIcon, DotsVerticalIcon } from "@heroicons/vue/solid";
	import { LockClosedIcon } from "@heroicons/vue/outline";
	import { store } from "@/store";

	const emit = defineEmits(["openList", "openSettings", "openPanel"]);
</script>

<style scoped>
	.curved {
		box-shadow: 0px 30px 0px 25px rgb(36, 37, 40);
		@apply bg-transparent rounded-bl-full rounded-br-full;
	}
	.bottom-tab {
		width: calc(50% - 1.875rem);
		@apply p-2;
	}
</style>