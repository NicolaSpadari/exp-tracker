<template>
	<nav class="fixed bottom-0 bg-white dark:bg-gray-800 w-full shadow-top">
		<div class="container py-3">
			<div class="row justify-between">
				<div class="col-auto">
					<MenuIcon class="icon w-6 h-6 text-gray-900 dark:text-gray-50" />
				</div>
				<div class="col-auto">
					<DotsVerticalIcon class="icon w-6 h-6 text-gray-900 dark:text-gray-50" />
				</div>
			</div>
		</div>
	</nav>

	<div class="fixed flex pointer-events-none w-full bottom-8">
		<button type="button" @click="emit('pressed')" class="dark:bg-gray-800 bg-white w-14 h-14 rounded-full pointer-events-auto mx-auto border">
			<PlusIcon class="icon w-6 h-6 dark:text-gray-50 text-gray-900 mx-auto" />
		</button>
	</div>
</template>

<script setup>
	import { MenuIcon } from "@heroicons/vue/solid";
	import { PlusIcon } from "@heroicons/vue/solid";
	import { DotsVerticalIcon } from "@heroicons/vue/solid";
	import { defineEmits } from "vue";

	const emit = defineEmits(["pressed"]);
</script>

<style scoped>
	.shadow-top {
		box-shadow: 0 10px 20px rgba(0, 0, 0, 0.75), 0 6px 6px rgba(0, 0, 0, 1);
	}
</style>