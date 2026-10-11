# Carom

Carom is a top-down paddle duel for the browser. Two players, or one player
against the AI, rally a spinning ball through a dark arena with two central
bank-shot obstacles. Paddle movement at impact bends the ball's flight, so a
good rally is about timing, placement, and using the middle bumpers to find
angles your opponent cannot cover.

## Install

```sh
npm ci
```

## Development

```sh
npm run dev
```

Vite serves the game locally with hot reload. The game runs entirely in the
browser and needs no backend or external assets.

## Production Build

```sh
npm run build
```

The static site is written to `dist/`, with `dist/index.html` as the entry
point. You can serve that directory from any static file server.

## Controls

- `W` / `S`: left paddle up / down
- `ArrowUp` / `ArrowDown`: right paddle up / down
- Solo mode: either movement set controls player one
- `Enter` or `Space`: confirm menu item
- `P` or `Escape`: pause or resume
- `Escape`: back from menus that support it
- `M`: mute or unmute sound

First player to 11 wins, with a two-point lead required.
