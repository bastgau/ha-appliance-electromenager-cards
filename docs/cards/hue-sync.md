# Philips Hue Play HDMI Sync Box

`custom:appliance-hue-sync-card`: the Hue Play HDMI Sync Box (4K / 8K) in front of its TV, with the HDMI cable of the active input highlighted and a colour halo around the screen while the light sync runs.

States and animations:
- **Off**: dark TV, cables grey.
- **Standby**: box on, light sync off (white status light).
- **Video / Game / Music sync**: the picture and the halo drift through colours (slowly in video, fast in game, pulsing in music), the front strip scrolls through the rainbow, the status light is green.

> **Not verified against a real box.** The card reads standard Home Assistant entities, so it should work with any integration that exposes them (for instance the HACS `huesyncbox` integration, whose README lists power, light sync, sync mode, intensity, HDMI input and brightness controls). The exact entity types and names that integration creates were not checked: pick yours in the visual editor. Only the option names below are fixed by this card.

How the status is computed (first available source wins):
1. `entity` (a `media_player` or a `switch`): off means the box is off. On a `media_player`, `playing` means the light sync is running.
2. `sync` (switch): on means the light sync is running (the box is then on, even without `entity`).
3. `power` (plug): off below `standby_threshold` (**0.5 W**), standby up to `threshold` (**3 W**), syncing above. These thresholds are defaults, not measured values: adjust them to your plug.

The sync type comes from `mode` (a `select` whose state contains *video*, *game* or *music*); without it, *video* is assumed.

```yaml
type: custom:appliance-hue-sync-card
entity: media_player.sync_box
sync: switch.sync_box_light_sync     # optional: light sync on/off
mode: select.sync_box_sync_mode      # optional: video / game / music
intensity: select.sync_box_intensity # optional: tile
input: select.sync_box_hdmi_input    # optional: tile + highlighted cable (digit 1-4); else the media_player `source` attribute
power: sensor.sync_box_plug_power    # optional: plug fallback
energy: sensor.sync_box_plug_energy
```

| Option | Description |
|---|---|
| `entity` | `media_player` or `switch` of the box (power). |
| `sync` | Switch of the light sync: standby when off, syncing when on. |
| `mode` | Select of the sync mode (video / game / music): picks the animation and shows a tile. |
| `intensity` | Select of the intensity: shows a tile. |
| `input` | Select of the HDMI input: shows a tile and highlights the cable 1–4. |
| `power` / `switch` | Plug power and switch (fallback and on/off button). |
| `threshold` | Syncing above this power (W). Default 3. |
| `standby_threshold` | Standby above this power (W). Default 0.5. |
| `show_power` / `show_energy` / `show_cost` / `show_toggle` | Checkboxes in the visual editor. |

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see [configuration.md](../configuration.md).
