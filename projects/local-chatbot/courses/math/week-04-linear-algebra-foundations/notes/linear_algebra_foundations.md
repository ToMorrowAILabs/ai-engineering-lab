# Linear Algebra Foundations for AI Engineering

## Lesson Goal

Understand vectors, dot products, magnitude, and cosine similarity — and implement cosine similarity in Python so you can explain how embedding search and RAG retrieval compare meaning numerically.

## Core Concepts

- **Scalars** — single numbers (temperature, loss value, learning rate)
- **Vectors** — ordered lists of numbers representing a point or direction in space
- **Matrices** — grids of numbers; rows of embeddings form a matrix
- **Dot product** — sum of element-wise products; related to projection and similarity
- **Magnitude (norm)** — vector length: √(Σ xᵢ²)
- **Cosine similarity** — dot product divided by product of magnitudes; range −1 to 1 (1 = same direction)
- **Embeddings** — high-dimensional vectors encoding semantic meaning of text, code, or images

## AI Engineering Connection

Embeddings convert language into vectors. When you ask a RAG system a question, your query is embedded and compared against document vectors — usually with cosine similarity or dot product on normalized vectors. Recommendation systems, duplicate detection, and clustering use the same math. Neural networks are layers of matrix multiplications; attention scores involve dot products between query and key vectors. Linear algebra is not optional background — it is the operating system of modern AI.

## Coding Exercise

**File:** `exercises/linear_algebra_foundations.py`

Implement and run a **cosine similarity calculator** that:

1. Defines `dot_product(v1, v2)`, `magnitude(v)`, and `cosine_similarity(v1, v2)`
2. Compares two word-like vectors (provided) and prints similarity
3. Compares a vector to itself (should be 1.0) and to an orthogonal vector (should be 0.0)

```bash
cd courses/math/week-04-linear-algebra-foundations
python exercises/linear_algebra_foundations.py
```

No external dependencies — standard library `math` only.

## Quiz

See `quizzes/linear_algebra_foundations_quiz.md`.

## Reflection

Explain why cosine similarity is often preferred over raw dot product when comparing embedding vectors of different lengths. Give one RAG scenario where a high cosine score would mean "retrieve this chunk."

**Your answer:**

_(Write here or in the quiz file.)_

## Commuter Reinforcement

See `commuter/` for curated resources, NotebookLM source pack, audio overview prompt, and review questions.

## Git Checkpoint

```bash
git add courses/math/week-04-linear-algebra-foundations/
git commit -m "Complete linear algebra foundations — cosine similarity for embeddings"
git log --oneline -3
```

**Checkpoint question:** In one sentence, how does cosine similarity connect a math formula to a vector database search?
