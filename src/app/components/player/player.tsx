import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { audioManager } from '@/app/services/audio/audiotrackmanager';
import { RootState } from '@/app/state/store';
import { Status, togglePlay } from '@/app/state/trackdetails/trackdetails';
import { Knob } from '../knob';
import { addIntoAudioBank } from '@/app/state/audiostate';
import { getRandomWindowId, randomColor } from '@/app/services/random';
import { addWindowToAction, VerticalAlignment } from '@/app/state/windowstore';
import { Orientation } from '../web/visual/volume_level';

export enum TimeframeMode {
  Time,
  Beat
}

export function Player() {
  const status = useSelector((state: RootState) => (
    state.trackDetailsReducer.status
  ));
  const tracks = useSelector((state: RootState) => (
    state.trackDetailsReducer.trackDetails
  ));
  const mode = useSelector((state: RootState) => (
    state.trackDetailsReducer.timeframeMode
  ));
  // States
  const [masterVol, setMasterVol] = React.useState(1);
  const dispatch = useDispatch();

  function pause() {
    dispatch(togglePlay(status === Status.Pause ? Status.Play : Status.Pause));
  }

  function onMainVolChange(e: number) {
    audioManager.setGainNodeForMaster(e);
    setMasterVol(e);
  }

  function openMixer() {
    addWindowToAction(
      dispatch,
      {
        header: 'Mixer',
        props: {},
        propsUniqueIdentifier: audioManager.mixer.viewId,
        x: 10,
        y: 10,
        overflow: true,
        verticalAlignment: VerticalAlignment.Bottom,
        view: () => <><c-mixer mixerCount={audioManager.totalMixers} /></>,
        visible: true,
        windowSymbol: Symbol(),
        w: 1200,
        h: 700,
        windowId: getRandomWindowId()
      }
    )
  }

  /**
   * @description Exporting into audio file.
   * @todo: This.
   */
  async function exportIntoAudioFile() {
    const data = await audioManager.simulateIntoOfflineAudio(tracks);

    const details = {
      audioName: 'new.mp3',
      colorAnnotation: randomColor(),
      duration: data.duration as number,
      mixerNumber: 0,
      effects: []
    };

    const newAudioId = audioManager.registerAudioInAudioBank(details, data);
    dispatch(addIntoAudioBank({
      ...details,
      audioId: newAudioId
    }));
  }

  return (
    <div className="flex justify-center items-center flex-row min-h-[8dvh] bg-darker shadow-lg">
      <nav>
        <ul className="list-none flex flex-row">
          <li
            onClick={exportIntoAudioFile}
            className="inline-block hover:bg-slate-600 p-3 rounded-sm text-xl select-none"
          >Export</li>
        </ul>
      </nav>
      <div className="volume px-6 text-center text-xs" title="Master Volume">
        <Knob
          r={12}
          onKnobChange={onMainVolChange}
          pd={8}
          scrollDelta={0.01}
          value={masterVol}
        />
        <div>{Math.round(masterVol * 100)}</div>
      </div>
      <timer-tempo />
      <span
        onClick={pause}
        className="ml-2 pause play bg-secondary p-2 rounded-md cursor-pointer"
      >
        {
        status === Status.Pause ? 
          <play-icon s="#61E361" f="#51DE56" w={25} h={25} /> :
          <pause-icon s="#E1E361" f="#D1D256" w={25} h={25} />
        }
      </span>
      <div className="speaker-decibel ml-4">
        <volume-level orientation={Orientation.Horizontal} />
      </div>
      <div className="views flex ml-4">
        <button
          title="Open Mixer"
          className="border border-solid border-slate-600 rounded-sm hover:bg-slate-600 active:bg-slate-800"
          onClick={openMixer}
        >
          <mixer-icon w={40} h={40} s="rgb(100 116 139)" />
        </button>
      </div>
    </div>
  );
}
