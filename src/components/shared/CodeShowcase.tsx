'use client';

/**
 * CodeShowcase — a self-contained "live coding" editor card.
 *
 * Reuses the dark IDE visual style from Agency Partner 2's developer hub
 * (GitHub-Dark editor, macOS chrome, blueprint grid + glow backdrop) and adds
 * a real typing engine: snippets are written out character by character with
 * human pacing — fast bursts, short breaths at line ends, longer pauses after
 * completed blocks — then held, cleared, and replaced by a snippet from the
 * other language pool (React 19 ⇄ Kotlin/Spring), looping continuously.
 *
 * Accessibility & performance:
 *  - `prefers-reduced-motion`: a single static snippet, no caret, no rotation
 *  - typing pauses while the card is scrolled out of view (useInView)
 *  - purely decorative → `aria-hidden`
 *  - the first snippet is deterministic so SSR markup matches hydration
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { CODE_SNIPPETS, CodeSnippet, SnippetLang } from '@/data/codeSnippets';
import { tokenizeLine, sliceTokens, CodeToken, TokenKind } from '@/utils/tokenizeCode';
import s from '@/styles/code-showcase.module.css';

const ENTER = [0.22, 1, 0.36, 1] as const;
const HOLD_MS = 3800;

const KIND_CLASS: Record<TokenKind, string> = {
  plain: '',
  comment: s.synComment,
  string: s.synStr,
  annotation: s.synAnno,
  keyword: s.synKw,
  type: s.synType,
  number: s.synNum,
  fn: s.synFn,
};

const rand = (lo: number, hi: number) => lo + Math.random() * (hi - lo);

/** Human-feeling delay before typing the character at `pos`. */
function delayFor(code: string, pos: number): number {
  const prev = code[pos - 1];
  if (prev === '\n') {
    // A line was just completed — look back at what it was.
    const lineEnd = pos - 1;
    const lineStart = code.lastIndexOf('\n', lineEnd - 1) + 1;
    const finished = code.slice(lineStart, lineEnd).trim();
    if (finished === '') return rand(520, 820); // section break
    if (/^[}\])]+[,;)]?$/.test(finished)) return rand(420, 680); // block closed
    if (finished.startsWith('//')) return rand(240, 420); // note written
    return rand(150, 290);
  }
  if (prev === '{') return rand(60, 140);
  if (Math.random() < 0.03) return rand(200, 400); // brief hesitation
  return rand(14, 34);
}

function renderTokens(tokens: CodeToken[]) {
  return tokens.map((t, i) =>
    t.kind === 'plain' ? (
      t.text
    ) : (
      <span key={i} className={KIND_CLASS[t.kind]}>
        {t.text}
      </span>
    )
  );
}

