/*SG about page: full-width video at the top of the page, under the header and above "Farm to disco.", with the page's ABOUT SUPERGAY SPIRITS eyebrow moved onto it. Muted autoplay loop with burned-in captions, no sound. Remove this script to undo.*/
(function(){
var V='https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@239dcb6b93c3/img/about/about-cc5';
var s=document.createElement('style');s.textContent='.sg-abv{position:relative;width:100%;height:min(56.25vw,var(--sg-avh,100vh));margin:0;border:0!important;border-radius:0!important;outline:0!important;overflow:hidden;background:#353330;container-type:inline-size}.sg-ab-hero.sg-abv-on{padding-top:var(--sg-ahp,63px)!important}.sg-ab-hero.sg-abv-on .sg-ab-wrap{margin-top:56px}.sg-abv video{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;display:block}.sg-abv:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.12),rgba(0,0,0,0) 30%);pointer-events:none}.sg-abv .sg-ab-eyebrow{display:block!important;position:absolute;left:24px;top:24px;z-index:2;margin:0!important;padding:.5em .85em;border-radius:999px;background:#FCF9EF;color:#CB4A66;font:700 clamp(11px,1.25cqw,15px)/1 Inconsolata,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;pointer-events:none}@media(max-width:767px){.sg-ab-hero.sg-abv-on .sg-ab-wrap{margin-top:32px}.sg-abv .sg-ab-eyebrow{left:12px;top:12px}}';document.head.appendChild(s);
function run(){
 var hero=document.querySelector('.sg-ab-hero'),w=hero&&hero.querySelector('.sg-ab-wrap');if(!w||hero.querySelector('.sg-abv'))return;
 var d=document.createElement('div');d.className='sg-abv';
 d.innerHTML='<video muted autoplay loop playsinline preload="metadata" poster="'+V+'-poster.jpg" src="'+V+'.mp4" aria-label="Tom Jackson, founder of Supergay Spirits, on how Supergay started. Captioned."></video>';
 hero.insertBefore(d,w);hero.classList.add('sg-abv-on');
 function size(){var n=[].find.call(document.querySelectorAll('.w-nav'),function(x){return x.offsetHeight>0}),nb=n?n.offsetTop+n.offsetHeight:95,top=hero.getBoundingClientRect().top+scrollY-(parseFloat(getComputedStyle(hero).paddingTop)||0)*0,hs=document.documentElement.style;hs.setProperty('--sg-ahp',Math.max(0,Math.round(nb-top))+'px');hs.setProperty('--sg-avh',Math.max(240,Math.round(innerHeight-nb))+'px')}
 size();addEventListener('resize',size);
 var eb=w.querySelector('.sg-ab-eyebrow');if(eb)d.appendChild(eb);
 var v=d.querySelector('video');
 var p=v.play();p&&p.catch&&p.catch(function(){});
}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
})();
