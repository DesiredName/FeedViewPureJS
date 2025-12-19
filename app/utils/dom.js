function AddEventListener(element, event, callback) {
    element.addEventListener(event, callback);

    return () => element.removeEventListener(event, callback);
}

export { AddEventListener };
