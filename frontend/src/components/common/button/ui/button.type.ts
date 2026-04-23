import type { ReactNode, ButtonHTMLAttributes } from "react";

export type ButtonVariant = 'primary' | 'secondary' | 'dark' ;

export type ButtonSize = 'sm' | 'md' | 'lg'

export type ChipVariant = 'success' | 'warning' | 'error' | 'all';


export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>{
  variant?: ButtonVariant;
  size? : ButtonSize;
  children: ReactNode;
}