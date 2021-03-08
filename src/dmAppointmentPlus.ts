import { MachineConfig, Action, assign, actions } from "xstate";
const { send, cancel } = actions;


function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
}

function promptAndAsk(prompt: Action<SDSContext, SDSEvent>, reprompt:string, nomatch: string) : MachineConfig<SDSContext, any, SDSEvent> {
    return ({
        initial: 'prompt',
        states:{
            prompt: {
                entry: prompt,
                on: { ENDSPEECH: 'ask' }
                },

            reprompt: {
                entry: say(reprompt),
                on: { ENDSPEECH: "ask" }
            },
            ask: {
                entry: [send('LISTEN'), send('MAXSPEECH', {delay: 5000, id: 'maxsp'})],
            },
            nomatch: {
                entry: say(nomatch),
                on: { ENDSPEECH: "reprompt" }
            },
        }
    })
}




const grammar: { [index: string]: { person?: string, day?: string, time?: string } } = {
    //people
    "John": { person: "John Appleseed" },
    "Julia": { person: "Julia Harvees" },
    "Victoria": {person: "Victoria Bloom"},

    //days
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

    //time
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
    //agree
    "yes": { bool: true },
    "yep": { bool: true },
    "of course": { bool: true },
    "sure": { bool: true },
    "I want to": { bool: true },

    //disagree
    "no": { bool: false },
    "no way": { bool: false },
    "hell no": { bool: false },
    "nope": { bool: false },
}

const commands = {"help":"H"};

let count = 0

