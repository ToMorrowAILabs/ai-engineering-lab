# ML Course Math Overlay

This overlay updates the ML Course so the math library supports the AI Engineering roadmap without turning the course into a theory-first program.

## Operating principle

Build first, study math when a build checkpoint exposes a gap. Math is used as reinforcement for LLM fundamentals, RAG, agents, inference, and evaluation—not as a prerequisite gate.

## Source folder

`/Volumes/AI_MODELS/AI_LIBRARY/math/pdfs`

## Current library snapshot

- Generated: `2026-06-08T23:36:05+00:00`
- PDFs scanned: **14**
- New PDFs since last refresh: **0**
- Changed PDFs since last refresh: **0**
- Removed PDFs since last refresh: **0**

## Priority buckets

- **tier_1_core_math**: 4
- **tier_2_ml_support**: 10

## Topic buckets

- **Calculus and optimization for gradients, backprop, training intuition**: 2
- **Linear algebra for tensors, embeddings, attention, PCA/SVD**: 1
- **Core machine learning and deep learning references**: 10
- **Probability and statistics for evals, uncertainty, experimentation**: 1

## Course integration

### Track 1 - LLM Fundamentals

- Linear algebra: vectors, matrices, dot products, norms, eigen/SVD, tensor shapes.
- Calculus/optimization: gradients, chain rule, backprop, loss surfaces.
- Information theory: entropy, cross-entropy, KL divergence, perplexity.
- Transformer math: attention as scaled dot-product retrieval over learned representations.

### Track 2 - RAG & Retrieval

- Embeddings: vector spaces, cosine similarity, nearest-neighbor retrieval.
- Probability/statistics: ranking quality, recall/precision, confidence, sampling.
- Linear algebra: sparse vs dense retrieval, matrix operations behind vector search.

### Track 3 - AI Agents

- Probability/statistics: decision thresholds, confidence, tool-selection reliability.
- Optimization: cost/latency/reliability tradeoffs in planning and routing.

### Track 4 - Hardware & Inference

- Linear algebra: matrix multiplication, quantization, tensor cores, attention kernels.
- Numerical methods: precision, stability, FP16/BF16/FP8 tradeoffs.

### Track 5 - Security & Evaluation

- Statistics: eval design, sampling, confidence intervals, significance testing.
- Probability: calibration, false positives/negatives, regression testing.

## Weekly refresh rule

1. Scan the folder for new, changed, and removed PDFs.
2. Rebuild the catalog and this overlay.
3. Promote new PDFs into one of three buckets: `tier_1_core_math`, `tier_2_ml_support`, or `tier_3_reference`.
4. Add only Tier 1/Tier 2 items to active study. Keep Tier 3 as lookup material.
5. If a new PDF overlaps an existing stronger resource, keep it in reference unless it directly improves a current checkpoint.

## Practical study cadence

- 20-30 minutes before build sessions: review only the math needed for that day’s implementation.
- 45-60 minutes once per week: clean up notes from the catalog and connect formulas to code examples.
- Do not pause the AI Engineering build roadmap to finish a full textbook unless a checkpoint repeatedly fails because of that concept.

