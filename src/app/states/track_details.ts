import { RegionSelection } from '../components/editor/regionselect';
import { TimeSectionSelection } from '../components/editor/seekbar';
import { SlicerSelection } from '../components/editor/slicer';
import { audioManager } from '../services/audio/audiotrackmanager';
import { cloneValues } from '../services/audio/noderegistry';
import {
    ChangeDetails,
    changeHistory,
    createSnapshot,
    WorkspaceChange
} from '../services/changehistory';
import { SingletonStore } from '../services/singlestore';
import { AudioDetails } from '../state/audiostate';
import {
    addNewAudioToTrack,
    bulkDeleteTracks,
    cloneMultipleAudioTracks,
    cloneSingleAudioTrack,
    deleteSingleAudioTrack,
    markSelectionForAllAudioTracks,
    removeAudioFromAllScheduledTrack,
    setMultipleOffsets,
    setTrackOffsetToAFinalPoint,
    sliceAudioTracksAtPoint
} from '../state/trackdetails/audiotracks';
import { ScheduledInformation } from '../state/trackdetails/trackdetails';
import {
    AudioTrackChangeDetails,
    HistoryAction,
    undoSnapshotChange
} from '../state/trackdetails/tracksnapshots';
import { getMaxTimeOverall } from '../state/trackdetails/trackutils';

/**
 * @description Information of the track, like start offset, end offset and selection.
 * Maybe store additional data.
 */
export type TrackInformation = {
  /**
   * Start offset relative to the audio.
   */
  startOffsetInMicros: number
  /**
   * End offset relative to the audio.
   */
  endOffsetInMicros: number
  /**
   * @description Playback Rate set.
   */
  playbackRate: number
  /**
   * Boolean if selected or not.
   */
  selected: boolean
}

export type AudioNonScheduledDetails = AudioDetails & {
    trackDetail: TrackInformation
}

export type ScheduledAudioTrack = AudioDetails & {
    trackDetail: ScheduledInformation & TrackInformation
}

export type AudioTrackDetails = ScheduledAudioTrack;

export enum Status {
    Pause,
    Play
}

export const SEC_TO_MICROSEC = 1e6;
export const TWO_MINUTE_MICROSEC = 120 * SEC_TO_MICROSEC;

export function getDefaultAudioTrackDetails(): AudioTrackDetails {
    return {
        trackDetail: {
            offsetInMicros: 0,
            scheduledKey: Symbol(),
            id: -1,
            trackNumber: -1,
            startOffsetInMicros: 0,
            endOffsetInMicros: 0,
            playbackRate: 1,
            selected: false
        },
        audioId: Symbol(),
        duration: 0,
        effects: [],
        audioName: '',
        colorAnnotation: '#ffffff',
        mixerNumber: 0
    };
}

function isWithinRegionAndNotSelected(
    track: AudioTrackDetails,
    pointStartSec: number,
    pointEndSec: number
): boolean {
    const startTime = track.trackDetail.offsetInMicros / SEC_TO_MICROSEC;
    const startOffset = track.trackDetail.startOffsetInMicros / SEC_TO_MICROSEC;
    const endOffset = track.trackDetail.endOffsetInMicros / SEC_TO_MICROSEC;

    const endTime = startTime + (endOffset - startOffset);

    // Probably need a better boolean checks, but this works for now.
    return (
        // region consumed by track
        (pointStartSec <= startTime && pointEndSec >= endTime) ||
        // End section of the region selection overlaps with the track
        (pointEndSec >= startTime && pointEndSec <= endTime) ||
        // Start section of the region selection overlaps with the track
        (pointStartSec >= startTime && pointStartSec <= endTime)
    );
}

function processTrackHistory<Action>(
    state: AudioTrackDetails[][],
    action: Action,
    fn: (state: AudioTrackDetails[][], action: Action) => AudioTrackDetails[][]
) {
    const initialState = createSnapshot(state);
    const finalState = fn(state, action);

    changeHistory.storeChanges(
        initialState,
        cloneValues(finalState),
        WorkspaceChange.TrackChanges
    );

    return finalState;
}

export class ScheduledTracks {
    status: Status = Status.Pause;
    maxTimeMicros = TWO_MINUTE_MICROSEC;
    timePerUnitLineInSeconds = 5;
    trackDetails: ScheduledAudioTrack[][] = Array.from(
        {length: audioManager.totalTrackSize}, () => []
    );
    // trackAutomation: Sc[][] = Array.from({length: audioManager.totalTrackSize}, () => []);
    trackUniqueIds: number[] = [];

