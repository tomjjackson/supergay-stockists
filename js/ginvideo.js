/*SG gin page: captioned Fire Island martini video as slide 2 (after the bottle) in the top gallery, desktop and phone sliders. Muted, plays when its slide is showing. Remove this script to undo.*/
(function(){
var V='https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@ccab6cc253cd/img/home/gin-martini-vertical';
function run(){
 var sliders=[].slice.call(document.querySelectorAll('.slider-8.w-slider'),0,2),added=0;
 sliders.forEach(function(sl){
  var mask=sl.querySelector('.w-slider-mask');if(!mask||mask.querySelector('.sg-gin-vid'))return;
  var first=mask.querySelector('.w-slide');if(!first)return;
  var s=document.createElement('div');s.className='w-slide sg-gin-vid';s.style.cssText='background:#000;overflow:hidden';
  s.innerHTML='<video muted playsinline loop preload="none" poster="'+V+'-poster.jpg" src="'+V+'.mp4" style="width:100%;height:100%;object-fit:cover;display:block" aria-label="How to make a Fire Island Martini with Supergay Fire Island Dry Gin. Captioned."></video>';
  first.parentNode.insertBefore(s,first.nextSibling);added++;
  var v=s.querySelector('video');
  function sync(){var r=s.getBoundingClientRect(),m=mask.getBoundingClientRect(),on=s.getAttribute('aria-hidden')!=='true'&&r.width>0&&Math.abs(r.left-m.left)<5;if(on){if(v.paused){v.preload='auto';var p=v.play();p&&p.catch&&p.catch(function(){})}}else if(!v.paused)v.pause()}
  new MutationObserver(function(){setTimeout(sync,600)}).observe(s,{attributes:true,attributeFilter:['aria-hidden','style']});
  addEventListener('resize',sync);
 });
 if(added&&window.Webflow&&Webflow.require){try{Webflow.require('slider').ready()}catch(e){}}
}
if(document.readyState==='complete')run();else addEventListener('load',run);
})();
