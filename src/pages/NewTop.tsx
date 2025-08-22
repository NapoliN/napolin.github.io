// PixelSplitLanding.tsx  (PixiJS v8 + external CSS)
import React, { useEffect, useRef, useState } from "react";
import { Application, Assets, Sprite, TextureStyle, Graphics } from "pixi.js";
import "./NewTop.css";

type Props = {
  imageUrl?: string;               // 例: "/pixel/hero256.png"（原寸256x256）
  links?: { label: string; href: string }[];
  bg?: string;                     // 背景色（必要なら）
};

type DotParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  life: number;
};

export default function PixelSplitLanding({
  imageUrl = "shibuya_portfolio.png",
  links = [
    { label: "Profile", href: "#profile" },
    { label: "Artworks", href: "#artworks" },
    { label: "Photos", href: "#photos" },
  ],
  bg = "#0b0d10",
}: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const resizeCleanupRef = useRef<(() => void) | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [awaitingPress, setAwaitingPress] = useState(false);
  const titleCanvasRef = useRef<HTMLCanvasElement>(null);
  const titleParticlesRef = useRef<DotParticle[]>([]);
  const explodeAnimRef = useRef<number | null>(null);

  useEffect(() => {
    if (!awaitingPress) return;
    const canvas = titleCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const text = "Napolin's Lab";
    const fontSize = 48;
    const off = document.createElement("canvas");
    const offCtx = off.getContext("2d")!;
    offCtx.font = `${fontSize}px 'DotGothic16'`;
    const metrics = offCtx.measureText(text);
    off.width = Math.ceil(metrics.width);
    off.height = Math.ceil(fontSize * 1.2);
    offCtx.font = `${fontSize}px 'DotGothic16'`;
    offCtx.fillStyle = "#fff";
    offCtx.fillText(text, 0, fontSize);
    const data = offCtx.getImageData(0, 0, off.width, off.height).data;
    canvas.width = off.width;
    canvas.height = off.height;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const pts: DotParticle[] = [];
    const step = 4;
    for (let y = 0; y < off.height; y += step) {
      for (let x = 0; x < off.width; x += step) {
        if (data[(y * off.width + x) * 4 + 3] > 128) {
          ctx.fillStyle = "#e6e6e6";
          ctx.fillRect(x, y, 2, 2);
          pts.push({ x, y, vx: 0, vy: 0, age: 0, life: 0 });
        }
      }
    }
    titleParticlesRef.current = pts;
  }, [awaitingPress]);

  const explodeTitle = (after: () => void) => {
    const canvas = titleCanvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) { after(); return; }
    const parts = titleParticlesRef.current.map((p) => ({
      ...p,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
      life: 60 + Math.random() * 30,
      age: 0,
    }));
    titleParticlesRef.current = parts;
    const step = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let alive = false;
      for (const p of parts) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1;
        p.age++;
        if (p.age < p.life) {
          alive = true;
          ctx.fillStyle = "#e6e6e6";
          ctx.fillRect(p.x, p.y, 2, 2);
        }
      }
      if (alive) {
        explodeAnimRef.current = requestAnimationFrame(step);
      } else {
        after();
      }
    };
    step();
  };

  useEffect(() => {
    let disposed = false; // StrictMode二重実行対策

    // "Press Any Button" の一時リスナー参照
    let pressArmed = false;
    let onAnyKey: ((e: KeyboardEvent) => void) | null = null;
    let onAnyPointer: ((e: PointerEvent) => void) | null = null;

    // pointermove 系のリスナー参照
    let onPointerMoveHandler: ((e: PointerEvent) => void) | null = null;
    let onPointerEndHandler: ((e: PointerEvent) => void) | null = null;

    // v8: 最近傍補間（にじみ防止）— テクスチャ読み込み前に設定
    TextureStyle.defaultOptions.scaleMode = "nearest";

    (async () => {
      const app = new Application();
      await app.init({
        width: window.innerWidth,
        height: window.innerHeight,
        antialias: false,
        backgroundAlpha: 0,
        resolution: 1,
      });
      if (disposed) { app.destroy(); return; }
      appRef.current = app;

      const canvas = app.canvas;
      canvas.className = "px-stage"; // ← 見た目はCSSに任せる
      if (mountRef.current) {
        const m = mountRef.current;
        if (!m.contains(canvas)) m.prepend(canvas); // 背面に追加
      }

      // 画像ロード → スプライト
      const tex = await Assets.load(imageUrl);
      const sprite = new Sprite(tex);
      sprite.anchor.set(0.5);
      app.stage.addChild(sprite);
      sprite.visible = false;

      // グリッド（縦512/横256）
      const screenGrid = new Graphics();
      screenGrid.eventMode = "none";
      screenGrid.visible = false;
      app.stage.addChild(screenGrid);

      // Loading FX layer
      const loaderFx = new Graphics();
      loaderFx.eventMode = "none";
      app.stage.addChild(loaderFx);

      // ドロー用オーバーレイ
      const dotFx = new Graphics();
      dotFx.eventMode = "none";
      app.stage.addChild(dotFx);

      // ===== ローディング（3s）：横幅80%の水平ラインを粒子で描画 =====
      const LOADER_MS = 3000;
      let loaderStart = performance.now();
      let loaderDone = false;
      let loaderParticles: { x:number;y:number;vx:number;vy:number;age:number;life:number }[] = [];
      let lastHead: { i:number; j:number } | null = null;
      const LCOLS = 512, LROWS = 256; // grid解像度
      const ldirs = [
        {x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1},
        {x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1}
      ];
      const loaderSpeed = 40;     // cells/sec baseline
      const loaderLifeBase = 260; // ms baseline

      app.ticker.add(() => {
        if (loaderDone) return;
        const now = performance.now();
        const W = app.renderer.width, H = app.renderer.height;
        const cw = W / LCOLS, ch = H / LROWS;
        loaderFx.clear();

        // 画面中央の水平ライン（幅80%）を左→右へ
        const startX = W * 0.1;
        const lineW  = W * 0.8;
        const yPix   = H * 0.5;
        const progress = Math.min(1, (now - loaderStart) / LOADER_MS);
        const headX = startX + lineW * progress;

        const iHead = Math.floor((headX / W) * LCOLS);
        const jMid  = Math.floor((yPix  / H) * LROWS);

        // ヘッド位置が前フレームから更新されたときのみ粒子を生成
        if (!lastHead || lastHead.i !== iHead || lastHead.j !== jMid) {
          const path = lastHead
            ? rasterLine(lastHead.i, lastHead.j, iHead, jMid)
            : [{ i: iHead, j: jMid }];
          for (const p of path) {
            const count = 2 + ((Math.random() * 2) | 0); // 2-3粒/セル
            for (let k = 0; k < count; k++) {
              const d = ldirs[(Math.random() * ldirs.length) | 0];
              const sp = loaderSpeed * (0.8 + Math.random() * 0.6);
              const life = loaderLifeBase * (0.8 + Math.random() * 0.8);
              loaderParticles.push({
                x: p.i + 0.5,
                y: p.j + 0.5,
                vx: d.x * sp,
                vy: d.y * sp,
                age: 0,
                life,
              });
            }
          }
          lastHead = { i: iHead, j: jMid };
        }

        const dt = app.ticker.deltaMS / 1000;
        const alive: typeof loaderParticles = [];
        for (const p of loaderParticles){
          p.age += app.ticker.deltaMS;
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          if (p.age < p.life) alive.push(p);
          const qx = Math.round(p.x - 0.5);
          const qy = Math.round(p.y - 0.5);
          if (qx>=0 && qx<LCOLS && qy>=0 && qy<LROWS){
            const px = qx * cw, py = qy * ch;
            loaderFx.rect(Math.floor(px), Math.floor(py), Math.ceil(cw), Math.ceil(ch)).fill(0xffffff);
          }
        }
        loaderParticles = alive;

        if (progress >= 1 && loaderParticles.length === 0){
          loaderDone = true;
          // 「PRESS ANY BUTTON」を表示
          setAwaitingPress(true);
          if (!pressArmed) {
            pressArmed = true;
            const reveal = () => {
              if (onAnyKey) { window.removeEventListener("keydown", onAnyKey); onAnyKey = null; }
              if (onAnyPointer) { window.removeEventListener("pointerdown", onAnyPointer); onAnyPointer = null; }
              explodeTitle(() => {
                setAwaitingPress(false);
                screenGrid.visible = true;
                sprite.visible = true;
                interactionEnabled = true;
                setIsLoaded(true);
              });
            };
            onAnyKey = () => reveal();
            onAnyPointer = () => reveal();
            window.addEventListener("keydown", onAnyKey);
            window.addEventListener("pointerdown", onAnyPointer);
          }
          // ローダー削除
          loaderFx.clear();
          app.stage.removeChild(loaderFx);
        }
      });

      // ===== 画像のアルファに沿ったホバー判定＋左右スウェイ =====
      let alphaData: Uint8ClampedArray | null = null;
      const res: any = (tex.source as any).resource;
      const srcEl: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement | undefined = res?.source;
      const texW = tex.source.width ?? 256;
      const texH = tex.source.height ?? 256;
      try {
        if (srcEl) {
          const off = document.createElement("canvas");
          off.width = texW; off.height = texH;
          const ictx = off.getContext("2d", { willReadFrequently: true })!;
          ictx.imageSmoothingEnabled = false;
          ictx.drawImage(srcEl, 0, 0, texW, texH);
          alphaData = ictx.getImageData(0, 0, texW, texH).data;
        }
      } catch { alphaData = null; }

      const alphaContains = (lx: number, ly: number) => {
        const ax = Math.floor(lx + texW * sprite.anchor.x);
        const ay = Math.floor(ly + texH * sprite.anchor.y);
        if (ax < 0 || ay < 0 || ax >= texW || ay >= texH) return false;
        if (!alphaData) return true;
        return alphaData[(ay * texW + ax) * 4 + 3] > 16;
      };

      sprite.hitArea = { contains: alphaContains as any };
      sprite.eventMode = "static";
      sprite.cursor = "pointer";

      let hoveringOpaque = false;
      let interactionEnabled = false; // ローダー完了後に有効化
      sprite.on("pointerover", () => { hoveringOpaque = true; });
      sprite.on("pointerout",  () => { hoveringOpaque = false; });

      let baseX = 0, baseY = 0;
      let phase = 0;
      let offset = 0;
      const AMP = 6, FREQ = 1.0;
      const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

      app.ticker.add(() => {
        const dt = app!.ticker.deltaMS / 1000;
        if (hoveringOpaque) phase += dt * FREQ;
        const target = hoveringOpaque ? AMP * (2 * easeInOutSine((phase % 1)) - 1) : 0;
        offset += (target - offset) * 0.18;
        sprite.x = Math.floor(baseX + Math.round(offset));
        sprite.y = baseY;
      });

      // ===== ドット描画（pointermove + 直線補間）→ 1秒後に粒子化 =====
      const COLS = 512, ROWS = 256;
      type Cell = { i: number; j: number };
      type Particle = { x:number; y:number; vx:number; vy:number; age:number; life:number };
      type Burst = { cells: Cell[]; t0: number; spawned?: boolean; particles?: Particle[] };
      let bursts: Burst[] = [];
      let lastCell: Cell | null = null;

      onPointerMoveHandler = (e: PointerEvent) => {
        if (!app) return;
        if (!interactionEnabled) { lastCell = null; return; }
        if ((e.buttons & 1) === 0) { lastCell = null; return; } // 左ボタンのみ
        const rect = app.canvas.getBoundingClientRect();
        const rx = (e.clientX - rect.left) / rect.width;
        const ry = (e.clientY - rect.top) / rect.height;
        if (rx < 0 || ry < 0 || rx > 1 || ry > 1) { lastCell = null; return; }
        const i = Math.floor(rx * COLS);
        const j = Math.floor(ry * ROWS);

        const path = lastCell ? rasterLine(lastCell.i, lastCell.j, i, j) : [{ i, j }];
        const set = new Set<string>();
        const cells: Cell[] = [];
        for (const p of path) {
          for (let dj = -1; dj <= 1; dj++) {
            for (let di = -1; di <= 1; di++) {
              const ii = p.i + di, jj = p.j + dj;
              if (ii < 0 || ii >= COLS || jj < 0 || jj >= ROWS) continue;
              const key = ii + "," + jj;
              if (!set.has(key)) { set.add(key); cells.push({ i: ii, j: jj }); }
            }
          }
        }
        bursts.push({ cells, t0: performance.now() });
        lastCell = { i, j };
      };
      app.canvas.addEventListener("pointermove", onPointerMoveHandler);
      onPointerEndHandler = () => { lastCell = null; };
      app.canvas.addEventListener("pointerup", onPointerEndHandler);
      app.canvas.addEventListener("pointerleave", onPointerEndHandler);
      app.canvas.addEventListener("pointercancel", onPointerEndHandler);

      // 毎フレーム描画
      app.ticker.add(() => {
        if (!app) return;
        const now = performance.now();
        const W = app.renderer.width, H = app.renderer.height;
        const cw = W / COLS, ch = H / ROWS;
        dotFx.clear();

        const paintMS = 100;       // 0-1000ms: 白塗り
        const popDurBase = 220;     // 粒子寿命の基準（ms）
        const popDurMax  = popDurBase * 2.0;
        const speedCells = 128;      // 粒子速度（セル/秒）

        const alive: Burst[] = [];
        for (const b of bursts) {
          const age = now - b.t0;
          let keep = false;

          if (age < paintMS) {
            for (const c of b.cells) {
              const x = c.i * cw, y = c.j * ch;
              dotFx.rect(Math.floor(x), Math.floor(y), Math.ceil(cw), Math.ceil(ch)).fill(0xffffff);
            }
            keep = true;
          } else {
            if (!b.spawned) {
              b.spawned = true;
              b.particles = [];
              const dirs = [
                {x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1},
                {x:1,y:1},{x:1,y:-1},{x:-1,y:1},{x:-1,y:-1}
              ];
              for (const c of b.cells) {
                const count = 2 + Math.floor(Math.random()*2); // 2〜3粒
                for (let k=0;k<count;k++){
                  const d = dirs[(Math.random()*dirs.length)|0];
                  const sp   = speedCells * (0.7 + Math.random()*0.6);
                  const life = popDurBase * (0.7 + Math.random()*0.6);
                  b.particles!.push({ x:c.i+0.5, y:c.j+0.5, vx:d.x*sp, vy:d.y*sp, age:0, life });
                }
              }
            }
            const dt = app.ticker.deltaMS / 1000;
            const parts: Particle[] = [];
            for (const p of b.particles || []){
              p.age += app.ticker.deltaMS;
              p.x += p.vx * dt;
              p.y += p.vy * dt;
              if (p.age < p.life) parts.push(p);
              const qx = Math.round(p.x - 0.5);
              const qy = Math.round(p.y - 0.5);
              if (qx>=0 && qx<COLS && qy>=0 && qy<ROWS){
                const px = qx * cw, py = qy * ch;
                dotFx.rect(Math.floor(px), Math.floor(py), Math.ceil(cw), Math.ceil(ch)).fill(0xffffff);
              }
            }
            b.particles = parts;
            if (parts.length > 0 && age < paintMS + popDurMax) keep = true;
          }

          if (keep) alive.push(b);
        }
        bursts = alive;
      });

      // レイアウト
      const BASE = 256; // 原寸サイズ
      const layout = () => {
        if (!appRef.current) return;
        const W = window.innerWidth, H = window.innerHeight;
        appRef.current.renderer.resize(W, H);

        // 左半分領域
        const leftW = Math.floor(W / 2);
        const leftH = H;

        // 左半分に収まる最大の整数倍率
        const s = Math.max(1, Math.floor(Math.min(leftW / BASE, leftH / BASE)));
        sprite.scale.set(s);

        baseX = Math.floor(leftW / 2);
        baseY = Math.floor(H / 2);
        sprite.position.set(baseX, baseY);

        drawScreenGrid512x256(screenGrid, W, H);
      };
      layout();
      const onResize = () => layout();
      window.addEventListener("resize", onResize);
      resizeCleanupRef.current = () => window.removeEventListener("resize", onResize);
    })();

    return () => {
      disposed = true;
      // リスナー解除
      resizeCleanupRef.current?.();
      resizeCleanupRef.current = null;

      const app = appRef.current;
      appRef.current = null;
      if (app) {
        if (onPointerMoveHandler) {
          app.canvas.removeEventListener("pointermove", onPointerMoveHandler as any);
          onPointerMoveHandler = null;
        }
        if (onPointerEndHandler) {
          app.canvas.removeEventListener("pointerup", onPointerEndHandler as any);
          app.canvas.removeEventListener("pointerleave", onPointerEndHandler as any);
          app.canvas.removeEventListener("pointercancel", onPointerEndHandler as any);
          onPointerEndHandler = null;
        }
        if (onAnyKey) { window.removeEventListener("keydown", onAnyKey as any); onAnyKey = null; }
        if (onAnyPointer) { window.removeEventListener("pointerdown", onAnyPointer as any); onAnyPointer = null; }
        const canvas = app.canvas as unknown as HTMLCanvasElement | undefined;
        if (canvas && canvas.parentNode) canvas.parentNode.removeChild(canvas);
        app.destroy();
      }
      if (explodeAnimRef.current) {
        cancelAnimationFrame(explodeAnimRef.current);
        explodeAnimRef.current = null;
      }
    };
  }, [imageUrl]);

  return (
    <div ref={mountRef} className="px-root" style={{ background: bg }}>
      {/* PRESS ANY BUTTON overlay */}
      {awaitingPress && (
        <div className="px-press-overlay">
          <canvas ref={titleCanvasRef} className="px-title-canvas" />
          <div className="px-press-label">PRESS ANY BUTTON</div>
        </div>
      )}

      {/* 右側リンク */}
      <div className={`px-menu-wrap ${isLoaded ? "is-visible" : ""}`}>
        <nav className="px-nav">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="px-link">
              {l.label}
            </a>
          ))}
        </nav>
      </div>
    </div>
  );
}

