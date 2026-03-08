// Code Loader v2026-03-08-0001
// Interruption Framework v2026-03-01-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

const configuration = {
EVENTS: [
/* ... */
],
BLOCKS: [
/* ... */
],
OM: {
show_boot_status: true,
show_errors: true,
show_execution_info: false,
globals_to_keep: [],
},
BM: {
is_chest_mode: false,
execution_budget_per_tick: 8,
max_error_count: 32,
},
JM: {
dequeue_budget_per_tick: 8,
players_to_skip: [],
},
STYLES: [
"#FF775E", "500", "0.95rem",
"#FFC23D", "500", "0.95rem",
"#20DD69", "500", "0.95rem",
"#52B2FF", "500", "0.95rem",
],
};


{
const A=configuration,B={en:0,rcnt:0,sid:0},C={},D={isPrimaryBoot:!0,isRunning:!1,cursor:0};
let E=globalThis,$A=Object.create,$B=Object.freeze,$C=Object.seal,$D=Object.defineProperty,$E=eval,$F=Math.floor,$G=api.getBlockId,$H=api.getBlockData,$I=api.getStandardChestItems,F=$B(function(){}),G="Code Loader",H=[],I=null;
const $=(A,B)=>{let C=H[B];C[0].str=A;api.broadcastMessage(C);C[0].str=""},$J=()=>{let B=A.JM,C=A.BM,D=A.OM;N=0;$P=F;$Q=F;if($K){O=B.dequeue_budget_per_tick|0;O=(O&~(O>>31))+(-O>>31)+1;P=B.players_to_skip;Q=P instanceof Array?$A(null):null;R=0;$U=F;if(!o){S=[];U=$A(null)}V=0}X=A.BLOCKS instanceof Array?A.BLOCKS:[];Z=!!C.is_chest_mode;a=C.execution_budget_per_tick|0;a=(a&~(a>>31))+(-a>>31)+1;b=C.max_error_count|0;b=b&~(b>>31);Y.length=1;Y[0]=null;c=0;if(Z){f=!1;g=$A(null);j=1;k=0;l=0}else{d=0;e=X.length}t=!!D.show_boot_status;T=!!D.show_errors;_B=!!D.show_execution_info;u=D.globals_to_keep;v=u instanceof Array?$A(null):null;x=0;y=0;z=-1};
{
const A=B,C=A.fn=$B(()=>{}),D=A.args=A.noArgs=$B([]),F=[null,D,null,0],G=[];
let H=F,I=1,J=0,K=0,L=0;
A.tick=()=>{A.fn=C;A.args=D;if(!L){return}I=0;let M=null;while(L){H=G[J];A.args=H[1];A.rcnt=++H[2];A.sid=H[3];try{H[0](...A.args)}catch(_){M=_}G[J]=void 0;J++;L--;if(M){$("Interruption Framework ["+(H[0]?.name||"<anonymous>")+"]: "+M.name+": "+M.message,0);M=null}}J=0;K=0;G.length=0;H=F;A.en=0;A.fn=C;A.args=D;A.rcnt=0;I=1};
$D(E.InternalError.prototype,"name",{configurable:!0,get:()=>{if(I){if(A.en){A.en=0;G[K]=[A.fn,A.args,0,A.sid];K++;L++}}else{A.en=0;A.rcnt=0;H[1]=A.args;H[3]=A.sid;H=F;A.args=D;I=1}return"InternalError"}})
}
let _A,$_;
{
let $B=api.setBlock,$C=api.getStandardChestItemSlot,$D=api.setStandardChestItemSlot,A=G+" SM: ",B=_A=[],D=0,E=1,F="Bedrock",H="Boat",I={customAttributes:{_:null}},J={customAttributes:{_:[]}},K=J.customAttributes._,L=[],M,N,O,P,Q,R,S,T,U,V,W,X,Y,Z,a,b,c,d,e;
const $E=B=>{if(!B?.length||B.length<3){$(A+"Invalid registry position. Expected registryPos as [x, y, z].",1);return null}let C=$F(B[0])|0,D=$F(B[1])|0,E=$F(B[2])|0;if($G(C,D,E)===1){return!1}let F=[C,D,E],G=$C(F,0)?.attributes?.customAttributes?.region;if(!G){$(A+"No valid registry unit found at ("+C+", "+D+", "+E+").",1);return null}return[F,G]},$J=(B,C)=>{if(!B?.length||!C?.length||B.length<3||C.length<3){$(A+"Invalid region positions. Expected lowPos and highPos as [x, y, z].",1);return!0}let D=$F(B[0])|0,E=$F(B[1])|0,G=$F(B[2])|0,I=$F(C[0])|0,J=$F(C[1])|0,K=$F(C[2])|0;if(D>I||E>J||G>K){$(A+"Invalid region bounds. lowPos ["+D+", "+E+", "+G+"] must be <= highPos ["+I+", "+J+", "+K+"] on all axes.",1);return!0}if($G(D,E,G)===1){return!1}$B(D,E,G,F);$D([D,E,G],0,H,null,void 0,{customAttributes:{region:[D,E,G,I,J,K]}});$(A+"Registry unit created at ("+D+", "+E+", "+G+").",2);return!0},$K=B=>{let C=$E(B);if(C===!1){return!1}if(C===null){return!0}let D=C[1];$(A+"Storage covers region from ("+D[0]+", "+D[1]+", "+D[2]+") to ("+D[3]+", "+D[4]+", "+D[5]+").",3);return!0},$L=(B,C,D)=>{if(E===1){let G=$E(B);if(G===!1){return!1}if(G===null){return!0}let P=G[1];R=P[0];S=P[1];T=P[2];U=P[3];V=P[4];W=P[5];let c=(U-R+1)*(V-S+1)*(W-T+1)-1,d=C.length+3>>2;if(c<d){$(A+"Not enough space. Need "+d+" storage units, but region holds "+c+".",0);return!0}K.length=0;L.length=0;M=$A(null);N=G[0];X=R;Y=S;Z=T;a=0;Q=1;e=0;E=2}let G=X,P=Y,c=Z,d=D,f=C.length,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w;while(a<f){if(E===2){G++;if(G>U){G=R;c++;if(c>W){c=T;P++;if(P>V){return!0}}}t=(G>>5)+"|"+(P>>5)+"|"+(c>>5);if(!(t in M)){if($G(G,P,c)===1){return!1}M[t]=1}$B(G,P,c,F);X=G;Y=P;Z=c;O=[G,P,c];b=0;E=3}while(b<4&&a<f){if(E===3){p=C[a];if(!p?.length||p.length<3){a++;continue}q=$F(p[0])|0;r=$F(p[1])|0;s=$F(p[2])|0;t=(q>>5)+"|"+(r>>5)+"|"+(s>>5);if(!M[t]){if($G(q,r,s)===1){return!1}M[t]=1}g=$H(q,r,s)?.persisted?.shared?.text;if(g?.length>0){v=0;h=0;i=0;j=JSON.stringify(g);k=1;l=j.length-1;while(k<l){m=k+1950;if(m>l){m=l}m-=j[m-1]==="\\";while(k<m){n=j.indexOf("\\",k);if(n===-1||n>=m){o=m-k;k+=o;i+=o;break}if(n>k){o=n-k;k+=o;i+=o}k+=2;i+=1}L[v]=g.slice(h,i);v++;h=i}L.length=v;E=4}}if(E===4){u=b*9;v=0;w=L.length;while(v<w){I.customAttributes._=L[v];$D(O,u+v,H,null,void 0,I);v++}b++;E=3}a++}if(e>=243){$D(N,Q,H,null,void 0,J);K.length=0;e=0;Q++}K[e++]=G;K[e++]=P;K[e++]=c;E=2;d--;if(d<=0){return!1}}$D(N,Q,H,null,void 0,J);$(A+"Built storage at ("+N[0]+", "+N[1]+", "+N[2]+").",2);I.customAttributes._=null;K.length=0;L.length=0;M=null;N=null;O=null;E=1;return!0},$M=(B,C)=>{if(E===1){let D=$E(B);if(D===!1){return!1}if(D===null){return!0}M=$A(null);N=D[0];P=$I(N);Q=1;d=0;E=2}let D=C,F,G,H,I,J;while(F=P[Q]){if(E===2){c=F.attributes.customAttributes._;d=0;e=c.length;E=3}if(E===3){while(d<e){G=c[d];H=c[d+1];I=c[d+2];J=(G>>5)+"|"+(H>>5)+"|"+(I>>5);if(!(J in M)){if($G(G,H,I)===1){return!1}M[J]=1}$B(G,H,I,"Air");d+=3;D--;if(D<=0){return!1}}$D(N,Q,"Air");Q++;E=2}}$(A+"Disposed storage at ("+N[0]+", "+N[1]+", "+N[2]+").",2);M=null;N=null;P=null;c=null;E=1;return!0};
C.create=(A,C)=>{B[B.length]=()=>$J(A,C)};
C.check=A=>{B[B.length]=()=>$K(A)};
C.build=(A,C,D=8)=>{B[B.length]=()=>$L(A,C,D)};
C.dispose=(A,C=32)=>{B[B.length]=()=>$M(A,C)};
$_=()=>{let C=D<B.length;while(C){try{if(!B[D]()){break}}catch(_){E=1;$(A+"Task error on tick - "+_.name+": "+_.message,0)}C=++D<B.length}if(!C){B.length=0;D=0}}
}
let J=[],K=[],L=$A(null),M=$A(null),$K,$L,N;
const $M=()=>{let C=A.EVENTS,D=C.length,G=0,H;while(G<D){H=C[G];let I,N,O;if(typeof H==="string"){I=H}else{I=H[0];N=!!H[1];O=H[2]}if(I==="tick"){G++;continue}if(I!=="onPlayerJoin"){J[J.length]=I;K[K.length]=O;let P=F;L[I]=_=>{P=typeof _==="function"?_:F};M[I]=()=>P;if(N){let Q=B;E[I]=function(R,S,T,U,V,W,X,Y,Z){Q.en=1;Q.fn=P;Q.args=[R,S,T,U,V,W,X,Y,Z];Q.sid=0;try{return P(R,S,T,U,V,W,X,Y,Z)}finally{Q.en=0}}}else{E[I]=function(Q,R,S,T,U,V,W,X,Y){return P(Q,R,S,T,U,V,W,X,Y)}}}else{$K=$V;L.onPlayerJoin=_=>{$K=typeof _==="function"?_:F};M.onPlayerJoin=()=>$K;if(N){let P=B;E.onPlayerJoin=function(Q,R){P.en=1;P.fn=$K;P.args=[Q,R];P.sid=0;try{return $K(Q,R)}finally{P.en=0}}}else{E[I]=function(P,Q){return $K(P,Q)}}}G++}L.tick=_=>{$L=typeof _==="function"?_:F};M.tick=()=>$L},$N=()=>{let A=J.length;while(N<A){let B=J[N],C=K[N];if(C!==void 0){api.setCallbackValueFallback(B,C)}$D(E,B,{configurable:!0,set:L[B],get:M[B]});N++}$D(E,"tick",{configurable:!0,set:L.tick,get:M.tick});K=null},$O=()=>{let A=J.length;while(N<A){L[J[N]](F);N++}};
let $P,$Q;
const $R=()=>{B.tick();$Q(50);try{$P()}catch(_){I=[_.name,_.message];n=-2}},$S=()=>{$D(E,"tick",{configurable:!0,set:_=>{$Q=typeof _==="function"?_:F},get:()=>$Q});$P=$L;$L=$R},$T=()=>{$D(E,"tick",{configurable:!0,set:L.tick,get:M.tick});$L=$Q;$P=F};
let O,P,Q,R,$U,S=[],U=$A(null),V;
const $V=(A,B)=>{let C=S.length;S[C]=A;S[C+1]=B;U[A]=1},$W=()=>{$K=$V;$D(E,"onPlayerJoin",{configurable:!0,set:_=>{$U=typeof _==="function"?_:F},get:()=>$U})},$X=()=>{let A=P.length;while(R<A){Q[P[R]]=1;R++}},$Y=()=>{let A=api.getPlayerIds(),B=0,C,D;while(B<A.length){C=A[B];if(Q===null||C in Q){U[C]=2}else{D=S.length;S[D]=C;S[D+1]=!1;U[C]=1}B++}},$Z=()=>{let A=O,C,D;while(V<S.length&&A>0){C=S[V];if(U[C]!==2){$E();D=S[V+1];U[C]=2;V+=2;B.en=1;B.fn=$U;B.args=[C,D];B.sid=0;try{$U(C,D)}catch(_){B.en=0;$(G+" JM: "+_.name+": "+_.message,0)}B.en=0;V-=2;A--}V+=2}return V>=S.length},$a=()=>{$K=$U;$D(E,"onPlayerJoin",{configurable:!0,set:L.onPlayerJoin,get:M.onPlayerJoin});P=null;Q=null;S=null;U=null};
let W=G+" BM: ",$b,X,Y=[null],Z,a,b,c,d,e,f,g,h,i,j,k,l;
const $c=()=>{let A=a,B,C,E,F,G;while(d<e){B=X[d];if(!B?.length||B.length<3){D.cursor=++d;continue}C=B[0]=$F(B[0])|0;E=B[1]=$F(B[1])|0;F=B[2]=$F(B[2])|0;if((B[3]=api.getBlock(C,E,F))==="Unloaded"){return!1}try{G=$H(C,E,F)?.persisted?.shared?.text;$E(G)}catch(_){Y[++c*+(Y.length-1<b)]=[_.name,_.message,C,E,F]}D.cursor=++d;A--;if(A<=0){return!1}}return!0},$d=()=>{if(!f){let A=X[0];if(!A?.length||A.length<3){return!0}let B=A[0]=$F(A[0])|0,C=A[1]=$F(A[1])|0,E=A[2]=$F(A[2])|0;if($G(B,C,E)===1){return!1}h=$I([B,C,E]);if(!h[0]?.attributes?.customAttributes?.region){return!0}f=!0}let F=a,G,H,I,J,K,L,M,N,O,P,Q;while(G=h[j]){H=G.attributes.customAttributes._;I=H.length-2;while(k<I){J=H[k];K=H[k+1];L=H[k+2];M=(J>>5)+"|"+(K>>5)+"|"+(L>>5);if(!(M in g)){if($G(J,K,L)===1){return!1}g[M]=1}if(l===0){i=$I([J,K,L])}while(l<4){N="";O=l*9;P=0;while(P<9&&(Q=i[O+P])){N+=Q.attributes.customAttributes._;P++}if(P===0){D.cursor++;break}try{$E(N)}catch(_){Y[++c*+(Y.length-1<b)]=[_.name,_.message,J,K,L,l]}l++;D.cursor++;F--;if(F<=0){return!1}}l=0;k+=3}k=0;j++}return!0},$e=()=>{$b=Z?$d:$c},$f=()=>{Y[0]=null;g=null;h=null;i=null};
let m=G+" OM: ",n=-2,o=!0,p=-1,q=!1,r,s=$A(null),t,T,_B,u,v,w,x,y,z;
const $g=()=>{let A=r?.length|0;while(y<A){s[r[y]]=1;y++}r=null},$h=()=>{let A=u.length;while(x<A){v[u[x]]=1;x++}if(w==null){w=Reflect.ownKeys(E)}},$i=()=>{let A=w.length,B;while(y<A){B=w[y];if(!(B in s||B in v)){delete E[B]}y++}},$j=()=>{u=null;v=null;w=null},$k=A=>{let B="Code was loaded in "+z*50+" ms",C=Y.length-1;if(A){B+=C>0?" with "+C+" error"+(C===1?"":"s")+".":" with 0 errors."}else{B+="."}$(m+B,1+(C<=0))},$l=A=>{let B=Y.length-1;if(B>0){let C="Code execution error"+(B===1?"":"s")+":",D;if(Z){for(let E=1;E<=B;E++){D=Y[E];C+="\n"+D[0]+" at ("+D[2]+", "+D[3]+", "+D[4]+") in partition ("+D[5]+"): "+D[1]}}else{for(let E=1;E<=B;E++){D=Y[E];C+="\n"+D[0]+" at ("+D[2]+", "+D[3]+", "+D[4]+"): "+D[1]}}$(W+C,0)}else if(A){$(W+"No code execution errors.",2)}},$m=()=>{let A="",B;if(Z){if(f){B=X[0];A="Executed storage data at ("+B[0]+", "+B[1]+", "+B[2]+")."}else{A="No storage data found."}}else{let C=0,D=X.length;for(let E=0;E<D;E++){B=X[E];if(B?.[3]){A+='\n"'+B[3]+'" at ('+B[0]+", "+B[1]+", "+B[2]+")";C++}}A="Executed "+C+" block"+(C===1?"":"s")+" data"+(C===0?".":":")+A}$(W+A,3)},$n=(A,B,C)=>{if(A){$k(B)}if(B){$l(!A)}if(C){$m()}},$o=()=>{p++;if(n<4){if(n===-2){if(I&&p>20){let A=G+": Critical error - "+I[0]+": "+I[1]+".",B=api.getPlayerIds(),C=0,E;while(C<B.length){E=B[C];if(api.checkValid(E)){api.kickPlayer(E,A)}C++}}return}if(n===0){$J();n=1}if(n===1){if($K){$W();if(Q!==null){$X()}$Y()}n=2}if(n===2){if(o){$N();$g()}else{$O();if(v!==null){$h();$i()}$j()}n=3}if(n===3){$e();$S();n=4}}if(n===4&&$b()){$f();n=5+!$K}if(n===5&&$Z()){$a();n=6}if(n===6){$T();D.isPrimaryBoot=o=!1;D.isRunning=q=!1;n=-1;z=p;$n(t,T,_B)}};
D.SM=C;
D.config=A;
D.reboot=()=>{if(!q){p=0;D.isRunning=q=!0;D.cursor=0;$L=$o;n=0}else{$(m+"Reboot request was denied.",1)}};
D.logBootStatus=(A=!0)=>{$k(A)};
D.logErrors=(A=!0)=>{$l(A)};
D.logExecutionInfo=()=>{$m()};
D.logReport=(A=!0,B=!0,C=!1)=>{$n(A,B,C)};
$L=$o;
E.tick=function(){$L(50);if(_A.length){$_()}};
try{p=0;D.isRunning=q=!0;D.cursor=0;$M();let F=A.STYLES;for(let G=0;G<4;G++){H[G]=[{str:"",style:{color:F[G*3],fontWeight:F[G*3+1],fontSize:F[G*3+2]}}]}$C(A);$C(A.OM);$C(A.BM);$C(A.JM);$B(A.STYLES);$C(B);$B(C);$C(D);E.IF=B;E.CL=D;r=Reflect.ownKeys(E);n=0}catch(_){I=[_.name,_.message]}
void 0
}

