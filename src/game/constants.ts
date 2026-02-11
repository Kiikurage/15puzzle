/**
 * ゲーム定数
 */

// ワールド座標系（ゲームロジック用）
export const GRID_SIZE = 4; // 4x4グリッド

// キャンバスサイズ
export const BUFFER_WIDTH = 1000;
export const BUFFER_HEIGHT = 1000;

// クリアオーバーレイのパーティクル設定
export const PARTICLE_COUNT = 200;
export const PARTICLE_SIZE = 12;
export const PARTICLE_COLORS = [
	"#FF0000", // 赤
	"#FFFF00", // 黄
	"#00FF00", // 緑
	"#0000FF", // 青
	"#FF69B4", // ピンク
	"#00FFFF", // 水色
	"#800080", // 紫
];

// キャンバス座標系の計算
const BOARD_SCALE = 0.8;
const boardSize = Math.min(BUFFER_WIDTH, BUFFER_HEIGHT) * BOARD_SCALE;
export const CELL_SIZE = boardSize / GRID_SIZE; // ピクセル単位
export const OFFSET_X = (BUFFER_WIDTH - boardSize) / 2;
export const OFFSET_Y = (BUFFER_HEIGHT - boardSize) / 2;

/**
 * ワールド座標（0-3）をキャンバス座標（ピクセル）に変換する
 */
export function worldToCanvasX(worldX: number): number {
	return OFFSET_X + worldX * CELL_SIZE;
}

/**
 * ワールド座標（0-3）をキャンバス座標（ピクセル）に変換する
 */
export function worldToCanvasY(worldY: number): number {
	return OFFSET_Y + worldY * CELL_SIZE;
}

/**
 * キャンバス座標（ピクセル）をワールド座標（0-3）に変換する
 */
export function canvasToWorldX(canvasX: number): number {
	return (canvasX - OFFSET_X) / CELL_SIZE;
}

/**
 * キャンバス座標（ピクセル）をワールド座標（0-3）に変換する
 */
export function canvasToWorldY(canvasY: number): number {
	return (canvasY - OFFSET_Y) / CELL_SIZE;
}
