import { MachineConfig, actions, Action, assign } from "xstate";
const { send, cancel } = actions;

// SRGS parser and example (logs the results to console on page load)
import { loadGrammar } from './runparser'
import { parse } from './chartparser'
import { grammar } from './grammars/homeGrammar'

const gram = loadGrammar(grammar)
const input = "please turn on the A C" 
const prs = parse(input.split(/\s+/), gram)
const result = prs.resultsForRule(gram.$root)[0]

console.log(result)

function say(text: string): Action<SDSContext, SDSEvent> {
    return send((_context: SDSContext) => ({ type: "SPEAK", value: text }))
}

function listen(): Action<SDSContext, SDSEvent> {
    return send('LISTEN')
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
            initial: "prompt",
            on: { ENDSPEECH: "who" },
            states: {
                prompt: { entry: say("Welcome to your smart home") }
            }
        },
        who: {
            initial: "prompt",
            on: {
                RECOGNISED: [{
                    cond: (context) => (parse(context.recResult.split(/\s+/), gram).resultsForRule(gram.$root)[0]),
                    actions: [assign((context) => { return { object: (parse(context.recResult.split(/\s+/), gram).resultsForRule(gram.$root)[0])['smarthome']["object"] } },
                    ),
                    assign((context) => { return { action: (parse(context.recResult.split(/\s+/), gram).resultsForRule(gram.$root)[0])['smarthome']["action"] } },
                    )],
                    target: "perf_act"

                },
                { target: ".nomatch" }]
            },
            states: {
                prompt: {
                    entry: say("What would you want me to do?"),
                    on: { ENDSPEECH: "ask" }
                },
                ask: {
                    entry: listen()
                },
                nomatch: {
                    entry: say("Sorry I cannot do that."),
                    on: { ENDSPEECH: "prompt" }
                }
            }
        },
        perf_act: {
            initial: "prompt",
            on: { ENDSPEECH: "init" },
            states: {
                prompt: {
                    entry: send((context) => ({
                        type: "SPEAK",
                        value: `OK. ${context.object} ${context.action}.`
                    }))
                },
            }
        }
    }
})