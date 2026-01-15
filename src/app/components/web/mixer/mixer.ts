import { audioManager } from '@/app/services/audio/audiotrackmanager';

export class MixerElement extends HTMLElement {
    masterBlock = document.createElement('div');
    mixersBlock = document.createElement('div');
    total = 0;

    set mixerCount(mixerCount: number) {
        this.total = mixerCount;
    }

    get mixerCount() {
        return this.mixerCount;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        // this.masterMixer
    }
}
