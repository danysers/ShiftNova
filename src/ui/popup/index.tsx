import type {ExtensionData, SemanticPalette, ShiftNovaSettings, SiteProfile, TimeSettings} from '../../definitions';
import {findMatchingProfile, normalizeHostname, normalizePathPrefix, validateShiftNovaSettings} from '../../shiftnova/config';
import {createDefaultShiftNovaSettings} from '../../shiftnova/defaults';
import {compareVersions, getUpdateAction, parseReleaseManifest} from '../../shiftnova/update';
import type {ShiftNovaReleaseManifest} from '../../shiftnova/update';
import Connector from '../connect/connector';

const connector = new Connector();
let data: ExtensionData;
let releaseManifest: ShiftNovaReleaseManifest | null = null;
let updateMessage = 'Todavía no se comprobó la versión publicada.';
let formMessage = '';
let ignoreReportsUntil = 0;
let colorSaveTimer: number | null = null;

const BUG_REPORT_URL = 'https://github.com/danysers/ShiftNova/issues/new?template=bug_report.yml';
const FEATURE_REQUEST_URL = 'https://github.com/danysers/ShiftNova/issues/new?template=feature_request.yml';
const UPDATE_HELP_URL = 'https://github.com/danysers/ShiftNova#-cómo-actualizar';

function isFirefoxBrowser(): boolean {
    return navigator.userAgent.includes('Firefox');
}

function clampPopupScroll(): void {
    window.requestAnimationFrame(() => {
        const maximumScroll = Math.max(0, document.body.scrollHeight - document.body.clientHeight);
        if (document.body.scrollTop > maximumScroll) {
            document.body.scrollTop = maximumScroll;
        }
    });
}

function showFormMessage(message: string): void {
    formMessage = message;
    const element = document.querySelector<HTMLParagraphElement>('#form-message');
    if (element) {
        element.textContent = message;
        element.hidden = !message;
    }
}

