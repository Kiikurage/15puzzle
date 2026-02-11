import { CELL_SIZE, OFFSET_X, OFFSET_Y } from "../game/constants";
import type { Entity, RenderContext } from "./Entity";
import {
    type CanvasCoordinates,
    Renderer,
    type RendererContext,
} from "./Renderer";

/**
 * Canvas 2D Context を使用したレンダラー実装
 *
 * Canvas上にゲーム画面を描画します。
 * グリッドの描画、背景の塗りつぶし、エンティティの描画を担当します。
 */
export class Canvas2DRenderer extends Renderer {
    private readonly ctx: CanvasRenderingContext2D;
    private readonly canvas: HTMLCanvasElement;
    canvasWidth: number;
    canvasHeight: number;
    private displayWidth: number;
    private displayHeight: number;

    constructor(
        canvas: HTMLCanvasElement,
        bufferWidth: number,
        bufferHeight: number,
    ) {
        super();
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;
        this.canvasWidth = bufferWidth;
        this.canvasHeight = bufferHeight;
        this.displayWidth = bufferWidth;
        this.displayHeight = bufferHeight;
        this.updateCanvasSize();
    }

    updateCanvasSize(): void {
        const windowAspect = window.innerWidth / window.innerHeight;
        const bufferAspect = this.canvasWidth / this.canvasHeight;

        if (windowAspect > bufferAspect) {
            this.displayHeight = window.innerHeight;
            this.displayWidth = this.displayHeight * bufferAspect;
        } else {
            this.displayWidth = window.innerWidth;
            this.displayHeight = this.displayWidth / bufferAspect;
        }

        this.canvas.width = this.canvasWidth;
        this.canvas.height = this.canvasHeight;

        this.canvas.style.width = `${this.displayWidth}px`;
        this.canvas.style.height = `${this.displayHeight}px`;
    }

    screenToCanvasCoordinates(
        screenX: number,
        screenY: number,
    ): CanvasCoordinates {
        const bufferX = screenX * (this.canvasWidth / this.displayWidth);
        const bufferY = screenY * (this.canvasHeight / this.displayHeight);

        return {
            screenX: bufferX,
            screenY: bufferY,
        };
    }

    render(context: RendererContext, entities: Entity[]): void {
        this.renderBackground();
        this.renderGrid(context);
        this.renderEntities(context, entities);
    }

    private renderBackground(): void {
        this.ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
    }

    private renderGrid(_context: RendererContext): void {
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 4; col++) {
                const x = OFFSET_X + col * CELL_SIZE;
                const y = OFFSET_Y + row * CELL_SIZE;

                this.ctx.fillStyle = "#222222";
                this.ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);

                this.ctx.strokeStyle = "#444444";
                this.ctx.lineWidth = 1;
                this.ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }

    private renderEntities(context: RendererContext, entities: Entity[]): void {
        const renderContext: RenderContext = {
            ctx: this.ctx,
            now: context.now,
        };
        for (const entity of entities) {
            entity.render(renderContext);
        }
    }
}
