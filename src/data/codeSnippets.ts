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

export type SnippetLang = 'react' | 'kotlin' | 'infra';

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
  {
    tab: 'middleware.ts',
    lang: 'react',
    badge: 'Next.js · edge middleware',
    code: `import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const session = req.cookies.get('__session')?.value;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith('/admin') && !session) {
    const login = new URL('/login', req.url);
    login.searchParams.set('next', pathname);
    return NextResponse.redirect(login);
  }

  const res = NextResponse.next();
  res.headers.set('x-request-id', crypto.randomUUID());
  return res;
}

export const config = {
  matcher: ['/admin/:path*', '/api/:path*'],
};`,
  },
  {
    tab: 'useFavorite.ts',
    lang: 'react',
    badge: 'React Query · optimistic',
    code: `export function useToggleFavorite(vin: string) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => api.toggleFavorite(vin),

    onMutate: async () => {
      await qc.cancelQueries({ queryKey: ['vehicle', vin] });
      const prev = qc.getQueryData<Vehicle>(['vehicle', vin]);
      qc.setQueryData<Vehicle>(['vehicle', vin], (v) =>
        v && { ...v, favorite: !v.favorite }
      );
      return { prev }; // rollback context
    },

    onError: (_err, _vars, ctx) =>
      qc.setQueryData(['vehicle', vin], ctx?.prev),

    onSettled: () =>
      qc.invalidateQueries({ queryKey: ['vehicle', vin] }),
  });
}`,
  },
  {
    tab: 'eventBus.ts',
    lang: 'react',
    badge: 'TypeScript · typed events',
    code: `type Events = {
  'cart:add': { sku: string; qty: number };
  'toast:show': { text: string; tone: 'info' | 'error' };
};

const bus = new EventTarget();

export function emit<K extends keyof Events>(
  type: K,
  detail: Events[K]
) {
  bus.dispatchEvent(new CustomEvent(type, { detail }));
}

export function useBusEvent<K extends keyof Events>(
  type: K,
  handler: (detail: Events[K]) => void
) {
  useEffect(() => {
    const on = (e: Event) =>
      handler((e as CustomEvent<Events[K]>).detail);
    bus.addEventListener(type, on);
    return () => bus.removeEventListener(type, on);
  }, [type, handler]);
}`,
  },
  {
    tab: 'useMediaQuery.ts',
    lang: 'react',
    badge: 'refactor · extract custom hook',
    code: `// this effect was copy-pasted into 5 components
// refactor: one hook, one source of truth

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const sync = () => setMatches(mql.matches);
    sync();
    mql.addEventListener('change', sync);
    return () => mql.removeEventListener('change', sync);
  }, [query]);

  return matches;
}`,
  },
  {
    tab: 'useVisibleRows.ts',
    lang: 'react',
    badge: 'refactor · derive, do not sync',
    code: `// smell: state mirrored from props with an effect
// refactor: compute in render with useMemo

export function useVisibleRows(rows: Row[], q: string) {
  // was: const [out, setOut] = useState(rows);
  // was: useEffect(() => setOut(filter(rows, q)));

  return useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return rows;
    return rows.filter((r) =>
      r.label.toLowerCase().includes(needle)
    );
  }, [rows, q]);
}`,
  },
  {
    tab: 'cartReducer.ts',
    lang: 'react',
    badge: 'refactor · setStates → useReducer',
    code: `// five useState calls collapsed into one reducer

type Action =
  | { type: 'add'; sku: string }
  | { type: 'remove'; sku: string }
  | { type: 'clear' };

export function reduce(state: Cart, action: Action): Cart {
  switch (action.type) {
    case 'add':
      return bump(state, action.sku, +1);
    case 'remove':
      return omit(state, action.sku);
    case 'clear':
      return {};
  }
}`,
  },
  {
    tab: 'ThemeContext.tsx',
    lang: 'react',
    badge: 'refactor · prop drilling → context',
    code: `// stop threading \`theme\` through 6 layers of props

const Ctx = createContext<ThemeApi | null>(null);

export function ThemeProvider({ children }: Props) {
  const [theme, setTheme] = useState<Theme>('dark');
  const api = useMemo<ThemeApi>(
    () => ({ theme, toggle: () => setTheme(flip) }),
    [theme]
  );
  return (
    <Ctx.Provider value={api}>{children}</Ctx.Provider>
  );
}

export function useTheme() {
  const api = useContext(Ctx);
  if (!api) throw new Error('need <ThemeProvider>');
  return api;
}`,
  },
  {
    tab: 'PriceChart.tsx',
    lang: 'react',
    badge: 'refactor · memo to stop re-renders',
    code: `// parent re-rendered this 60x/sec — not anymore

export const PriceChart = memo(function PriceChart({
  points,
}: { points: Point[] }) {
  const d = useMemo(() => toSvgPath(points), [points]);
  return <path d={d} className="spark" />;
});

// stable identity so React.memo actually holds
const onZoom = useCallback(
  (delta: number) => setScale((s) => clamp(s + delta)),
  []
);`,
  },
  {
    tab: 'Counter.tsx',
    lang: 'react',
    badge: 'refactor · class → function + hooks',
    code: `// 40 lines of class boilerplate → 9 lines of hooks

export function Counter({ step = 1 }: { step?: number }) {
  const [count, setCount] = useState(0);
  const inc = () => setCount((c) => c + step);

  useEffect(() => {
    document.title = \`Count: \${count}\`;
  }, [count]);

  return <button onClick={inc}>{count}</button>;
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
  {
    tab: 'QuoteRepository.kt',
    lang: 'kotlin',
    badge: 'Spring R2DBC · Reactor',
    code: `@Repository
class QuoteRepository(private val db: DatabaseClient) {

    fun findFresh(vin: Vin, ttl: Duration): Mono<Quote> =
        db.sql(
            """
            SELECT * FROM quotes
            WHERE vin = :vin AND created_at > :cutoff
            ORDER BY created_at DESC LIMIT 1
            """
        )
            .bind("vin", vin.value)
            .bind("cutoff", Instant.now().minus(ttl))
            .map { row -> row.toQuote() }
            .one()
            .timeout(Duration.ofMillis(400))

    fun upsert(quote: Quote): Mono<Quote> =
        db.sql(UPSERT_QUOTE)
            .bindProperties(quote)
            .fetch()
            .rowsUpdated()
            .thenReturn(quote)
}`,
  },
  {
    tab: 'WalletService.kt',
    lang: 'kotlin',
    badge: 'Reactor · transactional',
    code: `@Service
class WalletService(
    private val wallets: WalletRepository,
    private val ledger: LedgerRepository,
    private val tx: TransactionalOperator,
) {
    fun charge(cmd: ChargeCmd): Mono<Receipt> =
        wallets.findForUpdate(cmd.walletId)
            .filter { it.balance >= cmd.amount }
            .switchIfEmpty(insufficientFunds(cmd))
            .flatMap { wallet ->
                wallets.debit(wallet.id, cmd.amount)
                    .then(ledger.append(cmd.toEntry()))
                    .thenReturn(Receipt.of(wallet, cmd))
            }
            .\`as\`(tx::transactional)
            .retryWhen(optimisticLockRetry())
}`,
  },
  {
    tab: 'OutboxPublisher.kt',
    lang: 'kotlin',
    badge: 'Kotlin · outbox pattern',
    code: `@Component
class OutboxPublisher(
    private val outbox: OutboxRepository,
    private val bus: ServiceBusSender,
) {
    @Scheduled(fixedDelay = 2_000)
    fun drain() = runBlocking {
        outbox.lockBatch(size = 100)
            .map { msg ->
                async {
                    runCatching { bus.publish(msg) }
                        .onSuccess { outbox.markSent(msg.id) }
                        .onFailure { outbox.backoff(msg.id) }
                }
            }
            .awaitAll()
    }
}`,
  },
  {
    tab: 'SessionState.kt',
    lang: 'kotlin',
    badge: 'Kotlin · sealed state machine',
    code: `sealed interface SessionState {
    data object Idle : SessionState
    data class Charging(
        val kw: Double,
        val startedAt: Instant,
    ) : SessionState
    data class Faulted(val code: FaultCode) : SessionState
}

fun SessionState.next(event: ChargerEvent): SessionState =
    when (this) {
        is Idle -> when (event) {
            is PlugIn -> Charging(event.kw, event.at)
            else -> this
        }
        is Charging -> when (event) {
            is Fault -> Faulted(event.code)
            is Unplug -> Idle
            is PowerChange -> copy(kw = event.kw)
            else -> this
        }
        is Faulted -> if (event is Reset) Idle else this
    }`,
  },
];

