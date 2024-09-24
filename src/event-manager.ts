export interface EventDetail {
    [key: string]: any;
}

type EventListener = (event: CustomEvent) => void;

interface EventRegistry {
    [eventName: string]: EventListener[];
}

class EventManager {
    // Holds event listeners for each element and event
    private static eventListeners: Map<HTMLElement, EventRegistry> = new Map();

    // Separate list of global listeners
    private static globalListeners: Map<string | null, EventListener[]> =
        new Map();

    /**
     * Adds a custom event listener to the specified element.
     * The listener is stored in an internal list, and will be triggered when the event occurs.
     * If no element is specified, it registers the listener as a global listener.
     * @param element - The element to attach the event to, or null for a global listener.
     * @param eventName - The name of the custom event.
     * @param listener - The function to call when the event is triggered.
     */
    static addEventListener(
        element: HTMLElement | null,
        eventName: string | null,
        listener: EventListener
    ): void {
        if (!element) {
            // If no element is provided, it's a global listener
            if (!this.globalListeners.has(eventName)) {
                this.globalListeners.set(eventName, []);
            }
            this.globalListeners.get(eventName)!.push(listener);
            return;
        }

        // Check if the element already has a registry
        if (!this.eventListeners.has(element)) {
            this.eventListeners.set(element, {});
        }

        const registry = this.eventListeners.get(element)!;
        if (!registry[eventName!]) {
            registry[eventName!] = [];
        }

        // Add the listener to the registry
        registry[eventName!].push(listener);
    }

    /**
     * Dispatches a custom event from the specified element.
     * It will look for any listeners in the internal list and call them.
     * @param element - The element to dispatch the event from.
     * @param eventName - The name of the custom event.
     * @param detail - Optional additional data to pass with the event.
     */
    static dispatchEvent(
        element: HTMLElement | null,
        eventName: string,
        detail: EventDetail = {}
    ): void {
        console.log(`Dispatching event: ${eventName}`);

        // Create the custom event
        const event = new CustomEvent(eventName, {
            detail,
            bubbles: true,
            composed: true, // Allows the event to bubble through shadow DOM
        });

        if (element) {
            // Check if there are any listeners in the internal list and invoke them
            const registry = this.eventListeners.get(element);
            if (registry && registry[eventName]) {
                registry[eventName].forEach(listener => listener(event));
            }
        }

        // Notify global listeners for this specific event
        const specificGlobalListeners = this.globalListeners.get(eventName);
        if (specificGlobalListeners) {
            specificGlobalListeners.forEach(listener => listener(event));
        }

        // Notify listeners that want to hear all events (global listeners with eventName `null`)
        const allGlobalListeners = this.globalListeners.get(null);
        if (allGlobalListeners) {
            allGlobalListeners.forEach(listener => listener(event));
        }
    }

    /**
     * Removes a custom event listener from the specified element.
     * @param element - The element to remove the event listener from, or null for global listener.
     * @param eventName - The name of the custom event.
     * @param listener - The function to remove.
     */
    static removeEventListener(
        element: HTMLElement | null,
        eventName: string | null,
        listener: EventListener
    ): void {
        if (!element) {
            const globalListeners = this.globalListeners.get(eventName);
            if (globalListeners) {
                this.globalListeners.set(
                    eventName,
                    globalListeners.filter(l => l !== listener)
                );
            }
            return;
        }

        const registry = this.eventListeners.get(element);
        if (registry && registry[eventName!]) {
            registry[eventName!] = registry[eventName!].filter(
                l => l !== listener
            );
        }
    }

    /**
     * Clears all event listeners for an element.
     * This can be useful for cleaning up when the element is removed from the DOM.
     * @param element - The element whose event listeners should be removed.
     */
    static clearEventListeners(element: HTMLElement): void {
        this.eventListeners.delete(element);
    }

    static logListeners(): void {
        // Pretty print the listeners
        console.log("Element-Specific Event Listeners:", this.eventListeners);
        console.log("Global Event Listeners:", this.globalListeners);
    }
}

declare global {
    interface Window {
        WC_EventManager: typeof EventManager;
    }
}

if (typeof window !== "undefined") {
    window.WC_EventManager = EventManager;
}

export default EventManager;
