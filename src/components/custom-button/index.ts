import EventManager from "../../event-manager";
import StatefulComponent from "../../stateful-component";

class CustomButton extends StatefulComponent {
    static styles = `
        :host {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            background-color: #007bff;
            color: white;
            border: none;
            border-radius: 5px;
            text-align: center;
            font-family: Arial, sans-serif;
        }
        :host(:hover) {
            background-color: #0056b3;
        }
        ::slotted(*) {
            font-size: inherit;
            color: inherit;
        }
    `;

    constructor() {
        super([]);
        this.renderDom();
    }

    emitResetEvent() {
        EventManager.dispatchEvent(this, "reset-calculator", {});
    }

    connectedCallback(): void {
        // Add click event listener
        this.addEventListener("click", this.emitResetEvent.bind(this));
    }

    disconnectedCallback(): void {
        // Remove click event listener
        this.removeEventListener("click", this.emitResetEvent.bind(this));
    }

    render() {
        return `
            <style>${CustomButton.styles}</style>
            <slot name="button-content"></slot>
        `;
    }
}

// Define the custom element
window.customElements.define("custom-button", CustomButton);
