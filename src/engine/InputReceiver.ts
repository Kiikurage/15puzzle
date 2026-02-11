/**
 * 入力を受け取るクラス
 *
 * ゲーム画面への入力イベント（クリック等）を処理します。
 */
export class InputReceiver {
    private canvas: HTMLCanvasElement;
    private onClickCallback:
        | ((screenX: number, screenY: number) => void)
        | null = null;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.setupClickHandler();
    }

    private setupClickHandler(): void {
        this.canvas.addEventListener("click", (event) => {
            if (this.onClickCallback === null) {
                return;
            }
            const rect = this.canvas.getBoundingClientRect();
            const screenX = event.clientX - rect.left;
            const screenY = event.clientY - rect.top;
            this.onClickCallback(screenX, screenY);
        });
    }

    setClickCallback(
        callback: (screenX: number, screenY: number) => void,
    ): void {
        this.onClickCallback = callback;
    }
}
