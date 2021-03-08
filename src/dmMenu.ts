import { MachineConfig, send, Action, assign } from "xstate";

//import { dmMachine } from "./dmColourChanger";
import { dmMachine} from "./dmAppointmentPlus";//dmAppointmentPlus


const proxyurl = "https://cors-anywhere.herokuapp.com/";
const rasaurl = 'https://dmappointment.herokuapp.com/model/parse'
const nluRequest = (text: string) =>
    fetch(new Request(proxyurl + rasaurl, {
        method: 'POST',
        headers: { 'Origin': 'http://maraev.me' }, // only required with proxy
        body: `{"text": "${text}"}`
    }))
        .then(data => data.json());

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

function promptAndAsk(prompt: string): MachineConfig<SDSContext, any, SDSEvent> {
    return ({
	initial: 'prompt',
	states: {
            prompt: {
		entry: say(prompt),
		on: { ENDSPEECH: 'ask' }
            },
            ask: {
		entry: send('LISTEN'),
            },
	}})
}


export const dmMenu: MachineConfig<SDSContext, any, SDSEvent> = ({
    initial: 'init',
    states: {
        init: {
            on: {
                CLICK: 'welcome'
            }
        },
	welcome: {
        id: "start",
	    on: {
		RECOGNISED: {
		    target: 'query',
		    actions: assign((context) => { return { activity: context.recResult } }),
                }
            },
	    ...promptAndAsk("What would you like to do? You can choose appointment, to do item or timer.")
	},
    	query: {
	    invoke: {
		id: 'rasa',
                src: (context, event) => nluRequest(context.activity),
                onDone: {
                    target: 'processer',
                    actions: [assign((context, event) => { return {activity: event.data.intent.name }}),
			      (context:SDSContext, event:any) => console.log(event.data)]
                },
		onError: {
                    target: 'welcome',
		    actions: (context,event) => console.log(event.data)
                }
            }
	},
    processer: {
        initial: "prompt",
        on: {
            ENDSPEECH: [
                { target: 'todo_item', cond: (context) => context.activity === 'todo_item' },
                { target: 'timer', cond: (context) => context.activity === 'timer' },
                { target: 'appointment', cond: (context) => context.activity === 'appointment' }, 
                { target: ".nomatch" } ]
        },
        states: {
            prompt: {
                entry: send((context) => ({
                    type: "SPEAK",
                    value: `OK`
                
                })),
    },
            nomatch: {
                entry: say("Sorry, I don't understand"),
                on: { ENDSPEECH: "#start" }
    } 
}
    },
    todo_item: {
        initial: "prompt",
        on: { ENDSPEECH: "init" },
        states: {
            prompt: {
                entry: send((context) => ({
                    type: "SPEAK",
                    value: `Welcome to To do item`
                }))
            },
    }
    },
        timer: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Welcome to timer`
                    }))
                },
		}
		},
        appointment: {
            ...dmMachine
        }
    }})