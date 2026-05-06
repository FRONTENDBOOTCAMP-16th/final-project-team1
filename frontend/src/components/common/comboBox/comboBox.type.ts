import type { SelectHTMLAttributes } from "react";

/**
 * 콤보박스 옵션 (객체 형태)
 * - value: 실제 데이터 값 (서버 전송용)
 * - label: 화면 표시 텍스트
 */
export interface ComboBoxOption {
    value: string | number;
    label: string;
}

export interface ComboBoxProps 
    extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> {
    options: string[] | ComboBoxOption[];
    placeholder?: string;
}


// CustomComboBox는 그대로 유지
export interface CustomComboBoxProps {
    options: string[];
    placeholder?: string;
    className?: string;
    onChange?: (value: string) => void;
    value?: string;
    disabled?: boolean;
}