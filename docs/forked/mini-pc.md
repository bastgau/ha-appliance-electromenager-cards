# Mini PC / Server

`custom:appliance-mini-pc-forked-card`: monitors a machine (Home Assistant server, homelab). A dark mini-PC lying on a USB fan base, two gauges (CPU, RAM), temperature, frequency, uptime, load average, free RAM and one bar per disk. Built for the **System Monitor** sensors (`sensor.systemmonitor_*`), but any sensors work.

What the drawing shows:
- **Orange vents**: they turn red and glow as the CPU temperature goes up (scale 40 → 85 °C).
- **Front LED bar**: blue (ok), orange (warning), red and blinking (critical), off (offline or powered off).
- **Air flow**: the fan base blows air along the machine while the `fan` switch is **on**. The fan button in the header toggles it.
- **Warm air**: small wisps above the box once the temperature is high.

States: `ok`, `warn`, `crit`, `offline` (status entity is not `online`), `off` (power `switch` is off), `unavailable`.

How the state is computed:
1. `switch` off → **Off**.
2. `status`: `online` (or `on` for a `binary_sensor`) → running; `unavailable` → **Unavailable**; any other value → **Offline**. Without `status`, the card is running as soon as `cpu`, `memory` or `cpu_temperature` has a value.
3. Running: **Critical** when the temperature reaches `temperature_crit`; **Warning** when the temperature reaches `temperature_warn`, the CPU `cpu_warn`, the RAM `memory_warn` or a disk `disk_warn`; otherwise **OK**. The alert text lists what is too high.

Default thresholds (not measured on your hardware, adjust them): temperature 75 °C (warning) and 90 °C (critical), CPU 90 %, RAM 90 %, disk 85 %. Temperatures follow `temperature_unit` (°C / °F) or the unit system of Home Assistant.

```yaml
type: custom:appliance-mini-pc-forked-card
name: Nipogi
status: sensor.systemmonitor_status
cpu: sensor.systemmonitor_cpu_load
cpu_temperature: sensor.systemmonitor_processor_temperature
cpu_speed: sensor.systemmonitor_cpu_speed
memory: sensor.systemmonitor_memory_used_percent
memory_used: sensor.systemmonitor_memory_used
memory_free: sensor.systemmonitor_memory_free
load_1: sensor.systemmonitor_load_1m
load_5: sensor.systemmonitor_load_5m
load_15: sensor.systemmonitor_load_15m
uptime: sensor.systemmonitor_last_boot
fan: switch.device_smart_usb_0xa4c138714cd0ac13_l1
disks:
  - entity: sensor.systemmonitor_disk_use_percent
    name: /
  - entity: sensor.systemmonitor_disk_use_percent_diskdata
    name: /diskdata
```

Every entity is optional: a value without an entity is simply not shown.

| Option | Description |
|---|---|
| `status` | Status entity: `online` = running (see above). |
| `cpu` / `memory` | CPU load and RAM used, in %: the two gauges. |
| `memory_used` | RAM used (amount, shown under the RAM gauge). |
| `memory_free` | Free RAM (tile). |
| `cpu_temperature`, `cpu_speed` | Temperature and frequency tiles. The temperature drives the vents. |
| `load_1`, `load_5`, `load_15` | Load average tiles. With `cores`, a load above the number of cores turns red. |
| `uptime` | Last boot: a timestamp sensor (`sensor.systemmonitor_last_boot`) shown as a duration since the boot (months, days, hours or minutes), or a number of seconds / minutes / hours / days. |
| `fan` | Switch of the external fan: toggles with the fan button, starts the air flow. |
| `disks` | List of disks. Each item is an entity, or `{entity, name}`; without `name`, the friendly name of the entity. A bar is drawn when the unit is `%`. Edited in YAML in the visual editor. |
| `switch` | Power switch of the machine (optional, button hidden if unset). Cutting a running server needs two clicks (`confirm_off: false` to disable). |
| `cores` | Number of CPU cores, to colour the load average. |
| `temperature_warn`, `temperature_crit`, `cpu_warn`, `memory_warn`, `disk_warn` | Alert thresholds. |
| `temperature_unit`, `language`, `show_status`, `show_toggle`, `animations`, `labels`, `illustration_size`, `transparent` | Common options. |

Clicking a tile, a gauge or a disk opens the entity; clicking the drawing opens `status`.

Illustration background (card-mod, the grey square behind the drawing is the `.illus` element):

```yaml
card_mod:
  style:
    $: |
      .illus { background: #4a4f57 !important; }
```
