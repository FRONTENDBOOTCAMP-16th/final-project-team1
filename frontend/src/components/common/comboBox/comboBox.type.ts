import type { SelectHTMLAttributes } from "react";


export interface ComboBoxProps 
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    options: string[];
    placeholder?: string;

}


// comboBox.type.ts
export interface CustomComboBoxProps {
    options: string[];
    placeholder?: string;
    className?: string;
    onChange?: (value: string) => void;  // 단순한 콜백
    value?: string;                       // 외부에서 제어 가능
    disabled?: boolean;
}