/**
 * tokenizeCode — tiny one-pass, multi-language tokenizer for the CodeShowcase
 * typing animation. Ported from Agency Partner 2's CodeShowcase tokenizer and
 * extended with annotations + a wider Kotlin/TypeScript keyword set.
 *
 * Returns plain data tokens (not JSX) so the typing engine can slice a
 * partially-typed line mid-token without re-tokenizing on every keystroke.
 *
 * Alternation order = priority: comment → string → annotation → keyword →
 * Type → number → call.
 */

export type TokenKind =
  | 'plain'
  | 'comment'
  | 'string'
  | 'annotation'
  | 'keyword'
  | 'type'
  | 'number'
  | 'fn'
  | 'prop';

export interface CodeToken {
  text: string;
  kind: TokenKind;
}

const TOKEN =
  /(\/\/[^\n]*|#[^\n]*)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`)|(@[A-Za-z][A-Za-z0-9_]*)|\b(fun|val|var|class|object|interface|return|if|else|when|is|in|as|by|lazy|sealed|enum|suspend|override|private|internal|open|companion|init|repeat|it|out|inline|operator|typealias|lateinit|vararg|super|import|package|const|let|function|from|export|type|default|async|await|new|extends|implements|satisfies|keyof|typeof|readonly|of|do|for|while|switch|case|break|continue|try|catch|finally|throw|null|undefined|true|false|this|resource|module|provider|variable|output|terraform|source|apiVersion|kind)\b|\b([A-Z][A-Za-z0-9_]*)\b|\b(\d+(?:\.\d+)?(?:Mi|Gi|m)?L?)\b|\b([a-z_][A-Za-z0-9_]*)(?=\s*[({])|([\w.-]+)(?=\s*[:=]\s)/g;

/** Tokenize a single line of code into colored segments. */
export function tokenizeLine(line: string): CodeToken[] {
  const out: CodeToken[] = [];
  let last = 0;
  for (const m of Array.from(line.matchAll(TOKEN))) {
    const at = m.index ?? 0;
    if (at > last) out.push({ text: line.slice(last, at), kind: 'plain' });
    const [full, comment, str, anno, kw, type, num, fn, prop] = m;
    const kind: TokenKind = comment
      ? 'comment'
      : str
        ? 'string'
        : anno
          ? 'annotation'
          : kw
            ? 'keyword'
            : type
              ? 'type'
              : num
                ? 'number'
                : fn
                  ? 'fn'
                  : prop
                    ? 'prop'
                    : 'plain';
    out.push({ text: full, kind });
    last = at + full.length;
  }
  if (last < line.length) out.push({ text: line.slice(last), kind: 'plain' });
  return out;
}

/** First `count` characters of a tokenized line (for the partially-typed line). */
export function sliceTokens(tokens: CodeToken[], count: number): CodeToken[] {
  if (count <= 0) return [];
  const out: CodeToken[] = [];
  let budget = count;
  for (const t of tokens) {
    if (budget <= 0) break;
    if (t.text.length <= budget) {
      out.push(t);
      budget -= t.text.length;
    } else {
      out.push({ text: t.text.slice(0, budget), kind: t.kind });
      budget = 0;
    }
  }
  return out;
}
