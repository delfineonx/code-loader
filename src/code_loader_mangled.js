// Code Loader v2026-03-06-0001
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
    boot_delay_ms: 100,
    show_boot_status: true,
    show_errors: true,
    show_execution_info: false,
  },
  BM: {
    is_chest_mode: false,
    execution_budget_per_tick: 8,
    max_error_count: 32,
  },
  JM: {
    reset_on_reboot: true,
    dequeue_budget_per_tick: 8,
  },
  STYLES: [
    "#FF775E", "500", "0.95rem",
    "#FFC23D", "500", "0.95rem",
    "#20DD69", "500", "0.95rem",
    "#52B2FF", "500", "0.95rem",
  ],
};

{
  const A=configuration,
  B={
    en:0,
    rcnt:0,
    sid:0
  },
  C={},
  D={
    isPrimaryBoot:!0,
    isRunning:!1,
    cursor:0
  },
  E=eval,
  F=Math.floor,
  G=api.getBlockId,
  H=api.getBlockData,
  I=api.getStandardChestItems,
  J=Object.freeze(function(){}),
  K=[],
  L="Code Loader";
  const $=(A,B)=>{
    let C=K[B];
    C[0].str=A;
    api.broadcastMessage(C);
    C[0].str=""
  },
  $A=()=>{
    let B=A.JM,
    C=A.BM,
    D=A.OM;
    V=0;
    W=J;
    X=J;
    if(T){
      Y=!!B.reset_on_reboot;
      Z=B.dequeue_budget_per_tick|0;
      Z=(Z&~(Z>>31))+(-Z>>31)+1;
      a=J;
      if(!v){
        b.length=0;
        if(Y){
          c={}
        }
      }
      d=0
    }
    f=A.BLOCKS instanceof Array?A.BLOCKS:[];
    h=!!C.is_chest_mode;
    i=C.execution_budget_per_tick|0;
    i=(i&~(i>>31))+(-i>>31)+1;
    j=C.max_error_count|0;
    j=j&~(j>>31);
    g.length=1;
    g[0]=null;
    k=0;
    l=0;
    m=f.length;
    if(h){
      n=!1;
      o={};
      r=1;
      s=0;
      t=0
    }
    y=(D.boot_delay_ms|0)*.02|0;
    y=y&~(y>>31);
    _D=!!D.show_boot_status;
    _E=!!D.show_errors;
    _F=!!D.show_execution_info;
    z=-1
  };
  { // B, $
    const A=B,
    C=A.fn=Object.freeze(()=>{}),
    D=A.args=A.noArgs=Object.freeze([]),
    E=[null,D,null,0],
    F=[];
    let G=E,
    H=1,
    I=0,
    J=0,
    K=0;
    A.tick=()=>{
      A.fn=C;
      A.args=D;
      if(!K){return}
      H=0;
      let L=null;
      while(K){
        G=F[I];
        A.args=G[1];
        A.rcnt=++G[2];
        A.sid=G[3];
        try{
          G[0](...A.args)
        }catch(M){
          L=M
        }
        F[I]=void 0;
        I++;
        K--;
        if(L){
          $("Interruption Framework ["+(G[0]?.name||"<anonymous>")+"]: "+L.name+": "+L.message,0);
          L=null
        }
      }
      I=0;
      J=0;
      F.length=0;
      G=E;
      A.en=0;
      A.fn=C;
      A.args=D;
      A.rcnt=0;
      H=1
    };
    Object.defineProperty(globalThis.InternalError.prototype,"name",{
      configurable:!0,
      get:()=>{
        if(H){
          if(A.en){
            A.en=0;
            F[J]=[A.fn,A.args,0,A.sid];
            J++;
            K++
          }
        }else{
          A.en=0;
          A.rcnt=0;
          G[1]=A.args;
          G[3]=A.sid;
          G=E;
          A.args=D;
          H=1
        }
        return"InternalError"
      }
    })
  }
  let _A,
  _B;
  { // C, F, G, H, I, L, $, _A, _B
    let A=api.setBlock,
    B=api.getStandardChestItemSlot,
    D=api.setStandardChestItemSlot,
    E=L+" SM: ",
    J=_A=[],
    K=0,
    M=1,
    N="Bedrock",
    O="Boat",
    P={customAttributes:{_:null}},
    Q={customAttributes:{_:[]}},
    R=Q.customAttributes._,
    S=[],
    T,
    U,
    V,
    W,
    X,
    Y,
    Z,
    a,
    b,
    c,
    d,
    e,
    f,
    g,
    h,
    i,
    j,
    k,
    l;
    const $A=A=>{
      if(!A?.length||A.length<3){
        $(E+"Invalid registry position. Expected registryPos as [x, y, z].",1);
        return null
      }
      let C=F(A[0])|0,
      D=F(A[1])|0,
      H=F(A[2])|0;
      if(G(C,D,H)===1){return !1}
      let I=[C,D,H],
      J=B(I,0)?.attributes?.customAttributes?.region;
      if(!J){
        $(E+"No valid registry unit found at ("+C+", "+D+", "+H+").",1);
        return null
      }
      return[I,J]
    },
    $B=(B,C)=>{
      if(!B?.length||!C?.length||B.length<3||C.length<3){
        $(E+"Invalid region positions. Expected lowPos and highPos as [x, y, z].",1);
        return !0
      }
      let H=F(B[0])|0,
      I=F(B[1])|0,
      J=F(B[2])|0,
      K=F(C[0])|0,
      L=F(C[1])|0,
      M=F(C[2])|0;
      if(H>K||I>L||J>M){
        $(E+"Invalid region bounds. lowPos ["+H+", "+I+", "+J+"] must be <= highPos ["+K+", "+L+", "+M+"] on all axes.",1);
        return !0
      }
      if(G(H,I,J)===1){return !1}
      A(H,I,J,N);
      D([H,I,J],0,O,null,void 0,{
        customAttributes:{
          region:[H,I,J,K,L,M]
        }
      });
      $(E+"Registry unit created at ("+H+", "+I+", "+J+").",2);
      return !0
    },
    $C=A=>{
      let B=$A(A);
      if(B===!1){return !1}
      if(B===null){return !0}
      let C=B[1];
      $(E+"Storage covers region from ("+C[0]+","+C[1]+","+C[2]+") to ("+C[3]+","+C[4]+","+C[5]+").",3);
      return !0
    },
    $D=(B,C,I)=>{
      if(M===1){
        let A=$A(B);
        if(A===!1){return !1}
        if(A===null){return !0}
        let D=A[1];
        Y=D[0];
        Z=D[1];
        a=D[2];
        b=D[3];
        c=D[4];
        d=D[5];
        let F=(b-Y+1)*(c-Z+1)*(d-a+1)-1,
        G=C.length+3>>2;
        if(F<G){
          $(E+"Not enough space. Need "+G+" storage units, but region holds "+F+".",0);
          return !0
        }
        U=A[0];
        T={};
        e=Y;
        f=Z;
        g=a;
        h=0;
        X=1;
        l=0;
        M=2
      }
      let J=e,
      K=f,
      L=g,
      W=I,
      j=C.length,
      k,m,n,o,p,q,r,s,t,
      u,v,w,x,y,z,_,__;
      while(h<j){
        if(M===2){
          J++;
          if(J>b){
            J=Y;
            L++;
            if(L>d){
              L=a;
              K++;
              if(K>c){
                return !0
              }
            }
          }
          y=(J>>5)+"|"+(K>>5)+"|"+(L>>5);
          if(!T[y]){
            if(G(J,K,L)===1){return !1}
            T[y]=!0
          }
          A(J,K,L,N);
          e=J;
          f=K;
          g=L;
          V=[J,K,L];
          i=0;
          M=3
        }
        while(i<4&&h<j){
          if(M===3){
            u=C[h];
            if(!u?.length||u.length<3){
              h++;
              continue
            }
            v=F(u[0])|0;
            w=F(u[1])|0;
            x=F(u[2])|0;
            y=(v>>5)+"|"+(w>>5)+"|"+(x>>5);
            if(!T[y]){
              if(G(v,w,x)===1){return !1}
              T[y]=!0
            }
            k=H(v,w,x)?.persisted?.shared?.text;
            if(k?.length>0){
              _=0;
              m=0;
              n=0;
              o=JSON.stringify(k);
              p=1;
              q=o.length-1;
              while(p<q){
                r=p+1950;
                if(r>q){r=q}
                r-=o[r-1]==="\\";
                while(p<r){
                  s=o.indexOf("\\",p);
                  if(s===-1||s>=r){
                    t=r-p;
                    p+=t;
                    n+=t;
                    break
                  }
                  if(s>p){
                    t=s-p;
                    p+=t;
                    n+=t
                  }
                  p+=2;
                  n+=1
                }
                S[_]=k.slice(m,n);
                _++;
                m=n
              }
              S.length=_;
              M=4
            }
          }
          if(M===4){
            z=i*9;
            _=0;
            __=S.length;
            while(_<__){
              P.customAttributes._=S[_];
              D(V,z+_,O,null,void 0,P);
              _++
            }
            i++;
            M=3
          }
          h++
        }
        if(l>=243){
          D(U,X,O,null,void 0,Q);
          R.length=0;
          l=0;
          X++
        }
        R[l++]=J;
        R[l++]=K;
        R[l++]=L;
        M=2;
        W--;
        if(W<=0){return !1}
      }
      D(U,X,O,null,void 0,Q);
      $(E+"Built storage at ("+U[0]+", "+U[1]+", "+U[2]+").",2);
      P.customAttributes._=null;
      R.length=0;
      S.length=0;
      T=null;
      U=null;
      V=null;
      M=1;
      return !0
    },
    $E=(B,C)=>{
      if(M===1){
        let A=$A(B);
        if(A===!1){return !1}
        if(A===null){return !0}
        U=A[0];
        T={};
        W=I(U);
        X=1;
        k=0;
        M=2
      }
      let F=C,
      H,J,K,L,N;
      while(H=W[X]){
        if(M===2){
          j=H.attributes.customAttributes._;
          k=0;
          l=j.length;
          M=3
        }
        if(M===3){
          while(k<l){
            J=j[k];
            K=j[k+1];
            L=j[k+2];
            N=(J>>5)+"|"+(K>>5)+"|"+(L>>5);
            if(!T[N]){
              if(G(J,K,L)===1){return !1}
              T[N]=!0
            }
            A(J,K,L,"Air");
            k+=3;
            F--;
            if(F<=0){
              return !1
            }
          }
          D(U,X,"Air");
          X++;
          M=2
        }
      }
      $(E+"Disposed storage at ("+U[0]+", "+U[1]+", "+U[2]+").",2);
      T=null;
      U=null;
      W=null;
      j=null;
      M=1;
      return !0
    };
    C.create=(A,B)=>{
      J[J.length]=()=>$B(A,B)
    };
    C.check=A=>{
      J[J.length]=()=>$C(A)
    };
    C.build=(A,B,C=8)=>{
      J[J.length]=()=>$D(A,B,C)
    };
    C.dispose=(A,B=32)=>{
      J[J.length]=()=>$E(A,B)
    };
    _B=()=>{
      let A=K<J.length;
      while(A){
        try{
          if(!J[K]()){break}
        }catch(B){
          M=1;
          $(E+"Task error on tick - "+B.name+": "+B.message,0)
        }
        A=++K<J.length
      }
      if(!A){
        J.length=0;
        K=0
      }
    }
  }
  let M=Object.create(null),
  N=Object.create(null),
  O=!1,
  P=null,
  Q=[],
  R=[],
  S=0,
  T,
  U,
  V;
  const $B=()=>{
    if(O){return}
    let C=A.EVENTS,
    D=C.length,
    E=0,
    F;
    while(E<D){
      F=C[E];
      let G,H,I;
      if(typeof F==="string"){
        G=F
      }else{
        G=F[0];
        H=!!F[1];
        I=F[2]
      }
      if(G==="tick"){
        E++;
        continue
      }
      if(G!=="onPlayerJoin"){
        Q[Q.length]=G;
        R[R.length]=I;
        let K=J;
        M[G]=L=>{K=typeof L==="function"?L:J};
        N[G]=()=>K;
        if(H){
          const P=B;
          globalThis[G]=function(S,V,W,X,Y,Z,a,b,c){
            P.en=1;
            P.fn=K;
            P.args=[S,V,W,X,Y,Z,a,b,c];
            P.sid=0;
            try{
              return K(S,V,W,X,Y,Z,a,b,c)
            }finally{
              P.en=0
            }
          }
        }else{
          globalThis[G]=function(P,S,V,W,X,Y,Z,a,b){
            return K(P,S,V,W,X,Y,Z,a,b)
          }
        }
      }else{
        T=$H;
        M.onPlayerJoin=K=>{T=typeof K==="function"?K:J};
        N.onPlayerJoin=()=>T;
        if(H){
          const L=B;
          globalThis.onPlayerJoin=function(P,S){
            L.en=1;
            L.fn=T;
            L.args=[P,S];
            L.sid=0;
            try{
              return T(P,S)
            }finally{
              L.en=0
            }
          }
        }else{
          globalThis[G]=function(L,P){
            return T(L,P)
          }
        }
      }
      E++
    }
    M.tick=K=>{U=typeof K==="function"?K:J};
    N.tick=()=>U
  },
  $C=()=>{
    let A=Q.length;
    while(S<A){
      let B=Q[S],
      C=R[S];
      if(C!==void 0){
        api.setCallbackValueFallback(B,C)
      }
      Object.defineProperty(globalThis,B,{
        configurable:!0,
        set:M[B],
        get:N[B]
      });
      S++
    }
    if(T){
      Object.defineProperty(globalThis,"onPlayerJoin",{
        configurable:!0,
        set:M.onPlayerJoin,
        get:N.onPlayerJoin
      })
    }
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:M.tick,
      get:N.tick
    });
    R=null
  },
  $D=()=>{
    let A=Q.length;
    while(V<A){
      M[Q[V]](J);
      V++
    }
    if(T){T=J}
  };
  let W,
  X;
  const $E=()=>{
    B.tick();
    X(50);
    W()
  },
  $F=()=>{
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:A=>{X=typeof A==="function"?A:J},
      get:()=>X
    });
    W=U;
    U=$E
  },
  $G=()=>{
    Object.defineProperty(globalThis,"tick",{
      configurable:!0,
      set:M.tick,
      get:N.tick
    });
    U=X;
    W=J
  };
  let Y,
  Z,
  a,
  b=[],
  c={},
  d;
  const $H=(A,B)=>{
    let C=b.length;
    b[C]=A;
    b[C+1]=B;
    c[A]=1
  },
  $I=()=>{
    T=$H;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:A=>{a=typeof A==="function"?A:J},
      get:()=>a
    })
  },
  $J=()=>{
    if(Y||v){
      let A=api.getPlayerIds(),
      B=0,
      C,D;
      while(C=A[B]){
        if(!c[C]){
          D=b.length;
          b[D]=C;
          b[D+1]=!1;
          c[C]=1
        }
        B++
      }
    }
  },
  $K=()=>{
    let A=Z,
    C,D;
    while(d<b.length&&A>0){
      C=b[d];
      if(c[C]!==2){
        D=b[d+1];
        c[C]=2;
        d+=2;
        B.en=1;
        B.fn=a;
        B.args=[C,D];
        B.sid=0;
        try{
          a(C,D)
        }catch(E){
          B.en=0;
          $(L+" JM: "+E.name+": "+E.message,0)
        }
        B.en=0;
        d-=2;
        A--
      }
      d+=2
    }
    return d>=b.length
  },
  $L=()=>{
    T=a;
    Object.defineProperty(globalThis,"onPlayerJoin",{
      configurable:!0,
      set:M.onPlayerJoin,
      get:N.onPlayerJoin
    });
    b.length=0
  };
  let e=L+" BM: ",
  $M,
  f,
  g=[null],
  h,
  i,
  j,
  k,
  l,
  m,
  n,
  o,
  p,
  q,
  r,
  s,
  t;
  const $N=()=>{
    let A=i,
    B,C,G,I,J;
    while(l<m){
      B=f[l];
      if(!B?.length||B.length<3){
        D.cursor=++l;
        continue
      }
      C=B[0]=F(B[0])|0;
      G=B[1]=F(B[1])|0;
      I=B[2]=F(B[2])|0;
      if((B[3]=api.getBlock(C,G,I))==="Unloaded"){return !1}
      try{
        J=H(C,G,I)?.persisted?.shared?.text;
        E(J)
      }catch(K){
        g[++k*+(g.length-1<j)]=[K.name,K.message,C,G,I]
      }
      D.cursor=++l;
      A--;
      if(A<=0){return !1}
    }
    return !0
  },
  $O=()=>{
    if(!n){
      let A=f[0];
      if(!A?.length||A.length<3){return !0}
      let B=A[0]=F(A[0])|0,
      C=A[1]=F(A[1])|0,
      D=A[2]=F(A[2])|0;
      if(G(B,C,D)===1){return !1}
      p=I([B,C,D]);
      if(!p[0]?.attributes?.customAttributes?.region){return !0}
      n=!0
    }
    let A=i,
    B,C,H,J,K,L,M,N,O,P,Q;
    while(B=p[r]){
      C=B.attributes.customAttributes._;
      H=C.length-2;
      while(s<H){
        J=C[s];
        K=C[s+1];
        L=C[s+2];
        M=(J>>5)+"|"+(K>>5)+"|"+(L>>5);
        if(!o[M]){
          if(G(J,K,L)===1){return !1}
          o[M]=!0
        }
        if(t===0){
          q=I([J,K,L])
        }
        while(t<4){
          N="";O=t*9;
          P=0;
          while(P<9&&(Q=q[O+P])){
            N+=Q.attributes.customAttributes._;
            P++
          }
          if(P===0){
            D.cursor++;
            break
          }
          try{
            E(N)
          }catch(R){
            g[++k*+(g.length-1<j)]=[R.name,R.message,J,K,L,t]
          }
          t++;
          D.cursor++;
          A--;
          if(A<=0){
            return !1
          }
        }
        t=0;
        s+=3
      }
      s=0;
      r++
    }
    return !0
  },
  $P=()=>{
    $M=h?$O:$N
  },
  $Q=()=>{
    g[0]=null;
    o=null;
    p=null;
    q=null
  };
  let _C=L+" OM: ",
  u=-2,
  v=!0,
  w=-1,
  x=!1,
  y,
  _D,
  _E,
  _F,
  z;
  const $R=A=>{
    let B="Code was loaded in "+z*50+" ms",
    C=g.length-1;
    if(A){
      B+=C>0?" with "+C+" error"+(C===1?"":"s")+".":" with 0 errors."
    }else{
      B+="."
    }
    $(_C+B,1+(C<=0))
  },
  $S=A=>{
    let B=g.length-1;
    if(B>0){
      let C="Code execution error"+(B===1?"":"s")+":",
      D;
      if(h){
        for(let E=1;E<=B;E++){
          D=g[E];
          C+="\n"+D[0]+" at ("+D[2]+", "+D[3]+", "+D[4]+") in partition ("+D[5]+"): "+D[1]
        }
      }else{
        for(let E=1;E<=B;E++){
          D=g[E];
          C+="\n"+D[0]+" at ("+D[2]+", "+D[3]+", "+D[4]+"): "+D[1]
        }
      }
      $(e+C,0)
    }else if(A){
      $(e+"No code execution errors.",2)
    }
  },
  $T=()=>{
    let A="",
    B;
    if(h){
      if(n){
        B=f[0];
        A="Executed storage data at ("+B[0]+", "+B[1]+", "+B[2]+")."
      }else{
        A="No storage data found."
      }
    }else{
      let C=0,
      D=f.length;
      for(let E=0;E<D;E++){
        B=f[E];
        if(B?.[3]){
          A+='\n"'+B[3]+'" at ('+B[0]+", "+B[1]+", "+B[2]+")";
          C++
        }
      }
      A="Executed "+C+" block"+(C===1?"":"s")+" data"+(C===0?".":":")+A
    }
    $(e+A,3)
  },
  $U=(A,B,C)=>{
    if(A){
      $R(B)
    }
    if(B){
      $S(!A)
    }
    if(C){
      $T()
    }
  },
  $V=()=>{
    w++;
    if(u<3){
      if(u===-2){
        if(!O&&w>20){
          let A=L+" EM: Error on primary setup - "+P?.[0]+": "+P?.[1]+".",
          B=api.getPlayerIds(),
          C=0,
          D;
          while(D=B[C]){
            if(api.checkValid(D)){
              api.kickPlayer(D,A)
            }
            C++
          }
        }
        return
      }
      if(u===0){
        $A();
        u=1
      }
      if(u===1){
        if(w<y){return}
        u=2
      }
      if(u===2){
        if(v){
          $C()
        }else{
          $D()
        }
        if(T){
          $I();
          $J()
        }
        $P();
        $F();
        u=3
      }
    }
    if(u===3&&$M()){
      $Q();
      u=4+!T
    }
    if(u===4&&$K()){
      $L();
      u=5
    }
    if(u===5){
      $G();
      D.isPrimaryBoot=v=!1;
      D.isRunning=x=!1;
      u=-1;
      z=w-y+1;
      $U(_D,_E,_F)
    }
  };
  D.SM=C;
  D.config=A;
  D.reboot=()=>{
    if(!x){
      w=0;
      D.isRunning=x=!0;
      D.cursor=0;
      U=$V;
      u=0
    }else{
      $(_C+"Reboot request was denied.",1)
    }
  };
  D.logBootStatus=(A=!0)=>{
    $R(A)
  };
  D.logErrors=(A=!0)=>{
    $S(A)
  };
  D.logExecutionInfo=()=>{
    $T()
  };
  D.logReport=(A=!0,B=!0,C=!1)=>{
    $U(A,B,C)
  };
  U=$V;
  globalThis.tick=function(){
    U(50);
    if(_A.length){_B()}
  };
  try{
    w=0;
    D.isRunning=x=!0;
    D.cursor=0;
    $B();
    let E=A.STYLES;
    for(let F=0;F<4;F++){
      K[F]=[{
        str:"",
        style:{
          color:E[F*3],
          fontWeight:E[F*3+1],
          fontSize:E[F*3+2]
        }
      }]
    }
    let G=Object.seal,
    H=Object.freeze;
    G(A);
    G(A.OM);
    G(A.BM);
    G(A.JM);
    H(A.STYLES);
    G(B);
    H(C);
    G(D);
    O=!0;
    u=0
  }catch(_){
    P=[_.name,_.message]
  }
  globalThis.IF=B;
  globalThis.CL=D;
  void 0
}

