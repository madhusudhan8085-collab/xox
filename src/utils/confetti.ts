/**
 * Lightweight native Canvas Confetti burst
 */
export function fireConfetti(reducedMotion: boolean = false) {
  if (reducedMotion) return;

  const canvas = document.createElement('canvas');
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.width = '100vw';
  canvas.style.height = '100vh';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '9999';
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    document.body.removeChild(canvas);
    return;
  }

  const width = (canvas.width = window.innerWidth);
  const height = (canvas.height = window.innerHeight);

  const particles: {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    color: string;
    rotation: number;
    vr: number;
    opacity: number;
  }[] = [];

  const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#ec4899', '#f59e0b', '#10b981'];

  const count = 100;
  for (let i = 0; i < count; i++) {
    particles.push({
      x: width / 2,
      y: height * 0.4,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.7) * 14,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      opacity: 1,
    });
  }

  let animationFrame: number;
  let startTime = performance.now();

  function render(time: number) {
    const elapsed = time - startTime;
    ctx?.clearRect(0, 0, width, height);

    let active = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.3; // Gravity
      p.vx *= 0.98; // Friction
      p.rotation += p.vr;
      if (elapsed > 1200) {
        p.opacity -= 0.02;
      }

      if (p.opacity > 0 && p.y < height + 50) {
        active = true;
        ctx?.save();
        ctx?.translate(p.x, p.y);
        ctx?.rotate((p.rotation * Math.PI) / 180);
        ctx!.globalAlpha = Math.max(0, p.opacity);
        ctx!.fillStyle = p.color;
        ctx?.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
        ctx?.restore();
      }
    }

    if (active && elapsed < 2500) {
      animationFrame = requestAnimationFrame(render);
    } else {
      cancelAnimationFrame(animationFrame);
      if (canvas.parentNode) {
        canvas.parentNode.removeChild(canvas);
      }
    }
  }

  animationFrame = requestAnimationFrame(render);
}
