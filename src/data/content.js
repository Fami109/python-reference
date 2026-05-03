export const sections = [
  {
    id: 'variables',
    category: '初級',
    title: '変数とデータ型',
    badge: '基礎',
    badgeColor: 'accent',
    summary: 'Pythonは型宣言不要。代入するだけで使える。主な型は int・float・str・bool・None の5つ。',
    tips: [
      'type() で型を確認できる',
      'None は「値がない」ことを表す — 0 や "" とは別物',
    ],
    blocks: [
      {
        title: '基本的な型',
        code: `age    = 21          # int   整数
height = 170.5       # float 小数
name   = "Ryo"       # str   文字列
is_ok  = True        # bool  真偽値
data   = None        # None  値なし

print(type(age))             # <class 'int'>
print(isinstance(age, int))  # True`,
        note: '`isinstance()` は型チェックに使う。`type(x) == int` より `isinstance(x, int)` が推奨。',
      },
      {
        title: '型変換（キャスト）',
        code: `x = int("42")      # 42
y = float("3.14")  # 3.14
s = str(100)       # "100"

# 変換できない場合は ValueError
try:
    n = int(input("数を入力: "))
except ValueError:
    print("数値を入力してください")`,
        note: 'ユーザー入力を変換するときは必ず try-except で囲む。',
      },
    ],
  },
  {
    id: 'strings',
    category: '初級',
    title: '文字列操作',
    badge: '基礎',
    badgeColor: 'accent',
    summary: '文字列はイミュータブル（変更不可）。操作すると常に新しい文字列が返る。f-string が最もよく使われる書き方。',
    tips: [
      'f-string は Python 3.6+ で使える最もシンプルな書き方',
      'str はシングルクォートでもダブルクォートでも同じ',
    ],
    blocks: [
      {
        title: 'f-string と基本メソッド',
        code: `name  = "ryo"
score = 95.5

print(f"名前: {name.upper()}, スコア: {score:.1f}")
# 名前: RYO, スコア: 95.5

s = "  Hello, Python!  "
s.strip()                     # "Hello, Python!"
s.lower()                     # "  hello, python!  "
s.upper()                     # "  HELLO, PYTHON!  "
s.replace("Python", "World")  # "  Hello, World!  "
s.split(", ")                 # ['  Hello', 'Python!  ']
", ".join(["a","b","c"])       # "a, b, c"

"hello".startswith("he")  # True
"py" in "python"          # True`,
        note: '`.strip()` `.lower()` `.split()` は頻出。必ず覚えておく。',
      },
      {
        title: 'スライス',
        code: `s = "Python"
#    0  1  2  3  4  5
#   -6 -5 -4 -3 -2 -1

s[0]      # 'P'
s[-1]     # 'n'
s[0:3]    # 'Pyt'
s[2:]     # 'thon'
s[:3]     # 'Pyt'
s[::-1]   # 'nohtyP' 逆順`,
        note: 'スライスは [start:stop:step] の形式。stop の位置は含まない。',
      },
    ],
  },
  {
    id: 'collections-basic',
    category: '初級',
    title: 'リスト・辞書・タプル・集合',
    badge: '基礎',
    badgeColor: 'accent',
    summary: 'Pythonの4つの基本コレクション。用途によって使い分ける。',
    tips: [
      'リスト: 順序あり・変更可能',
      '辞書: キーと値のペア・変更可能',
      'タプル: 順序あり・変更不可（固定データ向け）',
      '集合: 重複なし・順序なし',
    ],
    blocks: [
      {
        title: 'リスト (list)',
        code: `fruits = ["apple", "banana", "cherry"]

fruits[0]                  # "apple"
fruits[-1]                 # "cherry"
fruits.append("mango")     # 末尾に追加
fruits.insert(1, "grape")  # 位置指定で追加
fruits.remove("banana")    # 値で削除
fruits.pop()               # 末尾を取り出して削除
len(fruits)                # 要素数
fruits.sort()              # 昇順ソート (破壊的)
sorted(fruits)             # 新しいリストを返す (非破壊)

a = [1, 2, 3]
b = a          # NG: 参照コピー
b = a.copy()   # OK: 浅いコピー`,
        note: '`b = a` は参照コピー。元のリストも変わるので `.copy()` か `a[:]` を使う。',
      },
      {
        title: '辞書 (dict)',
        code: `user = {"name": "Ryo", "age": 21}

user["name"]                   # "Ryo"
user.get("email", "未登録")    # キーがなければデフォルト値
user["email"] = "ryo@example.com"
del user["age"]

for key, val in user.items():
    print(f"{key}: {val}")

"name" in user  # True (キーの存在確認)`,
        note: '`.get()` はキーが存在しなくてもエラーにならない。辞書アクセスには基本的に `.get()` を使う。',
      },
      {
        title: 'タプル・集合',
        code: `# タプル: 変更不可のリスト
point = (3, 4)
x, y = point       # アンパック

# 集合: 重複なし
tags = {"python", "AI", "python"}  # {"python", "AI"}
tags.add("ML")

a = {1, 2, 3}
b = {2, 3, 4}
a | b  # {1,2,3,4} 和集合
a & b  # {2,3}     積集合
a - b  # {1}       差集合`,
        note: 'タプルはハッシュ可能なので辞書のキーに使える。集合は重複除去や in 検索が高速。',
      },
    ],
  },
  {
    id: 'conditions',
    category: '初級',
    title: '条件分岐',
    badge: '基礎',
    badgeColor: 'accent',
    summary: 'if / elif / else で処理を分岐。インデント（4スペース）が構文の一部。',
    tips: [
      'Pythonに switch 文はない (3.10+ では match 文がある)',
      '空リスト・0・None・空文字列は False と評価される',
    ],
    blocks: [
      {
        title: 'if / elif / else',
        code: `score = 75

if score >= 90:
    print("優")
elif score >= 70:
    print("良")    # ← 実行される
elif score >= 50:
    print("可")
else:
    print("不可")

# 三項演算子
result = "合格" if score >= 60 else "不合格"

# Falsy な値
if not []:    # 空リストは False
    print("空")
if not None:  # None は False
    print("None")`,
        note: '三項演算子は複雑な条件には使わない。シンプルな二択のみ。',
      },
      {
        title: 'match 文 (Python 3.10+)',
        code: `status = 404

match status:
    case 200:
        print("OK")
    case 404:
        print("Not Found")
    case 500:
        print("Server Error")
    case _:
        print("Unknown")

# パターンマッチング
point = (1, 0)
match point:
    case (0, 0): print("原点")
    case (x, 0): print(f"X軸上: x={x}")
    case (0, y): print(f"Y軸上: y={y}")
    case (x, y): print(f"座標: ({x}, {y})")`,
        note: 'match 文は Python 3.10+。他言語の switch より強力でパターンマッチングができる。',
      },
    ],
  },
  {
    id: 'loops',
    category: '初級',
    title: 'ループ',
    badge: '基礎',
    badgeColor: 'accent',
    summary: 'for と while の2種類。Pythonの for はイテラブルを直接回せるのが特徴。',
    tips: [
      'インデックスが必要なら enumerate() を使う',
      '2つのリストを同時に回すには zip() を使う',
      'break で抜ける、continue でスキップ',
    ],
    blocks: [
      {
        title: 'for ループ',
        code: `for i in range(5):         # 0,1,2,3,4
    print(i)

for i in range(2, 8, 2):   # 2,4,6
    print(i)

fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# enumerate: インデックス付き
for i, fruit in enumerate(fruits):
    print(f"{i}: {fruit}")

# zip: 2つのリストを同時に
names  = ["Alice", "Bob"]
scores = [90, 75]
for name, score in zip(names, scores):
    print(f"{name}: {score}")`,
        note: '`for i in range(len(lst))` は非推奨。直接 `for item in lst` と書く。',
      },
      {
        title: 'while / break / continue / for-else',
        code: `n = 0
while n < 5:
    print(n)
    n += 1

# break: ループを抜ける
for i in range(10):
    if i == 5:
        break
    print(i)  # 0〜4

# continue: その回をスキップ
for i in range(5):
    if i == 2:
        continue
    print(i)  # 0,1,3,4

# for-else: break されなかった場合に実行
for i in range(5):
    if i == 10:
        break
else:
    print("break されなかった")  # 実行される`,
        note: 'for-else は Python 特有。break されなかった場合に else が実行される。探索処理でよく使う。',
      },
    ],
  },
  {
    id: 'functions-basic',
    category: '初級',
    title: '関数',
    badge: '基礎',
    badgeColor: 'accent',
    summary: 'def キーワードで定義。関数はコードの再利用と整理のための基本単位。',
    tips: [
      '引数にデフォルト値を設定できる',
      '複数の値を返す場合はタプルで返す',
      'lambda は1行で書ける無名関数',
    ],
    blocks: [
      {
        title: '関数の基本',
        code: `def greet(name, greeting="こんにちは"):
    return f"{greeting}、{name}さん！"

print(greet("Ryo"))               # こんにちは、Ryoさん！
print(greet("Ryo", "おはよう"))   # おはよう、Ryoさん！

# 複数の値を返す
def min_max(lst):
    return min(lst), max(lst)

lo, hi = min_max([3, 1, 4, 1, 5])  # 1, 5

# キーワード引数
def profile(name, age, city="東京"):
    print(f"{name}, {age}歳, {city}")

profile(age=21, name="Ryo", city="函館")`,
        note: 'デフォルト引数にリストや辞書を使うと予期しないバグになる。`def f(x=[])` はNG。',
      },
      {
        title: '*args / **kwargs / lambda',
        code: `# *args: 可変長引数
def total(*args):
    return sum(args)

total(1, 2, 3, 4)   # 10

# **kwargs: キーワード引数を辞書で受け取る
def show(**kwargs):
    for k, v in kwargs.items():
        print(f"{k}={v}")

show(name="Ryo", age=21)

# lambda: 1行の無名関数
square = lambda x: x ** 2
print(square(5))   # 25

# sorted の key によく使う
data = [{"name": "B", "score": 70}, {"name": "A", "score": 90}]
sorted(data, key=lambda x: x["score"], reverse=True)`,
        note: 'lambda は短い処理向け。複雑な処理は def で名前付き関数にした方が読みやすい。',
      },
    ],
  },
  {
    id: 'comprehension',
    category: '中級',
    title: '内包表記',
    badge: 'Pythonic',
    badgeColor: 'blue',
    summary: 'リスト・辞書・集合をワンライナーで生成。Pythonicな書き方の代表格。for ループより高速で簡潔に書ける。',
    tips: [
      'for ループより高速で簡潔に書ける',
      '2段ネストが可読性の限界',
      'ジェネレータ式 () は遅延評価でメモリ効率が良い',
    ],
    blocks: [
      {
        title: 'リスト・辞書・集合・ジェネレータ',
        code: `# リスト内包表記
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# 条件付き
evens = [x for x in range(20) if x % 2 == 0]

# 辞書内包表記
scores = {"A": 80, "B": 55, "C": 92}
passed = {k: v for k, v in scores.items() if v >= 60}
# {"A": 80, "C": 92}

# 集合内包表記
unique = {x % 3 for x in range(10)}  # {0, 1, 2}

# ジェネレータ式 (メモリ効率が良い)
total = sum(x**2 for x in range(1_000_000))`,
        note: 'ジェネレータ式 `()` は大量データの処理に使う。`sum()` `max()` などに直接渡せる。',
      },
    ],
  },
  {
    id: 'classes',
    category: '中級',
    title: 'クラス',
    badge: 'OOP',
    badgeColor: 'blue',
    summary: 'オブジェクト指向の基本。__init__ でインスタンス変数を定義する。',
    tips: [
      'self は自分自身のインスタンスを指す',
      '@classmethod はインスタンスなしで呼べる',
      '@property でゲッター/セッターを定義できる',
    ],
    blocks: [
      {
        title: 'クラスの基本',
        code: `class Cafe:
    count = 0  # クラス変数 (全インスタンスで共有)

    def __init__(self, name: str, rating: float):
        self.name   = name    # インスタンス変数
        self.rating = rating
        Cafe.count += 1

    def __repr__(self) -> str:
        return f"Cafe({self.name!r}, {self.rating})"

    def is_good(self) -> bool:
        return self.rating >= 4.0

    @classmethod
    def from_dict(cls, data: dict) -> "Cafe":
        return cls(data["name"], data["rating"])

    @property
    def stars(self) -> str:
        return "★" * round(self.rating)

c = Cafe("函館珈琲", 4.5)
print(c)            # Cafe('函館珈琲', 4.5)
print(c.is_good())  # True
print(c.stars)      # ★★★★★`,
        note: '`__repr__` はデバッグ時に `print()` で表示される文字列。必ず定義する習慣をつける。',
      },
      {
        title: '継承',
        code: `class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        raise NotImplementedError

class Dog(Animal):
    def speak(self) -> str:
        return "ワン！"

class Cat(Animal):
    def speak(self) -> str:
        return "ニャー！"

animals = [Dog("ポチ"), Cat("タマ")]
for a in animals:
    print(f"{a.name}: {a.speak()}")

print(isinstance(animals[0], Animal))  # True
print(isinstance(animals[0], Dog))     # True`,
        note: '`super().__init__()` で親クラスの初期化を呼ぶ。多重継承は複雑になるので基本は単一継承で設計する。',
      },
    ],
  },
  {
    id: 'exceptions',
    category: '中級',
    title: '例外処理',
    badge: 'エラー対策',
    badgeColor: 'blue',
    summary: 'エラーが起きても処理を継続するための仕組み。APIコールやファイル操作では必須。',
    tips: [
      'except Exception as e で例外の内容を取得できる',
      'finally はエラーの有無に関わらず必ず実行される',
      '握り潰し (except: pass) は原則禁止',
    ],
    blocks: [
      {
        title: 'try / except / else / finally',
        code: `try:
    x = int(input("数を入力: "))
    print(100 / x)
except ValueError:
    print("整数を入力してください")
except ZeroDivisionError:
    print("0では割れません")
except Exception as e:
    print(f"予期しないエラー: {e}")
else:
    print("エラーなしで完了")  # 例外がなかった場合のみ
finally:
    print("必ず実行される")   # クリーンアップ処理に使う

# raise で例外を発生させる
def divide(a, b):
    if b == 0:
        raise ValueError("0で割ることはできません")
    return a / b`,
        note: '具体的な例外を先に書いて、不明なものだけ最後に `Exception` で受ける。',
      },
      {
        title: 'カスタム例外 / with 文',
        code: `# カスタム例外
class ValidationError(Exception):
    def __init__(self, field: str, message: str):
        self.field = field
        super().__init__(f"{field}: {message}")

def validate_score(score: int) -> None:
    if not 0 <= score <= 100:
        raise ValidationError("score", "0〜100で入力してください")

# with 文: リソースを自動解放 (ファイルのcloseが不要)
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()
# with を抜けると自動で f.close() される`,
        note: 'ファイル操作は必ず `with` 文を使う。例外が発生しても確実にファイルがクローズされる。',
      },
    ],
  },
  {
    id: 'file-io',
    category: '中級',
    title: 'ファイル操作 (pathlib)',
    badge: 'os.path 卒業',
    badgeColor: 'blue',
    summary: 'os.path より pathlib.Path が現代的で読みやすい。/ 演算子でパスを結合できる。',
    tips: [
      'Path オブジェクトは / 演算子でパスを結合できる',
      'read_text() / write_text() で1行で読み書きできる',
      'glob() で特定パターンのファイルを一括取得',
    ],
    blocks: [
      {
        title: 'pathlib の基本',
        code: `from pathlib import Path

p = Path("data") / "output" / "result.txt"
home = Path.home()   # ホームディレクトリ
cwd  = Path.cwd()    # 現在のディレクトリ

p.exists()    # 存在確認
p.is_file()   # ファイルか
p.is_dir()    # ディレクトリか
p.name        # "result.txt"
p.stem        # "result"
p.suffix      # ".txt"
p.parent      # Path("data/output")

# 読み書き (1行で完結)
p.write_text("Hello!\n", encoding="utf-8")
content = p.read_text(encoding="utf-8")

# ディレクトリ作成
Path("output/logs").mkdir(parents=True, exist_ok=True)

# ファイル一覧
for f in Path(".").glob("**/*.py"):
    print(f)`,
        note: '`mkdir(parents=True, exist_ok=True)` は中間ディレクトリも一緒に作れて、既存でもエラーにならない。',
      },
    ],
  },
  {
    id: 'modules',
    category: '中級',
    title: 'モジュール・パッケージ',
    badge: 'import',
    badgeColor: 'blue',
    summary: '大きなプログラムはファイルを分割して管理する。import の仕組みを理解する。',
    tips: [
      'from X import Y で特定のものだけ取り込む',
      'import * は名前衝突の原因になるので避ける',
      '__name__ == "__main__" でスクリプト直接実行時のみ処理できる',
    ],
    blocks: [
      {
        title: 'import の書き方',
        code: `# 標準ライブラリ
import os
import sys
from pathlib import Path
from datetime import datetime

# サードパーティ
import numpy as np           # エイリアスをつける
from collections import defaultdict, Counter

# 自作モジュール
from utils import some_function
from utils import some_function as fn  # エイリアス

# よく使う標準ライブラリ
import json     # JSONの読み書き
import re       # 正規表現
import math     # 数学関数
import random   # 乱数
import time     # 時間計測`,
        note: 'import はファイルの先頭にまとめて書く。標準ライブラリ → サードパーティ → 自作の順が慣習。',
      },
      {
        title: '__name__ と __main__',
        code: `# utils.py
def add(a, b):
    return a + b

# このファイルを直接実行したときだけ動く
if __name__ == "__main__":
    print(add(1, 2))   # 3

# main.py から import したときは実行されない
# from utils import add  ← この場合 if __name__ 以下は動かない`,
        note: '`if __name__ == "__main__":` は「このファイルを直接実行したとき」を意味する。',
      },
    ],
  },
  {
    id: 'type-hints',
    category: '上級',
    title: '型ヒント完全ガイド',
    badge: 'Python 3.10+',
    badgeColor: 'purple',
    summary: '実務でのPython型ヒントは基本の str/int だけでは不十分。TypeVar・Protocol・TypedDict・Literal を使いこなすことで静的解析の恩恵を最大化できる。',
    tips: [
      '型ヒントは実行時に強制されない — mypy や pyright で静的チェックをCIに組み込む',
      'Protocol はduck typingと型安全を両立できる',
      'TypedDict はJSONやAPIレスポンスの型定義に使う',
    ],
    blocks: [
      {
        title: '基本の型ヒント',
        code: `from typing import Optional

def greet(name: str, age: int) -> str:
    return f"{name} ({age})"

# Optional: None を許容する
def find(user_id: int) -> Optional[str]:  # str | None と同じ
    ...

# Python 3.10+ の新記法
def parse(value: str | int | None) -> str:
    if value is None:
        return "N/A"
    return str(value)

def process(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}`,
        note: '`Optional[X]` は `X | None` と同じ。Python 3.10+ では `X | None` の書き方が推奨。',
      },
      {
        title: 'TypeVar / Protocol / TypedDict / Literal',
        code: `from typing import TypeVar, Protocol, TypedDict, Literal

# TypeVar: ジェネリクス (型を保持したまま返す)
T = TypeVar('T')
def first(items: list[T]) -> T:
    return items[0]

x: int = first([1, 2, 3])   # 型が保持される

# Protocol: 継承不要の構造的部分型
class Drawable(Protocol):
    def draw(self) -> None: ...

class Circle:
    def draw(self) -> None: print("○")

def render(shape: Drawable) -> None:
    shape.draw()   # Circle を渡せる

# TypedDict: 辞書の型定義
class UserDict(TypedDict):
    name: str
    age: int

# Literal: 許可する値を限定
Mode = Literal["read", "write", "append"]
def open_file(path: str, mode: Mode) -> None: ...`,
        note: 'Protocol は外部ライブラリのクラスにも後付けで型を当てられる。ABCより柔軟。',
      },
    ],
  },
  {
    id: 'dataclasses',
    category: '上級',
    title: 'dataclass と pydantic',
    badge: '実務必須',
    badgeColor: 'purple',
    summary: 'データ保持クラスを手書きするのは非効率。dataclassとpydanticを使い分けることで、ボイラープレートを排除しつつ型安全なコードを書ける。',
    tips: [
      'dataclass: 軽量・標準ライブラリ。バリデーション不要な内部データ向け',
      'pydantic: APIリクエスト/レスポンスや外部入力のバリデーション向け',
      'field(default_factory=list) を忘れるとバグになる',
    ],
    blocks: [
      {
        title: 'dataclass',
        code: `from dataclasses import dataclass, field

@dataclass
class Cafe:
    name: str
    rating: float
    tags: list[str] = field(default_factory=list)  # NG: tags: list = []

    def __post_init__(self):
        if not 0 <= self.rating <= 5:
            raise ValueError("rating must be 0-5")

@dataclass(frozen=True)   # イミュータブル + hashable
class Point:
    x: float
    y: float

@dataclass(slots=True)    # メモリ最適化 (Python 3.10+)
class Vector:
    x: float; y: float; z: float`,
        note: '`field(default_factory=list)` はリストや辞書のデフォルト値に必須。`tags: list = []` とするとインスタンス間で共有されてしまう。',
      },
      {
        title: 'pydantic v2',
        code: `from pydantic import BaseModel, Field, field_validator

class CafeModel(BaseModel):
    name: str = Field(min_length=1, max_length=100)
    rating: float = Field(gt=0, le=5)
    tags: list[str] = []
    website: str | None = None

    @field_validator('name')
    @classmethod
    def name_strip(cls, v: str) -> str:
        return v.strip()

cafe = CafeModel(name="  函館珈琲  ", rating=4.2)
print(cafe.name)          # "函館珈琲" (自動でstrip)
print(cafe.model_dump())  # 辞書に変換`,
        note: 'pydantic v2 はRustベースでv1の約5〜50倍高速。FastAPIを使うなら必ず習得する。',
      },
    ],
  },
  {
    id: 'decorators',
    category: '上級',
    title: 'デコレータ実装パターン',
    badge: '中〜上級',
    badgeColor: 'purple',
    summary: '@app.route や @property の裏側の仕組み。自前でデコレータを実装できると応用範囲が広がる。',
    tips: [
      'functools.wraps を必ず使う — ないとデバッグ時に関数名が消える',
      'スタックした場合は下から適用される',
    ],
    blocks: [
      {
        title: '基本〜引数付きデコレータ',
        code: `import functools, time
from typing import Callable, Any

def timer(func: Callable) -> Callable:
    @functools.wraps(func)   # 元の関数名を保持 (必須)
    def wrapper(*args: Any, **kwargs: Any) -> Any:
        start = time.perf_counter()
        result = func(*args, **kwargs)
        print(f"{func.__name__}: {time.perf_counter()-start:.4f}s")
        return result
    return wrapper

def retry(times: int = 3, delay: float = 1.0):
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(times):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == times - 1: raise
                    time.sleep(delay)
        return wrapper
    return decorator

@timer
@retry(times=3, delay=0.5)   # 下から適用
def fetch_data(url: str) -> dict: ...

# 標準ライブラリのキャッシュ
@functools.lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2: return n
    return fibonacci(n-1) + fibonacci(n-2)`,
        note: '`functools.wraps` がないと `func.__name__` が "wrapper" になる。デバッグやログで困るため必ず付ける。',
      },
    ],
  },
  {
    id: 'itertools-advanced',
    category: '上級',
    title: 'itertools / functools',
    badge: 'パフォーマンス',
    badgeColor: 'purple',
    summary: 'itertools はメモリを使わない遅延評価でデータを処理できる標準ライブラリ。大量データ処理で特に効果的。',
    tips: [
      'itertools は遅延評価 — リストに変換するまでメモリを消費しない',
      'groupby は事前にソートが必要',
      'partial で引数を固定した新しい関数を作れる',
    ],
    blocks: [
      {
        title: 'itertools 実務パターン',
        code: `from itertools import chain, groupby, islice

# chain: 複数イテラブルを結合
list(chain([1,2], [3,4], [5,6]))   # [1,2,3,4,5,6]

# ネストしたリストをフラット化
list(chain.from_iterable([[1,2],[3,4]]))  # [1,2,3,4]

# islice: 先頭N件だけ取り出す
def infinite():
    n = 0
    while True:
        yield n; n += 1

list(islice(infinite(), 5))  # [0,1,2,3,4]

# groupby (要事前ソート)
data = [
    {"type": "coffee", "name": "エスプレッソ"},
    {"type": "coffee", "name": "ラテ"},
    {"type": "tea",    "name": "紅茶"},
]
data.sort(key=lambda x: x["type"])
for key, group in groupby(data, key=lambda x: x["type"]):
    print(key, list(group))`,
        note: '`groupby` はソートしないと不連続なグループが別々に扱われる。必ず事前ソート。',
      },
      {
        title: 'functools 実務パターン',
        code: `from functools import reduce, partial, singledispatch

# partial: 引数を固定
def power(base, exp): return base ** exp
square = partial(power, exp=2)
print(square(5))   # 25

# reduce: リストを単一値に畳み込む
total = reduce(lambda acc, x: acc + x, [1,2,3,4,5], 0)  # 15

# singledispatch: 型に応じてディスパッチ
@singledispatch
def process(value):
    raise TypeError(f"Unsupported: {type(value)}")

@process.register(int)
def _(value: int) -> str: return f"整数: {value}"

@process.register(str)
def _(value: str) -> str: return f"文字列: {value!r}"`,
        note: '`singledispatch` は if-elif による型チェックを排除できる。型ごとの処理が増えるほど効果的。',
      },
    ],
  },
  {
    id: 'asyncio',
    category: '上級',
    title: 'asyncio 非同期処理',
    badge: 'I/O 処理',
    badgeColor: 'purple',
    summary: 'API呼び出し・DB接続などI/Oバウンドな処理で真価を発揮。CPU負荷が高い処理は multiprocessing が向いている。',
    tips: [
      'asyncio.gather で複数コルーチンを同時実行できる',
      'async 関数内で重いCPU処理をするとイベントループをブロックする',
      'Semaphore で並列実行数を制限する',
    ],
    blocks: [
      {
        title: 'asyncio の基本パターン',
        code: `import asyncio

async def fetch(url: str) -> str:
    await asyncio.sleep(1)   # I/O の模倣
    return f"Result: {url}"

# gather で並列実行
async def main():
    urls = ["https://a.com", "https://b.com", "https://c.com"]
    results = await asyncio.gather(*[fetch(url) for url in urls])
    # 3つ並列: 合計 ~1秒 (逐次なら3秒)
    print(results)

asyncio.run(main())

# Semaphore で並列数を制限 (API レート制限対策)
async def fetch_all(urls: list[str], limit: int = 5):
    sem = asyncio.Semaphore(limit)

    async def bounded(url):
        async with sem:
            return await fetch(url)

    return await asyncio.gather(*[bounded(u) for u in urls])`,
        note: '`asyncio.gather` の `return_exceptions=True` をつけると、1つ失敗しても他の結果を受け取れる。',
      },
    ],
  },
  {
    id: 'logging-advanced',
    category: '上級',
    title: 'logging の正しい使い方',
    badge: 'print 卒業',
    badgeColor: 'purple',
    summary: '実務のコードで print() デバッグは厳禁。logging を使うことでログレベル制御・ファイル出力・フォーマット統一が可能になる。',
    tips: [
      'モジュール単位で logging.getLogger(__name__) を使う',
      'basicConfig はエントリーポイント (main) でのみ呼ぶ',
      'ログメッセージには f-string でなく % 記法を使う',
    ],
    blocks: [
      {
        title: '実務的な logging 設定',
        code: `import logging, sys
from logging.handlers import RotatingFileHandler

# 各モジュールの先頭
logger = logging.getLogger(__name__)

def fetch_data(key: str) -> dict:
    logger.debug("Fetching key=%s", key)   # % 記法
    try:
        result = db.get(key)
        logger.info("Fetched: %s", result)
        return result
    except KeyError:
        logger.warning("Not found: %s", key)
        return {}
    except Exception:
        logger.exception("Unexpected error")  # スタックトレースも記録
        raise

# エントリーポイントでのみ設定
def setup_logging(level=logging.INFO):
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
        handlers=[
            logging.StreamHandler(sys.stdout),
            RotatingFileHandler("app.log", maxBytes=10*1024*1024, backupCount=5),
        ]
    )`,
        note: '`logger.exception()` はスタックトレースも自動で記録する。except ブロック内で使う。',
      },
    ],
  },
  {
    id: 'performance',
    category: '上級',
    title: 'パフォーマンス最適化',
    badge: '計測と改善',
    badgeColor: 'purple',
    summary: '最適化は必ず計測してから。勘で最適化すると逆効果になることが多い。',
    tips: [
      '最適化前に cProfile でボトルネックを特定する',
      '__slots__ は大量インスタンス生成でメモリを削減できる',
      'timeit で特定のコード片を精密計測する',
    ],
    blocks: [
      {
        title: 'プロファイリングと計測',
        code: `import cProfile, timeit, pstats, io

# timeit: コード片の速度比較
setup = "data = list(range(10000))"
t1 = timeit.timeit("[x*2 for x in data]", setup=setup, number=1000)
t2 = timeit.timeit("list(map(lambda x: x*2, data))", setup=setup, number=1000)
print(f"内包表記: {t1:.4f}s")
print(f"map:      {t2:.4f}s")

# cProfile: ボトルネック特定
def slow():
    return sum(i**2 for i in range(100_000))

pr = cProfile.Profile()
pr.enable()
slow()
pr.disable()

stream = io.StringIO()
pstats.Stats(pr, stream=stream).sort_stats("cumulative").print_stats(10)
print(stream.getvalue())`,
        note: '「ここが遅そう」の勘で最適化するのは危険。必ず cProfile で計測してから対処する。',
      },
      {
        title: '__slots__ によるメモリ最適化',
        code: `import sys

class PointNormal:
    def __init__(self, x, y):
        self.x = x; self.y = y

class PointSlotted:
    __slots__ = ("x", "y")
    def __init__(self, x, y):
        self.x = x; self.y = y

p1 = PointNormal(1.0, 2.0)
p2 = PointSlotted(1.0, 2.0)
print(sys.getsizeof(p1))   # 48 bytes
print(sys.getsizeof(p2))   # 32 bytes (約33%削減)

# dataclass(slots=True) で簡潔に (Python 3.10+)
from dataclasses import dataclass

@dataclass(slots=True)
class Vector:
    x: float; y: float; z: float

# デメリット: slots にない属性は追加できない
# p2.z = 3.0  # AttributeError`,
        note: '大量インスタンスを生成するクラスで効果大。継承と組み合わせると複雑になるため、シンプルなデータクラスに限定して使う。',
      },
    ],
  },
]

export const categories = [...new Set(sections.map(s => s.category))]
