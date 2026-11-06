/* Cartes « forked » : toutes nos modifications vivent ici, dans des sous-classes des cartes d'origine.
 *
 * Pourquoi : les fichiers du cœur (base.js, definitions.js, editor.js, i18n…) sont modifiés à chaque version amont ;
 * y ajouter nos options provoquait des conflits à chaque fusion de `main`. Ce fichier ne touche à aucun fichier amont :
 * il est chargé après le cœur et étend les classes déjà enregistrées (`customElements.get(...)`), qui gardent leur
 * `kind` (tv, av_receiver, generic) et donc tout le comportement d'origine, y compris les évolutions futures.
 *
 * Cartes :
 *  - appliance-tv-forked-card          ← appliance-tv-card : halo ambilight, tuile ambilight on/off, bouton sommeil
 *  - appliance-av-receiver-forked-card ← appliance-av-receiver-card : bouton sommeil
 *  - appliance-hue-sync-forked-card    ← appliance-generic-card : Philips Hue Play HDMI Sync Box
 *
 * Méthodes internes de l'amont utilisées (si l'une est renommée, la carte concernée est désactivée avec un avertissement
 * console) : _build, _ids, _compute, _render, setConfig, getConfigForm, getStubConfig.
 */
(() => {
  const BASE_TV = customElements.get("appliance-tv-card");
  const BASE_AV = customElements.get("appliance-av-receiver-card");
  const BASE_GEN = customElements.get("appliance-generic-card");
  const REQUIRED = ["_build", "_ids", "_compute", "_render", "setConfig"];

  /* ---- chaînes (inline : aucune clé dans src/i18n, donc aucun conflit sur les fichiers de traduction) ---- */
  const T = {
    "en": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Starting",
      "ambilight": "Ambilight",
      "f_ambilight": "Ambilight switch (on/off)",
      "f_ambilight_level": "Ambilight level (number, halo intensity)",
      "toggle_ambilight": "Turn the ambilight on/off",
      "sleep_btn": "Sleep",
      "f_sleep": "Sleep button (button or switch)",
      "f_switch_hue": "Smart plug switch (off = Off)",
      "f_entity_hue": "Box status switch (on = On, off = Standby)",
      "f_button_hue": "On/off button controls",
      "v_on": "On",
      "v_off": "Off"
    },
    "fr": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Démarrage",
      "ambilight": "Ambilight",
      "f_ambilight": "Interrupteur ambilight (on/off)",
      "f_ambilight_level": "Niveau ambilight (number, intensité du halo)",
      "toggle_ambilight": "Activer / désactiver l'ambilight",
      "sleep_btn": "Sommeil",
      "f_sleep": "Bouton sommeil (button ou switch)",
      "f_switch_hue": "Switch de la prise connectée (coupé = Éteint)",
      "f_entity_hue": "Switch d'état du boîtier (on = Allumé, off = Veille)",
      "f_button_hue": "Le bouton on/off pilote",
      "v_on": "En marche",
      "v_off": "Éteint"
    },
    "de": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Startet",
      "ambilight": "Ambilight",
      "f_ambilight": "Ambilight-Schalter (an/aus)",
      "f_ambilight_level": "Ambilight-Stufe (Number, Halo-Intensität)",
      "toggle_ambilight": "Ambilight ein/aus",
      "sleep_btn": "Schlafmodus",
      "f_sleep": "Schlafmodus-Taste (Button oder Schalter)",
      "f_switch_hue": "Schalter der Steckdose (aus = Aus)",
      "f_entity_hue": "Status-Schalter des Geräts (an = Ein, aus = Standby)",
      "f_button_hue": "Die Ein/Aus-Taste schaltet",
      "v_on": "An",
      "v_off": "Aus"
    },
    "nb": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Starter",
      "ambilight": "Ambilight",
      "f_ambilight": "Ambilight-bryter (på/av)",
      "f_ambilight_level": "Ambilight-nivå (number, glødens styrke)",
      "toggle_ambilight": "Slå Ambilight av/på",
      "sleep_btn": "Dvalemodus",
      "f_sleep": "Dvalemodus-knapp (button eller bryter)",
      "f_switch_hue": "Bryter for stikkontakten (av = Av)",
      "f_entity_hue": "Statusbryter for enheten (på = På, av = Standby)",
      "f_button_hue": "Av/på-knappen styrer",
      "v_on": "På",
      "v_off": "Av"
    },
    "nl": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Opstarten",
      "ambilight": "Ambilight",
      "f_ambilight": "Ambilight-schakelaar (aan/uit)",
      "f_ambilight_level": "Ambilight-niveau (number, intensiteit van de gloed)",
      "toggle_ambilight": "Ambilight aan/uit",
      "sleep_btn": "Slaapstand",
      "f_sleep": "Slaapstandknop (button of schakelaar)",
      "f_switch_hue": "Schakelaar van het stopcontact (uit = Uit)",
      "f_entity_hue": "Statusschakelaar van het apparaat (aan = Aan, uit = Stand-by)",
      "f_button_hue": "De aan/uit-knop bedient",
      "v_on": "Aan",
      "v_off": "Uit"
    },
    "ro": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Pornire",
      "ambilight": "Ambilight",
      "f_ambilight": "Comutator Ambilight (pornit/oprit)",
      "f_ambilight_level": "Nivel Ambilight (number, intensitatea halo)",
      "toggle_ambilight": "Pornește/oprește Ambilight",
      "sleep_btn": "Mod somn",
      "f_sleep": "Buton somn (button sau comutator)",
      "f_switch_hue": "Comutatorul prizei inteligente (oprit = Oprit)",
      "f_entity_hue": "Comutator de stare al dispozitivului (pornit = Pornit, oprit = Standby)",
      "f_button_hue": "Butonul pornit/oprit controlează",
      "v_on": "Pornit",
      "v_off": "Oprit"
    },
    "ru": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Запуск",
      "ambilight": "Ambilight",
      "f_ambilight": "Переключатель Ambilight (вкл/выкл)",
      "f_ambilight_level": "Уровень Ambilight (number, яркость ореола)",
      "toggle_ambilight": "Включить/выключить Ambilight",
      "sleep_btn": "Спящий режим",
      "f_sleep": "Кнопка спящего режима (button или переключатель)",
      "f_switch_hue": "Переключатель розетки (выкл. = Выключен)",
      "f_entity_hue": "Переключатель состояния устройства (вкл. = Включён, выкл. = Ожидание)",
      "f_button_hue": "Кнопка вкл/выкл управляет",
      "v_on": "Включено",
      "v_off": "Выкл."
    },
    "sr": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Покретање",
      "ambilight": "Ambilight",
      "f_ambilight": "Прекидач Ambilight (укљ./искљ.)",
      "f_ambilight_level": "Ниво Ambilight (number, јачина ореола)",
      "toggle_ambilight": "Укључи/искључи Ambilight",
      "sleep_btn": "Режим спавања",
      "f_sleep": "Дугме за спавање (button или прекидач)",
      "f_switch_hue": "Прекидач паметне утичнице (искључен = Искључен)",
      "f_entity_hue": "Прекидач стања уређаја (укључен = Укључен, искључен = Мировање)",
      "f_button_hue": "Дугме укљ./искљ. управља",
      "v_on": "Укључено",
      "v_off": "Искључено"
    },
    "sr-Latn": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Pokretanje",
      "ambilight": "Ambilight",
      "f_ambilight": "Prekidač Ambilight (uklj./isklj.)",
      "f_ambilight_level": "Nivo Ambilight (number, jačina oreola)",
      "toggle_ambilight": "Uključi/isključi Ambilight",
      "sleep_btn": "Režim spavanja",
      "f_sleep": "Dugme za spavanje (button ili prekidač)",
      "f_switch_hue": "Prekidač pametne utičnice (isključen = Isključen)",
      "f_entity_hue": "Prekidač stanja uređaja (uključen = Uključen, isključen = Mirovanje)",
      "f_button_hue": "Dugme uklj./isklj. upravlja",
      "v_on": "Uključeno",
      "v_off": "Isključeno"
    },
    "it": {
      "hue_sync": "Hue Sync Box",
      "hue_boot": "Avvio",
      "ambilight": "Ambilight",
      "f_ambilight": "Interruttore Ambilight (on/off)",
      "f_ambilight_level": "Livello Ambilight (number, intensità dell'alone)",
      "toggle_ambilight": "Accendi/spegni Ambilight",
      "sleep_btn": "Sospensione",
      "f_sleep": "Pulsante sospensione (button o interruttore)",
      "f_switch_hue": "Interruttore della presa smart (spento = Spento)",
      "f_entity_hue": "Interruttore di stato del dispositivo (acceso = Acceso, spento = Standby)",
      "f_button_hue": "Il pulsante on/off comanda",
      "v_on": "Acceso",
      "v_off": "Spento"
    }
  };
  const hassOf = (h) => h || document.querySelector("home-assistant")?.hass;
  const lang = (hass) => {
    const h = hassOf(hass);
    const raw = (h && (h.locale?.language || h.language)) || document.documentElement.lang || "en";
    if (T[raw]) return raw;
    if (raw.replace("_", "-").toLowerCase() === "sr-latn") return "sr-Latn";
    let l = raw.toLowerCase().slice(0, 2);
    if (l === "no" || l === "nn") l = "nb";
    return T[l] ? l : "en";
  };
  const tt = (hass, k) => T[lang(hass)][k] ?? T.en[k] ?? k;
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (ch) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[ch]));
  const BAD = ["unavailable", "unknown", "none", ""];
  const low = (st) => (st ? String(st.state).toLowerCase() : "");
  const clamp01 = (x) => Math.max(0, Math.min(1, x));

  /* ---- styles injectés dans le shadow root de nos cartes uniquement ---- */
  const CSS_COMMON = `
.actions { display: flex; align-items: flex-start; gap: 6px; }`;
  const CSS_TV = `
/* ambilight : halo coloré derrière l'écran (TV allumée + interrupteur on) ; --amb (0 à 1) règle l'épaisseur et l'opacité, les couleurs dérivent */
.tv-amb { opacity: 0; pointer-events: none; transform-box: view-box; transform-origin: 60px 69.5px; transition: opacity .6s, transform .6s; }
.tv-amb rect { stroke-width: calc(3px + var(--amb, .7) * 9px); }
.k-tv.amb-on .tv-amb { opacity: calc(.2 + var(--amb, .7) * .8); transform: scale(calc(.98 + var(--amb, .7) * .06)); animation: tv-amb-hue 16s linear infinite; }
@keyframes tv-amb-hue { to { filter: hue-rotate(360deg); } }
.no-anim .tv-amb { animation: none !important; }
.amb-tile { cursor: pointer; }
.amb-tile.on { box-shadow: inset 0 0 0 1px var(--c); }`;
  const CSS_HUE = `
/* voyant en façade : éteint sombre, rouge en veille, violet pendant les 10 s de démarrage, blanc allumé */
.k-hue_sync .hs-led { fill: #2a2f35; transition: fill .4s; }
.k-hue_sync .hs-halo { opacity: 0; transition: opacity .4s; }
.k-hue_sync.st-standby .hs-led { fill: #ff3b30; filter: drop-shadow(0 0 1.6px #ff3b30); }
.k-hue_sync.st-hue_boot .hs-led { fill: #b46bff; filter: drop-shadow(0 0 2px #b46bff); animation: ac-pulse 1.6s ease-in-out infinite; }
.k-hue_sync.st-powered .hs-led { fill: #fff; filter: drop-shadow(0 0 2px #fff); }
.k-hue_sync.st-powered .hs-halo { opacity: .6; }`;

  /* ---- dessins ---- */
  // halo ambilight : rectangle flou et dégradé, inséré derrière le dessin de la TV (ids propres, le shadow root les isole)
  const AMB_SVG = `<defs><filter id="fkamb" x="-35%" y="-45%" width="170%" height="190%"><feGaussianBlur stdDeviation="5"/></filter>
<linearGradient id="fkambg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ff3d6e"/><stop offset=".35" stop-color="#a45cff"/><stop offset=".7" stop-color="#2f8cff"/><stop offset="1" stop-color="#35e08a"/></linearGradient></defs>
<g class="tv-amb"><g filter="url(#fkamb)"><rect x="-1" y="33.5" width="122" height="72" rx="6" fill="none" stroke="url(#fkambg)"/></g></g>`;
  // Philips Hue Play HDMI Sync Box : boîtier noir plat aux angles arrondis, vu de trois quarts, voyant en façade. Silhouette seulement : aucun logo.
  const HUE_SVG = `
<defs>
<radialGradient id="fkhsh"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
<linearGradient id="fkhstop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2a2f35"/><stop offset=".5" stop-color="#171a1e"/><stop offset="1" stop-color="#0d0f11"/></linearGradient>
<linearGradient id="fkhsfront" x1="0" x2="1"><stop offset="0" stop-color="#1d2126"/><stop offset="1" stop-color="#0a0b0d"/></linearGradient>
<linearGradient id="fkhsside" x1="0" x2="1"><stop offset="0" stop-color="#14171b"/><stop offset="1" stop-color="#050607"/></linearGradient>
<radialGradient id="fkhsled"><stop offset="0" stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>
<g transform="translate(-2 5.700)">
<ellipse cx="62" cy="79" rx="56" ry="3.600" fill="url(#fkhsh)"/>
<g class="hs-box" stroke-linejoin="round">
  <path d="M78 70L112 52V63L78 81Z" fill="url(#fkhsside)" stroke="#050607" stroke-width="4"/>
  <path d="M12 64L78 70V81L12 75Z" fill="url(#fkhsfront)" stroke="#0a0b0d" stroke-width="4"/>
  <path d="M78 70L112 52" stroke="#5a636d" stroke-opacity=".5" stroke-width=".7"/>
  <path d="M12 64L46 46L112 52L78 70Z" fill="url(#fkhstop)" stroke="#1b1f23" stroke-width="4"/>
  <path d="M15 63.500L47 48.500L108 54" fill="none" stroke="#7a838d" stroke-opacity=".45" stroke-width=".8"/>
  <path d="M40 62L62 54L84 58" fill="none" stroke="#fff" stroke-opacity=".05" stroke-width="5"/>
  <circle class="hs-halo" cx="58" cy="76.200" r="5" fill="url(#fkhsled)"/>
  <circle class="hs-led" cx="58" cy="76.200" r="1.200"/>
  <ellipse cx="68" cy="77.300" rx="3.500" ry="2.200" fill="#050607" stroke="#3a424b" stroke-width=".4"/>
</g>
</g>`;

  /* ---- champs de l'éditeur visuel ---- */
  const FIELD_SEL = {
    sleep: { entity: { domain: ["button", "input_button", "switch", "input_boolean"] } },
    ambilight: { entity: { domain: ["switch", "input_boolean", "light"] } },
    ambilight_level: { entity: { domain: ["number", "input_number", "sensor"] } },
    button: { select: { mode: "dropdown", options: [
      { value: "switch", label: "Prise (switch) / Plug (switch)" }, { value: "entity", label: "Statut du boîtier (entity) / Box status (entity)" }] } },
  };

  /* Fabrique : ajoute à une carte d'origine le bouton sommeil, l'élargissement de la liste d'entités surveillées, le style
     injecté et les champs de l'éditeur. opts : sleepOn (statuts « allumé »), fields (champs ajoutés à l'éditeur),
     labels ({champ: clé de T}), css. */
  const withFork = (Parent, opts) => class extends Parent {
    static get _fork() { return opts; }

    // entités surveillées : sinon le cache de rendu ignore leurs changements pendant 30 s
    _ids() {
      const c = this._cfg();
      return super._ids().concat(["sleep", "ambilight", "ambilight_level"].map((k) => c[k]).filter((i) => typeof i === "string" && i));
    }
    _cfg() { return this._fc || this._config || {}; }

    _build() {
      super._build();
      const root = this.shadowRoot;
      const st = document.createElement("style");
      st.textContent = CSS_COMMON + opts.css;
      root.appendChild(st);
      // tuiles à bascule (data-toggle) : un clic change l'état de l'entité au lieu d'ouvrir sa fiche (phase de capture : avant la carte)
      if (!this._forkCap) {
        this._forkCap = true;
        root.addEventListener("click", (ev) => {
          const tg = ev.composedPath().find((n) => n.dataset && n.dataset.toggle);
          if (!tg) return;
          ev.stopPropagation();
          this._forkToggle(tg.dataset.toggle);
        }, true);
      }
      if (this._forkBuilt) this._forkBuilt(root);
    }

    _forkToggle(id) {
      const hass = this._hass;
      if (!id || !hass) return;
      const dom = id.split(".")[0];
      hass.callService(["switch", "input_boolean", "light"].includes(dom) ? dom : "homeassistant", "toggle", { entity_id: id });
    }
    // bouton sommeil : button / input_button → press ; switch, input_boolean… → toggle
    _sleep() {
      const id = this._cfg().sleep, hass = this._hass;
      if (!id || !hass) return;
      const dom = id.split(".")[0], press = ["button", "input_button"].includes(dom);
      hass.callService(press || ["switch", "input_boolean", "light"].includes(dom) ? dom : "homeassistant", press ? "press" : "toggle", { entity_id: id });
    }

    _render(m) {
      super._render(m);
      const root = this.shadowRoot, c = this._cfg(), hass = this._hass;
      if (!root || !hass) return;
      if (this._forkRender) this._forkRender(m, root.getElementById("wrap"), root);
      // bouton sommeil : à gauche du bouton power, seulement appareil allumé et entité présente (style neutre du bouton power éteint)
      const slp = c.sleep && opts.sleepOn.includes(m.status) ? hass.states[c.sleep] : null;
      if (slp) {
        const label = c.labels && c.labels.sleep_btn ? String(c.labels.sleep_btn) : tt(hass, "sleep_btn");
        const actions = root.getElementById("actions");
        actions.insertAdjacentHTML("afterbegin", `<button class="toggle slp" title="${esc(label)}" aria-label="${esc(label)}" ${slp.state === "unavailable" ? "disabled" : ""}><ha-icon icon="mdi:sleep-off"></ha-icon></button>`);
        actions.querySelector("button.slp").onclick = (ev) => { ev.stopPropagation(); this._sleep(); };
      }
    }

    // éditeur : champs de l'amont + les nôtres avant le groupe « Options » ; libellés traduits par nos chaînes
    static getConfigForm() {
      const f = super.getConfigForm();
      const extra = opts.fields.map((name) => ({ name, selector: FIELD_SEL[name] }));
      const i = f.schema.findIndex((s) => s.type === "expandable");
      f.schema.splice(i < 0 ? f.schema.length : i, 0, ...extra);
      const orig = f.computeLabel;
      f.computeLabel = (s) => (opts.labels[s.name] ? tt(null, opts.labels[s.name]) : orig ? orig(s) : s.name);
      return f;
    }
  };

  // names : noms traduits pour la liste du sélecteur « carte unique » (picker.js) ; sans « / » (ce sélecteur réserve « EN / FR » aux cartes d'origine)
  const customCard = (tag, name, description, names) => {
    window.customCards = window.customCards || [];
    window.customCards.push({ type: tag, forked: true, name, names, description, preview: true, documentationURL: "https://github.com/bastgau/ha-appliance-electromenager-cards" });
  };
  // convention du fork : toute carte créée ici s'appelle appliance-<nom>-forked-card (aucune collision possible avec l'amont)
  const FORKED_TAG = /^appliance-[a-z0-9-]+-forked-card$/;
  const define = (tag, Parent, build, name, description, names) => {
    if (!FORKED_TAG.test(tag)) { console.error(`[forked] ${tag} refusée : le type d'une carte du fork doit finir par -forked-card.`); return; }
    if (customElements.get(tag)) return;
    if (!Parent || REQUIRED.some((m) => typeof Parent.prototype[m] !== "function")) {
      console.warn(`[forked] ${tag} désactivée : la carte d'origine est absente ou ses méthodes internes (${REQUIRED.join(", ")}) ont changé.`);
      return;
    }
    customElements.define(tag, build(Parent));
    customCard(tag, name, description, names);
  };

  /* ================= TV : ambilight + bouton sommeil ================= */
  define("appliance-tv-forked-card", BASE_TV, (P) => class extends withFork(P, {
    sleepOn: ["screen_on"], css: CSS_TV, fields: ["ambilight", "ambilight_level", "sleep"],
    labels: { ambilight: "f_ambilight", ambilight_level: "f_ambilight_level", sleep: "f_sleep" },
  }) {
    // halo : groupe SVG inséré une fois, derrière le dessin de la TV
    _forkBuilt(root) {
      const svg = root.querySelector(".illus svg");
      if (svg) svg.insertAdjacentHTML("afterbegin", AMB_SVG);
    }
    // Ambilight : halo si la TV est allumée et l'interrupteur on ; ambilight_level (number) règle l'intensité, normalisée avec
    // min / max de l'entité (0 à 100 par défaut). Sans niveau, intensité moyenne ; sans interrupteur, un niveau > 0 suffit.
    _compute() {
      const m = super._compute(), c = this._cfg(), S = (id) => (id ? this._hass.states[id] : undefined);
      const aSt = S(c.ambilight), lSt = S(c.ambilight_level), aState = low(aSt);
      let frac = null;
      if (lSt && !BAD.includes(low(lSt))) {
        const v = parseFloat(String(lSt.state).replace(",", ".")), a = lSt.attributes || {};
        const lo = Number.isFinite(Number(a.min)) ? Number(a.min) : 0, hi = Number.isFinite(Number(a.max)) ? Number(a.max) : 100;
        if (Number.isFinite(v) && hi > lo) frac = clamp01((v - lo) / (hi - lo));
      }
      m.ambSt = aSt && ["on", "off"].includes(aState) ? aSt : null;
      m.ambPct = frac != null ? frac * 100 : null;
      m.ambFrac = frac ?? 0.7;
      const on = c.ambilight ? aState === "on" : frac != null;
      m.ambOn = m.status === "screen_on" && on && (frac == null || frac > 0);
      return m;
    }
    _forkRender(m, wrap, root) {
      const c = this._cfg(), hass = this._hass;
      wrap.classList.toggle("amb-on", !!m.ambOn);
      wrap.style.setProperty("--amb", (m.ambFrac ?? 0.7).toFixed(2));
      // tuile Ambilight : niveau (ou On / Off), un clic bascule l'interrupteur ; TV allumée et interrupteur on ou off seulement
      if (c.ambilight && m.status === "screen_on" && m.ambSt) {
        const on = low(m.ambSt) === "on", val = on ? (m.ambPct != null ? `${Math.round(m.ambPct)} %` : tt(hass, "v_on")) : tt(hass, "v_off");
        const label = c.labels && c.labels.ambilight ? String(c.labels.ambilight) : tt(hass, "ambilight");
        root.getElementById("stats").insertAdjacentHTML("beforeend", `<div class="tile amb-tile ${on ? "on" : ""}" data-entity="${esc(c.ambilight)}" data-toggle="${esc(c.ambilight)}" title="${esc(tt(hass, "toggle_ambilight"))}">
          <span class="val">${esc(val)}</span><span class="lbl"><ha-icon icon="mdi:television-ambient-light"></ha-icon>${esc(label)}</span></div>`);
      }
    }
  }, "Appliance – TV (forked)", "TV card with ambilight halo, ambilight tile and sleep button.",
    { en: "TV (forked)", fr: "Téléviseur (forked)", de: "Fernseher (forked)" });

  /* ================= Ampli home cinéma : bouton sommeil ================= */
  define("appliance-av-receiver-forked-card", BASE_AV, (P) => class extends withFork(P, {
    sleepOn: ["playing", "paused", "muted"], css: "", fields: ["sleep"], labels: { sleep: "f_sleep" },
  }) {}, "Appliance – AV receiver (forked)", "AV receiver card with a sleep button.",
    { en: "AV receiver (forked)", fr: "Ampli home cinéma (forked)", de: "AV-Receiver (forked)" });

  /* ================= Philips Hue Play HDMI Sync Box ================= */
  // switch = prise connectée (coupée → Off) ; entity = switch d'état du boîtier (on → On, off → Standby) ; sans entity, la puissance
  // de la prise décide (threshold, 3 W par défaut) ; 10 s de « Démarrage » après le passage de la prise de coupée à allumée.
  define("appliance-hue-sync-forked-card", BASE_GEN, (P) => class extends withFork(P, {
    sleepOn: ["powered"], css: CSS_HUE, fields: ["sleep", "button"],
    labels: { entity: "f_entity_hue", switch: "f_switch_hue", button: "f_button_hue", sleep: "f_sleep" },
  }) {
    static getStubConfig(hass) {
      const cfg = super.getStubConfig(hass) || {};
      const ids = Object.keys((hass && hass.states) || {});
      if (!cfg.switch) { const sw = ids.find((i) => i.startsWith("switch.") && /(hue|sync).*(box|sync)|sync_?box/.test(i)); if (sw) cfg.switch = sw; }
      return cfg;
    }
    // button: entity → le bouton on/off de la base pilote le switch d'état (copie de config : la base ne connaît que `switch`)
    setConfig(config) {
      this._fc = config;
      super.setConfig(config && config.button === "entity" && config.entity ? { ...config, switch: config.entity } : config);
    }
    _forkBuilt(root) {
      const svg = root.querySelector(".illus svg");
      if (svg) svg.innerHTML = HUE_SVG;
    }
    _compute() {
      const m = super._compute(), c = this._cfg(), hass = this._hass, S = (id) => (id ? hass.states[id] : undefined);
      const sw = S(c.switch), main = S(c.entity), pw = S(c.power);
      let watts = null;
      if (pw && !BAD.includes(low(pw))) {
        const v = parseFloat(String(pw.state).replace(",", "."));
        if (Number.isFinite(v)) watts = String(pw.attributes && pw.attributes.unit_of_measurement || "").toLowerCase() === "kw" ? v * 1000 : v;
      }
      const thr = Number(c.threshold ?? 3), plugOff = !!sw && low(sw) === "off";
      if (plugOff) m.status = "off";
      else if (main && !BAD.includes(low(main))) m.status = low(main) === "on" ? "powered" : "standby";
      else if (!c.entity && watts !== null) m.status = watts > thr ? "powered" : "standby";
      else m.status = "unavailable";
      // démarrage : 10 s après le passage de la prise de coupée à allumée (LED violette), quel que soit l'état du switch d'état
      if (plugOff) { this._hsWasOff = true; this._hsBootUntil = 0; }
      else if (this._hsWasOff && sw && !BAD.includes(low(sw))) {
        this._hsWasOff = false; this._hsBootUntil = Date.now() + 10000;
        clearTimeout(this._hsBootT); this._hsBootT = setTimeout(() => { if (this._hass) this._render(this._compute()); }, 10100);
      }
      if (!plugOff && this._hsBootUntil && Date.now() < this._hsBootUntil) m.status = "hue_boot";
      return m;
    }
    _forkRender(m, wrap, root) {
      const c = this._cfg(), hass = this._hass;
      wrap.classList.remove("k-generic");
      wrap.classList.add("k-hue_sync");
      const nm = root.querySelector(".name");
      if (nm && !c.name) nm.textContent = tt(hass, "hue_sync");
      if (m.status === "hue_boot") { const t = root.querySelector(".status span:nth-child(2)"); if (t) t.textContent = tt(hass, "hue_boot"); }
    }
  }, "Appliance – Hue Sync Box (forked)", "Philips Hue Play HDMI Sync Box: plug + status switch, LED states, sleep button.",
    { en: "Hue Sync Box (forked)" });
})();
