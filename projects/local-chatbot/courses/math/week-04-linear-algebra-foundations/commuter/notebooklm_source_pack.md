# Linear Algebra Foundations — NotebookLM Source Pack

Paste manually into NotebookLM. Generate Audio Overview in the UI.

**Do not automate Google or NotebookLM login.**

---

## Source: Lesson Overview

Linear algebra foundations for AI engineering focus on vectors, dot products, magnitude, and cosine similarity. These operations power embeddings, similarity search, and attention mechanisms.

A vector is an ordered list of numbers — in AI, often hundreds or thousands of dimensions. An embedding model maps text like "refund policy" into such a vector. Similar meanings produce vectors pointing in similar directions.

The dot product multiplies corresponding elements and sums them. It relates to how much one vector projects onto another. Magnitude is the vector length from the Pythagorean theorem in n dimensions. Cosine similarity divides dot product by the product of magnitudes, measuring angle not length — ideal when embeddings vary in scale.

The exercise implements dot_product, magnitude, and cosine_similarity in pure Python. It compares two sample vectors, verifies self-similarity is 1.0, and shows orthogonal vectors score 0.0. This is the same math vector databases use to rank RAG chunks.

## Source: Key Terms Glossary

| Term | Definition |
|------|------------|
| Vector | Ordered list of numbers representing position or direction |
| Dot product | Σ (aᵢ × bᵢ) — algebraic similarity measure |
| Magnitude | Vector length √(Σ xᵢ²) |
| Cosine similarity | dot(a,b) / (‖a‖ × ‖b‖), in [-1, 1] for real embeddings often [0, 1] |
| Embedding | Dense vector representation of semantic content |
| Orthogonal | Vectors at 90° — dot product zero, cosine similarity zero |

## Source: Exercise Walkthrough

The script defines three functions without NumPy to build intuition. doc_a and doc_b are parallel-like 3D vectors yielding high cosine similarity. doc_a compared to itself returns exactly 1.0. doc_c [1,0,0] and [0,1,0] are orthogonal — cosine 0.0. main prints rounded scores and interpretation lines linking to RAG ranking.

In production, embeddings have 384–3072 dimensions; the formula is identical. Week 6 NumPy replaces Python loops with vectorized ops for speed.

## Source: Common Mistakes

1. Confusing dot product with cosine — long vectors inflate dot product; cosine normalizes.
2. Forgetting zero vectors — division by zero magnitude is undefined; handle edge cases.
3. Length mismatch — dot product requires equal-length vectors; embedding models enforce this.
4. Assuming high similarity means truth — semantic similarity ≠ factual correctness.

## Source: AI Engineering Connection

RAG pipelines embed queries and documents, then retrieve top-k by cosine similarity. Duplicate ticket detection compares support message embeddings. Clustering customer feedback groups similar vectors. Transformer attention computes weighted dot products between queries and keys. Every LLM engineer eventually debugs "why did retrieval miss the right chunk?" — the answer is often vector math, chunking, or normalization — not the LLM alone.

---

## NotebookLM Instructions (Manual)

1. Sign in at https://notebooklm.google.com/
2. New notebook: **Linear Algebra Foundations**
3. Paste each `## Source:` section as text sources
4. Generate Audio Overview
5. Complete `review_questions.md`
