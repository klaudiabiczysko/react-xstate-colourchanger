(this["webpackJsonpxstate-react-typescript-template"]=this["webpackJsonpxstate-react-typescript-template"]||[]).push([[0],{29:function(t,e,o){},40:function(t,e,o){"use strict";o.r(e);var a=o(26),n=o(7),i=(o(29),o(8),o(23)),r=o(20),c=o(2),s=o(43),p=o(44),m=o(11);const l=m.a.send,d=m.a.cancel;function y(t){return l((e=>({type:"SPEAK",value:t})))}function u(t,e,o){return{initial:"prompt",states:{prompt:{entry:t,on:{ENDSPEECH:"ask"}},reprompt:{entry:y(e),on:{ENDSPEECH:"ask"}},ask:{entry:[l("LISTEN"),l("MAXSPEECH",{delay:5e3,id:"maxsp"})]},nomatch:{entry:y(o),on:{ENDSPEECH:"reprompt"}}}}}const h={John:{person:"John Appleseed"},Julia:{person:"Julia Harvees"},Victoria:{person:"Victoria Bloom"},"on Monday":{day:"Monday"},"on Tuesday":{day:"Tuesday"},"on Wednesday":{day:"Wednesday"},"on Thursday":{day:"Thursday"},"on Friday":{day:"Friday"},"on Saturday":{day:"Saturday"},"on Sunday":{day:"Sunday"},Monday:{day:"Monday"},Tuesday:{day:"Tuesday"},Wednesday:{day:"Wednesday"},Thursday:{day:"Thursday"},Friday:{day:"Friday"},Saturday:{day:"Saturday"},Sunday:{day:"Sunday"},"at 5":{time:"5:00"},5:{time:"5:00"},"at 5 p.m.":{time:"5:00 p.m."},"at 6":{time:"6:00"},6:{time:"6:00"},"at 6 p.m.":{time:"6:00 p.m."},"at 7":{time:"7:00"},7:{time:"7:00"},"at 7 p.m.":{time:"7:00 p.m."},"at 8":{time:"8:00"},8:{time:"8:00"},"at 10":{time:"10:00"},10:{time:"10:00"},"at 9":{time:"9:00"},9:{time:"9:00"},"at 11":{time:"11:00"},11:{time:"11:00"},"at 12":{time:"12:00"},12:{time:"12:00"},"at 13":{time:"1:00 p.m."},"at 14":{time:"2:00 p.m."},"at 15":{time:"3:00 p.m."},"at 16":{time:"4:00 p.m."}},g={yes:{bool:!0},yep:{bool:!0},"of course":{bool:!0},sure:{bool:!0},"I want to":{bool:!0},no:{bool:!1},"no way":{bool:!1},"hell no":{bool:!1},nope:{bool:!1}},E={help:"H"};let b=0;const S={initial:"welcome",states:{init:{on:{CLICK:"welcome"}},maxspeech:{entry:y("I cannot hear you. Don't be so shy! Let me say that again."),on:{ENDSPEECH:"appointment.hist"}},welcome:{initial:"prompt",on:{ENDSPEECH:"appointment"},states:{prompt:{entry:y("Let's create an appointment")}}},appointment:{initial:"who",on:{RECOGNISED:{cond:t=>t.recResult in E,target:"#help"}},states:{hist:{type:"history"},who:Object(n.a)({initial:"prompt",on:{RECOGNISED:[{cond:t=>"person"in(h[t.recResult]||{}),actions:[Object(c.b)((t=>({person:h[t.recResult].person}))),d("maxsp")],target:"day"},{cond:t=>t.recResult in E,target:"#help"},{actions:d("maxsp"),target:".nomatch"}],MAXSPEECH:[{cond:()=>b++<=2,target:"#root.dm.appointment.maxspeech"},{target:"#root.dm.appointment.final"}]}},u(y("Who are you meeting with?"),"Tell me a name","Sorry, I don't know them")),day:Object(n.a)({initial:"prompt",on:{RECOGNISED:[{cond:t=>"day"in(h[t.recResult]||{}),actions:[Object(c.b)((t=>({day:h[t.recResult].day}))),d("maxsp")],target:"wholeday"},{cond:t=>t.recResult in E,target:"#help"},{actions:d("maxsp"),target:".nomatch"}],MAXSPEECH:[{cond:()=>b++<=2,target:"#root.dm.appointment.maxspeech"},{target:"#root.dm.appointment.final"}]}},u(l((t=>({type:"SPEAK",value:"OK. ".concat(t.person,". On which day is your meeting?")}))),"Tell me a day of the week","Sorry, I did not get that.")),wholeday:Object(n.a)({initial:"prompt",on:{RECOGNISED:[{cond:t=>"bool"in(g[t.recResult]||{})&&!0===g[t.recResult].bool,actions:d("maxsp"),target:"whole_day_confirmation"},{cond:t=>"bool"in(g[t.recResult]||{})&&!1===g[t.recResult].bool,actions:d("maxsp"),target:"time"},{cond:t=>t.recResult in E,target:"#help"},{cond:t=>!(t.recResult in E),target:".nomatch"}],MAXSPEECH:[{cond:()=>b++<=2,target:"#root.dm.appointment.maxspeech"},{target:"#root.dm.appointment.final"}]}},u(l((t=>({type:"SPEAK",value:"OK. ".concat(t.person," on ").concat(t.day,". Will it take the whole day?")}))),"Will it take the entire day?","Sorry, I'm afraid that I don't understand")),time:Object(n.a)({initial:"prompt",on:{RECOGNISED:[{cond:t=>"time"in(h[t.recResult]||{}),actions:[d("maxsp"),Object(c.b)((t=>({time:h[t.recResult].time})))],target:"time_confirmation"},{cond:t=>t.recResult in E,target:"#help"},{actions:d("maxsp"),target:".nomatch"}],MAXSPEECH:[{cond:()=>b++<=2,target:"#root.dm.appointment.maxspeech"},{target:"#root.dm.appointment.final"}]}},u(l((t=>({type:"SPEAK",value:"OK. What time is your meeting?"}))),"When does your meeting start?","Sorry, I don't understand")),whole_day_confirmation:Object(n.a)({initial:"prompt",on:{RECOGNISED:[{cond:t=>"bool"in(g[t.recResult]||{})&&!0===g[t.recResult].bool,actions:d("maxsp"),target:"confirmed"},{cond:t=>"bool"in(g[t.recResult]||{})&&!1===g[t.recResult].bool,actions:d("maxsp"),target:"wholeday"},{cond:t=>t.recResult in E,target:"#help"},{actions:d("maxsp"),target:".nomatch"}],MAXSPEECH:[{cond:()=>b++<=2,target:"#root.dm.appointment.maxspeech"},{target:"#root.dm.appointment.final"}]}},u(l((t=>({type:"SPEAK",value:"OK. Do you want me to create an appointment with ".concat(t.person," on ").concat(t.day," for the whole day?")}))),"Say yes or no","Sorry, I do not understand")),time_confirmation:Object(n.a)({initial:"prompt",on:{RECOGNISED:[{cond:t=>!0===g[t.recResult].bool,actions:d("maxsp"),target:"confirmed"},{cond:t=>!1===g[t.recResult].bool,actions:d("maxsp"),target:"who"},{cond:t=>t.recResult in E,target:"#help"},{actions:d("maxsp"),target:".nomatch"}],MAXSPEECH:[{cond:()=>b++<=2,target:"#root.dm.appointment.maxspeech"},{target:"#root.dm.appointment.final"}]}},u(l((t=>({type:"SPEAK",value:"OK. Do you want me to create an appointment with ".concat(t.person," on ").concat(t.day," at ").concat(t.time,"?")}))),"Say yes or no","Sorry, I do not understand")),confirmed:{initial:"prompt",on:{ENDSPEECH:"#root.dm.init"},states:{prompt:{entry:l((t=>({type:"SPEAK",value:"Your appointment has been created!"})))}}}}},help:{id:"help",entry:y("We can go back if you need help"),always:[{target:"appointment.hist",actions:Object(c.b)((t=>({count:b-1})))}]},final:{entry:y("Let me know if you change your mind about talking to me"),on:{ENDSPEECH:"#root.dm.init"}}}};function O(t){return Object(c.q)((e=>({type:"SPEAK",value:t})))}const j={initial:"init",states:{init:{on:{CLICK:"welcome"}},welcome:Object(n.a)({id:"start",on:{RECOGNISED:{target:"query",actions:Object(c.b)((t=>({activity:t.recResult})))}}},(R="What would you like to do? You can choose appointment, to do item or timer.",{initial:"prompt",states:{prompt:{entry:O(R),on:{ENDSPEECH:"ask"}},ask:{entry:Object(c.q)("LISTEN")}}})),query:{invoke:{id:"rasa",src:(t,e)=>{return o=t.activity,fetch(new Request("https://cors-anywhere.herokuapp.com/https://dmappointment.herokuapp.com/model/parse",{method:"POST",headers:{Origin:"http://maraev.me"},body:'{"text": "'.concat(o,'"}')})).then((t=>t.json()));var o},onDone:{target:"processer",actions:[Object(c.b)(((t,e)=>({activity:e.data.intent.name}))),(t,e)=>console.log(e.data)]},onError:{target:"welcome",actions:(t,e)=>console.log(e.data)}}},processer:{initial:"prompt",on:{ENDSPEECH:[{target:"todo_item",cond:t=>"todo_item"===t.activity},{target:"timer",cond:t=>"timer"===t.activity},{target:"appointment",cond:t=>"appointment"===t.activity},{target:".nomatch"}]},states:{prompt:{entry:Object(c.q)((t=>({type:"SPEAK",value:"OK"})))},nomatch:{entry:O("Sorry, I don't understand"),on:{ENDSPEECH:"#start"}}}},todo_item:{initial:"prompt",on:{ENDSPEECH:"init"},states:{prompt:{entry:Object(c.q)((t=>({type:"SPEAK",value:"Welcome to To do item"})))}}},timer:{initial:"prompt",on:{ENDSPEECH:"init"},states:{prompt:{entry:Object(c.q)((t=>({type:"SPEAK",value:"Welcome to timer"})))}}},appointment:Object(n.a)({},S)}};var R,C=o(22),w=o(13);Object(p.a)({url:"https://statecharts.io/inspect",iframe:!1});const P=Object(r.a)({id:"root",type:"parallel",states:{dm:Object(n.a)({},j),asrtts:{initial:"idle",states:{idle:{on:{LISTEN:"recognising",SPEAK:{target:"speaking",actions:Object(c.b)(((t,e)=>({ttsAgenda:e.value})))}}},recognising:{initial:"progress",entry:"recStart",exit:"recStop",on:{ASRRESULT:{actions:["recLogResult",Object(c.b)(((t,e)=>({recResult:e.value})))],target:".match"},RECOGNISED:"idle",MAXSPEECH:"idle"},states:{progress:{},match:{entry:Object(c.q)("RECOGNISED")}}},speaking:{entry:"ttsStart",on:{ENDSPEECH:"idle"}}}}}},{actions:{recLogResult:t=>{console.log("<< ASR: "+t.recResult)},test:()=>{console.log("test")},logIntent:t=>{console.log("<< NLU intent: "+t.nluData.intent.name)}}}),x=t=>{switch(!0){case t.state.matches({asrtts:"recognising"}):return Object(w.jsx)("button",Object(n.a)(Object(n.a)({type:"button",className:"glow-on-hover",style:{animation:"glowing 20s linear"}},t),{},{children:"Listening..."}));case t.state.matches({asrtts:"speaking"}):return Object(w.jsx)("button",Object(n.a)(Object(n.a)({type:"button",className:"glow-on-hover",style:{animation:"bordering 1s infinite"}},t),{},{children:"Speaking..."}));default:return Object(w.jsx)("button",Object(n.a)(Object(n.a)({type:"button",className:"glow-on-hover"},t),{},{children:"Click to start"}))}};function v(){const t=Object(C.useSpeechSynthesis)({onEnd:()=>{l("ENDSPEECH")}}),e=t.speak,o=t.cancel,n=(t.speaking,Object(C.useSpeechRecognition)({onResult:t=>{l({type:"ASRRESULT",value:t})}})),i=n.listen,r=(n.listening,n.stop),c=Object(s.b)(P,{devTools:!0,actions:{recStart:Object(s.a)((()=>{console.log("Ready to receive a color command."),i({interimResults:!1,continuous:!0})})),recStop:Object(s.a)((()=>{console.log("Recognition stopped."),r()})),changeColour:Object(s.a)((t=>{console.log("Repainting..."),document.body.style.background=t.recResult})),changeAction:Object(s.a)((t=>{console.log("Action performed")})),ttsStart:Object(s.a)(((t,o)=>{console.log("Speaking..."),e({text:t.ttsAgenda})})),ttsCancel:Object(s.a)(((t,e)=>{console.log("TTS STOP..."),o()}))}}),p=Object(a.a)(c,3),m=p[0],l=p[1];p[2];return Object(w.jsx)("div",{className:"App",children:Object(w.jsx)(x,{state:m,onClick:()=>l("CLICK")})})}const N=document.getElementById("root");i.render(Object(w.jsx)(v,{}),N)}},[[40,1,2]]]);
//# sourceMappingURL=main.a18a211e.chunk.js.map