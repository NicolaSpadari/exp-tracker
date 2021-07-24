<template>
	<v-cupertino :id="props.id" :key="props.renderKey" :drawerOptions="panelOptions" :isPresent="props.visible" @did-dismiss="emit('close')" @backdrop-tap="emit('close')">
		<div class="container mt-2">
			<div class="p-4">
				<slot></slot>
			</div>
		</div>
	</v-cupertino>
</template>

<script setup>
	import { defineProps, defineEmits } from "vue";
	import VCupertino from "v-cupertino";

	const props = defineProps({
		id: {
			type: String,
			required: true,
		},
		renderKey: {
			type: Boolean,
			required: false,
		},
		visible: {
			type: Boolean,
			required: false,
		},
		callback: {
			type: Boolean,
			required: false,
		},
	});

	const emit = defineEmits(["close"]);

	const panelOptions = {
		backdrop: true,
		backdropOpacity: 0.75,
		bottomClose: true,
		buttonDestroy: false,
		fitScreenHeight: false,
		fitHeight: true,
	};
</script>

<style lang="scss">
	.cupertino-pane-wrapper {
		.move {
			@apply bg-tidal-gold h-[4px] w-15 rounded-full my-2;
		}
		.pane {
			@apply bg-tidal-dark-200;
		}
	}
</style>