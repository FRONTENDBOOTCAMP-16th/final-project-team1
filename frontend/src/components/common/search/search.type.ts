import type { InputHTMLAttributes } from 'react'

/**
 * 자동완성 항목의 일반 형태
 */
export interface SearchSuggestion {
    id: string | number
    label: string
}

export interface SearchBarProps 
    extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onSelect'> {
    placeholder?: string
    
    /** 자동완성 항목들 (페이지가 준비) */
    suggestions?: SearchSuggestion[]
    
    /** 자동완성 표시 여부 */
    showSuggestions?: boolean
    
    /** 자동완성 항목 선택 시 호출 */
    onSelectSuggestion?: (suggestion: SearchSuggestion) => void
    
    /** 자동완성이 비어있을 때 표시할 메시지 */
    emptyMessage?: string
}