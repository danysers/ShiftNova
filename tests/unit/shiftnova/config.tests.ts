import {findMatchingProfile, isAppearanceDark, normalizeHostname, normalizePathPrefix, validateShiftNovaSettings} from '../../../src/shiftnova/config';
import {createDefaultShiftNovaSettings} from '../../../src/shiftnova/defaults';

describe('ShiftNova profile configuration', () => {
    test('normalizes hostnames and paths', () => {
        expect(normalizeHostname(' HTTPS://SIGAPP.Formosa.GOB.AR/demo ')).toBe('sigapp.formosa.gob.ar');
        expect(normalizePathPrefix('modulos//embargos')).toBe('/modulos/embargos');
    });

    test('selects the longest matching path and ignores query/hash', () => {
        const settings = createDefaultShiftNovaSettings();
        settings.profiles = [
            {...settings.profiles[0], id: 'root', hostname: 'example.test', pathPrefix: '/'},
            {...settings.profiles[0], id: 'specific', hostname: 'example.test', pathPrefix: '/embargos'},
        ];
        expect(findMatchingProfile('https://example.test/embargos/listado?q=1#top', settings.profiles)?.id).toBe('specific');
    });

    test('rejects duplicate normalized rules', () => {
        const settings = createDefaultShiftNovaSettings();
        settings.profiles.push({...settings.profiles[0], id: 'duplicate', hostname: 'SIGAPP.FORMOSA.GOB.AR', pathPrefix: '/'});
        expect(validateShiftNovaSettings(settings).errors.join(' ')).toContain('duplicada');
    });

    test('resolves fixed, system and overnight schedule modes', () => {
        const time = {activation: '18:00', deactivation: '09:00'};
        expect(isAppearanceDark('light', true, time)).toBe(false);
        expect(isAppearanceDark('dark', false, time)).toBe(true);
        expect(isAppearanceDark('system', true, time)).toBe(true);
        expect(isAppearanceDark('schedule', false, time, new Date(2026, 0, 1, 23, 0))).toBe(true);
        expect(isAppearanceDark('schedule', false, time, new Date(2026, 0, 1, 12, 0))).toBe(false);
    });

    test('migrates missing surface overrides and validates custom selectors', () => {
        const settings = createDefaultShiftNovaSettings();
        const legacyProfile = {...settings.profiles[0]} as Partial<(typeof settings.profiles)[number]>;
        delete legacyProfile.surfaceOverrides;
        const migrated = validateShiftNovaSettings({...settings, profiles: [legacyProfile]});
        expect(migrated.errors).toEqual([]);
        expect(migrated.settings.profiles[0].surfaceOverrides).toEqual([]);

        settings.profiles[0].surfaceOverrides = [{id: 'modal-color', target: 'custom', color: '#334455', selector: '.modal-especial'}];
        expect(validateShiftNovaSettings(settings).errors).toEqual([]);
        settings.profiles[0].surfaceOverrides[0].selector = '.modal { color: red; }';
        expect(validateShiftNovaSettings(settings).errors.join(' ')).toContain('selector personalizado');
    });
});
