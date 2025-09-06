// --- helper: dynamic loader ---
function load(src){return new Promise((res,rej)=>{const s=document.createElement('script');s.src=src;s.onload=res;s.onerror=rej;document.head.appendChild(s);});}

// --- 0) Background hue + progress (vanilla, always on) ---
(function setupHueAndProgress(){
  const d=document.documentElement,b=document.body,bar=document.getElementById('scroll-progress');
  function fx(){
    const sc=d.scrollTop||b.scrollTop, max=(d.scrollHeight-d.clientHeight)||1;
    const hue=Math.round(270+(sc/max)*120);
    d.style.setProperty('--hue',hue);
    if(bar) bar.style.width=(sc/max*100)+'%';
  }
  fx();
  document.addEventListener('scroll',fx,{passive:true});
})();

// --- 1) Try to load Lenis + GSAP + ScrollTrigger ---
(async function setupFancy(){
  try{
    await load('https://cdn.jsdelivr.net/npm/@studio-freight/lenis@1.0.38/bundled/lenis.min.js');
    await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js');
    await load('https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js');

    // Smooth scroll
    const lenis = new window.Lenis({ smoothWheel:true, lerp:0.12 });
    function raf(t){ lenis.raf(t); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Reveal-on-scroll with GSAP
    // (If you already have .reveal CSS, this gives nicer timing + viewport control)
    // eslint-disable-next-line no-undef
    gsap.registerPlugin(ScrollTrigger);
    // eslint-disable-next-line no-undef
    gsap.utils.toArray('[data-animate]').forEach((el)=>{
      // eslint-disable-next-line no-undef
      gsap.fromTo(el,
        { autoAlpha:0, y:24 },
        { autoAlpha:1, y:0, ease:'power3.out', duration:0.8,
          scrollTrigger:{ trigger:el, start:'top 85%' } }
      );
    });

    // Parallax drift on marked elements
    // eslint-disable-next-line no-undef
    gsap.utils.toArray('[data-parallax]').forEach((el)=>{
      // eslint-disable-next-line no-undef
      gsap.to(el,{
        yPercent:-10, ease:'none',
        scrollTrigger:{ trigger:el, start:'top bottom', end:'bottom top', scrub:true }
      });
    });

  } catch {
    // --- 2) Fallback: pure-vanilla reveal + parallax (no CDNs needed) ---
    // Reveal:
    if('IntersectionObserver' in window){
      const io=new IntersectionObserver((ents)=>{
        for(const e of ents) if(e.isIntersecting){ e.target.classList.add('reveal'); io.unobserve(e.target); }
      },{rootMargin:'0px 0px -15% 0px', threshold:0.01});
      document.querySelectorAll('[data-animate]').forEach(el=>io.observe(el));
    } else {
      document.querySelectorAll('[data-animate]').forEach(el=>el.classList.add('reveal'));
    }
    // Parallax:
    const els=[...document.querySelectorAll('[data-parallax]')];
    function par(){
      const vh=window.innerHeight||1;
      for(const el of els){
        const r=el.getBoundingClientRect(); const p=(r.top/vh); const y=(-10*(1-p));
        el.style.transform=`translateY(${y}%)`;
      }
      requestAnimationFrame(par);
    }
    requestAnimationFrame(par);
  }

  // --- 3) Magnetic buttons (works in both paths, pointer devices only) ---
  if (matchMedia && matchMedia('(pointer:fine)').matches) {
    document.querySelectorAll('.magnet').forEach(btn=>{
      const inner=btn.querySelector('span')||btn;
      btn.addEventListener('mousemove',(e)=>{
        const r=btn.getBoundingClientRect();
        const x=(e.clientX-(r.left+r.width/2))*0.15;
        const y=(e.clientY-(r.top+r.height/2))*0.15;
        inner.style.transform=`translate(${x}px,${y}px)`;
      });
      btn.addEventListener('mouseleave',()=>{ inner.style.transform='translate(0,0)'; });
    });
  }
})();
