export default defineAppConfig({
	ui: {
		colors: { primary: "slate", neutral: "zinc" },
		container: { base: "w-full max-w-[45rem] mx-auto px-4 sm:px-6 lg:px-8" },
		tabs: {
			compoundVariants: [
				{
					color: "primary",
					variant: "pill",
					class: {
						indicator: "bg-white dark:bg-(--ui-bg)",
						trigger: "data-[state=active]:text-gray-900 dark:data-[state=active]:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--ui-primary)",
					},
				},
			],
		},
	},
});
