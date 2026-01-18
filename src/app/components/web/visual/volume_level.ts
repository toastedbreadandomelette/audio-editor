import { audioManager } from '@/app/services/audio/audiotrackmanager';
import { audioService } from '@/app/services/audioservice';
import { animationBatcher } from '@/app/services/animationbatch';

export enum Orientation {
  Horizontal,
  Vertical
}

function calculateRMS(array: Uint8Array): number {
    let rms = 0, length = array.length;

    for (let i = 0; i < length; ++i) {
        let p = array[i] - 128;
        rms += p * p;
    }

    return Math.round(Math.sqrt(rms / length));
}

// Currently assuming only two channels.
// For one channel, we'll connect same buffer to both.
//
// Also, use canvas for this??
export class VolumeLevelsElement extends HTMLElement {
    orient = Orientation.Horizontal;
    rate = 0;
    animationId: symbol | null = null;
    canvasWidth = 200;
    canvasHeight = 5;
    mixerNumber: number | undefined = undefined;

    leftBuffer = new Uint8Array(1024);
    rightBuffer = new Uint8Array(1024);

    leftContainer = document.createElement('div');
    rightContainer = document.createElement('div');

    leftCanvas = document.createElement('canvas');
    leftCanvasCtx = this.leftCanvas.getContext('2d')!;
    rightCanvas = document.createElement('canvas');
    rightCanvasCtx = this.rightCanvas.getContext('2d')!;

    get width() {
        return this.orient === Orientation.Horizontal ? 
            this.canvasHeight : this.canvasWidth;
    }

    set width(width: number) {
        if (this.orient === Orientation.Vertical) {
            this.canvasWidth = width;
        } else {
            this.canvasHeight = width;
        }
    }

    get length() {
        return this.orient === Orientation.Horizontal ? 
            this.canvasWidth : this.canvasHeight;
    }

    set length(length: number) {
        if (this.orient === Orientation.Vertical) {
            this.canvasHeight = length;
        } else {
            this.canvasWidth = length;
        }
    }

    set mixer(m: number | undefined) {
        this.mixerNumber = m;
    }

    get mixer() {
        return this.mixerNumber;
    }

    set orientation(orient: Orientation) {
        this.orient = orient;
    }

    get orientation() { return this.orient; }

    set renderingFrameRate(rate: number) {
        this.rate = rate; 
    }

    get renderingFrameRate() {
        return this.rate;
    }

    constructor() {
        super();
    }

    pauseRendering() {

    }

    resumeRendering() {

    }

    connectedCallback() {
        this.classList.add('flex', 'items-center');

        this.leftContainer.classList.add('flex', 'm-1', 'items-center');
        this.rightContainer.classList.add('flex', 'm-1', 'items-center');
        this.leftCanvas.style.background = '#000';
        this.rightCanvas.style.background = '#000';
        if (this.orientation === Orientation.Vertical) {
            this.leftContainer.classList.add('flex-col');
            this.rightContainer.classList.add('flex-col');
            this.leftCanvas.classList.add('transform', 'rotate-180');
            this.rightCanvas.classList.add('transform', 'rotate-180');
        } else {
            this.classList.add('flex-col');
            this.leftContainer.classList.add('flex-row-reverse', 'h-4');
            this.rightContainer.classList.add('flex-row-reverse', 'h-4');
        }
        this.leftCanvas.classList.add('m-2');
        this.rightCanvas.classList.add('m-2');

        // TODO: 
        this.leftCanvas.width = this.canvasWidth;
        this.leftCanvas.height = this.canvasHeight;
        this.leftCanvas.style.width = this.canvasWidth + 'px';
        this.leftCanvas.style.height = this.canvasHeight + 'px';

        this.rightCanvas.width = this.canvasWidth;
        this.rightCanvas.height = this.canvasHeight;
        this.rightCanvas.style.width = this.canvasWidth + 'px';
        this.rightCanvas.style.height = this.canvasHeight + 'px';

        // Arranging left and right container
        const leftLabel = document.createElement('label');
        leftLabel.innerText = 'L';
        this.leftContainer.appendChild(this.leftCanvas);
        this.leftContainer.appendChild(leftLabel);

        const rightLabel = document.createElement('label');
        rightLabel.innerText = 'R';
        this.rightContainer.appendChild(this.rightCanvas);
        this.rightContainer.appendChild(rightLabel);

        this.appendChild(this.leftContainer);
        this.appendChild(this.rightContainer);

        this.leftCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.rightCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.leftCanvasCtx.fillStyle = '#45AB7C';
        this.rightCanvasCtx.fillStyle = '#45AB7C';

        this.animationId = animationBatcher.addAnimationHandler(this.renderCanvas.bind(this));
        animationBatcher.setAnimationFrameRate(this.animationId, 30);
        this.renderCanvas();
    }

    renderCanvas() {
        // Find a way to initiate these without involving
        if (!audioService.audioContext || !audioManager.leftAnalyserNode) {
            return;
        }

        this.leftCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.rightCanvasCtx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        const length = audioManager.getBufferLengthForTimeDomainData();

        if (length !== this.leftBuffer.length) {
            this.leftBuffer = new Uint8Array(length);
            this.rightBuffer = new Uint8Array(length);
        }

        if (this.mixerNumber === undefined) { 
            audioManager.getTimeData(this.leftBuffer, this.rightBuffer);
        } else {
            audioManager.getTimeDataFromMixer(this.mixerNumber, this.leftBuffer, this.rightBuffer);
        }

        if (this.orient === Orientation.Horizontal) {
            this.leftCanvasCtx.fillRect(0, 0, calculateRMS(this.leftBuffer), this.width);
            this.rightCanvasCtx.fillRect(0, 0, calculateRMS(this.rightBuffer), this.width);
        } else {
            this.leftCanvasCtx.fillRect(0, 0, this.width, calculateRMS(this.leftBuffer));
            this.rightCanvasCtx.fillRect(0, 0, this.width, calculateRMS(this.rightBuffer));
        }
    }

    disconnectedCallback() {
        this.animationId && animationBatcher.removeAnimationHandler(this.animationId);
    }
}

declare global {
    interface HTMLElementTagNameMap {
        'volume-level': VolumeLevelsElement;
    }
    namespace React {
        namespace JSX {
            interface IntrinsicElements {
                'volume-level': React.HTMLAttributes<HTMLElement> & 
                React.RefAttributes<VolumeLevelsElement> & {
                    orientation: Orientation;
                    width?: number;
                    length?: number;
                    mixer?: number;
                    renderingFrameRate?: number;
                };
            }
        }
    }
}