export const dmMachine: MachineConfig<SDSContext, any, SDSEvent> = ({
    initial: 'welcome',
    states: {
        init: {
            on: {
                CLICK: 'welcome'
            }
        },
        maxspeech : {
            entry: say("I cannot hear you. Don't be so shy! Let me say that again."),
            on: {'ENDSPEECH': 'appointment.hist'}
        },
        welcome: { 
            initial: "prompt",
            on: { ENDSPEECH: "appointment" },
            states: { 
                prompt: { entry: say("Let's create an appointment") }
            }
        },
        appointment: {
            initial: "who",
            on: {
                RECOGNISED: {cond: (context) => (context.recResult in commands),
                           target: "#help"},},


            states:{
                hist: {type: 'history'},
                who: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{
                            cond: (context) => "person" in (grammar[context.recResult] || {}), 
                            actions: [assign((context) => { return { person: grammar[context.recResult].person } }),
                            cancel('maxsp')],
                            target: "day"},

                            {cond: (context) => (context.recResult in commands),
                            target: "#help"},

                            {actions: cancel('maxsp'),
                            target: ".nomatch" }],

                        MAXSPEECH: [{cond: () => (count++) <= 2, target: '#root.dm.appointment.maxspeech'},
                        {target: '#root.dm.appointment.final'}]
                    },
                    
                    ...promptAndAsk(say("Who are you meeting with?"),
                    "Tell me a name",
                    "Sorry, I don't know them")
                },

                day:{
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{
                            cond: (context) => "day" in (grammar[context.recResult] || {}), 
                            actions: [assign((context) => { return { day: grammar[context.recResult].day } }),
                            cancel('maxsp')],
                            target: "wholeday"},

                            {cond: (context) => (context.recResult in commands),
                            target: "#help"},

                            {actions: cancel('maxsp'),
                            target: ".nomatch" }],

                        MAXSPEECH: [{cond: () => (count++) <= 2, target: '#root.dm.appointment.maxspeech'},
                            {target: '#root.dm.appointment.final'}]
                        },
                    ...promptAndAsk(send((context) => ({
                            type: "SPEAK",
                            value: `OK. ${context.person}. On which day is your meeting?`})), 
                        "Tell me a day of the week",
                        "Sorry, I did not get that.")
                },

                wholeday: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [
                            {cond: (context) => "bool" in (booleanGrammar[context.recResult] || {}) &&
                            (booleanGrammar[context.recResult].bool === true),
                            actions: cancel('maxsp'),
                            target: "whole_day_confirmation"}, 

                            {cond: (context) => "bool" in (booleanGrammar[context.recResult] || {}) &&
                            (booleanGrammar[context.recResult].bool === false),
                            actions: cancel('maxsp'),
                            target: "time"},

                            {cond: (context) => (context.recResult in commands),
                            target: "#help"},

                            {cond: (context) => !(context.recResult in commands),
                            target: ".nomatch" }],

                        MAXSPEECH: [{cond: () => (count++) <= 2, target: '#root.dm.appointment.maxspeech'},
                            {target: '#root.dm.appointment.final'}]
                        
                        },
                    ...promptAndAsk(send((context) => ({ 
                        type: "SPEAK",
                        value: `OK. ${context.person} on ${context.day}. Will it take the whole day?`})),
                        "Will it take the entire day?",
                        "Sorry, I'm afraid that I don't understand"),
                },
                
                time: {
                    initial: "prompt",
                    on: {
                        RECOGNISED: [
                            {cond: (context) => "time" in (grammar[context.recResult] || {}),
                            actions: [cancel('maxsp'),assign((context) => { return { time: grammar[context.recResult].time } }),],
                            target: "time_confirmation"},

                            {cond: (context) => (context.recResult in commands),
                            target: "#help"},

                            {actions: cancel('maxsp'),
                            target: ".nomatch" }],

                        MAXSPEECH: [{cond: () => (count++) <= 2, target: '#root.dm.appointment.maxspeech'},
                            {target: '#root.dm.appointment.final'}]
                        
                        },
                    ...promptAndAsk(send((context) => ({
                            type: "SPEAK",
                            value: `OK. What time is your meeting?`})), 
                            "When does your meeting start?",
                            "Sorry, I don't understand"),
                        },
                whole_day_confirmation:{
                    initial: "prompt",
                    on: {
                        RECOGNISED: [{
                            cond: (context) => "bool" in (booleanGrammar[context.recResult] || {}) &&
                            (booleanGrammar[context.recResult].bool === true),
                            actions: cancel('maxsp'),
                            target: "confirmed"},

                            {cond: (context) => "bool" in (booleanGrammar[context.recResult] || {}) &&
                            (booleanGrammar[context.recResult].bool === false),
                            actions: cancel('maxsp'),
                            target: "wholeday"},

                            {cond: (context) => (context.recResult in commands),
                            target: "#help"},

                            {actions: cancel('maxsp'),
                            target: ".nomatch" }],
                        
                        MAXSPEECH: [{cond: () => (count++) <= 2, target: '#root.dm.appointment.maxspeech'},
                            {target: '#root.dm.appointment.final'}]
                        
                        },
                    ...promptAndAsk(send((context) => ({ 
                    type: "SPEAK",
                    value: `OK. Do you want me to create an appointment with ${context.person} on ${context.day} for the whole day?`})),
                    "Say yes or no",
                    "Sorry, I do not understand")
                },
                time_confirmation: {
                  initial: "prompt",
                    on:  {
                        RECOGNISED: [
                            {cond: (context) => (booleanGrammar[context.recResult].bool === true),
                            actions:cancel('maxsp'),
                            target: "confirmed"},

                            {cond: (context) => (booleanGrammar[context.recResult].bool === false),
                            actions: cancel('maxsp'),
                            target: "who"},


                            {cond: (context) => (context.recResult in commands),
                            target: "#help"},

                            {actions: cancel('maxsp'),
                            target: ".nomatch" }],

                        MAXSPEECH: [{cond: () => (count++) <= 2, target: '#root.dm.appointment.maxspeech'},
                            {target: '#root.dm.appointment.final'}]
                        
                        },
                    ...promptAndAsk(send((context) => ({ 
                    type: "SPEAK",
                    value: `OK. Do you want me to create an appointment with ${context.person} on ${context.day} at ${context.time}?`})),
                    "Say yes or no",
                    "Sorry, I do not understand"),
                },
                confirmed: {
                    initial: "prompt",
                    on: { ENDSPEECH: "#root.dm.init" },
                    states: {
                        prompt: {
                            entry: send((context) => ({
                                type: "SPEAK",
                                value: `Your appointment has been created!`}))
                        },
                }
                },
            }
           
        },
        help: {
            id: 'help',
            entry: say("We can go back if you need help"),
            always: [{target: 'appointment.hist',
                      actions: assign((context) => {return {count: ( count - 1 )}}) }]
        },

        final: {
            entry: say("Let me know if you change your mind about talking to me"),
            on: {'ENDSPEECH': '#root.dm.init'}
        },  
    }
})