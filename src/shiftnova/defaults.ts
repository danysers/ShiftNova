import type {ShiftNovaSettings, SiteProfile} from '../definitions';

export const SHIFTNOVA_SCHEMA_VERSION = 1;
export const SHIFTNOVA_UPDATE_MANIFEST_URL = 'https://danysers.github.io/ShiftNova/latest.json';

export const DEFAULT_SITE_PROFILES: SiteProfile[] = [
    createDefaultProfile('sigapp-produccion', 'SIGAPP Producción', 'sigapp.formosa.gob.ar', '#F5F5F5'),
    createDefaultProfile('siarh-prueba', 'SIARH Prueba', 'pruebasiarh.formosa.gob.ar', '#C5D6FF'),
    createDefaultProfile('siarh-prueba-v3', 'SIARH Prueba v3', 'pruebasiarhv3.formosa.gob.ar', '#C5D6FF'),
    createDefaultProfile('ide', 'IDE', 'ide.formosa.gob.ar', '#F5F5F5'),
    createDefaultProfile('sigapp-desarrollo', 'SIGAPP Desarrollo', 'desasigappv2.formosa.gob.ar', '#FFFFC5'),
];

function createDefaultProfile(id: string, name: string, hostname: string, base: string): SiteProfile {
    return {
        id,
        name,
        enabled: true,
        hostname,
        pathPrefix: '/',
        appearance: 'light',
        palette: {base},
    };
}

export const DEFAULT_SHIFTNOVA_SETTINGS: ShiftNovaSettings = {
    schemaVersion: SHIFTNOVA_SCHEMA_VERSION,
    profiles: DEFAULT_SITE_PROFILES,
    darkTheme: {
        brightness: 100,
        contrast: 100,
        sepia: 0,
        grayscale: 0,
    },
    updates: {
        checkOnPopupOpen: true,
        knownVersion: '',
        manifestURL: SHIFTNOVA_UPDATE_MANIFEST_URL,
    },
};

export function createDefaultShiftNovaSettings(): ShiftNovaSettings {
    return JSON.parse(JSON.stringify(DEFAULT_SHIFTNOVA_SETTINGS)) as ShiftNovaSettings;
}
