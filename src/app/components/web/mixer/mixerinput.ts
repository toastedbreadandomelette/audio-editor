import { audioManager } from '@/app/services/audio/audiotrackmanager';
import { KnobControlElement } from '../controls/knob';
import { Orientation, VolumeLevelsElement } from '../visual/volume_level';
import { SliderControlElement } from '../controls/slider';

export class MixerInputElement extends HTMLElement {
    volume = document.createElement('volume-level');
    knob = document.createElement('knob-control');
    slider = document.createElement('slider-control');
    label = document.createElement('label');
    span = document.createElement('span');
    idx = 0;
    // shadow = this.attachShadow({mode: 'open'});

    set index(index: number) {
        this.idx = index;
    }

    get index() {
        return this.idx;
    }

    constructor() {
        super();
    }

    static setDefaultVolumeLevelSettings(volume: VolumeLevelsElement, index: number) {
        volume.orientation = Orientation.Vertical;
        volume.mixer = index;
        volume.width = 7;
        volume.length = 160;
    }

    static setDefaultSettingsForKnob(knob: KnobControlElement, index: number) {
        knob.padding = 10;
        knob.r = 15;
        knob.onKnobChange = function(e) {
            audioManager.setPannerNodeForMixer(index, e);
        };
        knob.onKnobRelease = function(e) {
            audioManager.setPannerNodeForMixer(index, e);
        };
        knob.value = 0;
        knob.scrollD = 0.05;
    }

    static setDefaultSettingsForSlider(slider: SliderControlElement, index: number) {
        slider.h = 200;
        slider.w = 30;
        slider.padding = 20;
        slider.sliderHeight = 12;
        slider.sliderWidth = 30;
        slider.stroke = '#58AB6C';
        slider.value = 1;
        slider.onSliderChange = function(e: number) {
            audioManager.setGainNodeForMixer(index, e);
        };
        slider.onSliderRelease = function(e: number) {
            audioManager.setGainNodeForMixer(index, e);
        };
    }

    connectedCallback() {
        this.classList.add('p-2', 'bg-secondary', 'm-1', 'shadow-md', 'content-center', 'items-center', 'text-center', 'mb-4')
        MixerInputElement.setDefaultVolumeLevelSettings(this.volume, this.idx);
        this.appendChild(this.volume);

        MixerInputElement.setDefaultSettingsForKnob(this.knob, this.idx);
        const div = document.createElement('div');
        div.classList.add('panner-value', 'mb-6');
        div.appendChild(this.knob);
        const pannerSpan = document.createElement('span');
        pannerSpan.innerHTML = 'Pan';
        div.appendChild(pannerSpan);
        this.appendChild(div);

        MixerInputElement.setDefaultSettingsForSlider(this.slider, this.idx);
        const div2 = document.createElement('div');
        div2.classList.add('mb-6');
        div2.appendChild(this.slider);
        const pannerSpan2 = document.createElement('span');
        pannerSpan2.innerHTML = 'Vol';
        div2.appendChild(pannerSpan2);
        this.appendChild(div2);

        this.span.innerHTML = this.idx === 0 ? 'Master' : `Mixer ${this.idx}`;
        this.span.classList.add('text-nowrap', 'text-sm', 'select-none');
        this.appendChild(this.span);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'mixer-input': MixerInputElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'mixer-input': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<KnobControlElement> & {
                    index: number;
                };
            }
        }
    }
}