function escapeHTML(value: unknown): string {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function cloneSettings(): ShiftNovaSettings {
    return JSON.parse(JSON.stringify(data.settings.shiftNova)) as ShiftNovaSettings;
}

function createID(): string {
    if (globalThis.crypto?.randomUUID) {
        return globalThis.crypto.randomUUID();
    }
    return `perfil-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function getCurrentURL(): URL | null {
    try {
        const url = new URL(data.activeTab.url);
        return url.protocol === 'http:' || url.protocol === 'https:' ? url : null;
    } catch {
        return null;
    }
}

function saveShiftNova(next: ShiftNovaSettings, message = 'Configuración guardada.', rerender = true): boolean {
    const validation = validateShiftNovaSettings(next);
    if (validation.errors.length > 0) {
        showFormMessage(validation.errors[0]);
        if (rerender) {
            render();
        }
        return false;
    }
    data.settings.shiftNova = validation.settings;
    showFormMessage(message);
    ignoreReportsUntil = Date.now() + 1500;
    connector.changeSettings({shiftNova: validation.settings});
    if (rerender) {
        render();
    }
    return true;
}

function saveTime(time: TimeSettings): void {
    data.settings.time = time;
    ignoreReportsUntil = Date.now() + 1500;
    connector.changeSettings({time});
    showFormMessage('Horario guardado.');
}

function profileMarkup(profile: SiteProfile, index: number): string {
    const colorInput = (field: keyof SemanticPalette, label: string) => `
        <label class="field field--color-optional">
            <span>${label}</span>
            <input data-profile="${escapeHTML(profile.id)}" data-field="palette.${field}" value="${escapeHTML(profile.palette[field] || '')}" placeholder="#RRGGBB (automático)" maxlength="7" />
        </label>`;
    return `
        <article class="profile-card" data-profile-card="${escapeHTML(profile.id)}">
            <div class="profile-card__title">
                <span class="profile-index">${index + 1}</span>
                <input class="profile-name" data-profile="${escapeHTML(profile.id)}" data-field="name" value="${escapeHTML(profile.name)}" aria-label="Nombre del perfil" />
                <label class="switch" title="Habilitar perfil">
                    <input type="checkbox" data-profile="${escapeHTML(profile.id)}" data-field="enabled" ${profile.enabled ? 'checked' : ''} />
                    <span></span>
                </label>
            </div>
            <div class="grid grid--two">
                <label class="field"><span>Dominio</span><input data-profile="${escapeHTML(profile.id)}" data-field="hostname" value="${escapeHTML(profile.hostname)}" /></label>
                <label class="field"><span>Prefijo de ruta</span><input data-profile="${escapeHTML(profile.id)}" data-field="pathPrefix" value="${escapeHTML(profile.pathPrefix)}" /></label>
                <label class="field"><span>Apariencia</span>
                    <select data-profile="${escapeHTML(profile.id)}" data-field="appearance">
                        <option value="light" ${profile.appearance === 'light' ? 'selected' : ''}>Claro</option>
                        <option value="dark" ${profile.appearance === 'dark' ? 'selected' : ''}>Oscuro</option>
                        <option value="system" ${profile.appearance === 'system' ? 'selected' : ''}>Sistema</option>
                        <option value="schedule" ${profile.appearance === 'schedule' ? 'selected' : ''}>Horario</option>
                    </select>
                </label>
                <label class="field field--color"><span>Color base</span><input type="color" data-profile="${escapeHTML(profile.id)}" data-field="palette.base" value="${escapeHTML(profile.palette.base)}" /></label>
            </div>
            <details class="advanced">
                <summary>Superficies avanzadas</summary>
                <div class="grid grid--two">
                    ${colorInput('header', 'Cabecera')}
                    ${colorInput('sidebar', 'Árbol lateral')}
                    ${colorInput('canvas', 'Lienzo')}
                    ${colorInput('panels', 'Paneles')}
                    ${colorInput('accent', 'Acento')}
                </div>
            </details>
            <div class="profile-actions">
                <button data-action="up" data-profile="${escapeHTML(profile.id)}" ${index === 0 ? 'disabled' : ''} aria-label="Subir perfil">↑</button>
                <button data-action="down" data-profile="${escapeHTML(profile.id)}" ${index === data.settings.shiftNova.profiles.length - 1 ? 'disabled' : ''} aria-label="Bajar perfil">↓</button>
                <button data-action="duplicate" data-profile="${escapeHTML(profile.id)}">Duplicar</button>
                <button class="danger" data-action="delete" data-profile="${escapeHTML(profile.id)}">Eliminar</button>
            </div>
        </article>`;
}

function render(): void {
    const currentURL = getCurrentURL();
    const currentProfile = currentURL ? findMatchingProfile(currentURL.href, data.settings.shiftNova.profiles, true) : null;
    const version = chrome.runtime.getManifest().version;
    const isFirefox = isFirefoxBrowser();
    const updateAvailable = releaseManifest && compareVersions(releaseManifest.version, version) > 0;
    const updateAction = releaseManifest && updateAvailable ? getUpdateAction(releaseManifest, isFirefox) : null;
    const releaseButton = releaseManifest ? `
        <button class="secondary" id="open-release">Ver release</button>
        ${updateAction ? `<button id="download-update">${updateAction.label}</button>` : ''}` : '';
    const updateHint = updateAction?.installsDirectly ?
        'Firefox solicitará confirmación y reemplazará la versión instalada con el paquete firmado.' : isFirefox ?
            'La actualización directa en Firefox se habilita cuando la versión publicada incluye un paquete firmado por Mozilla.' :
            'Chrome, Edge y Opera no permiten que una extensión instalada manualmente se reemplace sola. ShiftNova descargará el paquete y mostrará la guía para completar la recarga.';
    document.body.innerHTML = `
        <main class="app">
            <header class="brand">
                <img src="../assets/images/shiftnova-logo.png" alt="ShiftNova" />
                <div><h1>ShiftNova</h1><p>Identidad visual por entorno</p></div>
            </header>

            <section class="current-site">
                <div>
                    <span class="eyebrow">Sitio actual</span>
                    <strong>${escapeHTML(currentURL?.hostname || 'Página no compatible')}</strong>
                    <small>${escapeHTML(currentURL?.pathname || data.activeTab.url || '')}</small>
                </div>
                <span class="status ${currentProfile ? 'status--matched' : ''}">${currentProfile ? escapeHTML(currentProfile.name) : 'Sin perfil'}</span>
                ${currentProfile ? `
                    <label class="site-toggle"><input id="toggle-current" type="checkbox" ${currentProfile.enabled ? 'checked' : ''} /><span>Activo en este perfil</span></label>
                ` : currentURL ? '<button id="create-current">Crear perfil para esta URL</button>' : ''}
            </section>

            <p class="message" id="form-message" role="status" ${formMessage ? '' : 'hidden'}>${escapeHTML(formMessage)}</p>

            <details open>
                <summary>Perfiles de entorno <span>${data.settings.shiftNova.profiles.length}</span></summary>
                <div class="section-content profiles">
                    ${data.settings.shiftNova.profiles.map(profileMarkup).join('')}
                    <button class="wide secondary" id="add-profile">+ Nuevo perfil</button>
                    <button class="wide ghost" id="reset-profiles">Restablecer perfiles iniciales</button>
                </div>
            </details>

            <details>
                <summary>Modo oscuro y automatización</summary>
                <div class="section-content">
                    <div class="range-grid">
                        ${rangeMarkup('brightness', 'Brillo', data.settings.shiftNova.darkTheme.brightness, 50, 150)}
                        ${rangeMarkup('contrast', 'Contraste', data.settings.shiftNova.darkTheme.contrast, 50, 150)}
                        ${rangeMarkup('sepia', 'Sepia', data.settings.shiftNova.darkTheme.sepia, 0, 100)}
                        ${rangeMarkup('grayscale', 'Escala de grises', data.settings.shiftNova.darkTheme.grayscale, 0, 100)}
                    </div>
                    <div class="grid grid--two schedule">
                        <label class="field"><span>Oscuro desde</span><input id="schedule-start" type="time" value="${escapeHTML(data.settings.time.activation)}" /></label>
                        <label class="field"><span>Claro desde</span><input id="schedule-end" type="time" value="${escapeHTML(data.settings.time.deactivation)}" /></label>
                    </div>
                    <p class="hint">Cada perfil decide si usa claro, oscuro, el sistema o este horario.</p>
                </div>
            </details>

            <details>
                <summary>Importar y exportar</summary>
                <div class="section-content button-row">
                    <button id="export-settings">Exportar JSON</button>
                    <button class="secondary" id="import-settings">Importar JSON</button>
                    <input id="import-file" type="file" accept="application/json,.json" hidden />
                </div>
            </details>

            <details>
                <summary>Ayuda y reportes</summary>
                <div class="section-content support">
                    <p>Si encontraste un error o tienes una idea, puedes enviarla al repositorio oficial.</p>
                    <div class="button-row">
                        <button id="report-bug">Reportar un error</button>
                        <button class="secondary" id="suggest-feature">Proponer una mejora</button>
                    </div>
                    <p class="hint">Los reportes se guardan públicamente en GitHub Issues. No incluyas contraseñas, datos personales ni información confidencial.</p>
                </div>
            </details>

            <details>
                <summary>Acerca de y actualizaciones</summary>
                <div class="section-content about">
                    <div><strong>Versión instalada</strong><span>${escapeHTML(version)}</span></div>
                    <div><strong>Versión publicada</strong><span>${escapeHTML(releaseManifest?.version || '—')}</span></div>
                    <p>${escapeHTML(updateMessage)}</p>
                    <div class="button-row"><button id="check-updates">Comprobar ahora</button>${releaseButton}</div>
                    <label class="check"><input id="check-on-open" type="checkbox" ${data.settings.shiftNova.updates.checkOnPopupOpen ? 'checked' : ''} /> Comprobar al abrir</label>
                    <p class="hint">${escapeHTML(updateHint)}</p>
                    <button class="wide ghost" id="update-help">Ver cómo actualizar</button>
                    <p class="attribution">Basado en Dark Reader 4.9.133, licencia MIT. ShiftNova sólo se conecta con el repositorio oficial de GitHub.</p>
                </div>
            </details>
        </main>`;
    bindEvents(currentProfile);
    clampPopupScroll();
}

function rangeMarkup(field: keyof ShiftNovaSettings['darkTheme'], label: string, value: number, min: number, max: number): string {
    return `<label class="range"><span>${label}</span><input type="range" data-dark-field="${field}" min="${min}" max="${max}" value="${value}" /><output>${value}%</output></label>`;
}

function bindEvents(currentProfile: SiteProfile | null): void {
    document.querySelector('#toggle-current')?.addEventListener('change', (event) => {
        if (!currentProfile) {
            return;
        }
        const next = cloneSettings();
        const profile = next.profiles.find(({id}) => id === currentProfile.id)!;
        profile.enabled = (event.target as HTMLInputElement).checked;
        saveShiftNova(next, 'Configuración guardada.', false);
    });
    document.querySelector('#create-current')?.addEventListener('click', createProfileFromCurrentURL);
    document.querySelector('#add-profile')?.addEventListener('click', () => addProfile(null));
    document.querySelector('#reset-profiles')?.addEventListener('click', () => {
        if (confirm('¿Restablecer los perfiles iniciales de ShiftNova?')) {
            saveShiftNova(createDefaultShiftNovaSettings(), 'Perfiles iniciales restablecidos.');
        }
    });

    document.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-profile][data-field]').forEach((input) => {
        if (input instanceof HTMLInputElement && input.type === 'color') {
            input.addEventListener('input', () => scheduleColorSave(input));
        }
        input.addEventListener('change', () => {
            if (colorSaveTimer !== null) {
                window.clearTimeout(colorSaveTimer);
                colorSaveTimer = null;
            }
            updateProfileField(input, false);
        });
    });
    document.querySelectorAll<HTMLButtonElement>('[data-action][data-profile]').forEach((button) => {
        button.addEventListener('click', () => runProfileAction(button.dataset.action!, button.dataset.profile!));
    });
    document.querySelectorAll<HTMLInputElement>('[data-dark-field]').forEach((input) => {
        input.addEventListener('input', () => {
            input.nextElementSibling!.textContent = `${input.value}%`;
        });
        input.addEventListener('change', () => {
            const next = cloneSettings();
            const key = input.dataset.darkField as keyof ShiftNovaSettings['darkTheme'];
            next.darkTheme[key] = Number(input.value);
            saveShiftNova(next, 'Ajustes del modo oscuro guardados.', false);
        });
    });
    document.querySelector('#schedule-start')?.addEventListener('change', saveSchedule);
    document.querySelector('#schedule-end')?.addEventListener('change', saveSchedule);
    document.querySelector('#export-settings')?.addEventListener('click', exportSettings);
    document.querySelector('#import-settings')?.addEventListener('click', () => (document.querySelector('#import-file') as HTMLInputElement).click());
    document.querySelector('#import-file')?.addEventListener('change', importSettings);
    document.querySelector('#check-updates')?.addEventListener('click', checkUpdates);
    document.querySelector('#check-on-open')?.addEventListener('change', (event) => {
        const next = cloneSettings();
        next.updates.checkOnPopupOpen = (event.target as HTMLInputElement).checked;
        saveShiftNova(next, 'Configuración guardada.', false);
    });
    document.querySelector('#open-release')?.addEventListener('click', () => releaseManifest && chrome.tabs.create({url: releaseManifest.releaseURL}));
    document.querySelector('#download-update')?.addEventListener('click', () => {
        if (!releaseManifest) {
            return;
        }
        chrome.tabs.create({url: getUpdateAction(releaseManifest, isFirefoxBrowser()).url});
    });
    document.querySelector('#update-help')?.addEventListener('click', () => chrome.tabs.create({url: UPDATE_HELP_URL}));
    document.querySelector('#report-bug')?.addEventListener('click', () => chrome.tabs.create({url: BUG_REPORT_URL}));
    document.querySelector('#suggest-feature')?.addEventListener('click', () => chrome.tabs.create({url: FEATURE_REQUEST_URL}));
    document.querySelectorAll('details').forEach((details) => details.addEventListener('toggle', clampPopupScroll));
}

function addProfile(url: URL | null): void {
    const next = cloneSettings();
    next.profiles.push({
        id: createID(),
        name: url ? `Entorno ${url.hostname}` : 'Nuevo entorno',
        enabled: true,
        hostname: url?.hostname || 'ejemplo.com',
        pathPrefix: url ? normalizePathPrefix(url.pathname) : '/',
        appearance: 'light',
        palette: {base: '#C5D6FF'},
    });
    saveShiftNova(next, 'Perfil creado.');
}

function createProfileFromCurrentURL(): void {
    const url = getCurrentURL();
    if (url) {
        addProfile(url);
    }
}

function scheduleColorSave(input: HTMLInputElement): void {
    if (colorSaveTimer !== null) {
        window.clearTimeout(colorSaveTimer);
    }
    colorSaveTimer = window.setTimeout(() => {
        colorSaveTimer = null;
        updateProfileField(input, false);
    }, 120);
}

function updateProfileField(input: HTMLInputElement | HTMLSelectElement, rerender = false): void {
    const next = cloneSettings();
    const profile = next.profiles.find(({id}) => id === input.dataset.profile);
    if (!profile) {
        return;
    }
    const field = input.dataset.field!;
    if (field === 'enabled') {
        profile.enabled = (input as HTMLInputElement).checked;
    } else if (field === 'hostname') {
        profile.hostname = normalizeHostname(input.value);
        input.value = profile.hostname;
    } else if (field === 'pathPrefix') {
        profile.pathPrefix = normalizePathPrefix(input.value);
        input.value = profile.pathPrefix;
    } else if (field === 'appearance') {
        profile.appearance = input.value as SiteProfile['appearance'];
    } else if (field === 'name') {
        profile.name = input.value.trim();
    } else if (field.startsWith('palette.')) {
        const key = field.slice('palette.'.length) as keyof SemanticPalette;
        const value = input.value.trim().toUpperCase();
        if (value) {
            profile.palette[key] = value;
        } else if (key !== 'base') {
            delete profile.palette[key];
        }
    }
    saveShiftNova(next, 'Configuración guardada.', rerender);
}

function runProfileAction(action: string, id: string): void {
    const next = cloneSettings();
    const index = next.profiles.findIndex((profile) => profile.id === id);
    if (index < 0) {
        return;
    }
    if (action === 'delete') {
        next.profiles.splice(index, 1);
    } else if (action === 'duplicate') {
        const duplicate = JSON.parse(JSON.stringify(next.profiles[index])) as SiteProfile;
        duplicate.id = createID();
        duplicate.name = `${duplicate.name} (copia)`;
        duplicate.pathPrefix = `${duplicate.pathPrefix.replace(/\/$/, '')}/copia`;
        next.profiles.splice(index + 1, 0, duplicate);
    } else if (action === 'up' && index > 0) {
        [next.profiles[index - 1], next.profiles[index]] = [next.profiles[index], next.profiles[index - 1]];
    } else if (action === 'down' && index < next.profiles.length - 1) {
        [next.profiles[index + 1], next.profiles[index]] = [next.profiles[index], next.profiles[index + 1]];
    }
    saveShiftNova(next);
}

function saveSchedule(): void {
    const activation = (document.querySelector('#schedule-start') as HTMLInputElement).value;
    const deactivation = (document.querySelector('#schedule-end') as HTMLInputElement).value;
    saveTime({activation, deactivation});
}

function exportSettings(): void {
    const payload = JSON.stringify({
        product: 'ShiftNova',
        exportedAt: new Date().toISOString(),
        shiftNova: data.settings.shiftNova,
        time: data.settings.time,
    }, null, 2);
    const link = document.createElement('a');
    link.href = URL.createObjectURL(new Blob([payload], {type: 'application/json'}));
    link.download = `shiftnova-config-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    setTimeout(() => URL.revokeObjectURL(link.href));
}

async function importSettings(event: Event): Promise<void> {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
        return;
    }
    try {
        const parsed = JSON.parse(await file.text()) as {shiftNova?: unknown; time?: TimeSettings};
        const validation = validateShiftNovaSettings(parsed.shiftNova ?? parsed);
        if (validation.errors.length > 0) {
            throw new Error(validation.errors.join(' '));
        }
        data.settings.shiftNova = validation.settings;
        ignoreReportsUntil = Date.now() + 1500;
        connector.changeSettings({shiftNova: validation.settings, ...(parsed.time ? {time: parsed.time} : {})});
        if (parsed.time) {
            data.settings.time = parsed.time;
        }
        formMessage = 'Configuración importada correctamente.';
    } catch (error) {
        formMessage = `No se pudo importar: ${error instanceof Error ? error.message : String(error)}`;
    }
    render();
}

