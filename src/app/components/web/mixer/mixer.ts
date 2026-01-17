import { audioManager } from '@/app/services/audio/audiotrackmanager';

export class MixerElement extends HTMLElement {
    masterBlock = document.createElement('div');
    mixersBlock = document.createElement('div');
    total = 0;

    set mixerCount(mixerCount: number) {
        this.total = mixerCount;
    }

    get mixerCount() {
        return this.total;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('flex');
        this.masterBlock.id = 'mixer-master';
        this.masterBlock.classList.add('mr-2', 'flex', 'flex-row', 'pr-2', 'border-r', 'border-darker');
        this.mixersBlock.id = 'mixer-block';
        this.mixersBlock.classList.add('flex', 'flex-row');

        const masterMixer = document.createElement('mixer-input');
        masterMixer.index = 0;
        this.masterBlock.appendChild(masterMixer);

        for (let index = 0; index < this.total; ++index) {
            const mixer = document.createElement('mixer-input');
            mixer.index = index + 1;
            this.mixersBlock.appendChild(mixer);
        }

        this.appendChild(this.masterBlock);
        this.appendChild(this.mixersBlock);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'c-mixer': MixerElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'c-mixer': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<MixerElement> & {
                    mixerCount: number;
                };
            }
        }
    }
}