// グリッド上で2点を結ぶ離散直線（Bresenham）
function rasterLine(i0:number, j0:number, i1:number, j1:number){
  const pts: {i:number;j:number}[] = [];
  let x0=i0, y0=j0, x1=i1, y1=j1;
  const dx = Math.abs(x1 - x0), dy = Math.abs(y1 - y0);
  const sx = x0 < x1 ? 1 : -1;
  const sy = y0 < y1 ? 1 : -1;
  let err = dx - dy;
  while (true) {
    pts.push({ i:x0, j:y0 });
    if (x0 === x1 && y0 === y1) break;
    const e2 = err * 2;
    if (e2 > -dy) { err -= dy; x0 += sx; }
    if (e2 <  dx) { err += dx; y0 += sy; }
  }
  return pts;
}

// 画面全体に 縦512/横256 の白線を引く
function drawScreenGrid512x256(g: Graphics, W: number, H: number){
  g.clear();
  for(let i=0;i<=512;i++){ const x = (W * i) / 512; g.moveTo(x, 0).lineTo(x, H); }
  for(let j=0;j<=256;j++){ const y = (H * j) / 256; g.moveTo(0, y).lineTo(W, y); }
  g.stroke({ color: 0xffffff, alpha: 0.3, width: 1, pixelLine: true });
}
