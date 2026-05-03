import React, { useRef, useEffect, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
// Postprocessing was attempted but may not be available — using emissive glows instead.

// Boot lines (customizable if needed)
const BOOT_LINES = [
  'Initializing system...',
  'Checking hardware...',
  'Loading services...',
  'Starting compositor...',
  'Bringing up UI...'
];

const Scene3D = ({
  introText = 'Hi, I am Showrav karmakar.',
  profileSrc = '/images/profile.jpg',
  screenSrc = '/images/photography1.jpg', // screenshot shown inside the monitor mockup
  use3DCase = true, // set to true to show a small 3D case model near the monitor
  caseImageSrc = '/images/photography2.jpg', // image to map onto the front of the 3D case (optional)
  monitorPos = [0, 2.0, -0.7],
  monitorScale = [1.05, 1.05, 1.05],
  hideOnMobile = true
}) => {
  const startRef = useRef(performance.now());
  const canvasRef = useRef(null);
  const texRef = useRef(null);
  const dotRef = useRef();
  const monitorRef = useRef();
  const screenCircleRef = useRef();
  const towerRef = useRef();
  const fanRefs = useRef([]);
  const rimRef = useRef();
  const keyboardRef = useRef();
  const uiRefs = useRef([]);
  const profileImgRef = useRef(null);
  const imageLoadedRef = useRef(false);
  const screenImgRef = useRef(null);
  const screenImageLoadedRef = useRef(false);
  const caseFanRefs = useRef([]);
  const caseImgRef = useRef(null);
  const caseImageLoadedRef = useRef(false);
  const caseTextureRef = useRef(null);

  // create canvas texture
  const { canvas, texture } = useMemo(() => {
    const canvas = document.createElement('canvas');
    // widescreen desktop-like canvas
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#001219';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const texture = new THREE.CanvasTexture(canvas);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return { canvas, texture };
  }, []);

  // load profile image once
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = profileSrc;
    img.onload = () => {
      profileImgRef.current = img;
      imageLoadedRef.current = true;
    };

    // load screen screenshot if available
    const s = new Image();
    s.crossOrigin = 'anonymous';
    s.src = screenSrc;
    s.onload = () => {
      screenImgRef.current = s;
      screenImageLoadedRef.current = true;
    };

    // load case image texture if provided
    if (caseImageSrc) {
      const c = new Image();
      c.crossOrigin = 'anonymous';
      c.src = caseImageSrc;
      c.onload = () => {
        caseImgRef.current = c;
        caseImageLoadedRef.current = true;
        caseTextureRef.current = new THREE.CanvasTexture(c);
        caseTextureRef.current.minFilter = THREE.LinearFilter;
        caseTextureRef.current.magFilter = THREE.LinearFilter;
        caseTextureRef.current.needsUpdate = true;
      };
    }

    // Postprocessing is disabled to avoid dependency conflicts
    // Using emissive glows instead for visual effects
  }, [profileSrc, screenSrc, caseImageSrc]);

  useEffect(() => {
    canvasRef.current = canvas;
    texRef.current = texture;
  }, [canvas, texture]);



  useFrame((state, delta) => {
    const t = state.clock.getElapsedTime();
    const elapsed = (performance.now() - startRef.current) / 1000;

    // subtle camera bob (very small)
    if (state.camera) {
      const cam = state.camera;
      cam.position.x = Math.sin(t * 0.15) * 0.08;
      cam.position.y = 1.1 + Math.sin(t * 0.05) * 0.03;
      cam.lookAt(0, 0.9, 0);
    }

    // Phase timings
    const dotDuration = 0.8; // show pulsing dot
    const pauseAfterDot = 0.2;
    const typingStart = dotDuration + pauseAfterDot;
    const charDelay = 0.06;
    const typingDuration = introText.length * charDelay + 0.25;
    let uiStart = typingStart + typingDuration + 0.4; // when UI opens

    // responsive tweak: shorten UI start a bit on small widths
    const vw = Math.max(0, Math.min(window.innerWidth, 1600));
    if (vw < 768) {
      // stack faster on mobile
      uiStart = uiStart * 0.85;
    }

    // --- Dot pulse & fade ---
    if (dotRef.current) {
      if (elapsed < dotDuration) {
        const p = 0.6 + 0.4 * Math.sin(t * 6);
        dotRef.current.scale.setScalar(p);
        dotRef.current.material.opacity = 1;
      } else {
        // fade out
        const f = Math.min(1, (elapsed - dotDuration) / 0.4);
        dotRef.current.material.opacity = 1 - f;
        dotRef.current.scale.setScalar(0.6 * (1 - f) + 0.2);
      }
    }

    // --- Monitor opening animation & tower/fans animation ---
    if (monitorRef.current) {
      if (elapsed < uiStart) {
        const d = Math.max(0, Math.min(1, (elapsed - typingStart) / 0.8));
        // subtle breathing before full open
        monitorRef.current.scale.set(0.85 + d * 0.15, 0.85 + d * 0.15, 1);
        monitorRef.current.material.emissiveIntensity = 0.2 + d * 1.0;
      } else {
        const d2 = Math.min(1, (elapsed - uiStart) / 0.6);
        monitorRef.current.scale.set(1 + d2 * 0.03, 1 + d2 * 0.03, 1);
        monitorRef.current.material.emissiveIntensity = 1.2;
      }
    }

    // animate circular screen if present
    if (screenCircleRef.current) {
      screenCircleRef.current.rotation.z = Math.sin(t * 0.25) * 0.02;
      const s = 1 + Math.sin(t * 0.6) * 0.02;
      screenCircleRef.current.scale.setScalar(s);
    }

    // rotate fans and animate rim and keyboard for lively RGB motion
    if (fanRefs.current && fanRefs.current.length) {
      fanRefs.current.forEach((f, i) => {
        if (!f) return;
        f.rotation.z = t * (1.2 + i * 0.4);
      });
    }

    // Rotate case fans if they exist
    if (caseFanRefs.current && caseFanRefs.current.length) {
      caseFanRefs.current.forEach((f, i) => {
        if (!f) return;
        f.rotation.z = t * (1.5 + i * 0.3);
      });
    }

    if (rimRef.current) rimRef.current.rotation.z = t * 0.15;
    if (keyboardRef.current) keyboardRef.current.rotation.y = Math.sin(t * 0.6) * 0.02;
    if (towerRef.current) towerRef.current.rotation.y = Math.sin(t * 0.2) * 0.03;

    // Canvas drawing
    if (canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      const w = canvasRef.current.width;
      const h = canvasRef.current.height;

      // Clear background — desktop gradient after UI opens
      if (elapsed < uiStart) {
        // dark screen while typing
        ctx.fillStyle = '#001219';
        ctx.fillRect(0, 0, w, h);
      } else {
        // desktop background gradient
        const g = ctx.createLinearGradient(0, 0, w, h);
        g.addColorStop(0, '#012025');
        g.addColorStop(1, '#003b38');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }

      // Phase: typing intro text centered on screen
      if (elapsed >= typingStart && elapsed < typingStart + typingDuration) {
        const chars = Math.floor((elapsed - typingStart) / charDelay);
        const text = introText.slice(0, chars);

        ctx.fillStyle = '#00ffb3';
        ctx.font = '48px monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, w / 2, h / 2);

        // blinking caret
        if (Math.floor(t * 2) % 2 === 0) {
          const width = ctx.measureText(text).width;
          ctx.fillRect(w / 2 + width / 2 + 6, h / 2 - 18, 10, 36);
        }
      }

      // When UI opens, draw a centered profile and concise info
      if (elapsed >= uiStart) {
        const pad = 40;
        // softly darken backdrop behind the centered card
        const cardW = Math.min(560, w - pad * 2);
        const cardH = Math.min(420, h - pad * 2);
        const cardX = Math.floor((w - cardW) / 2);
        const cardY = Math.floor((h - cardH) / 2) - 20;
        ctx.fillStyle = 'rgba(0,0,0,0.18)';
        roundRect(ctx, cardX, cardY, cardW, cardH, 18, true, false);

        // centered profile image
        const cx = Math.floor(w / 2);
        const cy = cardY + 140;
        const r = 96;
        if (imageLoadedRef.current && profileImgRef.current) {
          const img = profileImgRef.current;
          ctx.save();
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();
          // fit image into circle
          const iw = img.width;
          const ih = img.height;
          const ir = Math.max(iw, ih);
          ctx.drawImage(img, cx - r, cy - r, r * 2, r * 2);
          ctx.restore();
        } else {
          ctx.fillStyle = '#001219';
          ctx.beginPath();
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
          ctx.fill();
        }

        // Name and subtitle centered below avatar
        ctx.fillStyle = '#e9d8a6';
        ctx.font = '32px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('Showrav karmakar', cx, cy + r + 40);

        ctx.fillStyle = '#94d2bd';
        ctx.font = '18px sans-serif';
        ctx.fillText('Software Engineer & Web Developer', cx, cy + r + 72);

        // small code lines under the card
        const codeLines = generateCodeLines();
        const codeElapsed = Math.min(1, (elapsed - uiStart) / 3.0);
        const linesToShow = Math.floor(codeElapsed * codeLines.length);
        ctx.fillStyle = '#00ffb3';
        ctx.font = '16px monospace';
        ctx.textAlign = 'center';
        for (let i = 0; i < linesToShow; i++) {
          ctx.fillText(codeLines[i], cx, cardY + cardH - 48 - (linesToShow - 1 - i) * 20);
        }

        // tiny thumbnail for 3D case (optional)
        if (use3DCase && caseImageLoadedRef.current && caseImgRef.current) {
          const thumbW = 120;
          const thumbH = 80;
          const tx = cx + Math.floor(cardW / 2) - thumbW - 16 - (pad / 4);
          const ty = cardY + cardH - thumbH - 24;
          ctx.drawImage(caseImgRef.current, tx, ty, thumbW, thumbH);
          ctx.strokeStyle = '#9b59ff';
          ctx.strokeRect(tx - 1, ty - 1, thumbW + 2, thumbH + 2);
        }
      }

      texRef.current.needsUpdate = true;
    }

    // UI tiles pop in (small 3D boxes)
    uiRefs.current.forEach((m, i) => {
      if (!m) return;
      const delay = uiStart + i * 0.12;
      const p = Math.min(1, Math.max(0, (elapsed - delay) / 0.5));
      m.scale.setScalar(0.3 + p * 0.7);
      m.material.opacity = 0.2 + p * 0.8;
      m.position.y = 0.3 + p * 0.1;
    });
  });

  return (
    <>
      {/* Base lighting for neon look */}
      <ambientLight intensity={0.12} />

      {/* Key/cool fill lights */}
      <pointLight position={[0, 4, 2]} color={'#89fff0'} intensity={0.4} distance={10} />
      <pointLight position={[3, 2, -1]} color={'#9b59ff'} intensity={0.8} distance={10} />
      <directionalLight position={[6, 6, 6]} intensity={0.25} />

      {/* subtle rim/back light to emphasize monitor */}
      <pointLight position={[0, 2.6, -1.2]} color={'#9b59ff'} intensity={1.4} distance={6} decay={2} />
      <pointLight position={[-2, 1.5, -0.5]} color={'#00f3ff'} intensity={0.6} distance={6} decay={2} />

      {/* Pulsing dot (moved up and slightly smaller) */}
      <mesh ref={dotRef} position={[0, 3.2, 0.3]} scale={[0.8, 0.8, 0.8]}>
        <sphereGeometry args={[0.055, 24, 24]} />
        <meshStandardMaterial color="#9b59ff" transparent opacity={1} emissive="#9b59ff" emissiveIntensity={1.5} />
      </mesh>

      {/* Towers removed — replaced by central boot screen for a cleaner animation */}

      {/* Neon ring behind monitor */}
      <mesh ref={rimRef} position={[0, 1.8, -1.2]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.8, 0.06, 16, 128]} />
        <meshStandardMaterial 
          color="#9b59ff" 
          emissive="#9b59ff" 
          emissiveIntensity={1.6} 
          metalness={0.0} 
          roughness={0.1} 
          transparent 
          opacity={0.95} 
        />
      </mesh>

      {/* Circular live screen above avatar */}
      <mesh ref={screenCircleRef} position={[0, 2.6, -0.6]} rotation={[0, 0, 0]}> 
        <circleGeometry args={[1.8, 128]} />
        <meshStandardMaterial 
          map={texture}
          toneMapped={false}
          emissive="#00f0ff"
          emissiveIntensity={0.7}
          metalness={0.0}
          roughness={0.05}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Central boot screen — floating animated canvas */}
      <group position={[0, 1.6, -0.6]} ref={monitorRef}>
        <mesh position={[0, 0, 0]} visible={false}>
          <planeGeometry args={[3.2, 1.9]} />
          <meshStandardMaterial map={texture} toneMapped={false} emissive="#00f0ff" emissiveIntensity={1.2} metalness={0.0} roughness={0.08} />
        </mesh>
      </group>

      {/* UI tiles - positioned around monitor sides */}
      {['Profile', 'Editor', 'Terminal'].map((name, i) => (
        <mesh
          key={name}
          ref={(el) => (uiRefs.current[i] = el)}
          position={[-1.1 + i * 1.1, 2.1, 0]}
          scale={[0.45, 0.45, 0.45]}
        >
          <boxGeometry args={[0.4, 0.2, 0.02]} />
          <meshStandardMaterial
            color={i === 1 ? '#ffb74d' : '#0a9396'}
            transparent
            opacity={0.8}
            emissive={i === 1 ? '#ffb74d' : '#0a9396'}
            emissiveIntensity={0.5}
          />
        </mesh>
      ))}

      {/* Keyboard */}
      <group ref={keyboardRef} position={[0, 0.8, 0.8]} rotation={[0.1, 0, 0]}>
        {/* Keyboard base */}
        <mesh position={[0, -0.02, 0]}>
          <boxGeometry args={[2.2, 0.04, 0.8]} />
          <meshStandardMaterial
            color="#1a1a1a"
            metalness={0.8}
            roughness={0.2}
            emissive="#1a1a1a"
            emissiveIntensity={0.1}
          />
        </mesh>

        {/* Function keys row */}
        {['F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8'].map((key, i) => (
          <mesh key={key} position={[-1.4 + i * 0.18, 0, -0.25]}>
            <boxGeometry args={[0.15, 0.02, 0.12]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.9}
              roughness={0.1}
              emissive="#00ffb3"
              emissiveIntensity={0.2}
            />
          </mesh>
        ))}

        {/* QWERTY row */}
        {['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'].map((key, i) => (
          <mesh key={key} position={[-1.2 + i * 0.15, 0, -0.05]}>
            <boxGeometry args={[0.12, 0.02, 0.12]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.9}
              roughness={0.1}
              emissive="#9b59ff"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* ASDF row */}
        {['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'].map((key, i) => (
          <mesh key={key} position={[-1.125 + i * 0.15, 0, 0.1]}>
            <boxGeometry args={[0.12, 0.02, 0.12]} />
            <meshStandardMaterial
              color="#2a2a2a"
              metalness={0.9}
              roughness={0.1}
              emissive="#00f3ff"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* ZXCV row */}
        {['Z', 'X', 'C', 'V', 'B', 'N', 'M'].map((key, i) => (
          <mesh key={key} position={[-0.9 + i * 0.15, 0, 0.25]}>
            <boxGeometry args={[0.12, 0.02, 0.12]} />
            <meshStandardMaterial
              color="#c4c1c1ff"
              metalness={0.9}
              roughness={0.1}
              emissive="#ffb74d"
              emissiveIntensity={0.3}
            />
          </mesh>
        ))}

        {/* Space bar */}
        <mesh position={[0.2, 0, 0.4]}>
          <boxGeometry args={[0.8, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.1}
            emissive="#89fff0"
            emissiveIntensity={0.4}
          />
        </mesh>

        {/* Arrow keys */}
        <mesh position={[1.2, 0, 0.1]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.1}
            emissive="#ff6b6b"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[1.35, 0, 0.1]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.1}
            emissive="#ff6b6b"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[1.2, 0, 0.25]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.1}
            emissive="#ff6b6b"
            emissiveIntensity={0.3}
          />
        </mesh>
        <mesh position={[1.05, 0, 0.1]}>
          <boxGeometry args={[0.12, 0.02, 0.12]} />
          <meshStandardMaterial
            color="#2a2a2a"
            metalness={0.9}
            roughness={0.1}
            emissive="#ff6b6b"
            emissiveIntensity={0.3}
          />
        </mesh>
      </group>

      {/* decorative glow */}
      <pointLight position={[0, 1.5, 1.5]} color="#00ffb3" intensity={0.06} />
    </>
  );
};

// Small helper: rounded rectangle
function roundRect(ctx, x, y, w, h, r, fill, stroke) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}

// produce sample lines for code generation
function generateCodeLines() {
  return [
    "const app = createApp('portfolio');",
    "app.use(react());",
    "render(<App />, rootEl);",
    "// generating components...",
    "<Hero /> <Projects /> <Contact />",
    "// deployed to: /dist"
  ];
}

export default Scene3D;