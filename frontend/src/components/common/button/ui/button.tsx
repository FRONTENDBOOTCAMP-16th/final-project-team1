import type { ButtonProps } from './button.type';
import S from './button.module.css';

export default function Button({
    variant = 'primary',
    size = 'md',
    type = 'button',
    icon,
    iconPosition = 'left',
    children,
    className,
    ...rest
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
        <button type={type} className={combinedClassName} {...rest}>
            {icon && iconPosition === 'left' && (
                <span className={S.icon}>{icon}</span>
            )}
            {children}
            {icon && iconPosition === 'right' && (
                <span className={S.icon}>{icon}</span>
            )}
        </button>
    );
}