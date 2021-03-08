/// <reference types="react-scripts" />

declare module 'react-speech-kit';

interface SDSContext {
    recResult: string;
    nluData: any;
    ttsAgenda: string;
    query: string;
    person: string;
    day: string;
    time: string;
    snippet: string;
    prompt: string;
    reprompt: string;
    count: any;
    bool: boolean

}

type SDSEvent =
    | { type: 'CLICK' }
    | { type: 'MAXSPEECH' }
    | { type: 'RECOGNISED' }
    | { type: 'ASRRESULT', value: string }
    | { type: 'ENDSPEECH' }
    | { type: 'LISTEN' }
    | { type: 'SPEAK', value: string };