export default function CodeShowcase({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const wrapRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const inView = useInView(wrapRef, { amount: 0.2 });
  const hoverRef = useRef(false);
  const lastIdxRef = useRef<Record<SnippetLang, number>>({ react: 0, kotlin: -1 });

  // Deterministic first snippet — SSR markup must match hydration.
  const [snippet, setSnippet] = useState<CodeSnippet>(CODE_SNIPPETS.react[0]);
  const [run, setRun] = useState(0);
  const [pos, setPos] = useState(0);

  const lines = useMemo(() => snippet.code.split('\n'), [snippet]);
  const tokenLines = useMemo(() => lines.map(tokenizeLine), [lines]);
  const lineStarts = useMemo(() => {
    const starts: number[] = [];
    let offset = 0;
    for (const line of lines) {
      starts.push(offset);
      offset += line.length + 1; // + '\n'
    }
    return starts;
  }, [lines]);

  const total = snippet.code.length;
  const typing = !reduce && pos < total;
  const done = reduce || pos >= total;

  // Current line/col (for the caret + status bar).
  let curLine = 0;
  for (let i = 0; i < lineStarts.length; i++) {
    if (lineStarts[i] <= pos) curLine = i;
    else break;
  }
  const curCol = Math.min(pos - lineStarts[curLine], lines[curLine]?.length ?? 0) + 1;

  /** Random snippet from the opposite pool, never repeating that pool's last pick. */
  const pickNext = useCallback((cur: CodeSnippet): CodeSnippet => {
    const lang: SnippetLang = cur.lang === 'react' ? 'kotlin' : 'react';
    const pool = CODE_SNIPPETS[lang];
    let i = Math.floor(Math.random() * pool.length);
    if (pool.length > 1 && i === lastIdxRef.current[lang]) {
      i = (i + 1) % pool.length;
    }
    lastIdxRef.current[lang] = i;
    return pool[i];
  }, []);

  // Typing engine — one self-cleaning timeout per character.
  useEffect(() => {
    if (reduce || !inView || pos >= total) return;
    const t = window.setTimeout(
      () => setPos((p) => p + 1),
      delayFor(snippet.code, pos)
    );
    return () => window.clearTimeout(t);
  }, [pos, total, reduce, inView, snippet]);

  // Hold the finished snippet, then move on (deferred while hovered).
  useEffect(() => {
    if (reduce || !done || !inView) return;
    let t: number;
    const advance = () => {
      if (hoverRef.current) {
        t = window.setTimeout(advance, 600);
        return;
      }
      setSnippet((cur) => pickNext(cur));
      setPos(0);
      setRun((r) => r + 1);
    };
    t = window.setTimeout(advance, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [done, reduce, inView, pickNext]);

  // Follow the caret like a real editor.
  useEffect(() => {
    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [curLine, run]);

  return (
    <div
      ref={wrapRef}
      className={`${s.wrap} ${className ?? ''}`}
      onMouseEnter={() => (hoverRef.current = true)}
      onMouseLeave={() => (hoverRef.current = false)}
      aria-hidden
    >
      <div className={s.grid} />
      <div className={s.glow} />
      <div className={s.editor}>
        <div className={s.bar}>
          <span className={`${s.dot} ${s.dotRed}`} />
          <span className={`${s.dot} ${s.dotYellow}`} />
          <span className={`${s.dot} ${s.dotGreen}`} />
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`tab-${run}`}
              className={s.tab}
              initial={reduce ? false : { opacity: 0, y: -3 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: 3 }}
              transition={{ duration: 0.22 }}
            >
              {snippet.tab}
            </motion.span>
          </AnimatePresence>
          <span className={s.langChips}>
            <span className={`${s.langChip} ${snippet.lang === 'react' ? s.langChipActive : ''}`}>
              TSX
            </span>
            <span className={`${s.langChip} ${snippet.lang === 'kotlin' ? s.langChipActive : ''}`}>
              KT
            </span>
          </span>
        </div>

        <div className={s.body} ref={bodyRef}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={`body-${run}`}
              initial={reduce ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.28, ease: ENTER }}
            >
              {lines.map((line, i) => {
                if (!reduce && lineStarts[i] > pos) return null;
                const isCurrent = !reduce && i === curLine;
                const typedChars = reduce
                  ? line.length
                  : Math.min(Math.max(pos - lineStarts[i], 0), line.length);
                const tokens = isCurrent
                  ? sliceTokens(tokenLines[i], typedChars)
                  : tokenLines[i];
                return (
                  <div key={i} className={s.codeLine}>
                    <span className={s.lineNo}>{i + 1}</span>
                    <span className={s.lineCode}>
                      {tokens.length > 0 ? renderTokens(tokens) : isCurrent ? null : ' '}
                      {isCurrent && <span className={s.caret} />}
                    </span>
                  </div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className={`${s.status} ${typing ? s.statusTyping : ''}`}>
          <span className={s.statusPulse} aria-hidden />
          <span>
            {typing ? `Ln ${curLine + 1}, Col ${curCol}` : 'Tests passed'}
          </span>
          <span className={s.statusSep}>·</span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={`badge-${run}`}
              className={s.statusDim}
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduce ? undefined : { opacity: 0 }}
              transition={{ duration: 0.22 }}
            >
              {snippet.badge}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
