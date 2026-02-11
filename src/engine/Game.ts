import type { Entity, HitTestContext, UpdateContext } from "./Entity";
import type { InputReceiver } from "./InputReceiver";
import type { Renderer, RendererContext } from "./Renderer";

/**
 * 汎用ゲームエンジンの基底クラス
 * メインループ、エンティティ管理を行います
 */
export class Game {
	protected renderer: Renderer;
	protected inputReceiver: InputReceiver;
	protected entities: Entity[] = [];
	protected onUpdateCallbacks = new Set<() => void>();
	protected lastUpdateTime: number = Date.now();

	constructor(
		_canvasId: string,
		renderer: Renderer,
		inputReceiver: InputReceiver,
	) {
		this.renderer = renderer;
		this.inputReceiver = inputReceiver;
	}

	get canvasWidth(): number {
		return this.renderer.canvasWidth;
	}

	get canvasHeight(): number {
		return this.renderer.canvasHeight;
	}

	protected updateCanvasSize(): void {
		this.renderer.updateCanvasSize();
	}

	addEntity(entity: Entity): void {
		this.entities.push(entity);
	}

	request(system: (entities: Entity[]) => void): void {
		system(this.entities);
	}

	onUpdate(callback: () => void): void {
		this.onUpdateCallbacks.add(callback);
	}

	start(): void {
		const mainLoop = () => {
			const now = Date.now();

			this.update(now);
			this.render(now);

			requestAnimationFrame(mainLoop);
		};

		mainLoop();

		this.inputReceiver.setClickCallback((screenX, screenY) => {
			this.handleClick(screenX, screenY);
		});

		window.addEventListener("resize", () => {
			this.updateCanvasSize();
		});
	}

	update(now: number): void {
		const elapsedTime = now - this.lastUpdateTime;
		this.lastUpdateTime = now;
		const context: UpdateContext = { now, elapsedTime };
		const queue: Entity[] = [];

		for (const entity of this.entities) {
			queue.push(entity);
		}

		while (queue.length > 0) {
			const entity = queue.shift();
			if (entity === undefined) {
				break;
			}
			entity.update(context);

			for (const child of entity.getChildren()) {
				queue.push(child);
			}
		}

		for (const callback of this.onUpdateCallbacks) {
			callback();
		}
	}

	render(now: number): void {
		const rendererContext: RendererContext = {
			canvasWidth: this.canvasWidth,
			canvasHeight: this.canvasHeight,
			now,
		};

		const allEntities: Entity[] = [];
		const queue: Entity[] = [...this.entities];

		while (queue.length > 0) {
			const entity = queue.shift();
			if (entity === undefined) {
				break;
			}
			allEntities.push(entity!);

			for (const child of entity.getChildren()) {
				queue.push(child);
			}
		}

		this.renderer.render(rendererContext, allEntities);
	}

	private handleClick(screenX: number, screenY: number): void {
		const canvasCoordinates = this.renderer.screenToCanvasCoordinates(
			screenX,
			screenY,
		);

		const hitContext: HitTestContext = {
			canvasX: canvasCoordinates.screenX,
			canvasY: canvasCoordinates.screenY,
		};

		const allEntities: Entity[] = [];
		const queue: Entity[] = [...this.entities];

		while (queue.length > 0) {
			const entity = queue.shift();
			if (entity === undefined) {
				break;
			}
			allEntities.push(entity!);

			for (const child of entity.getChildren()) {
				queue.push(child);
			}
		}

		for (let i = allEntities.length - 1; i >= 0; i--) {
			if (allEntities[i]!.hitTest(hitContext)) {
				allEntities[i]!.onClick({ game: this });
				return;
			}
		}
	}
}
