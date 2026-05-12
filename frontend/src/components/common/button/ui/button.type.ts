import type { ReactNode, ButtonHTMLAttributes } from 'react';

/**
 * 버튼 variant
 * - primary: 주황색 배경 (주요 액션)
 * - dark: 검정색 배경 (특수 강조)
 * - success: 초록 테두리 (출석/성공)
 * - warning: 노랑 테두리 (지각/경고)
 * - error: 빨강 테두리 (결석/에러)
 * - blank: 흰색 기본 (전체 필터)
 * - active: 초록 배경 (승인)
 * - inactive: 빨강 배경 (비승인)
 * - detail: 주황 연한 배경 (상세보기)
 */
export type ButtonVariant =
  | 'primary'
  | 'dark'
  | 'success'
  | 'warning'
  | 'error'
  | 'blank'
  | 'active'
  | 'inactive'
  | 'detail'
  | 'studying'

/**
 * 버튼 크기 (세로 높이 기준)
 * - xs: 30px
 * - sm: 36px
 * - md: 40px (기본)
 * - lg: 50px
 */
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export type IconPosition = 'left' | 'right';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    icon?: ReactNode;
    iconPosition?: IconPosition;
    children: ReactNode;
}