import ComponentObserver from "./component-observer";

enum LazyLoadClassname {
    LOGO = "logo",
}

export default class StatefulComponent extends HTMLElement {
    static get observedAttributes() {
        return [
            // required
            // optional
        ];
    }
    _component: ShadowRoot;
    _excludedStateKeys: string[] = []; // keys that should not trigger a rerender
    state: Record<string, any> = {};
    private _observer: ComponentObserver | null = null;
    private _requiredKeys: string[] = [];

    // Custom Web Element Lifecycle Methods

    // run before anything
    constructor(requiredKeys: string[]) {
        super();
        this._component = this.attachShadow({ mode: "open" });
        this._observer = null;
        this._requiredKeys = requiredKeys;
    }

    // invoked when appended to the DOM
    // run after constructor
    connectedCallback() {
    }

    // invoked when removed from DOM
    disconnectedCallback() {
        if (this._observer) {
            this._observer.disconnect();
            this._observer = null;
        }
    }

    // run when component attributes are updated, location triggers re-fetch
    attributeChangedCallback(name: string, oldValue: string, newValue: string) {
        if (name.startsWith("data-")) {
            const stateNameToArray = name.replace("data-", "").split("-");
            const camelCaseStateName = stateNameToArray
                .map((word, index) => {
                    if (index === 0) {
                        return word;
                    }
                    return word.charAt(0).toUpperCase() + word.slice(1);
                })
                .join("");
            this.setState({
                [camelCaseStateName]: newValue,
            });
        } else {
            this.setState({
                [name]: newValue,
            });
        }
    }

    // Custom Methods

    // run when component state is updated
    shouldComponentUpdate(updatedKeys: string[]): boolean {
        if (
            updatedKeys.length === 0 ||
            updatedKeys.every(key => this._excludedStateKeys.includes(key))
        ) {
            return false;
        }
        return true;
    }

    render(): string {
        return "";
    }

    renderDom() {
        this._component.innerHTML = this.render();
    }

    getState(key: string) {
        return this.state[key];
    }

    setState(state: Record<string, any>) {
        // merge new state with existing state
        const prevState = { ...this.state };
        this.state = { ...this.state, ...state };

        const updatedKeys = getUpdatedKeys(this.state, prevState);
        if (this.shouldComponentUpdate(updatedKeys)) {
            this.renderDom();
            this.componentDidUpdate();
        }
    }

    componentDidUpdate() {
        // do nothing
    }

    isDeffered() {
        return this.getState("defer") === "true";
    }

    queryId(id: string) {
        return this._component.getElementById(id);
    }

    queryAll(selector: string) {
        return this._component.querySelectorAll(selector);
    }

    lazyLoad(
        elementClassName: LazyLoadClassname,
        cb: (entry: HTMLElement) => void,
        options?: { noOverwrite: boolean }
    ) {
        // query all elements
        const promoContainer =
            this._component.getElementById("promo-container");
        const elements =
            promoContainer?.getElementsByClassName(elementClassName);
        if (!this._observer) {
            this._observer = new ComponentObserver();
        }
        if (elements) {
            Array.from(elements).forEach(element => {
                if (
                    element instanceof HTMLElement ||
                    element instanceof HTMLImageElement
                ) {
                    this._observer
                        ? this._observer.registerNode(element, cb, options)
                        : cb(element);
                }
            });
        }
    }

    determineDeviceType() {
        const userAgent = navigator.userAgent;

        if (/android/i.test(userAgent)) {
            return "android";
        }

        if (/iPad|iPhone|iPod/.test(userAgent)) {
            return "ios";
        }

        return "desktop";
    }
}

function getUpdatedKeys(
    obj1: Record<string, any>,
    obj2: Record<string, any>
): string[] {
    const keys = Object.keys(obj1);
    return keys.filter(key => obj1[key] !== obj2[key]);
}
