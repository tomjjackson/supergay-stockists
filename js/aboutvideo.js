/*SG about page: video at the top of the hero, above "Farm to disco.", with the page's ABOUT SUPERGAY SPIRITS eyebrow moved onto it. Muted autoplay loop, tap for sound. Remove this script to undo.*/
(function(){
var V='https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@8363e66a3591/img/about/about';
var s=document.createElement('style');s.textContent='.sg-abv{position:relative;width:100%;max-width:min(100%,calc((100vh - 320px)*16/9));min-width:min(100%,560px);aspect-ratio:16/9;margin:0 auto 48px;container-type:inline-size;border-radius:24px;overflow:hidden;background:#353330}.sg-abv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}.sg-abv:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.12),rgba(0,0,0,0) 30%);pointer-events:none}.sg-abv .sg-ab-eyebrow{display:block!important;position:absolute;left:24px;top:24px;z-index:2;margin:0!important;padding:.55em .9em;border-radius:999px;background:#FCF9EF;color:#CB4A66;font:700 clamp(12px,1.9cqw,22px)/1 Inconsolata,Menlo,monospace;letter-spacing:.1em;text-transform:uppercase;pointer-events:none}.sg-abv button{position:absolute;right:16px;bottom:16px;z-index:3;padding:10px 18px;border:2px solid #FCF9EF;border-radius:999px;background:rgba(53,51,48,.55);color:#FCF9EF;font:500 14px/1 Generalsans,Arial,sans-serif;text-transform:uppercase;cursor:pointer}@media(max-width:767px){.sg-abv{border-radius:16px;margin-bottom:32px}.sg-abv .sg-ab-eyebrow{left:12px;top:12px}.sg-abv button{right:10px;bottom:10px;padding:8px 14px;font-size:12px}}';document.head.appendChild(s);
function run(){
 var w=document.querySelector('.sg-ab-hero .sg-ab-wrap');if(!w||w.querySelector('.sg-abv'))return;
 var d=document.createElement('div');d.className='sg-abv';
 d.innerHTML='<video muted autoplay loop playsinline preload="metadata" poster="'+V+'-poster.jpg" src="'+V+'.mp4" aria-label="Tom, founder of Supergay Spirits, on how Supergay started"></video><button type="button" aria-label="Turn sound on">Sound on</button>';
 w.insertBefore(d,w.firstChild);
 var eb=w.querySelector('.sg-ab-eyebrow');if(eb)d.appendChild(eb);
 var v=d.querySelector('video'),b=d.querySelector('button');
 b.addEventListener('click',function(){v.muted=!v.muted;if(!v.muted){try{v.currentTime=0}catch(e){}}b.textContent=v.muted?'Sound on':'Sound off';b.setAttribute('aria-label',v.muted?'Turn sound on':'Turn sound off');var p=v.play();p&&p.catch&&p.catch(function(){})});
 var p=v.play();p&&p.catch&&p.catch(function(){});
}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
})();
