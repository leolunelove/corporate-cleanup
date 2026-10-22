import{createMallProps}from'./mall-props.js?v=a060976fb0fa';
import{planLiftWalk}from'./lift.js?v=a060976fb0fa';
import{navigateEnemy,clearRoute}from'./navigation.js?v=a060976fb0fa';
// Five linked floors; all combat and companion state remains renderer-independent.
// Every solid prop is rendered from this exact footprint. Flat paint/litter never blocks.
const mallProp=(id,kind,x,y,w,h,extra={})=>({id,kind,x,y,w,h,...extra});
const perimeter=()=>[mallProp('north','wall',20,20,1160,14),mallProp('south','wall',20,726,1160,14,{low:true}),mallProp('west','wall',20,34,14,692),mallProp('east','wall',1166,34,14,692)];
const arrivalBay=()=>[mallProp('arrival-top','wall',50,298,130,12),mallProp('arrival-bottom','wall',50,450,130,12),mallProp('arrival-back','wall',50,310,12,140)];
const liftBay=()=>[mallProp('lift-top','wall',1070,298,96,12),mallProp('lift-bottom','wall',1070,450,96,12),mallProp('lift-back','lift',1154,310,12,140)];
const storefronts=(quiet=false)=>[
 mallProp('pharmacy','shop',90,50,235,180,{title:'MERIDIAN PHARMACY',color:'#5c8177'}),
 mallProp('fashion','shop',365,50,235,180,{title:quiet?'AFTER HOURS':'LAST SEASON',color:'#a17870'}),
 mallProp('electronics','shop',640,50,235,180,{title:'VOLT / ELECTRONICS',color:'#6c8098'}),
 mallProp('cafe','shop',90,570,235,140,{title:'NIGHT OWL COFFEE',color:'#a68d63',south:true}),
 mallProp('sports','shop',365,570,235,140,{title:'STRIDE / SPORTS',color:'#71826b',south:true}),
 mallProp('food','shop',640,590,235,120,{title:'FOOD COURT',color:'#9a7861',south:true})];
// Open entrances face the concourse. Walls, displays and counters share render footprints.
function shopSolids(quiet){return storefronts(quiet).flatMap(s=>{
 const front=s.south?s.y:s.y+s.h-8,back=s.south?s.y+s.h-10:s.y;
 return [mallProp(s.id+'-back','wall',s.x,back,s.w,10),
 mallProp(s.id+'-left','wall',s.x,s.y,10,s.h),mallProp(s.id+'-right','wall',s.x+s.w-10,s.y,10,s.h),
 mallProp(s.id+'-window-a','glass',s.x+10,front,48,8,{material:'glass',hp:22}),
 mallProp(s.id+'-window-b','glass',s.x+s.w-58,front,48,8,{material:'glass',hp:22}),
 mallProp(s.id+'-shelf','shelf',s.x+18,s.south?s.y+s.h-34:s.y+20,s.w-36,20,{theme:s.id,material:'wood'}),
 mallProp(s.id+'-counter','counter',s.x+18,s.south?s.y+45:s.y+s.h-68,48,24,{material:'wood'})];
 });}
const concourseClutter=()=>[
 mallProp('abandoned-cart','stall',530,490,70,40,{material:'wood'}),
 mallProp('fallen-sofa','sofa',760,485,92,36,{material:'fabric'}),
 mallProp('cafe-table','table',240,540,36,20,{material:'wood'}),
 mallProp('service-trolley','stall',800,245,48,32,{material:'metal'})];
const securityRoom=()=>[
 mallProp('security-back','wall',940,65,210,12),mallProp('security-west','wall',940,77,12,113),
 mallProp('security-door','door',940,190,12,95),mallProp('security-jamb','wall',940,285,12,27),
 mallProp('security-south','wall',952,300,198,12,{low:true}),mallProp('security-east','wall',1138,77,12,223),
 mallProp('security-desk','desk',1020,90,90,36)];
const gunStore=()=>[
 mallProp('arms-west','wall',940,510,12,202),mallProp('arms-east','wall',1138,510,12,202),mallProp('arms-back','wall',952,700,186,12),
 mallProp('arms-front-left','wall',952,510,38,12,{low:true}),mallProp('arms-front-right','wall',1080,510,58,12,{low:true}),
 mallProp('arms-rack-a','rack',962,558,18,100),mallProp('arms-lift-top','wall',1056,570,82,10),mallProp('arms-lift-bottom','wall',1056,658,82,10),mallProp('arms-counter','counter',1000,663,100,25)];
