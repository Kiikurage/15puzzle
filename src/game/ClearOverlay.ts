import type {
	ClickContext,
	HitTestContext,
	RenderContext,
	UpdateContext,
} from "../engine/Entity";
import { Entity } from "../engine/Entity";
import {
	BUFFER_HEIGHT,
	BUFFER_WIDTH,
	PARTICLE_COLORS,
	PARTICLE_COUNT,
	PARTICLE_SIZE,
} from "./constants";
import { GameScene } from "./GameScene";
import { TextButton } from "./TextButton";

interface Particle {
	x: number;
	y: number;
	vx: number;
	vy: number;
	color: string;
}

/**
 * クリア画面のオーバーレイ
 * 画面全体を覆う半透明の黒色で、中央に「CLEAR」と表示します
 */
export class ClearOverlay extends Entity {
	private particles: Particle[] = [];

	constructor() {
		super();
		this.initializeParticles();

		const retryButton = new TextButton(
			"RETRY",
			BUFFER_WIDTH / 2 - 150,
			BUFFER_HEIGHT / 2 + 100,
			300,
			150,
			(_context) => {
				const gameScene = this.getAncestorAs(GameScene);
				if (gameScene !== undefined) {
					gameScene.reset();
				}
			},
		);
		this.addChild(retryButton);
	}

	/**
	 * パーティクルを初期化する
	 */
	private initializeParticles(): void {
		for (let i = 0; i < PARTICLE_COUNT; i++) {
			this.particles.push({
				x: Math.random() * BUFFER_WIDTH,
				y: Math.random() * BUFFER_HEIGHT - BUFFER_HEIGHT,
				vx: (Math.random() - 0.5) * 200,
				vy: Math.random() * 200 + 200,
				color: PARTICLE_COLORS[
					Math.floor(Math.random() * PARTICLE_COLORS.length)
				] as string,
			});
		}
	}

	/**
	 * エンティティの状態を更新する
	 */
	update(context: UpdateContext): void {
		const deltaSeconds = context.elapsedTime / 1000;
		for (const particle of this.particles) {
			particle.x += particle.vx * deltaSeconds;
			particle.y += particle.vy * deltaSeconds;
		}
	}

	/**
	 * エンティティをCanvasに描画する
	 */
	render(context: RenderContext): void {
		// 画面全体を半透明黒で覆う
		context.ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
		context.ctx.fillRect(0, 0, BUFFER_WIDTH, BUFFER_HEIGHT);

		// 中央に「CLEAR」と表示
		context.ctx.fillStyle = "#FFFFFF";
		context.ctx.font = "bold 120px Arial";
		context.ctx.textAlign = "center";
		context.ctx.textBaseline = "middle";
		context.ctx.fillText("CLEAR", BUFFER_WIDTH / 2, BUFFER_HEIGHT / 2);

		// 紙吹雪パーティクルを描画
		for (const particle of this.particles) {
			context.ctx.fillStyle = particle.color;
			context.ctx.fillRect(
				particle.x,
				particle.y,
				PARTICLE_SIZE,
				PARTICLE_SIZE,
			);
		}
	}

	/**
	 * ヒットテスト（クリア画面にはヒット判定がない）
	 */
	hitTest(_context: HitTestContext): boolean {
		return false;
	}

	/**
	 * クリック処理（クリア画面はクリック不可）
	 */
	override onClick(_context: ClickContext): void {
		// クリック不可
	}
}
