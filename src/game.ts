import type {
  Game,
  InitApi,
  RenderApi,
  UpdateApi,
} from "@clockwyrks/simple-2d";
import type { DeepReadonly } from "ts-essentials";
import {
  ACTIONS,
  AI_DEADZONE,
  AI_HOME_DEADZONE,
  AI_HOME_Y,
  AI_REACT,
  AI_SPEED,
  BALL_R,
  BINDINGS,
  CAROM_DEBUG_VERSION,
  CUES,
  FIELD_CX,
  FIELD_CY,
  FIELD_H,
  FIELD_W,
  HOLD_TIME,
  MATCHOVER_ITEMS,
  MAX_BOUNCE_ANGLE,
  MAX_SUBSTEP,
  NET_X,
  OBSTACLE_CENTERS,
  OBSTACLE_H,
  OBSTACLE_W,
  OBSTACLES,
  P1_X0,
  P1_X1,
  P2_X0,
  P2_X1,
  PADDLE_H,
  PADDLE_HALF,
  PADDLE_MAX_CY,
  PADDLE_MIN_CY,
  PADDLE_SPEED,
  PADDLE_W,
  PAUSE_ITEMS,
  SERVE_ANGLE,
  SERVE_SPEED,
  SPEED_CAP,
  SPEED_MULT,
  SPIN_CLAMP,
  SPIN_FROM_PADDLE,
  SPIN_HALFLIFE,
  TITLE_ITEMS,
  TITLE_TEXT,
  TRAIL_TIME,
  WIN_LEAD,
  WIN_SCORE,
} from "./constants";

export type Screen =
  "title" | "howto" | "countdown" | "playing" | "paused" | "matchover";

export type Mode = "solo" | "versus";

export type Side = "left" | "right";

export interface PaddleState {
  readonly cy: number;
  readonly vy: number;
  readonly driven: boolean;
  readonly drivenVy: number;
}

export interface AiState {
  readonly tracking: boolean;
  readonly movement: boolean;
}

export interface TrailSample {
  readonly x: number;
  readonly y: number;
  readonly t: number;
}

export interface BallState {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly spin: number;
  readonly held: boolean;
  readonly holdTimer: number;
  readonly serveSign: 1 | -1;
  readonly trail: readonly TrailSample[];
}

export interface ObstacleState {
  readonly index: number;
  readonly cx: number;
  readonly cy: number;
}

export interface CaromState {
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";

  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;

  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;

  readonly receiver: Side;
  readonly ball: BallState | null;
  readonly obstacles: readonly ObstacleState[];

  readonly simTime: number;
  readonly muted: boolean;
}

export interface MenuRect {
  readonly x: number;
  readonly y: number;
  readonly w: number;
  readonly h: number;
}

export interface CaromSnapshot {
  readonly version: number;
  readonly screen: Screen;
  readonly mode: Mode;
  readonly menuIndex: number;
  readonly titleIndex: number;
  readonly resumeScreen: "countdown" | "playing";
  readonly score: { readonly p1: number; readonly p2: number };
  readonly winner: Side | null;
  readonly muted: boolean;
  readonly paddles: { readonly left: PaddleState; readonly right: PaddleState };
  readonly ai: AiState;
  readonly receiver: Side;
  readonly ball:
    | (BallState & {
        readonly speed: number;
      })
    | null;
  readonly obstacles: readonly ObstacleState[];
  readonly simTime: number;
}

