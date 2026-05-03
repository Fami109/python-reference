import { useState } from 'react'
import { Check, Copy } from 'lucide-react'
import { Highlight, themes } from 'prism-react-renderer'
import styles from './CodeBlock.module.css'

const darkTheme = {
  plain: { backgroundColor: '#0d1117', color: '#e6edf3' },
  styles: [
    { types: ['comment', 'prolog', 'doctype', 'cdata'], style: { color: '#6e7681', fontStyle: 'italic' } },
    { types: ['namespace'], style: { opacity: 0.7 } },
    { types: ['string', 'attr-value'], style: { color: '#a5d6ff' } },
    { types: ['punctuation', 'operator'], style: { color: '#e6edf3' } },
    { types: ['entity', 'url', 'symbol', 'number', 'boolean', 'variable', 'constant', 'property'], style: { color: '#79c0ff' } },
    { types: ['attr-name', 'tag'], style: { color: '#7ee787' } },
    { types: ['keyword', 'atrule', 'rule'], style: { color: '#ff7b72' } },
    { types: ['function', 'deleted'], style: { color: '#d2a8ff' } },
    { types: ['important', 'italic'], style: { fontStyle: 'italic' } },
    { types: ['class-name', 'maybe-class-name'], style: { color: '#ffa657' } },
    { types: ['inserted'], style: { color: '#7ee787' } },
    { types: ['builtin'], style: { color: '#79c0ff' } },
  ],
}

export default function CodeBlock({ code, language = 'python' }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <span className={styles.lang}>{language}</span>
        <button className={styles.copyBtn} onClick={handleCopy}>
          {copied ? <Check size={13} /> : <Copy size={13} />}
          {copied ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <Highlight theme={darkTheme} code={code.trim()} language={language}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={styles.pre} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })} className={styles.line}>
                <span className={styles.lineNum}>{i + 1}</span>
                <span className={styles.lineContent}>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({ token })} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  )
}
