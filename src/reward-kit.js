import{equipItem,selectCarry,itemPower}from'./progression.js?v=85967efe5e53';
// Only the explicitly earned first-clear kit is eligible; no rewards are created here.
export function starterRewardKit(profile,ids){const earned=new Set(ids);return ['dualPistols','shotgun','armor'].map((slot,index)=>{const item=profile.items.filter(i=>earned.has(i.id)&&i.slot===slot).sort((a,b)=>itemPower(b)-itemPower(a))[0];return item?{id:item.id,slot,carryIndex:index<2?index:null}:null;}).filter(Boolean);}
export function rewardKitReady(profile,kit){return kit.length>0&&kit.every(i=>profile.equipped[i.slot]===i.id&&(i.carryIndex===null||profile.carried[i.carryIndex]===i.slot));}
export function equipStarterRewards(profile,ids){const kit=starterRewardKit(profile,ids);for(const entry of kit){equipItem(profile,entry.id);if(entry.carryIndex!==null)selectCarry(profile,entry.carryIndex,entry.slot);profile.items.find(i=>i.id===entry.id).isNew=false;}return kit;}

// Upgrade only worn families from this run; keep the player's chosen weapons.
export function rewardUpgrades(profile,ids){const earned=new Set(ids),slots=[...profile.carried,'armor'];return slots.map(slot=>{const current=profile.items.find(i=>i.id===profile.equipped[slot]);return profile.items.filter(i=>earned.has(i.id)&&i.slot===slot&&(!current||itemPower(i)>itemPower(current)+.001)).sort((a,b)=>itemPower(b)-itemPower(a))[0];}).filter(Boolean);}
export function equipRewardUpgrades(profile,ids){const items=rewardUpgrades(profile,ids);for(const item of items){equipItem(profile,item.id);item.isNew=false;}return items;}
