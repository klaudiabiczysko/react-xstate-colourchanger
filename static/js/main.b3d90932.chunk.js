(this["webpackJsonpxstate-react-typescript-template"]=this["webpackJsonpxstate-react-typescript-template"]||[]).push([[0],{21:function(e,t,n){"use strict";n.r(t);var o=n(20),a=n(10),s=(n(25),n(7),n(18)),i=n(2),c=n(32),l=n(13),r=n(16);const p="#JSGF V1.0; grammar colors; public <color> = "+["aqua","azure","beige","bisque","black","blue","brown","chocolate","coral","crimson","cyan","fuchsia","ghostwhite","gold","goldenrod","gray","green","indigo","ivory","khaki","lavender","lime","linen","magenta","maroon","moccasin","navy","olive","orange","orchid","peru","pink","plum","purple","red","salmon","sienna","silver","snow","tan","teal","thistle","tomato","turquoise","violet","white","yellow"].join(" | ")+" ;",g=new webkitSpeechGrammarList;g.addFromString(p,1);const u=g,m=Object(i.k)((e=>({type:"SPEAK",value:"Repainting to ".concat(e.recResult)}))),b=Object(c.a)({id:"machine",type:"parallel",states:{dm:{initial:"init",states:{init:{on:{CLICK:"welcome"}},welcome:{initial:"prompt",on:{MATCH:"repaint"},states:{prompt:{entry:(d="Tell me the colour",Object(i.k)((e=>({type:"SPEAK",value:d})))),on:{ENDSPEECH:"ask"}},ask:{entry:Object(i.k)("LISTEN")}}},repaint:{initial:"prompt",states:{prompt:{entry:m,on:{ENDSPEECH:"repaint"}},repaint:{entry:"changeColour",always:"#machine.dm.welcome"}}}}},asrtts:{initial:"idle",states:{idle:{on:{LISTEN:"recognising",SPEAK:"speaking"}},recognising:{entry:"recStart",exit:["recStop",Object(i.b)({recResult:(e,t)=>t.value})],on:{MATCH:{actions:"recLogResult",target:"idle"}}},speaking:{entry:[Object(i.b)({ttsAgenda:(e,t)=>t.value}),"ttsStart"],on:{ENDSPEECH:"idle"}}}}}},{actions:{recLogResult:e=>{console.log("<< ASR: "+e.recResult)},test:()=>{console.log("test")},logIntent:e=>{console.log("<< NLU intent: "+e.nluData.intent.name)}}});var d;function h(){const e=Object(r.useSpeechSynthesis)({onEnd:()=>{d("ENDSPEECH")}}),t=e.speak,n=e.cancel,s=(e.speaking,Object(r.useSpeechRecognition)({onResult:e=>{d({type:"MATCH",value:e})}})),i=s.listen,c=(s.listening,s.stop),p=Object(l.b)(b,{actions:{recStart:Object(l.a)((()=>{console.log("Ready to receive a color command."),i({interimResults:!1,continuous:!1,grammars:u})})),recStop:Object(l.a)((()=>{console.log("Recognition stopped."),c()})),changeColour:Object(l.a)((e=>{console.log("Repainting..."),document.body.style.background=e.recResult})),ttsStart:Object(l.a)(((e,n)=>{console.log("Speaking..."),t({text:e.ttsAgenda})})),ttsCancel:Object(l.a)(((e,t)=>{console.log("TTS STOP..."),n()}))}}),g=Object(o.a)(p,2),m=g[0],d=g[1];m.matches({asrtts:"recognising"});switch(!0){case m.matches({asrtts:"recognising"}):return Object(a.jsx)("div",{className:"App",children:Object(a.jsx)("button",{type:"button",className:"glow-on-hover",style:{animation:"glowing 20s linear"},children:"Listening..."})});case m.matches({asrtts:"speaking"}):return Object(a.jsx)("div",{className:"App",children:Object(a.jsx)("button",{type:"button",className:"glow-on-hover",style:{animation:"bordering 1s infinite"},children:"Speaking..."})});default:return Object(a.jsx)("div",{className:"App",children:Object(a.jsx)("button",{type:"button",className:"glow-on-hover",onClick:()=>d("CLICK"),children:"Click to start"})})}}const j=document.getElementById("root");s.render(Object(a.jsx)(h,{}),j)},25:function(e,t,n){}},[[21,1,2]]]);
//# sourceMappingURL=main.b3d90932.chunk.js.map