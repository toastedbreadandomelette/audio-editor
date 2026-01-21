import { audioManager } from "@/app/services/audio/audiotrackmanager";
import { Status } from "@/app/state/trackdetails/trackdetails";
import { Orientation } from "../visual/volume_level";

export class PlayerElement extends HTMLElement {
    masterVolume = 1;
    playerRunButton = document.createElement('span');
    stat: Status = Status.Pause;

    constructor() {
        super();
    }

    get status() {
        return this.stat;
    }

    set status(stat: Status) {
        this.stat = stat;
    }

    knobInit() {
        const knob = document.createElement('knob-control')
        knob.r = 14;
        knob.pd = 8;
        knob.scrollD = 0.02;
        knob.val = 1;
        knob.onKnobChange = (value) => {
            audioManager.setGainNodeForMaster(value);
        };
        return knob;
    }

    // Currently, let player.tsx handle it.
    onPauseOrPlay() {
        // dispatch
    }

    connectedCallback() {
        this.classList.add('flex', 'justify-center', 'items-center', 'flex-row');
        this.classList.add('min-h-[8dvh]', 'bg-darker', 'shadow-lg');

        const knobWrapper = document.createElement('div');
        const knob = this.knobInit();
        knobWrapper.classList.add('volume', 'px-6', 'text-center', 'text-xs');

        knobWrapper.appendChild(knob);
        const textWrapper = document.createElement('div');
        textWrapper.textContent = Math.round(this.masterVolume).toString();
        knobWrapper.appendChild(textWrapper);

        this.appendChild(knobWrapper);

        const timer = document.createElement('timer-tempo');
        this.appendChild(timer);

        this.playerRunButton.classList.add('ml-2', 'pause', 'play', 'bg-secondary');
        this.playerRunButton.classList.add('rounded-md', 'cursor-pointer');
        this.playerRunButton.addEventListener('click', this.onPauseOrPlay.bind(this));
        this.createPauseOrPlay();

        this.appendChild(this.playerRunButton);

        const volumeWrapper = document.createElement('div');
        const volLevel = document.createElement('volume-level');
        volLevel.orientation = Orientation.Horizontal;
        volumeWrapper.appendChild(volLevel);

        this.appendChild(volumeWrapper);

        const mixerWrapper = document.createElement('div');
        mixerWrapper.classList.add('views', 'flex', 'ml-4');
        const button = document.createElement('button');
        button.classList.add('border', 'border-solid', 'border-slate-600', 'rounded-sm');
        button.classList.add('hover:bg-slate-600', 'active:bg-slate-800');
        const mixerIcon = document.createElement('mixer-icon');
        mixerIcon.w = 40;
        mixerIcon.h = 40;
        mixerIcon.s = 'rgb(100 116 139)';
        button.appendChild(mixerIcon);
        mixerWrapper.appendChild(button);
        
        this.appendChild(mixerWrapper);
    }

    createPauseOrPlay() {
        if (this.playerRunButton.children[0]) {
            this.playerRunButton.children[0].remove();
        }

        if (this.stat === Status.Pause) {
            const play = document.createElement('play-icon');
            play.w = 25;
            play.h = 25;
            play.f = '#51DE56';
            play.s = '#61E361';
            this.playerRunButton.children[0] = play;
        } else {
            const pause = document.createElement('pause-icon');
            pause.w = 25;
            pause.h = 25;
            pause.f = '#D1D256';
            pause.s = '#E1E361';
            this.playerRunButton.children[0] = pause;
        }
    }
}
