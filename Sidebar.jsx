import { useState } from 'react'
import { ChevronDown, ChevronRight, Code2, Layers, Zap, HardDrive, Gauge, GitBranch } from 'lucide-react'
import { sections, categories } from '../data/content.js'
import styles from './Sidebar.module.css'

const categoryIcons = {
  '型システム': Layers,
  '関数・クラス応用': Code2,
  'データ処理': Zap,
  '非同期・並列': GitBranch,
  '構文の応用': Code2,
  'ファイル・IO': HardDrive,
  'パフォーマンス': Gauge,
}

const badgeColors = {
  accent: 'var(--accent)',
  blue: 'var(--blue)',
  amber: 'var(--amber)',
  purple: 'var(--purple)',
  red: 'var(--red)',
}

export default function Sidebar({ activeId, onSelect }) {
  const [collapsed, setCollapsed] = useState({})

  const toggle = (cat) =>
    setCollapsed(p => ({ ...p, [cat]: !p[cat] }))

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <span className={styles.logoMark}>{'{ }'}</span>
        <div>
          <div className={styles.logoTitle}>Python</div>
          <div className={styles.logoSub}>実務リファレンス</div>
        </div>
      </div>

      <nav className={styles.nav}>
        {categories.map(cat => {
          const Icon = categoryIcons[cat] || Code2
          const items = sections.filter(s => s.category === cat)
          const isCollapsed = collapsed[cat]

          return (
            <div key={cat} className={styles.group}>
              <button
                className={styles.groupHeader}
                onClick={() => toggle(cat)}
              >
                <Icon size={13} />
                <span>{cat}</span>
                {isCollapsed
                  ? <ChevronRight size={12} className={styles.chevron} />
                  : <ChevronDown size={12} className={styles.chevron} />
                }
              </button>

              {!isCollapsed && items.map(item => (
                <button
                  key={item.id}
                  className={`${styles.item} ${activeId === item.id ? styles.active : ''}`}
                  onClick={() => onSelect(item.id)}
                >
                  <span className={styles.itemTitle}>{item.title}</span>
                  <span
                    className={styles.badge}
                    style={{ color: badgeColors[item.badgeColor] || badgeColors.blue }}
                  >
                    {item.badge}
                  </span>
                </button>
              ))}
            </div>
          )
        })}
      </nav>

      <div className={styles.footer}>
        <div className={styles.footerText}>
          Ryo's Python Reference
        </div>
      </div>
    </aside>
  )
}
