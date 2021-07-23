<template>
	<nav class="navbar fixed-bottom bg-tidal-dark-200 shadow-top z-10">
		<div class="container">
			<ul class="navbar-nav mr-auto">
				<li class="nav-item">
					<button type="button" @click="emit('mainMenuOpen')" class="nav-link outline-none">
						<MenuIcon class="transition-colors duration-300 icon w-5 h-5 text-white hover:text-tidal-dark-active" />
					</button>
				</li>
			</ul>
			<ul class="navbar-nav ml-auto">
				<li class="nav-item">
					<button type="button" @click="emit('secondaryMenuOpen')" class="nav-link outline-none">
						<DotsVerticalIcon class="transition-colors duration-300 icon w-5 h-5 text-white hover:text-tidal-dark-active" />
					</button>
				</li>
			</ul>
		</div>
	</nav>

	<div class="absolute flex pointer-events-none w-full bottom-9 z-10">
		<button type="button" @click="emit('openPanel')" class="bg-tidal-cyan-highlight w-12 h-12 rounded-full pointer-events-auto mx-auto shadow-lg outline-none">
			<PlusIcon class="icon w-6 h-6 dark:text-gray-50 text-tidal-cyan mx-auto" />
		</button>
	</div>
</template>

<script setup>
	import { defineEmits } from "vue";
	import { MenuIcon, PlusIcon, DotsVerticalIcon } from "@heroicons/vue/solid";

	const emit = defineEmits(["mainMenuOpen", "secondaryMenuOpen", "openPanel"]);
</script>

<style scoped>
	.shadow-top {
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.75), 0 6px 6px rgba(0, 0, 0, 1);
	}
</style>