/* Philips Hue Play HDMI Sync Box : boîtier noir plat posé devant une TV, quatre câbles HDMI d'entrée qui sortent
   à gauche (celui de la source active est mis en évidence), un câble de sortie vers la TV, bandeau lumineux en façade
   et halo multicolore autour de l'écran quand la synchronisation tourne. Silhouette seulement : aucun logo. */
SVG.hue_sync = () => `
<defs>${DEFS}
<linearGradient id="ID-hstop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3a4048"/><stop offset="1" stop-color="#14181c"/></linearGradient>
<linearGradient id="ID-hsfront" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#23282e"/><stop offset="1" stop-color="#0b0d10"/></linearGradient>
<linearGradient id="ID-hsside" x1="0" x2="1"><stop offset="0" stop-color="#171b1f"/><stop offset="1" stop-color="#07080a"/></linearGradient>
<linearGradient id="ID-hspic" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#3b6fd8"/><stop offset=".55" stop-color="#b86ad6"/><stop offset="1" stop-color="#ff8a4c"/></linearGradient>
<radialGradient id="ID-hsa"><stop offset="0" stop-color="#ff3d6e" stop-opacity=".85"/><stop offset="1" stop-color="#ff3d6e" stop-opacity="0"/></radialGradient>
<radialGradient id="ID-hsb"><stop offset="0" stop-color="#2f8cff" stop-opacity=".85"/><stop offset="1" stop-color="#2f8cff" stop-opacity="0"/></radialGradient>
<radialGradient id="ID-hsc"><stop offset="0" stop-color="#35e08a" stop-opacity=".8"/><stop offset="1" stop-color="#35e08a" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="60" cy="118" rx="54" ry="5" fill="url(#ID-shadow)"/>
<g class="hs-glow">
  <ellipse cx="20" cy="36" rx="30" ry="34" fill="url(#ID-hsa)"/>
  <ellipse cx="100" cy="36" rx="30" ry="34" fill="url(#ID-hsb)"/>
  <ellipse cx="60" cy="66" rx="48" ry="16" fill="url(#ID-hsc)"/>
</g>
<g class="hs-tv">
  <path d="M52 63h16l3 8H49Z" fill="#14181c"/>
  <rect x="49" y="70" width="22" height="2.4" rx="1.2" fill="#1d2228"/>
  <rect x="12" y="8" width="96" height="56" rx="3" fill="#0a0c0f" stroke="#2a2f35" stroke-width=".8"/>
  <rect class="hs-scr" x="15" y="11" width="90" height="50" rx="1.5" fill="#101418"/>
  <rect class="hs-pic" x="15" y="11" width="90" height="50" rx="1.5" fill="url(#ID-hspic)"/>
  <path d="M15 11h90v14C80 22 40 24 15 30Z" fill="#fff" fill-opacity=".05"/>
</g>
<g class="hs-cables" fill="none" stroke-linecap="round">
  <path class="hs-in" d="M24 94C14 94 8 91 0 88" stroke-width="2.2"/>
  <path class="hs-in" d="M24 98C14 98 8 97 0 97" stroke-width="2.2"/>
  <path class="hs-in" d="M24 102C14 102 8 103 0 106" stroke-width="2.2"/>
  <path class="hs-in" d="M24 105C14 106 8 110 0 115" stroke-width="2.2"/>
  <path class="hs-out" d="M66 86C66 80 62 77 60 72" stroke-width="2.4"/>
</g>
<g class="hs-box">
  <path d="M86 94L104 84V100L86 110Z" fill="url(#ID-hsside)" stroke="#000" stroke-width=".4"/>
  <path d="M22 94L40 84H104L86 94Z" fill="url(#ID-hstop)" stroke="#4a525b" stroke-width=".4"/>
  <path d="M22 94H86V110H22Z" fill="url(#ID-hsfront)" stroke="#000" stroke-width=".4"/>
  <path d="M24 95.2H84" stroke="#5a636d" stroke-opacity=".55" stroke-width=".6"/>
  <rect class="hs-strip" x="32" y="101" width="46" height="2.2" rx="1.1"/>
  <circle class="hs-led" cx="27.4" cy="102" r="1.1"/>
</g>`;