    constructor() {}

    addAudioToTrack(track: AudioTrackDetails, trackNumber: number) {
        this.trackDetails = processTrackHistory(
            this.trackDetails,
            {trackNumber, track},
            addNewAudioToTrack
        );
        // Calculate the maxTime 
        const currentTime = this.maxTimeMicros - TWO_MINUTE_MICROSEC;

        const startTimeOfTrack = track.trackDetail.startOffsetInMicros;
        const endTimeOfTrack = track.trackDetail.endOffsetInMicros;

        const trackTotalTime = endTimeOfTrack - startTimeOfTrack;
        const endTime = track.trackDetail.offsetInMicros + trackTotalTime;

        if (currentTime < endTime) {
            this.maxTimeMicros = endTime + TWO_MINUTE_MICROSEC;
            audioManager.setLoopEnd(endTime);
        }
    }

    deleteAudioFromTrack(trackNumber: number, audioIndex: number) {
        this.trackDetails = processTrackHistory(
            this.trackDetails, 
            {trackNumber, audioIndex},
            deleteSingleAudioTrack
        );

        // Now find the next longest track among all the tracks exists with offset
        const maxTime = getMaxTimeOverall(this.trackDetails, []);

        this.maxTimeMicros = maxTime + TWO_MINUTE_MICROSEC;
        audioManager.setLoopEnd(maxTime);
    }

    selectTracksWithinSpecifiedRegion(action: RegionSelection) {
        const { trackStart, trackEnd, pointEndSec, pointStartSec } = action;

        for (let index = 0; index < this.trackDetails.length; ++index) {
            for (const track of this.trackDetails[index]) {
                if (index < trackStart || index > trackEnd) {
                    track.trackDetail.selected = false;
                } else {
                    track.trackDetail.selected = isWithinRegionAndNotSelected(
                        track,
                        pointStartSec,
                        pointEndSec
                    );
                }
            }
        }
    }

    /// Selecting multiple tracks at once.
    selectTracksWithinSelectedSeekbarSection(action: TimeSectionSelection) {
        const {startTimeMicros, endTimeMicros} = action;
        const pointStartSec = startTimeMicros / SEC_TO_MICROSEC;
        const pointEndSec = endTimeMicros / SEC_TO_MICROSEC;

        for (let index = 0; index < this.trackDetails.length; ++index) {
            for (const track of this.trackDetails[index]) {
                track.trackDetail.selected = isWithinRegionAndNotSelected(
                    track,
                    pointStartSec,
                    pointEndSec
                );
            }
        }
    }

    selectAllTracks() {
        markSelectionForAllAudioTracks(this.trackDetails, true);
    }

    deselectAllTracks() {
        markSelectionForAllAudioTracks(this.trackDetails, false);
    }

    cloneMultipleAudioTrack(trackNumbers: number[], audioIndexes: number[]) {
        this.trackDetails = processTrackHistory(
            this.trackDetails,
            {trackNumbers, audioIndexes},
            cloneMultipleAudioTracks
        );
        // this.trackUniqueIds = syncAllIds(state.trackDetails, state.trackUniqueIds);
    }

    deleteMultipleAudioTrack(trackNumbers: number[], audioIndexes: number[]) {
        this.trackDetails = processTrackHistory(
            this.trackDetails,
            {trackNumbers, audioIndexes},
            bulkDeleteTracks
        );
        // state.trackUniqueIds = syncAllIds(state.trackDetails, state.trackUniqueIds);
    
        const maxTime = getMaxTimeOverall(this.trackDetails, []);
        this.maxTimeMicros = maxTime + TWO_MINUTE_MICROSEC;
        audioManager.setLoopEnd(maxTime);
    }

    cloneAudioTrack(trackNumber: number, audioIndex: number) {
        this.trackDetails = processTrackHistory(
            this.trackDetails,
            {trackNumber, audioIndex},
            cloneSingleAudioTrack
        );
    }

    sliceAudioTracks(action: SlicerSelection) {
        this.trackDetails = processTrackHistory(
            this.trackDetails,
            action,
            sliceAudioTracksAtPoint
        );
    }