export interface CaromDebugApi {
  readonly version: number;
  clearWorld(state: DeepReadonly<CaromState>): CaromState;
  spawnBall(state: DeepReadonly<CaromState>): CaromState;
  spawnObstacle(state: DeepReadonly<CaromState>, index: number): CaromState;
  reset(state: DeepReadonly<CaromState>): CaromState;
  reconcile(state: DeepReadonly<CaromState>): CaromState;
  setScreen(state: DeepReadonly<CaromState>, screen: Screen): CaromState;
  setMode(state: DeepReadonly<CaromState>, mode: Mode): CaromState;
  setMenuIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setTitleIndex(state: DeepReadonly<CaromState>, index: number): CaromState;
  setResumeScreen(
    state: DeepReadonly<CaromState>,
    screen: "countdown" | "playing",
  ): CaromState;
  setScore(state: DeepReadonly<CaromState>, p1: number, p2: number): CaromState;
  setWinner(state: DeepReadonly<CaromState>, side: Side | null): CaromState;
  setReceiver(state: DeepReadonly<CaromState>, side: Side): CaromState;
  setPaddleCy(
    state: DeepReadonly<CaromState>,
    side: Side,
    cy: number,
  ): CaromState;
  setPaddleVy(
    state: DeepReadonly<CaromState>,
    side: Side,
    vy: number,
  ): CaromState;
  setPaddleDriven(
    state: DeepReadonly<CaromState>,
    side: Side,
    driven: boolean,
  ): CaromState;
  setBallPosition(
    state: DeepReadonly<CaromState>,
    x: number,
    y: number,
  ): CaromState;
  setBallVelocity(
    state: DeepReadonly<CaromState>,
    vx: number,
    vy: number,
  ): CaromState;
  setBallSpin(state: DeepReadonly<CaromState>, spin: number): CaromState;
  setBallHeld(state: DeepReadonly<CaromState>, held: boolean): CaromState;
  setBallHoldTimer(
    state: DeepReadonly<CaromState>,
    seconds: number,
  ): CaromState;
  setBallServeSign(state: DeepReadonly<CaromState>, sign: 1 | -1): CaromState;
  drawBallServeSign(state: DeepReadonly<CaromState>): CaromState;
  setAiTracking(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setAiMovement(state: DeepReadonly<CaromState>, enabled: boolean): CaromState;
  setMuted(state: DeepReadonly<CaromState>, muted: boolean): CaromState;
  snapshot(state: DeepReadonly<CaromState>): CaromSnapshot;
  menuItemRect(state: DeepReadonly<CaromState>, index: number): MenuRect | null;
}

interface PointerStart {
  readonly id: number;
  readonly index: number | null;
  readonly device: "mouse" | "touch";
}

type InternalState = CaromState & {
  readonly pointerStarts?: readonly PointerStart[];
};

type Face = "left" | "right" | "top" | "bottom";

interface CollisionResult {
  readonly x: number;
  readonly y: number;
  readonly vx: number;
  readonly vy: number;
  readonly face: Face | null;
}

interface MenuInput {
  readonly up: boolean;
  readonly down: boolean;
  readonly confirm: boolean;
  readonly back: boolean;
  readonly pause: boolean;
  readonly pointerIndex: number | null;
  readonly pointerConfirm: boolean;
  readonly pointerStarts: readonly PointerStart[];
}

export const BACKGROUND = "#071018";

const P1_COLOR = "#38e8a5";
const P2_COLOR = "#ff5d8f";
const BALL_COLOR = "#f7f3a1";
const OBSTACLE_COLOR = "#7bd3ff";
const TEXT_COLOR = "#eef7ff";
const DIM_TEXT = "#7f91a4";
const PANEL = "rgba(7, 16, 24, 0.74)";
const HIGHLIGHT = "#ffe66d";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function drawServeSign(): 1 | -1 {
  return Math.random() < 0.5 ? -1 : 1;
}

function paddleRect(
  side: Side,
  cy: number,
): {
  readonly x0: number;
  readonly x1: number;
  readonly y0: number;
  readonly y1: number;
} {
  return {
    x0: side === "left" ? P1_X0 : P2_X0,
    x1: side === "left" ? P1_X1 : P2_X1,
    y0: cy - PADDLE_HALF,
    y1: cy + PADDLE_HALF,
  };
}

function obstacleFromIndex(index: number): ObstacleState {
  const center = OBSTACLE_CENTERS[index];
  if (!center) throw new Error(`Carom: no obstacle ${index}`);
  return { index, cx: center.x, cy: center.y };
}

function initialObstacles(): readonly ObstacleState[] {
  return OBSTACLE_CENTERS.map((center, index) => ({
    index,
    cx: center.x,
    cy: center.y,
  }));
}

function parkedBall(): BallState {
  return {
    x: FIELD_CX,
    y: FIELD_CY,
    vx: 0,
    vy: 0,
    spin: 0,
    held: true,
    holdTimer: HOLD_TIME,
    serveSign: drawServeSign(),
    trail: [],
  };
}

function initialState(muted: boolean): CaromState {
  return {
    screen: "title",
    mode: "solo",
    menuIndex: 0,
    titleIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    paddles: {
      left: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
      right: { cy: FIELD_CY, vy: 0, driven: false, drivenVy: 0 },
    },
    ai: { tracking: true, movement: true },
    receiver: "left",
    ball: parkedBall(),
    obstacles: initialObstacles(),
    simTime: 0,
    muted,
  };
}

function internal(state: DeepReadonly<CaromState>): InternalState {
  return state as InternalState;
}

function withPointerStarts(
  state: CaromState,
  pointerStarts: readonly PointerStart[],
): CaromState {
  return { ...state, pointerStarts } as InternalState;
}

function resetState(
  state: DeepReadonly<CaromState>,
  muted = state.muted,
): CaromState {
  return { ...initialState(muted), simTime: 0 };
}

function returnToTitle(state: DeepReadonly<CaromState>): CaromState {
  return {
    ...initialState(state.muted),
    titleIndex: state.titleIndex,
    menuIndex: state.titleIndex,
    simTime: state.simTime,
  };
}

function startMatch(state: DeepReadonly<CaromState>, mode: Mode): CaromState {
  return {
    ...state,
    screen: "countdown",
    mode,
    menuIndex: 0,
    resumeScreen: "playing",
    score: { p1: 0, p2: 0 },
    winner: null,
    receiver: "left",
    ball: parkedBall(),
    paddles: {
      left: { ...state.paddles.left, cy: FIELD_CY, vy: 0 },
      right: { ...state.paddles.right, cy: FIELD_CY, vy: 0 },
    },
  };
}

function integratePaddle(
  paddle: PaddleState,
  vy: number,
  dt: number,
): PaddleState {
  const nextCy = clamp(paddle.cy + vy * dt, PADDLE_MIN_CY, PADDLE_MAX_CY);
  const actualVy =
    nextCy !== paddle.cy && dt > 0 ? (nextCy - paddle.cy) / dt : vy;
  return { ...paddle, cy: nextCy, vy: actualVy };
}

function humanVy(up: number, down: number): number {
  return (down - up) * PADDLE_SPEED;
}

function movePaddles(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): { readonly left: PaddleState; readonly right: PaddleState } {
  const p1Up = api.input.value("p1-up");
  const p1Down = api.input.value("p1-down");
  const p2Up = api.input.value("p2-up");
  const p2Down = api.input.value("p2-down");

  let leftVy =
    state.mode === "solo"
      ? humanVy(Math.max(p1Up, p2Up), Math.max(p1Down, p2Down))
      : humanVy(p1Up, p1Down);
  let rightVy = state.mode === "versus" ? humanVy(p2Up, p2Down) : 0;

  if (state.paddles.left.driven) leftVy = state.paddles.left.drivenVy;

  if (state.paddles.right.driven) {
    rightVy = state.paddles.right.drivenVy;
  } else if (state.mode === "solo") {
    rightVy = aiVelocity(state, dt);
  }

  return {
    left: integratePaddle(state.paddles.left, leftVy, dt),
    right: integratePaddle(state.paddles.right, rightVy, dt),
  };
}

function aiVelocity(state: DeepReadonly<CaromState>, dt: number): number {
  if (!state.ai.movement || dt <= 0) return 0;

  let target = AI_HOME_Y;
  let deadzone = AI_HOME_DEADZONE;
  if (
    state.ai.tracking &&
    state.screen === "playing" &&
    state.ball &&
    state.ball.vx > 0
  ) {
    target = state.ball.y - state.ball.vy * AI_REACT;
    deadzone = AI_DEADZONE;
  }

  const diff = target - state.paddles.right.cy;
  if (Math.abs(diff) <= deadzone) return 0;
  return Math.sign(diff) * Math.min(AI_SPEED, Math.abs(diff) / dt);
}

function resolveRect(
  ball: BallState,
  rect: {
    readonly x0: number;
    readonly x1: number;
    readonly y0: number;
    readonly y1: number;
  },
): CollisionResult {
  const x = ball.x;
  const y = ball.y;
  if (
    x <= rect.x0 - BALL_R ||
    x >= rect.x1 + BALL_R ||
    y <= rect.y0 - BALL_R ||
    y >= rect.y1 + BALL_R
  ) {
    return { ...ball, face: null };
  }

  const depths = [
    { face: "left" as const, depth: x - (rect.x0 - BALL_R) },
    { face: "right" as const, depth: rect.x1 + BALL_R - x },
    { face: "top" as const, depth: y - (rect.y0 - BALL_R) },
    { face: "bottom" as const, depth: rect.y1 + BALL_R - y },
  ];
  let struck = depths[0];
  for (const depth of depths.slice(1)) {
    if (depth.depth < struck.depth) struck = depth;
  }

  let nextX = x;
  let nextY = y;
  let nextVx = ball.vx;
  let nextVy = ball.vy;

  if (struck.face === "left") {
    nextX = rect.x0 - BALL_R;
    if (nextVx > 0) nextVx = -nextVx;
  } else if (struck.face === "right") {
    nextX = rect.x1 + BALL_R;
    if (nextVx < 0) nextVx = -nextVx;
  } else if (struck.face === "top") {
    nextY = rect.y0 - BALL_R;
    if (nextVy > 0) nextVy = -nextVy;
  } else {
    nextY = rect.y1 + BALL_R;
    if (nextVy < 0) nextVy = -nextVy;
  }

  return { x: nextX, y: nextY, vx: nextVx, vy: nextVy, face: struck.face };
}

function paddleBounce(
  ball: BallState,
  side: Side,
  paddle: PaddleState,
): BallState {
  const offset = clamp((ball.y - paddle.cy) / PADDLE_HALF, -1, 1);
  const theta = offset * MAX_BOUNCE_ANGLE;
  const speed = Math.min(Math.hypot(ball.vx, ball.vy) * SPEED_MULT, SPEED_CAP);
  const dir = side === "left" ? 1 : -1;
  return {
    ...ball,
    x: side === "left" ? P1_X1 + BALL_R : P2_X0 - BALL_R,
    vx: dir * speed * Math.cos(theta),
    vy: speed * Math.sin(theta),
    spin: clamp(
      ball.spin + paddle.vy * SPIN_FROM_PADDLE,
      -SPIN_CLAMP,
      SPIN_CLAMP,
    ),
  };
}

function rotateVelocity(ball: BallState, h: number): BallState {
  const speed = Math.hypot(ball.vx, ball.vy);
  if (speed <= 0) return ball;
  const angle = (ball.spin / speed) * h;
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    ...ball,
    vx: ball.vx * c - ball.vy * s,
    vy: ball.vx * s + ball.vy * c,
  };
}

