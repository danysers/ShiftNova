import type {DerivedPalette} from './palette';

export function createSemanticStylesheet(palette: DerivedPalette, dark: boolean): string {
    const p = palette;
    return `
:root {
    --shiftnova-base: ${p.base};
    --shiftnova-header: ${p.header};
    --shiftnova-sidebar: ${p.sidebar};
    --shiftnova-canvas: ${p.canvas};
    --shiftnova-content: ${p.content};
    --shiftnova-panel: ${p.panels};
    --shiftnova-action: ${p.actionBar};
    --shiftnova-tab: ${p.activeTab};
    --shiftnova-border: ${p.border};
    --shiftnova-hover: ${p.hover};
    --shiftnova-focus: ${p.focus};
    --shiftnova-accent: ${p.accent};
    --shiftnova-text: ${p.text};
    --shiftnova-muted: ${p.mutedText};
    --shiftnova-input: ${p.input};
    color-scheme: ${dark ? 'dark' : 'light'};
}
html, body, #page-wrapper, #wrapper, #main, #page-content, #modules-wrapper, #browser, .content-wrapper {
    background-color: var(--shiftnova-canvas) !important;
    color: var(--shiftnova-text) !important;
}
#header, #header_wrap, header.navbar, .navbar-fixed-top, .topbar, .page-header {
    background-color: var(--shiftnova-header) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
aside.leftPanel, aside.left-panel, #left-panel, #sidebar, .sidebar, .mainnav, #wrapSearchMods, .searched,
.mainnav > ul, .mainnav .nav, .mainnav li, .mainnav a {
    background-color: var(--shiftnova-sidebar) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.mainnav a:hover, .mainnav li:hover, .mainnav .active > a, .tree li:hover, .tree .selected {
    background-color: var(--shiftnova-hover) !important;
}
.panel, .panel-default, .portlet, .widget, .well, fieldset, .modal-content, .ui-dialog, .window, .flexigrid,
.flex.flexGrid, .flex.flexForm, .searchAdvance, .form-container, .tab-content, .tabs-list-wrapper, .mDiv, .bDiv {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.panel-heading, .modal-header, .ui-dialog-titlebar, .flexigrid .mDiv, .flexigrid .tDiv, .tDiv, .pDiv,
.toolbar, .action-bar, .actions, .form-actions, .modal-footer {
    background-color: var(--shiftnova-action) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.nav-tabs, .tabs-list, .tabs-list-wrapper { border-color: var(--shiftnova-border) !important; }
.nav-tabs > li > a, .tabs-list a, .ui-tabs-tab {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.nav-tabs > li.active > a, .nav-tabs > li > a:hover, .tabs-list .active, .ui-tabs-active {
    background-color: var(--shiftnova-tab) !important;
    color: var(--shiftnova-text) !important;
}
table, thead, tbody, th, .flexigrid .hDiv, .flexigrid .hDivBox, .flexigrid .bDiv,
.flexigrid .bDiv table, .flexigrid .hDiv th {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
tbody tr:not(.success):not(.danger):not(.warning):not(.info),
tbody tr:not(.success):not(.danger):not(.warning):not(.info) > td {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
tbody tr:nth-child(even):not(.success):not(.danger):not(.warning):not(.info) td {
    background-color: color-mix(in srgb, var(--shiftnova-panel) 92%, var(--shiftnova-base)) !important;
}
tbody tr:hover:not(.success):not(.danger):not(.warning):not(.info) td {
    background-color: var(--shiftnova-hover) !important;
}
input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), select, textarea,
.form-control, .select2-container .select2-choice, .select2-container--default .select2-selection {
    background-color: var(--shiftnova-input) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
input:focus, select:focus, textarea:focus, .form-control:focus {
    border-color: var(--shiftnova-focus) !important;
    box-shadow: 0 0 0 2px color-mix(in srgb, var(--shiftnova-focus) 32%, transparent) !important;
    outline: none !important;
}
button:not(.btn-success):not(.btn-danger):not(.btn-warning):not(.btn-info), .btn-default {
    background-color: var(--shiftnova-action) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
button:hover:not(.btn-success):not(.btn-danger):not(.btn-warning):not(.btn-info), .btn-default:hover {
    background-color: var(--shiftnova-hover) !important;
}
a { color: var(--shiftnova-accent); }
.text-muted, small, .help-block, .form-text { color: var(--shiftnova-muted) !important; }
.dropdown-menu, .popover, .tooltip-inner, .select2-drop, .select2-dropdown, .datepicker, .ui-datepicker {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
::-webkit-scrollbar { width: 12px; height: 12px; }
::-webkit-scrollbar-track { background: var(--shiftnova-canvas); }
::-webkit-scrollbar-thumb { background: var(--shiftnova-border); border: 3px solid var(--shiftnova-canvas); border-radius: 8px; }
/* Los colores funcionales y el contenido gráfico conservan sus reglas nativas. */
.alert-success, .bg-success, .label-success, .success,
.alert-danger, .bg-danger, .label-danger, .danger,
.alert-warning, .bg-warning, .label-warning, .warning,
.alert-info, .bg-info, .label-info, .info { color: revert !important; }
img, svg, canvas, video, iframe { filter: none !important; }
`;
}
