import type { ButtonProps } from './button.type';
import S from './button.module.css';

export default function Button({
    variant = 'primary',
    size = 'md',
    icon,
    iconPosition = 'left',
    children,
    className,
    ...rest
}: ButtonProps) {
    // className 조합
    const combinedClassName = [
        S.button,
        S[variant],
        S[size],
        className,
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <button className={combinedClassName} {...rest}>
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