import React from 'react';
import {RootState} from '@/app/state/store';
import {useSelector} from 'react-redux';
import {TrackAudio} from './trackaudio';
import {TimeSectionSelection} from './seekbar';
import {SEC_TO_MICROSEC} from '@/app/state//trackdetails/trackdetails';
import {TrackAutomation} from './trackautomation';
import { SingletonStore } from '@/app/services/singlestore';
import { ScheduledTracks } from '@/app/states/track_details';

interface TrackProps {
  id: number
  w: number
  h: number
  lineDist: number
  timeUnitPerLineDistanceSecs: number
  selectedContent: TimeSectionSelection | null
}

export function Tracks(props: React.PropsWithoutRef<TrackProps>) {
  const scheduledTrack = SingletonStore.getInstance(ScheduledTracks);
  const trackData = scheduledTrack.trackDetails[props.id];

  const lineDist = props.lineDist;
  const timeUnit = props.timeUnitPerLineDistanceSecs;
  const timeUnitLine = SEC_TO_MICROSEC * timeUnit

  const startTime = (props.selectedContent?.startTimeMicros || 0);
  const endTime = (props.selectedContent?.endTimeMicros || 0);
  const selectedStart = ((startTime / timeUnitLine) * lineDist);
  const selectedEnd = ((endTime / timeUnitLine) * lineDist);

  return (
    <div 
      className="track relative box-border border-solid border-slate-700"
      data-id={props.id}
    >
      {
        trackData.map((track, index: number) => (
          // <audio-track
          //   unitTime={timeUnit}
          //   trackSource={track}
          //   key={track.trackDetail.id}
          //   dataId={index}
          //   trackId={props.id}
          //   height={props.h}
          //   lineDistance={lineDist}
          // ></audio-track>
          <TrackAudio
            index={index}
            lineDist={lineDist}
            trackId={props.id}
            timeUnitPerLineDistanceSecs={timeUnit}
            audioDetails={track}
            key={track.trackDetail.id}
            height={props.h}
          />
        ))
      }
      {/* {
        trackAutomation.map((automation, index: number) => (
          <TrackAutomation
            index={index}
            lineDist={lineDist}
            trackId={props.id}
            timeUnitPerLineDistanceSecs={timeUnit}
            key={automation.colorAnnotation}
            automation={automation}
            height={props.h}
          />
        ))
      } */}
      <c-marker
        width={props.w}
        height={props.h} 
        lineDistance={lineDist}
        style={{width: props.w, height: props.h}}
        className="track-patterns relative block"
        selectedStart={selectedStart}
        selectedEnd={selectedEnd}
      ></c-marker>
    </div>
  )
}
