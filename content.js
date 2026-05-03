export const sections = [
  {
    id: 'type-hints',
    category: '型システム',
    title: '型ヒント完全ガイド',
    badge: 'Python 3.10+',
    badgeColor: 'blue',
    summary: '実務でのPython型ヒントは基本の str/int だけでは不十分。TypeVar・Protocol・TypedDict・Literal を使いこなすことで静的解析の恩恵を最大化できる。',
    tips: [
      '型ヒントは実行時に強制されない — mypyやpyrightで静的チェックを必ずCIに組み込む',
      'Protocol はduck typingと型安全を両立できる最強の道具',
      'TypedDict はJSONやAPIレスポンスの型定義に使う',
    ],
    blocks: [
      {
        title: 'TypeVar — ジェネリクス',
        code: `from typing import TypeVar, Generic

T = TypeVar('T')

def first(items: list[T]) -> T:
    """型を保持したまま先頭要素を返す"""
    return items[0]

# 呼び出し側で型が推論される
x: int  = first([1, 2, 3])      # x は int
s: str  = first(["a", "b"])     # s は str

# Genericクラスに使う
class Stack(Generic[T]):
    def __init__(self) -> None:
        self._items: list[T] = []

    def push(self, item: T) -> None:
        self._items.append(item)

    def pop(self) -> T:
        return self._items.pop()

stack: Stack[int] = Stack()
stack.push(42)`,
        note: 'TypeVar を使わずに `list[Any]` を返すと、呼び出し側の型情報が失われる。ジェネリクスで型を伝搬させることが実務では重要。',
      },
      {
        title: 'Protocol — 構造的部分型',
        code: `from typing import Protocol, runtime_checkable

@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None: ...
    def resize(self, factor: float) -> None: ...

class Circle:
    def draw(self) -> None:
        print("○ を描画")
    def resize(self, factor: float) -> None:
        self.radius *= factor

class Square:
    def draw(self) -> None:
        print("□ を描画")
    def resize(self, factor: float) -> None:
        self.side *= factor

# Circle も Square も Drawable を継承していないが型チェックを通る
def render_all(shapes: list[Drawable]) -> None:
    for shape in shapes:
        shape.draw()

# isinstance チェックも可能（@runtime_checkable が必要）
print(isinstance(Circle(), Drawable))  # True`,
        note: 'ABCの継承を強制しないため、外部ライブラリのクラスにも後付けで型を当てられる。FastAPIやPydanticと組み合わせると特に強力。',
      },
      {
        title: 'TypedDict / Literal / Union',
        code: `from typing import TypedDict, Literal, NotRequired

# TypedDict: 辞書の型を厳密に定義
class CafeRecord(TypedDict):
    name: str
    rating: float
    category: Literal["coffee", "tea", "multi"]  # 許可する値を限定
    address: NotRequired[str]  # 省略可能キー (3.11+: Required/NotRequired)

# 使用例
def process(cafe: CafeRecord) -> str:
    return f"{cafe['name']} ({cafe['rating']})"

# Literal: 定数の型
Mode = Literal["read", "write", "append"]

def open_file(path: str, mode: Mode) -> None:
    ...

open_file("data.txt", "read")    # OK
# open_file("data.txt", "exec")  # mypy エラー

# Python 3.10+ の Union 新記法
def parse(value: str | int | None) -> str:
    if value is None:
        return "N/A"
    return str(value)`,
        note: '`X | Y` 記法は Python 3.10+。それ以前は `Union[X, Y]` を使う。TypedDict は Pydantic モデルより軽量で、変換コストが不要な場面に向いている。',
      },
    ],
  },
  {
    id: 'dataclasses',
    category: '型システム',
    title: 'dataclass と pydantic',
    badge: '実務必須',
    badgeColor: 'accent',
    summary: 'データ保持クラスを手書きするのは非効率。dataclassとpydanticを使い分けることで、ボイラープレートを排除しつつ型安全なコードを書ける。',
    tips: [
      'dataclassは軽量・標準ライブラリ。バリデーション不要な内部データ構造に使う',
      'pydanticはAPIリクエスト/レスポンスや外部入力のバリデーションに使う',
      'field(default_factory=list) を忘れるとミュータブルデフォルト引数バグが発生する',
    ],
    blocks: [
      {
        title: 'dataclass の実践的使い方',
        code: `from dataclasses import dataclass, field, KW_ONLY
from typing import ClassVar

@dataclass(frozen=True, slots=True)  # イミュータブル + メモリ最適化
class Point:
    x: float
    y: float

    def distance(self) -> float:
        return (self.x**2 + self.y**2) ** 0.5

@dataclass
class Cafe:
    name: str
    rating: float
    # NG: tags: list = []  ← ミュータブルデフォルト引数バグ
    tags: list[str] = field(default_factory=list)
    _created_count: ClassVar[int] = 0  # クラス変数

    def __post_init__(self) -> None:
        # 生成後の追加バリデーション
        if not 0 <= self.rating <= 5:
            raise ValueError(f"rating must be 0-5, got {self.rating}")
        Cafe._created_count += 1

p = Point(3.0, 4.0)
print(p.distance())  # 5.0
# p.x = 1.0  # frozen=True なので TypeError`,
        note: '`frozen=True` でハッシュ可能になるため、辞書のキーやsetの要素に使える。`slots=True` (Python 3.10+) はメモリを約30%削減できる。',
      },
      {
        title: 'pydantic v2 によるバリデーション',
        code: `from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Annotated

PositiveFloat = Annotated[float, Field(gt=0, le=5)]

class CafeModel(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    rating: PositiveFloat
    tags: list[str] = []
    website: str | None = None

    @field_validator('name')
    @classmethod
    def name_strip(cls, v: str) -> str:
        return v.strip()

    @model_validator(mode='after')
    def check_website(self) -> 'CafeModel':
        if self.rating >= 4.5 and not self.website:
            raise ValueError("高評価カフェはwebsite必須")
        return self

# 辞書・JSON から直接生成
cafe = CafeModel(name="  函館珈琲  ", rating=4.2)
print(cafe.name)  # "函館珈琲" (stripされている)

# JSON スキーマを自動生成 (OpenAPI連携に便利)
print(CafeModel.model_json_schema())`,
        note: 'pydantic v2はRustベースの実装でv1の約5〜50倍高速。FastAPIはpydanticを内部で使っているため、FastAPIを使うなら必ず習得する。',
      },
    ],
  },
  {
    id: 'decorators',
    category: '関数・クラス応用',
    title: 'デコレータ実装パターン',
    badge: '中〜上級',
    badgeColor: 'purple',
    summary: '@app.route や @property の裏側にある仕組みを理解し、自前でデコレータを実装できるようになる。引数付きデコレータ・クラスデコレータまで網羅。',
    tips: [
      'functools.wraps を必ず使う — ないとデバッグ時に関数名が消える',
      'デコレータはクロージャの応用。スタックして書く順番は下から適用される',
      'クラスデコレータは __call__ を実装するだけ',
    ],
    blocks: [
      {
        title: '基本〜引数付きデコレータ',
        code: `import functools, time
from typing import Callable, Any

# 基本デコレータ
def timer(func: Callable) -> Callable:
    @functools.wraps(func)  # 必須: 元の関数名・docstringを保持
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__}: {elapsed:.4f}s")
        return result
    return wrapper

# 引数付きデコレータ (ラッパーが1層増える)
def retry(times: int = 3, delay: float = 1.0):
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args: Any, **kwargs: Any) -> Any:
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1:
                        raise
                    print(f"Retry {attempt+1}/{times}: {e}")
                    time.sleep(delay)
        return wrapper
    return decorator

@timer
@retry(times=3, delay=0.5)  # 下から適用: retry → timer の順
def fetch_data(url: str) -> dict:
    ...`,
        note: '`@retry(times=3)` のように引数ありの場合はラッパー関数が1段増える。`functools.wraps` がないと `func.__name__` が "wrapper" になり、ログやトレースが読めなくなる。',
      },
      {
        title: 'クラスデコレータ / キャッシュ',
        code: `import functools
from typing import Callable

# クラスとしてデコレータを実装
class RateLimit:
    def __init__(self, max_calls: int, period: float):
        self.max_calls = max_calls
        self.period = period
        self.calls: list[float] = []

    def __call__(self, func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            import time
            now = time.time()
            # periodより古い記録を削除
            self.calls = [t for t in self.calls if now - t < self.period]
            if len(self.calls) >= self.max_calls:
                raise RuntimeError("Rate limit exceeded")
            self.calls.append(now)
            return func(*args, **kwargs)
        return wrapper

@RateLimit(max_calls=5, period=60.0)
def call_api(endpoint: str) -> dict:
    ...

# 標準ライブラリのキャッシュデコレータ
@functools.lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Python 3.9+: 引数なしで使える
@functools.cache
def expensive_calc(x: int) -> int:
    return x ** 2`,
        note: '`@functools.cache` は `lru_cache(maxsize=None)` と同等。キャッシュは無制限に増えるのでメモリに注意。再帰関数のメモ化には特に有効。',
      },
    ],
  },
  {
    id: 'context-manager',
    category: '関数・クラス応用',
    title: 'コンテキストマネージャ',
    badge: 'with 文の裏側',
    badgeColor: 'blue',
    summary: 'with 文はリソース管理の標準パターン。__enter__/__exit__ の自作と contextlib を使ったより簡潔な書き方を習得する。',
    tips: [
      '__exit__ の引数 (exc_type, exc_val, exc_tb) が None でないとき例外が発生している',
      '__exit__ が True を返すと例外を握り潰す — 意図しない握り潰しに注意',
      'contextlib.contextmanager を使うと yield 1行で書ける',
    ],
    blocks: [
      {
        title: 'クラス実装 vs contextlib',
        code: `import contextlib, time
from typing import Generator

# クラス実装
class Timer:
    def __enter__(self) -> 'Timer':
        self.start = time.perf_counter()
        return self  # as 句で受け取る値

    def __exit__(self, exc_type, exc_val, exc_tb) -> bool:
        self.elapsed = time.perf_counter() - self.start
        print(f"elapsed: {self.elapsed:.4f}s")
        return False  # 例外を伝播させる (True なら握り潰す)

with Timer() as t:
    time.sleep(0.1)
print(t.elapsed)  # 0.1...

# contextlib を使うと yield 1行で同等に書ける
@contextlib.contextmanager
def timer() -> Generator[None, None, None]:
    start = time.perf_counter()
    try:
        yield  # with ブロックの実行はここ
    finally:
        print(f"elapsed: {time.perf_counter() - start:.4f}s")

# suppress: 特定の例外を無視するコンテキストマネージャ
with contextlib.suppress(FileNotFoundError):
    open("nonexistent.txt")  # エラーを無視して続行`,
        note: '`contextlib.suppress` はエラーを握り潰すが、意図が明確で読みやすい。`try-except: pass` より推奨される書き方。',
      },
    ],
  },
  {
    id: 'itertools',
    category: 'データ処理',
    title: 'itertools / functools',
    badge: 'パフォーマンス',
    badgeColor: 'accent',
    summary: 'itertools はメモリを使わない遅延評価でデータを処理できる標準ライブラリ。大きなデータセットを扱う実務では必須の道具。',
    tips: [
      'itertools は遅延評価 — リストに変換するまでメモリを消費しない',
      'chain.from_iterable はネストしたリストのフラット化に list(chain(*nested)) より速い',
      'groupby は事前にソートが必要。ソートしないと不連続なグループが別々に扱われる',
    ],
    blocks: [
      {
        title: 'itertools 実務パターン',
        code: `import itertools
from itertools import (
    chain, groupby, islice, batched,  # batched は 3.12+
    product, combinations, permutations
)

# chain: 複数イテラブルを結合
result = list(chain([1,2], [3,4], [5,6]))
# [1, 2, 3, 4, 5, 6]

# ネストしたリストをフラット化
nested = [[1,2],[3,4],[5,6]]
flat = list(chain.from_iterable(nested))

# islice: 先頭N件だけ取り出す (リスト化せずに済む)
def all_records():  # 巨大なジェネレータを想定
    yield from range(1_000_000)

first_10 = list(islice(all_records(), 10))

# groupby: 連続する同じキーでグルーピング (要事前ソート)
data = [
    {"type": "coffee", "name": "エスプレッソ"},
    {"type": "coffee", "name": "ラテ"},
    {"type": "tea",    "name": "紅茶"},
]
data.sort(key=lambda x: x["type"])  # 必ずソート先に
for key, group in groupby(data, key=lambda x: x["type"]):
    print(key, list(group))

# batched (Python 3.12+): N件ずつに分割
for batch in batched(range(10), 3):
    print(batch)  # (0,1,2) (3,4,5) (6,7,8) (9,)`,
        note: '`batched` は3.12未満では `itertools` にない。代替として `[lst[i:i+n] for i in range(0, len(lst), n)]` か `more-itertools` ライブラリを使う。',
      },
      {
        title: 'functools の実務パターン',
        code: `import functools
from functools import reduce, partial

# partial: 引数を固定して新しい関数を作る
def power(base: int, exp: int) -> int:
    return base ** exp

square = partial(power, exp=2)
cube   = partial(power, exp=3)
print(square(5))  # 25
print(cube(3))    # 27

# reduce: リストを単一値に畳み込む
total = reduce(lambda acc, x: acc + x, [1,2,3,4,5], 0)
# 同じ: sum([1,2,3,4,5])

# 実用例: 辞書のマージ (Python 3.9+ は | 演算子で可)
dicts = [{"a": 1}, {"b": 2}, {"c": 3}]
merged = reduce(lambda a, b: {**a, **b}, dicts)
# {"a":1, "b":2, "c":3}

# singledispatch: 型に応じてディスパッチ
@functools.singledispatch
def process(value):
    raise TypeError(f"Unsupported type: {type(value)}")

@process.register(int)
def _(value: int) -> str:
    return f"整数: {value}"

@process.register(str)
def _(value: str) -> str:
    return f"文字列: {value!r}"`,
        note: '`partial` はコールバック関数の引数を事前バインドするときに使う。`singledispatch` はif-elif型チェックを排除できる。',
      },
    ],
  },
  {
    id: 'collections',
    category: 'データ処理',
    title: 'collections モジュール',
    badge: '標準ライブラリ',
    badgeColor: 'blue',
    summary: 'defaultdict・Counter・deque・OrderedDict など、実務で頻出のデータ構造が揃っている。リストや辞書で代替できるが、collectionsを使うとコードが格段に簡潔になる。',
    tips: [
      'Counter.most_common(n) は頻度集計の最短手段',
      'deque は O(1) で両端追加/削除できる。リストの先頭操作は O(n) なので大量データには deque を使う',
      'defaultdict でキー存在チェックのif文を消せる',
    ],
    blocks: [
      {
        title: 'defaultdict / Counter / deque',
        code: `from collections import defaultdict, Counter, deque, OrderedDict

# defaultdict: キーがなくてもエラーにならない
# 普通の辞書だと KeyError
word_count: defaultdict[str, int] = defaultdict(int)
for word in ["apple", "banana", "apple", "cherry", "apple"]:
    word_count[word] += 1
# {"apple": 3, "banana": 1, "cherry": 1}

# ネストした辞書も簡潔に
graph: defaultdict[str, list] = defaultdict(list)
graph["A"].append("B")  # "A" キーがなくても動く

# Counter: 頻度カウントの専用クラス
reviews = ["良い", "普通", "良い", "悪い", "良い", "普通"]
c = Counter(reviews)
print(c.most_common(2))   # [("良い", 3), ("普通", 2)]
print(c["良い"])           # 3
print(c["存在しない"])     # 0 (KeyError にならない)

# Counter同士の演算
c1 = Counter({"a": 3, "b": 1})
c2 = Counter({"a": 1, "b": 2})
print(c1 + c2)  # Counter({"a": 4, "b": 3})
print(c1 - c2)  # Counter({"a": 2})

# deque: 両端キュー (sliding window に最適)
dq: deque[int] = deque(maxlen=3)  # 最大3要素
for i in range(5):
    dq.append(i)
# deque([2,3,4], maxlen=3) ← 自動的に古い要素が消える

dq.appendleft(99)  # 左端に追加 O(1)
dq.popleft()       # 左端から削除 O(1)`,
        note: '`deque(maxlen=N)` は固定サイズのスライディングウィンドウに最適。ログの直近N件保持やストリームデータ処理でよく使う。',
      },
    ],
  },
  {
    id: 'asyncio',
    category: '非同期・並列',
    title: 'asyncio 実践',
    badge: 'I/O 処理',
    badgeColor: 'amber',
    summary: 'Webスクレイピング・API呼び出し・DBアクセスなどI/Oバウンドな処理で真価を発揮。CPU負荷の高い処理はasyncioより multiprocessing が向いている。',
    tips: [
      'asyncio.gather で複数コルーチンを同時実行できる',
      'CPU bound な処理を async 関数内でやるとイベントループをブロックする — loop.run_in_executor を使う',
      'asyncio.Semaphore で並列実行数を制限する (API レート制限対策)',
    ],
    blocks: [
      {
        title: 'asyncio の基本パターン',
        code: `import asyncio
import aiohttp  # pip install aiohttp

# 基本的なコルーチン
async def fetch(session: aiohttp.ClientSession, url: str) -> dict:
    async with session.get(url) as response:
        return await response.json()

# gather で並列実行
async def fetch_all(urls: list[str]) -> list[dict]:
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, url) for url in urls]
        return await asyncio.gather(*tasks)

# Semaphore で並列数を制限
async def fetch_with_limit(urls: list[str], limit: int = 5) -> list:
    sem = asyncio.Semaphore(limit)

    async def bounded_fetch(url: str) -> dict:
        async with sem:  # 同時実行数を limit に制限
            async with aiohttp.ClientSession() as s:
                return await fetch(s, url)

    return await asyncio.gather(*[bounded_fetch(u) for u in urls])

# CPU boundな処理はrun_in_executorでスレッドプールに逃がす
import concurrent.futures

async def cpu_bound_example(data: list) -> list:
    loop = asyncio.get_event_loop()
    with concurrent.futures.ProcessPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, sorted, data)
    return result

# エントリーポイント
if __name__ == "__main__":
    asyncio.run(fetch_all(["https://example.com"]))`,
        note: '`asyncio.gather` はエラーが1つでも発生すると他を中断する。`return_exceptions=True` を付けると例外をリストで返してくれる。',
      },
    ],
  },
  {
    id: 'walrus',
    category: '構文の応用',
    title: 'Walrus演算子 / アンパック応用',
    badge: 'Python 3.8+',
    badgeColor: 'purple',
    summary: 'セイウチ演算子 `:=` と拡張アンパックを使うとコードを大幅に短縮できる。使いすぎると可読性が落ちるため、効果的な場面を見極めることが重要。',
    tips: [
      'while ループでの結果チェックが最も効果的なユースケース',
      '内包表記内での中間値の再利用に使える',
      'ネストした := は可読性が急落する — 1式に1つまで',
    ],
    blocks: [
      {
        title: 'Walrus演算子の実践的ユースケース',
        code: `import re

# NG: 同じ処理を2回書く
data = get_data()
if len(data) > 0:
    process(data)

# OK: := で代入と評価を同時に
if data := get_data():
    process(data)

# while ループで最も効果的
# NG
chunk = file.read(8192)
while chunk:
    process(chunk)
    chunk = file.read(8192)

# OK
while chunk := file.read(8192):
    process(chunk)

# 内包表記内で中間値を再利用
results = [
    cleaned
    for raw in data
    if (cleaned := raw.strip()) and len(cleaned) > 5
]

# 正規表現マッチを条件とする
pattern = re.compile(r"(\d{4}-\d{2}-\d{2})")
texts = ["今日は 2024-01-15 に会議", "特に日付なし", "2024-02-20 締切"]

dates = [
    m.group(1)
    for text in texts
    if (m := pattern.search(text))
]
# ["2024-01-15", "2024-02-20"]`,
        note: '`while chunk := file.read(8192)` のパターンはファイルのストリーム読み込みで定番。ただし全く知らない人には読みにくいため、チームのコーディング規約に従うこと。',
      },
      {
        title: '拡張アンパック',
        code: `# * を使った拡張アンパック
first, *rest = [1, 2, 3, 4, 5]
# first=1, rest=[2,3,4,5]

*init, last = [1, 2, 3, 4, 5]
# init=[1,2,3,4], last=5

first, *middle, last = [1, 2, 3, 4, 5]
# first=1, middle=[2,3,4], last=5

# 関数呼び出しでのアンパック
def func(a, b, c, d):
    return a + b + c + d

args = [1, 2]
kwargs = {"c": 3, "d": 4}
result = func(*args, **kwargs)  # 6 + 4 = ... → 10

# 辞書のマージ (Python 3.9+ は | 演算子)
d1 = {"a": 1, "b": 2}
d2 = {"b": 99, "c": 3}
merged = {**d1, **d2}   # {"a":1, "b":99, "c":3} 後が優先
merged2 = d1 | d2       # Python 3.9+ 同等`,
        note: 'ディクショナリのマージは Python 3.9+ では `d1 | d2` が推奨。`{**d1, **d2}` は古い環境でも動くため、互換性が必要なら後者を使う。',
      },
    ],
  },
  {
    id: 'pathlib',
    category: 'ファイル・IO',
    title: 'pathlib によるファイル操作',
    badge: 'os.path 卒業',
    badgeColor: 'blue',
    summary: 'os.path は文字列操作の寄せ集めで可読性が低い。pathlib.Path を使うとオブジェクト指向スタイルでファイル操作が格段に書きやすくなる。',
    tips: [
      'Path オブジェクトは / 演算子でパスを結合できる',
      'glob() と rglob() でパターンマッチするファイルを一括取得できる',
      'read_text() / write_text() でファイルの読み書きが1行で書ける',
    ],
    blocks: [
      {
        title: 'os.path → pathlib への移行',
        code: `from pathlib import Path

# os.path との比較
# NG (os.path スタイル)
import os
path = os.path.join(os.path.expanduser("~"), "project", "data.json")
if os.path.exists(path):
    with open(path) as f:
        content = f.read()

# OK (pathlib スタイル)
path = Path.home() / "project" / "data.json"
if path.exists():
    content = path.read_text(encoding="utf-8")

# よく使う属性とメソッド
p = Path("/home/user/project/data.csv")
p.name        # "data.csv"
p.stem        # "data"
p.suffix      # ".csv"
p.parent      # Path("/home/user/project")
p.parts       # ("/", "home", "user", "project", "data.csv")

# ディレクトリ操作
output = Path("output")
output.mkdir(parents=True, exist_ok=True)  # exist_ok で既存でもエラーなし

# ファイル一覧
for f in Path(".").glob("**/*.py"):     # 再帰的に全 .py ファイル
    print(f.relative_to(Path(".")))

# ファイルへの書き込み
(output / "result.txt").write_text("完了\\n", encoding="utf-8")`,
        note: '`mkdir(parents=True, exist_ok=True)` は中間ディレクトリも含めて作成し、既存でも例外を投げない。スクリプトの冒頭で出力先を準備するのに定番。',
      },
    ],
  },
  {
    id: 'logging',
    category: 'ファイル・IO',
    title: 'logging の正しい使い方',
    badge: 'print 卒業',
    badgeColor: 'amber',
    summary: '実務のコードで print() によるデバッグは厳禁。logging モジュールを使うことでログレベル制御・ファイル出力・フォーマット統一が可能になる。',
    tips: [
      'モジュール単位で __name__ を使ってロガーを作成する',
      'ルートロガーへの basicConfig はスクリプトの起点 (main) でのみ呼ぶ',
      '本番環境では structlog や loguru などサードパーティも選択肢に入る',
    ],
    blocks: [
      {
        title: '実務的な logging 設定',
        code: `import logging
import sys
from logging.handlers import RotatingFileHandler

# --- ライブラリ・モジュール内 (各ファイルの先頭) ---
logger = logging.getLogger(__name__)  # モジュール名がロガー名になる

def fetch_cafe(cafe_id: str) -> dict:
    logger.debug("Fetching cafe id=%s", cafe_id)  # f-string ではなく % 記法
    try:
        result = db.get(cafe_id)
        logger.info("Fetched: %s", result["name"])
        return result
    except KeyError:
        logger.warning("Cafe not found: %s", cafe_id)
        return {}
    except Exception:
        logger.exception("Unexpected error")  # スタックトレースも記録
        raise

# --- エントリーポイント (main.py) でのみ設定 ---
def setup_logging(level: int = logging.INFO) -> None:
    fmt = "%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    handlers = [
        logging.StreamHandler(sys.stdout),
        RotatingFileHandler(
            "app.log",
            maxBytes=10 * 1024 * 1024,  # 10MB
            backupCount=5,
            encoding="utf-8",
        ),
    ]
    logging.basicConfig(level=level, format=fmt, handlers=handlers)

if __name__ == "__main__":
    setup_logging(logging.DEBUG)  # 開発時
    # setup_logging(logging.INFO)  # 本番時`,
        note: 'ログメッセージには f-string ではなく `%s` 記法を使う。f-string は logging.DEBUG レベルでも文字列が評価されるが、`%` 記法ならログレベルが低い場合は文字列生成自体をスキップできる。',
      },
    ],
  },
  {
    id: 'performance',
    category: 'パフォーマンス',
    title: 'スロット / プロファイリング',
    badge: '最適化',
    badgeColor: 'red',
    summary: 'Pythonのメモリ使用量やボトルネックを計測・改善する実践テクニック。最適化は必ず計測してから行うこと。',
    tips: [
      '__slots__ はクラスの属性を固定化し、インスタンスごとの __dict__ を消すことでメモリを削減する',
      'cProfile はどの関数が遅いかを特定する。timeit は特定の式の速度比較に使う',
      '最適化は必ずプロファイリングで根拠を得てから実施する',
    ],
    blocks: [
      {
        title: '__slots__ によるメモリ最適化',
        code: `import sys

# 通常のクラス: __dict__ でメモリを消費
class PointNormal:
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

# __slots__: インスタンスごとの __dict__ をなくす
class PointSlotted:
    __slots__ = ("x", "y")
    def __init__(self, x: float, y: float):
        self.x = x
        self.y = y

p1 = PointNormal(1.0, 2.0)
p2 = PointSlotted(1.0, 2.0)

print(sys.getsizeof(p1))   # 48 bytes
print(sys.getsizeof(p2))   # 32 bytes (約33%削減)

# 大量インスタンスを生成するケースで効果が大きい
normal_list  = [PointNormal(i, i) for i in range(100_000)]
slotted_list = [PointSlotted(i, i) for i in range(100_000)]

# デメリット: __slots__ にない属性は追加できない
# p2.z = 3.0  # AttributeError

# dataclass(slots=True) で slots をより簡潔に使える (Python 3.10+)
from dataclasses import dataclass

@dataclass(slots=True)
class Vector:
    x: float
    y: float
    z: float`,
        note: '`__slots__` は大量インスタンスを生成するクラス (例: ORMのレコード) で特に有効。継承すると扱いが複雑になるため、シンプルなデータクラスに限定して使うのが無難。',
      },
      {
        title: 'プロファイリングと計測',
        code: `import cProfile
import timeit
import pstats
import io

# timeit: 特定のコード片を精密計測
# リスト内包表記 vs map の速度比較
setup = "data = list(range(10000))"
expr1 = "[x*2 for x in data]"
expr2 = "list(map(lambda x: x*2, data))"

t1 = timeit.timeit(expr1, setup=setup, number=1000)
t2 = timeit.timeit(expr2, setup=setup, number=1000)
print(f"内包表記: {t1:.4f}s")
print(f"map:      {t2:.4f}s")

# cProfile: どの関数がボトルネックか特定する
def slow_function():
    return sum(i**2 for i in range(100_000))

pr = cProfile.Profile()
pr.enable()
slow_function()
pr.disable()

# 結果を cumtime (累積時間) でソート
stream = io.StringIO()
ps = pstats.Stats(pr, stream=stream).sort_stats("cumulative")
ps.print_stats(10)  # 上位10件
print(stream.getvalue())

# line_profiler (pip install line-profiler): 行ごとの計測
# @profile デコレータをつけて kernprof -l -v script.py で実行`,
        note: 'プロファイリングなしに「ここが遅そう」で最適化するのは危険。実際に計測すると意外な箇所がボトルネックになっていることがよくある。',
      },
    ],
  },
]

export const categories = [...new Set(sections.map(s => s.category))]
