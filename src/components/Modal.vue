<template>
	<teleport to="body">
		<transition name="fade">
			<div v-if="visible" class="fixed z-10 inset-0 overflow-y-auto z-15" role="dialog">
				<div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
					<div @click="emit('close')" class="fixed inset-0 bg-tidal-dark-200/75 transition-opacity"></div>
					<span class="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
					<div class="inline-block align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
						<div class="bg-tidal-dark-300 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
							<slot name="content"></slot>
						</div>

						<div class="bg-tidal-dark-200 px-4 py-3 justify-center sm:px-6 sm:flex sm:flex-row-reverse">
							<slot name="actions"></slot>
						</div>
					</div>
				</div>
			</div>
		</transition>
	</teleport>
</template>

<script setup>
	import { defineProps, defineEmits } from "vue";

	const props = defineProps({
		visible: {
			type: Boolean,
			required: true,
		},
	});

	const emit = defineEmits(["close"]);
</script>