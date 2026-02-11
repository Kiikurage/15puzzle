/**
 * WebAudio APIで音声リソースを管理するクラス
 */
export class AudioManager {
    private audioContext: AudioContext;
    private audioBuffers: Map<string, AudioBuffer>;

    constructor() {
        this.audioContext = new AudioContext();
        this.audioBuffers = new Map();
    }

    /**
     * 指定したキーで音声ファイルを読み込む
     */
    async loadSound(key: string, url: string): Promise<void> {
        try {
            const response = await fetch(url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer =
                await this.audioContext.decodeAudioData(arrayBuffer);
            this.audioBuffers.set(key, audioBuffer);
        } catch (error) {
            console.error(`Failed to load sound from ${url}:`, error);
        }
    }

    /**
     * 指定したキーの音声を再生
     */
    playSound(key: string): void {
        const audioBuffer = this.audioBuffers.get(key);
        if (audioBuffer === undefined) {
            return;
        }

        const source = this.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(this.audioContext.destination);
        source.start(0);
    }
}
