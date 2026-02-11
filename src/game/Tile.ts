import type {
    ClickContext,
    HitTestContext,
    RenderContext,
    UpdateContext,
} from "../engine/Entity.ts";
import { Entity } from "../engine/Entity.ts";
import {
    CELL_SIZE,
    canvasToWorldX,
    canvasToWorldY,
    SOUND_KEY_MOVE,
    worldToCanvasX,
    worldToCanvasY,
} from "./constants";
import { GameScene } from "./GameScene.ts";
import { moveTile } from "./game.ts";

/**
 * タイルのアニメーション状態
 */
interface AnimationState {
    fromRow: number;
    fromCol: number;
    startTime: number;
    endTime: number;
}

/**
 * タイルクラス
 */
export class Tile extends Entity {
    value: number;
    row: number;
    col: number;
    animationState?: AnimationState;

    constructor(value: number, row: number, col: number) {
        super();
        this.value = value;
        this.row = row;
        this.col = col;
        this.animationState = undefined;
    }

    /**
     * 毎フレーム呼び出される更新関数
     */
    update(context: UpdateContext): void {
        if (this.animationState !== undefined) {
            if (context.now >= this.animationState.endTime) {
                this.animationState = undefined;
            }
        }
    }

    /**
     * 描画関数
     */
    render(context: RenderContext): void {
        let displayX = worldToCanvasX(this.col);
        let displayY = worldToCanvasY(this.row);

        if (this.animationState !== undefined) {
            const progress = Math.min(
                1,
                Math.max(
                    0,
                    (context.now - this.animationState.startTime) /
                        (this.animationState.endTime -
                            this.animationState.startTime),
                ),
            );

            const fromX = worldToCanvasX(this.animationState.fromCol);
            const toX = worldToCanvasX(this.col);
            const fromY = worldToCanvasY(this.animationState.fromRow);
            const toY = worldToCanvasY(this.row);

            displayX = fromX + (toX - fromX) * progress;
            displayY = fromY + (toY - fromY) * progress;
        }

        context.ctx.fillStyle = "#4CAF50";
        context.ctx.fillRect(displayX, displayY, CELL_SIZE, CELL_SIZE);

        context.ctx.strokeStyle = "#000000";
        context.ctx.lineWidth = 2;
        context.ctx.strokeRect(displayX, displayY, CELL_SIZE, CELL_SIZE);

        context.ctx.fillStyle = "#FFFFFF";
        context.ctx.font = `bold ${CELL_SIZE * 0.4}px Arial`;
        context.ctx.textAlign = "center";
        context.ctx.textBaseline = "middle";
        context.ctx.fillText(
            String(this.value),
            displayX + CELL_SIZE / 2,
            displayY + CELL_SIZE / 2,
        );
    }

    /**
     * 指定した座標がこのタイルとヒットするかテストする
     */
    hitTest(context: HitTestContext): boolean {
        const col = Math.floor(canvasToWorldX(context.canvasX));
        const row = Math.floor(canvasToWorldY(context.canvasY));

        return this.row === row && this.col === col;
    }

    /**
     * このタイルがクリックされたときの処理
     */
    override onClick(context: ClickContext): void {
        const scene = this.getAncestorAs(GameScene);
        if (scene === undefined || scene.getIsCleared()) {
            return;
        }

        const value = this.value;

        context.game.request((entities) => {
            const tiles: Tile[] = [];
            const queue = [...entities];
            while (queue.length > 0) {
                const entity = queue.shift()!;
                if (entity instanceof Tile) {
                    tiles.push(entity);
                }
                queue.push(...entity.getChildren());
            }
            const moved = moveTile(tiles, value);
            if (moved) {
                context.game.getAudioManager().playSound(SOUND_KEY_MOVE);
                scene.incrementMoveCount();
            }
        });
    }
}
