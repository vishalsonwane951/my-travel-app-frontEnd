import{a as t,A as Y,j as e,S as B,B as D,w as U}from"./index-C38H4Qxj.js";function V(){const[o,g]=t.useState({name:"",category:"",highlights:[],itinerary:[],gallery:[],testimonials:[],pricing:{currency:"₹",original:"",discounted:""}}),{user:w}=t.useContext(Y),[k,p]=t.useState(!1),[C,x]=t.useState(!1),[d,j]=t.useState(!0),[L,P]=t.useState(!1),[m,$]=t.useState([]),[u,M]=t.useState([]),[O,S]=t.useState(!1),[I,A]=t.useState(!1),y=()=>{w?p(!0):(A(!0),S(!0))},R=()=>{A(!1),x(!0)},z=a=>{setUser(a),x(!1),O&&(p(!0),S(!1))},b=[{id:1,name:"3D/2N",axiosEndpoint:"/axios/packages/3d2n"},{id:2,name:"4D/3N",axiosEndpoint:"/axios/packages/4d3n"},{id:3,name:"5D/4N",axiosEndpoint:"/axios/packages/5d4n"},{id:4,name:"7D/6N",axiosEndpoint:"/axios/packages/7d6n"}],[n,F]=t.useState(1);t.useEffect(()=>{(async()=>{j(!0);try{const i=await U.get("/explore-packages/manali/getallpackage");if(!i.data||!Array.isArray(i.data.data)){console.error("Invalid axios response:",i.data),j(!1);return}const r=i.data.data.map(s=>{const N=s.normalizedPricing||(Array.isArray(s.pricing)&&s.pricing.length>0?s.pricing[0]:s.pricing&&typeof s.pricing=="object"?s.pricing:{currency:"₹",original:"",discounted:""});return{...s,pricingObj:{currency:N.currency||"₹",original:N.original||"",discounted:N.discounted||""}}});M(r);const l=E(r,n);l?g(l):r.length>0&&g(r[0]),console.log("Fetched packages:",r)}catch(i){console.error("Error fetching package data:",i)}finally{j(!1)}})()},[]);const E=(a,i)=>{if(!Array.isArray(a))return null;let r="";if(typeof i=="number"){const s=b.find(h=>h.id===i);if(!s)return null;r=s.name}else if(typeof i=="string")r=i;else return null;return a.find(s=>(s.duration||"").toString().trim().toLowerCase()===r.toLowerCase())||null};t.useEffect(()=>{if(u.length>0){const a=E(u,n);a?(console.log("Setting package data:",a),g(a)):(console.log(`No package found for category ${n}`),g({name:"",category:"",highlights:[],itinerary:[],gallery:[],testimonials:[],pricingObj:{currency:"₹",original:"",discounted:""}}))}},[n,u]);const q=a=>{F(a)},G=()=>{const a=u.map(i=>({name:i.duration||i.name||"Unknown Package",pricing:i.pricingObj||null,price:i.price||null,rating:i.testimonials&&i.testimonials.length>0?i.testimonials[0].rating:null,highlights:i.highlights||[]}));$(a),P(!0)},v=()=>P(!1),c=(a=>a?a.pricingObj?a.pricingObj:Array.isArray(a.pricing)&&a.pricing.length>0?a.pricing[0]:a.pricing&&typeof a.pricing=="object"?a.pricing:{currency:"₹",original:"",discounted:""}:{currency:"₹",original:"",discounted:""})(o),f={alertOverlay:{position:"fixed",top:0,left:0,width:"100vw",height:"100vh",backgroundColor:"rgba(0,0,0,0.5)",display:"flex",alignItems:"center",justifyContent:"center",zIndex:1e3},alertBox:{backgroundColor:"#fff",padding:"20px 30px",borderRadius:"10px",width:"350px",height:"120px",textAlign:"center",boxShadow:"0 0 10px rgba(0,0,0,0.3)"},alertButton:{marginTop:"15px",padding:"10px 20px",backgroundColor:"#007bff",color:"#fff",border:"none",borderRadius:"5px",cursor:"pointer",fontSize:"16px"},categoryPanel:{zIndex:1}};return e.jsxs("div",{className:"goa-package",children:[e.jsxs("div",{className:"hero-section text-center text-white position-relative",children:[e.jsxs("div",{className:"package-tag",children:[b.find(a=>a.id===n)?.name," PREMIUM EXPERIENCE"]}),e.jsxs("div",{className:"container position-relative z-index-1 py-5",children:[e.jsx("h1",{className:"display-3 fw-bold mb-3",children:"Manali Golden Escape"}),e.jsx("p",{className:"lead fs-2 mb-4",children:"Where Every Moment Shines Brighter"}),e.jsxs("div",{className:"d-flex justify-content-center gap-3",children:[e.jsxs("button",{className:"btn btn-light btn-lg px-4 fw-bold book-now-btn",onClick:y,children:["Book Now @ ",c?.currency||"₹",c?.discounted||"--"]}),e.jsx("button",{className:"btn btn-outline-light btn-lg ml-2 px-4",children:"Watch Video"})]})]}),e.jsx("div",{className:"hero-overlay"})]}),e.jsx("div",{className:"container my-5",children:d?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):e.jsx("div",{className:"row g-4",children:o.highlights?.map((a,i)=>e.jsx("div",{className:"col-md-4 col-6",children:e.jsxs("div",{className:"highlight-card p-3 text-center h-100",children:[e.jsx("div",{className:"highlight-icon fs-1 mb-2",children:a.icon}),e.jsx("p",{className:"mb-0 fw-medium",children:a.text})]})},i))})}),e.jsx("div",{className:"container-fluid",children:e.jsxs("div",{className:"row",children:[e.jsx("div",{className:"col-lg-9",children:e.jsxs("div",{className:"container my-5 py-4",children:[e.jsxs("div",{className:"section-header mb-5 text-center",children:[e.jsx("h2",{className:"display-5 fw-bold",children:"Your Curated Itinerary"}),e.jsx("p",{className:"lead",children:"Every Hour Planned for Maximum Enjoyment"}),e.jsx("div",{className:"header-divider"})]}),d?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):e.jsx("div",{className:"itinerary-timeline",children:o.itinerary?.map((a,i)=>e.jsxs("div",{className:"timeline-day",children:[e.jsx("div",{className:"timeline-badge",children:e.jsx("span",{className:"day-icon",children:a.icon})}),e.jsxs("div",{className:"timeline-content",children:[e.jsx("h3",{children:a.day}),e.jsx("ul",{className:"activity-list",children:a.activities.map((r,l)=>{const[s,h]=r.split(" - ");return e.jsxs("li",{children:[e.jsx("span",{className:"activity-time",children:s}),e.jsx("span",{className:"activity-desc",children:h})]},l)})})]})]},i))})]})}),e.jsx("div",{className:"col-lg-3",style:f.categoryPanel,children:e.jsx("div",{className:"category-sidebar",children:e.jsxs("div",{className:"category-panel p-4 sticky-top",children:[e.jsx("h4",{className:"mb-4",children:"Package Duration"}),e.jsx("ul",{className:"category-list",children:b.map(a=>e.jsxs("li",{className:n===a.id?"active":"",onClick:()=>q(a.id),children:[a.name,n===a.id&&e.jsx("span",{className:"category-badge",children:"Most Popular"})]},a.id))}),e.jsxs("div",{className:"category-info mt-4",children:[e.jsx("p",{children:"Select duration to see itinerary and pricing details."}),e.jsx("button",{className:"btn btn-outline-primary w-100 mt-2 text-dark border border-3 border-primary",onClick:G,children:"Compare All"})]})]})})})]})}),e.jsxs("div",{className:"container-fluid px-0 my-5",children:[e.jsxs("div",{className:"section-header mb-5 text-center",children:[e.jsx("h2",{className:"display-5 fw-bold",children:"Visual Journey"}),e.jsx("p",{className:"lead",children:"Moments You'll Cherish Forever"})]}),d?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):e.jsx("div",{className:"row g-0",children:o.gallery?.map((a,i)=>e.jsx("div",{className:"col-md-4 col-6",children:e.jsxs("div",{className:"gallery-item",children:[e.jsx("img",{src:a.img||`https://via.placeholder.com/800x600?text=Goa+${i+1}`,alt:a.caption||`Gallery image ${i+1}`,className:"img-fluid",loading:"lazy"}),e.jsx("div",{className:"gallery-caption",children:e.jsx("p",{children:a.caption||`Image ${i+1}`})})]})},i))})]}),e.jsx("div",{className:"container my-5 py-5",children:d?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):e.jsx("div",{className:"pricing-card p-5 rounded-4 shadow-lg",children:e.jsxs("div",{className:"row align-items-center",children:[e.jsxs("div",{className:"col-lg-7",children:[e.jsx("h2",{className:"display-5 fw-bold mb-3",children:"Ready to Experience Manali?"}),e.jsxs("p",{className:"lead mb-4",children:["Limited slots available for our premium"," ",b.find(a=>a.id===n)?.name," package"]}),e.jsx("ul",{className:"package-features",children:o.highlights?.slice(0,4).map((a,i)=>e.jsxs("li",{children:["✅ ",a.text]},i))})]}),e.jsx("div",{className:"col-lg-5",children:e.jsxs("div",{className:"price-box text-center p-4",children:[e.jsxs("div",{className:"price-original text-decoration-line-through",children:[c.currency||"₹",c.original||"--"]}),e.jsxs("div",{className:"price-discounted display-4 fw-bold",children:[c.currency||"₹",c.discounted||"--"]}),e.jsx("div",{className:"price-note mb-3",children:"Per person (Double occupancy)"}),e.jsx("button",{className:"btn btn-primary btn-lg w-100 mb-2",onClick:y,children:"Book Now"}),e.jsx("div",{className:"d-flex justify-content-center gap-3",children:e.jsx("span",{className:"badge",children:"Free Cancellation"})})]})})]})})}),e.jsxs("div",{className:"container my-5 py-4",children:[e.jsxs("div",{className:"section-header mb-5 text-center",children:[e.jsx("h2",{className:"display-5 fw-bold",children:"Traveler Stories"}),e.jsx("p",{className:"lead",children:"Don't just take our word for it"})]}),d?e.jsx("div",{className:"text-center py-5",children:e.jsx("div",{className:"spinner-border text-primary",role:"status",children:e.jsx("span",{className:"visually-hidden",children:"Loading..."})})}):e.jsx("div",{className:"row",children:o.testimonials?.map((a,i)=>e.jsx("div",{className:"col-md-6 mb-4",children:e.jsxs("div",{className:"testimonial-card h-100 p-4",children:[e.jsxs("div",{className:"testimonial-header mb-3",children:[e.jsx("span",{className:"testimonial-avatar fs-1",children:a.avatar||"👤"}),e.jsxs("div",{children:[e.jsxs("div",{className:"testimonial-rating",children:["★".repeat(a.rating||0),"☆".repeat(5-(a.rating||0))]}),e.jsx("div",{className:"testimonial-author",children:a.author||"Anonymous"})]})]}),e.jsxs("blockquote",{className:"testimonial-quote",children:['"',a.quote||"Great experience!",'"']})]})},i))})]}),e.jsx("div",{className:"container-fluid final-cta py-5 mb-0",children:e.jsxs("div",{className:"container text-center",children:[e.jsx("h2",{className:"display-5 fw-bold text-white mb-4",children:"Your Manali Adventure Awaits"}),e.jsx("p",{className:"lead text-white mb-5",children:"Limited slots available for next month. Reserve yours today!"}),e.jsxs("div",{className:"d-flex justify-content-center gap-3",children:[e.jsx("button",{className:"btn btn-light btn-lg px-5 fw-bold",onClick:y,children:"Book Now"}),I&&e.jsx("div",{style:f.alertOverlay,children:e.jsxs("div",{style:f.alertBox,children:[e.jsx("p",{children:"Please login first to book"}),e.jsx("button",{onClick:R,style:f.alertButton,children:"OK"})]})}),C&&e.jsx(B,{onClose:()=>x(!1),onLoginSuccess:z}),k&&e.jsx(D,{user:w,onClose:()=>p(!1)}),e.jsx("button",{className:"btn btn-outline-light ml-2 btn-lg px-5",children:"Get Brochure"})]})]})}),L&&e.jsxs("div",{className:"comparison-modal",children:[e.jsx("div",{className:"modal-overlay",onClick:v}),e.jsxs("div",{className:"modal-content",children:[e.jsxs("div",{className:"modal-header",children:[e.jsx("h3",{children:"Compare All Packages"}),e.jsx("button",{className:"close-btn",onClick:v,children:"×"})]}),e.jsx("div",{className:"modal-body",children:e.jsx("div",{className:"table-responsive comparison-table-container",children:e.jsxs("table",{className:"table comparison-table",children:[e.jsx("thead",{children:e.jsxs("tr",{children:[e.jsx("th",{className:"sticky-header",children:"Features"}),m.map((a,i)=>e.jsx("th",{className:"sticky-header",children:a.name||"Unknown Package"},i))]})}),e.jsxs("tbody",{children:[e.jsxs("tr",{children:[e.jsx("td",{children:"Price"}),m.map((a,i)=>e.jsx("td",{children:a.pricing?`${a.pricing.currency}${a.pricing.discounted}`:a.price?`₹${a.price}`:"-"},`${i}-price`))]}),e.jsxs("tr",{children:[e.jsx("td",{children:"Rating"}),m.map((a,i)=>e.jsx("td",{children:a.rating?`${a.rating} ★`:"-"},`${i}-rating`))]}),[...Array(Math.max(...m.map(a=>a.highlights?.length||0)))].map((a,i)=>e.jsxs("tr",{children:[e.jsx("td",{children:i===0?"Highlights":""}),m.map((r,l)=>e.jsx("td",{children:r.highlights?.[i]?`${r.highlights[i].text}`:"-"},`${l}-highlight-${i}`))]},`highlight-${i}`))]})]})})}),e.jsxs("div",{className:"modal-footer",children:[e.jsx("button",{className:"btn btn-primary",onClick:v,children:"Close"}),C&&e.jsx(B,{onClose:()=>x(!1),onLoginSuccess:z}),k&&e.jsx(D,{onClose:()=>p(!1)})]})]})]}),e.jsx("style",{jsx:!0,children:`
        /* Styles (exactly as you provided) */
        .goa-package {
          font-family: "Arial", sans-serif;
        }

        .hero-section {
          padding: 120px 0 100px;
          background: linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), 
           url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80');
          background-size: cover;
          background-position: center;
          position: relative;
        }

        .package-tag {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(255, 255, 255, 0.2);
          padding: 8px 16px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: bold;
        }

        .hero-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
        }

        .z-index-1 {
          z-index: 1;
        }

        .highlight-card {
          background: #f8f9fa;
          border-radius: 12px;
          transition: transform 0.3s ease;
          border: 1px solid #e9ecef;
        }

        .highlight-card:hover {
          transform: translateY(-5px);
        }

        .section-header {
          margin-bottom: 3rem;
        }

        .header-divider {
          width: 60px;
          height: 3px;
          background: linear-gradient(90deg, #667eea, #764ba2);
          margin: 0 auto;
          border-radius: 2px;
        }

        .itinerary-timeline {
          position: relative;
          padding-left: 2rem;
        }

        .timeline-day {
          position: relative;
          margin-bottom: 3rem;
          border-left: 2px solid #e9ecef;
          padding-left: 3rem;
        }

        .timeline-badge {
          position: absolute;
          left: -2rem;
          top: 0;
          width: 3rem;
          height: 3rem;
          background: linear-gradient(135deg, #667eea, #764ba2);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.5rem;
        }

        .timeline-content h3 {
          color: #333;
          font-weight: bold;
          margin-bottom: 1rem;
        }

        .activity-list {
          list-style: none;
          padding: 0;
        }

        .activity-list li {
          margin-bottom: 0.5rem;
          display: flex;
          align-items: flex-start;
        }

        .activity-time {
          font-weight: bold;
          color: #667eea;
          min-width: 120px;
          margin-right: 1rem;
        }

        .activity-desc {
          color: #666;
        }

        .category-sidebar {
          background: #f8f9fa;
          min-height: 100vh;
        }

        .category-panel {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }

        .category-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .category-list li {
          padding: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.5rem;
          position: relative;
        }

        .category-list li:hover {
          background: #f0f0f0;
        }

        .category-list li.active {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .category-badge {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 8px;
          border-radius: 10px;
          font-size: 0.7rem;
        }

        .gallery-item {
          position: relative;
          overflow: hidden;
          height: 250px;
        }

        .gallery-item img {
          transition: transform 0.5s ease;
          height: 100%;
          width: 100%;
          object-fit: cover;
        }

        .gallery-item:hover img {
          transform: scale(1.1);
        }

        .gallery-caption {
          position: absolute;
          bottom: -100%;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.7);
          color: white;
          padding: 15px;
          transition: bottom 0.3s ease;
        }

        .gallery-item:hover .gallery-caption {
          bottom: 0;
        }

        .pricing-card {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .price-box {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          backdrop-filter: blur(10px);
        }

        .price-original {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }

        .price-discounted {
          color: #ffd700;
        }

        .price-note {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.8);
        }

        .badge {
          background: rgba(255, 255, 255, 0.2);
          color: white;
          padding: 0.3rem 0.8rem;
          border-radius: 15px;
          font-size: 0.8rem;
        }

        .testimonial-card {
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 15px rgba(0,0,0,0.1);
          border: 1px solid #e9ecef;
        }

        .testimonial-header {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .testimonial-rating {
          color: #ffd700;
          font-size: 1.1rem;
        }

        .testimonial-author {
          font-weight: bold;
          color: #333;
        }

        .testimonial-quote {
          font-style: italic;
          color: #666;
          border-left: 3px solid #667eea;
          padding-left: 1rem;
          margin: 0;
        }

        .final-cta {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
        }

        .comparison-modal {
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          z-index: 1050;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.5);
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          max-width: 90vw;
          max-height: 80vh;
          position: relative;
          z-index: 1;
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          padding: 1.5rem;
          border-bottom: 1px solid #e9ecef;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .modal-body {
          padding: 1.5rem;
          overflow: auto;
          flex: 1;
        }

        .comparison-table-container {
          max-height: 400px;
        }

        .comparison-table th.sticky-header {
          position: sticky;
          top: 0;
          background: #f8f9fa;
          z-index: 10;
        }

        .comparison-table td, .comparison-table th {
          padding: 1rem;
          text-align: center;
          border: 1px solid #e9ecef;
        }

        .modal-footer {
          padding: 1.5rem;
          border-top: 1px solid #e9ecef;
          text-align: right;
        }

        .package-features {
          list-style: none;
          padding: 0;
        }

        .package-features li {
          margin-bottom: 0.5rem;
          color: rgba(255, 255, 255, 0.9);
        }
      `})]})}export{V as default};
