/*SG home (replaces inline homesliderheight 1.4.4, same code) + highlight slideshow rebuilt with a desktop-only holiday slide and a Fire Island gin video slide.
  Video slide (all sizes): muted captioned martini video. Auto-advance waits on it and moves on when the video ends.
  Holiday slide (desktop, 992px+): first slide, its photo and button scroll down to the "Holiday gifts" section (.sgg).
  The old slideshow built in the page head code is removed and rebuilt here with the same markup and classes. Remove this script to undo.*/
(function(){
var s=document.createElement('style');s.textContent='@media(min-width:992px){html body>.section-10 .w-slider,html body>.section-10 .w-slider-mask,html body>.section-10 .w-slide,html body>.section-10 .w-slide>a,html body>.section-3-copy .w-slider,html body>.section-3-copy .w-slider-mask,html body>.section-3-copy .w-slide,html body>.section-3-copy .w-slide>a{height:min(78vh,713px)!important;min-height:0!important}html body>.section-10 .div-block-524{height:auto!important}html body>.section-3-copy .w-slide>a{background-position:50% 30%!important}html body>.section-3-copy .w-slider-mask>.w-slide:nth-child(-n+2)>a{background-position:50% 48%!important}}.sg-mh{display:none}@media(max-width:767px){.hero-section{position:relative}.sg-mh{display:flex;position:absolute;left:0;right:0;top:120px;z-index:6;flex-direction:column;align-items:center;gap:18px;pointer-events:none}.sg-mh h2{margin:0;text-align:center;font:500 min(34px,9vw)/1.05 Testfeijoa,Georgia,serif;letter-spacing:-.5px;color:#FCF9EF;text-shadow:0 2px 18px rgba(0,0,0,.35)}.sg-mh a{pointer-events:auto;display:block;padding:12px 32px;border:2px solid #353330;border-radius:999px;background:#FCF9EF;color:#CB4A66;font:500 18px/1 Generalsans,Arial,sans-serif;text-transform:uppercase;text-decoration:none}}';document.head.appendChild(s);

function toGifts(e){var g=document.querySelector('.sgg');if(!g)return;e.preventDefault();var n=document.querySelector('.nav-main,.navbar-2-copy'),o=n&&n.offsetHeight?n.getBoundingClientRect().height+12:90;scrollTo({top:g.getBoundingClientRect().top+scrollY-o,behavior:'smooth'})}

/* phone hero headline */
function hero(){var h=document.querySelector('body>.hero-section');if(h&&!h.querySelector('.sg-mh')){var m=document.createElement('div');m.className='sg-mh';m.innerHTML='<h2>Happy Holigays!</h2><a href="/shop-all-bundles">Shop Gifts</a>';h.appendChild(m);m.querySelector('a').addEventListener('click',toGifts)}
var B='https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@c19c8f7d72b1/img/home/brooklyn-made',r=[].find.call(document.querySelectorAll('body>.container .button-row'),function(x){return /& cocktails|brooklyn-made/i.test(x.textContent)});if(!r)return;var w=r.querySelector('[data-video-urls]'),v=w&&w.querySelector('video');if(!v)return;w.setAttribute('data-video-urls',B+'.mp4');w.setAttribute('data-poster-url',B+'-poster.jpg');v.style.backgroundImage='url("'+B+'-poster.jpg")';v.innerHTML='<source src="'+B+'.mp4" type="video/mp4">';v.load();var p=v.play();p&&p.catch&&p.catch(function(){})}

/* highlight slideshow */
var CDN='https://cdn.prod.website-files.com/673cc17624930ee75a6e01c1/';
var SLIDES=[
 {eyebrow:'Fire Island Dry Gin',title:'Make a Fire Island Martini. Sugar kelp gin from the waters of Fire Island.',btn:'Shop Fire Island Gin',href:'/product-page-supergay-fire-island-gin',video:'https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@be4c5e3bc1a5/img/home/gin-martini.mp4',img:'https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@be4c5e3bc1a5/img/home/gin-martini-poster.jpg'},
 {eyebrow:'Try them both',title:'Get the Duo. Try both vodka and gin.',btn:'Shop The Supergay Duo',href:'/product-page-the-supergay-duo',img:CDN+'68efebf65fd2b842c1a58419_The_Duo_Square-p-1080.jpeg'},
 {eyebrow:'Two Fruits Walk into a bar',title:'New! Chili Mango Spritz and Black Sesame Espresso Martini',btn:'Shop Two Fruits',href:'/shop-all-cans',img:CDN+'6ac3e6e58a34108b85d3602b_Two%20Fruits%20Cans%20%26%20Packaging_3317_715%20copy-p-1080.jpg'},
 {eyebrow:'Meet the Whole Family',title:'The Family Set, A Taste of Everything.',btn:'Shop the Set',href:'/product-page-the-family-set',img:CDN+'6ad61fd0ed230bbb1921849e_Supergay_New_Family-p-1080.png',pos:'50% 60%'},
 {eyebrow:'Fashion Forward',title:'Supergay Merch: Wear it with pride.',btn:'Shop Merch',href:'/shop-all-merch',img:CDN+'68eff4ecf0f9371047fd634a_Logo_Tee.jpg'}
];
if(window.matchMedia&&matchMedia('(min-width: 992px)').matches)SLIDES.unshift({eyebrow:'Holiday gifts',title:'Happy Holigays. Shop Supergay gifts.',btn:'Shop gifts',href:'#holiday-gifts',img:'https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@8c8eef320515/img/home/holiday-duo.jpg',gifts:1});
function esc(t){return String(t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')}
function build(){
 var anchor=document.querySelector('.div-block-40-copy');if(!anchor)return;
 var old=document.querySelector('.sg-slides');if(old&&old.__sg2)return;
 var el=document.createElement('section');el.className='sg-slides';el.__sg2=1;el.setAttribute('aria-label','Highlights');
 el.innerHTML='<div class="sg-slides-left"><div class="sg-slides-eyebrow"></div><h2 class="sg-slides-title"></h2><a class="sg-slides-btn" href="#"></a><div class="sg-slides-nav"><button type="button" class="sg-prev" aria-label="Previous">←</button><button type="button" class="sg-next" aria-label="Next">→</button></div><div class="sg-slides-dots">'+SLIDES.map(function(){return '<i></i>'}).join('')+'</div></div><div class="sg-slides-card"><div class="sg-slides-track">'+SLIDES.map(function(x,i){return '<a class="sg-slide" href="'+x.href+'"'+(x.gifts?' data-gifts="1"':'')+' aria-label="'+esc(x.title)+'">'+(x.video?'<video muted playsinline preload="none" poster="'+x.img+'" src="'+x.video+'" style="width:100%;height:100%;object-fit:cover;display:block"></video>':'<img src="'+x.img+'" alt="'+esc(x.title)+'"'+(x.pos?' style="object-position:'+x.pos+'"':'')+' loading="'+(i?'lazy':'eager')+'" draggable="false">')+'</a>'}).join('')+'</div></div>';
 if(old){old.parentNode.insertBefore(el,old);old.parentNode.removeChild(old)}else anchor.parentNode.insertBefore(el,anchor);
 var track=el.querySelector('.sg-slides-track'),eb=el.querySelector('.sg-slides-eyebrow'),ti=el.querySelector('.sg-slides-title'),btn=el.querySelector('.sg-slides-btn'),dots=el.querySelectorAll('.sg-slides-dots i'),i=0,ft=null;
 function setText(n){eb.textContent='✻ '+SLIDES[n].eyebrow+' ✻';ti.textContent=SLIDES[n].title;btn.textContent=SLIDES[n].btn;btn.setAttribute('href',SLIDES[n].href);for(var k=0;k<dots.length;k++)dots[k].className=k===n?'on':''}
 function vids(){[].forEach.call(track.querySelectorAll('video'),function(v){var on=v.parentNode===track.children[i];if(on){v.preload='auto';try{v.currentTime=0}catch(e){}var p=v.play();p&&p.catch&&p.catch(function(){})}else v.pause()})}
 function go(n,inst){n=(n+SLIDES.length)%SLIDES.length;i=n;setTimeout(vids,0);track.style.transform='translate3d('+(-100*n)+'%,0,0)';if(inst){setText(n);return}el.classList.add('is-fading');clearTimeout(ft);ft=setTimeout(function(){setText(n);el.classList.remove('is-fading')},180)}
 el.querySelector('.sg-prev').addEventListener('click',function(){go(i-1)});
 el.querySelector('.sg-next').addEventListener('click',function(e){if(!e.isTrusted&&SLIDES[i].video)return;go(i+1)});
 [].forEach.call(track.querySelectorAll('video'),function(v){v.addEventListener('ended',function(){go(i+1)})});
 btn.addEventListener('click',function(e){if(SLIDES[i].gifts)toGifts(e)});
 [].forEach.call(el.querySelectorAll('.sg-slide[data-gifts]'),function(a){a.addEventListener('click',toGifts)});
 var card=el.querySelector('.sg-slides-card'),sx=0,sy=0,dx=0,dr=false,w=1;
 card.addEventListener('touchstart',function(e){var t=e.touches[0];sx=t.clientX;sy=t.clientY;dx=0;dr=true;w=card.offsetWidth||1;track.style.transition='none'},{passive:true});
 card.addEventListener('touchmove',function(e){if(!dr)return;var t=e.touches[0],mx=t.clientX-sx,my=t.clientY-sy;if(Math.abs(my)>Math.abs(mx)&&Math.abs(mx)<8){dr=false;track.style.transition='';track.style.transform='translate3d('+(-100*i)+'%,0,0)';return}dx=mx;if(Math.abs(mx)>8)e.preventDefault();track.style.transform='translate3d(calc('+(-100*i)+'% + '+dx+'px),0,0)'},{passive:false});
 function end(){if(!dr)return;dr=false;track.style.transition='';if(dx<-w*.18)go(i+1);else if(dx>w*.18)go(i-1);else track.style.transform='translate3d('+(-100*i)+'%,0,0)';if(Math.abs(dx)>10){var b=function(ev){ev.preventDefault();ev.stopImmediatePropagation();card.removeEventListener('click',b,true)};card.addEventListener('click',b,true);setTimeout(function(){card.removeEventListener('click',b,true)},400)}dx=0}
 card.addEventListener('touchend',end);card.addEventListener('touchcancel',end);
 go(0,true);
}
function run(){hero();build()}
document.addEventListener('DOMContentLoaded',function(){setTimeout(run,0)});
})();
