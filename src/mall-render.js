import {mallRetailAtlasData} from './mall-retail-assets.js';
let retailAtlasImage,retailAtlasBase;const retailAtlasMaps=new Map();
function mallRetailTexture(T,theme){
 if(typeof mallRetailAtlasData==='undefined'||typeof globalThis.Image!=='function')return null;
 if(retailAtlasMaps.has(theme))return retailAtlasMaps.get(theme);
 if(!retailAtlasImage){retailAtlasImage=new globalThis.Image();retailAtlasImage.onload=()=>{for(const map of retailAtlasMaps.values())map.needsUpdate=true;globalThis.dispatchEvent?.(new Event('mall-art-ready'));};retailAtlasBase=new T.Texture(retailAtlasImage);retailAtlasBase.colorSpace=T.SRGBColorSpace;retailAtlasImage.src=mallRetailAtlasData;}
 const cells={fashion:[0,0],sports:[1,0],pharmacy:[0,1],electronics:[1,1],cafe:[0,2],food:[1,2]},[col,row]=cells[theme]||cells.fashion,map=retailAtlasBase.clone();map.colorSpace=T.SRGBColorSpace;map.repeat.set(.5,1/3);map.offset.set(col*.5,1-(row+1)/3);map.name='Meridian campaign / '+theme;if(retailAtlasImage.complete)map.needsUpdate=true;retailAtlasMaps.set(theme,map);return map;
}
// Authored shopping-centre art. The mission's solid footprints are the only source
// of positions and extents; no hidden warehouse collision or decorative blockers.
export function buildMallEnvironment(T,g,{box,cylinder,label,glow}){
 // Chamfered fixture edges catch light instead of reading as unbroken cubes.
 const hardBox=box,edgeShape=new T.Shape();edgeShape.moveTo(.02,.02);edgeShape.lineTo(.98,.02);edgeShape.lineTo(.98,.98);edgeShape.lineTo(.02,.98);edgeShape.closePath();const fixtureGeometry=new T.ExtrudeGeometry(edgeShape,{depth:.96,steps:1,bevelEnabled:true,bevelSegments:1,bevelSize:.02,bevelThickness:.02,curveSegments:1});fixtureGeometry.translate(-.5,-.5,-.48);
 box=(...args)=>{const mesh=hardBox(...args);mesh.geometry=fixtureGeometry;return mesh;};
 const group=new T.Group(),m=g.mission,level=m.floorIndex??0;
 group.name='Meridian Mall / authored floor '+level;group.userData.animations=[];group.userData.effectMeshes=[];
 if(m.liftInterior){
  group.name='Meridian / service lift cabin';const steel=new T.MeshStandardMaterial({color:'#646e68',roughness:.5,metalness:.7}),wood=new T.MeshStandardMaterial({color:'#493c2d',roughness:.8}),dark=new T.MeshStandardMaterial({color:'#202b28',roughness:.9});const block=(x,y,z,w,h,d,mat)=>{const mesh=box(group,x,y,z,w,h,d,'#70796b');mesh.material=mat;return mesh;};
  block(1120,-1,380,74,2,116,dark);for(let x=1086;x<1155;x+=6)block(x,.2,380,3,.3,112,steel);
  block(1120,42,323,74,84,3,steel);block(1083,42,380,3,84,116,wood);
  // Camera-side walls cut away; the door and three-sided shell remain in engine.
  block(1157,6,380,3,12,116,steel);block(1120,6,438,74,12,3,steel);
  for(let x=1088;x<1155;x+=7)block(x,40,325,1,77,.5,dark);
  for(const dx of [-13,13]){block(1120+dx,35,326,25,70,2,steel);block(1120+dx,35,327.2,1,67,.3,dark);}block(1120,72,328,57,4,4,dark);
  for(const z of [346,380,414]){block(1085,35,z,2,26,26,steel);block(1086.2,35,z,1,24,24,wood);}block(1089,25,382,2,2,103,steel);block(1120,25,329,64,2,2,steel);
  const display=label('02  ↑',1120,79,329,25,10,'#d9be7e');group.add(display);display.name='lift floor indicator';
  block(1146,38,328,8,23,2,dark);for(let y=31;y<=46;y+=7){const button=cylinder(group,1146,y,330,1.6,1,'#c6c4ac');button.rotation.x=Math.PI/2;}
  glow(group,1120,84,380,42,1,6,'#e4d3a3');const light=new T.PointLight('#e8d4a4',2700,180,2);light.position.set(1120,76,380);group.add(light);group.userData.liftCabin=true;return group;
 }

 const c=document.createElement('canvas');c.width=1200;c.height=760;const ctx=c.getContext('2d');
 const parking=level===0,roof=level===4,clean=m.beforeOutbreak===true;
 ctx.fillStyle=parking?'#383d40':roof?'#505953':'#7f8273';ctx.fillRect(0,0,1200,760);
 if(!parking&&!roof){
 // Large terrazzo slabs, dark stone borders and brass inlays. Aggregate is
 // deterministic and baked once; the travel lane stays free of raised clutter.
 ctx.fillStyle=level===2?'#4c5a58':level===3?'#766252':'#87877c';ctx.fillRect(0,0,1200,760);
 for(let y=0;y<760;y+=64)for(let x=0;x<1200;x+=64){const n=(x*7+y*13)%19,base=level===2?[76,91,88]:level===3?((x/64+y/64)%2?[111,91,74]:[130,113,91]):[133,133,121];ctx.fillStyle=`rgb(${base[0]+n/3},${base[1]+n/3},${base[2]+n/3})`;ctx.fillRect(x+.7,y+.7,62.6,62.6);ctx.strokeStyle='#464b4540';ctx.lineWidth=.7;ctx.strokeRect(x+.7,y+.7,62.6,62.6);}
 let stoneSeed=893;const stoneRandom=()=>{stoneSeed=(stoneSeed*1664525+1013904223)>>>0;return stoneSeed/4294967296;};
 for(let i=0;i<(level===2?9500:16000);i++){const x=stoneRandom()*1200,y=stoneRandom()*760;ctx.fillStyle=['#e6e0cc65','#353e3d55','#bcb6a060','#5d63534a'][i%4];ctx.save();ctx.translate(x,y);ctx.rotate(stoneRandom()*6);ctx.fillRect(0,0,.4+stoneRandom()*1.8,.4+stoneRandom()*1.1);ctx.restore();}
 for(const y of [242,548]){ctx.fillStyle='#304844';ctx.fillRect(38,y,1125,17);ctx.fillStyle='#b19a6d';ctx.fillRect(38,y+2,1125,1.4);ctx.fillRect(38,y+14,1125,1.4);}
 ctx.strokeStyle='#b5a17a';ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(640,385,94,84,0,0,Math.PI*2);ctx.stroke();ctx.strokeStyle='#3b5750';ctx.lineWidth=13;ctx.beginPath();ctx.ellipse(640,385,85,75,0,0,Math.PI*2);ctx.stroke();
 ctx.font='18px serif';ctx.textAlign='center';ctx.fillStyle='#3e564e';ctx.fillText('M E R I D I A N',640,388);ctx.font='8px sans-serif';ctx.fillText('G A L L E R I A   ·   1 9 8 7',640,405);
 if(!clean){for(const [sx,sy,r]of [[200,250,90],[805,530,85],[970,210,55]])for(let j=0;j<22;j++){ctx.fillStyle='#28352c06';ctx.beginPath();ctx.ellipse(sx,sy,r+j,12+j*.5,.12,0,Math.PI*2);ctx.fill();}}
 }else if(parking){ctx.strokeStyle='#b6ae87';ctx.lineWidth=3;for(let x=190;x<1030;x+=145){ctx.strokeRect(x,105,122,145);ctx.strokeRect(x,510,122,145);}ctx.font='bold 28px sans-serif';ctx.textAlign='center';ctx.fillStyle='#a9b7aa';ctx.fillText('P2 / MERIDIAN',615,390);ctx.fillText('MALL ENTRANCE →',925,390);for(const x of [240,550,850]){ctx.fillRect(x,355,45,5);ctx.beginPath();ctx.moveTo(x+45,347);ctx.lineTo(x+60,357);ctx.lineTo(x+45,367);ctx.fill();}}
 else{ctx.strokeStyle='#d9cf97';ctx.lineWidth=5;ctx.beginPath();ctx.arc(1060,380,92,0,Math.PI*2);ctx.stroke();ctx.font='bold 100px sans-serif';ctx.textAlign='center';ctx.fillStyle='#d9cf97';ctx.fillText('H',1060,416);for(let x=40;x<1160;x+=100){ctx.fillStyle='#61685e';ctx.fillRect(x,40,2,680);}}
 // Restrained dirt, dropped receipts and scuffs, all baked into a flat floor.
 for(let i=0;i<(clean?0:130);i++){const x=(i*173+31)%1160+20,y=(i*97+23)%700+30;ctx.fillStyle=i%4?'#21292518':'#f1dec044';ctx.fillRect(x,y,3+(i%11),1+i%3);}
 if(!clean&&!parking&&!roof){
  // Localized abandoned traces leave the centre lane and warnings visually quiet.
  for(const [sx,sy]of [[155,252],[465,548],[815,252]]){
   ctx.strokeStyle='#344c3677';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(sx-20,sy);ctx.bezierCurveTo(sx+12,sy-9,sx+30,sy+15,sx+72,sy+5);ctx.stroke();
   for(let i=0;i<12;i++){ctx.fillStyle=i%3?'#d1c7a670':'#414a3e66';ctx.save();ctx.translate(sx+(i*31)%86,sy+(i*17)%28-14);ctx.rotate(i*.6);ctx.fillRect(-4,-2,8,5);ctx.restore();}
  }
  ctx.strokeStyle='#363e3555';ctx.lineWidth=1;for(let i=0;i<28;i++){const x=85+i*39,y=i%2?555:248;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+11,y+7);ctx.lineTo(x+7,y+15);ctx.stroke();}
 }
 if(m.memoryRuins){ctx.fillStyle='#354c32';ctx.beginPath();ctx.ellipse(626,320,26,12,.3,0,Math.PI*2);ctx.fill();ctx.strokeStyle='#354c32aa';ctx.lineWidth=6;ctx.beginPath();ctx.moveTo(630,321);ctx.lineTo(670,337);ctx.lineTo(707,332);ctx.stroke();for(let i=0;i<10;i++){ctx.fillStyle='#c5b59299';ctx.fillRect(585+(i*19)%150,300+(i*23)%65,7,4);}}
 // Floor-scale landmarks make the upper half readable before any small props resolve.
 if(level===2){ctx.strokeStyle='#b4975a';ctx.lineWidth=7;for(const y of [273,533]){ctx.setLineDash([22,13]);ctx.beginPath();ctx.moveTo(185,y);ctx.lineTo(1125,y);ctx.stroke();}ctx.setLineDash([]);ctx.font='bold 22px monospace';ctx.textAlign='center';ctx.fillStyle='#b5bda5';ctx.fillText('ISOLATION / 03',610,308);for(const [x,y]of [[390,525],[840,270],[1080,475]]){ctx.fillStyle='#283e3599';ctx.beginPath();ctx.ellipse(x,y,45,17,.3,0,Math.PI*2);ctx.fill();}ctx.fillStyle='#91aaa099';ctx.font='14px monospace';ctx.fillText('TRIAGE  →',200,425);}
 if(level===3){ctx.fillStyle='#252a2588';for(const [x,y,w,h]of [[700,245,170,34],[715,548,165,25],[390,315,140,18]])ctx.fillRect(x,y,w,h);ctx.fillStyle='#ceb78c';ctx.font='bold 23px serif';ctx.textAlign='center';ctx.fillText('THE TABLE / FOOD HALL',610,307);ctx.font='15px monospace';ctx.fillText('ROOF ACCESS  →',1000,425);for(let i=0;i<90;i++){ctx.fillStyle=i%3?'#25282588':'#b4a18b55';ctx.fillRect(650+(i*43)%400,525+(i*19)%40,4+i%9,2);}}
 if(roof){ctx.fillStyle='#253b3c88';for(const [x,y,w,h]of [[450,110,180,50],[210,565,240,34],[835,250,90,120]]){ctx.beginPath();ctx.ellipse(x,y,w/2,h/2,-.2,0,Math.PI*2);ctx.fill();}ctx.strokeStyle='#958c6377';ctx.lineWidth=2;for(const z of [110,670]){ctx.beginPath();ctx.moveTo(160,z);ctx.lineTo(1110,z);ctx.stroke();}ctx.fillStyle='#c9c6a0';ctx.font='bold 22px monospace';ctx.fillText('MERIDIAN / PLANT 05',440,400);}
 // Broad material wear and architectural inlays read at the gameplay camera.
 // These marks are entirely flat; warning colors keep the strongest contrast.
 if(parking){
  ctx.lineCap='round';for(const [y,bend]of [[330,19],[425,-15]]){ctx.strokeStyle='#111b1d36';ctx.lineWidth=9;ctx.beginPath();ctx.moveTo(150,y);ctx.bezierCurveTo(370,y+bend,800,y-bend,1110,y+8);ctx.stroke();ctx.strokeStyle='#6b706019';ctx.lineWidth=2;ctx.stroke();}
  for(const [i,o]of m.cover.filter(o=>o.kind==='car').entries()){ctx.save();ctx.translate(o.x+o.w/2,o.y+o.h+20);ctx.rotate(-Math.PI/2);ctx.font='bold 16px monospace';ctx.fillStyle='#c6c3a377';ctx.fillText(String(i+1).padStart(2,'0'),0,0);ctx.restore();ctx.fillStyle='#14212566';ctx.beginPath();ctx.ellipse(o.x+o.w*.56,o.y+o.h*.5,o.w*.38,o.h*.43,.05,0,Math.PI*2);ctx.fill();}
  for(const [x,y]of [[110,260],[470,660],[930,90]]){ctx.fillStyle='#1c2929';ctx.fillRect(x,y,85,9);ctx.fillStyle='#64716a';for(let k=0;k<17;k++)ctx.fillRect(x+k*5,y+.5,1,8);}
  ctx.strokeStyle='#b8ad714d';ctx.lineWidth=3;ctx.strokeRect(55,70,104,168);ctx.font='bold 14px monospace';ctx.fillStyle='#c7bc8877';ctx.fillText('PAY / EXIT',106,245);
 }else if(!roof){
  for(const shop of m.shops||[]){const front=shop.south?shop.y:shop.y+shop.h,doorX=shop.x+shop.w*.5;ctx.fillStyle=level===2?'#25444388':level===3?'#542e2b99':'#283e3a77';ctx.fillRect(doorX-39,front-13,78,26);ctx.strokeStyle='#ada88a44';ctx.lineWidth=1;ctx.strokeRect(doorX-35,front-9,70,18);for(let n=0;n<7;n++){ctx.strokeStyle='#131f1d33';ctx.beginPath();ctx.moveTo(doorX-32,front-7+n*2.3);ctx.lineTo(doorX+32,front-7+n*2.3);ctx.stroke();}}
  if(level===1){ctx.strokeStyle='#c1b29155';ctx.lineWidth=2;for(const y of [267,522]){ctx.beginPath();ctx.moveTo(65,y);ctx.lineTo(1125,y);ctx.stroke();}ctx.font='12px serif';ctx.fillStyle='#d3c6a155';ctx.fillText('NORTH CONCOURSE',495,280);}
  if(level===2){ctx.fillStyle='#223f3c66';ctx.fillRect(205,337,95,86);ctx.strokeStyle='#a9bba288';ctx.lineWidth=2;ctx.strokeRect(212,344,81,72);ctx.font='bold 11px monospace';ctx.fillStyle='#b6bba37a';ctx.fillText('DECONTAMINATION',251,388);for(const x of [221,276])for(let y=350;y<411;y+=10){ctx.fillStyle='#bac5ad36';ctx.fillRect(x,y,5,6);}}
  if(level===3){ctx.strokeStyle='#a6876344';ctx.lineWidth=12;for(const x of [350,905]){ctx.beginPath();ctx.moveTo(x,240);ctx.lineTo(x,550);ctx.stroke();}ctx.fillStyle='#2c231f77';for(const shop of m.shops||[]){const yy=shop.south?shop.y+12:shop.y+shop.h-25;ctx.fillRect(shop.x+65,yy,105,12);}ctx.font='bold 12px serif';ctx.fillStyle='#d3b48a88';ctx.fillText('CINEMA / LAST ADMISSION',485,251);}
 }else{
  for(const o of m.cover.filter(o=>o.kind==='vent'||o.kind==='roofaccess')){ctx.fillStyle='#1b2c2e77';ctx.fillRect(o.x-4,o.y-4,o.w+8,o.h+8);ctx.strokeStyle='#8f948366';ctx.lineWidth=2;ctx.strokeRect(o.x-7,o.y-7,o.w+14,o.h+14);}
  for(let i=0;i<30;i++){ctx.strokeStyle='#17282a2a';ctx.lineWidth=1+i%2;const x=45+i*37;ctx.beginPath();ctx.moveTo(x,45);ctx.lineTo(x+12,160+i%4*95);ctx.lineTo(x+7,700);ctx.stroke();}
 }
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
 const floor=new T.Mesh(new T.PlaneGeometry(1200,760),new T.MeshStandardMaterial({map:texture,roughness:parking?.92:roof?.95:.55,metalness:0}));floor.rotation.x=-Math.PI/2;floor.position.set(600,-.8,380);floor.receiveShadow=true;floor.name='Mall terrazzo / footprint-aligned floor';group.add(floor);
 const material=(color,rough=.7)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:.08});
 const glassMat=new T.MeshStandardMaterial({color:'#577b80',transparent:true,opacity:.18,roughness:.13,metalness:.05,depthWrite:false});
 // Shared authored surface maps provide grain, chipped edges and grout without
 // external downloads. Materials are reused across fixtures on this floor.
 const surfaceCache=new Map();
 function surface(kind,tone){const cacheKey=kind+(tone||'');if(surfaceCache.has(cacheKey))return surfaceCache.get(cacheKey);const cv=document.createElement('canvas');cv.width=cv.height=256;const cx=cv.getContext('2d');const base=tone||{stone:level===3?'#a08b72':level===2?'#97aaa0':'#a9a496',wood:level===3?'#64453b':'#493a30',metal:parking?'#596768':level===2?'#6a847e':level===3?'#645951':'#46524e',tile:parking?'#5b6562':level===2?'#65887f':level===3?'#6e4942':'#3c6159',plaster:parking?'#8b8e84':level===2?'#b1bdb0':level===3?'#b39f86':'#9b988a',fabric:level===2?'#7d9a90':level===3?'#78534b':'#647167',cardboard:'#a18a60'}[kind];cx.fillStyle=base;cx.fillRect(0,0,256,256);let seed=73;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<2400;i++){cx.fillStyle=i%2?'#ffffff0d':'#07171316';const x=rnd()*256,y=rnd()*256;cx.fillRect(x,y,kind==='wood'?18+rnd()*80:1+rnd()*3,kind==='wood'?.6:1+rnd()*2);}
 if(kind==='tile'){for(let x=0;x<256;x+=32)for(let y=0;y<256;y+=64){cx.strokeStyle='#182a2855';cx.lineWidth=2;cx.strokeRect(x,y,32,64);cx.strokeStyle='#c2c6ad22';cx.lineWidth=1;cx.strokeRect(x+2,y+2,28,60);}}
 if(!clean){for(let i=0;i<24;i++){cx.fillStyle='#141e1918';cx.fillRect(rnd()*256,220+rnd()*36,2+rnd()*18,rnd()*16);}}
 const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;const mat=new T.MeshStandardMaterial({map,roughness:kind==='tile'?.32:kind==='metal'?.55:.84,metalness:kind==='metal'?.65:.05,bumpMap:Object.assign(map.clone(),{colorSpace:T.NoColorSpace}),bumpScale:kind==='stone'?.12:.06});surfaceCache.set(cacheKey,mat);return mat;}
 function clad(mesh,kind,tone){mesh.material=surface(kind,tone);return mesh;}
 function readableAroundActors(mesh,width){mesh.material=mesh.material.clone();mesh.userData.mallActorOccluder=true;group.userData.actorOccluders??=[];group.userData.actorSight??={ray:new T.Ray(),direction:new T.Vector3(),right:new T.Vector3(),hit:new T.Vector3()};group.userData.actorOccluders.push({mesh,opacity:mesh.material.opacity,transparent:mesh.material.transparent,depthWrite:mesh.material.depthWrite,shadow:mesh.castShadow,bounds:new T.Box3(),cached:false});return mesh;}
 // A compact stall is one visual assembly: fading just its striped roof leaves
 // the counter, foliage and trim stacked opaquely across the same actor.
 function readableFixture(prop){const cluster={blocked:false};group.userData.actorOcclusionClusters??=[];group.userData.actorOcclusionClusters.push(cluster);prop.traverse(mesh=>{if(!mesh.isMesh||!mesh.material||Array.isArray(mesh.material))return;let entry=group.userData.actorOccluders?.find(e=>e.mesh===mesh);if(!entry){readableAroundActors(mesh);entry=group.userData.actorOccluders[group.userData.actorOccluders.length-1];}entry.cluster=cluster;});}
 function retailPanel(parent,text,sub,x,y,z,w,h,color,dark='#172a28'){
  const cv=document.createElement('canvas');cv.width=768;cv.height=192;const cx=cv.getContext('2d');cx.fillStyle=dark;cx.fillRect(0,0,768,192);cx.fillStyle=color;cx.fillRect(18,22,4,148);cx.textAlign='center';cx.fillStyle=color;cx.font='500 64px '+(text==='NIGHT OWL'?'serif':'sans-serif');cx.fillText(text,390,92,690);cx.font='18px sans-serif';cx.fillStyle='#d2cebb';cx.fillText(sub,390,141,690);const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,emissive:'#ffffff',emissiveMap:map,emissiveIntensity:clean?.2:.12,roughness:.55,side:T.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.x=-.5;mesh.name='retail identity / '+text;parent.add(mesh);readableAroundActors(mesh,w);return mesh;
 }
 function poster(parent,x,z,w,h,theme,front){const cv=document.createElement('canvas');cv.width=256;cv.height=384;const cx=cv.getContext('2d');const colors={fashion:['#b7a791','#3a292a'],sports:['#bbc0a3','#244d43'],pharmacy:['#d2ddc8','#2a7266'],electronics:['#183339','#b8cbca'],cafe:['#322a25','#bca57a'],food:['#a96943','#e4d2a5']},[bg,ink]=colors[theme]||colors.fashion;cx.fillStyle=bg;cx.fillRect(0,0,256,384);cx.fillStyle=ink;cx.textAlign='center';cx.font='bold 25px sans-serif';cx.fillText({fashion:'AFTER HOURS',sports:'GO FURTHER',pharmacy:'BE WELL',electronics:'VOLT',cafe:'NIGHT OWL',food:'GOOD FOOD'}[theme],128,55);cx.beginPath();cx.ellipse(128,188,theme==='pharmacy'?54:69,theme==='sports'?29:78,-.25,0,Math.PI*2);cx.fill();if(theme==='pharmacy'){cx.fillStyle=bg;cx.fillRect(116,147,24,82);cx.fillRect(87,176,82,24);}cx.fillStyle=ink;cx.font='12px sans-serif';cx.fillText('MERIDIAN GALLERIA',128,337);if(level===2){cx.fillStyle='#3e5d57';cx.fillRect(0,0,256,384);cx.fillStyle='#b7c7b5';cx.fillRect(112,100,32,110);cx.fillRect(73,139,110,32);cx.font='bold 23px monospace';cx.fillText('ISOLATION 03',128,64);cx.font='15px monospace';cx.fillText('NO VISITORS',128,280);cx.fillStyle='#b6a270';for(let x=0;x<256;x+=32)cx.fillRect(x,335,16,24);}if(level===3){cx.fillStyle='#292b32';cx.fillRect(0,0,256,384);cx.fillStyle='#9b7579';cx.fillRect(18,18,220,3);cx.fillRect(18,362,220,3);cx.font='bold 27px serif';cx.fillStyle='#dbbea0';cx.fillText(theme==='fashion'?'LAST SCREEN':'AFTER HOURS',128,68);cx.font='15px monospace';cx.fillText('MERIDIAN / 04',128,315);for(let i=0;i<10;i++){cx.fillStyle=i%2?'#65777b':'#415354';cx.fillRect(25+i*22,170-(i*17)%60,15,100+(i*17)%60);}cx.fillStyle='#b2a591';cx.beginPath();cx.arc(165,130,24,0,Math.PI*2);cx.fill();}const fallback=new T.CanvasTexture(cv);fallback.colorSpace=T.SRGBColorSpace;const map=level>=2?fallback:mallRetailTexture(T,theme)||fallback;const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.8,side:T.DoubleSide}));mesh.position.set(x,34,z);if(!front)mesh.rotation.x=-Math.PI/2;mesh.name='shop campaign / '+theme;parent.add(mesh);readableAroundActors(mesh,w);return mesh;}
 function sign(text,x,y,z,w,h,color='#e1d9bb'){const mesh=label(text,x,y,z,w,h,color);mesh.name=text;group.add(mesh);readableAroundActors(mesh,w);if(/^(SECURITY|ARRIVAL|LIFT|SERVICE LIFT|RETAIL)/.test(text)){group.userData.wayfindingSigns??=[];group.userData.wayfindingSigns.push(mesh);}return mesh;}
 // Handmade tapered shells keep vehicles and machinery from reading as boxes.
 function loftForm(parent,x,y,z,rings,color,name){const positions=[],indices=[];
  for(const [rx,bottom,top,half]of rings){const b=Math.min(3,(top-bottom)/3);for(const [ry,rz]of [[bottom,-half*.8],[bottom+b,-half],[top-b,-half],[top,-half*.82],[top,half*.82],[top-b,half],[bottom+b,half],[bottom,half*.8]])positions.push(rx,ry,rz);}
  for(let i=0;i<rings.length-1;i++)for(let j=0;j<8;j++){const a=i*8+j,b=(i+1)*8+j,c=i*8+(j+1)%8,d=(i+1)*8+(j+1)%8;indices.push(a,c,b,c,d,b);}for(let j=1;j<7;j++){indices.push(0,j+1,j);const end=(rings.length-1)*8;indices.push(end,end+j,end+j+1);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setIndex(indices);geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color,roughness:.58,metalness:.3,envMapIntensity:.7}));mesh.position.set(x,y,z);mesh.castShadow=mesh.receiveShadow=true;mesh.name=name;parent.add(mesh);return mesh;
 }
 function rod(parent,ax,ay,az,bx,by,bz,r,color){const direction=new T.Vector3(bx-ax,by-ay,bz-az),mesh=cylinder(parent,(ax+bx)/2,(ay+by)/2,(az+bz)/2,r,direction.length(),color);mesh.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction.normalize());return mesh;}
 function quad(parent,points,color,name){const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(points.flat(),3));geometry.setIndex([0,1,2,0,2,3]);geometry.computeVertexNormals();const mesh=new T.Mesh(geometry,new T.MeshStandardMaterial({color,roughness:.24,metalness:.4,side:T.DoubleSide}));mesh.name=name;parent.add(mesh);return mesh;}
 // Repeated static fittings share one draw per material; authored shells stay individual.
 function batchFixtureParts(parent){const sets=new Map();for(const mesh of parent.children){if(!mesh.isMesh||mesh.isInstancedMesh||Array.isArray(mesh.material)||mesh.material.transparent)continue;const key=mesh.geometry.uuid+':'+mesh.material.uuid+':'+mesh.castShadow+':'+mesh.receiveShadow;if(!sets.has(key))sets.set(key,[]);sets.get(key).push(mesh);}for(const parts of sets.values()){if(parts.length<3)continue;const first=parts[0],batch=new T.InstancedMesh(first.geometry,first.material,parts.length);batch.name='vehicle / shared fittings';batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;for(let i=0;i<parts.length;i++){parts[i].updateMatrix();batch.setMatrixAt(i,parts[i].matrix);parent.remove(parts[i]);}batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox();batch.computeBoundingSphere();parent.add(batch);}}
 function vehicle(prop,o){const car=new T.Group();car.name=o.id+' / hand-shaped sedan';prop.add(car);const x=o.x+o.w/2,z=o.y+o.h/2,w=o.w,h=o.h,paint=o.color;
  loftForm(car,x,0,z,[[-w*.49,15,24,h*.40],[-w*.41,11,29,h*.47],[w*.31,11,30,h*.47],[w*.49,15,24,h*.40]],paint,'vehicle / formed body');
  loftForm(car,x,0,z,[[-w*.31,29,34,h*.42],[-w*.18,29,48,h*.35],[w*.13,29,48,h*.35],[w*.30,29,33,h*.42]],'#263b3e','vehicle / cabin glazing');
  box(car,x-w*.025,48.5,z,w*.33,2,h*.69,paint);for(const side of [-1,1]){
   rod(car,x-w*.31,30,z+side*h*.42,x-w*.18,48,z+side*h*.35,1.8,paint);rod(car,x+w*.30,30,z+side*h*.42,x+w*.13,48,z+side*h*.35,1.7,paint);rod(car,x-w*.025,30,z+side*h*.43,x-w*.025,48,z+side*h*.35,1.6,'#263438');
   box(car,x,28,z+side*h*.475,w*.69,1.3,1.3,'#a0a79c');box(car,x,13,z+side*h*.46,w*.72,3,1.5,'#343e3c');for(const dx of [-w*.19,w*.12]){box(car,x+dx,25.4,z+side*h*.477,9,1.4,.8,'#a9b0a5');box(car,x+dx+8,20,z+side*h*.474,.55,13,.6,'#293936');}
   for(const dx of [-w*.32,w*.32]){const wheel=cylinder(car,x+dx,12,z+side*(h*.47-2),12,7,'#182124');wheel.rotation.x=Math.PI/2;const hub=cylinder(car,x+dx,12,z+side*(h*.47+.9),6.5,1.3,'#858c83');hub.rotation.x=Math.PI/2;const centre=cylinder(car,x+dx,12,z+side*(h*.47+1.4),2.2,1.5,'#454f4c');centre.rotation.x=Math.PI/2;for(let k=0;k<5;k++){const spoke=box(car,x+dx,12,z+side*(h*.47+1.8),1.5,10,.5,'#5b6966');spoke.rotation.z=k*Math.PI/5;}}
   const mirror=box(car,x+w*.22,32,z+side*h*.46,8,4,4,paint);mirror.rotation.y=side*.2;
  }
  quad(car,[[x+w*.135,47.7,z-h*.34],[x+w*.135,47.7,z+h*.34],[x+w*.295,31.8,z+h*.405],[x+w*.295,31.8,z-h*.405]],'#587074','vehicle / windshield');
  quad(car,[[x-w*.185,47.6,z-h*.34],[x-w*.185,47.6,z+h*.34],[x-w*.305,32.4,z+h*.405],[x-w*.305,32.4,z-h*.405]],'#435c5e','vehicle / rear glass');
  for(const side of [-1,1]){box(car,x+w*.487,21,z+side*h*.27,2,6,h*.18,'#c0c4a9');box(car,x-w*.488,21,z+side*h*.29,2,5,h*.15,'#9e5948');}
  box(car,x+w*.49,20,z,2,7,h*.27,'#202f31');for(let k=0;k<4;k++)box(car,x+w*.495,18+k*1.3,z,.8,.5,h*.24,'#77837c');box(car,x+w*.48,12.5,z,3,4,h*.74,'#63716a');box(car,x-w*.48,13,z,3,4,h*.7,'#586660');box(car,x+w*.492,15,z,1,4.5,15,'#b7b9a3');box(car,x+w*.495,15,z,.3,1,9,'#5a655d');
  const hood=box(car,x+w*.37,29,z,w*.22,1,h*.72,paint);hood.rotation.z=o.id==='car-2'?-.09:-.025;for(const dz of [-h*.22,h*.22])box(car,x+w*.35,29.7,z+dz,w*.20,.45,.45,'#87958c');
  if(!clean){const scrape=box(car,x-w*.12,21,z+h*.476,w*.25,1.7,.4,'#a6a18b');scrape.rotation.z=.04;for(let i=0;i<5;i++){const chip=box(car,x-w*.22+i*5,17+(i%2)*2,z+h*.48,3,.7,.3,'#59604e');chip.rotation.z=-.12;}}  batchFixtureParts(car);
 }
 function displayScreen(parent,x,y,z,w,h,kind='security'){
  const cv=document.createElement('canvas');cv.width=256;cv.height=160;const cx=cv.getContext('2d');cx.fillStyle=kind==='cinema'||kind==='arcade'?'#28252d':'#152b29';cx.fillRect(0,0,256,160);cx.strokeStyle='#678376';cx.lineWidth=2;
  if(kind==='medical'){cx.beginPath();cx.moveTo(12,100);for(let i=0;i<8;i++){const xx=12+i*31;cx.lineTo(xx+8,100);cx.lineTo(xx+12,86);cx.lineTo(xx+16,112);cx.lineTo(xx+20,59);cx.lineTo(xx+24,100);}cx.stroke();cx.fillStyle='#a3b39a';cx.font='bold 22px monospace';cx.fillText('NO SIGNAL',16,30);cx.font='12px monospace';cx.fillText('VANTAGE / PATIENT 07',16,145);}
  else if(kind==='security'){for(let i=0;i<4;i++){const xx=(i%2)*128,yy=Math.floor(i/2)*80;cx.fillStyle=i===2?'#344039':'#263b34';cx.fillRect(xx+3,yy+3,122,74);cx.strokeStyle='#8a9b7433';for(let k=0;k<5;k++){cx.beginPath();cx.moveTo(xx+4,yy+70-k*10);cx.lineTo(xx+60,yy+25);cx.lineTo(xx+122,yy+70-k*10);cx.stroke();}cx.fillStyle='#a9b391';cx.font='11px monospace';cx.fillText('CAM 0'+(i+1),xx+9,yy+16);}}
  else if(kind==='arcade'){cx.strokeStyle='#526f7133';for(let y=20;y<150;y+=16){cx.beginPath();cx.moveTo(15,y);cx.lineTo(241,y);cx.stroke();}cx.textAlign='center';cx.font='bold 24px monospace';cx.fillStyle='#8e959e';cx.fillText('OFFLINE',128,77);cx.font='12px monospace';cx.fillStyle='#8a7d89';cx.fillText('AFTER HOURS / ARCADE',128,107);}
  else{cx.fillStyle='#7f686c';cx.fillRect(14,14,228,2);cx.fillRect(14,144,228,2);cx.font='bold 26px serif';cx.textAlign='center';cx.fillStyle='#c8b08a';cx.fillText('LAST SCREEN',128,65);cx.font='14px monospace';cx.fillText('02:17 / CANCELLED',128,107);}
  const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;const frame=box(parent,x,y,z,w+4,h+4,3,'#243733'),screen=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,emissive:'#ffffff',emissiveMap:map,emissiveIntensity:.12,roughness:.5}));screen.position.set(x,y,z+1.6);screen.name=kind+' / authored display';parent.add(screen);readableAroundActors(frame,w+4);readableAroundActors(screen,w);return screen;
 }
 function furniture(o){const prop=new T.Group();prop.name='solid / '+o.id;prop.userData.footprint={x:o.x,y:o.y,w:o.w,h:o.h};group.add(prop);const x=o.x+o.w/2,z=o.y+o.h/2;
  if(o.kind==='gate'){const gate=new T.Group();gate.name=o.id+' / retractable security shutter';prop.add(gate);for(let height=4;height<=46;height+=6)box(gate,x,height,z,6,5,o.h,'#73857b');for(const pz of [o.y,o.y+o.h])box(gate,x,25,pz,14,50,8,'#a0a791');box(gate,x,50,z,17,8,o.h,'#4a615b');group.userData.mallGates??=[];group.userData.mallGates.push({id:o.id,mesh:gate,lift:0});}
  else if(o.kind==='pillar'){clad(box(prop,x,51,z,o.w,102,o.h,'#777a71'),'plaster');box(prop,x,17,z,o.w+1,18,o.h+1,'#b4a065');for(let i=0;i<3;i++){const stripe=box(prop,x,12+i*6,z+o.h/2+.7,o.w+1,3,1,'#242d2c');stripe.rotation.z=-.18;}sign('P2',x,71,z+o.h/2+2,20,12,'#d2cfb5');}
  else if(o.kind==='power'){clad(box(prop,x,24,z,o.w,48,o.h,'#58605a'),'metal');box(prop,x,24,z+o.h/2+1,o.w-5,36,2,'#293932');const indicator=glow(prop,x,36,z+o.h/2+3,8,3,2,'#a66e47');indicator.material=indicator.material.clone();group.userData.liftPowerIndicator=indicator;sign('LIFT / ISOLATOR',x,60,z,90,12,'#c3b99a');for(let y=14;y<29;y+=5)box(prop,x,y,z+o.h/2+3,15,1,1,'#889282');}
  else if(o.kind==='wall'||o.kind==='lift'||o.kind==='door'){
   const height=o.kind==='door'?44:o.low?18:o.id==='north'?74:36;
   const wall=box(prop,x,height/2,z,o.w,height,o.h,o.kind==='door'?'#628479':'#837f70');wall.name=o.id;if(o.kind==='wall'){clad(wall,'plaster');clad(box(prop,x,9,z,o.w+.05,18,o.h+.05,'#455b50'),'tile');box(prop,x,19,z,o.w+.2,1.2,o.h+.2,'#b49e74');box(prop,x,1.5,z,o.w+.4,3,o.h+.4,'#35423c');}
   box(prop,x,height+1,z,o.w,2,o.h,'#c5bba1');
   if(o.kind==='door'){group.userData.securityDoor=wall;group.userData.securityDoorStart=z;sign('SECURITY',o.x+8,65,z,100,15,'#c6decc');}
   if(o.kind==='lift'){box(prop,x-7,34,z,2,65,85,'#3f5554');box(prop,x-9,34,z,1,60,2,'#a6b8aa');}
  }else if(o.kind==='shop'){
   clad(box(prop,x,.1,z,o.w,1,o.h,'#716f61'),o.id==='cafe'||o.id==='fashion'?'wood':'stone');
   const front=o.south?o.y:o.y+o.h-4,frame=level===2?'#587a73':level===3?({fashion:'#513d45',electronics:'#414953',pharmacy:'#6d5544',cafe:'#665345',sports:'#4d443b',food:'#6a6c62'}[o.id]):({pharmacy:'#466d62',fashion:'#62504e',electronics:'#465a66',cafe:'#665444',sports:'#4e5d4e',food:'#7b6250'}[o.id]);
   const identities={pharmacy:['MERIDIAN +','P H A R M A C Y','#9bc6a5'],fashion:['LAST SEASON','C O L L E C T I O N   0 9','#d1b7a3'],electronics:['VOLT','S O U N D   ·   V I S I O N','#9cc3cc'],cafe:['NIGHT OWL','C O F F E E   &   C O M P A N Y','#d3b483'],sports:['STRIDE','R U N N I N G   ·   O U T D O O R','#c7ceab'],food:['THE TABLE','M E R I D I A N   F O O D   H A L L','#d3ad8a']},upper={pharmacy:['THE TABLE','D I N E R  /  0 4','#d3ac75'],fashion:['MERIDIAN PICTURES','S C R E E N S   0 1 — 0 6','#caa0a0'],electronics:['AFTER HOURS','A R C A D E','#a3a9cd'],cafe:['NIGHT OWL','C O F F E E   /   0 4','#d3b483'],sports:['LAST ORDERS','B A R   &   G R I L L','#c7b18b'],food:['KITCHEN 04','N O   S E R V I C E','#c78e6b']},medical={pharmacy:['ISOLATION 03','V A N T A G E   /   R E S T R I C T E D','#9dbcae'],fashion:['OBSERVATION','T R I A G E   B A Y   A','#acbaaa'],electronics:['BIO / CONTROL','M O N I T O R I N G','#9eb7bd'],cafe:['STAFF ONLY','D E C O N T A M I N A T I O N','#b8ae83'],sports:['WARD B','D O   N O T   E N T E R','#aeb5a0'],food:['SUPPLY 03','M E D I C A L   S T O R E','#b5b99f']},identity=(level===2?medical:level===3?upper:identities)[o.id];
   readableAroundActors(clad(box(prop,x,63,front,o.w,18,10,frame),'metal',frame),o.w);box(prop,x,73,front,o.w+2,2,12,'#a79879');box(prop,x,53.5,front,o.w,1.5,12,'#b29d74');retailPanel(prop,...identity.slice(0,2),x,63,front+10,o.w-16,15,identity[2]);
   box(prop,x,.8,front,100,1,12,'#716b57').castShadow=false;
   for(const px of [o.x+5,o.x+o.w-5]){clad(box(prop,px,29,front,10,57,11,frame),'tile',frame);box(prop,px,3,front,12,6,13,'#b3ac94');box(prop,px,56,front,12,3,13,'#b3ac94');}
   for(const px of [o.x+59,o.x+o.w-59]){box(prop,px,27,front,1.4,52,3,'#a89d7d');box(prop,px,2,front,1.4,3,4,'#e0ce9f');}
   if(level===3)for(let k=0;k<12;k++)glow(prop,o.x+8+k*(o.w-16)/11,74,front+6,2,2,2,o.id==='fashion'?'#d1a7ac':'#d5bb8a');
   // Display-window plinths and shop-specific advertising stay in side bays.
   for(const side of [-1,1]){const px=x+side*(o.w/2-34);clad(box(prop,px,4,front+(o.south?17:-17),39,8,28,'#433c30'),'wood');poster(prop,px,front+(o.south?9.2:5.2),30,38,o.id,true);}
   if(!clean)for(const side of [-1,1])for(let k=0;k<7;k++)box(prop,x+side*(o.w/2-34),51-k*1.5,front,46,1,1.5,'#555e56');
   const shopLight=new T.PointLight(level===2?'#9abeb5':level===3?(o.id==='fashion'?'#ae8299':'#e1ac70'):o.id==='electronics'?'#9ac7c8':o.id==='pharmacy'?'#b7d0bd':'#e4bd86',clean?2600:level===2?2100:level===3?2700:3400,170,2);shopLight.position.set(x,47,front+(o.south?25:-25));prop.add(shopLight);shopLight.userData.impactReactive=true;shopLight.userData.restIntensity=shopLight.intensity;
   for(let k=0;k<4;k++)box(prop,o.x+24+k*58,71,front+(o.south?20:-20),22,1,26,'#777c70');
   // Rear-wall presentation: timber battens, illuminated posters and shelf coves.
   for(const px of [o.x+12,o.x+o.w-12])poster(prop,px,o.south?o.y+o.h-11:o.y+11,18,42,o.id,true);
   for(let k=0;k<12;k++)clad(box(prop,o.x+14+k*18,30,o.south?o.y+o.h-9:o.y+9,2,54,1,'#665646'),'wood');
   // Distinct retail storytelling inside playable footprints, no invisible frontage.
   if(level===1&&(o.id==='fashion'||o.id==='sports'))for(let i=0;i<3;i++){
    const px=o.x+95+i*42,pz=o.south?o.y+95:o.y+43;
    cylinder(prop,px,22,pz,2,38,'#a5a58d');box(prop,px,43,pz,27,3,4,'#b2ad99');
    for(let j=0;j<3;j++){const shirt=box(prop,px-8+j*8,32,pz,7,18,6,['#6c7e72','#9b7a69','#aa9c7a'][j]);shirt.rotation.z=(j-1)*.08;}
   }
   if(level===1&&(o.id==='fashion'||o.id==='sports'))for(const side of [-1,1]){const px=x+side*(o.w/2-35),pz=front+(o.south?18:-18);const body=new T.Mesh(new T.SphereGeometry(1,12,10),material('#b9b4a3'));body.scale.set(5,10,3.5);body.position.set(px,23,pz);prop.add(body);cylinder(prop,px,10,pz,1.3,20,'#8a8d7b');const head=new T.Mesh(new T.SphereGeometry(4,10,8),material('#c2bba7'));head.scale.y=1.3;head.position.set(px,37,pz);prop.add(head);for(const dx of [-3,3]){const leg=cylinder(prop,px+dx,11,pz,1.8,16,'#999d8a');leg.rotation.z=dx*.025;}body.material=material(o.id==='sports'?'#526e64':'#9c7465');}
   if(level===1&&(o.id==='cafe'||o.id==='food')){
    clad(box(prop,o.x+o.w-27,24,z,25,48,42,'#4b5952'),'wood');box(prop,o.x+o.w-27,49,z,23,3,40,'#b5ae95');
    const machine=box(prop,o.x+o.w-27,57,z-7,18,14,17,'#4e5a54');machine.material=surface('metal');for(const dx of [-5,5]){cylinder(prop,o.x+o.w-27+dx,52,z+3,2,3,'#d3c7ab');box(prop,o.x+o.w-27+dx,55,z+3,1,4,1,'#252f2b');}for(let i=0;i<3;i++)cylinder(prop,o.x+o.w-27,53,z+9+i*5,2,5,'#c8c3ad');

    sign(clean?(o.id==='cafe'?'FRESH COFFEE':'OPEN / FOOD COURT'):(o.id==='cafe'?'LAST COFFEE 02:17':'NO SERVICE'),x,39,o.south?o.y+o.h-12:o.y+12,110,14,'#bdac84');
   }
   glow(prop,x,58,o.south?o.y+o.h-18:o.y+18,90,2,3,o.id==='electronics'?'#7faca4':'#c0b48e');
   if(level===1&&o.id==='pharmacy'){sign(clean?'HEALTH / EVERY DAY':'QUARANTINE / DO NOT ENTER',x,42,o.y+15,185,13,'#c6a06f');
    for(let i=0;i<(clean?0:5);i++){const stain=new T.Mesh(new T.CircleGeometry(6+i%3,9),material('#344b31'));stain.rotation.x=-Math.PI/2;stain.scale.x=1.8;stain.position.set(o.x+120+i*14,1,o.y+75+i*10);prop.add(stain);}}
   if(level===1&&o.id==='electronics')sign(clean?'VOLT / CONNECT YOUR WORLD':'SIGNAL LOST',x,43,o.y+17,140,17,'#91aaa1');
  }else if(o.kind==='glass'){
   const pane=box(prop,x,27,z,o.w,54,o.h,'#729b99');pane.material=glassMat;pane.castShadow=false;box(prop,x,55,z,o.w+3,2,o.h+2,'#b0ab95');
   if(level===2){const screen=box(prop,x,26,z,o.w-2,46,1,'#618b7c');screen.material=new T.MeshStandardMaterial({color:'#769c8a',roughness:.9});for(let dx=-o.w/2+3;dx<o.w/2;dx+=5)box(prop,x+dx,26,z+.7,1,45,.4,'#526f64');}if(!clean){const vertices=[];for(let i=0;i<9;i++){const ax=o.x+o.w*(.2+i*.06),ay=15+(i*7)%28;vertices.push(ax,ay,z+o.h/2+.15,ax+Math.sin(i*2)*5,ay+5,z+o.h/2+.15);}const cracks=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(vertices,3)),new T.LineBasicMaterial({color:'#d0dbcf',transparent:true,opacity:.28}));prop.add(cracks);}
  }else if(o.kind==='shelf'){
   const front=z+o.h/2;
   if(level===2){
    clad(box(prop,x,24,z,o.w,48,o.h,'#70887e'),'metal');box(prop,x,49,z,o.w+1,2,o.h+1,'#afbab0');
    for(let i=0;i<4;i++){const px=o.x+7+(i+.5)*(o.w-14)/4,w=(o.w-18)/4;box(prop,px,27,front+.3,w,36,.8,i===2?'#405e58':'#a6b1a2');box(prop,px,31,front+.9,w-8,17,.5,'#3e5b58');for(let k=0;k<3;k++){const bottle=cylinder(prop,px-9+k*9,26,front+1.5,2,9,['#8b9f90','#b1b49a','#829d9a'][k]);bottle.rotation.x=.05;}box(prop,px+w*.35,15,front+1.2,1.5,6,1,'#bec5b7');}
    sign(o.theme==='electronics'?'BIO / ANALYSIS':'VANTAGE / MEDICAL',x,58,z,o.w-8,10,'#afc2b4');
   }else if(level===3&&(o.theme==='fashion'||o.theme==='pharmacy')){
    box(prop,x,6,z,o.w,12,o.h,'#303b38');const count=6,seatW=(o.w-8)/count;
    for(let i=0;i<count;i++){const px=o.x+4+(i+.5)*seatW;clad(box(prop,px,17,z+2,seatW-3,10,o.h-4,'#74504b'),'fabric',o.theme==='fashion'?'#6e424b':'#865d46');clad(box(prop,px,32,z-o.h*.35,seatW-4,24,5,'#754c43'),'fabric',o.theme==='fashion'?'#6e424b':'#865d46');box(prop,px+seatW*.45,23,z+1,2,5,o.h-3,'#ad9e83');}
    if(o.theme==='fashion')sign('SCREENS 01 — 06',x,57,z,o.w-8,13,'#c9aa9e');else sign('THE TABLE / BOOTH SEATING',x,57,z,o.w-8,10,'#c8b491');
   }else if(level===3&&o.theme==='electronics'){
    box(prop,x,2,z,o.w,4,o.h,'#293c3c');for(let i=0;i<4;i++){const px=o.x+10+(i+.5)*(o.w-20)/4;loftForm(prop,px,0,z,[[-19,4,40,8],[-14,4,53,9],[14,4,53,9],[19,4,40,8]],'#343f47','arcade / cabinet shell');displayScreen(prop,px,35,front-2,27,19,'arcade');box(prop,px,20,front,31,4,3,'#697071');for(const dx of [-8,5,10])cylinder(prop,px+dx,23,front,1.2,1,'#9a8f78');box(prop,px,51,front,29,3,1,'#8d7881');}
   }else if(level===3&&o.theme==='food'){
    clad(box(prop,x,20,z,o.w,40,o.h,'#7d8981'),'metal','#8c978b');for(let i=0;i<5;i++){const px=o.x+20+i*(o.w-40)/4;box(prop,px,22,front+.6,28,29,1,'#687a72');box(prop,px,29,front+1.5,16,1.5,1.5,'#b9bdad');for(const dx of [-6,6])cylinder(prop,px+dx,43,z,5.5,2,'#253c37');}readableAroundActors(clad(box(prop,x,65,z,o.w,13,o.h,'#83938a'),'metal','#88938b'),o.w);for(let k=0;k<18;k++)box(prop,o.x+7+k*(o.w-14)/17,61,z+o.h/2+.1,1,7,.5,'#4b6159');
   }else{
    clad(box(prop,x,25,z,o.w,50,o.h,'#504b3f'),'wood');
    for(let k=0;k<3;k++){box(prop,x,8+k*15,z,o.w,2,o.h+3,'#a69b7c');const count=o.theme==='electronics'?5:10;for(let j=0;j<count;j++){const px=o.x+10+j*(o.w-20)/(count-1),yy=14+k*15;
     if(o.theme==='pharmacy'){cylinder(prop,px,yy,z,2.8,9,j%3?'#afb8a1':'#73978a');cylinder(prop,px,yy+5,z,2.7,1.8,'#dad5b5');}
     else if(o.theme==='electronics'){box(prop,px,yy+1,z,25,13,8,'#2e4547');box(prop,px,yy+2,front+.5,21,9,.5,j%2?'#6b8380':'#738690');}
     else if(o.theme==='fashion'){for(let fold=0;fold<3;fold++)clad(box(prop,px,yy-3+fold*2,z,12,2,12,'#807764'),'fabric',['#887b68','#647979','#816c69'][(j+k)%3]);}
     else if(o.theme==='sports'){box(prop,px,yy-1,z,13,5,9,j%2?'#92968a':'#617971');box(prop,px+3,yy+2,z-1,6,3,7,'#b0ad91');}
     else{const bottle=cylinder(prop,px,yy,z,2.7,10,j%2?'#748b68':'#9b9e7c');cylinder(prop,px,yy+6,z,1.2,3,'#aab49a');box(prop,px,yy,front+.3,3.6,4,.4,'#c2b99a');}
    }}
   }
  }else if(o.kind==='stall'){
   if(level===2){
    clad(box(prop,x,16,z,o.w-3,27,o.h-3,'#7e9488'),'metal');box(prop,x,31,z,o.w,3,o.h,'#b4beb1');for(const dx of [-o.w*.32,o.w*.32])for(const dz of [-o.h*.33,o.h*.33]){const wheel=cylinder(prop,x+dx,4,z+dz,4,3,'#293b36');wheel.rotation.x=Math.PI/2;}
    for(let i=0;i<3;i++){box(prop,x,10+i*7,z+o.h*.5-.5,o.w-9,5,1,'#a0b0a0');box(prop,x,10+i*7,z+o.h*.5+.3,12,1,1,'#536d61');}
    if(o.id==='service-trolley'){for(let i=0;i<4;i++)clad(box(prop,x,35+i*2,z,28,2,22,'#b6bda8'),'fabric','#b6bda8');}else{box(prop,x-o.w*.18,42,z,19,20,24,'#927e57');box(prop,x-o.w*.18,53,z,21,3,25,'#ac9569');displayScreen(prop,x+o.w*.22,42,z+o.h*.3,17,12,'medical');}
   }else if(level===3){
    clad(box(prop,x,17,z,o.w,34,o.h,'#674d40'),'wood','#6a4f44');box(prop,x,35,z,o.w+1,3,o.h+1,'#afa187');for(const dx of [-o.w*.43,o.w*.43])rod(prop,x+dx,36,z-o.h*.3,x+dx,60,z-o.h*.3,1.4,'#a99d85');readableAroundActors(box(prop,x,62,z,o.w,4,o.h,'#776558'),o.w);
    const glass=box(prop,x,47,z,o.w-8,21,o.h-7,'#68807b');glass.material=glassMat;glass.castShadow=false;for(let i=0;i<5;i++){const cup=cylinder(prop,o.x+9+i*(o.w-18)/4,40,z,3.5,7,'#bea883');cylinder(prop,o.x+9+i*(o.w-18)/4,44,z,3.7,1,'#dec7a0');}retailPanel(prop,o.id==='abandoned-cart'?'LAST SHOW':'PICK UP','C O N C E S S I O N S',x,25,z+o.h/2+.5,o.w-7,11,'#c2a184','#3a2c29');
   }else{
    box(prop,x,17,z,o.w,34,o.h,'#76694e');for(const sx of [o.x+4,o.x+o.w-4])box(prop,sx,45,z,3,55,3,'#848d7a');
    const awning=box(prop,x,64,z,o.w+4,2,o.h+4,'#7f8063');awning.rotation.z=.06;readableAroundActors(awning,o.w+4);for(let i=0;i<7;i++){const stripe=box(prop,o.x+3+i*(o.w-2)/7,65+(i-3)*.3,z,(o.w-2)/7-1,.4,o.h+4,i%2?'#586559':'#9d977b');stripe.rotation.z=.06;readableAroundActors(stripe,(o.w-2)/7-1);}retailPanel(prop,o.id==='abandoned-cart'?'BOTANICA':'SUNDAY MARKET','M E R I D I A N',x,58,o.y+o.h/2+3,o.w-3,10,'#d2c49d');for(let i=0;i<5;i++){cylinder(prop,o.x+8+i*(o.w-12)/5,39,z,4,8,'#98785a');const leaf=new T.Mesh(new T.SphereGeometry(1,8,6),material('#61765a'));leaf.position.set(o.x+8+i*(o.w-12)/5,46,z);leaf.scale.set(4,7,3);prop.add(leaf);}
    readableFixture(prop);
   }
  }else if(o.kind==='sofa'){
   if(level===2){box(prop,x,14,z,o.w,5,o.h,'#84998a');for(const dx of [-o.w*.37,o.w*.37])for(const dz of [-o.h*.34,o.h*.34]){rod(prop,x+dx,4,z+dz,x+dx,14,z+dz,1.7,'#85998b');const wheel=cylinder(prop,x+dx,3,z+dz,3,2,'#293b34');wheel.rotation.x=Math.PI/2;}const bag=loftForm(prop,x,0,z,[[-o.w*.45,17,22,o.h*.19],[-o.w*.31,17,29,o.h*.32],[o.w*.12,17,32,o.h*.37],[o.w*.44,17,23,o.h*.21]],'#91a08f','quarantine / zipped recovery shroud');bag.material=surface('fabric','#8b9e90');box(prop,x,32.2,z,o.w*.42,.4,.6,'#526d5e');for(const side of [-1,1])rod(prop,x-o.w*.44,20,z+side*o.h*.46,x+o.w*.44,20,z+side*o.h*.46,1.2,'#a0af9c');}
   else{const cloth=level===3?'#77504b':'#685e4c';clad(box(prop,x,12,z,o.w,23,o.h,cloth),'fabric',cloth);clad(box(prop,x,13,o.y+4,o.w,26,8,cloth),'fabric',cloth);for(const sx of [o.x+5,o.x+o.w-5])clad(box(prop,sx,17,z,10,25,o.h,cloth),'fabric',cloth);for(let i=0;i<3;i++){const cushion=clad(box(prop,o.x+19+i*27,26,z,24,7,23,cloth),'fabric',level===3?'#9b6c59':'#8c7b60');cushion.rotation.z=(i-1)*.2;}}
  }else if(o.kind==='table'){
   box(prop,x,23,z,o.w,4,o.h,'#a4916b');for(const sx of [o.x+4,o.x+o.w-4])box(prop,sx,11,z,4,22,4,'#555f53');
  }else if(o.kind==='car'){
   vehicle(prop,o);
  }else if(o.kind==='planter'){
   const pot=new T.Mesh(new T.CylinderGeometry(Math.min(o.w,o.h)*.45,Math.min(o.w,o.h)*.39,29,24),surface('stone'));pot.position.set(x,14.5,z);pot.castShadow=true;prop.add(pot);cylinder(prop,x,30,z,Math.min(o.w,o.h)*.4,2,'#262e23');
   const leafMat=material(clean?'#42634d':'#4f5943');for(let k=0;k<16;k++){const a=k*2.4,leaf=new T.Mesh(new T.SphereGeometry(1,8,6),leafMat);leaf.scale.set(3.5,20+k%4*2,1.2);leaf.position.set(x+Math.cos(a)*12,43+k%3*4,z+Math.sin(a)*12);leaf.rotation.set(Math.sin(a)*.7,a,Math.cos(a)*.7);prop.add(leaf);}
  }else if(o.kind==='bench'){
   if(level===2){box(prop,x,18,z,o.w,4,o.h,'#769485');clad(box(prop,x,23,z,o.w-5,7,o.h-4,'#9caf9c'),'fabric','#9daf9e');clad(box(prop,o.x+15,28,z,21,6,o.h-6,'#c4cbb5'),'fabric','#c4cbb5');for(const dx of [-o.w*.4,o.w*.4])for(const dz of [-o.h*.33,o.h*.33]){rod(prop,x+dx,4,z+dz,x+dx,18,z+dz,1.8,'#789385');const wheel=cylinder(prop,x+dx,4,z+dz,3.5,2.5,'#273e35');wheel.rotation.x=Math.PI/2;}for(const side of [-1,1]){rod(prop,x-o.w*.43,32,z+side*o.h*.45,x+o.w*.43,32,z+side*o.h*.45,1.2,'#adbdab');for(const dx of [-o.w*.4,o.w*.4])rod(prop,x+dx,20,z+side*o.h*.45,x+dx,32,z+side*o.h*.45,1,'#789387');}}
   else if(level===3){box(prop,x,6,z,o.w,12,o.h,'#303735');for(let i=0;i<4;i++){const px=o.x+(i+.5)*o.w/4;clad(box(prop,px,17,z,o.w/4-3,9,o.h-3,'#74434a'),'fabric','#74434a');clad(box(prop,px,29,o.y+3,o.w/4-4,22,6,'#865453'),'fabric','#865453');box(prop,px+o.w/8-1,23,z,2,4,o.h-3,'#a49679');}}
   else{box(prop,x,14,z,o.w,6,o.h,'#a18e6a');box(prop,x,26,o.y+3,o.w,22,6,'#8c795b');for(const sx of [o.x+12,o.x+o.w-12])box(prop,sx,6,z,7,12,o.h-4,'#4c5b55');for(let k=0;k<5;k++)box(prop,x,17.3,o.y+6+k*4,o.w-4,.5,1,'#615641');}
  }else if(o.kind==='kiosk'){
   if(level===3){
    clad(box(prop,x,17,z,o.w,34,o.h,'#7f7865'),'metal','#879083');box(prop,x,35,z,o.w+1,3,o.h+1,'#b2b5a2');
    for(const dx of [-o.w*.31,0,o.w*.31]){box(prop,x+dx,19,o.y+o.h+.3,33,26,1,'#3b5048');box(prop,x+dx,24,o.y+o.h+1,23,2,2,'#adbaaa');for(const dz of [-o.h*.22,o.h*.22]){cylinder(prop,x+dx,37,z+dz,8,1.8,'#203633');cylinder(prop,x+dx,38,z+dz,4,.5,'#63796c');}for(let k=0;k<3;k++)box(prop,x+dx-9+k*9,32,o.y+o.h+1.2,2,2,1,'#af9b77');}
    for(const side of [-1,1])rod(prop,x+side*o.w*.44,37,z-o.h*.34,x+side*o.w*.44,69,z-o.h*.34,1.8,'#778c7c');readableAroundActors(clad(box(prop,x,72,z,o.w+1,12,o.h-5,'#77887e'),'metal','#8d9b8b'),o.w);for(let k=0;k<12;k++)readableAroundActors(box(prop,o.x+9+k*(o.w-18)/11,67,z+o.h*.43,1,4,1,'#42594f'),1);
    retailPanel(prop,'THE TABLE','H O T   F O O D   /   N O   S E R V I C E',x,18,o.y+o.h+1,o.w-12,12,'#c1ad87','#3c493d');
   }else{
    clad(box(prop,x,15,z,o.w,30,o.h,'#596f69'),'wood');box(prop,x,31,z,o.w+1,3,o.h+1,'#aaa48f');for(const sx of [o.x+7,o.x+o.w-7]){cylinder(prop,sx,43,z,2,26,'#8b9a89');box(prop,sx,55,z,7,2,o.h-8,'#c3b492');}const display=box(prop,x,42,z,o.w-28,19,o.h-14,'#577b80');display.material=glassMat;
    for(let k=0;k<7;k++){const device=box(prop,o.x+18+k*16,34,o.y+20,9,1.5,15,'#202b2a');device.rotation.y=(k%3-1)*.12;box(prop,o.x+18+k*16,35,o.y+20,7,.2,11,k%2?'#53696c':'#9d9a7e');}retailPanel(prop,'FIX / LAB','P H O N E S   ·   R E P A I R S',x,54,o.y+o.h/2+1,o.w-8,13,'#b6c5b1');for(let k=0;k<9;k++)box(prop,o.x+6+k*(o.w-12)/8,15,o.y+o.h+.1,1,26,1,'#6c6650');
   }
  }else if(o.kind==='rack'){
   box(prop,x,25,z,o.w,50,o.h,'#6b5d47');for(let k=0;k<4;k++){box(prop,x+o.w/2+.5,14+k*10,z,1,2,o.h-8,'#b4a583');for(let j=0;j<3;j++)box(prop,x+o.w/2+1,20+k*10,o.y+18+j*29,2,3,19,'#293b39');}
  }else if(o.kind==='counter'||o.kind==='desk'){
   const clinical=level===2,steel=clinical||level===3;clad(box(prop,x,17,z,o.w,34,o.h,steel?'#859586':'#79684e'),steel?'metal':'wood');box(prop,x,35,z,o.w,3,o.h,steel?'#b5c0ad':'#b6a684');for(let i=0;i<3;i++){box(prop,o.x+5+i*(o.w-8)/3,19,o.y+o.h+.1,1,24,.5,steel?'#4c6c5d':'#403d31');box(prop,o.x+9+i*(o.w-8)/3,25,o.y+o.h+.5,7,1,1,steel?'#adbda9':'#9c9d82');}
   if(o.kind==='desk'){displayScreen(prop,x-20,48,z-3,26,18,'security');displayScreen(prop,x+14,47,z-4,24,16,'security');box(prop,x+34,38,z+4,13,3,11,'#bfbba6');for(let i=0;i<4;i++)box(prop,x+33,39.5+i*.3,z+4,10,.15,8,'#d0cbb3');box(prop,x-17,37,z+9,22,1.5,6,'#344842');rod(prop,x+34,39,z-7,x+34,49,z-7,.8,'#3a5046');}
   else if(clinical){displayScreen(prop,x,44,z-1,19,14,'medical');box(prop,x,36.8,z+6,17,1,8,'#a6b8a3');for(const dx of [-o.w*.32,o.w*.32]){cylinder(prop,x+dx,41,z+2,2.4,9,'#7f9b8b');cylinder(prop,x+dx,46,z+2,2.4,1,'#bcc9b1');}}
   else{const till=box(prop,x,42,z,13,11,3,'#243e3c');till.rotation.x=-.18;glow(prop,x,43,z+1.8,9,6,.3,'#7c9b8a');box(prop,x,36,z+4,20,2,13,'#4e5e52');if(level===3){cylinder(prop,x-o.w*.3,40,z,3,8,'#c2b399');box(prop,x+o.w*.32,38,z,9,3,8,'#9e8465');}}
  }else if(o.kind==='vent'||o.kind==='roofaccess'){
   if(o.kind==='roofaccess'){clad(box(prop,x,29,z,o.w,58,o.h,'#899286'),'plaster');box(prop,x,12,z,o.w+.2,24,o.h+.2,'#62756b');const roof=clad(box(prop,x,61,z,o.w+3,5,o.h+3,'#61766c'),'metal');roof.rotation.z=.015;for(let i=0;i<14;i++)box(prop,o.x+5+i*(o.w-10)/13,64,z,1.5,1.5,o.h,'#879387');box(prop,x,28,o.y+o.h+.2,47,51,1,'#3b544b');box(prop,x,48,o.y+o.h+1,36,5,.5,'#8fa18c');box(prop,x+16,27,o.y+o.h+1,2,5,1,'#bec5af');sign('ROOF ACCESS',x,75,o.y+o.h,130,16);}
   else{clad(box(prop,x,24,z,o.w,48,o.h,'#71867c'),'metal','#75877d');box(prop,x,3,z,o.w+1,6,o.h+1,'#364e48');for(const side of [-1,1]){box(prop,x,26,z+side*(o.h*.5+.2),o.w-12,34,.6,'#3d5750');for(let k=0;k<14;k++)box(prop,o.x+9+k*(o.w-18)/13,26,z+side*(o.h*.5+.6),2,31,.5,'#91a18f');}box(prop,o.x+1,27,z,1,31,o.h-12,'#9caa97');box(prop,o.x+.3,27,z,1,5,13,'#576e5f');for(const px of [o.x+6,o.x+o.w-6])for(const pz of [o.y+6,o.y+o.h-6])cylinder(prop,px,49,pz,1.5,1,'#b9c0ab');}
  }else if(o.kind==='paystation'){
   box(prop,x,28,z,o.w,56,o.h,'#58716a');glow(prop,x,40,o.y+o.h/2+1,24,16,1,'#b5c3a4');sign('P2',x,70,z,35,19);
  }
 }
 if(clean){
  group.userData.lifeActors=[];
  for(const person of g.filmCivilians||[])group.userData.lifeActors.push(makeMallCivilian(T,group,person,{box,cylinder}));
  const shutter=new T.Group();group.add(shutter);for(let i=0;i<9;i++)box(shutter,207,4+i*6,224,116,5,4,'#b4b5a2');group.userData.lifeShutter=shutter;
 }
 for(const o of m.shops||[])furniture(o);
 for(const o of m.cover)furniture(o);
 if(!parking&&!roof&&!clean){
  const spillMat=new T.MeshStandardMaterial({color:'#283c39',transparent:true,opacity:.36,roughness:.18,metalness:.3,depthWrite:false}),paperMat=material('#aaa58f'),wireMat=material('#202d29');
  for(const [i,shop]of (m.shops||[]).entries()){
   const front=shop.south?shop.y-12:shop.y+shop.h+12,sx=shop.x+36;
   const outline=new T.Shape();for(let j=0;j<15;j++){const a=j/14*Math.PI*2,r=1+Math.sin(j*3.7+i)*.16,x=Math.cos(a)*31*r,y=Math.sin(a)*9*r;j?outline.lineTo(x,y):outline.moveTo(x,y);}const pool=new T.Mesh(new T.ShapeGeometry(outline),spillMat);pool.rotation.x=-Math.PI/2;pool.position.set(sx,.15,front);pool.name='floor-only / water ingress';group.add(pool);
   for(let j=0;j<6;j++){const shardShape=new T.Shape();shardShape.moveTo(0,0);shardShape.lineTo(3+j%3,1);shardShape.lineTo(-2,5+j%3);shardShape.closePath();const shard=new T.Mesh(new T.ShapeGeometry(shardShape),j%2?paperMat:material('#78948c'));shard.rotation.x=-Math.PI/2;shard.rotation.z=j*1.7;shard.position.set(sx+Math.sin(j*5)*23,.25,front+Math.cos(j*3)*9);shard.name='floor-only / display fragments';group.add(shard);}
   if(i%2===0){const cable=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3([new T.Vector3(sx+42,.6,front-3),new T.Vector3(sx+50,.6,front+12),new T.Vector3(sx+64,.6,front+16),new T.Vector3(sx+69,.6,front+5)]),12,.5,5,false),wireMat);cable.name='floor-only / fallen wiring';group.add(cable);const panel=box(group,sx+55,.5,front+6,23,.6,13,'#929487');panel.rotation.y=.25;for(let k=0;k<4;k++)box(group,sx+49+k*4,1,front+6,1,.2,9,'#424f48');}
  }
 }

 // Pooled movable bodies: renderer only reads simulation transforms.
 group.userData.looseBodies=[];
 for(let i=0;i<160;i++){const root=new T.Group();root.visible=false;group.add(root);const mesh=box(root,0,0,0,1,1,1,'#8d8c75');mesh.material=mesh.material.clone();const back=box(root,0,0,0,1,1,1,'#636f60');back.visible=false;const round=cylinder(root,0,0,0,1,1,'#8d9c79');round.material=round.material.clone();round.visible=false;const trim=[];for(let j=0;j<4;j++)trim.push(box(root,0,0,0,1,1,1,'#454c40'));const handle=new T.Group();root.add(handle);box(handle,0,2,0,8,1.5,2,'#222d29');for(const dx of [-4,4])box(handle,dx,0,0,1.5,4,2,'#222d29');handle.visible=false;
 const actor={root,mesh,back,round,trim,handle,style(p){if(this.styleKind!==p.kind){mesh.material.needsUpdate=true;this.styleKind=p.kind;}handle.visible=p.kind==='case';handle.position.y=p.h/2+1.5;mesh.material.map=p.kind==='case'?surface('fabric').map:p.kind==='crate'?surface('cardboard').map:null;mesh.material.color.set(p.kind==='case'?'#81918b':p.kind==='crate'?'#dfcba2':p.color);if(p.kind==='case'||p.kind==='crate')for(let j=0;j<trim.length;j++){const t=trim[j];t.material=surface(p.kind==='case'?'metal':'cardboard');if(p.kind==='case'){t.scale.set(p.w-1,.6,.6);t.position.set(0,p.h/2-1,(j%2?1:-1)*(p.d/2-.8));t.visible=j<2;}else{t.scale.set(j%2?2:p.w+.2,.3,j%2?p.d+.2:2);t.position.set(0,p.h/2+.2,j%2?0:(j<2?-1:1)*p.d*.3);}}}};group.userData.looseBodies.push(actor);}

 // Place-specific details use the same solid footprints; the travel lane stays clear.
 if(parking){
  for(const z of [70,690]){const pipe=cylinder(group,600,89,z,2.4,1070,'#536663');pipe.rotation.z=Math.PI/2;for(const x of [160,440,750,1050]){box(group,x,90,z,7,5,10,'#7c8173');const drip=box(group,x,38,z, .5,8,.5,'#8dada9');drip.material.transparent=true;drip.material.opacity=.3;group.userData.mallDrips??=[];group.userData.mallDrips.push({mesh:drip,phase:x*.1});}}
  for(const [x,z]of [[180,265],[650,475],[1040,285]]){const puddle=new T.Mesh(new T.CircleGeometry(1,24),new T.MeshStandardMaterial({color:'#151f22',roughness:.16,metalness:.25,transparent:true,opacity:.62,depthWrite:false}));puddle.rotation.x=-Math.PI/2;puddle.position.set(x,.05,z);puddle.scale.set(48,15,1);group.add(puddle);}
  retailPanel(group,'MERIDIAN','P 2   /   N O R T H   P A R K I N G',600,81,36,260,29,'#a6b9ad');
  sign('RETAIL ↑ / SERVICE LIFT',1030,72,330,145,16,'#d0bb83');
  for(const [x,text]of [[285,'B'],[610,'C'],[965,'D']])sign('P2 / '+text,x,64,95,72,20,'#b9b69c');
  // Fluorescent pools leave dark gaps between the parking bays.
  for(const x of [230,600,1000]){box(group,x,83,280,70,4,10,'#283331');glow(group,x,80,280,58,1,5,'#b7c8b2');const lamp=new T.PointLight('#b8c6b0',1250,165,2);lamp.position.set(x,75,280);group.add(lamp);group.userData.animations.push({kind:'light',mesh:lamp,base:1250,phase:x*.1});}
 }else if(level===1){
  retailPanel(group,'YOU ARE HERE','P H A R M A C Y   /   F O O D   H A L L   /   S E C U R I T Y',462,69,345,125,18,'#c7c09f');
  for(const x of [300,590,875]){const banner=box(group,x,85,48,44,34,1,'#465c55');banner.rotation.z=(x%3-1)*.045;sign('SALE',x,86,51,34,13,'#c0b79b');}
  sign('SECURITY →',880,65,260,105,14,'#adc3b4');
  sign('PLEASE DO NOT LEAVE CHILDREN UNATTENDED',495,55,690,215,11,'#a49578');
 }
 if(!clean){group.userData.mallEntrances=[];for(const portal of m.entrances||[]){let door=null;const direction=Math.atan2(portal.toY-portal.y,portal.toX-portal.x),x=portal.x-Math.cos(direction)*13,z=portal.y-Math.sin(direction)*13;
  if(portal.kind==='shop'){const curtain=box(group,x,24,z,54,48,1,'#10191a');curtain.material=new T.MeshStandardMaterial({color:'#10191a',roughness:1,transparent:true,opacity:.87});for(const dx of [-27,27])box(group,x+dx,24,z,2,48,2,'#394840');}
  if(portal.kind==='roof'){box(group,x,24,z,66,48,3,'#182220');box(group,x-35,28,z,5,56,8,'#59665e');box(group,x+35,28,z,5,56,8,'#59665e');sign('STAIR B',x,58,z,65,12,'#b5c0a7');}
  if(portal.kind==='service'){door=box(group,1159,27,portal.y,3,54,54,'#354b47');box(group,1158,57,portal.y,7,5,62,'#788476');sign('STAFF ONLY',1151,66,portal.y,72,12,'#b5c0a7');}
  const lamp=glow(group,x,10,z,portal.kind==='cars'?9:5,2,3,'#374c40');lamp.material=lamp.material.clone();group.userData.mallEntrances.push({id:portal.id,lamp,door});
 }}
 function elevator(x,z,incoming,width=140){box(group,x+42,.4,z,84,1,width,'#7c8474');for(const dz of [-width/2,width/2])box(group,x,30,z+dz,9,60,9,'#b0b3a0');box(group,x,63,z,12,8,width+15,'#73857a');const panels=[];for(const side of [-1,1]){const door=box(group,x,30,z+side*width*.25,5,60,width/2,'#9aab9e');panels.push({mesh:door,side});for(let k=0;k<4;k++)box(door,0,0,(k-1.5)*.15,1,1,.01,'#687e73');}group.userData.liftDoors??=[];group.userData.liftDoors.push({panels,z,width,incoming});sign(incoming?'ARRIVAL':'LIFT ↑',x,82,z,85,16,'#cddac3');}
 elevator(180,380,true);if(level!==4)elevator(level===1?1056:1070,level===1?620:380,false,level===1?78:140);
 if(level===1){sign('KESSLER ARMS',1035,63,510,175,18,'#c7b286');sign('SERVICE LIFT ↑',1090,64,688,110,14,'#bdcbb5');}
 if(level>0&&level<4){
  for(const x of [70,345,620,900]){const light=new T.PointLight(level===2?'#9dbdbb':level===3?'#d9ab78':'#e7d5b3',m.memoryRuins?650:level===2?1300:1600,260,2);light.position.set(x,86,360);group.add(light);}
  // A rear mezzanine edge gives the concourse a shopping-centre elevation.
  // It is entirely above the existing north boundary, clear of the playable lane.
  clad(box(group,600,83,27,1158,12,14,'#776f5c'),'stone');box(group,600,91,27,1160,2,14,'#aa9875');
  for(let x=40;x<1170;x+=28){cylinder(group,x,102,27,1,22,'#839284');}box(group,600,114,27,1160,2,3,'#9f9b80');
  retailPanel(group,'MERIDIAN','G A L L E R I A   ·   E S T .   1 9 8 7',600,71,36,170,26,'#d2b880');
  // Ceiling light strips sit above closed shop footprints, never across sight lines.
  for(const x of [200,480,760])for(const z of [244,560])glow(group,x,68,z,95,2,3,'#d9d0b4');
 }
 if(level===4){
  const landing=new T.SpotLight('#d4dcc7',.18,420,.65,.65,1.1);landing.position.set(1090,170,380);landing.target.position.set(1020,0,380);group.add(landing,landing.target);group.userData.roofLanding=landing;for(const x of [1025,1145])for(const z of [315,445])glow(group,x,3,z,18,2,4,'#cfa76b');
  const heli=new T.Group();heli.name='Vantage / hand-shaped extraction helicopter';group.add(heli);
  loftForm(heli,0,0,0,[[-83,28,47,14],[-57,18,60,27],[28,18,59,29],[69,27,44,18]],'#41584b','helicopter / fuselage shell');
  loftForm(heli,0,0,0,[[25,37,58,27],[52,31,53,23],[75,29,40,11]],'#4b6668','helicopter / cockpit glass');
  for(const side of [-1,1]){
   quad(heli,[[-42,31,side*28.7],[-42,54,side*25.7],[15,54,side*28],[15,31,side*30]],'#213936','helicopter / cabin window');box(heli,-12,25,side*29,58,16,1.2,'#526559');box(heli,12,35,side*30,8,1.4,1,'#aab29e');rod(heli,30,33,side*28,31,58,side*23,1.5,'#9aa89a');
   for(const dx of [-43,41])rod(heli,dx,21,side*22,dx,6,side*35,2,'#7f9384');const skidPath=new T.CurvePath();skidPath.add(new T.QuadraticBezierCurve3(new T.Vector3(-81,10,side*35),new T.Vector3(-80,4,side*35),new T.Vector3(-70,4,side*35)));skidPath.add(new T.LineCurve3(new T.Vector3(-70,4,side*35),new T.Vector3(70,4,side*35)));skidPath.add(new T.QuadraticBezierCurve3(new T.Vector3(70,4,side*35),new T.Vector3(80,4,side*35),new T.Vector3(81,10,side*35)));const skid=new T.Mesh(new T.TubeGeometry(skidPath,24,1.8,6,false),material('#819184',.5));skid.castShadow=true;heli.add(skid);
   loftForm(heli,-13,0,side*13,[[-27,55,65,7],[-17,55,71,8],[18,55,67,7],[24,57,62,5]],'#51685a','helicopter / engine nacelle');rod(heli,-43,61,side*13,-29,61,side*13,4,'#293c36');
   glow(heli,-38,43,side*30,3,2,1,side<0?'#9d6553':'#829d7c');
  }
  // An open boarding aperture reads as a cabin, without changing the landing target.
  box(heli,-12,38,30,42,34,.5,'#152a27');box(heli,-12,21,31,43,2,2,'#9fae98');for(const dx of [-34,10])box(heli,dx,38,31,1.8,35,1.5,'#879c88');box(heli,-12,55,30,44,1.8,1.5,'#879c88');box(heli,-12,31,30.5,28,3,.4,'#526957');
  loftForm(heli,0,0,0,[[-172,47,52,4],[-104,36,54,9],[-72,32,55,12]],'#465b4e','helicopter / tapered tail boom');
  quad(heli,[[-168,49,-2],[-177,91,-2],[-154,87,-2],[-145,49,-2]],'#647562','helicopter / tail fin');box(heli,-145,56,0,30,2,44,'#687969');
  const tailRotor=new T.Group();tailRotor.position.set(-165,72,3);heli.add(tailRotor);box(tailRotor,0,0,0,33,2,1.8,'#52695a');box(tailRotor,0,0,0,2,33,1.8,'#52695a');group.userData.tailRotor=tailRotor;
  cylinder(heli,0,73,0,4,18,'#899a88');cylinder(heli,0,82,0,10,4,'#4e6554');const rotor=new T.Group();heli.add(rotor);rotor.position.y=83;
  for(let i=0;i<4;i++){const blade=quad(rotor,[[8,0,-3],[141,0,-4],[145,0,2],[8,0,3]],'#334a3d','helicopter / tapered rotor blade');blade.rotation.y=i*Math.PI/2;blade.material.roughness=.7;}
  heli.traverse(mesh=>{if(!mesh.isMesh)return;mesh.material=mesh.material.clone();mesh.material.transparent=true;mesh.material.depthWrite=false;mesh.userData.heliRotor=rotor.children.includes(mesh);});group.userData.helicopter={heli,rotor};
 }

 if(level===2){
  sign('03 / QUARANTINE',230,87,285,180,21,'#a5c0b1');sign('ROOF LIFT  →',1000,71,289,125,15,'#c4ad79');
  for(const x of [145,435,710]){box(group,x,78,83,100,2,3,'#79948c');for(const dx of [-48,48])box(group,x+dx,45,83,2,66,2,'#667c73');const curtain=box(group,x,45,83,96,62,1,'#607e75');curtain.material=new T.MeshStandardMaterial({color:'#72978a',transparent:true,opacity:.55,roughness:.9});}
 }
 if(level===3){
  sign('04 / FOOD HALL',220,89,285,185,23,'#d3b181');sign('PICTURES / LAST SHOW 02:17',480,91,215,220,16,'#c8a1a4');
  for(const [x,word]of [[405,'01'],[485,'02'],[565,'03']]){box(group,x,28,60,45,55,1,'#3c343e');box(group,x,51,61,37,3,1,'#a18d83');sign('SCREEN '+word,x,67,63,59,11,'#c0a595');}
 }
 if(roof){
  sign('05 / ROOF PLANT',220,84,140,185,22,'#a7b9b5');sign('LANDING ZONE  →',900,48,210,160,17,'#c5b98b');
  for(const o of m.cover)if(o.kind==='vent'){const x=o.x+o.w/2,z=o.y+o.h/2;for(const dx of [-o.w*.25,o.w*.25]){const fan=cylinder(group,x+dx,54,z,Math.min(o.h*.35,o.w*.2),8,'#344c4b');for(let k=0;k<8;k++){const blade=box(group,x+dx,59,z,2,1,o.h*.6,'#738481');blade.rotation.y=k*Math.PI/4;}cylinder(group,x+dx,60,z,5,3,'#8b9890');const guard=new T.Mesh(new T.TorusGeometry(Math.min(o.h*.35,o.w*.2),1.1,6,24),material('#92a18e',.5));guard.rotation.x=Math.PI/2;guard.position.set(x+dx,61,z);group.add(guard);for(let k=-2;k<=2;k++)box(group,x+dx+k*5,61.5,z,.7,.7,o.h*.52,'#8f9f8b');}for(const dz of [-o.h*.4,o.h*.4])box(group,x,51,z+dz,o.w-4,3,3,'#7d8e87');}
  for(let x=80;x<1160;x+=36){cylinder(group,x,18,25,1,36,'#647876');}for(const y of [12,29])box(group,600,y,25,1155,1,1,'#81908a');
  for(let i=0;i<14;i++){const x=50+i*95,z=-170-(i%3)*45,height=70+(i*47)%110,w=65+i%3*10;box(group,x,height/2,z,w,height,75,i%3?'#243638':'#34423d');box(group,x,height+2,z,w+2,4,77,'#4a5d54');for(let row=15;row<height-8;row+=18)for(const dx of [-17,0,17])if((i+row+dx)%4)glow(group,x+dx,row,z+38,5,7,.4,(i+row)%3?'#647b76':'#a59b75');if(i%4===1){for(const dx of [-10,10])for(const dz of [-10,10])rod(group,x+dx,height+3,z+dz,x+dx,height+20,z+dz,1.5,'#58614f');cylinder(group,x,height+31,z,15,26,'#4c5544');for(const yy of [height+21,height+31,height+41]){const band=new T.Mesh(new T.TorusGeometry(15.3,.65,5,20),material('#76816a'));band.rotation.x=Math.PI/2;band.position.set(x,yy,z);group.add(band);}const top=new T.Mesh(new T.ConeGeometry(16,10,16),material('#6e7761'));top.position.set(x,height+49,z);group.add(top);}else if(i%3===0){box(group,x-9,height+11,z,24,18,29,'#3a514b');rod(group,x+17,height+4,z-15,x+17,height+43,z-15,.9,'#788978');}}

 }
 return group;
}

