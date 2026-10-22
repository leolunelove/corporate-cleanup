import{mallFloor}from'./mall.js?v=bbc58094a157';
const openingEase=x=>{x=Math.max(0,Math.min(1,x));return x*x*x*(x*(x*6-15)+10);};
// Heel contacts follow the distance-based gait, including the eased start/stop.
const openingWalkCues=Array.from({length:6},(_,i)=>{const target=(i+1)*Math.PI/.19/100;let low=0,high=1;for(let n=0;n<24;n++){const mid=(low+high)/2;if(openingEase(mid)<target)low=mid;else high=mid;}return{at:34+(low+high)/2*3.3,kind:'film_step',volume:i%2?.13:.15,pan:i%2?.06:-.06};});
// Authored presentation only. Neither crowds nor camera advance the mission simulation.
export function mallOpeningFrame(time,reduced=false,anchor={}){
 const t=Math.max(0,Math.min(40,time)),section=t<10?0:t<18?1:t<26?2:t<32?3:4,u=openingEase((t-[0,10,18,26,32][section])/[10,8,8,6,8][section]);let lens;
 if(section===0)lens={x:540+(reduced?0:u*100),y:390,z:18,offsetX:95,height:245,offsetZ:290,zoom:1.55};
 if(section===1)lens={x:210,y:238,z:24,offsetX:95,height:155,offsetZ:210,zoom:2.25};
 if(section===2||section===3)lens={x:620,y:315,z:18,offsetX:60,height:230,offsetZ:150,zoom:2.6};
 const walkU=Math.max(0,Math.min(1,(t-34)/3.3)),walk=openingEase(walkU),walkSpeed=100/3.3*30*walkU**2*(walkU-1)**2,hero={x:110+100*walk,y:380,face:0,vx:walkSpeed,vy:0};
 if(section===4){const hand=openingEase((t-37)/3),mobile=anchor?.mobile,zoom=mobile&&anchor.aspect<.85?1.12:1.5,gameX=mobile?210:300;lens={x:hero.x+(gameX-hero.x)*hand,y:380,z:20*(1-hand),offsetX:140+120*hand,height:200+430*hand,offsetZ:240+250*hand,zoom:2.2+(zoom-2.2)*hand};}
 // Conceal scene changes; the before/after shot shares an identical lens.
 const cuts=[10,18,32],matchFade=t>=25.4&&t<26?openingEase((t-25.4)/.6):t>=26&&t<27.6?1-openingEase((t-26)/1.6):0,fade=Math.max(0,matchFade,...cuts.map(c=>1-Math.abs(t-c)/.4),t<.65?1-openingEase(t/.65):0);
 return {time:t,duration:40,shot:section,storyBeat:'mall-before',mallOpening:true,life:t<26,retail:t<32,heroPosition:hero,hideHero:t<32,liftIncoming:section===4,liftDoor:section===4?1-openingEase((t-32.5)/1.1):0,heroProgress:1,heroSpeed:0,heroGait:100*walk*.19,ready:section===4?.25+.75*openingEase((t-37)/3):0,showThreat:false,lens,fade,caption:['MERIDIAN / TWO DAYS BEFORE CONTAINMENT','The pharmacy closed early. Security called it a precaution.',(t<22.15?'PA: “Please do not approach the affected—”':'The announcement stopped. Nobody came.'),'FORTY-EIGHT HOURS LATER / Every exit was sealed.','VANTAGE: Clear the lot. A survivor signal is coming from inside.'][section],reveal:openingEase((t-39.3)/.7),done:time>=40,reduced};
}
export function mallLifePeople(t){
 const people=[];
 for(let i=0;i<9;i++){
  const lane=i%3,left=lane===0?400:lane===1?550:380,width=lane===0?430:lane===1?330:210,travel=20-lane*3,dwell=2+lane*.3,cycle=2*(travel+dwell),offset=Math.floor(i/3)*cycle/3+3,reaction=19.1+i*.16,u=Math.max(0,Math.min(1,(t-reaction)/.85)),clock=t<=reaction?t:reaction+.85*(u-u*u/2),local=(clock+offset)%cycle,back=local>=travel+dwell,leg=back?local-travel-dwell:local,progress=openingEase(leg/travel),x=left+width*(back?1-progress:progress),moving=leg<travel&&u<1;
  const v=leg<travel?width/travel*30*Math.max(0,leg/travel)**2*(leg/travel-1)**2*(1-u):0;
  let face=back?Math.PI:0;if(leg>=travel){const glance=Math.sin(Math.PI*Math.min(1,(leg-travel)/dwell));face+=(lane===0?-1:1)*glance*.8;}
  const look=openingEase((t-reaction-.25)/1.3),toward=Math.atan2(315-[272,435,520][lane],610-x),delta=Math.atan2(Math.sin(toward-face),Math.cos(toward-face));face+=delta*look;
  const distance=(back?width+progress*width:progress*width)+Math.floor((clock+offset)/cycle)*width*2;
  people.push({id:'shopper-'+i,x,y:[272,435,520][lane]+Math.sin(progress*Math.PI)*(back?-18:18),face,headLook:Math.sin(t*.65+i)*.12*(1-look),phase:distance*.19+i,speed:v,moving,gesture:i%3===1?.35+.25*Math.sin(t*1.2+i):0,bag:i%4===0,phone:i===4,reaction:look,startle:Math.sin(Math.PI*openingEase((t-reaction)/1.4)),shirt:['#8a6859','#667e89','#b3a681','#7c8966'][i%4],skin:['#c49e80','#805c45','#d0af91'][i%3]});
 }
 people.push({x:540,y:480,face:0,phase:0,speed:0,moving:false,mopMotion:Math.sin(t*1.1)*.12,cleaner:true,shirt:'#688d87',skin:'#aa8061'});
 // A guard rushes along a clear concourse lane; a shopper collapses and is helped.
 people.push({visible:t>10,x:800-Math.max(0,Math.min(1,(t-10)/7))*540,y:240,face:Math.PI,phase:t*10,speed:t>10&&t<17?77:0,moving:t>10&&t<17,shirt:'#495d70',skin:'#bd9375',guard:true});
 people.push({x:610,y:315,face:.2,phase:0,moving:false,buckle:openingEase((t-18.65)/.9)*(1-openingEase((t-20.15)/.85)),fall:openingEase((t-19.35)/1.65),shirt:'#9c8563',skin:'#c5a080'});
 const helpU=Math.max(0,Math.min(1,(t-19.5)/2)),approach=openingEase(helpU),helpSpeed=Math.hypot(70,15)/2*30*helpU**2*(helpU-1)**2;
 people.push({x:720-70*approach,y:350-15*approach,face:Math.PI+Math.atan2(15,70)+(Math.PI/2-Math.atan2(15,70))*openingEase((t-21.2)/.6),phase:Math.hypot(70,15)*approach*.19,speed:helpSpeed,moving:helpSpeed>.01,kneel:openingEase((t-21.5)/1.5),help:openingEase((t-22.3)/.7),shirt:'#6e818b',skin:'#94694e'});
 return people;
}
export function stageMallOpening(g,frame){if(!frame.retail)return g;const m=mallFloor(1),clean=frame.life;
 const cover=m.cover.filter(o=>o.kind!=='gate'&&(!clean||!['abandoned-cart','fallen-sofa','service-trolley'].includes(o.id)));
 return {...g,mission:{...m,id:clean?'mall-before':'mall-memory-ruins',beforeOutbreak:clean,memoryRuins:!clean,cover},cover,mallProps:clean?(g.mallProps||[]).filter(p=>['bottle','screen'].includes(p.kind)):[],brokenProps:[],bodies:[],bloodStains:[],filmCivilians:clean?mallLifePeople(frame.time):[],mallLifeClock:frame.time,enemies:[],companion:null};
}
export function mallOpeningCues(previous,time){const cues=[
 {at:.2,kind:'film_mall',volume:.45,pan:0},{at:.3,kind:'film_crowd',volume:.6,pan:-.35},{at:2.1,kind:'film_chat_coffee',volume:.17,pan:-.4,speech:'Did you want to grab a coffee before we go?',rate:1.02},
 {at:6,kind:'film_mall',volume:.3,pan:.2},{at:6.5,kind:'film_crowd',volume:.45,pan:.4},{at:7.4,kind:'film_chat_shops',volume:.13,pan:.4,speech:'I think the shoe shop is just up here.',rate:1.07},
 {at:11,kind:'film_chime',volume:.27,pan:-.3},{at:11.6,kind:'film_crowd',volume:.25,pan:-.2},
 {at:13,kind:'film_pa',volume:.12,pan:0,speech:'Attention shoppers. Please remain calm. Security is responding to an incident near the pharmacy. Please do not approach the affected area. Remain inside the mall and wait for further instructions. Staff will assist anyone who needs help. Please stay where you are.',rate:.98,announcement:true},
 {at:15,kind:'film_metal',volume:.2,pan:-.4},{at:18.5,kind:'film_step',volume:.18,pan:.3},{at:20,kind:'film_impact',volume:.19,pan:0},
 {at:22.15,kind:'film_disconnect',volume:.24,pan:0,cut:['film_pa'],stopSpeech:true},
 {at:25.55,cut:'all',stopSpeech:true},{at:27.3,kind:'film_breath',volume:.15,pan:-.4},{at:28.1,kind:'film_drone',volume:.32,pan:.1},{at:30.1,kind:'film_metal',volume:.12,pan:.5},
 {at:32.4,kind:'mechanical',volume:.2,pan:0},...openingWalkCues];return cues.filter(c=>c.at>previous&&c.at<=time);}

export function cinematicAudioMix(time,mode,showing){if(showing&&mode==='mall-lift-ride')return{music:0,ambience:0};if(showing&&mode?.startsWith('mall-lift-'))return{music:.12,ambience:.3};if(!showing||mode!=='mall-before')return{music:1,ambience:1};return{music:time>=25.5&&time<28.1?0:.12,ambience:time<25.5?.12:time<28.1?0:1};}
