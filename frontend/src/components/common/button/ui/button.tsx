import type { ReactNode, ButtonHTMLAttributes } from 'react';
import S from './button.module.css';

// 타입 정의 (나중에 분리)
type ButtonVariant = 'primary' | 'outline' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    children: ReactNode;
}

function Button({
    variant = 'primary',
    size = 'md',
    children,
    className,
    ...restProps
}: ButtonProps) {
    const combinedClassName = [
        S.button,
        S[variant],
        S[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={combinedClassName} {...restProps}>
            {children}
        </button>
    );
}

export default Button;