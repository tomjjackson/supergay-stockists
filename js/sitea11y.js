/*SG site a11y + speed pass (Nov 2026). Remove this script to undo.
  1. Visible keyboard focus ring.
  2. Pink text one shade darker (#C2405C) so it passes 4.5:1; small text on pink gets the darker fill. Hover states untouched.
  3. Small links (Learn more, Privacy, Terms, Your Privacy Choices) get a 44px tap area without moving the layout.
  4. Links that pointed to "#" go somewhere real.
  5. Videos play only while on screen; paused for reduced-motion visitors.
  6. Skip-to-content link.*/
(function(){
  var PINK='rgb(203, 74, 102)', DARK='#C2405C';
  var s=document.createElement('style');
  s.textContent=
    'a:focus-visible,button:focus-visible,input:focus-visible,select:focus-visible,textarea:focus-visible,[role=button]:focus-visible,[tabindex]:focus-visible{outline:2px solid #353330!important;outline-offset:3px!important;box-shadow:0 0 0 5px #FCF9EF!important}'+
    '.sg-pk:not(:hover):not(:focus-visible){color:'+DARK+'!important}'+
    '.sg-pkb:not(:hover):not(:focus-visible){background-color:'+DARK+'!important}'+
    '.link-22,.link-23,a.sg-pc-link,a[href="/privacy-policy"]:not(p a):not(li a),a[href="/terms"]:not(p a):not(li a){display:inline-block;padding-top:13px!important;padding-bottom:13px!important;margin-top:-13px!important;margin-bottom:-13px!important}'+
    '.sg-skip{position:fixed;left:12px;top:-60px;z-index:2147483647;background:#353330;color:#FCF9EF;font:600 14px/1 Generalsans,Arial,sans-serif;padding:14px 18px;border-radius:999px;text-decoration:none}.sg-skip:focus{top:12px}';
  document.head.appendChild(s);

  function txt(e){return (e.textContent||'').replace(/\s+/g,' ').trim()}
  function shade(){
    var all=document.querySelectorAll('body *');
    for(var i=0;i<all.length;i++){
      var e=all[i];
      if(e.classList.contains('sg-pk')||e.classList.contains('sg-pkb'))continue;
      var own=false,n=e.firstChild;
      for(;n;n=n.nextSibling)if(n.nodeType==3&&n.textContent.trim()){own=true;break}
      var c=getComputedStyle(e);
      if(own&&c.color==PINK)e.classList.add('sg-pk');
      if(c.backgroundColor==PINK&&txt(e)&&parseFloat(c.fontSize)<18.66&&e.querySelectorAll('*').length<12)e.classList.add('sg-pkb');
    }
  }
  var MAP=[[/^(handcrafted|organic|what we believe in|our story|about us)$/i,'/about-page'],[/^the distillery/i,'/about-page'],[/^supergay sips/i,'/cocktails'],[/^instagram/i,'https://www.instagram.com/supergayspirits/']];
  function links(){
    var a=document.querySelectorAll('a[href="#"],a[href$="supergayspirits.com/#"]');
    for(var i=0;i<a.length;i++){
      var el=a[i];
      if(el.hasAttribute('data-w-id')||/swiper-button/.test(el.className))continue;
      var t=txt(el),to=null;
      for(var j=0;j<MAP.length;j++)if(MAP[j][0].test(t)){to=MAP[j][1];break}
      if(!to&&/circle-container|button-18/.test(el.className)){
        var card=el.closest('.feature-card-front,[class*="swiper-slide"],.w-dyn-item');
        var real=card&&card.querySelector('a[href^="/product"],a[href^="/shop"]');
        if(real)to=real.getAttribute('href');
      }
      if(to){el.setAttribute('href',to);if(/^https?:/.test(to)){el.target='_blank';el.rel='noopener'}}
    }
  }
  function videos(){
    var v=document.querySelectorAll('video');
    var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
    if(!('IntersectionObserver' in window))return;function near(el){var r=el.getBoundingClientRect();return r.width>0&&r.bottom>-200&&r.top<innerHeight+200}
    var io=new IntersectionObserver(function(es){es.forEach(function(x){var el=x.target;el.__sgon=x.isIntersecting&&!reduce;if(el.__sgon){var p=el.play();if(p&&p.catch)p.catch(function(){})}else el.pause()})},{rootMargin:'200px 0px'});
    for(var i=0;i<v.length;i++){if(v[i].__sgv)continue;v[i].__sgv=1;if(!v[i].autoplay&&!v[i].hasAttribute('autoplay'))continue;v[i].__sgon=false;['play','playing','timeupdate'].forEach(function(ev){v[i].addEventListener(ev,function(){if(!this.paused&&(reduce||!near(this)))this.pause()})});if(!reduce&&near(v[i])){var q=v[i].play();if(q&&q.catch)q.catch(function(){})}io.observe(v[i])}
  }
  function skip(){
    if(document.querySelector('.sg-skip'))return;
    var tgt=document.querySelector('.hero-section')||document.querySelector('body>section,body>.section')||document.querySelector('h1');
    if(!tgt)return;
    if(!tgt.id)tgt.id='sg-main';
    if(!tgt.hasAttribute('tabindex'))tgt.setAttribute('tabindex','-1');
    var k=document.createElement('a');k.className='sg-skip';k.href='#'+tgt.id;k.textContent='Skip to content';
    document.body.insertBefore(k,document.body.firstChild);
  }
  function run(){shade();links();videos();skip()}
  if(document.readyState=='loading')document.addEventListener('DOMContentLoaded',run);else run();
  addEventListener('load',run);setTimeout(run,2500);
})();