function stepBall(
  ball: BallState,
  state: DeepReadonly<CaromState>,
  paddles: { readonly left: PaddleState; readonly right: PaddleState },
  dt: number,
): {
  readonly ball: BallState;
  readonly events: {
    readonly wall: boolean;
    readonly paddle: boolean;
    readonly obstacle: boolean;
  };
} {
  let next = ball;
  let wall = false;
  let paddleHit = false;
  let obstacleHit = false;
  const speed = Math.hypot(next.vx, next.vy);
  const steps = Math.max(1, Math.ceil((speed * dt) / MAX_SUBSTEP));
  const h = dt / steps;

  for (let i = 0; i < steps; i += 1) {
    next = rotateVelocity(next, h);
    next = {
      ...next,
      spin: next.spin * Math.pow(0.5, h / SPIN_HALFLIFE),
      x: next.x + next.vx * h,
      y: next.y + next.vy * h,
    };

    if (next.y - BALL_R < 0 && next.vy < 0) {
      next = { ...next, y: BALL_R, vy: -next.vy };
      wall = true;
    } else if (next.y + BALL_R > FIELD_H && next.vy > 0) {
      next = { ...next, y: FIELD_H - BALL_R, vy: -next.vy };
      wall = true;
    }

    const left = resolveRect(next, paddleRect("left", paddles.left.cy));
    if (left.face) {
      next = { ...next, ...left };
      if (left.face === "right" || left.face === "left") {
        next = paddleBounce(next, "left", paddles.left);
        paddleHit = true;
      } else {
        wall = true;
      }
    }

    const right = resolveRect(next, paddleRect("right", paddles.right.cy));
    if (right.face) {
      next = { ...next, ...right };
      if (right.face === "right" || right.face === "left") {
        next = paddleBounce(next, "right", paddles.right);
        paddleHit = true;
      } else {
        wall = true;
      }
    }

    for (const obstacle of state.obstacles) {
      const rect = OBSTACLES[obstacle.index];
      if (!rect) continue;
      const hit = resolveRect(next, rect);
      if (hit.face) {
        next = { ...next, ...hit };
        obstacleHit = true;
      }
    }
  }

  return {
    ball: next,
    events: { wall, paddle: paddleHit, obstacle: obstacleHit },
  };
}

