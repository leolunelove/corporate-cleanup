// Small rigid bodies use planar circle contacts plus vertical gravity and floor bounce.
// They absorb bullets but never become navigation blockers: an exit cannot be buried.
export function createMallProps(floor){
 const bodies=[],add=(id,kind,x,y,w,d,h,color,mass=1)=>bodies.push({id,kind,x,y,z:h/2,w,d,h,color,mass,r:Math.min(w,d)*.45,hp:kind==='bottle'?9:kind==='screen'?18:35,vx:0,vy:0,vz:0,angle:0,spin:0,tilt:0,awake:false});
 if(floor>0&&floor<4){
 for(const [i,x]of [90,365,640].entries())for(const south of [false,true]){
 const y=south?620:158,tag=i+'-'+south;
 add('chair-'+tag,'chair',x+172,y,16,18,26,'#6c7466',2);
 add('crate-'+tag,'crate',x+92,y-25,22,21,20,i===0?'#b6b396':'#7c6d54',3);
 for(let k=0;k<3;k++)add('bottle-'+tag+k,'bottle',x+32+k*16,y+10,6,6,13,i===0?'#8eaa83':'#b09868',.35);
 add('screen-'+tag,'screen',x+122,y+14,22,8,27,'#536e70',1.5);
 }
 for(const [i,x,y]of [[0,290,515],[1,565,280],[2,840,545],[3,675,280]]){add('luggage-'+i,'case',x,y,24,16,15,'#796951',2);add('can-'+i,'bottle',x+24,y,8,8,12,'#b29b72',.4);}
 }else for(let i=0;i<6;i++)add('parking-can-'+i,'crate',floor===0?280+i*120:330+i*90, floor===0?260:650,15,15,20,'#7c8370',2);
 return bodies;
}
function fragment(g,x,y,b,color,count=5){const speed=Math.hypot(b.vx,b.vy)||1,ux=b.vx/speed,uy=b.vy/speed;
 for(let i=0;i<count;i++){const a=i*2.399+g.propSerial++,r=2+i%3;g.mallProps.push({id:'debris-'+g.propSerial,kind:'debris',x:x+Math.cos(a)*7,y:y+Math.sin(a)*7,z:22,w:r*2,d:r*2,h:2,color,mass:.15,r,hp:0,vx:ux*65+Math.cos(a)*80,vy:uy*65+Math.sin(a)*80,vz:50+i*12,angle:a,spin:Math.sin(a)*8,tilt:0,awake:true,age:0});}
 // Keep debris bounded while retaining every intact authored object.
 let excess=g.mallProps.filter(p=>p.kind==='debris').length-100;
 g.mallProps=g.mallProps.filter(p=>p.kind!=='debris'||excess--<=0);
}
export function hitMallFixture(g,b,o){if(!g.mission.mall||!o)return;
 const material=o.material||'metal';
 if(o.kind==='glass'){g.fixtureHealth??={};g.fixtureHealth[o.id]=(g.fixtureHealth[o.id]??o.hp)- (b.weapon==='shotgun'?24:weaponsDamage(b.weapon));if(g.fixtureHealth[o.id]<=0){g.cover=g.cover.filter(p=>p.id!==o.id);g.brokenProps.push(o.id);g.navigation?.clear();fragment(g,b.x,b.y,b,'#8caeab',8);g.events.push('glass_break');}}
 else if(['wood','fabric'].includes(material)){const n=Math.hypot(b.vx,b.vy)||1;fragment(g,b.x-b.vx/n*12,b.y-b.vy/n*12,b,material==='wood'?'#aa9270':'#6c7665',3);}
}
function weaponsDamage(id){return id==='marksman'?45:id==='smg'?12:24;}
export function hitMallProp(g,b){if(!g.mission.mall)return false;const p=g.mallProps?.find(p=>p.kind!=='debris'&&!p.broken&&Math.hypot(p.x-b.x,p.y-b.y)<p.r+3);if(!p)return false;
 const n=Math.hypot(b.vx,b.vy)||1,force=(b.weapon==='shotgun'?190:b.weapon==='marksman'?145:95)/Math.sqrt(p.mass);
 p.vx+=b.vx/n*force;p.vy+=b.vy/n*force;p.vz+=35/Math.sqrt(p.mass);p.spin+=((b.x-p.x)*b.vy-(b.y-p.y)*b.vx)/n/p.mass*.12;p.awake=true;p.hp-=weaponsDamage(b.weapon);
 if(p.hp<=0&&(p.kind==='bottle'||p.kind==='screen'||p.kind==='crate')){p.broken=true;fragment(g,p.x,p.y,b,p.color,p.kind==='bottle'?5:7);g.events.push(p.kind==='bottle'?'glass_break':'ricochet');}else g.events.push('ricochet');return true;
}
export function stepMallProps(g,dt){if(!g.mission.mall||!g.mallProps)return;const steps=Math.max(1,Math.ceil(dt/(1/120))),h=dt/steps;
 for(let k=0;k<steps;k++){
 for(const p of g.mallProps){if(!p.awake||p.broken)continue;p.age=(p.age||0)+h;
 for(const axis of ['x','y']){const v=axis==='x'?'vx':'vy',before=p[axis];p[axis]+=p[v]*h;
 if(p.x-p.r<34||p.x+p.r>1166||p.y-p.r<34||p.y+p.r>726||g.cover.some(o=>p.x+p.r>o.x&&p.x-p.r<o.x+o.w&&p.y+p.r>o.y&&p.y-p.r<o.y+o.h)){p[axis]=before;p[v]*=-.35;}}
 p.vz-=260*h;p.z+=p.vz*h;const ground=p.h/2;if(p.z<ground){p.z=ground;p.vz=Math.abs(p.vz)>12?-p.vz*.25:0;}
 const drag=Math.exp(-(p.z<=ground+.1?4.5:.5)*h);p.vx*=drag;p.vy*=drag;p.spin*=Math.exp(-3*h);p.angle+=p.spin*h;
 if(p.kind==='chair')p.tilt=Math.min(1.2,p.tilt+Math.hypot(p.vx,p.vy)*h*.018);
 if(Math.hypot(p.vx,p.vy)<.6&&Math.abs(p.vz)<.6&&Math.abs(p.spin)<.05&&p.z<=ground+.1){p.vx=p.vy=p.vz=p.spin=0;p.awake=false;}
 }
 // Mass-weighted elastic contacts, no energy creation on separating pairs.
 const bodies=g.mallProps.filter(p=>!p.broken&&p.kind!=='debris');
 for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){const a=bodies[i],b=bodies[j],dx=b.x-a.x,dy=b.y-a.y,n=Math.hypot(dx,dy);if(!n||n>=a.r+b.r||(!a.awake&&!b.awake))continue;const nx=dx/n,ny=dy/n,rel=(b.vx-a.vx)*nx+(b.vy-a.vy)*ny;if(rel>=0)continue;const impulse=-1.25*rel/(1/a.mass+1/b.mass);a.vx-=impulse*nx/a.mass;a.vy-=impulse*ny/a.mass;b.vx+=impulse*nx/b.mass;b.vy+=impulse*ny/b.mass;a.awake=b.awake=true;}
 }
}