async function checkUpdates(): Promise<void> {
    updateMessage = 'Comprobando GitHub Pages…';
    render();
    try {
        const response = await fetch(data.settings.shiftNova.updates.manifestURL, {cache: 'no-store'});
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const parsed = parseReleaseManifest(await response.json());
        if (!parsed) {
            throw new Error('manifiesto inválido');
        }
        releaseManifest = parsed;
        const installed = chrome.runtime.getManifest().version;
        updateMessage = compareVersions(parsed.version, installed) > 0 ? 'Hay una actualización disponible.' : 'ShiftNova está actualizado.';
        const next = cloneSettings();
        next.updates.knownVersion = parsed.version;
        data.settings.shiftNova = next;
        ignoreReportsUntil = Date.now() + 1500;
        connector.changeSettings({shiftNova: next});
    } catch (error) {
        updateMessage = `No se pudo comprobar la actualización. La extensión seguirá funcionando sin conexión (${error instanceof Error ? error.message : String(error)}).`;
    }
    render();
}

async function start(): Promise<void> {
    data = await connector.getData();
    render();
    connector.subscribeToChanges((next) => {
        const activeTabChanged = next.activeTab.url !== data.activeTab.url;
        const settingsChanged = JSON.stringify(next.settings.shiftNova) !== JSON.stringify(data.settings.shiftNova) ||
            JSON.stringify(next.settings.time) !== JSON.stringify(data.settings.time);
        data = next;
        if (Date.now() >= ignoreReportsUntil && (activeTabChanged || settingsChanged)) {
            render();
        }
    });
    if (data.settings.shiftNova.updates.checkOnPopupOpen) {
        await checkUpdates();
    }
}

window.addEventListener('unload', () => connector.disconnect());
window.addEventListener('load', () => {
    start().catch((error) => {
        document.body.textContent = `ShiftNova no pudo iniciarse: ${String(error)}`;
    });
});
