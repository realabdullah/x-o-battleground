import type { Options } from "canvas-confetti";
import confetti from "canvas-confetti";

export const useWinConfetti = () => {
	const duration: number = 15 * 1000;
	const animationEnd: number = Date.now() + duration;
	const defaults: Options = {
		startVelocity: 30,
		spread: 360,
		ticks: 60,
		zIndex: 0,
	};

	const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

	const interval: ReturnType<typeof setInterval> = setInterval(() => {
		const timeLeft: number = animationEnd - Date.now();

		if (timeLeft <= 0) {
			return clearInterval(interval);
		}

		const particleCount: number = 50 * (timeLeft / duration);

		const originLeft = {
			x: randomInRange(0.1, 0.3),
			y: Math.random() - 0.2,
		};

		const originRight = {
			x: randomInRange(0.7, 0.9),
			y: Math.random() - 0.2,
		};

		confetti({ ...defaults, particleCount, origin: originLeft });
		confetti({ ...defaults, particleCount, origin: originRight });
	}, 250);
};
