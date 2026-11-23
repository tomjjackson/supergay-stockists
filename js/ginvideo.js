/*SG gin page: captioned Fire Island martini video as slide 2 (after the bottle) in the top gallery, desktop and phone sliders (desktop cut has captions higher so they show above the fold). Muted, plays when its slide is showing. Remove this script to undo.*/
(function(){
/* ingredients slide: anchor right so the ingredient list never crops at any desktop size */
var st=document.createElement('style');st.textContent='.slider-8 .sg-product-page-gin3{background-position:100% 50%!important}.desktop-product-section1 .product-right-sides{align-self:start!important;padding-top:var(--sg-pt,110px)!important}.desktop-product-section1 .slider-8,.desktop-product-section1 .slider-8 .w-slider-mask,.desktop-product-section1 .slider-8 .w-slide{height:min(var(--sg-sh,100vh),88.9vw)!important;min-height:0!important}.desktop-product-section1 .slider-8 .sg-gin-vid{background:#FCF9EF!important}.desktop-product-section1 .slider-8 .sg-gin-vid video{object-fit:contain!important}';document.head.appendChild(st);
/* product info column: top-aligned under the fixed header instead of sitting at the bottom of the tall gallery */
function pad(){var n=[].find.call(document.querySelectorAll('.w-nav'),function(x){return x.offsetHeight>0}),c=document.querySelector('.desktop-product-section1 .product-right-sides');if(!n||!c)return;var b=n.getBoundingClientRect().bottom,t=c.parentNode.getBoundingClientRect().top;document.documentElement.style.setProperty('--sg-pt',Math.max(40,Math.round(b-t+48))+'px')}
/* desktop gallery: fit the screen so the dots and arrows show */
function fit(){var g=document.querySelector('.desktop-product-section1 .slider-8');if(!g)return;var t=g.getBoundingClientRect().top+scrollY;document.documentElement.style.setProperty('--sg-sh',Math.max(480,Math.round(innerHeight-t))+'px')}
addEventListener('resize',function(){fit()});
addEventListener('resize',pad);document.addEventListener('DOMContentLoaded',function(){fit();pad()});
var B='https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@127d2fbb1cc5/img/home/gin-martini-',FILES=['desktop','vertical'];
function run(){
 var sliders=[].slice.call(document.querySelectorAll('.slider-8.w-slider'),0,2),added=0;
 sliders.forEach(function(sl,k){var V=B+FILES[k];
  var mask=sl.querySelector('.w-slider-mask');if(!mask||mask.querySelector('.sg-gin-vid'))return;
  var first=mask.querySelector('.w-slide');if(!first)return;
  var s=document.createElement('div');s.className='w-slide sg-gin-vid';s.style.cssText='background:#000;overflow:hidden';
  s.innerHTML='<video muted playsinline loop preload="none" poster="'+V+'-poster.jpg" src="'+V+'.mp4" style="width:100%;height:100%;object-fit:cover;display:block" aria-label="How to make a Fire Island Martini with Supergay Fire Island Dry Gin. Captioned."></video>';
  first.parentNode.insertBefore(s,first.nextSibling);added++;
  var v=s.querySelector('video');
  function sync(){var on=s.getAttribute('aria-hidden')!=='true'&&s.offsetWidth>0&&sl.querySelectorAll('.w-slider-dot').length>0;if(on){if(v.paused){v.preload='auto';var p=v.play();p&&p.catch&&p.catch(function(){})}}else if(!v.paused)v.pause()}
  new MutationObserver(function(){setTimeout(sync,50);setTimeout(sync,700)}).observe(s,{attributes:true,attributeFilter:['aria-hidden','style']});
  addEventListener('resize',sync);
 });
 if(added&&window.Webflow&&Webflow.require){try{var S=Webflow.require('slider');S.ready();S.redraw()}catch(e){}[100,700].forEach(function(d){setTimeout(function(){dispatchEvent(new Event('resize'))},d)})}
}
if(document.readyState==='complete'){fit();pad();run()}else addEventListener('load',function(){fit();pad();run()});
})();
