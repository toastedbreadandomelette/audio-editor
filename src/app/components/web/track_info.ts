export class TrackInfoElement extends HTMLElement {
    trackInfo: HTMLSpanElement = document.createElement('span');
    ecount = 0;
    trackId = 0;
    slotElement: HTMLSlotElement = document.createElement('slot');

    get track() {
        return this.trackId;
    }

    set track(id: number) {
        this.trackId = id;
    }

    get entityCount() {
        return this.ecount;
    }

    set entityCount(count) {
        this.ecount = count;
        this.constructTrackInformation();
    } 

    constructor() {
        super();
    }

    connectedCallback() {
        this.classList.add('flex', 'flex-col', 'justify-center');
        this.trackInfo.classList.add('block', 'text-lg', 'select-none');
        this.draggable = false;
        this.appendChild(this.trackInfo);
        this.appendChild(this.slotElement);
        this.constructTrackInformation();
    }
    
    constructTrackInformation() {
        this.trackInfo.textContent = `Track ${this.track + 1} (${this.ecount})`;
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'c-track-info': TrackInfoElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'c-track-info': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<TrackInfoElement> & {
                    track: number;
                    entityCount: number;
                };
            }
        }
    }
}
