export interface DropdownOption {
    value: string;
    label: string;
    checked?: boolean;
}

export interface OverlayConfig {
    backdropClose?: boolean;
    showFooter?: boolean;
    panelClass?: string;
}