import S from './search.module.css'
import { Search } from 'lucide-react'

interface SearchBarProps{
  placeholder?: string
}

function SearchBar({ 
  placeholder 
}: SearchBarProps) {
  return(
    <div className={S.searchBar}>
      <Search size={16} />
      <input type="text" className={S.searchInput} aria-label='검색' placeholder={placeholder} />
    </div>
  )
}

export default SearchBar