export function mallGates(index){return index===2||index===4?[]:(index===0?[430,800]:[345,900]).map((x,i)=>mallProp('gate-'+i,'gate',x,34,12,692,{parking:index===0}));}
// Authored entrances sit on walkable paths beside cars or in actual shop mouths.
export function mallEntrances(floor){const data=floor===0?[
 [0,325,250,325,315,'cars'],[0,230,510,230,455,'cars'],
 [1,585,250,585,315,'cars'],[1,650,510,650,450,'cars'],
 [2,930,250,930,315,'cars'],[2,1030,510,1030,455,'cars']
 ]:floor===1||floor===3?[
 [0,208,250,208,315,'shop'],[0,208,550,208,515,'shop'],
 [1,482,250,482,300,'shop'],[1,700,250,700,350,'shop'],[1,482,550,482,500,'shop'],
 [2,1140,490,1080,490,'service']
 ]:floor===4?[[0,140,194,140,250,'roof'],[0,1125,610,1055,610,'service']]:[];return data.map(([sector,x,y,toX,toY,kind],i)=>({id:'entrance-'+floor+'-'+i,sector,x,y,toX,toY,kind}));}
export function mallLayout(index){
 const bounds=[...perimeter(),...arrivalBay()];
 if(index===0)return [...bounds,...liftBay(),...mallGates(index),...[[235,150],[520,150],[850,150],[190,545],[550,545],[870,545]].map(([x,y],i)=>mallProp('car-'+i,'car',x,y,166,74,{color:['#697b79','#6b4d45','#8c8b79'][i%3]})),mallProp('parking-column-a','pillar',465,267,26,26),mallProp('parking-column-b','pillar',815,462,26,26),mallProp('lift-power','power',743,342,28,30),mallProp('paystation','paystation',90,110,40,35),mallProp('entry-planter','planter',1000,80,75,64)];
 if(index===4)return [...bounds,mallProp('vent-a','vent',290,170,150,80),mallProp('vent-b','vent',700,540,170,85),mallProp('roof-access','roofaccess',70,70,150,105)];
 const furniture=index===2?[mallProp('bench-a','bench',270,390,105,27),mallProp('planter-a','planter',900,470,68,68)]:[mallProp('kiosk','kiosk',390,340,135,75,{title:index===3?'MERIDIAN DIRECTORY':'PHONE REPAIR'}),mallProp('bench-a','bench',180,460,115,27),mallProp('bench-b','bench',730,300,115,27),mallProp('planter-a','planter',620,470,68,68)];
 return [...bounds,...mallGates(index),...shopSolids(index===2),...concourseClutter(),...furniture,...(index===1?[...securityRoom(),...gunStore()]:liftBay())];
}
const mallSectionNames=[['PARKING ENTRANCE','PARKING AISLES','MALL SERVICE LIFT'],['WEST CONCOURSE','RETAIL GALLERIES','SECURITY / KESSLER ARMS'],['THE HOST'],['UPPER WEST WING','FOOD COURT','ROOFTOP ACCESS']];
const names=['PARKING / SERVICE LIFT','LEVEL 2 / RETAIL CONCOURSE','LEVEL 3 / THE HOST','LEVEL 4 / UPPER GALLERIES','ROOF / EXTRACTION'];
export function mallFloor(index){return {id:'mall-'+index,operationId:'mall',mall:true,floorIndex:index,name:'DEAD MALL',location:names[index],mode:'mall',entrances:mallEntrances(index),powerControl:index===0?{x:757,y:405}:null,shops:index>0&&index<4?storefronts(index===2):[],brief:'Five floors. One extraction. Keep your gear and health between floors.',start:{x:110,y:380},targets:[{x:index===1?900:980,y:index===1?240:380}],extract:{x:1090,y:index===1?620:380},boss:{x:720,y:index===0?420:350},holdTime:0,cover:mallLayout(index),color:index===0?'#555d59':'#5d5950',accent:'#d0b880',rewardSlots:['shotgun','dualPistols','armor'],rewardLabel:'Sidearms & survival gear'};}
export function enterMallFloor(g,index,makeEnemy){g.mallEntryPending=false;g.mallFloor=index;g.mission=mallFloor(index);g.cover=[...g.mission.cover];g.mallProps=createMallProps(index);g.brokenProps=[];g.fixtureHealth={};g.propSerial=0;g.p.x=110;g.p.y=380;g.p.vx=g.p.vy=0;g.enemies=[];g.shots=[];g.hostileShots=[];g.reload=0;g.swap=0;g.pump=0;g.dodge=0;g.fx=[];g.impacts=[];g.surfaceMarks=[];g.bodies=[];g.bloodStains=[];g.loot.forEach(d=>g.bag.push(d.item));g.loot=[];g.lockTarget=null;g.navigation?.clear();g.mallSpawned=0;g.mallClock=0;g.mallPower=index!==0;g.mallPowerProgress=0;g.mallEntranceSerial=0;g.mallRescued=false;g.mallSector=0;g.mallAwaitingEntry=false;g.interact=0;g.phase='mall';g.bossSpawned=false;g.bossDefeated=false;g.mallWaveClock=0;g.companion=null;if(index===2){g.p.x=580;g.p.y=350;g.companion={r:16,x:720,y:350,face:Math.PI,hp:100,vx:0,vy:0};g.storyBeat='mall-transform';}else if(index!==4){g.mallSector=0;for(let sector=0;sector<3;sector++)placeMallSection(g,sector,makeEnemy);if(index===1)g.enemies.push({...makeEnemy('brute',1060,620,g.tier,.44),dormant:true,rescueGuard:true},{...makeEnemy('runner',1090,550,g.tier,.6),dormant:true,rescueGuard:true});spawnMallSection(g,makeEnemy); }if(index===4)g.events.push('objective');}

