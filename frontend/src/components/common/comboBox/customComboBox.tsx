import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import type { CustomComboBoxProps } from './comboBox.type';
import S from './comboBox.module.css';

export default function CustomComboBox({
    options,
    placeholder,
    onChange,
    value,
    className,
    disabled,
}: CustomComboBoxProps) {
    // ===== 상태 관리 =====
    const [isOpen, setIsOpen] = useState(false);
    const [internalSelected, setInternalSelected] = useState<string | null>(null);
    
    // 외부에서 value를 줬으면 그걸 쓰고, 아니면 내부 상태 사용
    const selected = value ?? internalSelected;

    // ===== 옵션 클릭 핸들러 =====
    const handleSelect = (option: string) => {
        setInternalSelected(option);
        setIsOpen(false);
        onChange?.(option);
    };

    // ===== className 병합 =====
    const wrapperClassName = [S.comboBox, className]
        .filter(Boolean)
        .join(' ');

    return (
        <div className={wrapperClassName}>
            {/* 트리거 버튼 */}
            <button
                type="button"
                className={S.trigger}
                onClick={() => setIsOpen(!isOpen)}
                disabled={disabled}
            >
                <span className={selected ? S.value : S.placeholder}>
                    {selected || placeholder}
                </span>
                <ChevronDown
                    className={`${S.arrow} ${isOpen ? S.arrowOpen : ''}`}
                    size={16}
                    aria-hidden="true"
                />
            </button>

            {/* 드롭다운 메뉴 */}
            {isOpen && (
                <ul className={S.dropdown}>
                    {options.map((option) => (
                        <li
                            key={option}
                            className={`${S.option} ${
                                selected === option ? S.optionSelected : ''
                            }`}
                            onClick={() => handleSelect(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}