function appendTrail(ball: BallState, simTime: number): BallState {
  const trail = [...ball.trail, { x: ball.x, y: ball.y, t: simTime }].filter(
    (sample) => simTime - sample.t <= TRAIL_TIME,
  );
  return { ...ball, trail };
}

function serveBall(ball: BallState, receiver: Side): BallState {
  const dir = receiver === "left" ? -1 : 1;
  return {
    ...ball,
    vx: dir * SERVE_SPEED * Math.cos(SERVE_ANGLE),
    vy: ball.serveSign * SERVE_SPEED * Math.sin(SERVE_ANGLE),
    held: false,
    holdTimer: 0,
    trail: [],
  };
}

function playCues(
  api: UpdateApi,
  events: {
    readonly wall: boolean;
    readonly paddle: boolean;
    readonly obstacle: boolean;
    readonly score: boolean;
  },
): void {
  if (events.paddle) api.audio.play(CUES.paddleHit);
  if (events.wall) api.audio.play(CUES.wallBounce);
  if (events.obstacle) api.audio.play(CUES.obstacleBounce);
  if (events.score) api.audio.play(CUES.score);
}

function winningSide(score: {
  readonly p1: number;
  readonly p2: number;
}): Side | null {
  if (score.p1 >= WIN_SCORE && score.p1 - score.p2 >= WIN_LEAD) return "left";
  if (score.p2 >= WIN_SCORE && score.p2 - score.p1 >= WIN_LEAD) return "right";
  return null;
}

function advanceLive(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
  dt: number,
): CaromState {
  const paddles = movePaddles(state, api, dt);
  const simTime = state.simTime + dt;

  if (!state.ball) return { ...state, paddles, simTime };

  if (state.screen === "countdown") {
    const holdTimer = Math.max(0, state.ball.holdTimer - dt);
    let ball: BallState = {
      ...state.ball,
      x: FIELD_CX,
      y: FIELD_CY,
      vx: 0,
      vy: 0,
      holdTimer,
      held: holdTimer > 0,
    };
    let screen: Screen = "countdown";
    if (holdTimer <= 0) {
      ball = serveBall(ball, state.receiver);
      screen = "playing";
    }
    return {
      ...state,
      screen,
      paddles,
      ball: appendTrail(ball, simTime),
      simTime,
    };
  }

  const stepped = stepBall(state.ball, state, paddles, dt);
  let ball = appendTrail(stepped.ball, simTime);
  let score = state.score;
  let screen: Screen = state.screen;
  let winner = state.winner;
  let receiver = state.receiver;
  let scoreEvent = false;

  if (ball.x - BALL_R > FIELD_W) {
    score = { ...score, p1: score.p1 + 1 };
    receiver = "right";
    scoreEvent = true;
  } else if (ball.x + BALL_R < 0) {
    score = { ...score, p2: score.p2 + 1 };
    receiver = "left";
    scoreEvent = true;
  }

  if (scoreEvent) {
    winner = winningSide(score);
    if (winner) {
      screen = "matchover";
      playCues(api, { ...stepped.events, score: true });
      return {
        ...state,
        screen,
        menuIndex: 0,
        score,
        winner,
        paddles,
        ball,
        receiver,
        simTime,
      };
    }
    ball = parkedBall();
    screen = "countdown";
  }

  playCues(api, { ...stepped.events, score: scoreEvent });

  return {
    ...state,
    screen,
    score,
    winner,
    paddles,
    ball,
    receiver,
    simTime,
  };
}

