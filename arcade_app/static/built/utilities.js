export const removeChildElements = (parent) => {
    while (parent.lastChild) {
        parent.removeChild(parent.lastChild);
    }
};
export function randomIntRange(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}
