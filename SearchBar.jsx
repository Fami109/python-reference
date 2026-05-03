import { useState, useRef, useEffect } from 'react'
import { Search, X, Hash } from 'lucide-react'
import { sections } from '../data/content.js'
import styles from './SearchBar.module.css'

export default function SearchBar({ onSelect }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  const results = query.trim().length < 1 ? [] : sections.filter(s =>
    s.title.includes(query) ||
    s.summary.includes(query) ||
    s.category.includes(query) ||
    s.badge.includes(query) ||
    s.blocks.some(b => b.title.includes(query) || b.code.includes(query))
  ).slice(0, 6)

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSelect = (id) => {
    onSelect(id)
    setQuery('')
    setOpen(false)
  }

  return (
    <div className={styles.wrap} ref={ref}>
      <div className={styles.inputRow}>
        <Search size={14} className={styles.icon} />
        <input
          className={styles.input}
          placeholder="キーワードで検索..."
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
        />
        {query && (
          <button className={styles.clear} onClick={() => setQuery('')}>
            <X size={12} />
          </button>
        )}
      </div>

      {open && results.length > 0 && (
        <div className={styles.dropdown}>
          {results.map(item => (
            <button
              key={item.id}
              className={styles.result}
              onClick={() => handleSelect(item.id)}
            >
              <Hash size={12} className={styles.resultIcon} />
              <div>
                <div className={styles.resultTitle}>{item.title}</div>
                <div className={styles.resultCat}>{item.category}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
