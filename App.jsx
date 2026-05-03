import { useState } from 'react'
import Sidebar from './components/Sidebar.jsx'
import ContentPane from './components/ContentPane.jsx'
import TopPage from './components/TopPage.jsx'
import SearchBar from './components/SearchBar.jsx'
import { sections } from './data/content.js'
import styles from './App.module.css'

export default function App() {
  const [activeId, setActiveId] = useState(null)

  const activeSection = sections.find(s => s.id === activeId) || null

  const handleSelect = (id) => {
    setActiveId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className={styles.app}>
      <Sidebar activeId={activeId} onSelect={handleSelect} />

      <div className={styles.mainWrap}>
        <header className={styles.topbar}>
          <button
            className={styles.homeBtn}
            onClick={() => setActiveId(null)}
          >
            {'{ }'} <span>Python 実務リファレンス</span>
          </button>
          <SearchBar onSelect={handleSelect} />
        </header>

        <main className={styles.main}>
          {activeSection
            ? <ContentPane section={activeSection} />
            : <TopPage onSelect={handleSelect} />
          }
        </main>
      </div>
    </div>
  )
}
