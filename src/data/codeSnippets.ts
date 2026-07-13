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
  {
    tab: 'ContactForm.tsx',
    lang: 'react',
    badge: 'React 19 · useActionState',
    code: `'use client';

import { useActionState } from 'react';
import { sendMessage } from '@/app/actions';

type FormState = { ok: boolean; error?: string };

export function ContactForm() {
  const [state, action, pending] = useActionState(
    async (_prev: FormState, form: FormData) => {
      const res = await sendMessage(form);
      return res.ok
        ? { ok: true }
        : { ok: false, error: res.message };
    },
    { ok: false }
  );

  return (
    <form action={action}>
      <input name="email" type="email" required />
      <textarea name="body" minLength={20} required />
      <button disabled={pending}>
        {pending ? 'Sending…' : 'Send'}
      </button>
      {state.error && <p role="alert">{state.error}</p>}
    </form>
  );
}`,
  },
  {
    tab: 'createStore.ts',
    lang: 'react',
    badge: 'React · useSyncExternalStore',
    code: `type Listener = () => void;

export function createStore<T>(initial: T) {
  let state = initial;
  const listeners = new Set<Listener>();

  const subscribe = (fn: Listener) => {
    listeners.add(fn);
    return () => listeners.delete(fn);
  };

  const setState = (update: (prev: T) => T) => {
    state = update(state);
    listeners.forEach((fn) => fn());
  };

  const useStore = <S,>(selector: (s: T) => S): S =>
    useSyncExternalStore(
      subscribe,
      () => selector(state),
      () => selector(initial) // SSR snapshot
    );

  return { useStore, setState, getState: () => state };
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
  {
    tab: 'VehicleAggregator.kt',
    lang: 'kotlin',
    badge: 'Kotlin · structured concurrency',
    code: `@Component
class VehicleDetailAggregator(
    private val pricing: PricingClient,
    private val specs: SpecsClient,
    private val media: MediaClient,
) {
    suspend fun load(vin: Vin): VehicleDetail =
        coroutineScope {
            val price = async { pricing.quote(vin) }
            val spec = async { specs.byVin(vin) }
            val photos = async {
                runCatching { media.gallery(vin) }
                    .getOrDefault(Gallery.EMPTY)
            }

            VehicleDetail(
                vin = vin,
                price = price.await(),
                spec = spec.await(),
                gallery = photos.await(),
            )
        }
}`,
  },
  {
    tab: 'OrderConsumer.kt',
    lang: 'kotlin',
    badge: 'Spring Kafka · coroutines',
    code: `@Component
class OrderEventsConsumer(
    private val handler: OrderEventHandler,
    private val meter: MeterRegistry,
) {
    @KafkaListener(topics = ["orders.v1"], groupId = "billing")
    suspend fun onEvent(record: ConsumerRecord<String, ByteArray>) {
        val event = OrderEvent.parseFrom(record.value())

        withTimeout(5_000) {
            when (event.type) {
                CREATED -> handler.reserve(event)
                CANCELLED -> handler.release(event)
                else -> meter.counter("orders.skipped")
                    .increment()
            }
        }
    }
}`,
  },
];

export const CODE_SNIPPETS: Record<SnippetLang, CodeSnippet[]> = {
  react: REACT_SNIPPETS,
  kotlin: KOTLIN_SNIPPETS,
};
