/// <reference types="react-scripts" />

declare module 'react-speech-kit';

interface SDSContext {
    recResult: string;
    nluData: any;
    ttsAgenda: string;
    person: string,
    activity: string,

}

type SDSEvent =
    | { type: 'CLICK' }
    | { type: 'MAXSPEECH' }
    | { type: 'RECOGNISED' }
    | { type: 'ASRRESULT', value: string }
    | { type: 'ENDSPEECH' }
    | { type: 'LISTEN' }
    | { type: 'SPEAK', value: string };
