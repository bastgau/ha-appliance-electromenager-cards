/* Philips Hue Play HDMI Sync Box : boîtier noir plat aux angles arrondis, vu de trois quarts (face avant à droite),
   avec en façade un voyant et le connecteur rond. Voyant : blanc allumé, violet en veille, éteint sinon.
   Silhouette seulement : aucun logo. */
SVG.hue_sync = () => `
<defs>${DEFS}
<linearGradient id="ID-hstop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2f35"/><stop offset=".5" stop-color="#171a1e"/><stop offset="1" stop-color="#0d0f11"/></linearGradient>
<linearGradient id="ID-hsfront" x1="0" x2="1"><stop offset="0" stop-color="#1d2126"/><stop offset="1" stop-color="#0a0b0d"/></linearGradient>
<linearGradient id="ID-hsside" x1="0" x2="1"><stop offset="0" stop-color="#14171b"/><stop offset="1" stop-color="#050607"/></linearGradient>
<radialGradient id="ID-hsled"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<ellipse cx="62" cy="104" rx="52" ry="7" fill="url(#ID-shadow)"/>
<g class="hs-box" stroke-linejoin="round">
  <path d="M78 70L112 52V63L78 81Z" fill="url(#ID-hsside)" stroke="#050607" stroke-width="4"/>
  <path d="M12 64L78 70V81L12 75Z" fill="url(#ID-hsfront)" stroke="#0a0b0d" stroke-width="4"/>
  <path d="M78 70L112 52" stroke="#5a636d" stroke-opacity=".5" stroke-width=".7"/>
  <path d="M12 64L46 46L112 52L78 70Z" fill="url(#ID-hstop)" stroke="#1b1f23" stroke-width="4"/>
  <path d="M15 63.500L47 48.500L108 54" fill="none" stroke="#7a838d" stroke-opacity=".45" stroke-width=".8"/>
  <path d="M40 62L62 54L84 58" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="5"/>
  <circle class="hs-halo" cx="58" cy="76.200" r="5" fill="url(#ID-hsled)"/>
  <circle class="hs-led" cx="58" cy="76.200" r="1.200"/>
  <ellipse cx="68" cy="77.300" rx="3.500" ry="2.200" fill="#050607" stroke="#3a424b" stroke-width=".4"/>
</g>`;
