# Lesson-to-Resource Map

Maps AI Engineering Lab math lessons to curated resources from [dair-ai/Mathematics-for-ML](https://github.com/dair-ai/Mathematics-for-ML).

**Curriculum tier:** ~70% foundations · ~20% applied (exercises) · ~10% frontier scan

| Lesson | Course folder | Primary resources | Commute-friendly | Weakness remediation |
|--------|---------------|-------------------|------------------|----------------------|
| **linear_algebra** | `week-04-linear-algebra-foundations/` | `mml-book`, `imperial-linear-algebra`, `khan-linear-algebra` | Imperial playlist, Khan | `dot_product`, `matrix_multiply`, `vectors` |
| **calculus** | Month 2+ / ML track | `imperial-multivariate-calc`, `khan-calculus`, `arxiv-matrix-calculus` | Imperial, Khan | `chain_rule`, `jacobian`, `gradients` |
| **probability** | `week-05-statistics/` (partial) | `bayes-rules`, `khan-stats-probability`, `dlbook-part-basics` | Khan | `conditional_probability`, `bayes_theorem` |
| **statistics** | `week-05-statistics/` | `isl-book`, `khan-stats-probability`, `mml-book` | Khan | `mean_variance`, `distributions`, `regression_basics` |
| **optimization** | Month 2+ | `gallier-math-deep`, `arxiv-matrix-calculus`, `mml-book` | — | `gradient_descent`, `matrix_calculus`, `backprop` |
| **embeddings** | Month 2+ LLM track | `mml-book`, `imperial-linear-algebra`, `mackay-itila` | Imperial | `cosine_similarity`, `entropy`, `kl_divergence` |
| **transformers** | Month 3+ (frontier scan) | `deeplearningmath`, `arxiv-math-of-ai` | — | `attention_derivation`, `transformer_math` |

## Lesson Details

### linear_algebra

- **Anchor lesson:** `courses/math/week-04-linear-algebra-foundations/`
- **Primary:** `mml-book` (notation), `khan-linear-algebra` (beginner)
- **Commute:** `imperial-linear-algebra` playlist
- **Open PDF:** `arxiv-matrix-calculus` (matrix ops for DL)
- **Exercise:** Week 04 cosine similarity + MML exercises 3.x

### calculus

- **Primary:** `imperial-multivariate-calc`, `d2l-math-appendix`
- **Commute:** Imperial multivariate playlist
- **Open PDF:** `arxiv-matrix-calculus`, `gallier-math-deep` (advanced)
- **Exercise:** Jacobian of a vector function; finite-diff gradient check

### probability

- **Primary:** `bayes-rules`, `pml-book-1` (reference)
- **Commute:** Khan statistics unit on probability
- **Open PDF:** `jaynes-probability` (frontier / deep dive only)
- **Exercise:** Bayes theorem word problem coded in Python

### statistics

- **Primary:** `isl-book`, `khan-stats-probability`
- **Reference:** `esl-book` (frontier scan)
- **Exercise:** Descriptive stats on CSV; histogram + mean/variance

### optimization

- **Primary:** `arxiv-matrix-calculus`, `mml-book` Ch. 7
- **Open PDF:** `gallier-math-deep` (optimization chapters)
- **Exercise:** Gradient descent on quadratic loss; plot loss curve

### embeddings

- **Primary:** `mml-book` (inner products), `mackay-itila` (information)
- **Bridge from:** week-04 linear algebra anchor
- **Exercise:** Cosine similarity batch over embedding matrix (NumPy, Week 6)

### transformers

- **Tier:** frontier_scan (10%)
- **Primary:** `deeplearningmath`, `arxiv-math-of-ai`
- **No auto-download beyond arXiv survey**
- **Exercise:** Write QKᵀ/√d attention formula; label each tensor shape

## Weakness Remediation Workflow

1. Identify weakness tag from quiz or self-assessment (e.g. `dot_product`).
2. Look up tag in `resource_metadata_index.json` → `weakness_tags`.
3. Pick highest `reinforcement_priority` resource that is `commute_friendly` if commuting.
4. Queue NotebookLM pack from `notebooklm_pack_queue/{resource_id}.md`.
5. Complete `commuter_review_queue/{resource_id}.json` review questions.

## Related Files

- `ingestion_manifest.json` — full resource registry
- `resource_metadata_index.json` — flat index with all metadata fields
- `lesson_resource_graph.md` — visual dependency graph
- `automation/scripts/ingest_math_resources.py` — pipeline runner
