/* Carte « Mini-PC / Serveur » — custom:appliance-mini-pc-forked-card
 * Supervision d'une machine (serveur Home Assistant, homelab) : un mini-PC sombre posé sur un socle
 * ventilateur USB, deux jauges (CPU, RAM), température, fréquence, uptime, load average, RAM libre
 * et une barre par disque. Lit les capteurs de l'intégration System Monitor (sensor.systemmonitor_*).
 * - Les aérations orange du boîtier chauffent avec la température CPU (échelle 40 → 85 °C).
 * - La barre LED est bleue (ok), orange (alerte), rouge (critique) ou éteinte (hors ligne / éteint).
 * - Le flux d'air traverse le socle quand le switch du ventilateur (option fan) est allumé ;
 *   le bouton ventilateur de l'en-tête le bascule.
 * États : ok, warn, crit, offline (statut ≠ online), off (prise coupée), unavailable.
 */
(() => {
  const TAG = 'appliance-mini-pc-forked-card';
  // convention du fork : toute carte créée ici s'appelle appliance-<nom>-forked-card
  if (!/^appliance-[a-z0-9-]+-forked-card$/.test(TAG)) { console.error(`[forked] ${TAG} refusée : le type d'une carte du fork doit finir par -forked-card.`); return; }
  if (customElements.get(TAG)) return;

  const T = {
    "en": {
      "name": "Mini PC / Server",
      "ok": "OK",
      "hot": "Hot",
      "warn": "Warning",
      "critical": "Critical",
      "offline": "Offline",
      "off": "Off",
      "unavailable": "Unavailable",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperature",
      "speed": "Frequency",
      "uptime": "Uptime",
      "load_1": "Load 1 min",
      "load_5": "Load 5 min",
      "load_15": "Load 15 min",
      "memory_used": "RAM used",
      "memory_free": "RAM free",
      "fan": "Fan",
      "disks": "Disks",
      "toggle_fan": "Turn the fan on/off",
      "toggle_power": "Power",
      "confirm_off": "Server running – click again to cut power",
      "a_temp": "CPU too hot",
      "a_cpu": "CPU overloaded",
      "a_memory": "RAM almost full",
      "a_disk": "Disk almost full"
    },
    "fr": {
      "name": "Mini-PC / Serveur",
      "ok": "OK",
      "hot": "Chaud",
      "warn": "Attention",
      "critical": "Critique",
      "offline": "Hors ligne",
      "off": "Éteint",
      "unavailable": "Indisponible",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Température",
      "speed": "Fréquence",
      "uptime": "Uptime",
      "load_1": "Charge 1 min",
      "load_5": "Charge 5 min",
      "load_15": "Charge 15 min",
      "memory_used": "RAM utilisée",
      "memory_free": "RAM libre",
      "fan": "Ventilateur",
      "disks": "Disques",
      "toggle_fan": "Allumer / éteindre le ventilateur",
      "toggle_power": "Alimentation",
      "confirm_off": "Serveur allumé – cliquez à nouveau pour couper",
      "a_temp": "CPU trop chaud",
      "a_cpu": "CPU surchargé",
      "a_memory": "RAM presque pleine",
      "a_disk": "Disque presque plein"
    },
    "de": {
      "name": "Mini-PC / Server",
      "ok": "OK",
      "hot": "Heiß",
      "warn": "Warnung",
      "critical": "Kritisch",
      "offline": "Offline",
      "off": "Aus",
      "unavailable": "Nicht verfügbar",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperatur",
      "speed": "Takt",
      "uptime": "Betriebszeit",
      "load_1": "Last 1 Min.",
      "load_5": "Last 5 Min.",
      "load_15": "Last 15 Min.",
      "memory_used": "RAM belegt",
      "memory_free": "RAM frei",
      "fan": "Lüfter",
      "disks": "Festplatten",
      "toggle_fan": "Lüfter ein/aus",
      "toggle_power": "Stromversorgung",
      "confirm_off": "Server läuft – erneut klicken, um den Strom zu trennen",
      "a_temp": "CPU zu heiß",
      "a_cpu": "CPU überlastet",
      "a_memory": "RAM fast voll",
      "a_disk": "Festplatte fast voll"
    },
    "nb": {
      "name": "Mini-PC / Server",
      "ok": "OK",
      "hot": "Varm",
      "warn": "Advarsel",
      "critical": "Kritisk",
      "offline": "Frakoblet",
      "off": "Av",
      "unavailable": "Utilgjengelig",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperatur",
      "speed": "Frekvens",
      "uptime": "Oppetid",
      "load_1": "Belastning 1 min",
      "load_5": "Belastning 5 min",
      "load_15": "Belastning 15 min",
      "memory_used": "RAM brukt",
      "memory_free": "RAM ledig",
      "fan": "Vifte",
      "disks": "Disker",
      "toggle_fan": "Slå viften av/på",
      "toggle_power": "Strøm",
      "confirm_off": "Serveren kjører – klikk igjen for å kutte strømmen",
      "a_temp": "CPU for varm",
      "a_cpu": "CPU overbelastet",
      "a_memory": "RAM nesten full",
      "a_disk": "Disk nesten full"
    },
    "nl": {
      "name": "Mini-pc / Server",
      "ok": "OK",
      "hot": "Heet",
      "warn": "Waarschuwing",
      "critical": "Kritiek",
      "offline": "Offline",
      "off": "Uit",
      "unavailable": "Niet beschikbaar",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperatuur",
      "speed": "Frequentie",
      "uptime": "Uptime",
      "load_1": "Belasting 1 min",
      "load_5": "Belasting 5 min",
      "load_15": "Belasting 15 min",
      "memory_used": "RAM gebruikt",
      "memory_free": "RAM vrij",
      "fan": "Ventilator",
      "disks": "Schijven",
      "toggle_fan": "Ventilator aan/uit",
      "toggle_power": "Voeding",
      "confirm_off": "Server draait – klik opnieuw om de stroom uit te schakelen",
      "a_temp": "CPU te heet",
      "a_cpu": "CPU overbelast",
      "a_memory": "RAM bijna vol",
      "a_disk": "Schijf bijna vol"
    },
    "ro": {
      "name": "Mini PC / Server",
      "ok": "OK",
      "hot": "Fierbinte",
      "warn": "Avertisment",
      "critical": "Critic",
      "offline": "Offline",
      "off": "Oprit",
      "unavailable": "Indisponibil",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperatură",
      "speed": "Frecvență",
      "uptime": "Timp de funcționare",
      "load_1": "Încărcare 1 min",
      "load_5": "Încărcare 5 min",
      "load_15": "Încărcare 15 min",
      "memory_used": "RAM folosită",
      "memory_free": "RAM liberă",
      "fan": "Ventilator",
      "disks": "Discuri",
      "toggle_fan": "Pornește/oprește ventilatorul",
      "toggle_power": "Alimentare",
      "confirm_off": "Serverul funcționează – apasă din nou pentru a tăia curentul",
      "a_temp": "CPU prea fierbinte",
      "a_cpu": "CPU suprasolicitat",
      "a_memory": "RAM aproape plină",
      "a_disk": "Disc aproape plin"
    },
    "ru": {
      "name": "Мини-ПК / Сервер",
      "ok": "ОК",
      "hot": "Горячий",
      "warn": "Внимание",
      "critical": "Критично",
      "offline": "Не в сети",
      "off": "Выключен",
      "unavailable": "Недоступно",
      "cpu": "ЦП",
      "memory": "ОЗУ",
      "temperature": "Температура",
      "speed": "Частота",
      "uptime": "Время работы",
      "load_1": "Нагрузка 1 мин",
      "load_5": "Нагрузка 5 мин",
      "load_15": "Нагрузка 15 мин",
      "memory_used": "ОЗУ занято",
      "memory_free": "ОЗУ свободно",
      "fan": "Вентилятор",
      "disks": "Диски",
      "toggle_fan": "Включить/выключить вентилятор",
      "toggle_power": "Питание",
      "confirm_off": "Сервер работает – нажмите ещё раз, чтобы отключить питание",
      "a_temp": "ЦП перегрет",
      "a_cpu": "ЦП перегружен",
      "a_memory": "ОЗУ почти заполнено",
      "a_disk": "Диск почти заполнен"
    },
    "sr": {
      "name": "Мини-ПЦ / Сервер",
      "ok": "У реду",
      "hot": "Врућ",
      "warn": "Упозорење",
      "critical": "Критично",
      "offline": "Ван мреже",
      "off": "Искључен",
      "unavailable": "Недоступно",
      "cpu": "ЦПУ",
      "memory": "РАМ",
      "temperature": "Температура",
      "speed": "Фреквенција",
      "uptime": "Време рада",
      "load_1": "Оптерећење 1 мин",
      "load_5": "Оптерећење 5 мин",
      "load_15": "Оптерећење 15 мин",
      "memory_used": "РАМ заузет",
      "memory_free": "РАМ слободан",
      "fan": "Вентилатор",
      "disks": "Дискови",
      "toggle_fan": "Укључи/искључи вентилатор",
      "toggle_power": "Напајање",
      "confirm_off": "Сервер ради – кликните поново да прекинете напајање",
      "a_temp": "ЦПУ је превише врућ",
      "a_cpu": "ЦПУ је преоптерећен",
      "a_memory": "РАМ је скоро пун",
      "a_disk": "Диск је скоро пун"
    },
    "sr-Latn": {
      "name": "Mini PC / Server",
      "ok": "U redu",
      "hot": "Vruć",
      "warn": "Upozorenje",
      "critical": "Kritično",
      "offline": "Van mreže",
      "off": "Isključen",
      "unavailable": "Nedostupno",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperatura",
      "speed": "Frekvencija",
      "uptime": "Vreme rada",
      "load_1": "Opterećenje 1 min",
      "load_5": "Opterećenje 5 min",
      "load_15": "Opterećenje 15 min",
      "memory_used": "RAM zauzet",
      "memory_free": "RAM slobodan",
      "fan": "Ventilator",
      "disks": "Diskovi",
      "toggle_fan": "Uključi/isključi ventilator",
      "toggle_power": "Napajanje",
      "confirm_off": "Server radi – kliknite ponovo da prekinete napajanje",
      "a_temp": "CPU je previše vruć",
      "a_cpu": "CPU je preopterećen",
      "a_memory": "RAM je skoro pun",
      "a_disk": "Disk je skoro pun"
    },
    "it": {
      "name": "Mini PC / Server",
      "ok": "OK",
      "hot": "Caldo",
      "warn": "Attenzione",
      "critical": "Critico",
      "offline": "Offline",
      "off": "Spento",
      "unavailable": "Non disponibile",
      "cpu": "CPU",
      "memory": "RAM",
      "temperature": "Temperatura",
      "speed": "Frequenza",
      "uptime": "Uptime",
      "load_1": "Carico 1 min",
      "load_5": "Carico 5 min",
      "load_15": "Carico 15 min",
      "memory_used": "RAM usata",
      "memory_free": "RAM libera",
      "fan": "Ventola",
      "disks": "Dischi",
      "toggle_fan": "Accendi/spegni la ventola",
      "toggle_power": "Alimentazione",
      "confirm_off": "Server acceso – clicca di nuovo per togliere corrente",
      "a_temp": "CPU troppo calda",
      "a_cpu": "CPU sovraccarica",
      "a_memory": "RAM quasi piena",
      "a_disk": "Disco quasi pieno"
    }
  };
  // libellés de l'éditeur (inline : aucune clé dans src/i18n)
  const E = {
    "en": {
      "status": "Status entity (online)",
      "cpu": "CPU load entity (%)",
      "cpu_temperature": "CPU temperature entity",
      "cpu_speed": "CPU frequency entity",
      "memory": "RAM used entity (%)",
      "memory_used": "RAM used entity (amount)",
      "memory_free": "RAM free entity",
      "load_1": "Load 1 min entity",
      "load_5": "Load 5 min entity",
      "load_15": "Load 15 min entity",
      "uptime": "Last boot entity",
      "fan": "Fan switch (on/off button)",
      "disks": "Disks (list: entity + name)",
      "switch": "Power switch (optional)",
      "cores": "CPU cores (red load above)",
      "temperature_warn": "Hot above",
      "temperature_crit": "Critical above",
      "cpu_warn": "CPU alert above (%)",
      "memory_warn": "RAM alert above (%)",
      "disk_warn": "Disk alert above (%)"
    },
    "fr": {
      "status": "Entité statut (online)",
      "cpu": "Entité charge CPU (%)",
      "cpu_temperature": "Entité température CPU",
      "cpu_speed": "Entité fréquence CPU",
      "memory": "Entité RAM utilisée (%)",
      "memory_used": "Entité RAM utilisée (quantité)",
      "memory_free": "Entité RAM libre",
      "load_1": "Entité charge 1 min",
      "load_5": "Entité charge 5 min",
      "load_15": "Entité charge 15 min",
      "uptime": "Entité dernier démarrage",
      "fan": "Switch du ventilateur (bouton on/off)",
      "disks": "Disques (liste : entité + nom)",
      "switch": "Switch d'alimentation (facultatif)",
      "cores": "Cœurs CPU (charge en rouge au-dessus)",
      "temperature_warn": "Chaud au-dessus de",
      "temperature_crit": "Critique au-dessus de",
      "cpu_warn": "Alerte CPU au-dessus de (%)",
      "memory_warn": "Alerte RAM au-dessus de (%)",
      "disk_warn": "Alerte disque au-dessus de (%)"
    },
    "de": {
      "status": "Status-Entität (online)",
      "cpu": "CPU-Last-Entität (%)",
      "cpu_temperature": "CPU-Temperatur-Entität",
      "cpu_speed": "CPU-Takt-Entität",
      "memory": "RAM-belegt-Entität (%)",
      "memory_used": "RAM-belegt-Entität (Menge)",
      "memory_free": "RAM-frei-Entität",
      "load_1": "Last-1-Min.-Entität",
      "load_5": "Last-5-Min.-Entität",
      "load_15": "Last-15-Min.-Entität",
      "uptime": "Letzter-Start-Entität",
      "fan": "Lüfter-Schalter (Ein/Aus-Taste)",
      "disks": "Festplatten (Liste: Entität + Name)",
      "switch": "Netzschalter (optional)",
      "cores": "CPU-Kerne (Last rot darüber)",
      "temperature_warn": "Heiß über",
      "temperature_crit": "Kritisch über",
      "cpu_warn": "CPU-Warnung über (%)",
      "memory_warn": "RAM-Warnung über (%)",
      "disk_warn": "Festplatten-Warnung über (%)"
    },
    "nb": {
      "status": "Statusentitet (online)",
      "cpu": "CPU-belastning-entitet (%)",
      "cpu_temperature": "CPU-temperatur-entitet",
      "cpu_speed": "CPU-frekvens-entitet",
      "memory": "RAM-brukt-entitet (%)",
      "memory_used": "RAM-brukt-entitet (mengde)",
      "memory_free": "RAM-ledig-entitet",
      "load_1": "Belastning 1 min-entitet",
      "load_5": "Belastning 5 min-entitet",
      "load_15": "Belastning 15 min-entitet",
      "uptime": "Siste oppstart-entitet",
      "fan": "Viftebryter (av/på-knapp)",
      "disks": "Disker (liste: entitet + navn)",
      "switch": "Strømbryter (valgfri)",
      "cores": "CPU-kjerner (rød belastning over)",
      "temperature_warn": "Varm over",
      "temperature_crit": "Kritisk over",
      "cpu_warn": "CPU-varsel over (%)",
      "memory_warn": "RAM-varsel over (%)",
      "disk_warn": "Diskvarsel over (%)"
    },
    "nl": {
      "status": "Statusentiteit (online)",
      "cpu": "CPU-belasting-entiteit (%)",
      "cpu_temperature": "CPU-temperatuur-entiteit",
      "cpu_speed": "CPU-frequentie-entiteit",
      "memory": "RAM-gebruikt-entiteit (%)",
      "memory_used": "RAM-gebruikt-entiteit (hoeveelheid)",
      "memory_free": "RAM-vrij-entiteit",
      "load_1": "Belasting 1 min-entiteit",
      "load_5": "Belasting 5 min-entiteit",
      "load_15": "Belasting 15 min-entiteit",
      "uptime": "Laatste opstart-entiteit",
      "fan": "Ventilatorschakelaar (aan/uit-knop)",
      "disks": "Schijven (lijst: entiteit + naam)",
      "switch": "Voedingsschakelaar (optioneel)",
      "cores": "CPU-cores (belasting rood erboven)",
      "temperature_warn": "Heet boven",
      "temperature_crit": "Kritiek boven",
      "cpu_warn": "CPU-waarschuwing boven (%)",
      "memory_warn": "RAM-waarschuwing boven (%)",
      "disk_warn": "Schijfwaarschuwing boven (%)"
    },
    "ro": {
      "status": "Entitate stare (online)",
      "cpu": "Entitate încărcare CPU (%)",
      "cpu_temperature": "Entitate temperatură CPU",
      "cpu_speed": "Entitate frecvență CPU",
      "memory": "Entitate RAM folosită (%)",
      "memory_used": "Entitate RAM folosită (cantitate)",
      "memory_free": "Entitate RAM liberă",
      "load_1": "Entitate încărcare 1 min",
      "load_5": "Entitate încărcare 5 min",
      "load_15": "Entitate încărcare 15 min",
      "uptime": "Entitate ultima pornire",
      "fan": "Comutator ventilator (buton pornit/oprit)",
      "disks": "Discuri (listă: entitate + nume)",
      "switch": "Comutator alimentare (opțional)",
      "cores": "Nuclee CPU (încărcare roșie peste)",
      "temperature_warn": "Fierbinte peste",
      "temperature_crit": "Critic peste",
      "cpu_warn": "Alertă CPU peste (%)",
      "memory_warn": "Alertă RAM peste (%)",
      "disk_warn": "Alertă disc peste (%)"
    },
    "ru": {
      "status": "Сущность статуса (online)",
      "cpu": "Сущность загрузки ЦП (%)",
      "cpu_temperature": "Сущность температуры ЦП",
      "cpu_speed": "Сущность частоты ЦП",
      "memory": "Сущность занятой ОЗУ (%)",
      "memory_used": "Сущность занятой ОЗУ (объём)",
      "memory_free": "Сущность свободной ОЗУ",
      "load_1": "Сущность нагрузки 1 мин",
      "load_5": "Сущность нагрузки 5 мин",
      "load_15": "Сущность нагрузки 15 мин",
      "uptime": "Сущность последней загрузки",
      "fan": "Переключатель вентилятора (кнопка вкл/выкл)",
      "disks": "Диски (список: сущность + имя)",
      "switch": "Переключатель питания (необязательно)",
      "cores": "Ядра ЦП (нагрузка красным выше)",
      "temperature_warn": "Горячий выше",
      "temperature_crit": "Критично выше",
      "cpu_warn": "Тревога ЦП выше (%)",
      "memory_warn": "Тревога ОЗУ выше (%)",
      "disk_warn": "Тревога диска выше (%)"
    },
    "sr": {
      "status": "Ентитет статуса (online)",
      "cpu": "Ентитет оптерећења ЦПУ (%)",
      "cpu_temperature": "Ентитет температуре ЦПУ",
      "cpu_speed": "Ентитет фреквенције ЦПУ",
      "memory": "Ентитет заузетог РАМ-а (%)",
      "memory_used": "Ентитет заузетог РАМ-а (количина)",
      "memory_free": "Ентитет слободног РАМ-а",
      "load_1": "Ентитет оптерећења 1 мин",
      "load_5": "Ентитет оптерећења 5 мин",
      "load_15": "Ентитет оптерећења 15 мин",
      "uptime": "Ентитет последњег покретања",
      "fan": "Прекидач вентилатора (дугме укљ./искљ.)",
      "disks": "Дискови (листа: ентитет + име)",
      "switch": "Прекидач напајања (опционо)",
      "cores": "Језгра ЦПУ-а (оптерећење црвено изнад)",
      "temperature_warn": "Врућ изнад",
      "temperature_crit": "Критично изнад",
      "cpu_warn": "Упозорење ЦПУ изнад (%)",
      "memory_warn": "Упозорење РАМ изнад (%)",
      "disk_warn": "Упозорење диска изнад (%)"
    },
    "sr-Latn": {
      "status": "Entitet statusa (online)",
      "cpu": "Entitet opterećenja CPU (%)",
      "cpu_temperature": "Entitet temperature CPU",
      "cpu_speed": "Entitet frekvencije CPU",
      "memory": "Entitet zauzetog RAM-a (%)",
      "memory_used": "Entitet zauzetog RAM-a (količina)",
      "memory_free": "Entitet slobodnog RAM-a",
      "load_1": "Entitet opterećenja 1 min",
      "load_5": "Entitet opterećenja 5 min",
      "load_15": "Entitet opterećenja 15 min",
      "uptime": "Entitet poslednjeg pokretanja",
      "fan": "Prekidač ventilatora (dugme uklj./isklj.)",
      "disks": "Diskovi (lista: entitet + ime)",
      "switch": "Prekidač napajanja (opciono)",
      "cores": "Jezgra CPU-a (opterećenje crveno iznad)",
      "temperature_warn": "Vruć iznad",
      "temperature_crit": "Kritično iznad",
      "cpu_warn": "Upozorenje CPU iznad (%)",
      "memory_warn": "Upozorenje RAM iznad (%)",
      "disk_warn": "Upozorenje diska iznad (%)"
    },
    "it": {
      "status": "Entità stato (online)",
      "cpu": "Entità carico CPU (%)",
      "cpu_temperature": "Entità temperatura CPU",
      "cpu_speed": "Entità frequenza CPU",
      "memory": "Entità RAM usata (%)",
      "memory_used": "Entità RAM usata (quantità)",
      "memory_free": "Entità RAM libera",
      "load_1": "Entità carico 1 min",
      "load_5": "Entità carico 5 min",
      "load_15": "Entità carico 15 min",
      "uptime": "Entità ultimo avvio",
      "fan": "Interruttore ventola (pulsante on/off)",
      "disks": "Dischi (elenco: entità + nome)",
      "switch": "Interruttore alimentazione (facoltativo)",
      "cores": "Core CPU (carico rosso sopra)",
      "temperature_warn": "Caldo sopra",
      "temperature_crit": "Critico sopra",
      "cpu_warn": "Allarme CPU sopra (%)",
      "memory_warn": "Allarme RAM sopra (%)",
      "disk_warn": "Allarme disco sopra (%)"
    }
  };
  const editorLabel = (name, hass) => {
    const h = hass || document.querySelector("home-assistant")?.hass;
    const raw = (h && (h.locale?.language || h.language)) || document.documentElement.lang || "en";
    const l = E[raw] ? raw : raw.replace("_", "-").toLowerCase() === "sr-latn" ? "sr-Latn" : raw.toLowerCase().slice(0, 2) === "no" ? "nb" : raw.toLowerCase().slice(0, 2);
    const L = E[l] || E.en;
    return L[name] ?? E.en[name] ?? window.applianceEditorLabel(name, hass);
  };
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch])); // texte → HTML

  const CSS = `
:host{display:block}:host{height:100%} ha-card{height:100%;box-sizing:border-box}
ha-card{display:block;padding:10px 12px 12px;overflow:hidden;--mp-ok:var(--appliance-ok-color,#43a047);--mp-warn:#ffa31a;
  --mp-alert:var(--appliance-alert-color,#db4437);--mp-acc:var(--ac-accent,var(--primary-color));--heat:0;--load:0}
.head{display:flex;align-items:center;gap:8px}
.title{flex:1;min-width:0;font-size:14px;font-weight:500;color:var(--primary-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.badge{font-size:11px;font-weight:600;padding:2px 8px;border-radius:12px;background:var(--secondary-background-color);color:var(--secondary-text-color);white-space:nowrap}
.ok .badge{background:color-mix(in srgb,var(--mp-ok) 22%,transparent);color:var(--mp-ok)}
.warn .badge{background:color-mix(in srgb,var(--mp-warn) 22%,transparent);color:var(--mp-warn)}
.crit .badge{background:color-mix(in srgb,var(--mp-alert) 22%,transparent);color:var(--mp-alert)}
.btn{flex:none;width:30px;height:30px;padding:0;border:0;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;
  background:var(--secondary-background-color);color:var(--secondary-text-color);--mdc-icon-size:18px}
.btn[hidden]{display:none}
.btn.on{background:var(--mp-acc);color:var(--text-primary-color,#fff)}
.btn.confirm{background:var(--mp-alert);color:#fff}
.btn:disabled{opacity:.45;cursor:default}
.btn:focus-visible{outline:2px solid var(--mp-acc);outline-offset:2px}
.btn.fan.on ha-icon{animation:mpspin 1s linear infinite}
@keyframes mpspin{to{transform:rotate(360deg)}}
.top{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:8px;align-items:center;margin-top:4px}
.illus{box-sizing:border-box;border-radius:16px;padding:4px;background:radial-gradient(circle at 50% 40%,rgba(127,127,127,.10),rgba(127,127,127,.03) 70%)}
svg.pc{display:block;width:100%;max-width:calc(220px * var(--illus-scale,1));height:auto;margin:0 auto;overflow:visible;cursor:pointer}
.gauges{display:grid;grid-template-columns:1fr 1fr;gap:6px}
.gauge{text-align:center;min-width:0;cursor:pointer}
.gauge svg{display:block;width:100%;max-width:74px;margin:0 auto}
.gbg{fill:none;stroke:var(--divider-color,rgba(127,127,127,.3));stroke-width:6}
.gfg{fill:none;stroke:var(--mp-acc);stroke-width:6;stroke-linecap:round;stroke-dasharray:var(--p,0) 100;transform:rotate(-90deg);transform-origin:32px 32px;transition:stroke-dasharray .8s,stroke .4s}
.gauge.warn .gfg{stroke:var(--mp-warn)}.gauge.bad .gfg{stroke:var(--mp-alert)}
.gauge.na .gfg{opacity:0}
.gv{fill:var(--primary-text-color);font:600 15px/1 var(--paper-font-body1_-_font-family,Roboto,sans-serif);text-anchor:middle}
.gl{font-size:11px;font-weight:500;color:var(--secondary-text-color);margin-top:1px}
.gs{font-size:10px;color:var(--secondary-text-color);min-height:13px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.alert{display:none;margin-top:6px;font-size:11px;color:var(--mp-alert);font-weight:500;text-align:center}
.alert.on{display:block}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(88px,1fr));gap:6px;margin-top:8px}
.tile{box-sizing:border-box;background:var(--secondary-background-color);border-radius:10px;padding:5px 7px;min-width:0;overflow:hidden;text-align:center}
.tile .l{display:flex;align-items:center;justify-content:center;gap:3px;font-size:10px;line-height:14px;color:var(--secondary-text-color);min-width:0}
.tile .l span{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.tile .l ha-icon{--mdc-icon-size:13px;flex:none}
.tile .v{font-size:14px;line-height:18px;font-weight:600;color:var(--primary-text-color);margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tile .v small{font-size:10px;font-weight:400;color:var(--secondary-text-color);margin-left:2px}
.tile.bad .v{color:var(--mp-alert)}
.disks{display:flex;flex-direction:column;gap:7px;margin-top:10px}
.disk{min-width:0}
.disk .r{display:flex;justify-content:space-between;gap:8px;font-size:12px;color:var(--primary-text-color)}
.disk .dn{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;display:flex;align-items:center;gap:4px}
.disk .dn ha-icon{--mdc-icon-size:14px;color:var(--secondary-text-color);flex:none}
.disk .dv{font-weight:600;white-space:nowrap}
.bar{height:6px;border-radius:3px;background:var(--divider-color,rgba(127,127,127,.3));margin-top:3px;overflow:hidden}
.bar i{display:block;height:100%;border-radius:3px;background:var(--mp-acc);transition:width .8s}
.disk.bad .bar i{background:var(--mp-alert)}.disk.bad .dv{color:var(--mp-alert)}
[data-e]:focus-visible{outline:2px solid var(--mp-acc);outline-offset:2px}

/* ---- illustration ---- */
.dev{transition:opacity .4s,filter .4s}
.offline .dev,.off .dev,.unavailable .dev{opacity:.55;filter:grayscale(.7)}
/* aérations : orange doux à froid, rouge vif et lueur à chaud (--heat de 0 à 1) */
.vent{fill:none;stroke:#ff9a2e;stroke-width:1.5;stroke-linecap:round;opacity:.55;
  stroke:color-mix(in srgb,#ff3b30 calc(var(--heat,0) * 100%),#ff9a2e);opacity:calc(.5 + var(--heat,0) * .5);
  filter:drop-shadow(0 0 calc(.5px + var(--heat,0) * 2.5px) #ff8a2e);transition:stroke .6s,opacity .6s}
.offline .vent,.off .vent,.unavailable .vent{stroke:#4a4f57;filter:none;opacity:.7}
/* barre LED */
.led{fill:none;stroke:#2f7bff;stroke-width:2.2;stroke-linecap:round;filter:drop-shadow(0 0 2px #2f7bff);transition:stroke .4s}
.warn .led{stroke:#ffa31a;filter:drop-shadow(0 0 2px #ffa31a)}
.crit .led{stroke:#ff3b30;filter:drop-shadow(0 0 2px #ff3b30);animation:mpblink 1s steps(2) infinite}
.offline .led,.off .led,.unavailable .led{stroke:#3a4048;filter:none}
@keyframes mpblink{50%{opacity:.3}}
/* flux d'air du ventilateur : traverse le socle puis longe le boîtier */
.air{fill:none;stroke:#8fd3ff;stroke-width:1.6;stroke-linecap:round;stroke-dasharray:4 7;opacity:0;transition:opacity .5s}
.fanon .air{opacity:.9;animation:mpair calc(1.7s - var(--load,0) * .9s) linear infinite}
.air:nth-of-type(2n){animation-delay:-.6s!important}
@keyframes mpair{to{stroke-dashoffset:-22}}
/* filets d'air chaud au-dessus du boîtier quand il chauffe */
.wisp{fill:none;stroke:#ffb36b;stroke-width:1.5;stroke-linecap:round;stroke-dasharray:3 6;opacity:calc(var(--heat,0) * 1.5 - .6)}
.ok .wisp,.warn .wisp,.crit .wisp{animation:mpair 2.2s linear infinite}
.noanim *{animation:none!important}
`;

  // --- géométrie du dessin : mini-PC en vue isométrique (hauteur H, faces avant gauche / droite) ---
  const H = 26;
  const lf = (t, dy) => [25 + 60 * t, 58 + 34 * t + dy];  // point de l'arête haute de la face avant gauche, dy plus bas
  const rf = (t, dy) => [85 + 60 * t, 92 - 34 * t + dy];  // idem face avant droite
  const pt = (p) => `${p[0].toFixed(1)} ${p[1].toFixed(1)}`;
  const slats = (fn, t0, t1, n, y0, y1) => Array.from({ length: n }, (_, i) => {
    const t = t0 + (t1 - t0) * i / (n - 1);
    return `M${pt(fn(t, y0))}L${pt(fn(t, y1))}`;
  }).join('');
  const slot = (fn, t0, t1, y0, y1, fill) => `<path d="M${pt(fn(t0, y0))}L${pt(fn(t1, y0))}L${pt(fn(t1, y1))}L${pt(fn(t0, y1))}Z" fill="${fill}"/>`;
  const ports = [[0.10, 0.13], [0.29, 0.11], [0.44, 0.11], [0.62, 0.07], [0.73, 0.07]]
    .map(([t, w]) => slot(lf, t, t + w, 16, 21, '#0b0c0e')).join('');

  const SVG = (label) => `
<svg class="pc" viewBox="0 0 170 150" role="img" aria-label="${esc(label)}">
 <defs>
  <linearGradient id="mptop" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#454b53"/><stop offset=".55" stop-color="#2a2e34"/><stop offset="1" stop-color="#1c1f23"/></linearGradient>
  <linearGradient id="mplf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f343a"/><stop offset="1" stop-color="#16191c"/></linearGradient>
  <linearGradient id="mprf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22262b"/><stop offset="1" stop-color="#0e1012"/></linearGradient>
  <linearGradient id="mpsl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1d2024"/><stop offset="1" stop-color="#0b0c0e"/></linearGradient>
  <radialGradient id="mpsh"><stop offset="0" stop-color="#000" stop-opacity=".38"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>
 </defs>
 <ellipse cx="85" cy="118" rx="76" ry="25" fill="url(#mpsh)"/>
 <g class="dev">
  <!-- pieds et câble USB du socle ventilateur -->
  <g fill="#08090a"><ellipse cx="22" cy="99" rx="6" ry="3"/><ellipse cx="85" cy="136" rx="7" ry="3.2"/><ellipse cx="148" cy="99" rx="6" ry="3"/></g>
  <path d="M27 92C12 94 6 106 11 116C16 126 30 129 42 125" fill="none" stroke="#0c0d0f" stroke-width="2.6" stroke-linecap="round"/>
  <path d="M27 92C12 94 6 106 11 116C16 126 30 129 42 125" fill="none" stroke="#3a4048" stroke-width=".5" stroke-linecap="round" stroke-opacity=".6"/>
  <g transform="rotate(-22 46 123)"><rect x="40" y="120.500" width="11" height="6" rx="1.200" fill="#8c939b" stroke="#0c0d0f" stroke-width=".6"/><rect x="42" y="122" width="7" height="3" rx=".5" fill="#2b2f34"/></g>
  <!-- socle ventilateur : plateau (partiellement caché) et deux faces -->
  <path d="M19 84L85 46.600L151 84L85 121.400Z" fill="#101215" stroke="#101215" stroke-width="2" stroke-linejoin="round"/>
  <path d="M19 84L85 121.400V133.400L19 96Z" fill="url(#mpsl)" stroke="#0b0c0e" stroke-width="2" stroke-linejoin="round"/>
  <path d="M85 121.400L151 84V96L85 133.400Z" fill="url(#mpsl)" stroke="#0b0c0e" stroke-width="2" stroke-linejoin="round"/>
  <path d="M19 84L85 121.400L151 84" fill="none" stroke="#4a5058" stroke-width=".6" stroke-opacity=".7"/>
  <!-- mini-PC -->
  <path d="M25 58L85 92V${92 + H}L25 ${58 + H}Z" fill="url(#mplf)" stroke="#16191c" stroke-width="3" stroke-linejoin="round"/>
  <path d="M85 92L145 58V${58 + H}L85 ${92 + H}Z" fill="url(#mprf)" stroke="#0e1012" stroke-width="3" stroke-linejoin="round"/>
  ${slot(lf, 0.10, 0.84, 2.500, 12.500, '#0a0b0c')}
  <path class="vent" d="${slats(lf, 0.14, 0.80, 17, 4.500, 10.500)}"/>
  ${slot(rf, 0.12, 0.62, 2.500, 12.500, '#0a0b0c')}
  <path class="vent" d="${slats(rf, 0.16, 0.58, 11, 4.500, 10.500)}"/>
  ${ports}
  <path class="led" d="M${pt(rf(0.2, 20))}L${pt(rf(0.52, 20))}"/>
  <circle cx="${rf(0.8, 15)[0].toFixed(1)}" cy="${rf(0.8, 15)[1].toFixed(1)}" r="2.600" fill="#15181b" stroke="#5a626c" stroke-width=".7"/>
  <path d="M25 58L85 24L145 58L85 92Z" fill="url(#mptop)" stroke="#2a2e34" stroke-width="3" stroke-linejoin="round"/>
  <path d="M25 58L85 92L145 58" fill="none" stroke="#7b848e" stroke-width=".7" stroke-opacity=".6"/>
  <path d="M37 58L85 31L133 58L85 85Z" fill="none" stroke="#fff" stroke-width=".5" stroke-opacity=".08"/>
 </g>
 <!-- flux d'air du ventilateur (de bas en haut, de chaque côté du boîtier) -->
 <path class="air" d="M24 90C12 80 10 66 20 54"/>
 <path class="air" d="M17 92C4 80 2 64 12 50"/>
 <path class="air" d="M146 90C158 80 160 66 150 54"/>
 <path class="air" d="M153 92C166 80 168 64 158 50"/>
 <!-- air chaud au-dessus du boîtier -->
 <path class="wisp" d="M62 54C58 46 66 42 62 32"/>
 <path class="wisp" d="M85 50C81 42 89 38 85 28"/>
 <path class="wisp" d="M108 54C104 46 112 42 108 32"/>
</svg>`;

  const TILES = [
    ['temperature', 'mdi:thermometer', 'cpu_temperature'],
    ['speed', 'mdi:speedometer', 'cpu_speed'],
    ['uptime', 'mdi:clock-outline', 'uptime'],
    ['load_1', 'mdi:gauge', 'load_1'],
    ['load_5', 'mdi:gauge', 'load_5'],
    ['load_15', 'mdi:gauge', 'load_15'],
    ['memory_free', 'mdi:memory', 'memory_free'],
  ];

  class ApplianceMiniPcCard extends HTMLElement {

    // config exposée sous le nom standard : card-mod (findConfig) lit node.config / node._config
    get _config() { return this._c; }
    static getConfigElement() { return document.createElement(TAG + '-editor'); }
    static getStubConfig(hass) {
      const ids = Object.keys((hass && hass.states) || {});
      const f = (re, dom = 'sensor') => ids.find((i) => i.startsWith(dom + '.') && re.test(i)) || '';
      const cfg = {
        status: f(/systemmonitor.*status|status.*systemmonitor/),
        cpu: f(/systemmonitor_(cpu_load|processor_use)|processor_use/),
        cpu_temperature: f(/processor_temperature|cpu_temperature/),
        cpu_speed: f(/cpu_speed|processor_frequency/),
        memory: f(/memory_used_percent|memory_use_percent/),
        memory_used: f(/systemmonitor_memory_used$/),
        memory_free: f(/systemmonitor_memory_free$/),
        load_1: f(/load_1m|load_1$/), load_5: f(/load_5m|load_5$/), load_15: f(/load_15m|load_15$/),
        uptime: f(/last_boot|uptime/),
      };
      const disks = ids.filter((i) => i.startsWith('sensor.') && /systemmonitor.*disk_use_percent/.test(i)).map((entity) => ({ entity }));
      if (disks.length) cfg.disks = disks;
      return cfg;
    }
    setConfig(c) {
      if (window.applianceSize) window.applianceSize(this, c);
      if (!c || typeof c !== 'object') throw new Error('Invalid configuration');
      this._c = { show_status: true, cpu_warn: 90, memory_warn: 90, disk_warn: 85, ...c };
      this._built = false;
      if (this._hass) this._render();
    }
    set hass(h) { this._hass = h; if (this._c) this._render(); }
    getCardSize() { return 6; }
    getGridOptions() { return { columns: 12, min_columns: 3, rows: 'auto', min_rows: 1 }; }

    _t(k) { return T[this._lang()][k] ?? T.en[k] ?? k; }
    // libellé perso (option labels) sinon traduction
    _l(k) { const L = this._c && this._c.labels; return L && L[k] != null && L[k] !== '' ? String(L[k]) : this._t(k); }
    _lang() { const l = (this._c.language || (this._hass && this._hass.language) || 'en').slice(0, 2); return T[l] ? l : 'en'; }
    _loc() { return (this._hass && this._hass.locale && this._hass.locale.language) || this._lang(); }
    _st(id) { return id && this._hass.states[id]; }
    _num(id) {
      const s = this._st(id); if (!s) return NaN;
      const v = parseFloat(String(s.state).replace(',', '.'));
      return isFinite(v) ? v : NaN;
    }
    _unit(id, d = '') { const s = this._st(id); return (s && s.attributes && s.attributes.unit_of_measurement) || d; }
    _fmt(v, d = 0) { return isNaN(v) ? '--' : v.toLocaleString(this._loc(), { maximumFractionDigits: d, minimumFractionDigits: 0 }); }
    _more(id) { if (id) this.dispatchEvent(new CustomEvent('hass-more-info', { detail: { entityId: id }, bubbles: true, composed: true })); }
    // durée depuis le dernier démarrage : timestamp (last_boot) ou nombre (s, min, h, d)
    _uptime(id) {
      const s = this._st(id); if (!s) return null;
      const raw = String(s.state); let sec;
      if (/^\d{4}-\d\d-\d\dT/.test(raw) || (s.attributes && s.attributes.device_class === 'timestamp')) {
        const t = Date.parse(raw); if (isNaN(t)) return null; sec = (Date.now() - t) / 1000;
      } else {
        const v = parseFloat(raw.replace(',', '.')); if (!isFinite(v)) return null;
        const u = this._unit(id, 's').toLowerCase();
        sec = u === 'd' ? v * 86400 : u === 'h' ? v * 3600 : u === 'min' ? v * 60 : v;
      }
      if (sec < 0) return null;
      const fmt = (n, unit) => {
        // mois en toutes lettres : l'abréviation courte (« m. ») se confond avec les minutes
        try { return new Intl.NumberFormat(this._loc(), { style: 'unit', unit, unitDisplay: unit === 'month' ? 'long' : 'short', maximumFractionDigits: 0 }).format(n); }
        catch (e) { return `${n} ${unit}`; }
      };
      const d = sec / 86400;
      return d >= 60 ? fmt(Math.floor(d / 30), 'month') : d >= 2 ? fmt(Math.floor(d), 'day') : sec >= 3600 ? fmt(Math.floor(sec / 3600), 'hour') : fmt(Math.floor(sec / 60), 'minute');
    }
    _toggle(id) {
      const s = this._st(id); if (!s || !this._hass) return;
      this._hass.callService(id.split('.')[0], 'toggle', { entity_id: id });
    }
    // alimentation : couper un serveur allumé demande un second clic (confirm_off: false pour désactiver)
    _power() {
      const id = this._c.switch, s = this._st(id); if (!s) return;
      if (s.state === 'on' && this._c.confirm_off !== false) {
        if (!(this._arm && Date.now() < this._arm)) {
          this._arm = Date.now() + 4000; this._render();
          clearTimeout(this._armT); this._armT = setTimeout(() => this._render(), 4100);
          return;
        }
        this._arm = 0;
      }
      this._toggle(id);
    }

    _build() {
      const root = this.shadowRoot || this.attachShadow({ mode: 'open' });
      const c = this._c;
      root.innerHTML = `<style>${CSS}</style><ha-card>
        <div class="head"><div class="title" id="mptitle"></div><div class="badge" id="mpbadge"></div>
          <button class="btn fan" id="mpfan" hidden><ha-icon icon="mdi:fan"></ha-icon></button>
          <button class="btn" id="mppwr" hidden><ha-icon icon="mdi:power"></ha-icon></button></div>
        <div class="top">
          <div class="illus">${SVG(c.name || this._t('name'))}</div>
          <div class="gauges">
            ${['cpu', 'memory'].map((k) => `<div class="gauge na" data-g="${k}"><svg viewBox="0 0 64 64"><circle class="gbg" cx="32" cy="32" r="26"/><circle class="gfg" cx="32" cy="32" r="26" pathLength="100"/><text class="gv" x="32" y="37">--</text></svg><div class="gl"></div><div class="gs"></div></div>`).join('')}
          </div>
        </div>
        <div class="alert" id="mpalert"></div>
        <div class="tiles" id="mptiles"></div>
        <div class="disks" id="mpdisks"></div>
      </ha-card>`;
      this._root = root; this._card = root.querySelector('ha-card'); this._built = true; this._sig = {};
      root.querySelector('svg.pc').addEventListener('click', () => this._more(this._c.status || this._c.cpu_temperature || this._c.cpu));
      root.querySelectorAll('.gauge').forEach((el) => el.addEventListener('click', () => this._more(el.dataset.g === 'cpu' ? this._c.cpu : this._c.memory)));
      root.getElementById('mpfan').addEventListener('click', (e) => { e.stopPropagation(); this._toggle(this._c.fan); });
      root.getElementById('mppwr').addEventListener('click', (e) => { e.stopPropagation(); this._power(); });
      // tuiles et disques : clic ou Entrée sur un élément [data-e] ouvre la fiche de son entité
      if (window.applianceLinkTiles) { window.applianceLinkTiles(root.getElementById('mptiles'), this); window.applianceLinkTiles(root.getElementById('mpdisks'), this); }
    }

    _disks() {
      const c = this._c, list = Array.isArray(c.disks) ? c.disks : c.disks ? [c.disks] : [];
      return list.map((d) => (typeof d === 'string' ? { entity: d } : d)).filter((d) => d && d.entity).map((d) => {
        const s = this._st(d.entity), v = this._num(d.entity), u = this._unit(d.entity, '%');
        const name = d.name || (s && s.attributes && s.attributes.friendly_name) || d.entity;
        const pct = u === '%' ? v : NaN;
        return { e: d.entity, name, v, u, pct, bad: !isNaN(pct) && pct >= Number(c.disk_warn) };
      });
    }

    _compute() {
      const c = this._c, h = this._hass, tp = window.applianceTemp(h, c);
      const sSt = this._st(c.status), sw = this._st(c.switch);
      const raw = sSt ? String(sSt.state).toLowerCase() : '';
      let up;
      if (sSt) up = /^(unavailable|unknown|none|)$/.test(raw) ? null : (sSt.entity_id.startsWith('binary_sensor.') ? raw === 'on' : raw === 'online' || raw === 'on');
      else up = ['cpu', 'memory', 'cpu_temperature'].some((k) => c[k] && !isNaN(this._num(c[k]))) ? true : null;
      const cpu = this._num(c.cpu), mem = this._num(c.memory);
      const temp = tp.conv(this._num(c.cpu_temperature), this._st(c.cpu_temperature));
      const warnT = Number(c.temperature_warn ?? tp.c(75)), critT = Number(c.temperature_crit ?? tp.c(90));
      const disks = this._disks();
      const alerts = [];
      let st;
      if (sw && sw.state === 'off') st = 'off';
      else if (up === null) st = 'unavailable';
      else if (!up) st = 'offline';
      else {
        if (!isNaN(temp) && temp >= warnT) alerts.push('a_temp');
        if (!isNaN(cpu) && cpu >= Number(c.cpu_warn)) alerts.push('a_cpu');
        if (!isNaN(mem) && mem >= Number(c.memory_warn)) alerts.push('a_memory');
        if (disks.some((d) => d.bad)) alerts.push('a_disk');
        st = !isNaN(temp) && temp >= critT ? 'crit' : alerts.length ? 'warn' : 'ok';
      }
      const badge = st === 'crit' ? 'critical' : st === 'warn' ? (alerts.includes('a_temp') ? 'hot' : 'warn') : st === 'ok' ? 'ok' : st;
      const tC = tp.toC(temp);
      const heat = st === 'ok' || st === 'warn' || st === 'crit' ? (isNaN(tC) ? 0 : Math.max(0, Math.min(1, (tC - 40) / 45))) : 0;
      return { st, badge, alerts, cpu, mem, temp, tp, disks, heat, warnT, critT };
    }

    _render() {
      if (!this._built) this._build();
      const c = this._c, r = this._root, card = this._card, self = this;
      const { st, badge, alerts, cpu, mem, temp, tp, disks, heat } = this._compute();
      const fanS = this._st(c.fan), fanOn = !!fanS && fanS.state === 'on';
      const clamp = (x) => Math.max(0, Math.min(1, x));
      card.className = `${st} ${fanOn && !['off', 'offline', 'unavailable'].includes(st) ? 'fanon' : ''} ${c.animations === false ? 'noanim' : ''}`;
      card.style.setProperty('--heat', heat.toFixed(3));
      card.style.setProperty('--load', (isNaN(cpu) ? 0 : clamp(cpu / 100)).toFixed(3));

      r.getElementById('mptitle').textContent = c.name || this._t('name');
      const b = r.getElementById('mpbadge'); b.textContent = this._t(badge); b.style.display = c.show_status === false ? 'none' : '';
      const al = r.getElementById('mpalert'); al.textContent = alerts.map((a) => this._t(a)).join(' · '); al.classList.toggle('on', alerts.length > 0);

      // boutons : ventilateur (bascule) et alimentation (second clic pour couper)
      const fb = r.getElementById('mpfan'); fb.hidden = !c.fan;
      fb.classList.toggle('on', fanOn); fb.disabled = !fanS || fanS.state === 'unavailable';
      fb.title = fb.ariaLabel = this._l('toggle_fan'); fb.setAttribute('aria-pressed', String(fanOn));
      const pb = r.getElementById('mppwr'), sw = this._st(c.switch); pb.hidden = !c.switch || c.show_toggle === false;
      const armed = !!(this._arm && Date.now() < this._arm);
      pb.classList.toggle('on', !!sw && sw.state === 'on'); pb.classList.toggle('confirm', armed);
      pb.disabled = !sw || sw.state === 'unavailable';
      pb.title = pb.ariaLabel = armed ? this._l('confirm_off') : this._l('toggle_power');
      pb.setAttribute('aria-pressed', String(!!sw && sw.state === 'on'));
      pb.querySelector('ha-icon').setAttribute('icon', armed ? 'mdi:alert' : 'mdi:power');

      // jauges CPU et RAM
      const G = {
        cpu: [cpu, Number(c.cpu_warn), this._l('cpu'), ''],
        memory: [mem, Number(c.memory_warn), this._l('memory'), (() => { const u = this._num(c.memory_used); return isNaN(u) ? '' : `${this._fmt(u, u < 100 ? 2 : 0)} ${this._unit(c.memory_used)}`.trim(); })()],
      };
      r.querySelectorAll('.gauge').forEach((el) => {
        const [v, warn, label, sub] = G[el.dataset.g];
        el.classList.toggle('na', isNaN(v)); el.classList.toggle('warn', !isNaN(v) && v >= warn && v < 97);
        el.classList.toggle('bad', !isNaN(v) && v >= Math.max(warn, 97));
        el.style.setProperty('--p', isNaN(v) ? '0' : String(Math.max(0, Math.min(100, v))));
        el.querySelector('.gv').textContent = isNaN(v) ? '--' : `${Math.round(v)}%`;
        el.querySelector('.gl').textContent = label; el.querySelector('.gs').textContent = sub;
        el.hidden = el.dataset.g === 'cpu' ? !c.cpu : !c.memory;
      });

      // tuiles (reconstruites seulement si le contenu change)
      const cores = Number(c.cores);
      const tileHtml = TILES.map(([k, ic, opt]) => {
        const id = c[opt]; if (!id || !self._st(id)) return '';
        let val, unit = '', bad = false;
        if (k === 'temperature') { val = isNaN(temp) ? '--' : self._fmt(temp, 0); unit = tp.unit; bad = !isNaN(temp) && alerts.includes('a_temp'); }
        else if (k === 'uptime') { val = self._uptime(id) ?? '--'; }
        else if (k.startsWith('load_')) { const v = self._num(id); val = self._fmt(v, 2); bad = cores > 0 && !isNaN(v) && v > cores; }
        else { const v = self._num(id); val = self._fmt(v, v < 100 ? 2 : 0); unit = self._unit(id); }
        const a = window.applianceTileAttrs ? window.applianceTileAttrs(id) : '';
        return `<div class="tile${bad ? ' bad' : ''}"${a}><div class="l"><ha-icon icon="${ic}"></ha-icon><span>${esc(self._l(k))}</span></div><div class="v">${esc(val)}${unit ? `<small>${esc(unit)}</small>` : ''}</div></div>`;
      }).join('');
      if (tileHtml !== this._sig.tiles) { r.getElementById('mptiles').innerHTML = tileHtml; this._sig.tiles = tileHtml; }

      // disques : une barre par entité
      const diskHtml = disks.map((d) => {
        const a = window.applianceTileAttrs ? window.applianceTileAttrs(d.e) : '';
        const val = isNaN(d.v) ? '--' : `${this._fmt(d.v, 1)} ${d.u}`.trim();
        return `<div class="disk${d.bad ? ' bad' : ''}"${a}><div class="r"><span class="dn"><ha-icon icon="mdi:harddisk"></ha-icon>${esc(d.name)}</span><span class="dv">${esc(val)}</span></div>`
          + (isNaN(d.pct) ? '' : `<div class="bar"><i style="width:${Math.max(0, Math.min(100, d.pct))}%"></i></div>`) + '</div>';
      }).join('');
      if (diskHtml !== this._sig.disks) { r.getElementById('mpdisks').innerHTML = diskHtml; this._sig.disks = diskHtml; }
    }
  }
  customElements.define(TAG, ApplianceMiniPcCard);

  /* ---- éditeur visuel ---- */
  class ApplianceMiniPcCardEditor extends HTMLElement {
    setConfig(c) { this._c = c; this._draw(); }
    set hass(h) { this._hass = h; if (this._form) this._form.hass = h; }
    _draw() {
      if (!this._form) {
        this._form = document.createElement('ha-form');
        this._form.addEventListener('value-changed', (e) => {
          this._c = e.detail.value;
          this.dispatchEvent(new CustomEvent('config-changed', { detail: { config: this._c }, bubbles: true, composed: true }));
        });
        this.appendChild(this._form);
      }
      const ent = (name, domain) => ({ name, selector: { entity: domain ? { domain } : {} } });
      const num = (name, min, max, step, def, unit) => ({ name, default: def, selector: { number: { min, max, step, mode: 'box', ...(unit ? { unit_of_measurement: unit } : {}) } } });
      const bool = (name) => ({ name, selector: { boolean: {} }, default: true });
      this._form.hass = this._hass;
      this._form.data = this._c;
      this._form.schema = [
        { name: 'name', selector: { text: {} } },
        { name: 'labels', selector: { object: {} } },
        { name: 'illustration_size', selector: { number: { min: 30, max: 300, step: 5, mode: 'slider', unit_of_measurement: '%' } } },
        { name: 'transparent', selector: { boolean: {} } },
        ent('status', ['sensor', 'binary_sensor']), ent('cpu', 'sensor'), ent('cpu_temperature', 'sensor'), ent('cpu_speed', 'sensor'),
        ent('memory', 'sensor'), ent('memory_used', 'sensor'), ent('memory_free', 'sensor'),
        ent('load_1', 'sensor'), ent('load_5', 'sensor'), ent('load_15', 'sensor'), ent('uptime', 'sensor'),
        { name: 'disks', selector: { object: {} } },
        ent('fan', ['switch', 'input_boolean']), ent('switch', ['switch', 'input_boolean']),
        { type: 'grid', name: '', schema: [num('cores', 0, 128, 1, 0), num('temperature_warn', 0, 200, 1), num('temperature_crit', 0, 200, 1),
          num('cpu_warn', 10, 100, 1, 90, '%'), num('memory_warn', 10, 100, 1, 90, '%'), num('disk_warn', 10, 100, 1, 85, '%')] },
        window.applianceTempField,
        { name: 'language', selector: { select: { options: Object.keys(T).map((value) => ({ value, label: { fr: 'Français', en: 'English', de: 'Deutsch', it: 'Italiano', nb: 'Norsk bokmål', ro: 'Română', nl: 'Nederlands', ru: 'Русский', sr: 'Српски', 'sr-Latn': 'Srpski (latinica)' }[value] || value })) } } },
        { type: 'grid', name: '', schema: [bool('show_status'), bool('show_toggle'), bool('animations')] },
      ];
      this._form.computeLabel = (s) => editorLabel(s.name, this._hass);
    }
  }
  customElements.define(TAG + '-editor', ApplianceMiniPcCardEditor);

  window.customCards = window.customCards || [];
  window.customCards.push({
    type: TAG, forked: true, name: 'Appliance – Mini PC monitor (forked)',
    names: { en: 'Mini PC monitor (forked)', fr: 'Supervision mini-PC (forked)', de: 'Mini-PC-Überwachung (forked)' },
    description: 'Supervision d\'un mini-PC ou serveur (System Monitor) : CPU, RAM, température, load, disques, uptime, ventilateur externe.', preview: true,
    documentationURL: 'https://github.com/skyrotter/ha-appliance-electromenager-cards',
  });
})();
