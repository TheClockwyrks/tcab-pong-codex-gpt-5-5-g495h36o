import { createCanvas } from "@napi-rs/canvas";
import { ConstantClock, createEngine } from "@clockwyrks/simple-2d";
import type { SurfaceMetrics } from "@clockwyrks/simple-2d";
import { describe, expect, it } from "vitest";
import {
  BALL_R,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  P1_X1,
  SERVE_SPEED,
} from "./constants";
import { BACKGROUND, game } from "./game";

function testCanvas(): HTMLCanvasElement {
  return createCanvas(FIELD_W, FIELD_H) as unknown as HTMLCanvasElement;
}

function makeEngine(stepMs = 1000 / 60) {
  const target = new EventTarget();
  const surface: SurfaceMetrics = {
    cssWidth: () => FIELD_W,
    cssHeight: () => FIELD_H,
    dpr: () => 1,
    events: () => target,
  };

  return createEngine({
    canvas: testCanvas(),
    width: FIELD_W,
    height: FIELD_H,
    game,
    background: BACKGROUND,
    clock: new ConstantClock(stepMs),
    surface,
  });
}

describe("Carom simulation", () => {
  it("initializes the title state and debug snapshot", async () => {
    const engine = makeEngine();
    await engine.initialize();

    const snapshot = engine.debug.snapshot(engine.state);
    expect(snapshot.version).toBe(1);
    expect(snapshot.screen).toBe("title");
    expect(snapshot.mode).toBe("solo");
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.y).toBe(FIELD_CY);
    expect(snapshot.obstacles).toHaveLength(2);
    expect(engine.debug.menuItemRect(engine.state, 0)).not.toBeNull();
  });

  it("serves from countdown after the hold without advancing the ball that frame", async () => {
    const engine = makeEngine(1000);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "countdown"));
    engine.apply((state) => engine.debug.setBallServeSign(state, 1));

    await engine.advance(1);

    const snapshot = engine.debug.snapshot(engine.state);
    expect(snapshot.screen).toBe("playing");
    expect(snapshot.ball?.held).toBe(false);
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.y).toBe(FIELD_CY);
    expect(snapshot.ball?.speed).toBeCloseTo(SERVE_SPEED, 5);
    expect(snapshot.ball?.vx).toBeLessThan(0);
    expect(snapshot.ball?.vy).toBeGreaterThan(0);
  });

  it("adds spin from a moving paddle on a paddle-face hit", async () => {
    const engine = makeEngine(16);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) => engine.debug.setPaddleDriven(state, "left", true));
    engine.apply((state) => engine.debug.setPaddleVy(state, "left", 300));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, P1_X1 + BALL_R - 0.5, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, -500, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));

    await engine.advance(1);

    const snapshot = engine.debug.snapshot(engine.state);
    expect(snapshot.ball?.vx).toBeGreaterThan(0);
    expect(snapshot.ball?.spin).toBeGreaterThan(0);
    expect(snapshot.paddles.left.vy).toBeGreaterThan(0);
  });

  it("scores a point and parks the next serve for the player scored on", async () => {
    const engine = makeEngine(16);
    await engine.initialize();
    engine.apply((state) => engine.debug.setScreen(state, "playing"));
    engine.apply((state) =>
      engine.debug.setBallPosition(state, FIELD_W + BALL_R + 4, FIELD_CY),
    );
    engine.apply((state) => engine.debug.setBallVelocity(state, 300, 0));
    engine.apply((state) => engine.debug.setBallHeld(state, false));

    await engine.advance(1);

    const snapshot = engine.debug.snapshot(engine.state);
    expect(snapshot.score).toEqual({ p1: 1, p2: 0 });
    expect(snapshot.receiver).toBe("right");
    expect(snapshot.screen).toBe("countdown");
    expect(snapshot.ball?.held).toBe(true);
    expect(snapshot.ball?.x).toBe(FIELD_CX);
    expect(snapshot.ball?.trail).toHaveLength(0);
  });
});
