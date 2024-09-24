interface RegisterObject {
    node: HTMLElement;
    cb: (el: HTMLElement) => void;
}

// Global observer registers nodes to a "register" object to store the nodes and their callbacks.
// When registered, the node with will be stored by key, using the data-observer-label attribute.
// The register will not overwrite existing nodes. Please provide a unique label for each node.

export class ComponentObserver {
    register: Record<string, RegisterObject> = {};
    observer: IntersectionObserver | undefined;
    constructor() {
        this.init();
    }

    init: () => void = () => {
        if ("IntersectionObserver" in window && !this.observer) {
            this.observer = new IntersectionObserver(entries =>
                entries.forEach(entry => {
                    if (
                        entry.isIntersecting &&
                        (entry.target instanceof HTMLElement ||
                            entry.target instanceof HTMLImageElement)
                    ) {
                        const { node, cb } =
                            this.register[
                                entry.target.dataset.observerLabel as string
                            ];
                        cb(node);
                        this.observer?.unobserve(entry.target);
                    }
                })
            );

            // Observe nodes registered before observer was ready
            Object.keys(this.register).forEach(label => {
                const { node } = this.register[label];
                this.observer && this.observer.observe(node);
            });
        }
    };

    disconnect: () => void = () => {
        if (this.observer) {
            this.observer.disconnect();
            this.observer = undefined;
        }
        this.register = {};
    };

    reconnect: () => void = () => {
        this.disconnect();
        this.init();
    };

    registerNode: (
        node: HTMLElement,
        cb: (el: HTMLElement) => void,
        options?: { cap?: number; noOverwrite: boolean }
    ) => void = (node, cb, options) => {
        const label = node.dataset.observerLabel;
        if (!label) {
            warn("Node requires data-observer-label attribute to observed");
            return;
        }
        if (this.observer) {
            this.observer.observe(node);
        }
        if (this.register[label] && options?.noOverwrite) {
            return;
        }
        this.register[label] = { node, cb };
    };

    unregisterNode: (node: HTMLElement) => void = node => {
        const label = node.dataset.observerLabel;
        if (!label) {
            warn(
                "Node requires data-observer-label attribute to be un-registered"
            );
            return;
        }
        if (this.register[label]) {
            delete this.register[label];
        }
    };
}

export default ComponentObserver;

function warn(message: string) {
    // eslint-disable-next-line no-console
    console.warn(message);
}
