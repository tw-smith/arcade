export const removeChildElements = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};
