import type { Options } from "canvas-confetti";
import confetti from "canvas-confetti";

export const useLoseConfetti = () => {
	const duration: number = 15 * 1000;
	const animationEnd: number = Date.now() + duration;
	const defaults: Options = {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
		shapes: [confetti.shapeFromText({ text: "😢", scalar: 4 })],
		scalar: 4,
	};

	const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

	const interval: ReturnType<typeof setInterval> = setInterval(() => {
		const timeLeft: number = animationEnd - Date.now();

		if (timeLeft <= 0) return clearInterval(interval);

		const particleCount: number = 5 * (timeLeft / duration);
		const originLeft = { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 };
		const originRight = { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 };

		confetti({ ...defaults, particleCount, origin: originLeft, flat: true });
		confetti({ ...defaults, particleCount, origin: originRight, flat: true });
	}, 250);
};
