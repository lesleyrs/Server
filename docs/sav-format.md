# Player Saves

This save format is in big-endian. Files are `base37`.

## Header

| Offset | Type | Description |
| --- | --- | --- |
| 0 | Uint16 | Magic number: 0x2004 |
| 2 | Uint16 | Format version |
| 4 | Uint32 | CRC32 of player data |

## Format Version 1

Base levels are calculated from stats XP.  
Temp (boosted) levels are taken from current stat levels.

| Offset | Type | Description |
| --- | --- | --- |
| 0 | Uint16 | x position in world |
| 2 | Uint16 | z position in world |
| 4 | Uint8 | World plane |
| 5 | Uint8[7] | Identity kit |
| 12 | Uint8[5] | Identity kit colors |
| 17 | Uint8 | Gender |
| 18 | Uint16 | Run Energy |
| 20 | Uint32 | Ticks logged in |

## Stats Data

| Offset | Type | Description |
| --- | --- | --- |
| 0 | Uint16 | # of stats |
| x | Uint8 | Stat ID |
| x | Uint32 | Stat XP |
| x | Uint8 | Temp level |

### Player Variable Data

| Offset | Type | Description |
| --- | --- | --- |
| 0 | Uint16 | # of varps |
| x | Uint16 | Varp ID |
| x | Uint32 | Varp value |

### Inventory Data

| Offset | Type | Description |
| --- | --- | --- |
| 0 | Uint8 | # of invs |
| x | Uint16 | Inv ID |
| x | Uint16 | # of objs |
| y | Uint16 | Obj inv slot |
| y | Uint16 | Obj ID |
| y | Uint32 | Obj amount |

note: Banks can store 400 items, so a full bank results in at least a 4KB inventory block.

### Example of newly registered player

```
0x2004 - magic
0x0001 - format version
... crc ...
... username ...
... password ...
... email ...
... date registered ...
0x00 - # of logins
0x00 - # of recovery questions
0x00 - # of messages
0x0C16 - x position in world (tutorial island)
0x0C22 - z position in world (tutorial island)
0x00 - world plane (tutorial island)
0x00 0x0A 0x12 0x1A 0x21 0x24 0x2A - identity kit
0x00 0x00 0x00 0x00 0x00 - identity kit colors
0x00 - gender
0x2710 - run energy
0x00000000 - ticks logged in
0x13 - # of stats
...
0x03 - stat ID
0x00000482 - stat XP
0x0A - temp level
...
0x00 - # of varps
0x00 - # of invs
```

## Format Version 2

- not implemented -

ideas:
- objvars
- extended var types (lookup to BaseVarType)