# Flat TV and range hood

<p align="center"><img src="../tv-range-hood.gif" width="560" alt="TV and range hood cards"></p>

**TV** (`custom:appliance-tv-card`): a flat screen, wall-mounted by default (nothing around it). `style: stand` puts it on a central stand, `style: feet` on two angled feet (also in the visual editor).

<p align="center"><img src="../tv.gif" width="300" alt="TV card"></p>

- **Switching on**: a bright line opens up the panel, light streaks converge into a start-up logo, then the streaming home screen appears; **switching off**: the picture collapses into a line, then a dot.
- **On**: a streaming home screen (featured banner, rows of tiles scrolling, moving selection). **Standby**: black screen, red LED. **Off**: black screen, no LED.
- With a smart plug: on above `threshold` (25 W), standby between `standby_threshold` (0.2 W) and 25 W, off below. With a `media_player`: `on` / `playing` / `paused` / `idle` = on, `standby` = standby, `off` = off, and the app or source is shown (« Allumée · Netflix »).

```yaml
type: custom:appliance-tv-card
entity: switch.tv_plug          # or media_player.living_room_tv
power: sensor.tv_plug_power
energy: sensor.tv_plug_energy_today
```

**Ambilight** (optional): a coloured halo around the screen, whose colours drift slowly (decorative: the card has no real colour data).
- The halo shows only while the **TV is on** and the `ambilight` switch is **on**. It works with the three styles (wall, stand, feet).
- `ambilight_level` (a `number`, for example the brightness of a Hue Sync Box) sets how pronounced the halo is. The value is converted to a percentage with the `min` and `max` of the entity (0 to 100 when it has none). A level of 0 hides the halo. Without a level, the halo has a medium intensity.
- An **Ambilight** tile appears while the TV is on and the `ambilight` entity is `on` or `off`: it shows the level (or *On* / *Off*), and a click toggles the switch. Without an `ambilight` entity, there is no tile, and a level above 0 is enough to show the halo.

```yaml
type: custom:appliance-tv-card
entity: switch.tv_plug
power: sensor.tv_plug_power
ambilight: switch.ambilight_system        # on/off, toggled from the tile
ambilight_level: number.sync_box_brightness  # halo intensity
```

**Sleep button** (optional): set `sleep` to a `button` (or `input_button`) or a `switch` (or `input_boolean`) entity, and a **`mdi:sleep-off`** button appears **to the left of the power button** while the TV is **on**. A `button` is pressed, a `switch` is toggled. The button always has the neutral (grey) style of the power button when the device is off. It is hidden when the device is off or in standby, or when the entity does not exist; it is disabled while the entity is unavailable. The label (tooltip) can be changed with `labels: {sleep_btn: ...}`.

```yaml
sleep: button.tv_sleep
```


**Range hood** (`custom:appliance-range-hood-card`): chimney hood above a cooktop and a steaming pot.
- **Fan running**: the fan spins, steam from the pot is drawn up into the hood, air flows upwards; faster at high speed, with the speed LEDs.
- **Lights**: the lamps light up the cooktop. With a power sensor alone, a few watts (above `light_threshold`, 3 W) without the motor = « Lights only »; or set a `light` entity.
- Speeds from power (above `threshold` 40 W = low, above `high_threshold` 130 W = high) or from a `speed` entity.

```yaml
type: custom:appliance-range-hood-card
power: sensor.hood_power
light: light.hood_light         # optional
```


[← All cards](../../README.md#the-cards)
