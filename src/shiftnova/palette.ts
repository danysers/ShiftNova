import type {SemanticPalette} from '../definitions';

export interface DerivedPalette {
    base: string;
    header: string;
    sidebar: string;
    canvas: string;
    content: string;
    panels: string;
    actionBar: string;
    activeTab: string;
    border: string;
    hover: string;
    focus: string;
    accent: string;
    text: string;
    mutedText: string;
    input: string;
}

type RGB = {r: number; g: number; b: number};

function fromHex(hex: string): RGB {
    const value = hex.replace('#', '');
    return {
        r: parseInt(value.slice(0, 2), 16),
        g: parseInt(value.slice(2, 4), 16),
        b: parseInt(value.slice(4, 6), 16),
    };
}

function toHex({r, g, b}: RGB): string {
    return `#${[r, g, b].map((value) => Math.round(value).toString(16).padStart(2, '0')).join('')}`.toUpperCase();
}

export function mixColors(first: string, second: string, secondWeight: number): string {
    const a = fromHex(first);
    const b = fromHex(second);
    const weight = Math.max(0, Math.min(1, secondWeight));
    return toHex({
        r: a.r * (1 - weight) + b.r * weight,
        g: a.g * (1 - weight) + b.g * weight,
        b: a.b * (1 - weight) + b.b * weight,
    });
}

function luminance(hex: string): number {
    const channels = Object.values(fromHex(hex)).map((value) => {
        const normalized = value / 255;
        return normalized <= 0.03928 ? normalized / 12.92 : ((normalized + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

export function contrastRatio(first: string, second: string): number {
    const a = luminance(first);
    const b = luminance(second);
    return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

export function getAccessibleText(background: string): string {
    const dark = '#10212B';
    const light = '#F8FAFC';
    return contrastRatio(background, dark) >= contrastRatio(background, light) ? dark : light;
}

export function derivePalette(palette: SemanticPalette, dark: boolean): DerivedPalette {
    const base = palette.base.toUpperCase();
    if (dark) {
        const canvas = palette.canvas || mixColors(base, '#0B1116', 0.86);
        const panels = palette.panels || mixColors(base, '#151D24', 0.78);
        const accent = palette.accent || mixColors(base, '#FF4B4B', 0.18);
        return {
            base,
            header: palette.header || mixColors(base, '#11181E', 0.80),
            sidebar: palette.sidebar || mixColors(base, '#0E151B', 0.83),
            canvas,
            content: mixColors(canvas, '#FFFFFF', 0.035),
            panels,
            actionBar: mixColors(panels, '#FFFFFF', 0.05),
            activeTab: mixColors(base, '#202B34', 0.62),
            border: mixColors(base, '#9BA9B4', 0.55),
            hover: mixColors(panels, '#FFFFFF', 0.10),
            focus: accent,
            accent,
            text: '#F1F5F9',
            mutedText: '#BCC8D1',
            input: mixColors(canvas, '#FFFFFF', 0.09),
        };
    }
    const canvas = palette.canvas || mixColors(base, '#FFFFFF', 0.38);
    const panels = palette.panels || mixColors(base, '#FFFFFF', 0.62);
    const accent = palette.accent || mixColors(base, '#1976D2', 0.58);
    return {
        base,
        header: palette.header || mixColors(base, '#FFFFFF', 0.22),
        sidebar: palette.sidebar || mixColors(base, '#FFFFFF', 0.12),
        canvas,
        content: mixColors(base, '#FFFFFF', 0.50),
        panels,
        actionBar: mixColors(base, '#FFFFFF', 0.36),
        activeTab: mixColors(base, '#FFFFFF', 0.10),
        border: mixColors(base, '#64748B', 0.32),
        hover: mixColors(base, '#FFFFFF', 0.08),
        focus: accent,
        accent,
        text: getAccessibleText(panels),
        mutedText: '#475569',
        input: mixColors(base, '#FFFFFF', 0.82),
    };
}
