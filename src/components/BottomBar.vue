<template>
	<nav class="navbar fixed-bottom navbar-expand-sm shadow-top z-10">
		<div class="container">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item">
					<button type="button" @click="emit('mainMenuOpen')" class="nav-link">
						<MenuIcon class="icon w-5 h-5 text-gray-600 dark:text-gray-50" />
					</button>
				</li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<button type="button" @click="emit('secondaryMenuOpen')" class="nav-link">
						<DotsVerticalIcon class="icon w-5 h-5 text-gray-600 dark:text-gray-50" />
					</button>
				</li>
			</ul>
		</div>
	</nav>

	<div class="absolute flex pointer-events-none w-full bottom-9 z-10">
		<button type="button" @click="emit('addProduct')" class="dark:bg-gray-800 bg-white w-12 h-12 rounded-full pointer-events-auto mx-auto border shadow-lg">
			<PlusIcon class="icon w-6 h-6 dark:text-gray-50 text-gray-900 mx-auto" />
		</button>
	</div>
</template>

<script setup>
	import { MenuIcon } from "@heroicons/vue/solid";
	import { PlusIcon } from "@heroicons/vue/solid";
	import { DotsVerticalIcon } from "@heroicons/vue/solid";
	import { defineEmits } from "vue";

	const emit = defineEmits(["mainMenuOpen, secondaryMenuOpen, addProduct"]);
</script>

<style scoped>
	.shadow-top {
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.75), 0 6px 6px rgba(0, 0, 0, 1);
	}
</style>