import type {AppearanceMode, ShiftNovaSettings, SiteProfile, TimeSettings} from '../definitions';
import {createDefaultShiftNovaSettings, SHIFTNOVA_SCHEMA_VERSION, SHIFTNOVA_UPDATE_MANIFEST_URL} from './defaults';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;
const HOSTNAME = /^(?=.{1,253}$)(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)*[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/i;
const APPEARANCE_MODES: AppearanceMode[] = ['light', 'dark', 'system', 'schedule'];

export interface ShiftNovaValidationResult {
    settings: ShiftNovaSettings;
    errors: string[];
}

export function normalizeHostname(hostname: string): string {
    let value = String(hostname || '').trim().toLowerCase();
    if (value.includes('://')) {
        try {
            value = new URL(value).hostname;
        } catch {
            return '';
        }
    }
    return value.replace(/^\.+|\.+$/g, '');
}

export function normalizePathPrefix(pathPrefix: string): string {
    let value = String(pathPrefix || '/').trim();
    if (!value.startsWith('/')) {
        value = `/${value}`;
    }
    value = value.replace(/\/{2,}/g, '/');
    return value || '/';
}

export function normalizeProfile(profile: SiteProfile): SiteProfile {
    return {
        ...profile,
        id: String(profile.id || '').trim(),
        name: String(profile.name || '').trim(),
        hostname: normalizeHostname(profile.hostname),
        pathPrefix: normalizePathPrefix(profile.pathPrefix),
        palette: {
            ...profile.palette,
            base: String(profile.palette?.base || '').toUpperCase(),
        },
    };
}

export function getProfileKey(profile: Pick<SiteProfile, 'hostname' | 'pathPrefix'>): string {
    return `${normalizeHostname(profile.hostname)}|${normalizePathPrefix(profile.pathPrefix)}`;
}

export function findMatchingProfile(url: string, profiles: SiteProfile[], includeDisabled = false): SiteProfile | null {
    let parsed: URL;
    try {
        parsed = new URL(url);
    } catch {
        return null;
    }
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
        return null;
    }
    const hostname = parsed.hostname.toLowerCase();
    const path = parsed.pathname || '/';
    return profiles
        .filter((profile) => (includeDisabled || profile.enabled) && normalizeHostname(profile.hostname) === hostname && path.startsWith(normalizePathPrefix(profile.pathPrefix)))
        .sort((a, b) => normalizePathPrefix(b.pathPrefix).length - normalizePathPrefix(a.pathPrefix).length)[0] || null;
}

export function isAppearanceDark(mode: AppearanceMode, systemDark: boolean, time: TimeSettings, now = new Date()): boolean {
    switch (mode) {
        case 'dark':
            return true;
        case 'system':
            return systemDark;
        case 'schedule':
            return isTimeInInterval(time.activation, time.deactivation, now);
        case 'light':
        default:
            return false;
    }
}

export function isTimeInInterval(start: string, end: string, now = new Date()): boolean {
    const parse = (value: string) => {
        const [hours, minutes] = value.split(':').map(Number);
        return hours * 60 + minutes;
    };
    const current = now.getHours() * 60 + now.getMinutes();
    const from = parse(start);
    const to = parse(end);
    return from === to || (from < to ? current >= from && current < to : current >= from || current < to);
}

export function validateShiftNovaSettings(input: unknown): ShiftNovaValidationResult {
    const defaults = createDefaultShiftNovaSettings();
    const errors: string[] = [];
    if (!input || typeof input !== 'object' || Array.isArray(input)) {
        return {settings: defaults, errors: ['La configuración ShiftNova debe ser un objeto.']};
    }
    const raw = input as Partial<ShiftNovaSettings>;
    const profiles: SiteProfile[] = [];
    const keys = new Set<string>();
    if (!Array.isArray(raw.profiles)) {
        errors.push('La lista de perfiles no es válida.');
    } else {
        raw.profiles.forEach((candidate, index) => {
            if (!candidate || typeof candidate !== 'object') {
                errors.push(`El perfil ${index + 1} no es un objeto.`);
                return;
            }
            const profile = normalizeProfile(candidate as SiteProfile);
            const overrideColors = ['header', 'sidebar', 'canvas', 'panels', 'accent'] as const;
            if (!profile.id || !profile.name || !HOSTNAME.test(profile.hostname) || !HEX_COLOR.test(profile.palette.base) || !APPEARANCE_MODES.includes(profile.appearance)) {
                errors.push(`El perfil ${index + 1} contiene campos inválidos.`);
                return;
            }
            for (const key of overrideColors) {
                const color = profile.palette[key];
                if (color && !HEX_COLOR.test(color)) {
                    errors.push(`El color ${key} del perfil “${profile.name}” no es válido.`);
                    return;
                }
            }
            const key = getProfileKey(profile);
            if (keys.has(key)) {
                errors.push(`La regla ${profile.hostname}${profile.pathPrefix} está duplicada.`);
                return;
            }
            keys.add(key);
            profiles.push(profile);
        });
    }

    const dark = raw.darkTheme || defaults.darkTheme;
    const clamp = (value: unknown, min: number, max: number, fallback: number) => {
        const number = Number(value);
        return Number.isFinite(number) ? Math.min(max, Math.max(min, number)) : fallback;
    };
    const updates = raw.updates || defaults.updates;
    let manifestURL = typeof updates.manifestURL === 'string' ? updates.manifestURL : SHIFTNOVA_UPDATE_MANIFEST_URL;
    if (!manifestURL.startsWith('https://danysers.github.io/ShiftNova/')) {
        errors.push('El manifiesto de actualización debe estar alojado en GitHub Pages de ShiftNova.');
        manifestURL = SHIFTNOVA_UPDATE_MANIFEST_URL;
    }
    return {
        settings: {
            schemaVersion: SHIFTNOVA_SCHEMA_VERSION,
            profiles,
            darkTheme: {
                brightness: clamp(dark.brightness, 50, 150, defaults.darkTheme.brightness),
                contrast: clamp(dark.contrast, 50, 150, defaults.darkTheme.contrast),
                sepia: clamp(dark.sepia, 0, 100, defaults.darkTheme.sepia),
                grayscale: clamp(dark.grayscale, 0, 100, defaults.darkTheme.grayscale),
            },
            updates: {
                checkOnPopupOpen: updates.checkOnPopupOpen !== false,
                knownVersion: typeof updates.knownVersion === 'string' ? updates.knownVersion : '',
                manifestURL,
            },
        },
        errors,
    };
}

export function migrateShiftNovaSettings(input: unknown): ShiftNovaValidationResult {
    if (!input) {
        return {settings: createDefaultShiftNovaSettings(), errors: []};
    }
    return validateShiftNovaSettings(input);
}
