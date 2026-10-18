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
 ctx.fillStyle='#87877c';ctx.fillRect(0,0,1200,760);
 for(let y=0;y<760;y+=64)for(let x=0;x<1200;x+=64){const n=(x*7+y*13)%19;ctx.fillStyle=`rgb(${133+n/3},${133+n/3},${121+n/3})`;ctx.fillRect(x+.7,y+.7,62.6,62.6);ctx.strokeStyle='#464b4540';ctx.lineWidth=.7;ctx.strokeRect(x+.7,y+.7,62.6,62.6);}
 let stoneSeed=893;const stoneRandom=()=>{stoneSeed=(stoneSeed*1664525+1013904223)>>>0;return stoneSeed/4294967296;};
 for(let i=0;i<28000;i++){const x=stoneRandom()*1200,y=stoneRandom()*760;ctx.fillStyle=['#e6e0cc65','#353e3d55','#bcb6a060','#5d63534a'][i%4];ctx.save();ctx.translate(x,y);ctx.rotate(stoneRandom()*6);ctx.fillRect(0,0,.4+stoneRandom()*1.8,.4+stoneRandom()*1.1);ctx.restore();}
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
 const texture=new T.CanvasTexture(c);texture.colorSpace=T.SRGBColorSpace;
 const floor=new T.Mesh(new T.PlaneGeometry(1200,760),new T.MeshStandardMaterial({map:texture,roughness:parking?.92:roof?.95:.55,metalness:0}));floor.rotation.x=-Math.PI/2;floor.position.set(600,-.8,380);floor.receiveShadow=true;floor.name='Mall terrazzo / footprint-aligned floor';group.add(floor);
 const material=(color,rough=.7)=>new T.MeshStandardMaterial({color,roughness:rough,metalness:.08});
 const glassMat=new T.MeshStandardMaterial({color:'#577b80',transparent:true,opacity:.18,roughness:.13,metalness:.05,depthWrite:false});
 // Shared authored surface maps provide grain, chipped edges and grout without
 // external downloads. Materials are reused across fixtures on this floor.
 const surfaceCache=new Map();
 function surface(kind){if(surfaceCache.has(kind))return surfaceCache.get(kind);const cv=document.createElement('canvas');cv.width=cv.height=256;const cx=cv.getContext('2d');const base={stone:'#a9a496',wood:'#493a30',metal:'#46524e',tile:'#3c6159',plaster:'#9b988a',fabric:'#647167',cardboard:'#a18a60'}[kind];cx.fillStyle=base;cx.fillRect(0,0,256,256);let seed=73;const rnd=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<2400;i++){cx.fillStyle=i%2?'#ffffff0d':'#07171316';const x=rnd()*256,y=rnd()*256;cx.fillRect(x,y,kind==='wood'?18+rnd()*80:1+rnd()*3,kind==='wood'?.6:1+rnd()*2);}
 if(kind==='tile'){for(let x=0;x<256;x+=32)for(let y=0;y<256;y+=64){cx.strokeStyle='#182a2855';cx.lineWidth=2;cx.strokeRect(x,y,32,64);cx.strokeStyle='#c2c6ad22';cx.lineWidth=1;cx.strokeRect(x+2,y+2,28,60);}}
 if(!clean){for(let i=0;i<24;i++){cx.fillStyle='#141e1918';cx.fillRect(rnd()*256,220+rnd()*36,2+rnd()*18,rnd()*16);}}
 const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;const mat=new T.MeshStandardMaterial({map,roughness:kind==='tile'?.32:kind==='metal'?.55:.84,metalness:kind==='metal'?.65:.05,bumpMap:Object.assign(map.clone(),{colorSpace:T.NoColorSpace}),bumpScale:kind==='stone'?.12:.06});surfaceCache.set(kind,mat);return mat;}
 function clad(mesh,kind){mesh.material=surface(kind);return mesh;}
 function retailPanel(parent,text,sub,x,y,z,w,h,color,dark='#172a28'){
  const cv=document.createElement('canvas');cv.width=768;cv.height=192;const cx=cv.getContext('2d');cx.fillStyle=dark;cx.fillRect(0,0,768,192);cx.fillStyle=color;cx.fillRect(18,22,4,148);cx.textAlign='center';cx.fillStyle=color;cx.font='500 64px '+(text==='NIGHT OWL'?'serif':'sans-serif');cx.fillText(text,390,92,690);cx.font='18px sans-serif';cx.fillStyle='#d2cebb';cx.fillText(sub,390,141,690);const map=new T.CanvasTexture(cv);map.colorSpace=T.SRGBColorSpace;const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,emissive:'#ffffff',emissiveMap:map,emissiveIntensity:clean?.2:.12,roughness:.55,side:T.DoubleSide}));mesh.position.set(x,y,z);mesh.rotation.x=-.5;mesh.name='retail identity / '+text;parent.add(mesh);return mesh;
 }
 function poster(parent,x,z,w,h,theme,front){const cv=document.createElement('canvas');cv.width=256;cv.height=384;const cx=cv.getContext('2d');const colors={fashion:['#b7a791','#3a292a'],sports:['#bbc0a3','#244d43'],pharmacy:['#d2ddc8','#2a7266'],electronics:['#183339','#b8cbca'],cafe:['#322a25','#bca57a'],food:['#a96943','#e4d2a5']},[bg,ink]=colors[theme]||colors.fashion;cx.fillStyle=bg;cx.fillRect(0,0,256,384);cx.fillStyle=ink;cx.textAlign='center';cx.font='bold 25px sans-serif';cx.fillText({fashion:'AFTER HOURS',sports:'GO FURTHER',pharmacy:'BE WELL',electronics:'VOLT',cafe:'NIGHT OWL',food:'GOOD FOOD'}[theme],128,55);cx.beginPath();cx.ellipse(128,188,theme==='pharmacy'?54:69,theme==='sports'?29:78,-.25,0,Math.PI*2);cx.fill();if(theme==='pharmacy'){cx.fillStyle=bg;cx.fillRect(116,147,24,82);cx.fillRect(87,176,82,24);}cx.fillStyle=ink;cx.font='12px sans-serif';cx.fillText('MERIDIAN GALLERIA',128,337);const fallback=new T.CanvasTexture(cv);fallback.colorSpace=T.SRGBColorSpace;const map=mallRetailTexture(T,theme)||fallback;const mesh=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshStandardMaterial({map,roughness:.8,side:T.DoubleSide}));mesh.position.set(x,34,z);if(!front)mesh.rotation.x=-Math.PI/2;mesh.name='shop campaign / '+theme;parent.add(mesh);return mesh;}
 function sign(text,x,y,z,w,h,color='#e1d9bb'){const mesh=label(text,x,y,z,w,h,color);mesh.name=text;group.add(mesh);return mesh;}
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
   const front=o.south?o.y:o.y+o.h-4;
   const identities={pharmacy:['MERIDIAN +','P H A R M A C Y','#9bc6a5'],fashion:['LAST SEASON','C O L L E C T I O N   0 9','#d1b7a3'],electronics:['VOLT','S O U N D   ·   V I S I O N','#9cc3cc'],cafe:['NIGHT OWL','C O F F E E   &   C O M P A N Y','#d3b483'],sports:['STRIDE','R U N N I N G   ·   O U T D O O R','#c7ceab'],food:['THE TABLE','M E R I D I A N   F O O D   H A L L','#d3ad8a']},identity=identities[o.id];
   clad(box(prop,x,63,front,o.w,18,10,'#2b3e37'),'metal');box(prop,x,73,front,o.w+2,2,12,'#a79879');box(prop,x,53.5,front,o.w,1.5,12,'#b29d74');retailPanel(prop,...identity.slice(0,2),x,63,front+10,o.w-16,15,identity[2]);
   box(prop,x,.8,front,100,1,12,'#716b57').castShadow=false;
   for(const px of [o.x+5,o.x+o.w-5]){clad(box(prop,px,29,front,10,57,11,'#486357'),'tile');box(prop,px,3,front,12,6,13,'#b3ac94');box(prop,px,56,front,12,3,13,'#b3ac94');}
   for(const px of [o.x+59,o.x+o.w-59]){box(prop,px,27,front,1.4,52,3,'#a89d7d');box(prop,px,2,front,1.4,3,4,'#e0ce9f');}
   // Display-window plinths and shop-specific advertising stay in side bays.
   for(const side of [-1,1]){const px=x+side*(o.w/2-34);clad(box(prop,px,4,front+(o.south?17:-17),39,8,28,'#433c30'),'wood');poster(prop,px,front+(o.south?9.2:5.2),30,38,o.id,true);}
   if(!clean)for(const side of [-1,1])for(let k=0;k<7;k++)box(prop,x+side*(o.w/2-34),51-k*1.5,front,46,1,1.5,'#555e56');
   const shopLight=new T.PointLight(o.id==='electronics'?'#9ac7c8':o.id==='pharmacy'?'#b7d0bd':'#e4bd86',clean?2600:3400,170,2);shopLight.position.set(x,47,front+(o.south?25:-25));prop.add(shopLight);shopLight.userData.impactReactive=true;shopLight.userData.restIntensity=shopLight.intensity;
   for(let k=0;k<4;k++)box(prop,o.x+24+k*58,71,front+(o.south?20:-20),22,1,26,'#777c70');
   // Rear-wall presentation: timber battens, illuminated posters and shelf coves.
   for(const px of [o.x+12,o.x+o.w-12])poster(prop,px,o.south?o.y+o.h-11:o.y+11,18,42,o.id,true);
   for(let k=0;k<12;k++)clad(box(prop,o.x+14+k*18,30,o.south?o.y+o.h-9:o.y+9,2,54,1,'#665646'),'wood');
   // Distinct retail storytelling inside playable footprints, no invisible frontage.
   if(o.id==='fashion'||o.id==='sports')for(let i=0;i<3;i++){
    const px=o.x+95+i*42,pz=o.south?o.y+95:o.y+43;
    cylinder(prop,px,22,pz,2,38,'#a5a58d');box(prop,px,43,pz,27,3,4,'#b2ad99');
    for(let j=0;j<3;j++){const shirt=box(prop,px-8+j*8,32,pz,7,18,6,['#6c7e72','#9b7a69','#aa9c7a'][j]);shirt.rotation.z=(j-1)*.08;}
   }
   if(o.id==='fashion'||o.id==='sports')for(const side of [-1,1]){const px=x+side*(o.w/2-35),pz=front+(o.south?18:-18);const body=new T.Mesh(new T.SphereGeometry(1,12,10),material('#b9b4a3'));body.scale.set(5,10,3.5);body.position.set(px,23,pz);prop.add(body);cylinder(prop,px,10,pz,1.3,20,'#8a8d7b');const head=new T.Mesh(new T.SphereGeometry(4,10,8),material('#c2bba7'));head.scale.y=1.3;head.position.set(px,37,pz);prop.add(head);for(const dx of [-3,3]){const leg=cylinder(prop,px+dx,11,pz,1.8,16,'#999d8a');leg.rotation.z=dx*.025;}body.material=material(o.id==='sports'?'#526e64':'#9c7465');}
   if(o.id==='cafe'||o.id==='food'){
    clad(box(prop,o.x+o.w-27,24,z,25,48,42,'#4b5952'),'wood');box(prop,o.x+o.w-27,49,z,23,3,40,'#b5ae95');
    const machine=box(prop,o.x+o.w-27,57,z-7,18,14,17,'#4e5a54');machine.material=surface('metal');for(const dx of [-5,5]){cylinder(prop,o.x+o.w-27+dx,52,z+3,2,3,'#d3c7ab');box(prop,o.x+o.w-27+dx,55,z+3,1,4,1,'#252f2b');}for(let i=0;i<3;i++)cylinder(prop,o.x+o.w-27,53,z+9+i*5,2,5,'#c8c3ad');

    sign(clean?(o.id==='cafe'?'FRESH COFFEE':'OPEN / FOOD COURT'):(o.id==='cafe'?'LAST COFFEE 02:17':'NO SERVICE'),x,39,o.south?o.y+o.h-12:o.y+12,110,14,'#bdac84');
   }
   glow(prop,x,58,o.south?o.y+o.h-18:o.y+18,90,2,3,o.id==='electronics'?'#7faca4':'#c0b48e');
   if(o.id==='pharmacy'){sign(clean?'HEALTH / EVERY DAY':'QUARANTINE / DO NOT ENTER',x,42,o.y+15,185,13,'#c6a06f');
    for(let i=0;i<(clean?0:5);i++){const stain=new T.Mesh(new T.CircleGeometry(6+i%3,9),material('#344b31'));stain.rotation.x=-Math.PI/2;stain.scale.x=1.8;stain.position.set(o.x+120+i*14,1,o.y+75+i*10);prop.add(stain);}}
   if(o.id==='electronics')sign(clean?'VOLT / CONNECT YOUR WORLD':'SIGNAL LOST',x,43,o.y+17,140,17,'#91aaa1');
  }else if(o.kind==='glass'){
   const pane=box(prop,x,27,z,o.w,54,o.h,'#729b99');pane.material=glassMat;pane.castShadow=false;box(prop,x,55,z,o.w+3,2,o.h+2,'#b0ab95');
   if(!clean){const vertices=[];for(let i=0;i<9;i++){const ax=o.x+o.w*(.2+i*.06),ay=15+(i*7)%28;vertices.push(ax,ay,z+o.h/2+.15,ax+Math.sin(i*2)*5,ay+5,z+o.h/2+.15);}const cracks=new T.LineSegments(new T.BufferGeometry().setAttribute('position',new T.Float32BufferAttribute(vertices,3)),new T.LineBasicMaterial({color:'#d0dbcf',transparent:true,opacity:.28}));prop.add(cracks);}
  }else if(o.kind==='shelf'){
   clad(box(prop,x,25,z,o.w,50,o.h,'#504b3f'),'wood');
   for(let k=0;k<3;k++){box(prop,x,8+k*15,z,o.w,2,o.h+3,'#a69b7c');for(let j=0;j<12;j++){
    const px=o.x+8+j*(o.w-16)/12;box(prop,px,14+k*15,z,7,9,10,o.theme==='pharmacy'?['#c4c2a1','#839b78','#b9a687'][j%3]:o.theme==='electronics'?'#425e60':['#94836b','#a5a18b','#746b57'][j%3]);}}
  }else if(o.kind==='stall'){
   box(prop,x,17,z,o.w,34,o.h,'#76694e');for(const sx of [o.x+4,o.x+o.w-4])box(prop,sx,45,z,3,55,3,'#848d7a');
   const awning=box(prop,x,64,z,o.w+4,2,o.h+4,'#7f8063');awning.rotation.z=.06;for(let i=0;i<7;i++){const stripe=box(prop,o.x+3+i*(o.w-2)/7,65+(i-3)*.3,z,(o.w-2)/7-1,.4,o.h+4,i%2?'#586559':'#9d977b');stripe.rotation.z=.06;}retailPanel(prop,o.id==='abandoned-cart'?'BOTANICA':'SUNDAY MARKET','M E R I D I A N',x,58,o.y+o.h/2+3,o.w-3,10,'#d2c49d');
   for(let i=0;i<5;i++)box(prop,o.x+8+i*(o.w-12)/5,36,z,7,5,10,'#a59a76');
  }else if(o.kind==='sofa'){
   box(prop,x,12,z,o.w,23,o.h,'#685e4c');box(prop,x,13,o.y+4,o.w,26,8,'#7a6d56');for(const sx of [o.x+5,o.x+o.w-5])box(prop,sx,17,z,10,25,o.h,'#6b604c');
   // Overturned seat cushions and exposed frame remain inside the solid footprint.
   for(let i=0;i<3;i++){const cushion=box(prop,o.x+19+i*27,26,z,24,7,23,'#8c7b60');cushion.rotation.z=(i-1)*.2;}
  }else if(o.kind==='table'){
   box(prop,x,23,z,o.w,4,o.h,'#a4916b');for(const sx of [o.x+4,o.x+o.w-4])box(prop,sx,11,z,4,22,4,'#555f53');
  }else if(o.kind==='car'){
   const car=new T.Group();prop.add(car);car.name=o.id+' / exact footprint';
   box(car,x,17,z,o.w-4,24,o.h-10,o.color);box(car,x-3,34,z,82,28,o.h-13,o.color);
   const wind=box(car,x+28,40,z,4,19,o.h-18,'#385459');wind.rotation.z=-.35;
   box(car,x-34,40,z,4,19,o.h-18,'#385459');box(car,x,49,z,53,3,o.h-17,o.color);
   for(const dx of [-51,51])for(const dz of [-o.h/2+6,o.h/2-6]){const wheel=cylinder(car,x+dx,11,z+dz,12,9,'#172123');wheel.rotation.x=Math.PI/2;}
   for(const dz of [-20,20]){box(car,o.x+o.w-3,20,z+dz,3,7,13,'#cabf96');box(car,o.x+3,20,z+dz,3,6,12,'#925f4c');}
  }else if(o.kind==='planter'){
   const pot=new T.Mesh(new T.CylinderGeometry(Math.min(o.w,o.h)*.45,Math.min(o.w,o.h)*.39,29,24),surface('stone'));pot.position.set(x,14.5,z);pot.castShadow=true;prop.add(pot);cylinder(prop,x,30,z,Math.min(o.w,o.h)*.4,2,'#262e23');
   const leafMat=material(clean?'#42634d':'#4f5943');for(let k=0;k<16;k++){const a=k*2.4,leaf=new T.Mesh(new T.SphereGeometry(1,8,6),leafMat);leaf.scale.set(3.5,20+k%4*2,1.2);leaf.position.set(x+Math.cos(a)*12,43+k%3*4,z+Math.sin(a)*12);leaf.rotation.set(Math.sin(a)*.7,a,Math.cos(a)*.7);prop.add(leaf);}
  }else if(o.kind==='bench'){
   box(prop,x,14,z,o.w,6,o.h,'#a18e6a');box(prop,x,26,o.y+3,o.w,22,6,'#8c795b');for(const sx of [o.x+12,o.x+o.w-12])box(prop,sx,6,z,7,12,o.h-4,'#4c5b55');
   for(let k=0;k<5;k++)box(prop,x,17.3,o.y+6+k*4,o.w-4,.5,1,'#615641');
  }else if(o.kind==='kiosk'){
   clad(box(prop,x,15,z,o.w,30,o.h,'#596f69'),'wood');box(prop,x,31,z,o.w+1,3,o.h+1,'#aaa48f');
   for(const sx of [o.x+7,o.x+o.w-7]){cylinder(prop,sx,43,z,2,26,'#8b9a89');box(prop,sx,55,z,7,2,o.h-8,'#c3b492');}
   const display=box(prop,x,42,z,o.w-28,19,o.h-14,'#577b80');display.material=glassMat;
   for(let k=0;k<7;k++){const device=box(prop,o.x+18+k*16,34,o.y+20,9,1.5,15,'#202b2a');device.rotation.y=(k%3-1)*.12;box(prop,o.x+18+k*16,35,o.y+20,7,.2,11,k%2?'#53696c':'#9d9a7e');}
   retailPanel(prop,'FIX / LAB','P H O N E S   ·   R E P A I R S',x,54,o.y+o.h/2+1,o.w-8,13,'#b6c5b1');
   for(let k=0;k<9;k++)box(prop,o.x+6+k*(o.w-12)/8,15,o.y+o.h+.1,1,26,1,'#6c6650');
  }else if(o.kind==='rack'){
   box(prop,x,25,z,o.w,50,o.h,'#6b5d47');for(let k=0;k<4;k++){box(prop,x+o.w/2+.5,14+k*10,z,1,2,o.h-8,'#b4a583');for(let j=0;j<3;j++)box(prop,x+o.w/2+1,20+k*10,o.y+18+j*29,2,3,19,'#293b39');}
  }else if(o.kind==='counter'||o.kind==='desk'){
   clad(box(prop,x,17,z,o.w,34,o.h,'#79684e'),'wood');box(prop,x,35,z,o.w,3,o.h,'#b6a684');for(let i=0;i<3;i++){box(prop,o.x+5+i*(o.w-8)/3,19,o.y+o.h+.1,1,24,.5,'#403d31');box(prop,o.x+9+i*(o.w-8)/3,25,o.y+o.h+.5,7,1,1,'#9c9d82');}const till=box(prop,x,42,z,13,11,3,'#243e3c');till.rotation.x=-.18;glow(prop,x,43,z+1.8,9,6,.3,'#7c9b8a');box(prop,x,36,z+4,20,2,13,'#4e5e52');
  }else if(o.kind==='vent'||o.kind==='roofaccess'){
   box(prop,x,24,z,o.w,48,o.h,'#5a6b65');for(let k=0;k<8;k++)box(prop,o.x+8+k*(o.w-16)/8,49,z,4,2,o.h-8,'#263d3d');
   if(o.kind==='roofaccess')sign('ROOF ACCESS',x,65,o.y+o.h,130,16);
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
  if(portal.kind==='service'){door=box(group,1159,27,portal.y,3,54,54,'#354b47');box(group,1158,57,portal.y,7,5,62,'#788476');sign('STAFF ONLY',1151,66,portal.y,72,12,'#b5c0a7');}
  const lamp=glow(group,x,10,z,portal.kind==='cars'?9:5,2,3,'#374c40');lamp.material=lamp.material.clone();group.userData.mallEntrances.push({id:portal.id,lamp,door});
 }}
 function elevator(x,z,incoming,width=140){box(group,x+42,.4,z,84,1,width,'#7c8474');for(const dz of [-width/2,width/2])box(group,x,30,z+dz,9,60,9,'#b0b3a0');box(group,x,63,z,12,8,width+15,'#73857a');const panels=[];for(const side of [-1,1]){const door=box(group,x,30,z+side*width*.25,5,60,width/2,'#9aab9e');panels.push({mesh:door,side});for(let k=0;k<4;k++)box(door,0,0,(k-1.5)*.15,1,1,.01,'#687e73');}group.userData.liftDoors??=[];group.userData.liftDoors.push({panels,z,width,incoming});sign(incoming?'ARRIVAL':'LIFT ↑',x,82,z,85,16,'#cddac3');}
 elevator(180,380,true);if(level!==4)elevator(level===1?1056:1070,level===1?620:380,false,level===1?78:140);
 if(level===1){sign('KESSLER ARMS',1035,63,510,175,18,'#c7b286');sign('SERVICE LIFT ↑',1090,64,688,110,14,'#bdcbb5');}
 if(level>0&&level<4){
  for(const x of [70,345,620,900]){const light=new T.PointLight('#e7d5b3',m.memoryRuins?650:1800,260,2);light.position.set(x,86,360);group.add(light);}
  // A rear mezzanine edge gives the concourse a shopping-centre elevation.
  // It is entirely above the existing north boundary, clear of the playable lane.
  clad(box(group,600,83,27,1158,12,14,'#776f5c'),'stone');box(group,600,91,27,1160,2,14,'#aa9875');
  for(let x=40;x<1170;x+=28){cylinder(group,x,102,27,1,22,'#839284');}box(group,600,114,27,1160,2,3,'#9f9b80');
  retailPanel(group,'MERIDIAN','G A L L E R I A   ·   E S T .   1 9 8 7',600,71,36,170,26,'#d2b880');
  // Ceiling light strips sit above closed shop footprints, never across sight lines.
  for(const x of [200,480,760])for(const z of [244,560])glow(group,x,68,z,95,2,3,'#d9d0b4');
 }
 if(level===4){const heli=new T.Group();group.add(heli);box(heli,0,40,0,130,48,55,'#33453d');box(heli,55,44,0,40,30,50,'#637d7a');box(heli,-110,47,0,120,15,15,'#3d4d43');box(heli,-165,65,0,12,50,8,'#526553');for(const z of [-36,36])box(heli,0,3,z,150,5,5,'#7c8276');const rotor=new T.Group();heli.add(rotor);rotor.position.y=82;box(rotor,0,0,0,290,3,9,'#566057');box(rotor,0,0,0,9,3,290,'#566057');group.userData.helicopter={heli,rotor};}
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
export function animateMallLife(group,g){
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