function menuItems(screen: Screen): readonly string[] {
  if (screen === "title") return TITLE_ITEMS;
  if (screen === "paused") return PAUSE_ITEMS;
  if (screen === "matchover") return MATCHOVER_ITEMS;
  if (screen === "howto") return ["BACK"];
  return [];
}

function menuRectFor(screen: Screen, index: number): MenuRect | null {
  const items = menuItems(screen);
  if (index < 0 || index >= items.length) return null;
  const w = screen === "howto" ? 220 : 330;
  const h = 54;
  const gap = 16;
  const startY =
    screen === "title"
      ? 348
      : screen === "howto"
        ? 594
        : screen === "paused"
          ? 292
          : 408;
  return {
    x: FIELD_CX - w / 2,
    y: startY + index * (h + gap),
    w,
    h,
  };
}

function pointInRect(x: number, y: number, rect: MenuRect): boolean {
  return (
    x >= rect.x && x <= rect.x + rect.w && y >= rect.y && y <= rect.y + rect.h
  );
}

function menuIndexAt(screen: Screen, x: number, y: number): number | null {
  const items = menuItems(screen);
  for (let i = 0; i < items.length; i += 1) {
    const rect = menuRectFor(screen, i);
    if (rect && pointInRect(x, y, rect)) return i;
  }
  return null;
}

function readMenuInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): MenuInput {
  const up = api.input.pressed("p1-up") || api.input.pressed("p2-up");
  const down = api.input.pressed("p1-down") || api.input.pressed("p2-down");
  const confirm = api.input.pressed("confirm");
  const back = api.input.pressed("back");
  const pause = api.input.pressed("pause");
  const pointer = api.input.pointer();
  const pointerIndex = menuIndexAt(state.screen, pointer.x, pointer.y);
  const previousStarts = internal(state).pointerStarts ?? [];
  const starts: PointerStart[] = previousStarts.filter((start) =>
    api.input
      .pointerContacts()
      .some(
        (contact) => contact.id === start.id && contact.device === start.device,
      ),
  );
  let pointerConfirm = false;

  for (const sample of api.input.pointerSamples()) {
    const device = sample.device === "touch" ? "touch" : "mouse";
    const index = menuIndexAt(state.screen, sample.x, sample.y);
    if (index !== null) {
      starts.splice(
        0,
        starts.length,
        ...starts.map((start) =>
          start.id === sample.id && start.device === device
            ? { ...start, index }
            : start,
        ),
      );
    }
    if (sample.type === "down") {
      starts.push({ id: sample.id, index, device });
    } else if (sample.type === "up") {
      const start = starts.find(
        (candidate) =>
          candidate.id === sample.id && candidate.device === device,
      );
      if (start && start.index !== null && start.index === index) {
        pointerConfirm = true;
      }
      const keep = starts.filter(
        (candidate) =>
          candidate.id !== sample.id || candidate.device !== device,
      );
      starts.splice(0, starts.length, ...keep);
    }
  }

  return {
    up,
    down,
    confirm,
    back,
    pause,
    pointerIndex,
    pointerConfirm,
    pointerStarts: starts,
  };
}

function wrapIndex(index: number, count: number, delta: number): number {
  return (index + delta + count) % count;
}

