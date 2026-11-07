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

**Buttons** (all neutral grey, like the power button when the TV is off). Next to the power button the card can show two more buttons, **only while the TV is on**. From left to right: *keep awake*, *sleep*, *power*.

| Option | Icon | What it is for |
|---|---|---|
| `keep_awake` | `mdi:timer-off-outline` | **Keep the TV awake.** Press it when the sleep notification shows on the TV, so the TV does not go to sleep. Label: *Keep awake* / *Rester allumé* (`labels.keep_awake_btn`). |
| `sleep` | `mdi:television-play` | The sleep button. Label: *Sleep* / *Sommeil* (`labels.sleep_btn`). |

Both take a `button` or `input_button` (pressed), a `switch` or `input_boolean` (toggled), and, for `keep_awake`, a `script` (started). Each button is hidden when the TV is off or in standby, or when its entity does not exist, and disabled while its entity is unavailable. The card does not know what the entity does: use the one that sends the key you need (for example a remote-control key that dismisses the notification).

`keep_awake` has no detection of the notification: it is shown the whole time the TV is on.

```yaml
sleep: button.tv_sleep
keep_awake: button.tv_keep_awake     # or a script / switch
```

The `sleep` icon is `mdi:television-play` on this card only; the AV receiver, Hue Sync Box and TV box cards keep `mdi:sleep-off`.
