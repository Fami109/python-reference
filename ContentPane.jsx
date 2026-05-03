import { Lightbulb, AlertTriangle, ChevronRight } from 'lucide-react'
import CodeBlock from './CodeBlock.jsx'
import styles from './ContentPane.module.css'

const badgeColors = {
  accent: { bg: 'var(--accent-dim)', color: 'var(--accent)' },
  blue:   { bg: 'var(--blue-dim)',   color: 'var(--blue)'   },
  amber:  { bg: 'var(--amber-dim)',  color: 'var(--amber)'  },
  purple: { bg: 'var(--purple-dim)', color: 'var(--purple)' },
  red:    { bg: 'var(--red-dim)',    color: 'var(--red)'    },
}

export default function ContentPane({ section }) {
  if (!section) return null

  const bc = badgeColors[section.badgeColor] || badgeColors.blue

  return (
    <article className={styles.pane}>
      <header className={styles.header}>
        <div className={styles.breadcrumb}>
          <span>{section.category}</span>
          <ChevronRight size={12} />
          <span className={styles.breadcrumbActive}>{section.title}</span>
        </div>

        <div className={styles.titleRow}>
          <h1 className={styles.title}>{section.title}</h1>
          <span
            className={styles.badge}
            style={{ background: bc.bg, color: bc.color }}
          >
            {section.badge}
          </span>
        </div>

        <p className={styles.summary}>{section.summary}</p>

        {section.tips && section.tips.length > 0 && (
          <div className={styles.tipsBox}>
            <div className={styles.tipsHeader}>
              <Lightbulb size={14} />
              実務Tips
            </div>
            <ul className={styles.tipsList}>
              {section.tips.map((tip, i) => (
                <li key={i} className={styles.tip}>{tip}</li>
              ))}
            </ul>
          </div>
        )}
      </header>

      <div className={styles.blocks}>
        {section.blocks.map((block, i) => (
          <section key={i} className={styles.block}>
            <h2 className={styles.blockTitle}>
              <span className={styles.blockNum}>{String(i + 1).padStart(2, '0')}</span>
              {block.title}
            </h2>

            <CodeBlock code={block.code} language="python" />

            {block.note && (
              <div className={styles.note}>
                <AlertTriangle size={13} className={styles.noteIcon} />
                <p>{block.note}</p>
              </div>
            )}
          </section>
        ))}
      </div>
    </article>
  )
}
