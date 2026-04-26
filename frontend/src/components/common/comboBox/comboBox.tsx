import { ChevronDown } from 'lucide-react';
import type { ComboBoxProps } from './comboBox.type';
import S from './comboBox.module.css';

export default function ComboBox({
    options,
    placeholder,
    className,
    ...rest
}: ComboBoxProps) {
    const wrapperClassName = [S.comboBox,  className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClassName}>
            <select
                className={S.comboSelect}
                aria-label="콤보박스"
                defaultValue=""
                {...rest}
            >
                {placeholder && (
                    <option value="" disabled hidden>
                        {placeholder}
                    </option>
                )}
                {options.map((option) => (
                    <option key={option} value={option}>
                        {option}
                    </option>
                ))}
            </select>
            <ChevronDown className={S.arrow} size={16} aria-hidden="true" />
        </div>
    );
}