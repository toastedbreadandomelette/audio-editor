import { audioManager } from "@/app/services/audio/audiotrackmanager";
import { AudioTrackDetails } from "@/app/states/track_details";

export class AudioViewElement extends HTMLElement {
    // TODO: Check safety.
    track!: AudioTrackDetails;

    volumeKnob = document.createElement('knob-control');
    panner = document.createElement('knob-control');
    mixer = document.createElement('input');

    constructor() {
        super();
    }

    changeMixer() {
        const newMixerValue = parseInt(this.mixer.value);
        audioManager.setMixerValue(this.track.audioId, newMixerValue);
        audioManager.rescheduleAudioFromScheduledNodes(this.track.audioId);
    }

    onVolumeChange(e: number) {
        audioManager.setGainForAudio(this.track.audioId, e);
    }

    onPanChange(e: number) {
        audioManager.setPannerForAudio(this.track.audioId, e);
    }

    createMixerBar() {
        const div = document.createElement('div');
        div.classList.add('mixer-details', 'flex', 'flex-row', 'justify-end');

        const volumeSection = this.createKnobForVol();
        const panSection = this.createKnobForPan();
        const mixerInput = this.createInputContainer();
    }

    createMixerAssigner() {

    }

    createKnobForPan() {
        const volume = document.createElement('div');
        volume.classList.add('panner', 'm-2', 'min-w-20', 'text-center');

        const pannerKnob = this.volumeKnob;
        pannerKnob.value = 1;
        pannerKnob.scrollD = 0.01;
        pannerKnob.aParamControl = audioManager.getPannerParamForAudio(this.track.audioId).pan;
        pannerKnob.r = 15;
        const label = document.createElement('label');
        label.textContent = `Pan: ${Math.round(audioManager.getPannerForAudio(this.track.audioId) * 100) / 100}`;
        pannerKnob.onKnobChange = (e) => {
            this.onPanChange(e);
            label.textContent = `Pan: ${Math.round(e * 100) / 100}`;    
        };

        volume.appendChild(pannerKnob);
        volume.appendChild(label);
    }

    createKnobForVol() {
        const volume = document.createElement('div');
        volume.classList.add('volume', 'm-2', 'min-w-20', 'text-center');

        const volumeKnob = this.volumeKnob;
        volumeKnob.value = 1;
        volumeKnob.scrollD = 0.01;
        volumeKnob.aParamControl = audioManager.getGainParamForAudio(this.track.audioId).gain;
        volumeKnob.r = 15;
        const label = document.createElement('label');
        label.textContent = `Vol: ${audioManager.getGainForAudio(this.track.audioId)}`;
        volumeKnob.onKnobChange = (e) => {
            this.onVolumeChange(e);
            label.textContent = `Vol: ${e * 100}`;    
        };

        volume.appendChild(volumeKnob);
        volume.appendChild(label);
    }

    createInputContainer() {
        const mixerInputWrapper = document.createElement('div');
        mixerInputWrapper.classList.add('mixer-assign', 'm-2', 'min-w-20', 'text-center');
        mixerInputWrapper.classList.add('flex', 'flex-col', 'content-center');
        
        this.mixer.type = 'number';
        this.mixer.placeholder = '-';
        this.mixer.value = '-';
        this.mixer.classList.add('block', 'px-0', 'py-3', 'text-2xl', 'input', 'rounded-md');
        this.mixer.classList.add('bg-primary-2', 'w-18', 'text-center', '[&::-webkit-outer-spin-button]:appearance-none');
        this.mixer.classList.add('[&::-webkit-inner-spin-button]:appearance-none');
        this.mixer.min = '0';
        this.mixer.max = audioManager.totalMixers.toString();
        this.mixer.oninput = this.changeMixer.bind(this);

        mixerInputWrapper.appendChild(this.mixer);
        return mixerInputWrapper;
    }

    connectedCallback() {
        this.classList.add('flex', 'flex-col', 'justify-between', 'h-full', 'p-2');

    }
}
