import {heroSurfaceAssets} from './hero-surface-assets.js';
// One shared atlas set per device tier; per-material shader UVs repeat inside cells.
const heroSurfaceCache=new Map();
const heroCells={cloth:[0,.5,.5,.5],armor:[.5,.5,.5,.5],leather:[0,0,.5,.5],canvas:[.5,0,.5,.5]};
// Keep woven cloth matte while painted plates, leather and glass catch different light.
const heroResponses={cloth:{normal:.18,roughness:1,minimum:.74,metalness:0,environment:.28},canvas:{normal:.23,roughness:1,minimum:.78,metalness:0,environment:.24},armor:{normal:.38,roughness:.88,minimum:.38,metalness:.32,environment:.75},leather:{normal:.2,roughness:.96,minimum:.58,metalness:0,environment:.42}};
export function heroSurfaceTier(){return globalThis.matchMedia?.('(pointer: coarse)').matches||((globalThis.navigator?.deviceMemory||8)<=4)?'compact':'desktop';}
export function getHeroSurfaces(tier=heroSurfaceTier()){
 if(heroSurfaceCache.has(tier))return heroSurfaceCache.get(tier);
 const T=globalThis.THREE,pack={tier,ready:0,failed:0,maps:{},colorSize:tier==='desktop'?4096:1024,dataSize:tier==='desktop'?2048:512};heroSurfaceCache.set(tier,pack);
 for(const [channel,color]of [['color','#a5afa2'],['normal','#8080ff'],['orm','#ffdd11']]){const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const ctx=canvas.getContext('2d');ctx.fillStyle=color;ctx.fillRect(0,0,1,1);const texture=new T.Texture(canvas);texture.name='Vantage hero / '+tier+' / '+channel;texture.colorSpace=channel==='color'?T.SRGBColorSpace:T.NoColorSpace;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearMipmapLinearFilter;texture.generateMipmaps=true;texture.anisotropy=8;texture.needsUpdate=true;pack.maps[channel]=texture;
 if(typeof globalThis.Image==='function'){const image=new globalThis.Image();image.onload=()=>{texture.dispose();texture.image=image;texture.needsUpdate=true;pack.ready++;globalThis.dispatchEvent?.(new Event('hero-art-ready'));};image.onerror=()=>{pack.failed++;globalThis.dispatchEvent?.(new Event('hero-art-ready'));};image.src=heroSurfaceAssets[tier][channel];}}
 return pack;
}
export function upgradeHeroMaterial(material,kind='cloth',options={}){
 const T=globalThis.THREE,pack=getHeroSurfaces(),cell=heroCells[kind]||heroCells.cloth,response=heroResponses[kind]||heroResponses.cloth;
 material.map=pack.maps.color;material.normalMap=pack.maps.normal;material.bumpMap=null;material.roughnessMap=material.metalnessMap=pack.maps.orm;
 material.normalScale=new T.Vector2(response.normal,response.normal);
 material.color.set(options.color||'#acb9ab');material.vertexColors=options.vertexColors===true;material.roughness=options.roughness??response.roughness;material.metalness=options.metalness??response.metalness;material.envMapIntensity=response.environment;
 material.name='Contractor / '+kind+' / native hero atlas';material.userData.heroSurface=kind;material.userData.heroTier=pack.tier;
 material.onBeforeCompile=shader=>{material.userData.heroCompiled=true;shader.uniforms.contractorAtlasRect={value:new T.Vector4(...cell)};shader.fragmentShader=shader.fragmentShader.replace('#include <common>','#include <common>\nuniform vec4 contractorAtlasRect;\nvec2 contractorAtlasUv(vec2 uv){return contractorAtlasRect.xy+clamp(fract(uv),vec2(.001),vec2(.999))*contractorAtlasRect.zw;}');
 for(const [chunk,uv]of [['map_fragment','vMapUv'],['normal_fragment_maps','vNormalMapUv'],['roughnessmap_fragment','vRoughnessMapUv'],['metalnessmap_fragment','vMetalnessMapUv']])shader.fragmentShader=shader.fragmentShader.replace('#include <'+chunk+'>',T.ShaderChunk[chunk].split(uv).join('contractorAtlasUv( '+uv+' )')+(chunk==='roughnessmap_fragment'?'\nroughnessFactor=max(roughnessFactor, '+response.minimum.toFixed(2)+');':''));};
 material.customProgramCacheKey=()=> 'contractor-hero-atlas-v2-'+kind;material.needsUpdate=true;return material;
}
export function heroMaterial(kind='cloth',options={}){return upgradeHeroMaterial(new globalThis.THREE.MeshStandardMaterial(),kind,options);}
export function normalizeHeroColors(geometry,body=false){if(geometry.userData.heroNeutralPaint)return;geometry.userData.heroNeutralPaint=true;const c=geometry.attributes.color,p=geometry.attributes.position;if(!c)return;for(let i=0;i<c.count;i++){const y=p.getY(i),z=Math.abs(p.getZ(i));if(body&&y>49.0)continue;const base=!body?null:y>50.4?[.38,.285,.205]:y<7?[.01,.014,.012]:z>19&&y<29&&y>20?[.016,.022,.018]:[.135,.155,.115];if(base)c.setXYZ(i,Math.min(1.5,c.getX(i)/base[0]),Math.min(1.5,c.getY(i)/base[1]),Math.min(1.5,c.getZ(i)/base[2]));else c.setXYZ(i,1,1,1);}c.needsUpdate=true;}
