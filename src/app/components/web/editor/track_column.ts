import { ScheduledAudioTrack } from "@/app/state/trackdetails/trackdetails";
import { TrackInfoElement } from "../track_info";

export class TrackColumnElement extends HTMLElement {
    height = 0;
    tracks = 0;
    doms = 0;
    trackMat: Array<Array<ScheduledAudioTrack>> = [];

    set trackDetails(trackMat: Array<Array<ScheduledAudioTrack>>) {
        this.diffTracks(trackMat, trackMat.length - this.trackMat.length);
        this.trackMat = trackMat;
        this.tracks = this.trackMat.length;
    }

    get trackDetails() {
        return this.trackMat;
    }

    set h(height: number) {
        this.height = height;
        for (const child of this.children) {
            const childElement = child as HTMLDivElement;
            childElement.style.height = height + 'px';
        }
    }

    get h() {
        return this.height;
    }

    diffTracks(trackMat: Array<Array<ScheduledAudioTrack>>, diff: number) {
        if (diff > 0) {
            const totalTracks = this.tracks + diff;
            for (let index = this.tracks; index < totalTracks; ++index) {
                this.appendChild(this.createWrapper(index, trackMat[index].length));
            }
            for (let index = 0; index < this.tracks; ++index) {
                const trackInfo = this.children[index].children[0] as TrackInfoElement;
                trackInfo.entityCount = trackMat[index].length;
            }
        } else {
            let counter = -diff;
            while (counter > 0) {
                this.removeChild(this.children[this.children.length - 1]);
            }
            for (let index = 0; index < this.tracks + diff; ++index) {
                const trackInfo = this.children[index].children[0] as TrackInfoElement;
                trackInfo.entityCount = trackMat[index].length;
            }
        }
    }

    createWrapper(index: number, totalTracks: number) {
        const div = document.createElement('div');
        div.classList.add('track-info', 'bg-darker', 'box-border', 'border', 'border-solid');
        div.classList.add('border-darker-2', 'rounded-l-md', 'text-center');
        div.classList.add('content-center', 'items-center', 'min-w-44', 'max-w-44');

        div.style.height = this.height + 'px';
        const trackInfo = document.createElement('c-track-info');
        trackInfo.track = index;
        trackInfo.entityCount = totalTracks;
        div.appendChild(trackInfo);
        return div;
    }

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('track-list', 'custom-list', 'pb-2', 'relative', 'overflow-hidden');
        this.classList.add('h-full', 'max-h-full');

        for (let index = 0; index < this.trackMat.length; ++index) {
            const track = this.trackMat[index];
            const wrapper = this.createWrapper(index, track.length);
            this.appendChild(wrapper);
        }
    }
}


declare global {
    interface HTMLElementTagNameMap {
        'track-column': TrackColumnElement
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'track-column': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<TrackColumnElement> & {
                    trackDetails: Array<Array<ScheduledAudioTrack>>;
                    h: number;
                    totalTracks: number;
                };
            }
        }
    }
}
