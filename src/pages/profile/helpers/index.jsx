const editableFields = ['firstName', 'lastName', 'email', 'mobile', 'password', 'bio', 'photo'];

const roleEditableFields = {
  0: editableFields,
  1: [...editableFields, 'role', 'cohort', 'title', 'specialism']
};

const canEditField = (field, isEditing, role = 0) => {
  if (!isEditing) {
    return false;
  }

  const allowedFields = roleEditableFields[role] || [];

  return allowedFields.includes(field);
};

const getInputClass = (field, isEditing, role = 0) => {
  if (!isEditing) {
    return '';
  }

  return canEditField(field, isEditing, role) ? 'editable' : 'non-editable';
};

export { editableFields, roleEditableFields, canEditField, getInputClass };
