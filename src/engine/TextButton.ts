import type {
    ClickContext,
    HitTestContext,
    RenderContext,
    UpdateContext,
} from "./Entity.ts";
import { Entity } from "./Entity.ts";

/**
 * テキストボタンエンティティ
 */
export class TextButton extends Entity {
    private text: string;
    private x: number;
    private y: number;
    private width: number;
    private height: number;
    private onClickCallback: (context: ClickContext) => void;

    constructor(
        text: string,
        x: number,
        y: number,
        width: number,
        height: number,
        onClickCallback: (context: ClickContext) => void,
    ) {
        super();
        this.text = text;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.onClickCallback = onClickCallback;
    }

    /**
     * エンティティの状態を更新する
     */
    update(_context: UpdateContext): void {
        // ボタンは静止状態
    }

    /**
     * エンティティをCanvasに描画する
     */
    render(context: RenderContext): void {
        context.ctx.fillStyle = "#333333";
        context.ctx.fillRect(this.x, this.y, this.width, this.height);

        context.ctx.fillStyle = "#FFFFFF";
        context.ctx.font = "48px Arial";
        context.ctx.textAlign = "center";
        context.ctx.textBaseline = "middle";
        context.ctx.fillText(
            this.text,
            this.x + this.width / 2,
            this.y + this.height / 2,
        );
    }

    /**
     * ヒットテスト
     */
    hitTest(context: HitTestContext): boolean {
        return (
            context.canvasX >= this.x &&
            context.canvasX < this.x + this.width &&
            context.canvasY >= this.y &&
            context.canvasY < this.y + this.height
        );
    }

    /**
     * クリック処理
     */
    override onClick(context: ClickContext): void {
        this.onClickCallback(context);
    }
}
