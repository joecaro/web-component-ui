import EventManager from "../../event-manager";
import StatefulComponent from "../../stateful-component";

class CalculatorComponent extends StatefulComponent {
    resizeObserver: ResizeObserver | null = null;
    static styles = `
        :host {
            display: block;
            width: 200px;
            border: 1px solid #000;
            border-radius: 5px;
            padding: 10px;
            font-family: Arial, sans-serif;
        }
        .display {
            height: 40px;
            border: 1px solid #000;
            margin-bottom: 10px;
            text-align: right;
            padding: 10px;
            font-size: 18px;
        }
        .buttons {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 5px;
        }
        button {
            padding: 15px;
            font-size: 16px;
        }
    `;

    constructor() {
        super([]);
    }

    resetHandler = () => {
        this.setState({
            currentInput: "0",
            previousInput: "",
            operator: null,
            resetNext: false,
        });
    };

    connectedCallback() {
        this.setState({
            currentInput: "0",
            previousInput: "",
            operator: null,
            resetNext: false,
        });

        EventManager.addEventListener(
            null,
            "reset-calculator",
            this.resetHandler.bind(this)
        );
    }

    disconnectedCallback(): void {
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
            this.resizeObserver = null;
        }

        EventManager.removeEventListener(
            null,
            "reset-calculator",
            this.resetHandler.bind(this)
        );
    }

    shouldComponentUpdate(updatedKeys: string[]) {
        return true;
    }

    // Render the calculator buttons and display
    render() {
        const { currentInput } = this.state;
        return `
        <style>${CalculatorComponent.styles}</style>
            <div class="display">${currentInput}</div>
            <div class="buttons">
                ${this.renderButtons()}
            </div>
        `;
    }

    renderButtons() {
        const buttons = [
            "C",
            "",
            "",
            "",
            "7",
            "8",
            "9",
            "/",
            "4",
            "5",
            "6",
            "*",
            "1",
            "2",
            "3",
            "-",
            "0",
            ".",
            "=",
            "+",
        ];

        return buttons
            .map(button => `<button data-value="${button}">${button}</button>`)
            .join("");
    }

    componentDidUpdate() {
        this.attachEventHandlers();
    }

    attachEventHandlers() {
        const buttons = this.queryAll("button");
        buttons.forEach(button => {
            const htmlButton = button as HTMLElement;
            htmlButton.addEventListener("click", event => {
                const value = htmlButton.getAttribute("data-value");
                this.handleButtonClick(value);
            });
        });
    }

    handleButtonClick(value: string | null) {
        if (!value) return;

        const { currentInput, operator, resetNext } = this.state;

        switch (value) {
            case "C":
                this.setState({
                    currentInput: "0",
                    previousInput: "",
                    operator: null,
                    resetNext: false,
                });
                break;
            case "+":
            case "-":
            case "*":
            case "/":
                this.setState({
                    operator: value,
                    previousInput: currentInput,
                    resetNext: true,
                });
                break;
            case "=":
                this.performCalculation();
                break;
            case ".":
                if (!currentInput.includes(".")) {
                    this.setState({ currentInput: currentInput + "." });
                }
                break;
            default:
                this.handleNumberInput(value);
        }
    }

    handleNumberInput(value: string) {
        const { currentInput, resetNext } = this.state;
        if (resetNext) {
            this.setState({
                currentInput: value,
                resetNext: false,
            });
        } else {
            this.setState({
                currentInput:
                    currentInput === "0" ? value : currentInput + value,
            });
        }
    }

    performCalculation() {
        const { currentInput, previousInput, operator } = this.state;

        if (!operator || !previousInput) return;

        const current = parseFloat(currentInput);
        const previous = parseFloat(previousInput);
        let result = 0;

        switch (operator) {
            case "+":
                result = previous + current;
                break;
            case "-":
                result = previous - current;
                break;
            case "*":
                result = previous * current;
                break;
            case "/":
                result = previous / current;
                break;
        }

        this.setState({
            currentInput: result.toString(),
            operator: null,
            previousInput: "",
            resetNext: true,
        });

        EventManager.dispatchEvent(null, "calculator-result", {
            message: `The result of the calculation is ${result}`,
        });
    }
}

// Define the custom element
window.customElements.define("calculator-component", CalculatorComponent);
