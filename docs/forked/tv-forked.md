# TV (forked): ambilight and sleep button

`custom:appliance-tv-forked-card` is the upstream TV card (`custom:appliance-tv-card`) **plus** an ambilight and a sleep button. It extends the upstream card, so every upstream option and style (wall / stand / feet, projectors, `show_controls`…) works unchanged: see [tv-range-hood.md](../cards/tv-range-hood.md) for those.

The upstream `custom:appliance-tv-card` itself is left untouched: use the forked card to get the options below.

**Ambilight** (optional): a coloured halo around the screen, whose colours drift slowly (decorative: the card has no real colour data).
- The halo shows only while the **TV is on** and the `ambilight` switch is **on**. It works with the three styles (wall, stand, feet).
- `ambilight_level` (a `number`, for example the brightness of a Hue Sync Box) sets how pronounced the halo is. The value is converted to a percentage with the `min` and `max` of the entity (0 to 100 when it has none). A level of 0 hides the halo. Without a level, the halo has a medium intensity.
- An **Ambilight** tile appears while the TV is on and the `ambilight` entity is `on` or `off`: it shows the level (or *On* / *Off*), and a click toggles the switch. Without an `ambilight` entity, there is no tile, and a level above 0 is enough to show the halo.

```yaml
type: custom:appliance-tv-forked-card
entity: switch.tv_plug
power: sensor.tv_plug_power
ambilight: switch.ambilight_system        # on/off, toggled from the tile
ambilight_level: number.sync_box_brightness  # halo intensity
```

**Sleep button** (optional): set `sleep` to a `button` (or `input_button`) or a `switch` (or `input_boolean`) entity, and a **`mdi:sleep-off`** button appears **to the left of the power button** while the TV is **on**. A `button` is pressed, a `switch` is toggled. The button always has the neutral (grey) style of the power button when the device is off. It is hidden when the device is off or in standby, or when the entity does not exist; it is disabled while the entity is unavailable. The label (tooltip) can be changed with `labels: {sleep_btn: ...}`.

```yaml
sleep: button.tv_sleep
```
