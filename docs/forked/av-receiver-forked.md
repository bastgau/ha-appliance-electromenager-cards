# AV receiver (forked): sleep button

`custom:appliance-av-receiver-forked-card` is the upstream AV receiver card (`custom:appliance-av-receiver-card`) **plus** a sleep button. Every upstream option works unchanged: see [beer-tap-av-receiver.md](../cards/beer-tap-av-receiver.md).

**Sleep button** (optional): set `sleep` to a `button` (or `input_button`) or a `switch` (or `input_boolean`) entity, and a **`mdi:sleep-off`** button appears **to the left of the power button** while the receiver is **playing or paused**. A `button` is pressed, a `switch` is toggled. The button always has the neutral (grey) style of the power button when the device is off. It is hidden when the device is off or in standby, or when the entity does not exist; it is disabled while the entity is unavailable. The label (tooltip) can be changed with `labels: {sleep_btn: ...}`.

```yaml
type: custom:appliance-av-receiver-forked-card
entity: media_player.receiver
switch: switch.receiver_plug
sleep: button.receiver_sleep
```