function placeMallSection(g,sector,makeEnemy){const floor=g.mallFloor,portals=mallEntrances(floor).filter(p=>p.sector===sector);
 if(portals.length){const count=(floor===0?[3,4,4]:floor===3?[4,8,5]:[5,8,6])[sector];for(let i=0;i<count;i++){const portal=portals[i%portals.length],type=floor===0?(i===count-1&&sector>0?'runner':'walker'):i===count-1&&sector===1?'spitter':i%4===3?'runner':'walker';g.enemies.push({...makeEnemy(type,portal.x,portal.y,g.tier,(i+sector*10)/40),dormant:true,mallSection:sector,entranceState:'hidden',entranceId:portal.id,entrance:portal,entranceDelay:.8+Math.floor(i/portals.length)*2.1,face:Math.atan2(portal.toY-portal.y,portal.toX-portal.x),vx:0,vy:0});}return;}
 const gates=mallGates(floor),left=sector===0?60:gates[sector-1].x+35,right=sector<2?gates[sector].x-30:1130,entry={x:sector===0?110:gates[sector-1].x+28,y:380},count=[4,8,5][sector],points=[];
 for(let y=280;y<=535;y+=48)for(let x=left+35;x<right-15;x+=48)if(!g.cover.some(o=>x+24>o.x&&x-24<o.x+o.w&&y+24>o.y&&y-24<o.y+o.h)&&Math.hypot(x-entry.x,y-entry.y)>155)points.push({x,y});
 for(let i=0;i<count;i++){const point=points[Math.floor(i*points.length/count)];if(point)g.enemies.push({...makeEnemy(i%7===6?'spitter':i%3===1?'runner':'walker',point.x,point.y,g.tier,(i+sector*10)/40),dormant:true,mallSection:sector,face:Math.PI,vx:0,vy:0});}}
function spawnMallSection(g,makeEnemy){for(const enemy of g.enemies)if(enemy.mallSection===g.mallSector){enemy.dormant=false;if(enemy.entrance){enemy.entranceAt=g.mallClock+enemy.entranceDelay;enemy.entranceState='hidden';}else enemy.wake=.6;}g.mallAwaitingEntry=false;}
export function updateMallEntrances(g,dt){for(const e of g.enemies){if(e.hp<=0||e.dormant||!e.entrance||e.entranceState==='done')continue;const age=g.mallClock-e.entranceAt;e.vx=e.vy=0;if(age<0)continue;if(age<.9){if(e.entranceState==='hidden'){e.entranceState='warning';g.events.push('mall_arrival');g.mallEntranceSerial++;}continue;}const t=Math.min(1,(age-.9)/1.15),u=t*t*(3-2*t),p=e.entrance,oldX=e.x,oldY=e.y;e.x=p.x+(p.toX-p.x)*u;e.y=p.y+(p.toY-p.y)*u;e.vx=(e.x-oldX)/dt;e.vy=(e.y-oldY)/dt;e.face=Math.atan2(p.toY-p.y,p.toX-p.x);e.entranceState=t<1?'entering':'done';e.entranceProgress=t;}}
function advanceMallSection(g,makeEnemy){if(g.mallFloor===2||g.mallFloor===4||g.mallRescued)return;const gates=mallGates(g.mallFloor);if(g.mallAwaitingEntry){const crossed=gates[g.mallSector-1];if(g.p.x>crossed.x+28)spawnMallSection(g,makeEnemy);return;}if(g.mallSector<2&&!g.enemies.some(e=>e.hp>0&&!e.dormant)){if(g.mallFloor===0&&g.mallSector===1&&!g.mallPower)return;const gate=gates[g.mallSector];g.mallSector++;g.mallAwaitingEntry=true;g.cover=g.cover.filter(o=>o.id!==gate.id);g.navigation?.clear();g.events.push('sector_clear');}}

