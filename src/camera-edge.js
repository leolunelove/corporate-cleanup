// Extra screen-edge look is independent of the player's changing screen position.
export function edgeLook(cursor,bounds={left:0,right:1200,top:0,bottom:760},ads=false){
 const halfX=Math.max(1,(bounds.right-bounds.left)/2),halfY=Math.max(1,(bounds.bottom-bounds.top)/2),x=(cursor.x-(bounds.left+bounds.right)/2)/halfX,y=(cursor.y-(bounds.top+bounds.bottom)/2)/halfY;
 if(!Number.isFinite(x)||!Number.isFinite(y))return{x:0,y:0,intensity:0};
 const extent=Math.max(Math.abs(x),Math.abs(y)),t=Math.max(0,Math.min(1,(extent-.82)/.18)),intensity=t*t*(3-2*t),length=Math.hypot(x,y)||1,amount=(ads?25:20)*intensity;
 if(!intensity)return{x:0,y:0,intensity:0};
 return{x:x/length*amount,y:y/length*amount,intensity};
}
