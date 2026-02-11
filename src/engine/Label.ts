import type { HitTestContext, RenderContext, UpdateContext } from "./Entity.ts";
import { Entity } from "./Entity.ts";

/**
 * テキストラベルエンティティ
 */
export class Label extends Entity {
    private text: string;
    private x: number;
    private y: number;
    private fontSize: number;

    constructor(text: string, x: number, y: number, fontSize: number = 24) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
    }

    /**
     * テキストを更新する
     */
    setText(text: string): void {
        this.text = text;
    }

    /**
     * エンティティの状態を更新する
     */
    update(_context: UpdateContext): void {}

    /**
     * エンティティをCanvasに描画する
     */
    render(context: RenderContext): void {
        context.ctx.fillStyle = "#FFFFFF";
        context.ctx.font = `${this.fontSize}px Arial`;
        context.ctx.textAlign = "left";
        context.ctx.textBaseline = "top";
        context.ctx.fillText(this.text, this.x, this.y);
    }

    /**
     * ヒットテスト
     */
    hitTest(_context: HitTestContext): boolean {
        return false;
    }
}
