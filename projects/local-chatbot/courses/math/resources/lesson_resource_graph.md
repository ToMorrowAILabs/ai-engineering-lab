# Lesson–Resource Graph

Visual map of how math lessons connect to curated resources and remediation paths.

```mermaid
flowchart TB
    subgraph foundations ["Foundations ~70%"]
        LA[linear_algebra<br/>week-04 anchor]
        CALC[calculus]
        PROB[probability]
        STAT[statistics<br/>week-05]
        OPT[optimization]
    end

    subgraph applied ["Applied ~20%"]
        EMB[embeddings]
        EX[exercise_suggestion<br/>from manifest]
    end

    subgraph frontier ["Frontier scan ~10%"]
        TR[transformers]
        ARX[arxiv-math-of-ai]
        ESL[esl-book]
    end

    LA --> EMB
    LA --> OPT
    CALC --> OPT
    PROB --> STAT
    STAT --> EMB
    OPT --> TR
    EMB --> TR

    subgraph resources_la [Linear Algebra Resources]
        MML[mml-book]
        IMP_LA[imperial-linear-algebra]
        KHAN_LA[khan-linear-algebra]
        AXLER[axler-ladr]
    end

    subgraph resources_calc [Calculus Resources]
        IMP_CALC[imperial-multivariate-calc]
        KHAN_CAL[khan-calculus]
        ARX_MC[arxiv-matrix-calculus]
        GALL[gallier-math-deep]
    end

    subgraph resources_stat [Statistics / Probability]
        ISL[isl-book]
        BAYES[bayes-rules]
        KHAN_SP[khan-stats-probability]
        JAYNES[jaynes-probability]
    end

    LA --- MML
    LA --- IMP_LA
    LA --- KHAN_LA
    LA --- AXLER

    CALC --- IMP_CALC
    CALC --- KHAN_CAL
    CALC --- ARX_MC
    OPT --- ARX_MC
    OPT --- GALL

    PROB --- BAYES
    PROB --- KHAN_SP
    STAT --- ISL
    STAT --- KHAN_SP
    PROB -.-> JAYNES

    EMB --- MML
    EMB --- MACK[mackay-itila]

    TR --- DLM[deeplearningmath]
    TR --- ARX
    TR -.-> ESL

    LA --> EX
    CALC --> EX
    STAT --> EX
    EMB --> EX
```

## Weakness Remediation Edges

When a learner tags a weakness, follow the edge to the highest-priority resource:

| Weakness tag | First resource | Commute alt | Open PDF |
|--------------|----------------|-------------|----------|
| `dot_product` | `khan-linear-algebra` | `imperial-linear-algebra` | — |
| `matrix_multiply` | `mml-book` | `imperial-linear-algebra` | `arxiv-matrix-calculus` |
| `chain_rule` | `imperial-multivariate-calc` | same | — |
| `jacobian` | `imperial-multivariate-calc` | — | `arxiv-matrix-calculus` |
| `mean_variance` | `khan-stats-probability` | same | — |
| `conditional_probability` | `bayes-rules` | `khan-stats-probability` | — |
| `gradient_descent` | `imperial-multivariate-calc` | — | `arxiv-matrix-calculus` |
| `entropy` | `mackay-itila` | — | — |
| `attention_derivation` | `deeplearningmath` | — | `arxiv-math-of-ai` |

## Course Week Alignment (Month 1)

```
week-04-linear-algebra-foundations ──► linear_algebra ──► mml-book, khan-linear-algebra, imperial-linear-algebra
week-05-statistics (scaffold)        ──► statistics, probability ──► isl-book, khan-stats-probability, bayes-rules
week-06-numpy-pandas (scaffold)      ──► embeddings (bridge) ──► mml-book, exercise packs
Month 2+                             ──► calculus, optimization, transformers
```

## Storage Flow

```
dair-ai/Mathematics-for-ML (index)
        │
        ▼
ingest_math_resources.py
        │
        ├──► ingestion_manifest.json (repo)
        ├──► resource_metadata_index.json (repo)
        │
        ├──► [open PDFs only] ──► /Volumes/AI_MODELS/AI_LIBRARY/math/pdfs/
        │                              │
        │                              ▼
        │                    calibre_import_queue/ (repo staging metadata)
        │                              │
        │                              ▼ manual
        │                    /Volumes/AI_MODELS/AI_LIBRARY/calibre-library/
        │
        ├──► notebooklm_pack_queue/ (repo)
        │         └── manual paste ──► NotebookLM Audio Overview
        │
        └──► commuter_review_queue/ (repo)
                  └── manual review on commute
```

## Metadata Fields (all resources)

| Field | Purpose |
|-------|---------|
| `lesson` | Primary lesson slug(s) |
| `topic` | Human topic label |
| `difficulty` | beginner / intermediate / advanced |
| `reinforcement_priority` | high / medium / low |
| `commute_friendly` | Suitable for audio/video commute |
| `source_type` | open_pdf, web_book, paper, course, video_playlist, reference |
| `copyright_status` | open_access, web_free, reference, commercial_web |
| `local_path` | Path under AI_LIBRARY after download |
| `weakness_tags` | Remediation lookup keys |
