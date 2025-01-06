
export type RawColor = [number, number, number];

export class RgbColor {
	private readonly m_r: number;
	private readonly m_g: number;
	private readonly m_b: number;

	public constructor(r: number, g: number, b: number) {
		this.m_r = Math.min(Math.max(r, 0), 255);
		this.m_g = Math.min(Math.max(g, 0), 255);
		this.m_b = Math.min(Math.max(b, 0), 255);
	}

	public toHsl(): HslColor {
		const r = this.m_r / 255;
		const g = this.m_g / 255;
		const b = this.m_b / 255;

		const max = Math.max(r, g, b);
		const min = Math.min(r, g, b);
		const delta = max - min;

		let h, s;
		const l = (max + min) / 2;

		if (delta === 0) {
			h = s = 0;
		} else {
			s = delta / (1 - Math.abs(2 * l - 1));

			if (max === r) {
				h = (g - b) / delta + (g < b ? 6 : 0);
			} else if (max === g) {
				h = (b - r) / delta + 2;
			} else {
				h = (r - g) / delta + 4;
			}

			h *= 60;
			h = (h + 360) % 360;
		}

		return new HslColor(h, s * 100, l * 100);
	}

	public get r(): number {
		return this.m_r;
	}

	public get g(): number {
		return this.m_g;
	}

	public get b(): number {
		return this.m_b;
	}

	public get hexColor(): number {
		return ((1 << 24) | (this.m_r << 16) | (this.m_g << 8) | this.m_b);
	}

	public get wsColor(): string {
		return `v,${this.m_r},${this.m_b},${this.m_g}`;
	}

	public get cssColor(): string {
		return `rgb(${this.m_r}, ${this.m_g}, ${this.m_b})`
	}

	public get rawColor(): RawColor {
		return [this.m_r, this.m_g, this.m_b];
	}
}

export class HslColor {
	private readonly m_h: number;
	private readonly m_s: number;
	private readonly m_l: number;

	public constructor(h: number, s: number, l: number) {
		this.m_h = (h % 360 + 360) % 360;
		this.m_s = Math.min(Math.max(s, 0), 100);
		this.m_l = Math.min(Math.max(l, 0), 100);
	}

	public toRgb(): RgbColor {
		let r, g, b;
		const h = this.m_h / 360;
		const s = this.m_s / 100;
		const l = this.m_l / 100;

		if (s === 0) {
			r = g = b = l;
		} else {
			function hue2rgb(p: number, q: number, t: number): number {
				if (t < 0) t += 1;
				if (t > 1) t -= 1;
				if (t < 1 / 6) return p + (q - p) * 6 * t;
				if (t < 1 / 2) return q;
				if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
				return p;
			}

			const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
			const p = 2 * l - q;

			r = hue2rgb(p, q, h + 1 / 3);
			g = hue2rgb(p, q, h);
			b = hue2rgb(p, q, h - 1 / 3);
		}

		return new RgbColor(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
	}

	public get h(): number {
		return this.m_h;
	}

	public get s(): number {
		return this.m_s;
	}

	public get l(): number {
		return this.m_l;
	}

	public get cssColor(): string {
		return `hsl(${this.m_h}, ${this.m_s}, ${this.m_l})`;
	}
}

export function getColorBrightness(color: RgbColor) {
	return Math.round(((color.r * 299) + (color.g * 587) + (color.b * 114)) / 1000);
}
