import TEMPLATETYPE from './template.type';
export const setTemplates = templates => ({
    type: TEMPLATETYPE.SET_TEMPLATES,
    payload: templates
});

export const setSelectedTemplate = id => ({
    type: TEMPLATETYPE.SET_SELECTED_TEMPLATE,
    payload: id
});