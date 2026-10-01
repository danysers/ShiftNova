import {contrastRatio, derivePalette, getAccessibleText} from '../../../src/shiftnova/palette';

describe('ShiftNova semantic palette', () => {
    test('derives readable light and dark surfaces', () => {
        for (const dark of [false, true]) {
            const palette = derivePalette({base: '#C5D6FF'}, dark);
            expect(contrastRatio(palette.panels, palette.text)).toBeGreaterThanOrEqual(4.5);
        }
    });

    test('keeps the light environment color visible across the main surfaces', () => {
        const palette = derivePalette({base: '#C5D6FF'}, false);
        expect(palette.canvas).toBe('#DBE6FF');
        expect(palette.panels).toBe('#E9EFFF');
        expect(palette.sidebar).toBe('#CCDBFF');
    });

    test('chooses the text color with the greatest contrast', () => {
        expect(getAccessibleText('#FFFFFF')).toBe('#10212B');
        expect(getAccessibleText('#101010')).toBe('#F8FAFC');
    });

    test('honors surface overrides', () => {
        const palette = derivePalette({base: '#C5D6FF', header: '#112233', sidebar: '#223344'}, false);
        expect(palette.header).toBe('#112233');
        expect(palette.sidebar).toBe('#223344');
    });
});
