import { createSelector } from 'reselect';

export const selectTemplates = state => state.templates;

export const selectAllTemplates = createSelector(
    [selectTemplates],
    templates => templates.allTemplates
);

export const selectSelectedTemplate = createSelector(
    [selectTemplates],
    templates => templates != null ? templates.selectedTemplate : null
);