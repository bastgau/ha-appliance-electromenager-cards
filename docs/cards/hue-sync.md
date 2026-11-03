# Philips Hue Play HDMI Sync Box

`custom:appliance-hue-sync-card`: the Hue Play HDMI Sync Box on its own (silhouette, no logo), with its front LED.

| State | LED |
|---|---|
| **Off** | off |
| **Standby** | purple |
| **On** | white |

How the status is computed (both switches are expected: the box has its own status switch):
1. `switch` (the smart plug): **off** means the box is **off**.
2. `entity` (the box's own status switch): **on** means *On*, **off** means *Standby*. If it is configured but unavailable while the plug is on, the card shows *Unavailable*.
3. Only if `entity` is **not configured**: the `power` sensor of the plug decides, *On* above `threshold` (default **3 W**, not measured: adjust it to your plug), *Standby* otherwise.

```yaml
type: custom:appliance-hue-sync-card
switch: switch.hue_sync_box_plug     # smart plug: off = Off
entity: switch.hue_sync_box          # box status: on = On, off = Standby
power: sensor.hue_sync_box_plug_power  # optional: power tile only
energy: sensor.hue_sync_box_plug_energy
```

| Option | Description |
|---|---|
| `switch` | Smart plug switch: off → *Off*; also the on/off button. |
| `entity` | Switch reflecting the box status: on → *On*, off → *Standby*. |
| `power` | Plug power: shown as a tile, and used for the status only when `entity` is not set. |
| `threshold` | On above this power (W), when `entity` is not set. Default 3. |
| `show_power` / `show_energy` / `show_cost` / `show_toggle` | Checkboxes in the visual editor. |

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see [configuration.md](../configuration.md).
