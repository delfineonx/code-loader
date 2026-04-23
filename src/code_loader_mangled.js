// Code Loader v2026-04-23-0001
// Interruption Framework v2026-04-22-0001
// Copyright (c) 2025-2026 delfineonx
// SPDX-License-Identifier: Apache-2.0

let config = {
  events: [],
  sources: [],
  show_boot_status: true,
  show_error_details: true,
  show_execution_details: false,
  use_storage_mode: false,
  execution_budget_per_tick: 8,
  join_budget_per_tick: 8,
  players_to_mark_as_joined: [],
  handlers_to_preserve: null,
  globals_to_preserve: null,
  enable_storage_manager: false,
  shutdown_on_startup_error: true,
};

{
  const A=null,
  B=undefined,
  C=globalThis,
  D=Object.create,
  E=Object.freeze(function(){}),
  F=Object.freeze(function(){return !0}),
  G=eval,
  H=Math.floor,
  I=api;
  let J=E,
  K=E,
  L,
  M,
  N,
  O,
  P,
  Q,
  R,
  S,
  T,
  U,
  V=[],
  W=[],
  X=[],
  Y=[],
  Z,
  a,
  b,
  c=D(A),
  d,
  e,
  f,
  g,
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
  t=[A,A,A,A,A,A],
  u,
  v,
  w=0;
  const x={
    config:config,
    isPrimaryBoot:!0,
    stage:0,
    cursor:0,
    startTime:0,
    endTime:0,
    onStart:F,
    onLoad:F,
    onEnd:F,
    bootJoinStatus:A,
    bootLeaveRecords:A,
    reboot:()=>{
      if(x.stage===0){
        x.startTime=Date.now();
        t=[A,A,A,A,A,A];
        w=0;
        x.cursor=0;
        x.stage=1;
        K=J;
        J=$D
      }else{
        $("CL: Reboot ignored; boot is already in progress.",1)
      }
    },
    logBootStatus:(a=!0)=>{
      let b=t??x._bootErrors,
      c=0;
      if(b!=A){
        c=(b[0]!=A)+(b[2]!=A)+(b[4]!=A)+(b.length-6)
      }
      let d="CL: Boot completed in "+(x.endTime-x.startTime)+" ms";
      d+=a?c>0?" with "+c+" error"+(c===1?"":"s")+".":" without errors.":".";
      $(d,1<<(c===0)<<(b==A))
    },
    logErrorDetails:(a=!0)=>{
      let b=t??x._bootErrors;
      if(b==A){
        $("CL: Boot error details are no longer available.",4);
        return
      }
      let c=b[0]!=A,
      d=b[2]!=A,
      e=b[4]!=A,
      f=b.length-6,
      g=c+d+e+f;
      if(g>0){
        let i="CL: Boot error details:";
        if(c){
          i+="\n   onStart callback\n      "+b[0]+": "+b[1]
        }
        if(d){
          i+="\n   onLoad callback\n      "+b[2]+": "+b[3]
        }
        if(e){
          i+="\n   onEnd callback\n      "+b[4]+": "+b[5]
        }
        if(f>0){
          i+="\n   ["+f+"] code execution error"+(f===1?"":"s");
          let j;
          if(h){
            for(let k=6,l=b.length;k<l;k++){
              j=b[k];
              i+="\n      "+j[0]+" at ("+j[2]+", "+j[3]+", "+j[4]+"), container index ("+j[5]+"), partition ("+j[6]+"): "+j[1]
            }
          }else{
            for(let k=6,l=b.length;k<l;k++){
              j=b[k];
              i+="\n      "+j[0]+" at ("+j[2]+", "+j[3]+", "+j[4]+"): "+j[1]
            }
          }
        }
        $(i,0);
        return
      }
      if(a){
        $("CL: Boot completed without errors.",2)
      }
    },
    logExecutionDetails:()=>{
      let a=u??x._bootSources;
      if(a==A){
        $("CL: Execution details are no longer available.",4);
        return
      }
      let b="";
      if(a.length>0){
        let c;
        if(h){
          if(k){
            c=a[0];
            b="Executed code from storage using registry at ("+c[0]+", "+c[1]+", "+c[2]+")."
          }else{
            b="No code executed; no storage registry was found."
          }
        }else{
          let d=0;
          for(let e=0,f=a.length;e<f;e++){
            c=a[e];
            if(c?.[3]){
              b+='\n"'+c[3]+'" at ('+c[0]+", "+c[1]+", "+c[2]+")";
              d++
            }
          }
          b="Executed code from ["+d+"] source block"+(d===1?"":"s")+(d===0?".":":")+b
        }
      }else{
        b="No code executed; no positions were configured."
      }
      $("CL: "+b,3)
    },
    logReport:(a=!0,b=!0,c=!1)=>{
      if(a){
        x.logBootStatus(b)
      }
      if(b){
        x.logErrorDetails(!a)
      }
      if(c){
        x.logExecutionDetails()
      }
    }
  };
  const $=x._log=function(a,b){
    let c=$.payloads[b],
    d=a.length;
    if(d<=950){
      c[0].str=a;
      I.broadcastMessage(c)
    }else{
      let e=0,f,g;
      while(e<d){
        f=e+950;
        if(f>=d){
          g=d
        }else{
          g=a.lastIndexOf("\n",f-1);
          if(g<=e){
            g=f
          }
        }
        c[0].str=a.slice(e,g);
        I.broadcastMessage(c);
        e=g<f?g+1:g
      }
    }
    c[0].str=""
  };
  let $A=()=>{
    let a="tick",
    b="onPlayerJoin",
    c="onPlayerLeave",
    d=x.config.events,
    e=D(A),
    f,g;
    for(let h=0,i=d.length;h<i;h++){
      f=d[h];
      let j,k=!1,l;
      if(typeof f==="string"){
        j=f
      }else if(Array.isArray(f)&&typeof f[0]==="string"){
        j=f[0];
        k=!!f[1];
        l=f[2]
      }else{
        throw new TypeError("Invalid event entry at index "+h)
      }
      if(e[j]){
        throw new TypeError('Duplicate event name "'+j+'"');
      }
      e[j]=1;
      if(j===a){continue}
      g=V.length;
      V[g]=j;
      W[g]=l;
      if(j===b){
        M=E;
        L=E;
        X[g]=_=>{
          if(x.stage<3||x.stage>14){
            L=typeof _==="function"?_:E
          }else{
            M=typeof _==="function"?_:E
          }
        };
        Y[g]=()=>x.stage<3||x.stage>14?L:M;
        if(k){
          const m=y;
          C[b]=function(n,o){
            m.en=1;
            m.fn=L;
            m.args=[n,o];
            m.sid=0;
            try{
              return L(n,o)
            }finally{
              m.en=0
            }
          }
        }else{
          C[b]=function(n,o){
            return L(n,o)
          }
        }
      }else if(j===c){
        T=E;
        S=E;
        X[g]=_=>{
          if(x.stage<4||x.stage>15){
            S=typeof _==="function"?_:E
          }else{
            T=typeof _==="function"?_:E
          }
        };
        Y[g]=()=>x.stage<4||x.stage>15?S:T;
        if(k){
          const m=y;
          C[c]=function(n,o){
            m.en=1;
            m.fn=S;
            m.args=[n,o];
            m.sid=0;
            try{
              return S(n,o)
            }finally{
              m.en=0
            }
          }
        }else{
          C[c]=function(n,o){
            return S(n,o)
          }
        }
      }else{
        let w=E;
        X[g]=_=>{w=typeof _==="function"?_:E};
        Y[g]=()=>w;
        if(k){
          const m=y;
          C[j]=function(n,o,p,q,r,s,t,u,v){
            m.en=1;
            m.fn=w;
            m.args=[n,o,p,q,r,s,t,u,v];
            m.sid=0;
            try{
              return w(n,o,p,q,r,s,t,u,v)
            }finally{
              m.en=0
            }
          }
        }else{
          C[j]=function(n,o,p,q,r,s,t,u,v){
            return w(n,o,p,q,r,s,t,u,v)
          }
        }
      }
    }
    g=V.length;
    V[g]=a;
    W[g]=B;
    X[g]=_=>{
      if(x.stage===0){
        J=typeof _==="function"?_:E
      }else{
        K=typeof _==="function"?_:E
      }
    };
    Y[g]=()=>x.stage===0?J:K
  };
  let $B=()=>{
    if(x.stage===-3){
      let a=V.length;
      while(w<a){
        let b=V[w],
        c=W[w];
        if(c!==B){
          I.setCallbackValueFallback(b,c)
        }
        C[b]=1;
        Object.defineProperty(C,b,{
          configurable:!0,
          set:X[w],
          get:Y[w]
        });
        w++
      }
      W=B;
      X=B;
      Y=B;
      w=0;
      x.stage=-2
    }
    if(x.stage===-2){
      let a=b.length;
      while(w<a){
        c[b[w]]=1;
        w++
      }
      b=B;
      w=0;
      x.stage=-1
    }
    if(x.stage===-1){
      K=E;
      $B=B;
      x.stage=1;
      G()
    }
  };
  let $C=(a)=>{
    let b=I.getPlayerIds(),
    c=0,d;
    while(c<b.length){
      d=b[c];
      if(I.checkValid(d)){
        I.kickPlayer(d,a)
      }
      c++
    }
  };
  const $D=()=>{
    y.tick();
    K(50);
    $I()
  };
  const $E=(a,b)=>{
    if(O[a]!==1){
      let c=N.length;
      N[c]=a;
      N[c+1]=b;
      O[a]=1
    }
  };
  const $F=(a,b)=>{
    U[U.length]=[a,x.stage,O?.[a]|0];
    T(a,b)
  };
  const $G=()=>{
    let a=i,
    b,c,d,e,f;
    while(x.cursor<u.length){
      b=u[x.cursor];
      if((b?.length|0)<3){
        x.cursor++;
        continue
      }
      c=b[0]=H(b[0])|0;
      d=b[1]=H(b[1])|0;
      e=b[2]=H(b[2])|0;
      if((b[3]=I.getBlock(c,d,e))==="Unloaded"){return !1}
      try{
        f=I.getBlockData(c,d,e)?.persisted?.shared?.text;
        G(f)
      }catch(_){
        t[j]=[_.name,_.message,c,d,e];
        j++
      }
      x.cursor++;
      a--;
      if(a<=0){return !1}
    }
    return !0
  };
  const $H=()=>{
    if(!k){
      let a=u[0];
      if((a?.length|0)<3){return !0}
      let b=a[0]=H(a[0])|0,
      c=a[1]=H(a[1])|0,
      d=a[2]=H(a[2])|0;
      if(I.getBlockId(b,c,d)===1){return !1}
      m=I.getStandardChestItems([b,c,d]);
      if(m[0]?.attributes?.customAttributes?.region==A){return !0}
      k=!0
    }
    let e=i,
    f,g,h,s,v,w,y,z,B,C,D;
    while(f=m[o]){
      g=f.attributes.customAttributes._;
      h=g.length;
      while(p+2<h){
        s=g[p];
        v=g[p+1];
        w=g[p+2];
        y=(s>>5)+"|"+(v>>5)+"|"+(w>>5);
        if(!(y in l)){
          if(I.getBlockId(s,v,w)===1){return !1}
          l[y]=1
        }
        if(r===0){
          n=I.getStandardChestItems([s,v,w])
        }
        while(r<4){
          z="";
          B=r*9;
          C=0;
          while(C<9&&(D=n[B+C])!=A){
            z+=D.attributes.customAttributes._;
            C++
          }
          try{
            G(z)
          }catch(_){
            t[j]=[_.name,_.message,s,v,w,q,r];
            j++
          }
          r++;
          x.cursor++;
          e--;
          if(e<=0){return !1}
        }
        r=0;
        q++;
        p+=3
      }
      p=0;
      o++
    }
    return !0
  };
  const $I=()=>{
    if(x.stage<12){
      if(x.stage===1){
        if(v==A){v=D(A)}
        let a=!0;
        try{
          a=!!x.onStart(v)
        }catch(_){
          t[0]=_.name;
          t[1]=_.message
        }
        if(!a){return}
        s=x.config;
        s=typeof s==="object"?s:{};
        x._bootErrors=t;
        v=B;
        x.stage=2+((L==A)<<(S==A))
      }
      if(x.stage===2){
        P=s.join_budget_per_tick|0;
        P=P>0?P:1;
        Q=s.players_to_mark_as_joined;
        R=D(A);
        N=[];
        x.bootJoinStatus=O=D(A);
        Q??=I.getPlayerIds();
        M=L;
        L=$E;
        x.stage=3+(S==A)
      }
      if(x.stage===3){
        x.bootLeaveRecords=U=[];
        T=S;
        S=$F;
        x.stage=4
      }
      if(x.stage===4){
        Z=s.handlers_to_preserve;
        a??=D(A);
        if(Z!=A){
          let b=Z.length;
          while(w<b){
            a[Z[w]]=1;
            w++
          }
        }
        w=0;
        x.stage=5+(Z==A)
      }
      if(x.stage===5){
        let b=V.length,
        c;
        while(w<b){
          c=V[w];
          if(!(c in a)){
            C[c]=E
          }
          w++
        }
        w=0;
        x.stage=6
      }
      if(x.stage===6){
        d=s.globals_to_preserve;
        e??=D(A);
        if(d!=A){
          let a=d.length;
          while(w<a){
            e[d[w]]=1;
            w++
          }
          f=Reflect.ownKeys(C)
        }
        w=0;
        x.stage=7+(d==A)
      }
      if(x.stage===7){
        let a=f.length,
        b;
        while(w<a){
          b=f[w];
          if(!(b in c||b in e)){
            delete C[b]
          }
          w++
        }
        w=0;
        x.stage=8
      }
      if(x.stage===8){
        Z=B;
        a=B;
        d=B;
        e=B;
        f=B;
        x.stage=9|(L==A)<<1
      }
      if(x.stage===9){
        let a=Q.length;
        while(w<a){
          R[Q[w]]=1;
          w++
        }
        w=0;
        x.stage=10
      }
      if(x.stage===10){
        let a=I.getPlayerIds(),
        b=0,c,d;
        while(b<a.length){
          c=a[b];
          if(!(c in O)){
            d=N.length;
            N[d]=c;
            N[d+1]=!1;
            O[c]=1
          }
          if(c in R){
            O[c]=2
          }
          b++
        }
        Q=B;
        R=B;
        x.stage=11
      }
      if(x.stage===11){
        u=s.sources;
        u=x._bootSources=Array.isArray(u)?u:[];
        if(u.length>0){
          h=!!s.use_storage_mode;
          i=s.execution_budget_per_tick|0;
          i=i>0?i:1;
          j=6;
          if(h){
            k=!1;
            o=1;
            p=0;
            q=0;
            r=0;
            l=D(A);
            g=$H
          }else{
            g=$G
          }
        }
        x.stage=12|u.length===0
      }
    }
    if(x.stage<16){
      if(x.stage===12){
        if(!g()){return}
        if(h){
          o=B;
          p=B;
          q=B;
          r=B;
          l=B;
          m=B;
          n=B
        }
        i=B;
        j=B;
        g=B;
        x.stage=13;
        G()
      }
      if(x.stage===13){
        if(v==A){v=D(A)}
        let a=!0;
        try{
          a=!!x.onLoad(v)
        }catch(_){
          t[2]=_.name;
          t[3]=_.message
        }
        if(!a){return}
        v=B;
        x.stage=14+((L==A)<<(S==A))
      }
      if(x.stage===14){
        let a=P,
        b,c;
        while(w<N.length&&a>0){
          b=N[w];
          if(O[b]!==2){
            G();
            c=N[w+1];
            O[b]=2;
            w+=2;
            y.en=1;
            y.fn=M;
            y.args=[b,c];
            y.sid=0;
            try{
              M(b,c)
            }catch(_){
              y.en=0;
              $("CL [onPlayerJoin]: "+_.name+": "+_.message,0)
            }
            y.en=0;
            w-=2;
            a--
          }
          w+=2
        }
        if(w<N.length){return}
        P=B;
        N=B;
        O=B;
        L=M;
        M=E;
        w=0;
        x.stage=15+(S==A);
        G()
      }
      if(x.stage===15){
        U=B;
        S=T;
        T=E;
        x.stage=16
      }
    }
    if(x.stage===16){
      if(v==A){v=D(A)}
      let a=!0;
      try{
        a=!!x.onEnd(v)
      }catch(_){
        t[4]=_.name;
        t[5]=_.message
      }
      if(!a){return}
      v=B;
      x.stage=17
    }
    if(x.stage===17){
      x.endTime=Date.now();
      x.onStart=F;
      x.onLoad=F;
      x.onEnd=F;
      x.bootJoinStatus=A;
      x.bootLeaveRecords=A;
      x.logReport(!!s.show_boot_status,!!s.show_error_details,!!s.show_execution_details);
      s=B;
      t=B;
      u=B;
      J=K;
      K=E;
      x.isPrimaryBoot=!1;
      x.stage=0
    }
  };
  let y;
  // $
  {
    const A=Object.freeze(function(){}),
    B=Object.freeze([]),
    C=[A,B,0,0],
    D=[];
    let E=C,
    F=!0,
    G=0,
    H=0,
    I=0;
    const J=y={
      en:0,
      fn:A,
      args:B,
      rcnt:0,
      sid:0,
      noArgs:B,
      inspect:()=>{
        return[D,I,G,H,F]
      },
      reset:()=>{
        I=0;
        G=0;
        H=0;
        D.length=0;
        E=C;
        J.en=0;
        J.fn=A;
        J.args=B;
        J.rcnt=0;
        J.sid=0;
        F=!0
      },
      tick:()=>{
        J.fn=A;
        J.args=B;
        J.sid=0;
        if(!I){return}
        F=!1;
        let K=null;
        while(I){
          E=D[G];
          J.args=E[1];
          J.rcnt=++E[2];
          J.sid=E[3];
          try{
            E[0](...J.args)
          }catch(_){
            K=_
          }
          D[G]=undefined;
          G++;
          I--;
          if(K){
            $("IF ["+(E[0]?.name||"<anonymous>")+"]: "+K.name+": "+K.message,0);
            K=null
          }
        }
        G=0;
        H=0;
        D.length=0;
        E=C;
        J.en=0;
        J.rcnt=0;
        F=!0
      }
    };
    Object.defineProperty(globalThis.InternalError.prototype,"name",{
      configurable:!0,
      get:()=>{
        if(F){
          if(J.en){
            J.en=0;
            D[H]=[J.fn,J.args,0,J.sid];
            H++;
            I++;
            J.fn=A;
            J.args=B
          }
        }else{
          J.en=0;
          E[1]=J.args;
          E[3]=J.sid;
          E=C;
          J.rcnt=0;
          F=!0
        }
        return"InternalError"
      }
    })
  }
  // A, B, D, H, I, x, $
  if(!!config?.enable_storage_manager){
    let C="CL [SM]: ",
    E=[],
    F=0,
    G=1,
    J="Bedrock",
    K="Boat",
    L={customAttributes:{_:A}},
    M={customAttributes:{_:[]}},
    N=M.customAttributes._,
    O,
    P=[],
    Q,
    R,
    S,
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
    h;
    const $A=a=>{
      if((a?.length|0)<3){
        $(C+"Invalid registry position; expected [x, y, z].",1);
        return A
      }
      let b=H(a[0])|0,
      c=H(a[1])|0,
      d=H(a[2])|0;
      if(I.getBlockId(b,c,d)===1){return !1}
      let e=[b,c,d],
      f=I.getStandardChestItemSlot(e,0)?.attributes?.customAttributes?.region;
      if((f?.length|0)<6){
        $(C+"No registry metadata was found at ("+b+", "+c+", "+d+").",1);
        return A
      }
      return[e,f]
    };
    const $B=(a,b)=>{
      if((a?.length|0)<3||(b?.length|0)<3){
        $(C+"Invalid storage region: both positions must be [x, y, z].",1);
        return !0
      }
      let c=H(a[0])|0,
      d=H(a[1])|0,
      e=H(a[2])|0,
      f=H(b[0])|0,
      g=H(b[1])|0,
      h=H(b[2])|0;
      if(c>f||d>g||e>h){
        $(C+"Invalid storage region: min position ("+c+", "+d+", "+e+") must be <= max position ("+f+", "+g+", "+h+") on all axes.",1);
        return !0
      }
      if(I.getBlockId(c,d,e)===1){return !1}
      I.setBlock(c,d,e,J);
      I.setStandardChestItemSlot([c,d,e],0,K,A,B,{
        customAttributes:{
          region:[c,d,e,f,g,h]
        }
      });
      $(C+"Created registry at ("+c+", "+d+", "+e+").",2);
      return !0
    };
    const $C=a=>{
      let b=$A(a);
      if(b===!1){return !1}
      if(b===A){return !0}
      let c=b[1];
      $(C+"Configured storage region: ("+c[0]+", "+c[1]+", "+c[2]+") -> ("+c[3]+", "+c[4]+", "+c[5]+").",3);
      return !0
    };
    const $D=(i,j,k)=>{
      if(G===1){
        let l=$A(i);
        if(l===!1){return !1}
        if(l===A){return !0}
        let m=l[1];
        Z=m[0];
        a=m[1];
        b=m[2];
        c=m[3];
        d=m[4];
        e=m[5];
        let n=(c-Z+1)*(d-a+1)*(e-b+1)-1,
        o=j.length+3>>2;
        if(n<o){
          $(C+"Not enough space: need "+o+" container units, but region holds "+n+".",0);
          return !0
        }
        N.length=0;
        P.length=0;
        Q=D(A);
        R=l[0];
        f=Z;
        g=a;
        h=b;
        V=0;
        U=1;
        Y=0;
        G=2
      }
      let p=f,
      q=g,
      r=h,
      s=k,
      t,u,v,w,x,y,z,E,F,
      O,T,X,_a,_b,_c,_d,_e;
      while(V<j.length){
        if(G===2){
          p++;
          if(p>c){
            p=Z;
            r++;
            if(r>e){
              r=b;
              q++;
              if(q>d){
                return !0
              }
            }
          }
          _b=(p>>5)+"|"+(q>>5)+"|"+(r>>5);
          if(!(_b in Q)){
            if(I.getBlockId(p,q,r)===1){return !1}
            Q[_b]=1
          }
          I.setBlock(p,q,r,J);
          f=p;
          g=q;
          h=r;
          S=[p,q,r];
          W=0;
          G=3
        }
        while(W<4&&V<j.length){
          if(G===3){
            O=j[V];
            if((O?.length|0)<3){
              V++;
              continue
            }
            T=H(O[0])|0;
            X=H(O[1])|0;
            _a=H(O[2])|0;
            _b=(T>>5)+"|"+(X>>5)+"|"+(_a>>5);
            if(!(_b in Q)){
              if(I.getBlockId(T,X,_a)===1){return !1}
              Q[_b]=1
            }
            t=I.getBlockData(T,X,_a)?.persisted?.shared?.text??"";
            w=JSON.stringify(t);
            if(w.length<=1952){
              P[0]=t;
              P.length=1
            }else{
              _d=0;
              u=0;
              v=0;
              x=1;
              y=w.length-1;
              while(x<y){
                z=x+1950;
                if(z>y){z=y}
                z-=w[z-1]==="\\";
                while(x<z){
                  E=w.indexOf("\\",x);
                  if(E===-1||E>=z){
                    F=z-x;
                    x+=F;
                    v+=F;
                    break
                  }
                  if(E>x){
                    F=E-x;
                    x+=F;
                    v+=F
                  }
                  x+=2;
                  v+=1
                }
                P[_d]=t.slice(u,v);
                _d++;
                u=v
              }
              P.length=_d
            }
            G=4
          }
          if(G===4){
            _c=W*9;
            _d=0;
            _e=P.length;
            while(_d<_e){
              L.customAttributes._=P[_d];
              I.setStandardChestItemSlot(S,_c+_d,K,A,B,L);
              _d++
            }
            W++;
            G=3
          }
          V++
        }
        if(Y>=243){
          I.setStandardChestItemSlot(R,U,K,A,B,M);
          N.length=0;
          Y=0;
          U++
        }
        N[Y++]=p;
        N[Y++]=q;
        N[Y++]=r;
        G=2;
        s--;
        if(s<=0){return !1}
      }
      I.setStandardChestItemSlot(R,U,K,A,B,M);
      $(C+"Storage build completed using registry at ("+R[0]+", "+R[1]+", "+R[2]+").",2);
      L.customAttributes._=A;
      N.length=0;
      P.length=0;
      Q=B;
      R=B;
      S=B;
      G=1;
      return !0
    };
    const $E=(a,b)=>{
      if(G===1){
        let c=$A(a);
        if(c===!1){return !1}
        if(c===A){return !0}
        Q=D(A);
        R=c[0];
        T=I.getStandardChestItems(R);
        U=1;
        X=0;
        G=2
      }
      let d=b,
      e,f,g,h,i;
      while(e=T[U]){
        if(G===2){
          O=e.attributes.customAttributes._;
          X=0;
          Y=O.length;
          G=3
        }
        if(G===3){
          while(X+2<Y){
            f=O[X];
            g=O[X+1];
            h=O[X+2];
            i=(f>>5)+"|"+(g>>5)+"|"+(h>>5);
            if(!(i in Q)){
              if(I.getBlockId(f,g,h)===1){return !1}
              Q[i]=1
            }
            I.setBlock(f,g,h,"Air");
            X+=3;
            d--;
            if(d<=0){return !1}
          }
          I.setStandardChestItemSlot(R,U,"Air");
          U++;
          G=2
        }
      }
      $(C+"Storage disposal completed using registry at ("+R[0]+", "+R[1]+", "+R[2]+").",2);
      Q=B;
      R=B;
      T=B;
      O=B;
      G=1;
      return !0
    };
    x.SM={
      create:(a,b)=>{
        E[E.length]=()=>$B(a,b)
      },
      inspect:a=>{
        E[E.length]=()=>$C(a)
      },
      build:(a,b,c=8)=>{
        E[E.length]=()=>$D(a,b,c)
      },
      dispose:(a,b=32)=>{
        E[E.length]=()=>$E(a,b)
      },
      _tick:()=>{
        let a=E.length;
        if(!a){return}
        while(F<a){
          try{
            if(!E[F]()){break}
          }catch(_){
            G=1;
            L.customAttributes._=A;
            N.length=0;
            P.length=0;
            Q=B;
            R=B;
            S=B;
            T=B;
            O=B;
            $(C+"Queued task failed: "+_.name+": "+_.message,0)
          }
          F++
        }
        if(F>=a){
          E.length=0;
          F=0
        }
      }
    }
  }
  if(!!config?.enable_storage_manager){
    C.tick=function(){
      J(50);
      x.SM?._tick()
    }
  }else{
    C.tick=function(){
      J(50)
    }
  }
  try{
    x.startTime=Date.now();
    let _a=[
      "#FF775E","500","0.95rem",
      "#FFC23D","500","0.95rem",
      "#20DD69","500","0.95rem",
      "#52B2FF","500","0.95rem",
      "#B06CFF","500","0.95rem"
    ],
    _b=$.payloads=[];
    for(let _c=0;_c<=4;_c++){
      _b[_c]=[{
        str:"",
        style:{
          color:_a[_c*3],
          fontWeight:_a[_c*3+1],
          fontSize:_a[_c*3+2]
        }
      }]
    }
    $A();
    Object.seal(y);
    C.IF=y;
    C.CL=x;
    b=Reflect.ownKeys(C);
    config=B;
    $A=B;
    $C=B;
    x.stage=-3;
    K=$B;
    J=$D
  }catch(_d){
    const _e="CL [Startup Error]: "+_d.name+": "+_d.message+".";
    $(_e,0);
    if(!!config?.shutdown_on_startup_error){
      J=()=>$C(_e)
    }
  }
  void 0
}