function confirmMenu(
  state: DeepReadonly<CaromState>,
  screen: Screen,
  index: number,
): CaromState {
  if (screen === "title") {
    const titleIndex = index;
    if (index === 0) return { ...startMatch(state, "solo"), titleIndex };
    if (index === 1) return { ...startMatch(state, "versus"), titleIndex };
    return { ...state, screen: "howto", menuIndex: 0, titleIndex };
  }
  if (screen === "howto") return returnToTitle(state);
  if (screen === "paused") {
    if (index === 0) return { ...state, screen: state.resumeScreen };
    if (index === 1) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  if (screen === "matchover") {
    if (index === 0) return startMatch(state, state.mode);
    return returnToTitle(state);
  }
  return state as CaromState;
}

function applyInput(
  state: DeepReadonly<CaromState>,
  api: UpdateApi,
): CaromState {
  const menu = readMenuInput(state, api);
  let next: CaromState = state as CaromState;

  if (api.input.pressed("mute")) {
    api.audio.setMuted(!api.audio.muted());
    next = { ...next, muted: api.audio.muted() };
  }

  if (state.screen === "countdown" || state.screen === "playing") {
    if (menu.pause) {
      next = {
        ...next,
        resumeScreen: state.screen,
        screen: "paused",
        menuIndex: 0,
      };
    }
    return withPointerStarts(next, menu.pointerStarts);
  }

  if (state.screen === "paused" && (menu.pause || menu.back)) {
    return withPointerStarts(
      { ...next, screen: state.resumeScreen },
      menu.pointerStarts,
    );
  }

  if (state.screen === "howto" && (menu.confirm || menu.back)) {
    return withPointerStarts(returnToTitle(next), menu.pointerStarts);
  }

  if (state.screen === "matchover" && menu.back) {
    return withPointerStarts(returnToTitle(next), menu.pointerStarts);
  }

  const items = menuItems(state.screen);
  if (items.length > 0) {
    let menuIndex = state.menuIndex;
    let moved = false;
    if (menu.up) {
      menuIndex = wrapIndex(menuIndex, items.length, -1);
      moved = true;
    } else if (menu.down) {
      menuIndex = wrapIndex(menuIndex, items.length, 1);
      moved = true;
    }
    if (!moved && menu.confirm) {
      return withPointerStarts(
        confirmMenu({ ...next, menuIndex }, state.screen, menuIndex),
        menu.pointerStarts,
      );
    }
    if (menu.pointerIndex !== null) menuIndex = menu.pointerIndex;
    next = { ...next, menuIndex };
    if (!menu.confirm && menu.pointerConfirm) {
      next = confirmMenu(next, state.screen, menuIndex);
    }
  }

  return withPointerStarts(next, menu.pointerStarts);
}

function requireBall(state: DeepReadonly<CaromState>): BallState {
  if (!state.ball) throw new Error("Carom: no ball is present");
  return state.ball as BallState;
}

function setBall(
  state: DeepReadonly<CaromState>,
  patch: Partial<BallState>,
): CaromState {
  return { ...state, ball: { ...requireBall(state), ...patch } };
}

function buildDebug(): CaromDebugApi {
  return {
    version: CAROM_DEBUG_VERSION,
    clearWorld: (state) => ({ ...state, ball: null, obstacles: [] }),
    spawnBall: (state) => ({ ...state, ball: parkedBall() }),
    spawnObstacle: (state, index) => {
      const obstacle = obstacleFromIndex(index);
      return {
        ...state,
        obstacles: [
          ...state.obstacles.filter((item) => item.index !== index),
          obstacle,
        ].sort((a, b) => a.index - b.index),
      };
    },
    reset: (state) => resetState(state, state.muted),
    reconcile: (state) => state as CaromState,
    setScreen: (state, screen) => ({ ...state, screen }),
    setMode: (state, mode) => ({ ...state, mode }),
    setMenuIndex: (state, menuIndex) => ({ ...state, menuIndex }),
    setTitleIndex: (state, titleIndex) => ({ ...state, titleIndex }),
    setResumeScreen: (state, resumeScreen) => ({ ...state, resumeScreen }),
    setScore: (state, p1, p2) => ({ ...state, score: { p1, p2 } }),
    setWinner: (state, winner) => ({ ...state, winner }),
    setReceiver: (state, receiver) => ({ ...state, receiver }),
    setPaddleCy: (state, side, cy) => ({
      ...state,
      paddles: {
        ...state.paddles,
        [side]: { ...state.paddles[side], cy },
      },
    }),
    setPaddleVy: (state, side, drivenVy) => ({
      ...state,
      paddles: {
        ...state.paddles,
        [side]: { ...state.paddles[side], drivenVy },
      },
    }),
    setPaddleDriven: (state, side, driven) => ({
      ...state,
      paddles: {
        ...state.paddles,
        [side]: { ...state.paddles[side], driven },
      },
    }),
    setBallPosition: (state, x, y) => setBall(state, { x, y }),
    setBallVelocity: (state, vx, vy) => setBall(state, { vx, vy }),
    setBallSpin: (state, spin) => setBall(state, { spin }),
    setBallHeld: (state, held) => setBall(state, { held }),
    setBallHoldTimer: (state, holdTimer) => setBall(state, { holdTimer }),
    setBallServeSign: (state, serveSign) => setBall(state, { serveSign }),
    drawBallServeSign: (state) =>
      setBall(state, { serveSign: drawServeSign() }),
    setAiTracking: (state, tracking) => ({
      ...state,
      ai: { ...state.ai, tracking },
    }),
    setAiMovement: (state, movement) => ({
      ...state,
      ai: { ...state.ai, movement },
    }),
    setMuted: (state, muted) => ({ ...state, muted }),
    snapshot: (state) => ({
      version: CAROM_DEBUG_VERSION,
      screen: state.screen,
      mode: state.mode,
      menuIndex: state.menuIndex,
      titleIndex: state.titleIndex,
      resumeScreen: state.resumeScreen,
      score: state.score,
      winner: state.winner,
      muted: state.muted,
      paddles: state.paddles,
      ai: state.ai,
      receiver: state.receiver,
      ball: state.ball
        ? { ...state.ball, speed: Math.hypot(state.ball.vx, state.ball.vy) }
        : null,
      obstacles: state.obstacles,
      simTime: state.simTime,
    }),
    menuItemRect: (state, index) => menuRectFor(state.screen, index),
  };
}

function registerDiagnostics(api: InitApi<CaromState>): void {
  api.diagnostics.register("screen", (s) => s.screen);
  api.diagnostics.register("mode", (s) => s.mode);
  api.diagnostics.register("score", (s) => `${s.score.p1}-${s.score.p2}`);
  api.diagnostics.register("ball", (s) =>
    s.ball ? `${s.ball.x.toFixed(1)},${s.ball.y.toFixed(1)}` : "none",
  );
  api.diagnostics.register("ball v", (s) =>
    s.ball ? `${s.ball.vx.toFixed(1)},${s.ball.vy.toFixed(1)}` : "none",
  );
  api.diagnostics.register("speed", (s) =>
    s.ball ? Math.hypot(s.ball.vx, s.ball.vy) : 0,
  );
  api.diagnostics.register("spin", (s) => (s.ball ? s.ball.spin : 0));
  api.diagnostics.register(
    "p1",
    (s) => `${s.paddles.left.cy.toFixed(1)} ${s.paddles.left.vy.toFixed(1)}`,
  );
  api.diagnostics.register(
    "p2",
    (s) => `${s.paddles.right.cy.toFixed(1)} ${s.paddles.right.vy.toFixed(1)}`,
  );
}

function registerAudio(api: InitApi<CaromState>): void {
  api.audio.define(CUES.paddleHit, {
    wave: "square",
    freq: 290,
    freqTo: 520,
    gain: 0.13,
    durationMs: 70,
  });
  api.audio.define(CUES.wallBounce, {
    wave: "triangle",
    freq: 260,
    freqTo: 190,
    gain: 0.11,
    durationMs: 55,
  });
  api.audio.define(CUES.obstacleBounce, {
    wave: "sawtooth",
    freq: 660,
    freqTo: 360,
    gain: 0.08,
    durationMs: 75,
  });
  api.audio.define(CUES.score, {
    wave: "sine",
    freq: 180,
    freqTo: 740,
    gain: 0.16,
    durationMs: 180,
  });
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
): void {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
  ctx.fill();
}

function drawField(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = BACKGROUND;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);

  ctx.strokeStyle = "rgba(238,247,255,0.22)";
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 18]);
  ctx.beginPath();
  ctx.moveTo(NET_X, 34);
  ctx.lineTo(NET_X, FIELD_H - 34);
  ctx.stroke();
  ctx.setLineDash([]);

  for (const obstacle of state.obstacles) {
    ctx.shadowColor = OBSTACLE_COLOR;
    ctx.shadowBlur = 16;
    ctx.fillStyle = OBSTACLE_COLOR;
    roundRect(
      ctx,
      obstacle.cx - OBSTACLE_W / 2,
      obstacle.cy - OBSTACLE_H / 2,
      OBSTACLE_W,
      OBSTACLE_H,
      10,
    );
  }
  ctx.shadowBlur = 0;

  drawPaddle(ctx, "left", state.paddles.left);
  drawPaddle(ctx, "right", state.paddles.right);

  if (state.ball) drawBall(ctx, state.ball);
}

