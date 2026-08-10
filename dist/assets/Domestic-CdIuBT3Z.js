import{a as r,A as H,w as B,j as e,y as U,W as P,M as Y,X as V,Y as X,Z as q,R as L,$ as K,a0 as Q,E as Z,a1 as J,a2 as ee,h as te,m as se,p as ae,K as re,L as ie,z as oe}from"./index-C38H4Qxj.js";const ne={north:["delhi","new delhi","punjab","haryana","himachal","himachal pradesh","uttarakhand","uttaranchal","jammu","kashmir","ladakh","chandigarh","rajasthan","uttar pradesh","up","agra","jaipur","shimla","manali","leh","varanasi","lucknow","amritsar","rishikesh","haridwar","mussoorie"],south:["kerala","karnataka","tamil nadu","tamilnadu","telangana","andhra","andhra pradesh","goa","mumbai","pondicherry","puducherry","coorg","ooty","munnar","alleppey","bangalore","bengaluru","hyderabad","chennai","mysore","mysuru","kodagu","hampi","madurai","kochi","cochin","thiruvananthapuram","trivandrum"],east:["west bengal","bengal","kolkata","calcutta","odisha","orissa","bihar","jharkhand","assam","meghalaya","manipur","nagaland","mizoram","tripura","arunachal","sikkim","darjeeling","gangtok","shillong","guwahati","puri","bhubaneswar","patna"],west:["gujarat","maharashtra","rajasthan","madhya pradesh","mp","chhattisgarh","goa","pune","nashik","aurangabad","solapur","ahmedabad","surat","vadodara","udaipur","jodhpur","ajmer","indore","bhopal","raipur","navi mumbai","panaji","vasco","margao"]};function I(a){const g=`${a.title||""} ${a.state||""} ${a.region||""}`.toLowerCase();for(const[b,j]of Object.entries(ne))if(j.some(h=>g.includes(h)))return b;return null}const le=()=>e.jsx("style",{children:`
    #domestic {
      --saffron: #E8813A;
      --saffron-light: #F4A261;
      --saffron-dark: #C85A1A;
      --forest: #1A3C34;
      --forest-light: #2E6B5C;
      --cream: #FBF5EC;
      --cream-deep: #F3E8D4;
      --ink: #0F1923;
    }

    #domestic .section-eyebrow {
      font-family: 'Outfit', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      letter-spacing: 3px;
      text-transform: uppercase;
      color: var(--saffron);
      margin-bottom: 10px;
      display: block;
    }

    #domestic .section-title {
      font-family: 'Cormorant Garamond', serif;
      font-size: clamp(2rem, 4vw, 3.2rem);
      font-weight: 600;
      line-height: 1.15;
      color: var(--ink);
      margin: 0;
    }

    #domestic .filter-pill {
      display: inline-flex;
      align-items: center;
      padding: 9px 20px;
      border-radius: 50px;
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.25s;
      border: 1.5px solid #E5E7EB;
      background: white;
      color: #6B7280;
      white-space: nowrap;
      gap: 7px;
    }
    #domestic .filter-pill:hover {
      border-color: var(--saffron);
      color: var(--saffron);
    }
    #domestic .filter-pill.active {
      background: var(--saffron);
      color: white;
      border-color: var(--saffron);
      box-shadow: 0 4px 14px rgba(232,129,58,0.35);
    }

    #domestic .view-btn {
      width: 40px;
      height: 40px;
      border-radius: 10px;
      border: 1.5px solid #E5E7EB;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      background: white;
      color: #6B7280;
    }
    #domestic .view-btn.active {
      border-color: var(--saffron);
      background: #fff5ee;
      color: var(--saffron);
    }

    #domestic .skeleton {
      background: linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%);
      background-size: 200% 100%;
      animation: domestic-shimmer 1.5s infinite;
      border-radius: 10px;
    }
    @keyframes domestic-shimmer {
      0%   { background-position: -200% 0; }
      100% { background-position:  200% 0; }
    }

    #domestic .dc-track::-webkit-scrollbar { display: none; }
    #domestic .dc-track {
      scrollbar-width: none;
      -ms-overflow-style: none;
    }

    #domestic .dom-card {
      border-radius: 20px;
      overflow: hidden;
      background: white;
      box-shadow: 0 2px 20px rgba(0,0,0,0.09);
      transition: transform 0.3s ease, box-shadow 0.3s ease;
      display: flex;
      flex-direction: column;
      height: 100%;
    }
    #domestic .dom-card:hover {
      transform: translateY(-7px);
      box-shadow: 0 16px 44px rgba(0,0,0,0.15);
    }
    #domestic .dom-card:hover .dom-card-img {
      transform: scale(1.07);
    }
    #domestic .dom-card-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
      transition: transform 0.6s ease;
    }

    #domestic .tag-badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 6px;
      font-size: 0.72rem;
      font-weight: 600;
      font-family: 'Outfit', sans-serif;
    }
    #domestic .tag-orange {
      background: #fff5ee;
      color: #e06010;
      border: 1px solid #fcd9b8;
    }
    #domestic .tag-green {
      background: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }

    #domestic .cta-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 13px;
      border-radius: 14px;
      text-decoration: none;
      font-family: 'Outfit', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      color: white;
      background: linear-gradient(100deg, #f07020 0%, #c94e00 100%);
      border: none;
      cursor: pointer;
      transition: filter 0.2s, transform 0.15s;
    }
    #domestic .cta-btn:hover  { filter: brightness(1.1); }
    #domestic .cta-btn:active { transform: scale(0.98); }

    #domestic .scroll-arrow {
      width: 36px;
      height: 36px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
      border: 1.5px solid #E5E7EB;
      cursor: pointer;
      background: white;
    }
    #domestic .scroll-arrow.enabled {
      color: var(--ink);
    }
    #domestic .scroll-arrow.enabled:hover {
      border-color: var(--saffron);
      color: var(--saffron);
    }
    #domestic .scroll-arrow.disabled {
      background: #F9FAFB;
      color: #D1D5DB;
      cursor: not-allowed;
    }

    #domestic .search-input {
      padding: 10px 18px 10px 38px;
      border-radius: 50px;
      border: 1.5px solid #E5E7EB;
      font-family: 'Outfit', sans-serif;
      font-size: 0.85rem;
      outline: none;
      width: 220px;
      transition: border-color 0.2s;
      box-sizing: border-box;
    }
    #domestic .search-input:focus {
      border-color: var(--saffron);
    }

    #domestic .no-results {
      text-align: center;
      padding: 72px 24px;
      font-family: 'Outfit', sans-serif;
      color: #9CA3AF;
    }
    #domestic .no-results-icon {
      font-size: 3rem;
      margin-bottom: 16px;
      opacity: 0.4;
    }

    @media (max-width: 768px) {
      #domestic .dom-header {
        flex-direction: column !important;
        align-items: flex-start !important;
      }
    }
  `}),m={animation:null,states:null,fetchedAt:0},de=300*1e3,ue=({prefetchedData:a})=>{const{user:g}=r.useContext(H),b=g?.isAdmin,j=()=>Date.now()-m.fetchedAt<de&&m.animation!==null&&m.states!==null,[h,p]=r.useState(a?.animation?.length?a.animation:m.animation||[]),[l,f]=r.useState(a?.states?.length?a.states:m.states||[]),[E,C]=r.useState(!a?.states?.length&&!j()),[w,F]=r.useState(0),[z,R]=r.useState(window.innerWidth),[u,y]=r.useState("all"),[W,S]=r.useState("grid"),[o,n]=r.useState(""),d=r.useRef(new Map),x=r.useRef(null);r.useEffect(()=>{a?.animation?.length&&p(a.animation),a?.states?.length&&(f(a.states),C(!1))},[a]);const D=r.useCallback(s=>{let t=s;if(Array.isArray(t)&&(t=t[0]),t&&typeof t=="object"&&(t=t.secure_url??t.url??null),!t||typeof t!="string")return"/placeholder.jpg";if(d.current.has(t))return d.current.get(t);const i=t.startsWith("http")?t.replace("/upload/","/upload/f_auto,q_auto:eco,w_500,c_fill,g_auto/"):"/placeholder.jpg";return d.current.set(t,i),i},[]),O=r.useCallback(s=>{let t=s;if(Array.isArray(t)&&(t=t[0]),t&&typeof t=="object"&&(t=t.secure_url??t.url??null),!t||typeof t!="string")return"/placeholder.jpg";const i=`sb_${t}`;if(d.current.has(i))return d.current.get(i);const c=t.startsWith("http")?t.replace("/upload/","/upload/f_auto,q_auto,w_600,c_fill/"):"/placeholder.jpg";return d.current.set(i,c),c},[]);r.useEffect(()=>{const s=()=>R(window.innerWidth);return window.addEventListener("resize",s,{passive:!0}),()=>window.removeEventListener("resize",s)},[]),r.useEffect(()=>{if(a?.states?.length||j())return;x.current&&x.current.abort();const s=new AbortController;x.current=s;const t=c=>c.name==="CanceledError"||c.name==="AbortError"||c.code==="ERR_CANCELED";async function i(){try{const[c,v]=await Promise.all([B.get("/maharashtra-domestic/getallAnimation",{signal:s.signal}),B.get("/maharashtra-domestic/getstates",{signal:s.signal})]);if(s.signal.aborted)return;const A=c.data||[],k=Array.isArray(v.data)?v.data:v.data?.data??[];m.animation=A,m.states=k,m.fetchedAt=Date.now(),p(A),f(k)}catch(c){t(c)||console.error("Error fetching Domestic data:",c)}finally{s.signal.aborted||C(!1)}}return i(),()=>s.abort()},[]);const T=r.useCallback(async s=>{if(window.confirm("Are you sure you want to delete this destination?"))try{(await B.delete(`/maharashtra-domestic/deletestate/${s}`)).data.success&&f(i=>{const c=i.filter(v=>v._id!==s);return m.states=c,c})}catch(t){console.error("Error deleting:",t)}},[]),$=r.useCallback(async(s,t)=>{if(t)try{const i=new FormData;i.append("images",t);const c=await B.put(`/maharashtra-domestic/updatestate/${s}`,i,{headers:{"Content-Type":"multipart/form-data"}});c.data.success&&f(v=>{const A=v.map(k=>k._id===s?{...k,images:c.data.data.images}:k);return m.states=A,A})}catch(i){console.error("Error updating:",i)}},[]),N=r.useMemo(()=>l.filter(s=>{const t=!o||s.title?.toLowerCase().includes(o.toLowerCase())||s.state?.toLowerCase().includes(o.toLowerCase()),i=u==="all"||s.region?.toLowerCase()===u||I(s)===u;return t&&i}),[l,o,u]),M=r.useMemo(()=>{const s={all:l.length,north:0,south:0,east:0,west:0};return l.forEach(t=>{const i=t.region?.toLowerCase()||I(t);i&&i in s&&s[i]++}),s},[l]),G=[{id:"all",label:"All India",icon:e.jsx(P,{})},{id:"north",label:"North",icon:e.jsx(Y,{})},{id:"south",label:"South",icon:e.jsx(V,{})},{id:"east",label:"East",icon:e.jsx(X,{})},{id:"west",label:"West",icon:e.jsx(q,{})}],_=z>=1100;return e.jsxs("section",{id:"domestic",style:{background:"var(--cream)",paddingBottom:80},children:[e.jsx(le,{}),e.jsxs("div",{style:{maxWidth:1280,margin:"0 auto",padding:"0 24px"},children:[e.jsxs("div",{className:"dom-header",style:{display:"flex",flexDirection:"row",justifyContent:"space-between",alignItems:"flex-start",gap:24,paddingTop:80,marginBottom:48,flexWrap:"wrap"},children:[e.jsxs("div",{style:{flex:"1 1 280px",minWidth:0},children:[e.jsx("span",{className:"section-eyebrow",children:"Domestic Packages"}),e.jsxs("h2",{className:"section-title",children:["Discover ",e.jsx("em",{style:{color:"var(--saffron)",fontStyle:"italic"},children:"India's"}),e.jsx("br",{}),"Finest Destinations"]})]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:12,flexShrink:0,paddingTop:6,flexWrap:"wrap"},children:[e.jsxs("div",{style:{position:"relative"},children:[e.jsx(U,{style:{position:"absolute",left:14,top:"50%",transform:"translateY(-50%)",color:"#9CA3AF",fontSize:"0.8rem",pointerEvents:"none"}}),e.jsx("input",{value:o,onChange:s=>{n(s.target.value),y("all")},placeholder:"Search destinations...",className:"search-input"})]}),e.jsx("div",{style:{display:"flex",gap:6},children:["grid","list"].map(s=>e.jsx("button",{onClick:()=>S(s),className:`view-btn${W===s?" active":""}`,title:s==="grid"?"Grid view":"List view",children:s==="grid"?e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("rect",{x:"3",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"3",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"3",y:"14",width:"7",height:"7",rx:"1"}),e.jsx("rect",{x:"14",y:"14",width:"7",height:"7",rx:"1"})]}):e.jsxs("svg",{width:"17",height:"17",viewBox:"0 0 24 24",fill:"none",stroke:"currentColor",strokeWidth:"2",children:[e.jsx("line",{x1:"8",y1:"6",x2:"21",y2:"6"}),e.jsx("line",{x1:"8",y1:"12",x2:"21",y2:"12"}),e.jsx("line",{x1:"8",y1:"18",x2:"21",y2:"18"}),e.jsx("line",{x1:"3",y1:"6",x2:"3.01",y2:"6"}),e.jsx("line",{x1:"3",y1:"12",x2:"3.01",y2:"12"}),e.jsx("line",{x1:"3",y1:"18",x2:"3.01",y2:"18"})]})},s))})]})]}),e.jsx("div",{style:{display:"flex",gap:10,marginBottom:44,overflowX:"auto",paddingBottom:4},children:G.map(s=>e.jsxs("button",{className:`filter-pill${u===s.id?" active":""}`,onClick:()=>{y(s.id),n("")},children:[s.icon,e.jsx("span",{children:s.label}),e.jsx("span",{style:{marginLeft:5,padding:"2px 8px",borderRadius:20,fontSize:"0.73rem",fontWeight:700,background:u===s.id?"rgba(255,255,255,0.28)":"#F3F4F6",color:u===s.id?"white":"#6B7280",minWidth:22,textAlign:"center"},children:M[s.id]??0})]},s.id))}),e.jsxs("div",{style:{display:"grid",gridTemplateColumns:_?"320px 1fr":"1fr",gap:32,alignItems:"start",width:"100%"},children:[_&&e.jsx("div",{style:{position:"sticky",top:90},children:e.jsxs("div",{style:{background:"var(--forest)",borderRadius:28,overflow:"hidden",color:"white"},children:[e.jsx("div",{style:{position:"relative",height:240,background:"#0F2920"},children:h.length>0?e.jsxs(e.Fragment,{children:[e.jsx("img",{src:O(h[w]?.images),alt:"Featured destination",loading:"eager",decoding:"async",style:{width:"100%",height:"100%",objectFit:"cover",display:"block"}}),e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(26,60,52,0.92) 0%, transparent 55%)"}}),e.jsx("div",{style:{position:"absolute",bottom:18,left:18,right:44},children:e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.3rem",fontWeight:700,color:"white",lineHeight:1.2},children:h[w]?.title||"Discover India"})}),[{dir:-1,side:"left"},{dir:1,side:"right"}].map(({dir:s,side:t})=>e.jsx("button",{onClick:()=>F(i=>(i+s+h.length)%h.length),style:{position:"absolute",[t]:10,top:"50%",transform:"translateY(-50%)",width:30,height:30,borderRadius:"50%",background:"rgba(255,255,255,0.15)",border:"none",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"1.1rem",lineHeight:1},children:s===-1?"‹":"›"},t))]}):e.jsx("div",{className:"skeleton",style:{width:"100%",height:"100%"}})}),e.jsxs("div",{style:{padding:"22px 24px 26px"},children:[e.jsx("div",{style:{fontFamily:"Outfit, sans-serif",fontSize:"0.72rem",opacity:.55,letterSpacing:3,textTransform:"uppercase",marginBottom:14},children:"Quick Stats"}),[{label:"Destinations",val:l.length>0?`${l.length}+`:"—"},{label:"Filtered",val:`${N.length}`},{label:"Support",val:"24/7"}].map((s,t,i)=>e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"11px 0",borderBottom:t<i.length-1?"1px solid rgba(255,255,255,0.1)":"none"},children:[e.jsx("span",{style:{fontFamily:"Outfit, sans-serif",fontSize:"0.88rem",opacity:.65},children:s.label}),e.jsx("span",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.25rem",fontWeight:700,color:"var(--saffron-light)"},children:s.val})]},t)),h.length>0&&e.jsx("div",{style:{display:"flex",gap:6,marginTop:18},children:h.map((s,t)=>e.jsx("button",{onClick:()=>F(t),style:{height:8,width:t===w?26:8,borderRadius:4,border:"none",background:t===w?"var(--saffron)":"rgba(255,255,255,0.25)",cursor:"pointer",transition:"all 0.3s",padding:0}},t))})]})]})}),e.jsx("div",{style:{minHeight:460,width:"100%"},children:E?e.jsx(he,{}):N.length===0?e.jsx(ce,{searchTerm:o,category:u,onReset:()=>{n(""),y("all")}}):e.jsx(ge,{items:N,isAdmin:b,getImageUrl:D,onDelete:T,onUpdate:$,width:z})})]})]})]})},ce=({searchTerm:a,category:g,onReset:b})=>e.jsxs("div",{className:"no-results",children:[e.jsx("div",{className:"no-results-icon",children:"🗺️"}),e.jsx("div",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.5rem",fontWeight:600,color:"#374151",marginBottom:8},children:"No destinations found"}),e.jsx("div",{style:{fontSize:"0.9rem",marginBottom:24},children:a?`No results for "${a}"`:`No destinations listed under ${g==="all"?"this":g.charAt(0).toUpperCase()+g.slice(1)} India yet.`}),e.jsx("button",{onClick:b,style:{padding:"10px 28px",borderRadius:50,border:"1.5px solid #E8813A",background:"white",color:"#E8813A",fontFamily:"Outfit, sans-serif",fontSize:"0.88rem",fontWeight:600,cursor:"pointer"},children:"Show all destinations"})]}),he=()=>e.jsxs("div",{children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20},children:[e.jsx("div",{className:"skeleton",style:{height:14,width:160}}),e.jsxs("div",{style:{display:"flex",gap:8},children:[e.jsx("div",{className:"skeleton",style:{width:36,height:36,borderRadius:10}}),e.jsx("div",{className:"skeleton",style:{width:36,height:36,borderRadius:10}})]})]}),e.jsx("div",{style:{display:"flex",gap:20,overflow:"hidden"},children:[1,2,3,4].map(a=>e.jsxs("div",{style:{flex:"0 0 calc(25% - 15px)",minWidth:200,borderRadius:20,overflow:"hidden",background:"white",boxShadow:"0 2px 16px rgba(0,0,0,0.07)"},children:[e.jsx("div",{className:"skeleton",style:{height:220}}),e.jsxs("div",{style:{padding:16,display:"flex",flexDirection:"column",gap:10},children:[e.jsx("div",{className:"skeleton",style:{height:13,width:72}}),e.jsx("div",{className:"skeleton",style:{height:20,width:130}}),e.jsx("div",{className:"skeleton",style:{height:13,width:100}}),e.jsx("div",{className:"skeleton",style:{height:44,borderRadius:14,marginTop:6}})]})]},a))})]}),ge=L.memo(({items:a,isAdmin:g,getImageUrl:b,onDelete:j,onUpdate:h})=>{const p=r.useRef(null),l=r.useRef(null),f=4,E=20,[C,w]=r.useState(!1),[F,z]=r.useState(!0),[R,u]=r.useState(0),y=r.useCallback(()=>{const o=p.current;if(!o)return;const{scrollLeft:n,scrollWidth:d,clientWidth:x}=o;w(n>4),z(n<d-x-4),u(d>x?n/(d-x):0)},[]);r.useEffect(()=>{const o=p.current;if(!o)return;o.scrollTo({left:0,behavior:"instant"}),y(),o.addEventListener("scroll",y,{passive:!0});const n=new ResizeObserver(y);return n.observe(o),()=>{o.removeEventListener("scroll",y),n.disconnect()}},[a,y]);const W=r.useCallback(o=>{const n=p.current;if(!n)return;const d=p.current.clientWidth*.9*o;n.scrollBy({left:d,behavior:"smooth"})},[]),S=Math.ceil(a.length/f);return e.jsxs("div",{ref:l,style:{width:"100%",minHeight:460},children:[e.jsxs("div",{style:{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16},children:[e.jsxs("div",{style:{fontFamily:"Outfit, sans-serif",fontSize:"0.88rem",color:"#6B7280"},children:["Showing ",e.jsx("strong",{style:{color:"var(--ink)"},children:a.length})," ","destination",a.length!==1?"s":""]}),e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:14},children:[S>1&&e.jsx("div",{style:{display:"flex",gap:5,alignItems:"center"},children:Array.from({length:Math.min(S,5)}).map((o,n)=>{const d=Math.round(R*(S-1))===n;return e.jsx("button",{onClick:()=>{const x=p.current;x&&x.scrollTo({left:n*f*(CARD_WIDTH+E),behavior:"smooth"})},style:{width:d?22:8,height:8,borderRadius:4,border:"none",background:d?"var(--saffron)":"#D1D5DB",cursor:"pointer",transition:"all 0.3s",padding:0}},n)})}),e.jsx("div",{style:{display:"flex",gap:8},children:[{dir:-1,enabled:C,Icon:K},{dir:1,enabled:F,Icon:Q}].map(({dir:o,enabled:n,Icon:d})=>e.jsx("button",{onClick:()=>W(o),disabled:!n,className:`scroll-arrow ${n?"enabled":"disabled"}`,children:e.jsx(d,{size:13})},o))})]})]}),e.jsxs("div",{style:{position:"relative",borderRadius:16,background:"#F9FAFB",padding:"20px 0",overflow:"hidden",width:"100%"},children:[C&&e.jsx("div",{style:{position:"absolute",left:0,top:0,bottom:0,width:60,background:"linear-gradient(to right, #F9FAFB, transparent)",zIndex:2,borderRadius:"16px 0 0 16px",pointerEvents:"none"}}),F&&e.jsx("div",{style:{position:"absolute",right:0,top:0,bottom:0,width:60,background:"linear-gradient(to left, #F9FAFB, transparent)",zIndex:2,borderRadius:"0 16px 16px 0",pointerEvents:"none"}}),e.jsx("div",{ref:p,className:"dc-track",style:{display:"flex",gap:E,overflowX:"auto",width:"100%",boxSizing:"border-box",padding:"4px 20px 8px",scrollSnapType:"x mandatory",WebkitOverflowScrolling:"touch",scrollbarWidth:"none",msOverflowStyle:"none"},children:a.map((o,n)=>e.jsx("div",{"data-dc-card":!0,style:{flex:"0 0 calc((100% - 60px) / 4)",minWidth:"calc((100% - 60px) / 4)",maxWidth:"calc((100% - 60px) / 4)",scrollSnapAlign:"start"},children:e.jsx(pe,{item:o,isAdmin:g,getImageUrl:b,onDelete:j,onUpdate:h,priority:n<4})},`dc-${o._id||n}`))})]}),a.length>f&&e.jsx("div",{style:{marginTop:14,height:3,background:"#E5E7EB",borderRadius:2,overflow:"hidden"},children:e.jsx("div",{style:{height:"100%",background:"linear-gradient(90deg, var(--saffron), var(--saffron-dark))",borderRadius:2,width:`${Math.max(R*100,4)}%`,transition:"width 0.15s ease-out"}})})]})}),pe=L.memo(({item:a,isAdmin:g,getImageUrl:b,onDelete:j,onUpdate:h,priority:p})=>e.jsxs("div",{className:"dom-card",children:[e.jsxs("div",{style:{position:"relative",width:"100%",height:220,background:"#F3F4F6",overflow:"hidden",flexShrink:0},children:[e.jsx("img",{src:b(a.images),alt:a.title,loading:p?"eager":"lazy",decoding:p?"sync":"async",className:"dom-card-img"}),e.jsx("div",{style:{position:"absolute",inset:0,background:"linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.1) 45%, transparent 100%)"}}),e.jsxs("div",{style:{position:"absolute",top:12,left:12,display:"flex",alignItems:"center",gap:5,background:"rgba(255,255,255,0.95)",backdropFilter:"blur(4px)",borderRadius:50,padding:"4px 10px",boxShadow:"0 2px 10px rgba(0,0,0,0.14)"},children:[e.jsx(Z,{style:{color:"#FBB040",fontSize:"0.7rem"}}),e.jsx("span",{style:{fontFamily:"Outfit, sans-serif",fontSize:"0.78rem",fontWeight:700,color:"#1F2937"},children:a.rating||"4.8"})]}),(a.region||I(a))&&e.jsxs("div",{style:{position:"absolute",top:12,right:g?76:12,padding:"4px 10px",borderRadius:50,background:"rgba(232,129,58,0.92)",backdropFilter:"blur(4px)",fontFamily:"Outfit, sans-serif",fontSize:"0.68rem",fontWeight:700,color:"white",textTransform:"capitalize"},children:[a.region||I(a)," India"]}),g&&e.jsxs("div",{style:{position:"absolute",top:10,right:10,display:"flex",gap:6,zIndex:10},children:[e.jsx("input",{id:`dc-file-${a._id}`,type:"file",accept:"image/*",style:{display:"none"},onChange:l=>h(a._id,l.target.files[0])}),e.jsx("button",{onClick:l=>{l.stopPropagation(),document.getElementById(`dc-file-${a._id}`).click()},style:{width:30,height:30,borderRadius:8,background:"rgba(251,191,36,0.92)",backdropFilter:"blur(4px)",border:"none",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(J,{size:11})}),e.jsx("button",{onClick:l=>{l.stopPropagation(),j(a._id)},style:{width:30,height:30,borderRadius:8,background:"rgba(239,68,68,0.92)",backdropFilter:"blur(4px)",border:"none",color:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center"},children:e.jsx(ee,{size:11})})]}),e.jsxs("div",{style:{position:"absolute",bottom:0,left:0,right:0,padding:"14px 16px"},children:[e.jsx("h3",{style:{fontFamily:"Cormorant Garamond, serif",fontSize:"1.3rem",fontWeight:700,color:"white",lineHeight:1.2,margin:0,textShadow:"0 2px 14px rgba(0,0,0,0.6)"},children:a.title}),a.state&&e.jsxs("div",{style:{display:"flex",alignItems:"center",gap:5,marginTop:4},children:[e.jsx(te,{style:{color:"#FDA06B",fontSize:"0.65rem"}}),e.jsx("span",{style:{fontFamily:"Outfit, sans-serif",fontSize:"0.72rem",color:"rgba(255,255,255,0.85)"},children:a.state})]})]})]}),e.jsxs("div",{style:{padding:"16px",display:"flex",flexDirection:"column",flex:1},children:[e.jsxs("div",{style:{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12,fontFamily:"Outfit, sans-serif",fontSize:"0.75rem",color:"#6B7280"},children:[e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:5},children:[e.jsx(se,{style:{color:"#9CA3AF",fontSize:"0.7rem"}})," 2–12"]}),e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:5},children:[e.jsx(ae,{style:{color:"#9CA3AF",fontSize:"0.7rem"}})," 4★"]}),e.jsxs("span",{style:{display:"flex",alignItems:"center",gap:5},children:[e.jsx(re,{style:{color:"#9CA3AF",fontSize:"0.7rem"}})," ",a.duration||"3–5 days"]})]}),e.jsx("div",{style:{borderTop:"1px solid #F3F4F6",marginBottom:12}}),e.jsxs("div",{style:{display:"flex",gap:6,marginBottom:14,flexWrap:"wrap"},children:[(a.tags||["Culture","Nature"]).slice(0,2).map((l,f)=>e.jsx("span",{className:"tag-badge tag-orange",children:l},f)),e.jsx("span",{className:"tag-badge tag-green",children:"Best Value"})]}),e.jsx("div",{style:{flex:1}}),e.jsxs(ie,{to:"/Maharashtra",className:"cta-btn",children:["Book Now ",e.jsx(oe,{size:11})]})]})]}));export{ue as default};
