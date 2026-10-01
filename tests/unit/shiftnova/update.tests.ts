import {compareVersions, getUpdateAction, parseReleaseManifest} from '../../../src/shiftnova/update';

describe('ShiftNova updates', () => {
    test('compares semantic versions', () => {
        expect(compareVersions('1.2.0', '1.1.9')).toBe(1);
        expect(compareVersions('v1.0.0', '1.0.0')).toBe(0);
        expect(compareVersions('1.0.0', '2.0.0')).toBe(-1);
    });

    test('accepts only the official GitHub locations', () => {
        expect(parseReleaseManifest({
            version: '1.2.3',
            releaseURL: 'https://github.com/danysers/ShiftNova/releases/tag/v1.2.3',
            chromiumURL: 'https://github.com/danysers/ShiftNova/releases/download/v1.2.3/shiftnova.zip',
            firefoxURL: 'https://github.com/danysers/ShiftNova/releases/download/v1.2.3/shiftnova.xpi',
        })).not.toBeNull();
        expect(parseReleaseManifest({version: '1.2.3', releaseURL: 'https://evil.test', chromiumURL: '', firefoxURL: ''})).toBeNull();
    });

    test('selects direct installation only for a signed Firefox package', () => {
        const manifest = parseReleaseManifest({
            version: '1.2.3',
            releaseURL: 'https://github.com/danysers/ShiftNova/releases/tag/v1.2.3',
            chromiumURL: 'https://github.com/danysers/ShiftNova/releases/download/v1.2.3/shiftnova.zip',
            firefoxURL: 'https://github.com/danysers/ShiftNova/releases/download/v1.2.3/shiftnova.xpi',
        })!;

        expect(getUpdateAction(manifest, true)).toEqual({
            url: manifest.firefoxURL,
            label: 'Instalar actualización',
            installsDirectly: true,
        });
        expect(getUpdateAction(manifest, false)).toEqual({
            url: manifest.chromiumURL,
            label: 'Descargar actualización',
            installsDirectly: false,
        });

        const unsignedFirefox = {...manifest, firefoxURL: manifest.releaseURL};
        expect(getUpdateAction(unsignedFirefox, true).installsDirectly).toBe(false);
        expect(getUpdateAction(unsignedFirefox, true).url).toBe(manifest.releaseURL);
    });
});
