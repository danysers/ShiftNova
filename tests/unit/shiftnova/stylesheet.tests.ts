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

    test('adds safe color rules for predefined and custom elements', () => {
        const css = createSemanticStylesheet(derivePalette({base: '#C5D6FF'}, false), false, [
            {id: 'tabs', target: 'tabs', color: '#112233'},
            {id: 'custom', target: 'custom', color: '#F5F5F5', selector: '.componente-especial'},
        ]);
        expect(css).toContain('.nav-tabs');
        expect(css).toContain('background-color: #112233 !important');
        expect(css).toContain('.componente-especial');
        expect(css).toContain('background-color: #F5F5F5 !important');
    });
});
