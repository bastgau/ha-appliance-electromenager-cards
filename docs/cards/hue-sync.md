# Philips Hue Play HDMI Sync Box

`custom:appliance-hue-sync-card`: the Hue Play HDMI Sync Box on its own (silhouette, no logo), with its front LED.

| State | LED |
|---|---|
| **Off** | off |
| **Standby** | purple |
| **On** | white |

How the status is computed:
1. `switch` (the smart plug): **off** means the box is **off**.
2. `entity` (a second switch, the box's own status): **on** means *On*, **off** means *Standby*.
3. Without `entity`, the `power` sensor of the plug decides: off below `standby_threshold` (**0.5 W**), standby up to `threshold` (**3 W**), on above. These thresholds are defaults, not measured values: adjust them to your plug.

```yaml
type: custom:appliance-hue-sync-card
switch: switch.hue_sync_box_plug     # smart plug: off = Off
entity: switch.hue_sync_box          # box status: on = On, off = Standby
power: sensor.hue_sync_box_plug_power  # optional
energy: sensor.hue_sync_box_plug_energy
```

| Option | Description |
|---|---|
| `switch` | Smart plug switch: off → *Off*; also the on/off button. |
| `entity` | Switch reflecting the box status: on → *On*, off → *Standby*. |
| `power` | Plug power, used when `entity` is not set. |
| `threshold` | On above this power (W). Default 3. |
| `standby_threshold` | Standby above this power (W). Default 0.5. |
| `show_power` / `show_energy` / `show_cost` / `show_toggle` | Checkboxes in the visual editor. |

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see [configuration.md](../configuration.md).
