import { MachineConfig, send, Action, assign } from "xstate";

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
const grammar: { [index: string]: { person?: string, day?: string, time?: string } } = {
    "John": { person: "John Appleseed" },
    "Julia": { person: "Julia Harvees" },
    "Victoria": {person: "Victoria Bloom"},
    "on Monday": { day: "Monday" },
    "on Tuesday": { day: "Tuesday" },
    "on Wednesday": { day: "Wednesday" },
    "on Thursday": { day: "Thursday" },
    "on Friday": { day: "Friday" },
    "on Saturday": { day: "Saturday" },
    "on Sunday": { day: "Sunday" },
    "Monday": { day: "Monday" },
    "Tuesday": { day: "Tuesday" },
    "Wednesday": { day: "Wednesday" },
    "Thursday": { day: "Thursday" },
    "Friday": { day: "Friday" },
    "Saturday": { day: "Saturday" },
    "Sunday": { day: "Sunday" },
    "at 5": { time: "5:00"},
    "5": { time: "5:00"},
    "at 5 p.m.": {time: "5:00 p.m."},
    "at 6": { time: "6:00"},
    "6": { time: "6:00"},
    "at 6 p.m.": { time: "6:00 p.m."},
    "at 7": { time: "7:00"},
    "7": { time: "7:00"},
    "at 7 p.m.": { time: "7:00 p.m."},
    "at 8": { time: "8:00"},
    "8": { time: "8:00"},
    "at 10": { time: "10:00" },
    "10": { time: "10:00" },
    "at 9": { time: "9:00" },
    "9": { time: "9:00" },
    "at 11": {time: "11:00"},
    "11": {time: "11:00"},
    "at 12": { time: "12:00"},
    "12": { time: "12:00"},
    "at 13": { time: "1:00 p.m."},
    "at 14": { time: "2:00 p.m."},
    "at 15": { time: "3:00 p.m."},
    "at 16": { time: "4:00 p.m."},

}

const booleanGrammar: { [index: string]: {bool?: boolean}} = {
    "yes": { bool: true },
    "yep": { bool: true },
    "of course": { bool: true },
    "sure": { bool: true },
    "I want to": { bool: true },
    "no": { bool: false },
    "no way": { bool: false },
    "hell no": { bool: false },
    "nope": { bool: false },
}



export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = ({
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
            initial: "prompt",
            on: { ENDSPEECH: "who" },
            states: {
                prompt: { entry: say("Let's create an appointment") }
            }
        },
        who: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    cond: (context) => "person" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { person: grammar[context.recResult].person } }),
                    target: "day"

                },
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: say("Who are you meeting with?"),
                    on: { ENDSPEECH: "ask" }
                },
                ask: {
                    entry: listen()
                },
                nomatch: {
                    entry: say("Sorry I don't know them"),
                    on: { ENDSPEECH: "prompt" }
                }
            }
        },
        day: {
            initial: "prompt",
            on:{
                RECOGNISED: [{
                    cond: (context) => "day" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { day: grammar[context.recResult].day } }),
                    target: "wholeday"
                },
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.person}. On which day is your meeting?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry, I don't understand"),
		on: { ENDSPEECH: "prompt" }
	    }
	  }
        },
	wholeday: {
            initial: "prompt",
            on: {
                RECOGNISED: [{cond: (context) => (booleanGrammar[context.recResult].bool === false),
                    target: "time"
                },
		{cond: (context) => (booleanGrammar[context.recResult].bool === true),
		target: "whole_day_confirmation"
		},
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.person} on ${context.day}. Will it take the whole day?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry, I don't understand"),
		on: { ENDSPEECH: "prompt" }
	            }
                }
	},
	time: {
            initial: "prompt",
            on: { RECOGNISED: [{
                    cond: (context) => "time" in (grammar[context.recResult] || {}),
                    actions: assign((context) => { return { time: grammar[context.recResult].time } }),
                    target: "time_confirmation"
                },
                { target: ".nomatch" }]
		},
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.person} on ${context.day}. What time is your meeting?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry, I don't understand"),
		on: { ENDSPEECH: "prompt" }
	            }
                }
        },
	whole_day_confirmation: {
            initial: "prompt",
            on: {
                RECOGNISED: [{cond: (context) => (booleanGrammar[context.recResult].bool === false),
                    target: "init"
                },
		{cond: (context) => (booleanGrammar[context.recResult].bool === true),
		target: "confirmed"
		},
                { target: ".nomatch" }]
            },

            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Do you want to create an appointment with ${context.person} on ${context.day} for the whole day?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry, I don't understand"),
		on: { ENDSPEECH: "prompt" }
	           }
                }

	},
 	time_confirmation: {
            initial: "prompt",
            on:  {
                RECOGNISED: [{cond: (context) => (booleanGrammar[context.recResult].bool === false),
                    target: "who"
                },
		{cond: (context) => (booleanGrammar[context.recResult].bool === true),
		target: "confirmed"
		},
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                   entry: send((context) => ({
                        type: "SPEAK",
                        value: `Do you want to create an appointment with ${context.person} on ${context.day} at ${context.time}?`
                    })),
		    on: { ENDSPEECH: "ask" }
                },
		ask: {
		     entry: listen()
            },
	    nomatch: {
	    	entry: say("Sorry, I don't understand"),
		on: { ENDSPEECH: "prompt" }
	           }
                },
            },
	    confirmed: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `Your appointment has been created!`
                    }))
                },
		}
		}
        }})