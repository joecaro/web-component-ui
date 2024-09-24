import EventManager from "../../event-manager";
import StatefulComponent from "../../stateful-component";

class EventToaster extends StatefulComponent {
    static style = `.toast {
        position: fixed;
        top: 0;
        right: 0;
        background: #333;
        color: white;
        padding: 10px;
        margin: 10px;
        border-radius: 5px;
        transition: top 0.5s;
    }`;
    constructor() {
        super([]);
        this.state = {
            events: [],
        };
    }
    eventHandler = (event: CustomEvent) => {
        this.setState({
            events: [...this.state.events, event],
        });
    };

    connectedCallback(): void {
        EventManager.addEventListener(null, null, this.eventHandler.bind(this));
    }

    disconnectedCallback(): void {
        EventManager.removeEventListener(
            null,
            null,
            this.eventHandler.bind(this)
        );
    }

    render() {
        // render stacked toast messages in the top right
        const toasts = this.state.events.map((event, index) => {
            return `
                <style>${EventToaster.style}</style>
                <div class="toast" style="top: ${index * 50}px;">
                    ${event.type} - ${event.detail.message || ""}
                </div>
            `;
        });

        return `
            ${toasts.join("")}
        `;
    }
}

// Define the custom element
window.customElements.define("event-toaster", EventToaster);
