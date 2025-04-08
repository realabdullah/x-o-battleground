<script setup lang="ts">
	import { motion } from "motion-v";

	defineProps<{ value: string | null; disabled: boolean }>();
	defineEmits<(event: "move") => void>();
</script>

<template>
	<motion.div
		:while-press="{ scale: 0.8 }"
		class="rounded-md w-[100px] h-[100px] flex items-center justify-center text-4xl font-bold gap-2 shadow-inner border border-gray-200 dark:border-gray-700 text-gray-800 dark:text-gray-100"
		:class="[disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'cursor-pointer hover:bg-gray-50 dark:hover:from-gray-700 dark:hover:to-gray-600']"
		@click="disabled ? null : $emit('move')"
	>
		{{ value }}
	</motion.div>
</template>