export function finishMallFilm(g,mode,makeEnemy){if(mode==='mall-lift-out'){const next=g.mallNextFloor;if(g.routeStep!==null&&g.routeStep!==undefined&&g.mallFloor>=g.mallEndFloor){g.loot.forEach(d=>g.bag.push(d.item));g.loot=[];g.mallIntermission=true;g.storyBeat=null;g.mallLiftPlan=null;g.status='won';return;}enterMallFloor(g,next,makeEnemy);g.mallArrivalStory=g.storyBeat;g.storyBeat=null;g.p.x=110;g.p.y=380;g.mallLiftPlan={walk:2.1,path:Array.from({length:21},(_,i)=>({x:110+i*5,y:380}))};return;}if(mode==='mall-lift-in'){g.p.x=210;g.p.y=380;g.p.face=0;g.p.vx=g.p.vy=0;g.storyBeat=g.mallArrivalStory||null;if(g.storyBeat==='mall-transform'){g.p.x=580;g.p.y=350;}g.mallEntryPending=!g.storyBeat&&[1,3,4].includes(g.mallFloor);g.mallArrivalStory=null;g.mallLiftPlan=null;return;}if(mode==='mall-rescue'){g.mallRescued=true;g.mallDoorOpenedAt=g.mallClock;g.cover=g.cover.filter(o=>o.id!=='security-door');g.navigation?.clear();g.optionalDone=true;g.companion={r:16,x:980,y:240,face:Math.PI,hp:100,vx:0,vy:0,cool:0};for(const e of g.enemies)if(e.rescueGuard){e.dormant=false;e.wake=.6;};}if(mode==='mall-transform'){g.companion=null;g.enemies=[makeEnemy('boss',720,350,g.tier,.8)];g.bossSpawned=true;g.mallEntryPending=true;g.events.push('boss_spawn');}}
export function requestMallLift(g,nextFloor,move){if(g.mallLiftPlan)return;const target={x:g.mallFloor===1?1090:1120,y:g.mission.extract.y},plan=planLiftWalk(g,target,move);if(!plan)return;g.mallLiftPlan=plan;g.mallNextFloor=nextFloor;g.storyBeat='mall-lift-out';}
export function updateMall(g,a,dt,makeEnemy,move){if(g.mallFloor===undefined)enterMallFloor(g,0,makeEnemy);if(g.storyBeat)return;if(g.mallEntryPending){if(!a.x&&!a.y&&!a.fire&&!a.dodge&&!a.interact)return;g.mallEntryPending=false;}g.mallClock+=dt;if(g.p.hp<=0)return;updateMallEntrances(g,dt);if(g.mallFloor===0&&g.mallSector===1&&!g.mallAwaitingEntry&&!g.mallPower&&!g.enemies.some(e=>e.hp>0&&!e.dormant)&&Math.hypot(g.p.x-g.mission.powerControl.x,g.p.y-g.mission.powerControl.y)<65&&a.interact){g.mallPowerProgress+=dt;if(g.mallPowerProgress>=1.25){g.mallPower=true;g.events.push('mall_power');}}else g.mallPowerProgress=0;advanceMallSection(g,makeEnemy);const floor=g.mallFloor,alive=g.enemies.some(e=>e.hp>0&&!e.dormant),near=p=>Math.hypot(g.p.x-p.x,g.p.y-p.y)<72;
 if(g.companion&&floor===1){const c=g.companion,dist=Math.hypot(g.p.x-c.x,g.p.y-c.y);c.vx=c.vy=0;if(dist>85){const path=navigateEnemy(g,c);c.vx=path.x*160;c.vy=path.y*160;move(c,c.vx*dt,c.vy*dt,g.cover);}c.cool=Math.max(0,(c.cool||0)-dt);const target=g.enemies.find(e=>e.hp>0&&!e.dormant&&Math.hypot(e.x-c.x,e.y-c.y)<300&&clearRoute(c,e,2,g.cover));c.face=target?Math.atan2(target.y-c.y,target.x-c.x):g.p.face;if(target&&!c.cool){c.cool=.65;const angle=c.face;g.shots.push({x:c.x+Math.cos(angle)*25,y:c.y+Math.sin(angle)*25,vx:Math.cos(angle)*1000,vy:Math.sin(angle)*1000,life:.8,weapon:'pistol',hit:new Set(),pierce:1});g.events.push('companion_shot');}}
 if(floor===1&&g.mallSector===2&&!g.mallAwaitingEntry&&!g.mallRescued&&!alive&&near(g.mission.targets[0])&&a.interact){g.interact+=dt;if(g.interact>=1){g.storyBeat='mall-rescue';g.interact=0;}}else g.interact=0;
 if(floor===4){if(g.mallClock<60){g.mallWaveClock-=dt;if(g.mallWaveClock<=0&&g.enemies.length<18){g.mallWaveClock=2;const portal=g.mission.entrances[g.mallSpawned++%g.mission.entrances.length];g.enemies.push({...makeEnemy(g.mallSpawned%4===0?'brute':'runner',portal.x,portal.y,g.tier,g.random()),entrance:portal,entranceId:portal.id,entranceState:'hidden',entranceAt:g.mallClock+.6,face:Math.atan2(portal.toY-portal.y,portal.toX-portal.x)});}}else if(near(g.mission.extract)){g.status='won';return;}}
 else if(!alive&&!g.mallAwaitingEntry&&(floor===2||g.mallSector===2)&&(floor!==1||g.mallRescued&&g.companion&&Math.hypot(g.companion.x-g.mission.extract.x,g.companion.y-g.mission.extract.y)<115)&&(floor!==2||g.bossDefeated&&g.time>=(g.bossDeathUntil||0))&&near(g.mission.extract)&&a.interact){g.mallLift=(g.mallLift||0)+dt;if(g.mallLift>=1){g.mallLift=0;requestMallLift(g,floor+1,move);}}else g.mallLift=0;
}
export function mallSectionEntry(g){const gate=mallGates(g.mallFloor)[g.mallSector-1];if(!gate)return null;for(const y of [380,440,280,500]){const target={x:gate.x+60,y};if(!g.cover.some(o=>target.x+18>o.x&&target.x-18<o.x+o.w&&target.y+18>o.y&&target.y-18<o.y+o.h))return target;}return{x:gate.x+29,y:380};}
export function mallHint(g){if(g.mallEntryPending)return{target:{x:260,y:380},label:'MOVE OUT',color:'#d0c08a'};if(g.mallFloor===4&&g.mallClock>=60)return{target:g.mission.extract,label:'EXTRACT',color:'#efbe7a'};if(g.mallFloor===0&&g.mallSector===1&&!g.mallAwaitingEntry&&!g.mallPower&&!g.enemies.some(e=>e.hp>0&&!e.dormant))return{target:g.mission.powerControl,label:'LIFT POWER',color:'#e2bd75'};if(g.mallAwaitingEntry){return{target:mallSectionEntry(g),label:'FORWARD',color:'#d0c08a'};}if(g.mallFloor===1&&!g.mallRescued&&!g.enemies.some(e=>e.hp>0&&!e.dormant))return {target:g.mission.targets[0],label:'SURVIVOR',color:'#d0c08a'};const enemy=g.enemies.find(e=>e.hp>0&&!e.dormant);const arriving=enemy?.entranceState&&enemy.entranceState!=='done';return{target:arriving?enemy.entrance:enemy||g.mission.extract,label:enemy?(arriving?'MOVEMENT':'INFECTED'):g.mallFloor===4?'HELICOPTER':'LIFT',color:'#d0c08a'};}
export function mallDirective(g,touch=false){if(g.mallEntryPending)return touch?'Move out when ready':'Move out when ready · WASD';const key=touch?'INTERACT':'E';if(g.mallFloor===4)return g.mallClock<60?'Hold the roof · helicopter in '+Math.ceil(60-g.mallClock)+'s':'Helicopter arrived · reach the landing zone';if(g.mallFloor===2)return g.bossDefeated?'Host eliminated · collect your loot, then hold '+key+' at the lift':'Your survivor is the host · dodge its attacks';if(g.mallFloor===0&&g.mallSector===1&&!g.mallAwaitingEntry&&!g.mallPower&&!g.enemies.some(e=>e.hp>0&&!e.dormant))return 'Lift power is down · hold '+key+' at the maintenance panel';if(g.mallAwaitingEntry)return 'Section clear · push through the opened shutter';if(g.enemies.some(e=>e.hp>0&&!e.dormant))return 'Clear the '+(mallSectionNames[g.mallFloor]?.[g.mallSector??0]||'mall').toLowerCase()+' · '+g.enemies.filter(e=>e.hp>0&&!e.dormant).length+' remaining';if(g.mallFloor===1&&!g.mallRescued)return 'Survivor located · hold '+key+' at the locked room';return g.mallFloor===1?(g.mallRescued&&g.companion&&Math.hypot(g.p.x-g.mission.extract.x,g.p.y-g.mission.extract.y)<90&&Math.hypot(g.companion.x-g.mission.extract.x,g.companion.y-g.mission.extract.y)>=115?'Wait for the survivor to reach the gun-store lift':'Escort the survivor to the gun store · hold '+key+' at its service lift'):'Area clear · hold '+key+' at the lift';}

