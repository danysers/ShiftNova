import type {TimeSettings} from '../definitions';
import {findMatchingProfile, isAppearanceDark, migrateShiftNovaSettings} from '../shiftnova/config';
import {createDefaultShiftNovaSettings} from '../shiftnova/defaults';

declare const __FIREFOX_MV2__: boolean;

const DEFAULT_TIME: TimeSettings = {activation: '18:00', deactivation: '09:00'};

function applyFallbackIfNeeded(shiftNova: unknown, time: TimeSettings): void {
    const profile = findMatchingProfile(location.href, migrateShiftNovaSettings(shiftNova).settings.profiles);
    const shouldApply = profile && isAppearanceDark(profile.appearance, matchMedia('(prefers-color-scheme: dark)').matches, time);
    if (!(
        shouldApply &&
        document.documentElement instanceof HTMLHtmlElement &&
        !document.querySelector('.darkreader--fallback') &&
        !document.querySelector('.darkreader') &&
        !(__FIREFOX_MV2__ && window !== top)
    )) {
        return;
    }

    const fallback = document.createElement('style');
    fallback.classList.add('darkreader', 'darkreader--fallback');
    fallback.media = 'screen';
    fallback.textContent = [
        'html, body {',
        '    background-color: #111820 !important;',
        '    color: #f1f5f9 !important;',
        '    opacity: 1 !important;',
        '    transition: none !important;',
        '}',
    ].join('\n');
    (document.head || document.documentElement).append(fallback);
}

chrome.storage.local.get<Record<string, unknown>>({shiftNova: createDefaultShiftNovaSettings(), time: DEFAULT_TIME}, (stored) => {
    applyFallbackIfNeeded(stored.shiftNova, (stored.time as TimeSettings | undefined) || DEFAULT_TIME);
});
