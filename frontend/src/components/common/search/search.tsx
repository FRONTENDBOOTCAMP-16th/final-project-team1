import { Search } from 'lucide-react'
import type { SearchBarProps } from './search.type'
import S from './search.module.css'

export default function SearchBar({
    placeholder,
    suggestions = [],
    showSuggestions = false,
    onSelectSuggestion,
    emptyMessage = '검색 결과가 없습니다.',
    ...rest
}: SearchBarProps) {
    return (
        <div 
            className={S.searchBar}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-haspopup="listbox"
        >
            <Search size={16} />
            <input
                type="text"
                className={S.searchInput}
                aria-label="검색"
                aria-autocomplete="list"
                aria-controls="suggestion-list"
                placeholder={placeholder}
                {...rest}
            />
            
            {/* 자동완성 드롭다운 */}
            {showSuggestions && (
                <ul 
                    className={S.suggestionList}
                    id="suggestion-list"
                    role="listbox"
                >
                    {suggestions.length > 0 ? (
                        suggestions.map((item) => (
                            <li
                                key={item.id}
                                className={S.suggestionItem}
                                role="option"
                                aria-selected={false}
                                tabIndex={0}
                                onClick={() => onSelectSuggestion?.(item)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        onSelectSuggestion?.(item)
                                    }
                                }}
                            >
                                {item.label}
                            </li>
                        ))
                    ) : (
                        <li 
                            className={S.emptyMessage}
                            role="option"
                            aria-selected={false}
                        >
                            {emptyMessage}
                        </li>
                    )}
                </ul>
            )}
        </div>
    )
}