// A single interaction contract for world prompts, touch controls and progress UI.
export function mallInteraction(g){
 if(g.mission?.mall&&g.mallFloor===4&&g.mallClock>=60)return{target:g.mission.extract,label:'REACH LANDING ZONE',progress:0,close:false,automatic:true};
 if(!g.mission?.mall||g.storyBeat||g.mallAwaitingEntry||g.enemies.some(e=>e.hp>0&&!e.dormant))return null;
 if(g.mallFloor===4)return null;
 let target,label,progress=0,duration=1,radius=72;
 if(g.mallFloor===0&&g.mallSector===1&&!g.mallPower){target=g.mission.powerControl;label='RESTORE LIFT POWER';progress=g.mallPowerProgress||0;duration=1.25;radius=65;}
 else if(g.mallFloor===1&&g.mallSector===2&&!g.mallRescued){target=g.mission.targets[0];label='OPEN SECURITY ROOM';progress=g.interact||0;}
 else if((g.mallFloor===2&&g.bossDefeated&&g.time>=(g.bossDeathUntil||0))||g.mallSector===2&&(g.mallFloor!==1||g.mallRescued)){
 target=g.mission.extract;progress=g.mallLift||0;label=g.routeStep!=null&&g.mallFloor>=g.mallEndFloor?'FINISH ASSIGNMENT':['BOARD TO RETAIL','BOARD TO ISOLATION','BOARD TO UPPER GALLERIES','BOARD TO ROOF'][g.mallFloor];
 }
 if(!target)return null;
 if(g.mallFloor===1&&g.mallRescued&&(!g.companion||Math.hypot(g.companion.x-target.x,g.companion.y-target.y)>=115))return{target,label:'WAIT FOR SURVIVOR',progress:0,close:false};
 return{target,label,progress:Math.min(1,progress/duration),close:Math.hypot(g.p.x-target.x,g.p.y-target.y)<radius};
}

export function mallLocation(g){return (g.mallFloor===4?'ROOFTOP':mallSectionNames[g.mallFloor]?.[g.mallSector??0]||'MERIDIAN GALLERIA')+' · '+((g.mallFloor??0)+1)+' / 5';}
export function mallRadio(g){if(g.mallEntryPending)return 'Dispatch: Take a breath. Move out when you’re ready.';if(g.mallFloor===4)return g.mallClock<60?'Dispatch: Stay mobile. Hold until the helicopter arrives.':'Dispatch: Pilot has visual. Get to the lit landing zone.';if(g.mallFloor===2)return g.bossDefeated?'Dispatch: Recover what you can. The next lift is ready.':'Dispatch: Break its armor. Move when it commits to an attack.';if(g.mallFloor===1&&g.mallRescued)return 'Survivor: I’m with you. The gun store has a service lift.';if(g.mallAwaitingEntry)return 'Dispatch: Shutter released. Follow the open route.';return ['Dispatch: Clear a path through parking. The service lift is ahead.','Dispatch: Search security. Someone is still alive in there.',null,'Dispatch: Clear the upper wing. Roof access is on the far side.'][g.mallFloor]||'';}
