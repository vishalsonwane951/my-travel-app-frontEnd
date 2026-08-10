import React, { useRef } from "react";

 function Carousel({ children }) {
  const ref = useRef();
  const scroll = (dx) => ref.current?.scrollBy({ left: dx, behavior: "smooth" });
  return (
    <div style={{ position:"relative" }}>
      <button style={styles.left} onClick={() => scroll(-320)}>‹</button>
      <div ref={ref} style={styles.row}>{children}</div>
      <button style={styles.right} onClick={() => scroll(320)}>›</button>
    </div>
  );
}

const nav = { position:"absolute", top:"45%", transform:"translateY(-50%)", zIndex:2, border:"none", background:"#fff", boxShadow:"0 4px 12px rgba(0,0,0,.12)", borderRadius:"50%", width:36, height:36, cursor:"pointer", fontSize:18, fontWeight:800 };
const styles = {
  row: { display:"flex", gap:16, overflowX:"auto", scrollBehavior:"smooth", padding:"10px 44px" },
  left: { ...nav, left:0 },
  right: { ...nav, right:0 }
};

export default Carousel;
