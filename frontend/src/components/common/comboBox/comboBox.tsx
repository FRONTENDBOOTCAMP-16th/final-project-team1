import { ChevronDown } from 'lucide-react';
import type { ComboBoxProps } from './comboBox.type';
import S from './comboBox.module.css';

export default function ComboBox({
    options,
    placeholder,
    className,
    ...rest
}: ComboBoxProps) {
    const wrapperClassName = [S.comboBox, className]
        .filter(Boolean)
        .join(' ');

    // options를 통일된 객체 배열로 정규화
    const normalizedOptions = options.map((opt) =>
        typeof opt === 'string'
            ? { value: opt, label: opt }
            : opt
    );

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
                {normalizedOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            <ChevronDown className={S.arrow} size={16} aria-hidden="true" />
        </div>
    );
}