import React, { useEffect, useRef, useState } from 'react';

interface Props {
  /** Zeilen der Überschrift — Reihenfolge = Darstellung von oben nach unten. */
  lines: { text: string; style: 'solid' | 'accent' | 'outline' }[];
  className?: string;
}

/**
 * Hero-Überschrift mit Wasser-Effekt: Die Zeilen werden in ein Canvas gezeichnet
 * und als Textur in einen WebGL-Shader gegeben. Der Zeiger hinterlässt Wellen,
 * die über die Buchstaben laufen und langsam auslaufen — wie eine Pfütze.
 *
 * Fallback (kein WebGL, Touch-Gerät, prefers-reduced-motion): normales DOM-Markup,
 * identisch gesetzt. Der DOM-Text bleibt immer vorhanden (Screenreader/SEO),
 * das Canvas liegt nur darüber.
 */
const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

const FRAG = `
precision mediump float;
uniform sampler2D uTex;
uniform vec2 uMouse;      // 0..1, y bereits geflippt
uniform float uTime;
uniform float uStrength;  // 0..1, klingt nach dem Verlassen ab
uniform vec2 uAspect;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  vec2 d = (uv - uMouse) * uAspect;
  float dist = length(d);

  // Ringwelle um den Zeiger, nach außen laufend und gedämpft
  float ring = sin(dist * 30.0 - uTime * 3.2) * exp(-dist * 6.0);
  // Sanfte Grunddünung, damit die "Pfütze" auch in Ruhe minimal lebt
  float swell = sin(uv.x * 9.0 + uTime * 0.7) * 0.0016 * uStrength;

  vec2 offset = normalize(d + 1e-5) * ring * 0.022 * uStrength;
  uv += offset;
  uv.y += swell;

  vec4 col = texture2D(uTex, uv);

  // Leichter Glanz auf den Wellenkämmen
  float sheen = clamp(ring * uStrength, 0.0, 1.0) * 0.28;
  col.rgb += sheen * col.a;

  gl_FragColor = col;
}`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    gl.deleteShader(sh);
    return null;
  }
  return sh;
}

