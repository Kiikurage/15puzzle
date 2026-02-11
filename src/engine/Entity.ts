import type { Game } from "./Game.ts";

/**
 * エンティティ更新用コンテキスト
 */
export interface UpdateContext {
	now: number;
	elapsedTime: number;
}

/**
 * エンティティ描画用コンテキスト
 */
export interface RenderContext {
	ctx: CanvasRenderingContext2D;
	now: number;
}

/**
 * エンティティヒットテスト用コンテキスト（キャンバス座標系）
 */
export interface HitTestContext {
	canvasX: number;
	canvasY: number;
}

/**
 * エンティティクリック処理用コンテキスト
 */
export interface ClickContext {
	game: Game;
}

/**
 * ゲーム内エンティティの基底クラス
 *
 * すべてのゲーム内オブジェクト（タイルなど）はこのクラスを継承します。
 * 毎フレーム状態を更新し、Canvas上に描画する責務を持つ抽象クラスです。
 * エンティティは論理的な親子関係を持つことができます。
 */
export abstract class Entity {
	private parent: Entity | undefined;
	private children: Entity[] = [];

	/**
	 * エンティティの状態を更新する
	 * メインループから毎フレーム呼び出されます
	 *
	 * @param context - 更新用コンテキスト
	 */
	abstract update(context: UpdateContext): void;

	/**
	 * エンティティをCanvasに描画する
	 * メインループから毎フレーム呼び出されます
	 *
	 * @param context - 描画用コンテキスト
	 */
	abstract render(context: RenderContext): void;

	/**
	 * 指定した座標がこのエンティティとヒットするかテストする
	 *
	 * @param context - ヒットテスト用コンテキスト
	 * @returns ヒットしていればtrue
	 */
	abstract hitTest(context: HitTestContext): boolean;

	/**
	 * このエンティティがクリックされたときの処理を実行する
	 *
	 * @param context - クリック処理用コンテキスト
	 */
	onClick(_context: ClickContext): void {}

	/**
	 * 親エンティティを設定する
	 *
	 * @param parent - 親エンティティ。undefinedの場合は親を解除
	 */
	setParent(parent: Entity | undefined): void {
		this.parent = parent;
	}

	/**
	 * 親エンティティを取得する
	 *
	 * @returns 親エンティティ
	 */
	getParent(): Entity | undefined {
		return this.parent;
	}

	/**
	 * 子エンティティを追加する
	 *
	 * @param child - 追加する子エンティティ
	 */
	addChild(child: Entity): void {
		child.setParent(this);
		this.children.push(child);
	}

	/**
	 * 子エンティティを削除する
	 *
	 * @param child - 削除する子エンティティ
	 */
	removeChild(child: Entity): void {
		const index = this.children.indexOf(child);
		if (index !== -1) {
			this.children.splice(index, 1);
			child.setParent(undefined);
		}
	}

	/**
	 * 子エンティティの一覧を取得する
	 *
	 * @returns 子エンティティの配列
	 */
	getChildren(): Entity[] {
		return this.children;
	}

	/**
	 * 指定された型の直近の祖先を取得する
	 *
	 * @param ctor - 探す型のコンストラクタ
	 * @returns 指定された型の直近の祖先、見つからない場合はundefined
	 */
	getAncestorAs<T extends Entity>(
		ctor: new (...args: unknown[]) => T,
	): T | undefined {
		let current = this.getParent();
		while (current !== undefined) {
			if (current instanceof ctor) {
				return current as T;
			}
			current = current.getParent();
		}
		return undefined;
	}
}
