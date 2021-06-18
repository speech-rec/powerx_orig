export const getTemplateTextById = (templates, id) => {
    return templates != null ? templates.find(
        template => template.Id == id
    ) : null;
}
