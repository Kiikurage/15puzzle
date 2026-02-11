import type {
    HitTestContext,
    RenderContext,
    UpdateContext,
} from "../engine/Entity.ts";
import { Entity } from "../engine/Entity.ts";
import { Label } from "../engine/Label.ts";
import { ClearOverlay } from "./ClearOverlay.ts";
import { createInitialBoard, shuffleBoard } from "./game.ts";
import { Tile } from "./Tile.ts";

/**
 * 15パズルのゲームシーン
 * Tileを子Entityとして内包し、ゲーム状態を管理します
 */
export class GameScene extends Entity {
    private isCleared = false;
    private moveCount = 0;
    private moveCountLabel: Label;

    constructor() {
        super();
        this.moveCountLabel = new Label("Moves: 0", 10, 10, 40);
        this.addChild(this.moveCountLabel);
        this.initializeBoard();
    }

    /**
     * ボードを初期化する
     */
    private initializeBoard(): void {
        const tiles = shuffleBoard(createInitialBoard(), 100);
        for (const tile of tiles) {
            this.addChild(tile);
        }
    }

    /**
     * ゲームをリセットする
     */
    reset(): void {
        for (const child of this.getChildren().slice()) {
            this.removeChild(child);
        }
        this.isCleared = false;
        this.moveCount = 0;
        this.moveCountLabel = new Label("Moves: 0", 10, 10, 40);
        this.addChild(this.moveCountLabel);
        this.initializeBoard();
    }

    /**
     * クリア状態を取得する
     *
     * @returns クリアしていればtrue
     */
    getIsCleared(): boolean {
        return this.isCleared;
    }

    /**
     * 操作回数を取得する
     *
     * @returns 操作回数
     */
    getMoveCount(): number {
        return this.moveCount;
    }

    /**
     * 操作回数をインクリメントする
     */
    incrementMoveCount(): void {
        this.moveCount++;
        this.moveCountLabel.setText(`Moves: ${this.moveCount}`);
    }

    update(_context: UpdateContext): void {
        if (this.isCleared) {
            return;
        }

        const children = this.getDescendantsAs(Tile);

        for (const tile of children) {
            const expectedRow = Math.floor((tile.value - 1) / 4);
            const expectedCol = (tile.value - 1) % 4;

            if (tile.row !== expectedRow || tile.col !== expectedCol) {
                return;
            }
        }

        this.isCleared = true;
        this.addChild(new ClearOverlay());
    }

    render(_context: RenderContext): void {}

    hitTest(_context: HitTestContext): boolean {
        return false;
    }
}
