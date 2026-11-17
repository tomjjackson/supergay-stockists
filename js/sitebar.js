/*SG: top bar, $150 banner, rename, live review counts from on-page reviews. Remove to undo.*/
!function(){var e=document.querySelector("a.div-block-569");e&&((e.querySelector(".text-block-54")||e).textContent="The holiday Gift Box is here",e.setAttribute("href","/product-page-supergay-gift-box"));[].forEach.call(document.querySelectorAll("div.div-block-569 .text-block-54"),(function(e){e.textContent=e.textContent.replace("$100","$150")}));for(var t,r=document.createTreeWalker(document.body,4);t=r.nextNode();)t.nodeValue.indexOf("Supergay (Vodka Gift Wrapped)")>-1&&(t.nodeValue=t.nodeValue.replace("Supergay (Vodka Gift Wrapped)","Supergay Gift-Wrapped Vodka"));var o=document.querySelectorAll(".text-span-111");if(o.length){var n="  ",a=0,l=function(){var e=0,t=0;[].forEach.call(document.querySelectorAll(".hims-reviews-card"),(function(r){var o=((r.querySelector(".hims-review-text")||{}).textContent||"").trim();/^[A-Za-z]{8,}$/.test(o)&&/[a-z][A-Z]/.test(o)?r.style.display="none":(e++,t+=r.querySelectorAll(".reviews-section-star.filled").length)}));var r=document.querySelector(".hims-review-count");r&&e&&r.textContent!=e&&(r.textContent=e);var a=e?"★  "+(t/e).toFixed(1)+"  |"+n+e+n+(1==e?"Review":"Reviews"):"Be the first to review";[].forEach.call(o,(function(e){e.textContent!=a&&(e.textContent=a)}))},c=setInterval((function(){l(),++a>20&&clearInterval(c)}),500),i=document.querySelector(".hims-reviews-div");i&&new MutationObserver(l).observe(i,{childList:!0,subtree:!0})}}();
/*SG: desktop holiday banner, two rotating lines, sits above the nav at the top of the page and scrolls away with it. Remove this block to undo.*/
(function(){if(document.getElementById('sg-hb'))return;var H=32,M=[['Make it a Supergay Festive Season. <u>Shop Gifts</u>','/shop-all-bundles'],['Gift Wrapped Supergay? <u>Well, yes!</u>','/product-page-supergay-vodka-gift-wrapped']];var s=document.createElement('style');s.textContent='#sg-hb{display:none}@media (min-width:992px){#sg-hb{display:block;position:absolute;top:0;left:0;right:0;height:'+H+'px;z-index:2147483000;background:#CB4A66;overflow:hidden}#sg-hb a{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;color:#FCF9EF;font:500 15px/1 Testfeijoa,Georgia,serif;letter-spacing:0;text-decoration:none;opacity:0;transform:translateY(10px);transition:opacity .6s,transform .6s;pointer-events:none}#sg-hb a.on{opacity:1;transform:none;pointer-events:auto}#sg-hb u{text-underline-offset:3px;margin-left:.5em}html body{padding-top:'+H+'px!important}html body .sg-hb-push{top:var(--sghb,'+H+'px)!important}html body .accelpay-icon-buttons{margin-top:var(--sghb,'+H+'px)}}';document.head.appendChild(s);var b=document.createElement('div');b.id='sg-hb';b.setAttribute('role','region');b.setAttribute('aria-label','Announcements');M.forEach(function(m,i){var a=document.createElement('a');a.href=m[1];a.innerHTML=m[0];if(!i)a.className='on';b.appendChild(a)});document.body.insertBefore(b,document.body.firstChild);var i=0,L=b.children;setInterval(function(){if(document.hidden)return;L[i].className='';i=(i+1)%L.length;L[i].className='on'},4500);function push(){if(innerWidth<992)return;[].forEach.call(document.querySelectorAll('body>*,body>*>*,.w-nav,[class*=nav]'),function(e){if(e.id=='sg-hb'||e.closest('#sg-hb')||e.classList.contains('sg-hb-push'))return;var c=getComputedStyle(e);if(c.position!='fixed')return;var r=e.getBoundingClientRect();if(parseFloat(c.top)===0&&r.top<=1&&r.height>20&&r.height<160)e.classList.add('sg-hb-push')})}function off(){document.documentElement.style.setProperty('--sghb',Math.max(0,H-(scrollY||0))+'px')}off();addEventListener('scroll',off,{passive:true});push();addEventListener('load',push);setTimeout(push,1500);})();
/*SG: while the desktop menu is open, page Add to Cart buttons (AccelPay sets z-index 1000) stay under it.*/
(function(){var s=document.createElement('style');s.textContent='html:has(.sg-mega.is-on) body .accelpay-btn{z-index:auto!important}';document.head.appendChild(s)})();
/*SG: desktop menu product card (photo + name) opens the product it shows.*/
(function(){function link(){var c=document.querySelector('.sg-mega .sg-mega-card [data-card-name]');if(!c)return null;var n=c.textContent.trim(),a=document.querySelectorAll('.sg-mega a[data-name]');for(var i=0;i<a.length;i++)if(a[i].getAttribute('data-name')==n)return a[i].getAttribute('href');return null}var s=document.createElement('style');s.textContent='html body .sg-mega .sg-mega-card{cursor:pointer}';document.head.appendChild(s);document.addEventListener('click',function(e){var f=e.target.closest&&e.target.closest('.sg-mega .sg-mega-card');if(!f)return;var h=link();if(h){e.preventDefault();if(e.metaKey||e.ctrlKey)open(h,'_blank');else location.href=h}});document.addEventListener('keydown',function(e){if((e.key=='Enter'||e.key==' ')&&e.target.classList&&e.target.classList.contains('sg-mega-card')){var h=link();if(h){e.preventDefault();location.href=h}}});function a11y(){var f=document.querySelector('.sg-mega .sg-mega-card');if(f&&!f.hasAttribute('tabindex')){f.setAttribute('tabindex','0');f.setAttribute('role','link')}}a11y();addEventListener('load',a11y)})();
/*SG: "Your Privacy Choices" link in every footer + opt-out panel. Saving sets the sgOptOut cookie for a year; a Global Privacy Control signal counts as an opt-out; the optgate head script reads it on every page.*/
(function(){var K='sgOptOut',gpc=function(){return navigator.globalPrivacyControl===true},on=function(){return gpc()||/(^|;\s*)sgOptOut=1/.test(document.cookie)};var s=document.createElement('style');s.textContent='.sg-pc-link{cursor:pointer}#sg-pc{position:fixed;inset:0;z-index:2147483600;display:none;align-items:center;justify-content:center;background:rgba(53,51,48,.45);padding:16px}#sg-pc.on{display:flex}#sg-pc .b{background:#FCF9EF;color:#353330;max-width:460px;width:100%;border:1.5px dashed #353330;border-radius:18px;padding:28px 26px;font:500 16px/1.45 Testfeijoa,Georgia,serif;box-sizing:border-box}#sg-pc h2{font:700 22px/1.1 Generalsans,Arial,sans-serif;text-transform:uppercase;margin:0 0 12px;letter-spacing:.2px}#sg-pc p{margin:0 0 14px}#sg-pc label{display:flex;gap:10px;align-items:flex-start;margin:6px 0 18px;cursor:pointer}#sg-pc input{width:18px;height:18px;margin-top:3px;accent-color:#CB4A66;flex:none}#sg-pc .r{display:flex;gap:10px;flex-wrap:wrap;align-items:center}#sg-pc button{font:500 14px/1 Generalsans,Arial,sans-serif;letter-spacing:1px;text-transform:uppercase;border:1px solid #353330;border-radius:40px;padding:12px 22px;cursor:pointer;background:#fff;color:#CB4A66}#sg-pc button.p{background:#CB4A66;color:#FCF9EF;border-color:#CB4A66}#sg-pc a{color:#CB4A66}#sg-pc .x{font:500 13px/1.4 Generalsans,Arial,sans-serif;opacity:.75;margin:14px 0 0}.sg-pc-row{text-align:center;padding:18px 16px 26px;font:500 12px/1.4 Generalsans,Arial,sans-serif;letter-spacing:1px;text-transform:uppercase}.sg-pc-row a{color:inherit;margin:0 10px}';document.head.appendChild(s);var m=document.createElement('div');m.id='sg-pc';m.setAttribute('role','dialog');m.setAttribute('aria-modal','true');m.setAttribute('aria-labelledby','sg-pc-h');m.innerHTML='<div class="b"><h2 id="sg-pc-h">Your Privacy Choices</h2><p>We use analytics and marketing tools to understand visits and reach people who might like Supergay. Some state privacy laws treat this as selling or sharing personal information.</p><label><input type="checkbox" id="sg-pc-c"><span>Opt out of the sale or sharing of my personal information in this browser.</span></label><div class="r"><button type="button" class="p" id="sg-pc-s">Save</button><button type="button" id="sg-pc-n">Cancel</button></div><p class="x" id="sg-pc-g" hidden>Your browser sends a Global Privacy Control signal, so you are already opted out here.</p><p class="x">Your choice is saved in this browser only. Opting out does not unsubscribe you from emails or texts. See our <a href="/privacy-policy">Privacy Policy</a>.</p></div>';function open(e){e&&e.preventDefault();var c=document.getElementById('sg-pc-c');c.checked=on();c.disabled=gpc();document.getElementById('sg-pc-g').hidden=!gpc();m.classList.add('on');document.getElementById('sg-pc-c').focus()}function close(){m.classList.remove('on')}function mk(){var a=document.createElement('a');a.href='#privacy-choices';a.className='sg-pc-link';a.textContent='Your Privacy Choices';a.addEventListener('click',open);return a}function place(fin){var p=document.querySelectorAll('a[href="/privacy-policy"]'),done=0;[].forEach.call(p,function(x){if(x.closest('#sg-pc,.sg-mega,.sg-pc-row'))return;done=1;if(x.nextSibling&&x.nextSibling.classList&&x.nextSibling.classList.contains('sg-pc-link'))return;var a=mk();a.className=x.className+' sg-pc-link';x.parentNode.insertBefore(a,x.nextSibling)});if(!done&&fin&&!document.querySelector('.sg-pc-row')){var r=document.createElement('div');r.className='sg-pc-row';r.innerHTML='<a href="/privacy-policy">Privacy Policy</a><a href="/terms">Terms</a>';r.appendChild(mk());document.body.appendChild(r)}}function init(){document.body.appendChild(m);m.addEventListener('click',function(e){if(e.target===m)close()});document.getElementById('sg-pc-n').addEventListener('click',close);document.getElementById('sg-pc-s').addEventListener('click',function(){var c=document.getElementById('sg-pc-c').checked;document.cookie=K+'='+(c?'1;max-age=31536000':';max-age=0')+';path=/;SameSite=Lax';close();location.reload()});document.addEventListener('keydown',function(e){if(e.key=='Escape')close()});place();setTimeout(function(){place(1)},1500);if(location.hash=='#privacy-choices')open()}if(document.body)init();else document.addEventListener('DOMContentLoaded',init)})();
/*SG: sticky Build Your Own box sits below the fixed menu bar instead of under it (all nav variants). Also: Chili Mango shop card first photo = the product page's first photo. (Moved here from the byostickytop script, Nov 2026.)*/
(function(){var s=document.createElement('style');s.textContent='@media (max-width:1100px){html body .byob-mini.is-open{top:calc(var(--sg-navb,0px) + 8px)!important}}html body a[href*="chili-mango"] .tf-main-image-chili-mango{background-image:url(https://cdn.prod.website-files.com/673cc17624930ee75a6e01c1/6ac3b5e784611b56986f9b6b_chili_mango_matched_to_cosmo_espresso.jpg)!important;background-size:cover!important;background-position:50% 50%!important}';document.head.appendChild(s);var busy=false;
function set(){busy=false;var m=0;[].forEach.call(document.querySelectorAll('.sg-mnav,.w-nav,[class*="nav-main"]'),function(n){var c=getComputedStyle(n);if(c.display=='none'||(c.position!='fixed'&&c.position!='sticky'))return;var r=n.getBoundingClientRect();if(r.height&&r.height<200&&r.top<=1&&r.bottom>0)m=Math.max(m,r.bottom)});document.documentElement.style.setProperty('--sg-navb',Math.round(m)+'px')}
function q(){if(!busy){busy=true;requestAnimationFrame(set)}}addEventListener('scroll',q,{passive:true});addEventListener('resize',q);addEventListener('load',q);q()})();

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
    if(!('IntersectionObserver' in window))return;
    var io=new IntersectionObserver(function(es){es.forEach(function(x){var el=x.target;el.__sgon=x.isIntersecting&&!reduce;if(el.__sgon){var p=el.play();if(p&&p.catch)p.catch(function(){})}else el.pause()})},{rootMargin:'200px 0px'});
    for(var i=0;i<v.length;i++){if(v[i].__sgv)continue;v[i].__sgv=1;if(!v[i].autoplay&&!v[i].hasAttribute('autoplay'))continue;v[i].__sgon=false;v[i].addEventListener('play',function(){if(!this.__sgon)this.pause()});io.observe(v[i])}
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
