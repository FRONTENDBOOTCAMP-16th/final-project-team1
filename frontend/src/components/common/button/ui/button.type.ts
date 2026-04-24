import type { ReactNode, ButtonHTMLAttributes } from 'react';

/**
 * 버튼 variant
 * - primary: 주황색 배경 (주요 액션)
 * - secondary: 흰색 배경 + 테두리 (보조 액션)
 * - dark: 검정색 배경 (특수 강조)
 * - success: 초록색 (출석/성공 상태)
 * - warning: 노란색 (지각/경고 상태)
 * - error: 빨간색 (결석/에러 상태)
 * - blank: 흰색 기본 (전체 필터)
 */
export type ButtonVariant =
    | 'primary'
    | 'secondary'
    | 'dark'
    | 'success'
    | 'warning'
    | 'error'
    | 'blank';

/**
 * 버튼 크기 (세로 높이 기준)
 */
export type ButtonSize = 'sm' | 'md' | 'lg';

/**
 * 아이콘 위치
 */
export type IconPosition = 'left' | 'right';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    iconPosition?: IconPosition;
    children: ReactNode;
}