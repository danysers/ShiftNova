import type {ShiftNovaSettings, TimeSettings} from '../definitions';
import {findMatchingProfile, isAppearanceDark, migrateShiftNovaSettings} from '../shiftnova/config';
import {createDefaultShiftNovaSettings} from '../shiftnova/defaults';
import {derivePalette} from '../shiftnova/palette';
import {createSemanticStylesheet} from '../shiftnova/stylesheet';

const STYLE_ID = 'shiftnova-semantic-theme';
const DEFAULT_TIME: TimeSettings = {activation: '18:00', deactivation: '09:00'};
let settings: ShiftNovaSettings = createDefaultShiftNovaSettings();
let time: TimeSettings = DEFAULT_TIME;

function getStyleElement(): HTMLStyleElement {
    let style = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
    if (!style) {
        style = document.createElement('style');
        style.id = STYLE_ID;
        style.className = 'shiftnova';
        style.media = 'screen';
        (document.head || document.documentElement).append(style);
    }
    return style;
}

function apply(): void {
    const profile = findMatchingProfile(location.href, settings.profiles);
    if (!profile) {
        document.getElementById(STYLE_ID)?.remove();
        delete document.documentElement.dataset.shiftnovaProfile;
        delete document.documentElement.dataset.shiftnovaAppearance;
        return;
    }
    const dark = isAppearanceDark(profile.appearance, matchMedia('(prefers-color-scheme: dark)').matches, time);
    const palette = derivePalette(profile.palette, dark);
    getStyleElement().textContent = createSemanticStylesheet(palette, dark);
    document.documentElement.dataset.shiftnovaProfile = profile.id;
    document.documentElement.dataset.shiftnovaAppearance = dark ? 'dark' : 'light';
}

function readSettings(): void {
    chrome.storage.local.get<Record<string, unknown>>({shiftNova: createDefaultShiftNovaSettings(), time: DEFAULT_TIME}, (stored) => {
        settings = migrateShiftNovaSettings(stored.shiftNova).settings;
        time = (stored.time as TimeSettings | undefined) || DEFAULT_TIME;
        apply();
    });
}

apply();
readSettings();
chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'local' && (changes.shiftNova || changes.time)) {
        readSettings();
    }
});
const colorScheme = matchMedia('(prefers-color-scheme: dark)');
colorScheme.addEventListener?.('change', apply);
setInterval(() => {
    if (findMatchingProfile(location.href, settings.profiles)?.appearance === 'schedule') {
        apply();
    }
}, 60_000);
