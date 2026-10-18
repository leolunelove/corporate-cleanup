// Original cutaway neighbourhood: all solid scenery shares simulation footprints.
export function buildDistrictEnvironment(T,g,{box,cylinder,label,glow}){
 const root=new T.Group();root.userData.animations=[];root.userData.effectMeshes=[];
 const texture=document.createElement('canvas');texture.width=256;texture.height=256;const c=texture.getContext('2d');c.fillStyle='#302c29';c.fillRect(0,0,256,256);for(let row=0;row<16;row++)for(let col=-1;col<5;col++){const value=52+(row*13+col*17+80)%23;c.fillStyle=`rgb(${value+16},${value+2},${value-6})`;c.fillRect(col*64+(row%2)*32+1,row*16+1,61,13);c.fillStyle='#786b59';c.fillRect(col*64+(row%2)*32+4,row*16+2,45,1);}const bricks=new T.CanvasTexture(texture);bricks.wrapS=bricks.wrapT=T.RepeatWrapping;bricks.repeat.set(2,1);
 const sign=(text,x,h,z,w=110,color='#d7c3a0')=>{const s=label(text,x,h,z,w,15,color);root.add(s);return s;};
 const lamp=(x,h,z,color='#e7bd81',power=4200,range=190)=>{const l=new T.PointLight(color,power,range,2);l.position.set(x,h,z);root.add(l);glow(root,x,h,z,8,3,6,color);};
 const pavement=box(root,600,-3,380,1170,5,710,'#272e32');pavement.receiveShadow=true;
 for(const [x,z,w,d]of [[210,290,365,32],[950,339,450,30],[655,92,85,130],[575,454,1120,25]])box(root,x,.6,z,w,2,d,'#60615b');
 for(let x=50;x<1150;x+=40){box(root,x,1.7,290,.7,.2,30,'#353a39');box(root,x,1.7,454,.7,.2,25,'#343a39');}
 for(let x=60;x<1170;x+=90)box(root,x,.1,410,38,.3,3,'#ada38b');
 for(const x of [710,731,752,773,794,815])box(root,x,.2,385,11,.4,60,'#b7b5a1');
 for(const o of g.cover){if(o.kind==='entryGate')continue;const kind=o.kind,x=o.x+o.w/2,z=o.y+o.h/2;let h=kind==='brick'?(o.h<=12&&o.y>200?18:42):kind==='deli'?148:kind==='wall'?35:kind==='bed'?12:kind==='partition'?18:kind==='car'?25:kind==='kitchen'?31:kind==='bin'?29:24;
  const m=box(root,x,h/2,z,o.w,h,o.h,kind==='brick'||kind==='deli'?'#a89b8a':kind==='bed'?'#665f50':kind==='car'?'#3c5156':'#494c45');if(kind==='brick'||kind==='deli'){m.material=new T.MeshStandardMaterial({map:bricks,color:'#a99b8d',roughness:1});box(root,x,h+1,z,o.w+1,2,o.h+1,'#77776a');}
  if(kind==='car'){box(root,x,30,z,o.w*.48,14,o.h*.75,'#2c383e');glow(root,x+o.w/2+.4,17,z-8,1,5,7,'#c5b887');for(const dx of [-o.w*.3,o.w*.3])for(const dz of [-o.h*.5,o.h*.5]){const tire=cylinder(root,x+dx,9,z+dz,9,5,'#161e23');tire.rotation.x=Math.PI/2;}}
  if(kind==='bed'){box(root,x,16,z,o.w-6,6,o.h-4,'#7c7d6a');box(root,x-30,20,z,24,4,o.h-10,'#b0aa91');}
  if(kind==='kitchen'){for(let k=0;k<3;k++)box(root,x,33,z-22+k*23,o.w-4,3,20,'#9a9886');}
  if(kind==='counter'){sign('CHECK IN / LOCAL JOBS',x,46,z,100);box(root,x+10,34,z,18,14,9,'#202d30');glow(root,x+10,35,z+5,13,8,1,'#9bb9a7');}
  if(kind==='bench'){for(let k=0;k<4;k++)box(root,x-25+k*15,28,z,8,5,10,'#7e7863');}
 }
 // Warm apartment, steel-backed shooting lanes and oil-stained workshop floors.
 for(const [x,z,w,d,col]of [[200,158,275,195,'#665a48'],[945,185,380,235,'#454f4f'],[980,590,310,190,'#3d4545']])box(root,x,.2,z,w,.6,d,col);
 for(let x=70;x<330;x+=18)box(root,x,.6,158,.5,.1,190,'#3c3c32');
 for(const y of [125,200,275]){box(root,1030,.8,y,185,.5,3,'#a18d61');box(root,1127,30,y,6,60,45,'#283337');box(root,955,18,y,6,36,37,'#55625c');}
 // Purpose-built paper silhouettes, rather than creatures standing on the range.
 const targets=[];for(const e of g.enemies.filter(e=>e.dummy)){const target=new T.Group();target.position.set(e.x,0,e.y);cylinder(target,0,18,0,2,35,'#716954');box(target,0,38,0,5,28,19,'#baad8b');const head=cylinder(target,0,57,0,6,5,'#baad8b');head.rotation.z=Math.PI/2;box(target,-3,40,0,.8,14,10,'#443d31');root.add(target);targets.push(target);}root.userData.districtTargets=targets;
 // Taller rear facades establish a dense city without roofs hiding the player.
 for(const [x,w,tone]of [[200,300,'#6f675b'],[545,280,'#655e53'],[945,410,'#777264']]){
  const back=box(root,x,135,41,w,270,14,tone);back.material=new T.MeshStandardMaterial({map:bricks,color:tone,roughness:.95});
  for(let level=0;level<3;level++)for(let wx=x-w/2+34;wx<x+w/2-15;wx+=58){box(root,wx,95+level*62,50,29,38,3,'#1d2c31');box(root,wx,96+level*62,52,22,30,1,(Math.floor(wx)+level)%3?'#5b625b':'#c6aa75');box(root,wx,95+level*62,54,2,34,1,'#383f3c');box(root,wx,76+level*62,55,35,3,6,'#77776a');}
  for(const h of [72,134,196]){box(root,x, h,69,90,3,32,'#303e40');for(let dx=-40;dx<=40;dx+=16)box(root,x+dx,h+12,84,1,23,1,'#405052');box(root,x,h+24,84,90,1,1,'#405052');box(root,x+39,h-24,72,3,46,12,'#384648');}
 }
 // Deli awning, shutters, signs and storefront details.
 box(root,547,68,280,270,7,26,'#324e47');for(let x=421;x<681;x+=22)box(root,x,69,289,8,8,10,'#a99b7b');sign('MERCER / DELI & GROCERY',548,94,282,255);for(let x=430;x<675;x+=38){box(root,x,30,273,32,49,2,'#364441');for(let h=10;h<54;h+=5)box(root,x,h,275,31,1,1,'#687367');}sign('APARTMENTS / 42',200,83,264,120);sign('MERCER GUN CLUB',1040,88,316,255,'#d9bf8d');for(const x of [850,920])box(root,x,34,314,4,68,9,'#6f7c73');glow(root,885,68,314,66,3,6,'#d3bd8c');sign('ENTRANCE',885,83,314,80);lamp(885,65,321,'#d5ba83',3700,150);sign('HOLLIS AUTO / SERVICE',981,69,486,235);sign('RANGE →',690,36,326,100);sign('NO THROUGH TRAFFIC',575,41,535,145);
 const entries=[];for(const [id,x,z,vertical]of [['street',715,245,false],['garage',950,493,false],['courtyard',735,709,false]]){box(root,x,35,z,48,70,6,'#263438');for(const dx of [-25,25])box(root,x+dx,36,z,3,72,10,'#758077');const door=box(root,x,31,z+4,43,60,3,'#50594e');for(let h=8;h<58;h+=8)box(root,x,h,z+6,42,1,1,'#768071');const light=glow(root,x,74,z,12,3,5,'#cf9d61');entries.push({id,door,light});}root.userData.districtEntries=entries;
 sign('BASEMENT / OPTIONAL CLEARANCE',735,45,670,155);sign('WEST ENTRANCE →',770,30,518,100);
 const caseMesh=box(root,1090,12,590,24,20,18,'#6e7759');glow(root,1090,23,590,17,2,9,'#b2b991');root.userData.districtCase=caseMesh;
 // Fenced street ends imply a larger quarantined city beyond this playable block.
 for(const x of [25,1174]){for(let z=325;z<=460;z+=27)box(root,x,33,z,2,66,2,'#5d6b67');for(const h of [8,34,62])box(root,x,h,392,2,2,145,'#65716b');for(let z=325;z<460;z+=9){const wire=box(root,x,32,z,.7,60,.7,'#56645f');wire.rotation.x=.25;}sign('QUARANTINE / STREET CLOSED',x,82,395,170,'#c6ab77');}
 sign('KEEP THE LIGHTS ON',120,32,474,140,'#a1a192');sign('MERCER ST / LOWER EAST',690,91,350,150,'#c6cdbb');
 // Street furniture, overhead cables, drains, scraps and wet asphalt reflections.
 for(const [x,z]of [[365,315],[706,350],[760,665]]){cylinder(root,x,54,z,2.8,108,'#374344');box(root,x+13,109,z,28,4,9,'#54605b');lamp(x+22,106,z,'#d4ba83',7200,240);}
 for(const [x,z]of [[390,300],[701,465],[1110,350]]){box(root,x,1,z,35,2,13,'#151f24');for(let i=0;i<6;i++)box(root,x-13+i*5,2.5,z,1,.3,11,'#666b60');}
 for(let i=0;i<42;i++){const x=45+(i*137)%1080,z=325+(i*47)%115;const scrap=box(root,x,1,z,3+i%5,.2,2+i%3,i%2?'#8c8a73':'#38433f');scrap.rotation.y=i*1.7;}
 for(const [x,z]of [[270,398],[650,390],[915,429],[730,570]]){const wet=new T.Mesh(new T.CircleGeometry(1,28),new T.MeshStandardMaterial({color:'#253b42',metalness:.65,roughness:.16,transparent:true,opacity:.65,depthWrite:false}));wet.rotation.x=-Math.PI/2;wet.scale.set(50,12,1);wet.position.set(x,.7,z);root.add(wet);}
 for(let x=90;x<1120;x+=15)box(root,x,235,48,13,.7,1,'#1f2d32');
 for(const [x,h,z,col]of [[195,72,155,'#e1bc80'],[800,75,200,'#b2c7c4'],[1040,80,190,'#b9cfce'],[985,85,590,'#c5b18b']])lamp(x,h,z,col,6500,250);
 const steam=[];for(let i=0;i<14;i++){const m=new T.Mesh(new T.PlaneGeometry(16,16),new T.MeshBasicMaterial({color:'#8c9d99',transparent:true,opacity:.025,depthWrite:false,side:T.DoubleSide}));m.position.set(700,12+i*3,465);m.rotation.x=-Math.PI/3;root.add(m);steam.push({mesh:m,phase:i*.8});}root.userData.districtSteam=steam;
 return root;
}
