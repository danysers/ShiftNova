import type {SurfaceTarget} from '../definitions';

export interface SurfaceOption {
    value: SurfaceTarget;
    label: string;
}

export const SURFACE_OPTIONS: SurfaceOption[] = [
    {value: 'tabs', label: 'Pestañas'},
    {value: 'tables', label: 'Grillas y tablas'},
    {value: 'forms', label: 'Formularios'},
    {value: 'modals', label: 'Ventanas y modales'},
    {value: 'fields', label: 'Campos de entrada'},
    {value: 'toolbars', label: 'Barras de acciones'},
    {value: 'buttons', label: 'Botones comunes'},
    {value: 'custom', label: 'Selector personalizado'},
];

export const SURFACE_SELECTORS: Record<Exclude<SurfaceTarget, 'custom'>, string> = {
    tabs: '.nav-tabs, .nav-tabs > li > a, .tabs-list, .tabs-list a, .ui-tabs-tab, .crumbs, .crumbs li, .crumbs a',
    tables: 'table, thead, tbody, th, tbody tr:not(:where(.success, .danger, .warning, .info, .cazul, .crojo, .cverde, .camarillo, .trSelected)) > td, .flex .hDiv, .flex .bDiv, .flexigrid .hDiv, .flexigrid .bDiv',
    forms: 'form, fieldset, .form-container, .form-horizontal, .control-group, .controls, .flex.flexForm',
    modals: '.modal, .modal-content, .modal-header, .modal-body, .modal-footer, .ui-dialog, .ui-dialog-titlebar, .window',
    fields: 'input:not([type="checkbox"]):not([type="radio"]):not([type="button"]):not([type="submit"]), select, textarea, .form-control',
    toolbars: '.toolbar, .action-bar, .actions, .form-actions, .tDiv, .pDiv, .panel-heading, .box-header',
    buttons: 'button:not(.btn-success):not(.btn-danger):not(.btn-warning):not(.btn-info), .btn-default',
};

export function isSurfaceTarget(value: unknown): value is SurfaceTarget {
    return SURFACE_OPTIONS.some((option) => option.value === value);
}
