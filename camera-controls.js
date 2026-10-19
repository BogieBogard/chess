// Camera drags and taps are separate gestures. A multi-touch sequence can never move a piece.
export class CameraGestures {
  constructor(element, callbacks) {
    this.element = element;
    this.callbacks = callbacks;
    this.pointers = new Map();
    this.velocity = { x: 0, y: 0 };
    this.blockTap = false;
    element.style.touchAction = 'none';
    for (const type of ['pointerdown', 'pointermove', 'pointerup', 'pointercancel', 'lostpointercapture'])
      element.addEventListener(type, e => this.handle(type, e));
    element.addEventListener('contextmenu', e => e.preventDefault());
    element.addEventListener('wheel', e => {
      e.preventDefault();
      this.velocity.x = this.velocity.y = 0;
      callbacks.zoom(Math.exp(Math.max(-150, Math.min(150, e.deltaY)) * .003));
    }, { passive: false });
  }
  pair() {
    const [a, b] = [...this.pointers.values()];
    return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2,
      span: Math.max(8, Math.hypot(a.x - b.x, a.y - b.y)), angle: Math.atan2(b.y - a.y, b.x - a.x) };
  }
  handle(type, e) {
    if (type === 'pointerdown') {
      if (!this.pointers.size) this.blockTap = false;
      this.velocity.x = this.velocity.y = 0;
      this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, button: e.button });
      if (this.pointers.size > 1) this.blockTap = true;
      this.element.setPointerCapture?.(e.pointerId);
      return;
    }
    const p = this.pointers.get(e.pointerId);
    if (!p) return;
    if (type === 'pointermove') {
      const before = this.pointers.size > 1 ? this.pair() : null;
      const dx = e.clientX - p.x, dy = e.clientY - p.y;
      p.x = e.clientX; p.y = e.clientY;
      if (Math.hypot(p.x - p.startX, p.y - p.startY) > 7) this.blockTap = true;
      if (before) {
        const after = this.pair();
        this.callbacks.zoom(before.span / after.span);
        this.callbacks.pan(after.x - before.x, after.y - before.y);
        let twist = after.angle - before.angle;
        if (twist > Math.PI) twist -= Math.PI * 2;
        if (twist < -Math.PI) twist += Math.PI * 2;
        this.callbacks.orbit(-twist / .006, 0);
      } else if (this.blockTap) {
        if (p.button === 2 || e.shiftKey) this.callbacks.pan(dx, dy);
        else { this.callbacks.orbit(dx, dy); this.velocity = { x: dx, y: dy }; }
      }
      return;
    }
    if (type === 'pointerup' && this.pointers.size === 1 && !this.blockTap && p.button === 0)
      this.callbacks.tap(e);
    if (type !== 'pointerup') { this.blockTap = true; this.velocity.x = this.velocity.y = 0; }
    this.pointers.delete(e.pointerId);
  }
  update(dt) {
    if (this.pointers.size) return;
    const decay = Math.pow(.87, dt * 60);
    this.velocity.x *= decay; this.velocity.y *= decay;
    if (Math.abs(this.velocity.x) + Math.abs(this.velocity.y) > .08)
      this.callbacks.orbit(this.velocity.x * dt * 60, this.velocity.y * dt * 60);
  }
  stop() { this.velocity.x = this.velocity.y = 0; }
}
