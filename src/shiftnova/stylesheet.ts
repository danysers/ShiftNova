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
html, body, #page-wrapper, #wrapper, #main, #content, #main-content, #page-content, #modules-wrapper,
.content-wrapper, .contentSystem, [id^="contentSystem_"], .container-fluid, .row-fluid, .grid_12 {
    background-color: var(--shiftnova-canvas) !important;
    color: var(--shiftnova-text) !important;
}
#header, #header_wrap, header.navbar, .navbar-fixed-top, .topbar, .page-header {
    background-color: var(--shiftnova-header) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
aside.leftPanel, aside.left-panel, #left-panel, #sidebar, .sidebar, #browser, .mainnav, #wrapSearchMods, .searched,
.mainnav > ul, .mainnav ul, .mainnav .nav, .mainnav li, .mainnav a, .mainnav span,
#browser > li, #browser > li > ul, #browser li, #browser li > a {
    background-color: var(--shiftnova-sidebar) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.mainnav a:hover, .mainnav li:hover, .mainnav .active > a, .tree li:hover, .tree .selected {
    background-color: var(--shiftnova-hover) !important;
}
.panel, .panel-default, .portlet, .widget, .well, fieldset, .modal-content, .ui-dialog, .ui-widget-content,
.window, .box, .box-content, .flex, .flexigrid, .flex.flexGrid, .flex.flexForm, .searchAdvance,
form.searchAdvance, .form-container, .form-horizontal, .control-group, .controls, .tab-content,
.tabs-list-wrapper, .mDiv, .bDiv, .hDiv, .tDiv, .pDiv {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.panel-heading, .modal-header, .ui-dialog-titlebar, .ui-widget-header, .box-header, .flex .mDiv,
.flex .tDiv, .flexigrid .mDiv, .flexigrid .tDiv, .tDiv, .pDiv, .toolbar, .action-bar, .actions,
.form-actions, .modal-footer {
    background-color: var(--shiftnova-action) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.nav-tabs, .tabs-list, .tabs-list-wrapper, .crumbs, .crumbs > ul {
    background-color: var(--shiftnova-content) !important;
    border-color: var(--shiftnova-border) !important;
}
.nav-tabs > li > a, .tabs-list a, .ui-tabs-tab, .crumbs li, .crumbs a {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
.nav-tabs > li.active > a, .nav-tabs > li > a:hover, .tabs-list .active, .ui-tabs-active {
    background-color: var(--shiftnova-tab) !important;
    color: var(--shiftnova-text) !important;
}
table, thead, tbody, th, .flex .hDiv, .flex .hDivBox, .flex .bDiv, .flex .bDiv table,
.flex .hDiv table, .flex .hDiv th, .flex .hDiv td, .flex .pDiv, .flex .pDiv2,
.flexigrid .hDiv, .flexigrid .hDivBox, .flexigrid .bDiv, .flexigrid .bDiv table, .flexigrid .hDiv th {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
tbody tr:not(:where(.success, .danger, .warning, .info, .cazul, .crojo, .cverde, .cverdeoscuro, .cvioleta, .cvioletaoscuro, .camarillo, .cnaranja, .cvioleta-azulado, .cazul-oscuro, .trSelected)),
tbody tr:not(:where(.success, .danger, .warning, .info, .cazul, .crojo, .cverde, .cverdeoscuro, .cvioleta, .cvioletaoscuro, .camarillo, .cnaranja, .cvioleta-azulado, .cazul-oscuro, .trSelected)) > td {
    background-color: var(--shiftnova-panel) !important;
    border-color: var(--shiftnova-border) !important;
    color: var(--shiftnova-text) !important;
}
tbody tr:nth-child(even):not(:where(.success, .danger, .warning, .info, .cazul, .crojo, .cverde, .cverdeoscuro, .cvioleta, .cvioletaoscuro, .camarillo, .cnaranja, .cvioleta-azulado, .cazul-oscuro, .trSelected)) td {
    background-color: color-mix(in srgb, var(--shiftnova-panel) 92%, var(--shiftnova-base)) !important;
}
tbody tr:hover:not(:where(.success, .danger, .warning, .info, .cazul, .crojo, .cverde, .cverdeoscuro, .cvioleta, .cvioletaoscuro, .camarillo, .cnaranja, .cvioleta-azulado, .cazul-oscuro, .trSelected)) td {
    background-color: var(--shiftnova-hover) !important;
}
input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), select, textarea,
.form-control, .select2-container .select2-choice, .select2-container--default .select2-selection,
.chzn-container .chzn-single, .chzn-container .chzn-drop, .chzn-container-multi .chzn-choices {
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
input::placeholder, textarea::placeholder { color: var(--shiftnova-muted) !important; opacity: 1; }
option { background-color: var(--shiftnova-input); color: var(--shiftnova-text); }
.text-muted, small, .help-block, .form-text { color: var(--shiftnova-muted) !important; }
.dropdown-menu, .popover, .tooltip-inner, .select2-drop, .select2-dropdown, .chzn-drop, .datepicker,
.ui-datepicker, .appriseInner, .notification, .noty_bar {
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
