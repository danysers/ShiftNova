enum CSP {
    NONE = "'none'",
    SELF = "'self'"
}

export function prepareCSPMV3(): chrome.runtime.ManifestV3['content_security_policy'] {
    const result: Record<string, string> = {};
    const policy: Record<string, Record<string, string[]>> = {
        extension_pages: {
            'default-src': [CSP.NONE],
            'script-src': [CSP.SELF],
            'style-src': [CSP.SELF],
            'img-src': [CSP.SELF, 'data:'],
            'connect-src': [CSP.SELF, 'https://danysers.github.io'],
            'navigate-to': [CSP.SELF, 'https://github.com/danysers/ShiftNova/*'],
            'media-src': [CSP.NONE],
            'child-src': [CSP.NONE],
            'worker-src': [CSP.NONE],
            'object-src': [CSP.NONE],
        },
    };
    for (const page in policy) {
        const outputs: string[] = [];
        for (const directive in policy[page]) {
            outputs.push(`${directive} ${policy[page][directive].join(' ')}`);
        }
        result[page] = outputs.join('; ');
    }
    return result;
}
