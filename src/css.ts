import theme from './theme';

export const OVERRIDES = {
    color: {
        primary: `var(--bam-color-primary, ${theme.color.primary})`,
        secondary: `var(--bam-color-secondary, ${theme.color.secondary})`,
        tertiary: `var(--bam-color-tertiary, ${theme.color.tertiary})`,
        foreground: `var(--bam-color-foreground, ${theme.color.foreground})`,
        border: `var(--bam-color-border, ${theme.color.border})`,
        success: `var(--bam-color-success, ${theme.color.success})`,
        shadow: `var(--bam-color-shadow, ${theme.color.shadow})`,
    },
    border: {
        large: `var(--bam-border-radius, ${theme.border.large})`,
        small: `var(--bam-border-radius-small, ${theme.border.small})`,
    },
    shadow: {
        large: `var(--bam-shadow-large, ${theme.shadow.large})`,
        small: `var(--bam-shadow-small, ${theme.shadow.small})`,
        inline: `var(--bam-shadow-inline, ${theme.shadow.inline})`,
    },
    fontFamily:
        'var(--bam-font-family, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol")',
    fontSize: {
        title: `var(--bam-font-size-title, ${theme.fontSize.title})`,
        body: `var(--bam-font-size-body, ${theme.fontSize.body})`,
        caption: `var(--bam-font-size-caption, ${theme.fontSize.caption})`,
        subcaption: `var(--bam-font-size-subcaption, ${theme.fontSize.subcaption})`,
    },
    fontWeight: {
        normal: `var(--bam-font-weight-normal, ${theme.fontWeight.normal})`,
        bold: `var(--bam-font-weight-bold, ${theme.fontWeight.bold})`,
    },
    button: {
        color: {
            text: `var(--bam-color-button-text, ${theme.color.foreground})`,
        },
        hover: {
            transform: `var(--bam-button-hover-transform, none)`,
            opacity: `var(--bam-button-hover-opacity, 1)`,
            bg: `var(--bam-button-hover-bg, var(--bam-color-success, ${theme.color.success}))`,
            transition: `var(--bam-button-hover-transition, 0s)`,
        },
    },
};

export const promoRowCss = `
.item-content {
    display: flex;
    flex: 1;
    flex-basis: 250px;
}

.item-logo {
    width: 35px;
    height: 35px;
    margin-right: ${theme.spacing.small};
    align-self: center;
}

.item-description {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    flex: 1;
}

.item-book-name {
    font-size: ${OVERRIDES.fontSize.subcaption};
    font-weight: var(--bam-font-weight-bold, ${theme.fontWeight.bold});
    line-height: 14px;
    color: var(--bam-color-secondary, ${theme.color.secondary});
}

.item-cta {
    color: var(--bam-color-primary, ${theme.color.primary});
    font-size: var(--bam-font-size-caption, ${theme.fontSize.caption});
    font-weight: var(--bam-font-weight-bold, ${theme.fontWeight.bold});
    line-height: 18px;
}

.item-terms {
    font-size: var(--bam-font-size-subcaption, ${theme.fontSize.subcaption});
    line-height: 14px;
    color: var(--bam-color-secondary, ${theme.color.secondary});
}

.buttons {
    width: 100%;
    display: flex;
    flex: 1 1 200px;
    justify-content: space-between;
    gap: ${theme.spacing.small};
}

.bonus {
    background-color: var(--bam-color-background, ${theme.color.background});
    padding: ${theme.spacing.tiny} ${theme.spacing.tiny};
    border: 1px dashed ${theme.color.border};
    border-radius: var(--bam-border-radius-small, ${theme.border.small});
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    flex: 1 1 50%;
    cursor: pointer;
    height: 26px;
    line-height: ${theme.spacing.smedium};
}

.bonus:hover {
    background-color: var(--bam-color-background, ${theme.color.background});
    border: 1px dashed ${theme.color.secondary};
}

.bonus-code {
    font-size: var(--bam-font-size-subcaption, ${theme.fontSize.subcaption});
    font-weight: 800;
}

.bonus-text {
    color: ${theme.color.secondary};
    font-size: var(--bam-font-size-caption, ${theme.fontSize.caption});
    font-weight: 800;
    font-size: 9px;
}

.bonus-copy {
    color: ${theme.color.info};
    font-size: var(--bam-font-size-subcaption, ${theme.fontSize.subcaption});
    font-weight: 800;
}

.no-code {
    color: ${theme.color.secondary};
    font-size: var(--bam-font-size-subcaption, ${theme.fontSize.subcaption});
    font-weight: 800;
    line-height: ${theme.spacing.smedium};
}

.button {
    border: 1px solid var(--bam-color-border, ${theme.color.border});
    padding: ${theme.spacing.small} 0;
    border-radius: var(--bam-border-radius-small, ${theme.border.small});
    background: border-box var(--bam-color-success, ${theme.color.success});
    cursor: pointer;
    flex: 1 1 50%;
    align-self: center;
}

.button:hover {
    transform: var(--bam-button-hover-transform, none);
    opacity: var(--bam-button-hover-opacity, 1);
    background-color: var(--bam-button-hover-bg, var(--bam-color-success, ${theme.color.success}));
    transition: var(--bam-button-hover-transition, 0s);
}

.button-font {
    color: var(--bam-color-button-text, ${theme.color.foreground});
    font-size: var(--bam-font-size-subcaption, ${theme.fontSize.subcaption});
    font-weight: 800;
    line-height: 14px;
    text-align: center;
}

.footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${theme.spacing.small};
    gap: 0.25rem;
}`;
