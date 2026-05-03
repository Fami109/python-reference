import { Layers, Code2, Zap, GitBranch, HardDrive, Gauge } from 'lucide-react'
import { sections, categories } from '../data/content.js'
import styles from './TopPage.module.css'

const categoryIcons = {
  '型システム': Layers, '関数・クラス応用': Code2, 'データ処理': Zap,
  '非同期・並列': GitBranch, '構文の応用': Code2, 'ファイル・IO': HardDrive, 'パフォーマンス': Gauge,
}
const badgeColors = { accent: 'var(--accent)', blue: 'var(--blue)', amber: 'var(--amber)', purple: 'var(--purple)', red: 'var(--red)' }

export default function TopPage({ onSelect }) {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroEyebrow}>Python 実務リファレンス</div>
        <h1 className={styles.heroTitle}>初心者向けサイトには<br /><span className={styles.heroAccent}>載っていない</span> 実務の知識</h1>
        <p className={styles.heroDesc}>型システム・デコレータ・非同期・パフォーマンスチューニングまで。実務でPythonを書き続けるために必要なTipsをまとめたリファレンスサイト。</p>
        <div className={styles.stats}>
          <div className={styles.stat}><span className={styles.statNum}>{sections.length}</span><span className={styles.statLabel}>トピック</span></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><span className={styles.statNum}>{categories.length}</span><span className={styles.statLabel}>カテゴリ</span></div>
          <div className={styles.statDivider} />
          <div className={styles.stat}><span className={styles.statNum}>{sections.reduce((acc, s) => acc + s.blocks.length, 0)}</span><span className={styles.statLabel}>コードサンプル</span></div>
        </div>
      </div>
      <div className={styles.grid}>
        {sections.map(item => {
          const Icon = categoryIcons[item.category] || Code2
          return (
            <button key={item.id} className={styles.card} onClick={() => onSelect(item.id)}>
              <div className={styles.cardTop}>
                <div className={styles.iconWrap}><Icon size={16} /></div>
                <span className={styles.badge} style={{ color: badgeColors[item.badgeColor] }}>{item.badge}</span>
              </div>
              <div className={styles.cardCat}>{item.category}</div>
              <div className={styles.cardTitle}>{item.title}</div>
              <p className={styles.cardDesc}>{item.summary.slice(0, 72)}…</p>
              <div className={styles.cardFooter}>
                <span>{item.blocks.length} サンプル</span>
                {item.tips && <span>{item.tips.length} Tips</span>}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
