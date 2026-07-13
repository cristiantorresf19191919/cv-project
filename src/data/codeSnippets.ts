/**
 * codeSnippets — the CodeShowcase snippet library.
 *
 * Two pools (React 19 / Kotlin + Spring) that the animation alternates
 * between. Snippets are authored as plain strings and colored by the
 * tokenizer in `utils/tokenizeCode`, so adding one is a one-entry change.
 *
 * Authoring rules:
 *  - keep lines ≤ ~62 chars so mobile never wraps
 *  - senior-level, production-flavored code — no hello-world
 *  - blank lines / lone `}` act as "breath points" for the typing engine
 */

export type SnippetLang = 'react' | 'kotlin';

export interface CodeSnippet {
  /** File name shown in the editor tab */
  tab: string;
  lang: SnippetLang;
  /** Status-bar label, e.g. "React 19 · TSX" */
  badge: string;
  code: string;
}

const REACT_SNIPPETS: CodeSnippet[] = [
  {
    tab: 'useReactions.ts',
    lang: 'react',
    badge: 'React 19 · useOptimistic',
    code: `'use client';

import { useOptimistic, useTransition } from 'react';
import { saveReaction } from '@/app/actions';

type Reaction = { emoji: string; count: number };

export function useReactions(initial: Reaction[]) {
  const [pending, start] = useTransition();
  const [reactions, applyOptimistic] = useOptimistic(
    initial,
    (state, emoji: string) =>
      state.map((r) =>
        r.emoji === emoji ? { ...r, count: r.count + 1 } : r
      )
  );

  const react = (emoji: string) =>
    start(async () => {
      applyOptimistic(emoji); // instant UI
      await saveReaction(emoji); // server action
    });

  return { reactions, react, pending };
}`,
  },
  {
    tab: 'Dashboard.tsx',
    lang: 'react',
    badge: 'React 19 · use() + Suspense',
    code: `import { Suspense, use, cache } from 'react';

const getMetrics = cache(async (repo: string) => {
  const res = await fetch(\`/api/metrics/\${repo}\`, {
    next: { revalidate: 60 },
  });
  if (!res.ok) throw new Error(\`HTTP \${res.status}\`);
  return res.json() as Promise<Metrics>;
});

function Panel({ data }: { data: Promise<Metrics> }) {
  const metrics = use(data); // suspends until ready
  return <Sparkline points={metrics.series} />;
}

export default function Dashboard({ repo }: Props) {
  return (
    <Suspense fallback={<Skeleton rows={3} />}>
      <Panel data={getMetrics(repo)} />
    </Suspense>
  );
}`,
  },
  {
    tab: 'useSearch.ts',
    lang: 'react',
    badge: 'TypeScript · abortable fetch',
    code: `type Async<T> =
  | { status: 'idle' | 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: Error };

export function useSearch(query: string, delay = 250) {
  const [state, set] = useState<Async<Hit[]>>({
    status: 'idle',
  });

  useEffect(() => {
    if (!query.trim()) return;
    const ctrl = new AbortController();
    const timer = setTimeout(async () => {
      set({ status: 'loading' });
      try {
        const data = await api.search(query, ctrl.signal);
        set({ status: 'success', data });
      } catch (err) {
        if (ctrl.signal.aborted) return; // stale
        set({ status: 'error', error: err as Error });
      }
    }, delay);

    return () => {
      ctrl.abort();
      clearTimeout(timer);
    };
  }, [query, delay]);

  return state;
}`,
  },
];

const KOTLIN_SNIPPETS: CodeSnippet[] = [
  {
    tab: 'ChargingService.kt',
    lang: 'kotlin',
    badge: 'Kotlin · coroutines',
    code: `@Service
class ChargingSessionService(
    private val stations: StationClient,
    private val repo: SessionRepository,
) {
    suspend fun start(cmd: StartCmd): SessionView =
        withContext(Dispatchers.IO) {
            val station = reserveWithRetry(cmd.stationId)
            runCatching { repo.open(cmd, station) }
                .onFailure { stations.release(station.id) }
                .getOrThrow()
                .toView()
        }

    private suspend fun reserveWithRetry(
        id: StationId,
        times: Int = 3,
    ): Station {
        repeat(times - 1) { attempt ->
            stations.runCatching { reserve(id) }
                .onSuccess { return it }
            delay(150L * (attempt + 1)) // backoff
        }
        return stations.reserve(id)
    }
}`,
  },
  {
    tab: 'QuoteStream.kt',
    lang: 'kotlin',
    badge: 'Spring WebFlux · Reactor',
    code: `@RestController
class QuoteStreamController(
    private val quotes: QuoteService,
) {
    private val log = LoggerFactory.getLogger(javaClass)

    @GetMapping("/quotes/{vin}", produces = [NDJSON])
    fun stream(@PathVariable vin: String): Flux<Quote> =
        quotes.priceUpdates(vin)
            .sample(Duration.ofMillis(250))
            .timeout(Duration.ofSeconds(10))
            .retryWhen(
                Retry.backoff(3, Duration.ofMillis(400))
            )
            .onErrorResume { e ->
                log.warn("stream degraded: {}", e.message)
                quotes.lastKnown(vin).flux()
            }
            .doOnCancel { quotes.release(vin) }
}`,
  },
  {
    tab: 'SyncInventory.kt',
    lang: 'kotlin',
    badge: 'Kotlin Flow · clean architecture',
    code: `class SyncInventoryUseCase(
    private val feed: DealerFeed,
    private val catalog: CatalogPort,
) {
    fun execute(dealer: DealerId): Flow<SyncEvent> =
        feed.vehicles(dealer)
            .map { it.normalize() }
            .filter { it.isSellable }
            .chunked(size = 50)
            .map { batch ->
                SyncEvent.Upserted(catalog.upsert(batch))
            }
            .retryWhen { cause, attempt ->
                cause is TransientError && attempt < 3
            }
            .catch { emit(SyncEvent.Failed(it)) }
            .flowOn(Dispatchers.IO)
}`,
  },
];

export const CODE_SNIPPETS: Record<SnippetLang, CodeSnippet[]> = {
  react: REACT_SNIPPETS,
  kotlin: KOTLIN_SNIPPETS,
};
