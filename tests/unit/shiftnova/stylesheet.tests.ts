import {derivePalette} from '../../../src/shiftnova/palette';
import {createSemanticStylesheet} from '../../../src/shiftnova/stylesheet';

describe('ShiftNova SIARH stylesheet', () => {
    test('covers FlexMind surfaces created by modules at runtime', () => {
        const css = createSemanticStylesheet(derivePalette({base: '#C5D6FF'}, false), false);
        expect(css).toContain('.contentSystem');
        expect(css).toContain('[id^="contentSystem_"]');
        expect(css).toContain('.flex .hDiv');
        expect(css).toContain('.flex .bDiv');
        expect(css).toContain('.crumbs');
    });

    test('leaves classified grid rows outside the neutral row palette', () => {
        const css = createSemanticStylesheet(derivePalette({base: '#C5D6FF'}, false), false);
        expect(css).toContain(':not(:where(.success, .danger, .warning, .info, .cazul');
        expect(css).toContain('.trSelected');
    });
});
