import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
import { ContextMenuProvider } from './app/providers/contextmenu';
import { DialogBoxProvider } from './app/providers/dialog';
import { PromptMenuProvider } from './app/providers/customprompt';
import { DropdownPanelProvider } from './app/components/shared/dropdown/dropdownpanel';
import { MarkerElement } from './app/components/web/marker';
import { AudioTrackElement } from './app/components/web/audiotrack';
import { TrackInfoElement } from './app/components/web/track_info';
import { KnobControlElement } from './app/components/web/controls/knob';
import { VolumeLevelsElement } from './app/components/web/visual/volume_level';
import { ExitIconElement } from './assets/exit';
import { SliderControlElement } from './app/components/web/controls/slider';
import { MixerInputElement } from './app/components/web/mixer/mixer_input';
import { MixerElement } from './app/components/web/mixer/mixer';
import { TimerOrTempoElement } from './app/components/web/player/timer';
import { WindowHeaderElement } from './app/components/web/shared/window/header';
import { WindowElement } from './app/components/web/shared/window/window';
import { SeekerElement } from './app/components/web/editor/seeker/seeker';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ContextMenuProvider>
      <DialogBoxProvider>
        <PromptMenuProvider>
          <DropdownPanelProvider>
            <App />
          </DropdownPanelProvider>
        </PromptMenuProvider>
      </DialogBoxProvider>
    </ContextMenuProvider>
  </StrictMode>,
)


// TODO: Export custom element defining function later
function init() {
  customElements.define('c-marker', MarkerElement);
  customElements.define('audio-track', AudioTrackElement);
  customElements.define('c-track-info', TrackInfoElement);
  customElements.define('knob-control', KnobControlElement);
  customElements.define('volume-level', VolumeLevelsElement);
  customElements.define('exit-icon', ExitIconElement);
  customElements.define('slider-control', SliderControlElement);
  customElements.define('mixer-input', MixerInputElement);
  customElements.define('c-mixer', MixerElement);
  customElements.define('timer-tempo', TimerOrTempoElement);
  customElements.define('window-header', WindowHeaderElement);
  customElements.define('c-window', WindowElement);
  customElements.define('c-seeker', SeekerElement);
}

init();

