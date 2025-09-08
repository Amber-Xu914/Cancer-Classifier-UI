// find the nearest sample ID to the selected sample.

export type Trace3D = {
  name?: string;
  type?: string;
  mode?: string;
  x?: any; y?: any; z?: any;
  customdata?: any;
  text?: any;
  marker?: { color?: any };
};
export type PlotlyFigure = { data?: Trace3D[]; layout?: any };

const DTYPE_MAP: Record<string, any> = {
  f8: Float64Array, f4: Float32Array,
  i4: Int32Array,  i2: Int16Array,  i1: Int8Array,
  u4: Uint32Array, u2: Uint16Array, u1: Uint8Array,
};

function base64ToUint8Array(b64: string): Uint8Array {
  const bin = atob(b64);
  const len = bin.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

export function toArray(v: any): number[] {
  if (!v) return [];
  if (Array.isArray(v)) return v.map(Number);

  // TypedArray
  if (ArrayBuffer.isView(v)) return Array.from(v as any);

  // { data: TypedArray }
  if (typeof v === "object" && "data" in v && ArrayBuffer.isView((v as any).data)) {
    return Array.from((v as any).data as any);
  }

  // { dtype: 'f8', bdata: '...base64...' }
  if (typeof v === "object" && "dtype" in v && "bdata" in v) {
    const dtype = String((v as any).dtype || "").toLowerCase();
    const Ctor = DTYPE_MAP[dtype] || Float64Array;
    const raw = base64ToUint8Array((v as any).bdata);
    const view = new Ctor(raw.buffer, raw.byteOffset, Math.floor(raw.byteLength / Ctor.BYTES_PER_ELEMENT));
    return Array.from(view as any);
  }

  if (typeof v === "object" && "vals" in v && Array.isArray((v as any).vals)) {
    return ((v as any).vals as any[]).map(Number);
  }

  return [];
}

export function coerceId(v: any): string | number {
  if (Array.isArray(v)) return coerceId(v[0]);
  if (v === null || v === undefined) return "";
  return (typeof v === "string" || typeof v === "number") ? v : String(v);
}

export function isRed(c: any): boolean {
  if (Array.isArray(c)) return c.some(isRed);
  if (typeof c !== "string") return false;
  return /\bred\b/i.test(c)
      || /#f{3,6}/i.test(c)
      || /rgb\(\s*255\s*,\s*0\s*,\s*0\s*\)/i.test(c);
}

export function parseFigure(fig: string | object): PlotlyFigure {
  try { return (typeof fig === "string" ? JSON.parse(fig) : fig) as PlotlyFigure; }
  catch { return { data: [] }; }
}

/** ===== Find selected sample ===== */
export function findSelectedPoint(
  fig: PlotlyFigure,
  sampleIdFromUrl?: string | number
): { x: number; y: number; z: number; id?: string | number } | null {
  const traces = Array.isArray(fig.data) ? fig.data : [];

  // find selected sample from trace.name
  const sel = traces.find(t => typeof t?.name === "string" && /selected/i.test(t.name));
  if (sel) {
    const xs = toArray(sel.x), ys = toArray(sel.y), zs = toArray(sel.z);
    if (xs.length && ys.length) {
      const point = {
        x: xs[0], y: ys[0], z: zs[0] ?? 0,
        id: sel.customdata ? coerceId(sel.customdata[0]) : coerceId(sel.text?.[0]),
      };
      // console.log("[DEBUG] Selected Sample located:", point);
      return point;
    }
  }

  return null;
}

/** ===== calculate distance ===== */
export function nearestIdsFromFigure(
  figureJSON: string | object,
  k = 3,
  sampleIdFromUrl?: string | number
): Array<string | number> {
  const fig = parseFigure(figureJSON);
  const traces = Array.isArray(fig.data) ? fig.data : [];
  if (!traces.length) return [];

  const selected = findSelectedPoint(fig, sampleIdFromUrl);
  if (!selected) return [];

  // joint all points
  const pts: { id: string | number; x: number; y: number; z: number }[] = [];
  for (const t of traces) {
    const xs = toArray(t.x), ys = toArray(t.y), zs = toArray(t.z);
    const ids = (t.customdata ?? t.text ?? []) as any[];
    const n = Math.min(xs.length, ys.length, zs.length || Infinity);
    for (let i = 0; i < n; i++) {
      let id = coerceId(ids[i]);
      if (id === "") id = `${t.name ?? "trace"}#${i}`;
      pts.push({ id, x: xs[i], y: ys[i], z: zs[i] ?? 0 });
    }
  }

  // distance calculation
  const ranked = pts
    .map(p => {
      const dx = selected.x - p.x, dy = selected.y - p.y, dz = selected.z - p.z;
      return { id: p.id, d2: dx * dx + dy * dy + dz * dz };
    })
    .filter(r => !(r.id === selected.id && r.d2 === 0)) // delete selected
    .sort((a, b) => a.d2 - b.d2);

  const out: Array<string | number> = [];
  for (const r of ranked) {
    if (!out.includes(r.id)) out.push(r.id);
    if (out.length >= k) break;
  }
  return out;
}