const INFRA_SNIPPETS: CodeSnippet[] = [
  {
    tab: 'values.yaml',
    lang: 'infra',
    badge: 'Helm · production values',
    code: `# charging-api — production values
replicaCount: 3

image:
  repository: registry.io/driveway/charging-api
  tag: "1.42.0"
  pullPolicy: IfNotPresent

resources:
  requests: { cpu: 250m, memory: 512Mi }
  limits: { cpu: "1", memory: 1Gi }

autoscaling:
  enabled: true
  minReplicas: 3
  maxReplicas: 12
  targetCPUUtilizationPercentage: 70

livenessProbe:
  httpGet: { path: /actuator/health, port: 8080 }
  initialDelaySeconds: 20
  periodSeconds: 10

podDisruptionBudget:
  minAvailable: 2`,
  },
  {
    tab: 'deployment.yaml',
    lang: 'infra',
    badge: 'Helm · zero-downtime deploy',
    code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "app.fullname" . }}
  labels: {{- include "app.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  strategy:
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  template:
    spec:
      containers:
        - name: {{ .Chart.Name }}
          image: "{{ .Values.image.repo }}:{{ .Values.tag }}"
          ports:
            - containerPort: 8080
          envFrom:
            - secretRef:
                name: {{ .Release.Name }}-secrets
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8080`,
  },
  {
    tab: 'servicebus.tf',
    lang: 'infra',
    badge: 'Terraform · Azure Service Bus',
    code: `resource "azurerm_servicebus_namespace" "events" {
  name                = "driveway-events-\${var.env}"
  location            = var.location
  resource_group_name = var.rg_name
  sku                 = "Premium"
  capacity            = 2
}

resource "azurerm_servicebus_topic" "orders" {
  name         = "orders-v1"
  namespace_id = azurerm_servicebus_namespace.events.id

  partitioning_enabled  = true
  max_size_in_megabytes = 5120
}

resource "azurerm_servicebus_subscription" "billing" {
  name     = "billing-service"
  topic_id = azurerm_servicebus_topic.orders.id

  max_delivery_count = 5
  dead_lettering_on_message_expiration = true
}`,
  },
  {
    tab: 'aks.tf',
    lang: 'infra',
    badge: 'Terraform · AKS autoscaling',
    code: `module "aks" {
  source  = "Azure/aks/azurerm"
  version = "~> 9.0"

  cluster_name        = "driveway-\${var.env}"
  resource_group_name = var.rg_name
  kubernetes_version  = "1.30"

  agents_pool_name    = "workers"
  agents_size         = "Standard_D4s_v5"
  agents_min_count    = 3
  agents_max_count    = 10
  enable_auto_scaling = true

  network_plugin = "azure"
  network_policy = "cilium"

  tags = {
    team = "carson"
    cost = "platform"
  }
}

output "kube_host" {
  value     = module.aks.host
  sensitive = true
}`,
  },
];

export const CODE_SNIPPETS: Record<SnippetLang, CodeSnippet[]> = {
  react: REACT_SNIPPETS,
  kotlin: KOTLIN_SNIPPETS,
  infra: INFRA_SNIPPETS,
};
