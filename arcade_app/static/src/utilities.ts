export const removeChildElements = (parent: HTMLElement) => {
    while (parent.lastChild) {
      parent.removeChild(parent.lastChild);
    }
  };