function drawPaddle(
  ctx: CanvasRenderingContext2D,
  side: Side,
  paddle: DeepReadonly<PaddleState>,
): void {
  const rect = paddleRect(side, paddle.cy);
  ctx.shadowColor = side === "left" ? P1_COLOR : P2_COLOR;
  ctx.shadowBlur = 18;
  ctx.fillStyle = side === "left" ? P1_COLOR : P2_COLOR;
  roundRect(ctx, rect.x0, rect.y0, PADDLE_W, PADDLE_H, 8);
  ctx.shadowBlur = 0;
}

function drawBall(
  ctx: CanvasRenderingContext2D,
  ball: DeepReadonly<BallState>,
): void {
  if (ball.trail.length > 1) {
    ctx.lineCap = "round";
    for (let i = 1; i < ball.trail.length; i += 1) {
      const prev = ball.trail[i - 1];
      const sample = ball.trail[i];
      const alpha = i / ball.trail.length;
      ctx.strokeStyle = `rgba(247, 243, 161, ${0.12 + alpha * 0.45})`;
      ctx.lineWidth = 4 + alpha * 10;
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(sample.x, sample.y);
      ctx.stroke();
    }
  }
  ctx.shadowColor = BALL_COLOR;
  ctx.shadowBlur = 20;
  ctx.fillStyle = BALL_COLOR;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, BALL_R, 0, Math.PI * 2);
  ctx.fill();
  ctx.shadowBlur = 0;
}

function drawHud(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "700 50px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(state.score.p1), FIELD_CX - 130, 56);
  ctx.fillText(String(state.score.p2), FIELD_CX + 130, 56);
  ctx.font = "600 18px system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(
    state.mode === "solo" ? "SOLO DUEL" : "VERSUS DUEL",
    FIELD_CX,
    104,
  );
}

