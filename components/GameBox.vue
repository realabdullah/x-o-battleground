<script setup lang="ts">
	import type { IGame } from "~/types";

	const props = defineProps<{ count: number; game: IGame }>();
	defineEmits<(event: "move", value: number) => void>();

	const isDisabled = computed(() => ["waiting", "finished"].includes(props.game.status));
</script>

<template>
	<div class="space-y-3">
		<div class="flex items-center justify-center gap-2" :class="[{ 'text-amber-600': count < 2 }, { 'text-blue-600': game.status === 'finished' }]">
			<template v-if="count < 2">
				<UIcon name="i-lucide-clock" class="h-5 w-5" />
				<span>Waiting for players ({{ count }}/2)</span>
			</template>

			<template v-else-if="game.status === 'finished'">
				<h3 class="tex-lg">🏆</h3>
				<span class="font-bold">{{ game.winner }} won this round!</span>
			</template>
		</div>

		<div class="w-fit mx-auto grid grid-cols-3 gap-2">
			<XOBox v-for="(box, index) in game.board" :key="`box-${index}`" :value="box" :disabled="isDisabled" @move="$emit('move', index)" />
		</div>
	</div>
</template>
