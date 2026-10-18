import{enemyAssets}from'./enemy-asset.js';
import{createSoldierSkin,updateSoldierSkin}from'./soldier-rig.js?v=4e15272c47c3';
// Each actor owns its palette; baked geometry and paint are shared across the cast.
export function createEnemySkin(actor,type){
 if(!enemyAssets[type])type='walker';
 actor.enemySkins??=new Map();
 if(actor.enemySkin){const old=actor.enemySkin;old.mesh.visible=false;old.kit.forEach(m=>m.visible=false);old.bones[0].visible=false;}
 let skin=actor.enemySkins.get(type);
 if(!skin){skin=createSoldierSkin(actor,enemyAssets[type]);skin.mesh.name='Infected '+type+' / welded weighted body';skin.mesh.userData.creepy=true;skin.kit.forEach(m=>m.userData.creepy=true);actor.enemySkins.set(type,skin);}
 actor.enemySkin=actor.soldierSkin=skin;skin.mesh.visible=true;skin.kit.forEach(m=>m.visible=true);skin.bones[0].visible=true;
 actor.skinMaterials.clear();actor.skinMaterials.set(skin.mesh,skin.mesh.material);
 return skin;
}
export function updateEnemySkin(actor,e){
 const skin=actor.enemySkin;if(!skin)return;
 skin.mesh.visible=true;skin.mesh.material.color.set(e.dummy?'#708179':'#ffffff');skin.kit.forEach(m=>m.visible=!e.dummy);
 for(const group of actor.details.values())group.visible=false;
 // Jaw retains the existing spit/roar attack controls and smooth body IK.
 updateSoldierSkin(actor);
}
