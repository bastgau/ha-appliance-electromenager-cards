# TV box (forked)

`custom:appliance-tv-box-forked-card`: a TV box on its own, drawn as a flat rounded puck in the style of the Xiaomi TV Box S (vector drawing, no logo, no photo), with its front LED. It looks and works like the [Hue Sync Box card](hue-sync.md) and has **exactly the same options**.

> The upstream project has its own `custom:appliance-tv-box-card`: a media-player card (floating screen with the artwork, remote buttons, three photo models). The two cards are independent and can be used side by side. This one only follows the **power state** of the box through two switches, and has no media controls.

The card is **independent** of the Hue card: it has its own copy of the status logic, its own CSS and its own drawing. Only the common tooling of the fork (sleep button, injected style, editor fields) is shared.

| State | LED |
|---|---|
| **Off** | off |
| **Starting** | purple (10 s after the plug is switched on) |
| **Standby** | red |
| **On** | white |

How the status is computed (both switches are expected: the box has its own status switch):
0. **Starting**: for 10 s after the plug goes from off to on, whatever the status switch says (it may be unavailable while the box boots).
1. `switch` (the smart plug): **off** means the box is **off**.
2. `entity` (the box's own status switch): **on** means *On*, **off** means *Standby*. If it is configured but unavailable while the plug is on, the card shows *Unavailable*.
3. Only if `entity` is **not configured**: the `power` sensor of the plug decides, *On* above `threshold` (default **3 W**, not measured: adjust it to your plug), *Standby* otherwise.

```yaml
type: custom:appliance-tv-box-forked-card
switch: switch.tv_box_plug           # smart plug: off = Off
entity: switch.tv_box                # box status: on = On, off = Standby
button: entity                       # optional: which switch the on/off button toggles: switch (the plug, default) or entity (box status)
sleep: button.tv_box_sleep           # optional: sleep button (visible while the box is On)
power: sensor.tv_box_plug_power      # optional
energy: sensor.tv_box_plug_energy
```

| Option | Description |
|---|---|
| `switch` | Smart plug switch: off → *Off*. It is also the on/off button, unless `button: entity`. |
| `entity` | Switch reflecting the box status: on → *On*, off → *Standby*. |
| `button` | Which of the two switches the on/off button toggles (and whose state it shows): `switch` (the plug, default) or `entity` (the box status switch). |
| `sleep` | A `button` / `input_button` (pressed) or `switch` / `input_boolean` (toggled). A `mdi:sleep-off` button appears to the left of the power button while the box is **On**; hidden when it is off, in standby or when the entity does not exist; disabled while the entity is unavailable. Label: `labels.sleep_btn`. |
| `power` | Plug power: shown as a tile, and used for the status only when `entity` is not set. |
| `threshold` | On above this power (W), when `entity` is not set. Default 3. |
| `show_power` / `show_energy` / `show_cost` / `show_toggle` | Checkboxes in the visual editor. |

Common options (`energy`, `cost`, `energy_period`, `price_per_kwh`, `display`, `tap_action`, `hold_action`, `labels`…): see the upstream [configuration.md](../configuration.md).
