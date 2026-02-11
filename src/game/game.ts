import type { Entity } from "../engine/Entity.ts";
import { Tile } from "./Tile.ts";

/**
 * 初期ボード状態を作成（1,2,3,...,15の順序、空きマスは右下）
 */
export function createInitialBoard(): Tile[] {
	const tiles: Tile[] = [];

	let tileIndex = 1;
	for (let i = 0; i < 4; i++) {
		for (let j = 0; j < 4; j++) {
			if (i === 3 && j === 3) {
				continue;
			}
			tiles.push(new Tile(tileIndex, i, j));
			tileIndex++;
		}
	}

	return tiles;
}

/**
 * 移動可能なタイルを取得
 */
function getMovableTiles(tiles: Tile[]): Tile[] {
	const emptyPos = findEmptyPosition(tiles);
	if (emptyPos === undefined) {
		return [];
	}

	const adjacent: Tile[] = [];

	const adjacentPositions = [
		{ row: emptyPos.row - 1, col: emptyPos.col },
		{ row: emptyPos.row + 1, col: emptyPos.col },
		{ row: emptyPos.row, col: emptyPos.col - 1 },
		{ row: emptyPos.row, col: emptyPos.col + 1 },
	];

	for (const pos of adjacentPositions) {
		if (pos.row >= 0 && pos.row < 4 && pos.col >= 0 && pos.col < 4) {
			const tile = tiles.find((t) => t.row === pos.row && t.col === pos.col);
			if (tile !== undefined) {
				adjacent.push(tile);
			}
		}
	}

	return adjacent;
}

/**
 * 指定したタイルを空きマスへ移動（複数タイル対応）
 */
export function moveTile(
	entities: Entity[],
	tileValue: number,
	animationDuration: number = 200,
): boolean {
	const tiles = entities as Tile[];

	const targetTile = tiles.find((t) => t.value === tileValue);
	if (targetTile === undefined) {
		return false;
	}

	const emptyPos = findEmptyPosition(tiles);
	if (emptyPos === undefined) {
		return false;
	}

	const isSameRow = targetTile.row === emptyPos.row;
	const isSameCol = targetTile.col === emptyPos.col;

	if (!isSameRow && !isSameCol) {
		return false;
	}

	const tilesToMove: Tile[] = [];

	if (isSameRow) {
		const minCol = Math.min(targetTile.col, emptyPos.col);
		const maxCol = Math.max(targetTile.col, emptyPos.col);

		for (const tile of tiles) {
			if (
				tile.row === targetTile.row &&
				tile.col >= minCol &&
				tile.col <= maxCol
			) {
				tilesToMove.push(tile);
			}
		}
	} else {
		const minRow = Math.min(targetTile.row, emptyPos.row);
		const maxRow = Math.max(targetTile.row, emptyPos.row);

		for (const tile of tiles) {
			if (
				tile.col === targetTile.col &&
				tile.row >= minRow &&
				tile.row <= maxRow
			) {
				tilesToMove.push(tile);
			}
		}
	}

	const now = Date.now();

	for (const tile of tilesToMove) {
		tile.animationState = {
			fromRow: tile.row,
			fromCol: tile.col,
			startTime: now,
			endTime: now + animationDuration,
		};

		if (isSameRow) {
			tile.col += targetTile.col < emptyPos.col ? 1 : -1;
		} else {
			tile.row += targetTile.row < emptyPos.row ? 1 : -1;
		}
	}

	return true;
}

/**
 * 空きマスの位置を計算
 */
function findEmptyPosition(
	tiles: Tile[],
): { row: number; col: number } | undefined {
	const occupiedPositions = new Set<string>();
	for (const tile of tiles) {
		occupiedPositions.add(`${tile.row},${tile.col}`);
	}

	for (let row = 0; row < 4; row++) {
		for (let col = 0; col < 4; col++) {
			if (!occupiedPositions.has(`${row},${col}`)) {
				return { row, col };
			}
		}
	}

	return undefined;
}

/**
 * ボードをシャッフル
 */
export function shuffleBoard(tiles: Tile[], times: number): Tile[] {
	for (let i = 0; i < times; i++) {
		const movableTiles = getMovableTiles(tiles);
		const randomIndex = Math.floor(Math.random() * movableTiles.length);
		const selectedTile = movableTiles[randomIndex]!;

		moveTile(tiles, selectedTile.value, 0);
	}

	return tiles;
}
