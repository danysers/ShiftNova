export interface ShiftNovaReleaseManifest {
    version: string;
    releaseURL: string;
    chromiumURL: string;
    firefoxURL: string;
    publishedAt?: string;
}

const VERSION = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

export function compareVersions(first: string, second: string): number {
    const a = first.replace(/^v/, '').split(/[.-]/).slice(0, 3).map(Number);
    const b = second.replace(/^v/, '').split(/[.-]/).slice(0, 3).map(Number);
    for (let index = 0; index < 3; index++) {
        const delta = (a[index] || 0) - (b[index] || 0);
        if (delta !== 0) {
            return delta > 0 ? 1 : -1;
        }
    }
    return 0;
}

export function parseReleaseManifest(value: unknown): ShiftNovaReleaseManifest | null {
    if (!value || typeof value !== 'object') {
        return null;
    }
    const manifest = value as ShiftNovaReleaseManifest;
    if (!VERSION.test(manifest.version) || !isAllowedURL(manifest.releaseURL) || !isAllowedURL(manifest.chromiumURL) || !isAllowedURL(manifest.firefoxURL)) {
        return null;
    }
    return manifest;
}

function isAllowedURL(value: unknown): value is string {
    return typeof value === 'string' && (value.startsWith('https://github.com/danysers/ShiftNova/') || value.startsWith('https://danysers.github.io/ShiftNova/'));
}
