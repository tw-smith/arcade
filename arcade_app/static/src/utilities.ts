export const removeChildElements = (parent: HTMLElement) => {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };

  export function randomIntRange(min: number, max: number) {
    return Math.floor(Math.random() * (max - min) + min);
  }