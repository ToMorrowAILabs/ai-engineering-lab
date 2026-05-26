"""
Linear Algebra Foundations — Cosine Similarity

Computes dot product, magnitude, and cosine similarity between vectors.
Pure Python — no NumPy required (NumPy version comes in Week 6).

Run:
    python exercises/linear_algebra_foundations.py
"""

from __future__ import annotations

import math
from typing import Sequence


def dot_product(v1: Sequence[float], v2: Sequence[float]) -> float:
    if len(v1) != len(v2):
        raise ValueError("Vectors must have the same length")
    return sum(a * b for a, b in zip(v1, v2))


def magnitude(v: Sequence[float]) -> float:
    return math.sqrt(sum(x * x for x in v))


def cosine_similarity(v1: Sequence[float], v2: Sequence[float]) -> float:
    mag1 = magnitude(v1)
    mag2 = magnitude(v2)
    if mag1 == 0 or mag2 == 0:
        raise ValueError("Zero-magnitude vectors are undefined for cosine similarity")
    return dot_product(v1, v2) / (mag1 * mag2)


def main() -> None:
    # Toy 3D vectors — stand in for small embedding slices
    doc_a = [1.0, 2.0, 3.0]
    doc_b = [4.0, 5.0, 6.0]
    doc_c = [1.0, 0.0, 0.0]  # orthogonal to [0, 1, 0]

    sim_ab = cosine_similarity(doc_a, doc_b)
    sim_aa = cosine_similarity(doc_a, doc_a)
    orthogonal_a = [0.0, 1.0, 0.0]
    sim_orth = cosine_similarity(doc_c, orthogonal_a)

    print("Cosine similarity (doc_a vs doc_b):", round(sim_ab, 4))
    print("Cosine similarity (doc_a vs doc_a):", round(sim_aa, 4))
    print("Cosine similarity (orthogonal pair):", round(sim_orth, 4))

    print("\nInterpretation:")
    print("- Same direction → similarity near 1.0")
    print("- Orthogonal → similarity 0.0")
    print("- Embeddings in RAG rank chunks by this score")


if __name__ == "__main__":
    main()
