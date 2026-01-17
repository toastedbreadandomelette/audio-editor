import { animationBatcher } from '@/app/services/animationbatch';
import { audioManager } from '@/app/services/audio/audiotrackmanager';

export class TimerOrTempoElement extends HTMLElement {
    intervalId: symbol | null = null;

    constructor() {
        super();
    }

    render() {
        const time = audioManager.getTimestamp();
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        this.innerHTML = `${(minutes < 10 ? '0' : '') + minutes}:${(seconds < 10 ? '0' : '') + seconds}`;
    }

    connectedCallback() {
        this.classList.add('timer', 'bg-secondary', 'text-2xl', 'text-pretty', 'p-2', 'round-sm', 'min-w-28', 'text-center', 'select-none');
        this.innerHTML = '00:00';
        this.intervalId = animationBatcher.addAnimationHandler(
            this.render.bind(this)
        )
        animationBatcher.setAnimationFrameRate(this.intervalId, 30);
    }

    disconnectedCallback() {
        if (this.intervalId) {
            animationBatcher.removeAnimationHandler(this.intervalId);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'timer-tempo': TimerOrTempoElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'timer-tempo': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<TimerOrTempoElement>
            }
        }
    }
}