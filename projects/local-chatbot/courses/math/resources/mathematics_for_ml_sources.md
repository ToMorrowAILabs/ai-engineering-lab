# Mathematics for ML — Curated Source Index

Primary index: [dair-ai/Mathematics-for-ML](https://github.com/dair-ai/Mathematics-for-ML)

Each entry is classified for the ingestion pipeline. **Do not scrape or bypass paywalls.**

| ID | Title | Authors | URL | source_type | copyright_status | download_allowed |
|----|-------|---------|-----|-------------|------------------|------------------|
| `gallier-math-deep` | Algebra, Topology, Differential Calculus, and Optimization | Jean Gallier & Jocelyn Quaintance | https://www.cis.upenn.edu/~jean/math-deep.pdf | open_pdf | open_access | yes |
| `dlbook-part-basics` | Applied Math and ML Basics (Deep Learning book) | Goodfellow, Bengio, Courville | https://www.deeplearningbook.org/contents/part_basics.html | web_book | web_free | no |
| `mml-book` | Mathematics for Machine Learning | Deisenroth, Faisal, Ong | https://mml-book.github.io | web_book | open_access | no |
| `pml-book-1` | Probabilistic Machine Learning: An Introduction | Kevin Murphy | https://probml.github.io/pml-book/book1.html | web_book | web_free | no |
| `d2l-math-appendix` | Mathematics for Deep Learning (D2L appendix) | Werness, Hu et al. | https://d2l.ai/chapter_appendix-mathematics-for-deep-learning/index.html | web_book | open_access | no |
| `deeplearningmath` | Mathematical Engineering of Deep Learning | Liquet, Moka, Nazarathy | https://deeplearningmath.org | web_book | web_free | no |
| `bayes-rules` | Bayes Rules! | Johnson, Ott, Dogucu | https://www.bayesrulesbook.com/index.html | web_book | open_access | no |
| `esl-book` | The Elements of Statistical Learning | Hastie, Tibshirani, Friedman | https://hastie.su.domains/ElemStatLearn/ | web_book | web_free | no |
| `isl-book` | An Introduction to Statistical Learning | James et al. | https://www.statlearning.com/ | web_book | web_free | no |
| `jaynes-probability` | Probability Theory: The Logic of Science | E. T. Jaynes | https://bayes.wustl.edu/etj/prob/book.pdf | open_pdf | open_access | yes |
| `mackay-itila` | Information Theory, Inference and Learning Algorithms | David MacKay | https://www.inference.org.uk/itprnn/book.html | web_book | open_access | no |
| `arxiv-matrix-calculus` | The Matrix Calculus You Need For Deep Learning | Parr & Howard | https://arxiv.org/abs/1802.01528 | paper | open_access | yes |
| `arxiv-math-of-ai` | The Mathematics of AI | Gitta Kutyniok | https://arxiv.org/pdf/2203.08890.pdf | paper | open_access | yes |
| `imperial-multivariate-calc` | Multivariate Calculus (Imperial / Coursera) | Cooper & Dye | https://www.youtube.com/playlist?list=PLiiljHvN6z193BBzS0Ln8NnqQmzimTW23 | video_playlist | reference | no |
| `imperial-linear-algebra` | Mathematics for ML — Linear Algebra | Cooper & Dye | https://www.youtube.com/playlist?list=PLiiljHvN6z1_o1ztXTKWPrShrMrBLo5P3 | video_playlist | reference | no |
| `cs229-ml` | CS229: Machine Learning | Anand Avati | https://www.youtube.com/playlist?list=PLoROMvodv4rNH7qL6-efu_q2_bPuy0adh | course | reference | no |
| `khan-stats-probability` | Statistics and Probability | Khan Academy | https://www.khanacademy.org/math/statistics-probability | course | reference | no |
| `axler-ladr` | Linear Algebra Done Right (lectures) | Sheldon Axler | https://linear.axler.net/LADRvideos.html | course | reference | no |
| `khan-linear-algebra` | Linear Algebra | Khan Academy | https://www.khanacademy.org/math/linear-algebra | course | reference | no |
| `khan-calculus` | Calculus | Khan Academy | https://www.khanacademy.org/math/calculus-home | course | reference | no |

## Source Type Legend

| Type | Meaning |
|------|---------|
| `open_pdf` | Direct PDF URL, open access |
| `web_book` | Free online book (HTML) |
| `video_playlist` | YouTube or similar — link only |
| `paper` | arXiv or open preprint |
| `course` | Structured course or lecture series |
| `reference` | External link for manual study |

## Ingestion

Run the pipeline (dry-run by default):

```bash
python automation/scripts/ingest_math_resources.py
python automation/scripts/ingest_math_resources.py --download   # open PDFs only
python automation/scripts/ingest_math_resources.py --generate-queues
```

Updates: `ingestion_manifest.json`, `resource_metadata_index.json`, and queue directories.
