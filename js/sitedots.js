/*SG: every photo slider with dots gets small dots and a dark pill for the current photo (Hommey style). Shop cards (slider-4, slider-cosmo) get the dots overlaid on the photo. Sliders on cream (w-slider-nav-invert) get dark dots. Sliders with one photo show no dots. Numbered navs and the homepage pill-arrow sliders are left alone. Remove this block to undo.*/
(function(){var N='html body .w-slider:not(.sg-pslider) .w-slider-nav.w-round:not(.w-num)',D=N+' .w-slider-dot',s=document.createElement('style');
s.textContent=N+'{display:flex!important;justify-content:center;align-items:center;flex-wrap:wrap;gap:7px;padding-top:0!important;padding-bottom:0!important}'+
'html body .slider-4 .w-slider-nav,html body .slider-cosmo .w-slider-nav{position:absolute!important;left:0!important;right:0!important;top:auto!important;bottom:18px!important;height:auto!important;width:auto!important;margin:0!important;padding:0!important;z-index:3;pointer-events:none}'+
D+'{width:7px!important;height:7px!important;margin:0!important;border:0!important;border-radius:999px!important;background:rgba(252,249,239,.92)!important;box-shadow:0 0 0 .5px rgba(53,51,48,.18);opacity:1!important;pointer-events:auto;transition:width .3s cubic-bezier(.22,.61,.36,1),background-color .3s ease}'+
D+'.w-active{width:26px!important;background:#353330!important;box-shadow:none}'+
'html body .w-slider .w-slider-nav-invert.w-round:not(.w-num) .w-slider-dot:not(.w-active){background:rgba(53,51,48,.28)!important;box-shadow:none}'+
N+':not(:has(.w-slider-dot + .w-slider-dot)){display:none!important}'+
'@media (prefers-reduced-motion:reduce){'+D+'{transition:none!important}}';
document.head.appendChild(s)})();
