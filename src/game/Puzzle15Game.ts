import { AudioManager } from "../engine/AudioManager.ts";
import { Canvas2DRenderer } from "../engine/Canvas2DRenderer.ts";
import { Game } from "../engine/Game.ts";
import { InputReceiver } from "../engine/InputReceiver.ts";
import SOUND_MOVE_URL from "../static/move.mp3";
import { BUFFER_HEIGHT, BUFFER_WIDTH, SOUND_KEY_MOVE } from "./constants.ts";
import { GameScene } from "./GameScene.ts";

/**
 * 15パズル専用ゲームクラス
 * Game基底クラスを継承し、15パズル固有の初期化処理を行います
 */
export class Puzzle15Game extends Game {
    private readonly scene: GameScene;

    constructor(canvasId: string) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        const renderer = new Canvas2DRenderer(
            canvas,
            BUFFER_WIDTH,
            BUFFER_HEIGHT,
        );
        const inputReceiver = new InputReceiver(canvas);
        const audioManager = new AudioManager();
        super(canvasId, renderer, inputReceiver, audioManager);

        audioManager.loadSound(SOUND_KEY_MOVE, SOUND_MOVE_URL);

        this.scene = new GameScene();
        this.addEntity(this.scene);
    }

    override getAudioManager(): AudioManager {
        return this.audioManager;
    }
}