    /**
     * @description All transformation that should made are calculated here; 
     * after releasing trigger from the mouse. The offsets calculated from the 
     * editor are brought here and are set to the particular scheduled 
     * audio track that the user interacted with.
     * 
     * Similar changes to all track changes.
     * 
     * @param action Information related to the changes:
     * - `trackNumber`: track number in which audio is scheduled.
     * - `audioIndex`: index in this track, which can be referenced in 2d array 
     * as `state[trackNumber][audioIndex]`
     * - `offsetInMillis`: Offset in track, measured from starting point of 
     * the **Workspace** `'00:00'` in millis.
     * - `startOffsetInMillis`: Offset denoting where the track should start, 
     * measured from starting point of the **Audio**.
     * - `endOffsetInMillis`: Offset denoting where the track should end, 
     * measured from starting point of the **Audio**
     */
    setOffsetDetailsToAudioTrack(action: {
        trackNumber: number,
        audioIndex: number,
        offsetInMicros: number,
        startOffsetInMicros: number,
        endOffsetInMicros: number
    }) {
        // TODO: Created a clone because contents of this.trackDetails
        // are not modifiable. Taking a look at it later.
        this.trackDetails = processTrackHistory(
            cloneValues(this.trackDetails),
            action,
            setTrackOffsetToAFinalPoint
        );
        const {trackNumber, audioIndex, offsetInMicros} = action;

        const trackDetails = this.trackDetails[trackNumber][audioIndex];
        const currentTime = this.maxTimeMicros - TWO_MINUTE_MICROSEC;

        // Should always exist in milliseconds
        const startTimeOfTrack = trackDetails.trackDetail.startOffsetInMicros;
        const endTimeOfTrack = trackDetails.trackDetail.endOffsetInMicros;
        const trackTotalTime = endTimeOfTrack - startTimeOfTrack;

        const endTime = offsetInMicros + trackTotalTime;

        if (currentTime < endTime) {
            this.maxTimeMicros = endTime + TWO_MINUTE_MICROSEC;
            audioManager.setLoopEnd(endTime);
        } else {
            const maxTime = getMaxTimeOverall(this.trackDetails, []);
            this.maxTimeMicros = maxTime + TWO_MINUTE_MICROSEC;
            audioManager.setLoopEnd(maxTime);
        }
    }

    applyChangesToModifiedAudio(
        audioId: symbol,
        transformation: AudioTransformation
    ) {
        for (const track of this.trackDetails) {
            for (const audio of track) {
                if (audio.audioId === audioId) {
                    const index = audio.effects.indexOf(transformation);

                    if (index > -1) {
                        audio.effects.splice(index, 1);
                    } else {
                        audio.effects.push(transformation);
                    }
                }
            }
        }
    }

    setOffsetDetailsToMultipleAudioTrack(action: {
        allTrackNumbers: number[],
        allAudioIndexes: number[],
        allOffsetsInMicros: number[],
        allStartOffsetsInMicros: number[],
        allEndOffsetsInMicros: number[]
    }) {
      this.trackDetails = processTrackHistory(
        this.trackDetails,
        action,
        setMultipleOffsets
    );

      const maxTime = getMaxTimeOverall(this.trackDetails, []);
      this.maxTimeMicros = maxTime + TWO_MINUTE_MICROSEC;
      audioManager.setLoopEnd(maxTime);
    }

    /// Remove all the tracks related to this audio ID.
    removeAudioFromAllTracks(audioId: symbol, noSnapshot: true){
      this.trackDetails = !noSnapshot ?
        processTrackHistory(this.trackDetails, audioId, removeAudioFromAllScheduledTrack) :
        removeAudioFromAllScheduledTrack(this.trackDetails, audioId);

      const maxTime = getMaxTimeOverall(this.trackDetails, []);
      this.maxTimeMicros = maxTime + TWO_MINUTE_MICROSEC;
      audioManager.setLoopEnd(maxTime);
    }

    rollbackChanges(
        updatedChanges: ChangeDetails<AudioTrackChangeDetails>[],
        action: HistoryAction
    ) {
        undoSnapshotChange(this.trackDetails, updatedChanges, action);

        const maxTime = getMaxTimeOverall(
            this.trackDetails,
            []
        );
        this.maxTimeMicros = maxTime + TWO_MINUTE_MICROSEC;
        audioManager.setLoopEnd(maxTime);
    }
}

export const scheduledTrack = new ScheduledTracks();
SingletonStore.setInstance(ScheduledTracks, scheduledTrack);
