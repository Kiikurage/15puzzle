import type { Entity } from "./Entity";

/**
 * レンダリングコンテキスト
 * 描画に必要な情報を保持します
 */
export interface RendererContext {
    canvasWidth: number;
    canvasHeight: number;
    now: number;
}

/**
 * スクリーン座標をキャンバス座標に変換した結果
 */
export interface CanvasCoordinates {
    screenX: number;
    screenY: number;
}

/**
 * ゲーム画面のレンダリングを行う抽象クラス
 *
 * Canvas上への描画を責務とし、Game クラスから描画ロジックを分離します。
 */
export abstract class Renderer {
    abstract canvasWidth: number;
    abstract canvasHeight: number;

    /**
     * キャンバスサイズを更新する
     */
    abstract updateCanvasSize(): void;

    /**
     * スクリーン座標をキャンバス座標に変換する
     *
     * @param screenX - スクリーンのX座標
     * @param screenY - スクリーンのY座標
     * @returns キャンバス座標情報
     */
    abstract screenToCanvasCoordinates(
        screenX: number,
        screenY: number,
    ): CanvasCoordinates;

    /**
     * ゲーム画面全体をレンダリングする
     *
     * @param context - レンダリングコンテキスト
     * @param entities - 描画対象のエンティティ配列
     */
    abstract render(context: RendererContext, entities: Entity[]): void;
}