const WaterHeadline: React.FC<Props> = ({ lines, className = '' }) => {
  const hostRef = useRef<HTMLDivElement>(null);
  const domRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;

    const host = hostRef.current;
    const dom = domRef.current;
    const canvas = canvasRef.current;
    if (!host || !dom || !canvas) return;

    const gl = (canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) ||
      canvas.getContext('experimental-webgl', { alpha: true })) as WebGLRenderingContext | null;
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'aPos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTex = gl.getUniformLocation(prog, 'uTex');
    const uMouse = gl.getUniformLocation(prog, 'uMouse');
    const uTime = gl.getUniformLocation(prog, 'uTime');
    const uStrength = gl.getUniformLocation(prog, 'uStrength');
    const uAspect = gl.getUniformLocation(prog, 'uAspect');

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let raf = 0;
    let disposed = false;
    let strength = 0;
    let targetStrength = 0;
    const mouse = { x: 0.5, y: 0.5 };
    const smooth = { x: 0.5, y: 0.5 };
    const start = performance.now();

    /** Zeichnet die DOM-Zeilen in ein 2D-Canvas und lädt es als Textur hoch. */
    const paint = () => {
      const rect = host.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return false;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = Math.round(rect.width * dpr);
      const h = Math.round(rect.height * dpr);

      const c2 = document.createElement('canvas');
      c2.width = w;
      c2.height = h;
      const ctx = c2.getContext('2d');
      if (!ctx) return false;
      ctx.scale(dpr, dpr);

      const spans = Array.from(dom.querySelectorAll<HTMLElement>('[data-line]'));
      spans.forEach((span) => {
        const cs = getComputedStyle(span);
        const sr = span.getBoundingClientRect();
        // Font-Shorthand inkl. line-height, damit Canvas exakt wie das DOM setzt
        ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize}/${cs.lineHeight} ${cs.fontFamily}`;
        const ls = cs.letterSpacing === 'normal' ? '0px' : cs.letterSpacing;
        const ctxAny = ctx as CanvasRenderingContext2D & { letterSpacing?: string };
        const supportsLS = typeof ctxAny.letterSpacing === 'string';
        if (supportsLS) ctxAny.letterSpacing = ls;
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';

        // WICHTIG: text-transform wird von Canvas NICHT angewendet — vorher selbst umsetzen,
        // sonst zeichnet das Canvas Kleinbuchstaben, während das DOM Großbuchstaben zeigt.
        const raw = span.textContent || '';
        const tt = cs.textTransform;
        const text =
          tt === 'uppercase' ? raw.toLocaleUpperCase('de-DE')
          : tt === 'lowercase' ? raw.toLocaleLowerCase('de-DE')
          : raw;
        const x = sr.left - rect.left;
        // Grundlinie aus den echten Font-Metriken statt geschätztem Faktor:
        // Zeilenkasten mittig um die Schriftbox, dann Ascent addieren.
        const m = ctx.measureText(text);
        const ascent = m.actualBoundingBoxAscent || parseFloat(cs.fontSize) * 0.72;
        const descent = m.actualBoundingBoxDescent || parseFloat(cs.fontSize) * 0.2;
        const y = sr.top - rect.top + (sr.height - (ascent + descent)) / 2 + ascent;

        const kind = span.dataset.line;
        const paintText = (fn: 'fill' | 'stroke') => {
          if (supportsLS) {
            if (fn === 'stroke') ctx.strokeText(text, x, y);
            else ctx.fillText(text, x, y);
            return;
          }
          // Fallback (Safari ohne ctx.letterSpacing): Zeichen einzeln mit Abstand
          const step = parseFloat(ls) || 0;
          let cx = x;
          for (const ch of text) {
            if (fn === 'stroke') ctx.strokeText(ch, cx, y);
            else ctx.fillText(ch, cx, y);
            cx += ctx.measureText(ch).width + step;
          }
        };
        if (kind === 'outline') {
          ctx.lineWidth = 2;
          ctx.lineJoin = 'round';
          ctx.strokeStyle = '#f4f4f0';
          paintText('stroke');
        } else {
          ctx.fillStyle = kind === 'accent' ? '#d4ff4f' : '#f4f4f0';
          paintText('fill');
        }
      });

      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      gl.viewport(0, 0, w, h);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, c2);
      gl.uniform2f(uAspect, rect.width / rect.height, 1);
      return true;
    };

    // Warten bis die Webfont geladen ist — sonst zeichnet Canvas die Fallback-Schrift.
    const boot = () => {
      if (disposed) return;
      if (!paint()) {
        raf = requestAnimationFrame(boot);
        return;
      }
      setActive(true);
      loop();
    };

    const loop = () => {
      if (disposed) return;
      const t = (performance.now() - start) / 1000;
      strength += (targetStrength - strength) * 0.07;
      smooth.x += (mouse.x - smooth.x) * 0.12;
      smooth.y += (mouse.y - smooth.y) * 0.12;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform1i(uTex, 0);
      gl.uniform2f(uMouse, smooth.x, smooth.y);
      gl.uniform1f(uTime, t);
      gl.uniform1f(uStrength, strength);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      raf = requestAnimationFrame(loop);
    };

    const onMove = (e: MouseEvent) => {
      const rect = host.getBoundingClientRect();
      mouse.x = (e.clientX - rect.left) / rect.width;
      mouse.y = 1 - (e.clientY - rect.top) / rect.height;
      targetStrength = 1;
    };
    const onLeave = () => {
      targetStrength = 0;
    };

    host.addEventListener('mousemove', onMove);
    host.addEventListener('mouseleave', onLeave);

    const onResize = () => paint();
    window.addEventListener('resize', onResize);

    if (document.fonts?.ready) {
      document.fonts.ready.then(() => {
        if (!disposed) paint();
      });
    }
    setTimeout(() => !disposed && paint(), 600);

    boot();

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      host.removeEventListener('mousemove', onMove);
      host.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('resize', onResize);
      gl.deleteTexture(tex);
      gl.deleteBuffer(buf);
      gl.deleteProgram(prog);
    };
  }, [lines]);

  return (
    <div ref={hostRef} className={`relative ${className}`}>
      {/* DOM-Text: bleibt für Screenreader/SEO, wird bei aktivem Shader unsichtbar */}
      <div ref={domRef} style={active ? { opacity: 0 } : undefined}>
        {lines.map((l, i) => (
          <span key={l.text} className="block overflow-hidden">
            <span
              data-line={l.style}
              className="block"
              style={
                l.style === 'outline'
                  ? { WebkitTextStroke: '2px #f4f4f0', color: 'transparent' }
                  : l.style === 'accent'
                    ? { color: '#d4ff4f' }
                    : undefined
              }
            >
              {l.text}
            </span>
          </span>
        ))}
      </div>
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ display: active ? 'block' : 'none' }}
      />
    </div>
  );
};

export default WaterHeadline;