// Cinematic citizens have an ordinary clothing rig, independent of combat/enemy rigs.
function makeMallCivilian(T,parent,person,{box,cylinder}){
 const root=new T.Group();parent.add(root);const sphere=(x,y,z,sx,sy,sz,color)=>{const mesh=new T.Mesh(new T.SphereGeometry(1,12,10),new T.MeshStandardMaterial({color,roughness:.85}));mesh.position.set(x,y,z);mesh.scale.set(sx,sy,sz);mesh.castShadow=true;root.add(mesh);return mesh;};
 const torso=sphere(0,29,0,8.5,11,7,person.shirt),head=sphere(0,44,0,5.6,7,5.2,person.skin);sphere(-1,48,0,5.4,3.8,5.1,person.guard?'#344c60':'#493e31');sphere(5.4,44,0,1.5,1.6,1.7,person.skin);sphere(5.2,46,-2.8,.8,.6,.5,'#34352e');sphere(5.2,46,2.8,.8,.6,.5,'#34352e');cylinder(root,0,36,0,3,5,person.skin);
 const hips=box(root,0,19,0,12,7,11,'#46534f'),arms=[],legs=[],knees=[],feet=[],elbows=[];
 for(const side of [-1,1]){
  const arm=new T.Group();arm.position.set(0,34,side*8);root.add(arm);cylinder(arm,0,-5,0,2.4,10,person.shirt);const elbow=new T.Group();elbow.position.y=-10;arm.add(elbow);cylinder(elbow,1,-3,0,1.8,7,person.skin);box(elbow,1,-7,0,3,4,3,person.skin);elbows.push(elbow);arms.push(arm);
  const leg=new T.Group();leg.position.set(0,18,side*4);root.add(leg);cylinder(leg,0,-4.5,0,3,9,'#46534f');const knee=new T.Group();knee.position.y=-9;leg.add(knee);cylinder(knee,0,-4.5,0,2.4,9,'#46534f');const foot=box(knee,2,-8,0,8,3,5,'#353c36');knees.push(knee);feet.push(foot);legs.push(leg);
 }
 let cart;if(person.cleaner){cart=new T.Group();root.add(cart);box(cart,25,12,0,22,23,18,'#638d87');box(cart,25,23,0,25,3,20,'#b7c2ac');for(const dz of [-8,8])cylinder(cart,25,2,dz,3,3,'#303e39');box(cart,14,27,0,2,14,20,'#7f9584');const mop=new T.Group();root.add(mop);mop.position.set(18,1,10);const shaft=cylinder(mop,-5,20,0,1,44,'#b5a990');shaft.rotation.z=-.25;box(mop,0,0,0,14,2,8,'#b7b39d');cart.userData.mop=mop;}
 let bag;if(person.bag){bag=box(arms[1],1,-20,0,8,11,7,'#a38b62');box(arms[1],1,-14,0,5,3,2,'#6d6049');}if(person.phone)box(elbows[0],2,-8,0,4,1,6,'#303c3c');return {root,torso,head,hips,arms,legs,knees,feet,elbows,cart,bag};
}
// Camera-parallel visibility samples use the real world-space sign bounds, not
// an actor's proximity to a whole shop. All vectors and bounds are reused.
function mallSignBlocksActor(entry,actor,sight){
 if(!actor)return false;const fixture=!!entry.cluster,radius=Math.min(fixture?12:10,(actor.r||16)*(fixture?.6:.45)),top=actor.type==='boss'?70:fixture?62:50;
 for(let height=fixture?2:18;height<=top;height+=fixture?12:16)for(let side=-1;side<=1;side++){
  sight.ray.origin.set(actor.x+sight.right.x*radius*side,height,actor.y+sight.right.z*radius*side);
  if(sight.ray.intersectBox(entry.bounds,sight.hit)&&sight.hit.distanceToSquared(sight.ray.origin)>1)return true;
 }
 return false;
}
export function animateMallLife(group,g,view){
 const sight=group.userData.actorSight;if(group.userData.tailRotor)group.userData.tailRotor.rotation.z=(g.visualTime??g.time)*33;
 if(sight&&view){
  view.getWorldDirection(sight.direction).negate();sight.ray.direction.copy(sight.direction);sight.right.set(sight.direction.z,0,-sight.direction.x).normalize();
  for(const cluster of group.userData.actorOcclusionClusters||[])cluster.blocked=false;
  for(const entry of group.userData.actorOccluders||[]){
   const {mesh}=entry;if(!entry.cached){mesh.updateWorldMatrix(true,false);entry.bounds.setFromObject(mesh);entry.cached=true;}
   let blocked=mesh.visible&&(mallSignBlocksActor(entry,g.p,sight)||mallSignBlocksActor(entry,g.companion,sight));
   if(mesh.visible&&!blocked)for(const enemy of g.enemies||[]){if(enemy.hp<=0||enemy.dormant||enemy.entranceState==='hidden'||enemy.entranceState==='warning')continue;if(mallSignBlocksActor(entry,enemy,sight)){blocked=true;break;}}
   entry.blocked=blocked;if(blocked&&entry.cluster)entry.cluster.blocked=true;
  }
  for(const entry of group.userData.actorOccluders||[]){
   const {mesh,opacity}=entry,blocked=entry.blocked||entry.cluster?.blocked,target=blocked?opacity*.2:opacity,mat=mesh.material;mat.opacity=g.reducedMotion?target:mat.opacity+(target-mat.opacity)*.18;const fading=Math.abs(mat.opacity-opacity)>.002,transparent=entry.transparent||fading;if(mat.transparent!==transparent){mat.transparent=transparent;mat.needsUpdate=true;}mat.depthWrite=fading?false:entry.depthWrite;mesh.castShadow=entry.shadow&&mat.opacity>opacity*.7;
  }
 }
 // A nearby strike briefly sags a shop light, never a rapid screen-wide strobe.
 if(g.mission.mall&&!g.mission.beforeOutbreak)group.traverse(mesh=>{if(!mesh.userData.impactReactive)return;let dip=0;if(g.settings?.flashes!==false&&!g.reducedMotion){const point=mesh.getWorldPosition(mesh.position.clone());for(const impact of g.impacts||[]){const distance=Math.hypot(impact.x-point.x,impact.y-point.z);if(distance<110)dip=Math.max(dip,.28*(1-distance/110));}}mesh.intensity=mesh.userData.restIntensity*(1-dip);});

 if(group.userData.lifeShutter){const close=Math.max(0,Math.min(1,((g.mallLifeClock||0)-12)/3));group.userData.lifeShutter.position.y=(1-close)*65;group.userData.lifeShutter.visible=close>0;}
 for(let i=0;i<(group.userData.lifeActors||[]).length;i++){
  const a=group.userData.lifeActors[i],p=g.filmCivilians?.[i];a.root.visible=!!p&&p.visible!==false;if(!p)continue;const fall=p.fall||0,kneel=p.kneel||0,buckle=p.buckle||0,startle=p.startle||0,reaction=p.reaction||0,weight=p.moving?Math.min(1,(p.speed??28)/32):0,walk=Math.sin(p.phase)*weight,t=g.mallLifeClock||0;
  a.root.position.set(p.x,fall*8-kneel*7-buckle*5,p.y);a.root.rotation.set(0,-p.face,-fall*1.46);if(a.cart?.userData.mop)a.cart.userData.mop.rotation.y=p.mopMotion||0;a.torso.rotation.z=kneel*.4-buckle*.4-startle*.12+(p.mopMotion||0)*.2+Math.sin(t*1.8+i)*.012;a.torso.rotation.y=walk*.035;a.torso.position.y=29+Math.sin(p.phase*2)*weight*.2;a.head.rotation.y=-(p.headLook||0);a.head.rotation.z=-kneel*.18+buckle*.25-startle*.08;
  for(let j=0;j<2;j++){
   const phase=p.phase+j*Math.PI,tx=Math.sin(phase)*4*weight,ty=-17.8+Math.max(0,Math.cos(phase))*2.3*weight,reach=Math.min(17.99,Math.hypot(tx,ty)),bend=Math.acos(reach/18),upper=Math.atan2(tx,-ty)-bend;
   a.legs[j].rotation.z=upper+kneel*(j?.8:1)-buckle*.38;a.knees[j].rotation.z=bend*2-kneel*(j?1.6:2)+buckle*.8;a.feet[j].rotation.z=-upper-bend*2+kneel*(j?.8:1)-buckle*.42+Math.sin(phase)*weight*.07;
   const carry=(p.bag&&j===1)||(p.phone&&j===0),gesture=p.gesture||0;
   a.arms[j].rotation.z=(j?-1:1)*walk*(carry?.08:.28)-(p.cleaner?.65+(p.mopMotion||0):0)+kneel*(j?.65:.75)-buckle*.6-startle*(j?.3:.5)-(p.phone&&j===0?.55*(1-reaction):0);
   a.elbows[j].rotation.z=-.15-(p.phone&&j===0?1-.65*reaction:gesture*.2)+kneel*.1-fall*.4;
  }

 }
}
