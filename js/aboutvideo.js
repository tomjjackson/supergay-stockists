/*SG about page: video at the top of the hero, above "Farm to disco.", with ABOUT SUPERGAY SPIRITS over it. Muted autoplay loop, tap for sound. Replaces the small eyebrow line. Remove this script to undo.*/
(function(){
var V='https://cdn.jsdelivr.net/gh/tomjjackson/supergay-stockists@8363e66a3591/img/about/about';
var s=document.createElement('style');s.textContent='.sg-abv{position:relative;width:100%;aspect-ratio:16/9;margin:0 0 48px;border-radius:24px;overflow:hidden;background:#353330}.sg-abv video{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}.sg-abv:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.05),rgba(0,0,0,.35));pointer-events:none}.sg-abv h2{position:absolute;left:0;right:0;top:50%;transform:translateY(-50%);z-index:2;margin:0;padding:0 24px;text-align:center;color:#FCF9EF;font:500 clamp(28px,5.2vw,76px)/1 Generalsans,Arial,sans-serif;letter-spacing:.02em;text-transform:uppercase;text-shadow:0 2px 24px rgba(0,0,0,.45);pointer-events:none}.sg-abv button{position:absolute;right:16px;bottom:16px;z-index:3;padding:10px 18px;border:2px solid #FCF9EF;border-radius:999px;background:rgba(53,51,48,.55);color:#FCF9EF;font:500 14px/1 Generalsans,Arial,sans-serif;text-transform:uppercase;cursor:pointer}.sg-ab-hero .sg-ab-eyebrow{display:none}@media(max-width:767px){.sg-abv{border-radius:16px;margin-bottom:32px}.sg-abv button{right:10px;bottom:10px;padding:8px 14px;font-size:12px}}';document.head.appendChild(s);
function run(){
 var w=document.querySelector('.sg-ab-hero .sg-ab-wrap');if(!w||w.querySelector('.sg-abv'))return;
 var d=document.createElement('div');d.className='sg-abv';
 d.innerHTML='<video muted autoplay loop playsinline preload="metadata" poster="'+V+'-poster.jpg" src="'+V+'.mp4" aria-label="Tom, founder of Supergay Spirits, on how Supergay started"></video><h2>About Supergay Spirits</h2><button type="button" aria-label="Turn sound on">Sound on</button>';
 w.insertBefore(d,w.firstChild);
 var v=d.querySelector('video'),b=d.querySelector('button');
 b.addEventListener('click',function(){v.muted=!v.muted;if(!v.muted){try{v.currentTime=0}catch(e){}}b.textContent=v.muted?'Sound on':'Sound off';b.setAttribute('aria-label',v.muted?'Turn sound on':'Turn sound off');var p=v.play();p&&p.catch&&p.catch(function(){})});
 var p=v.play();p&&p.catch&&p.catch(function(){});
}
if(document.readyState!=='loading')run();else document.addEventListener('DOMContentLoaded',run);
})();
