import { animationBatcher } from '@/app/services/animationbatch';
import { audioManager } from '@/app/services/audio/audiotrackmanager';
import { Status } from '@/app/state/trackdetails/trackdetails';

export class SeekerElement extends HTMLElement {
    animationId: symbol | null = null;

    stat: Status = Status.Pause;
    lineDist = 0;
    timePerBar = 0;
    loopEnd: (() => void) | null = null;
    
    get status() {
        return this.stat;
    }

    set status(stat: number) {
        this.stat = stat;

        if (!this.animationId) {
            return;
        }

        if (stat === Status.Play) {
            animationBatcher.resumeAnimation(this.animationId);
        } else {
            animationBatcher.suspendAnimation(this.animationId);
        }
    }

    get lineDistance() {
        return this.lineDist;
    }

    set lineDistance(lineDist: number) {
        this.lineDist = lineDist;
    }

    get timeBetweenLine() {
        return this.timePerBar;
    }

    set timeBetweenLine(timePerBar: number) {
        this.timePerBar = timePerBar;
    }

    set onLoopEnd(loopEnd: (() => void) | null) {
        this.loopEnd = loopEnd;
    }

    get onLoopEnd() {
        return this.loopEnd;
    }

    constructor() {
        super();
    }

    animateSeekbar() {
        const isLoopEnd = audioManager.updateTimestamp();

        if (isLoopEnd && this.loopEnd) {
            this.loopEnd();
        }

        const left = (this.lineDist / this.timePerBar) * audioManager.getTimestamp();
        this.style.transform = `translate(${Math.round(left)}px)`;
    }

    connectedCallback() {
        this.classList.add('seekbar-seek', 'absolute', 'z-[20]', 'bg-green-500', 'w-[2px]');
        this.style.height = 'calc(100% - 6px)';
        this.animationId = animationBatcher.addAnimationHandler(
            this.animateSeekbar.bind(this)
        );

        this.animateSeekbar();
        this.style.left = 0 + 'px';
    }

    disconnectedCallback() {
        if (this.animationId) {
            animationBatcher.removeAnimationHandler(this.animationId);
        }
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'c-seeker': SeekerElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'c-seeker': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<SeekerElement> & {
                    status: Status;
                    lineDistance: number;
                    timeBetweenLine: number;
                }
            }
        }
    }
}