function drawMenuItem(
  ctx: CanvasRenderingContext2D,
  text: string,
  rect: MenuRect,
  active: boolean,
): void {
  ctx.fillStyle = active ? "rgba(255,230,109,0.18)" : "rgba(238,247,255,0.06)";
  roundRect(ctx, rect.x, rect.y, rect.w, rect.h, 8);
  ctx.strokeStyle = active ? HIGHLIGHT : "rgba(238,247,255,0.22)";
  ctx.lineWidth = active ? 3 : 1.5;
  ctx.strokeRect(rect.x, rect.y, rect.w, rect.h);
  ctx.fillStyle = active ? HIGHLIGHT : TEXT_COLOR;
  ctx.font = "800 24px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function drawMenu(
  ctx: CanvasRenderingContext2D,
  screen: Screen,
  activeIndex: number,
): void {
  const items = menuItems(screen);
  for (let i = 0; i < items.length; i += 1) {
    const rect = menuRectFor(screen, i);
    if (rect) drawMenuItem(ctx, items[i], rect, i === activeIndex);
  }
}

function drawTitle(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawField(state, ctx);
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "900 112px system-ui, sans-serif";
  ctx.fillText(TITLE_TEXT, FIELD_CX, 188);
  ctx.font = "600 24px system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText("spin the rally, bank the angle", FIELD_CX, 260);
  drawMenu(ctx, "title", state.menuIndex);
}

function drawHowTo(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawField(state, ctx);
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = TEXT_COLOR;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "900 48px system-ui, sans-serif";
  ctx.fillText("HOW TO PLAY", FIELD_CX, 112);
  ctx.font = "500 24px system-ui, sans-serif";
  ctx.fillStyle = "#d9e9f5";
  const lines = [
    "W/S move the left paddle. Arrow Up/Down move player two.",
    "In Solo, either set of movement keys drives player one.",
    "Strike while moving to add spin; spin bends the ball after contact.",
    "Use the two blue bumpers for bank shots through the middle lane.",
    "P or Escape pauses. M toggles sound.",
  ];
  lines.forEach((line, index) => {
    ctx.fillText(line, FIELD_CX, 210 + index * 48);
  });
  drawMenu(ctx, "howto", state.menuIndex);
}

function drawPause(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawField(state, ctx);
  drawHud(state, ctx);
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "900 54px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("PAUSED", FIELD_CX, 202);
  drawMenu(ctx, "paused", state.menuIndex);
}

function drawMatchOver(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawField(state, ctx);
  drawHud(state, ctx);
  ctx.fillStyle = PANEL;
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.fillStyle = TEXT_COLOR;
  ctx.font = "900 56px system-ui, sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const winner =
    state.winner === "left" ? "PLAYER ONE WINS" : "PLAYER TWO WINS";
  ctx.fillText(winner, FIELD_CX, 202);
  ctx.font = "700 34px system-ui, sans-serif";
  ctx.fillStyle = DIM_TEXT;
  ctx.fillText(`${state.score.p1} - ${state.score.p2}`, FIELD_CX, 278);
  drawMenu(ctx, "matchover", state.menuIndex);
}

function drawCountdown(
  state: DeepReadonly<CaromState>,
  ctx: CanvasRenderingContext2D,
): void {
  drawField(state, ctx);
  drawHud(state, ctx);
  if (!state.ball) return;
  ctx.fillStyle = "rgba(7,16,24,0.35)";
  ctx.fillRect(0, 0, FIELD_W, FIELD_H);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = HIGHLIGHT;
  ctx.font = "900 72px system-ui, sans-serif";
  ctx.fillText(
    Math.ceil(state.ball.holdTimer).toString(),
    FIELD_CX,
    FIELD_CY - 86,
  );
}

export const game: Game<CaromState, CaromDebugApi> = {
  initialize(api: InitApi<CaromState>): [CaromState, CaromDebugApi] {
    for (const action of ACTIONS) {
      api.input.register(action, { keys: [...BINDINGS[action]] });
    }
    registerAudio(api);
    registerDiagnostics(api);
    return [initialState(false), buildDebug()];
  },

  update(
    state: DeepReadonly<CaromState>,
    api: UpdateApi,
    dt: number,
  ): CaromState {
    api.audio.setMuted(state.muted);
    const afterInput = applyInput(state, api);
    const muted = api.audio.muted();

    if (
      afterInput.screen === "title" ||
      afterInput.screen === "howto" ||
      afterInput.screen === "paused" ||
      afterInput.screen === "matchover"
    ) {
      return { ...afterInput, simTime: afterInput.simTime + dt, muted };
    }

    return { ...advanceLive(afterInput, api, dt), muted };
  },

  render(state: DeepReadonly<CaromState>, api: RenderApi): void {
    const ctx = api.ctx;
    if (state.screen === "title") {
      drawTitle(state, ctx);
    } else if (state.screen === "howto") {
      drawHowTo(state, ctx);
    } else if (state.screen === "paused") {
      drawPause(state, ctx);
    } else if (state.screen === "matchover") {
      drawMatchOver(state, ctx);
    } else if (state.screen === "countdown") {
      drawCountdown(state, ctx);
    } else {
      drawField(state, ctx);
      drawHud(state, ctx);
    }
  },
};
