export const checkNotesDetails = async (title, content, ownerId) => {
    const errors = [];
    if (!title) errors.push('Title is required');
    if (!content) errors.push('Content is required');
    if (!ownerId) errors.push('Owner is required');

    if (errors.length > 0) {
        return { status: 400, message: errors.join(',') };
    }

    return { status: 200, message: 'OK' };
}
