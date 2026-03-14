---
title: "Vector Databases in Production: Lessons from 120M Users"
date: Sep 2024
preview: Real-world experiences deploying Milvus and Chroma for semantic search at scale on Tata Neu.
tags: [Vector DB, Semantic Search, Scale]
medium: https://medium.com/@arijitroy003
substack: https://substack.com/@arijitroy003
linkedin: https://linkedin.com/in/sudo-kill
---

When we built the GenAI product search engine for Tata Neu, we needed semantic search that could handle 120M+ users across thousands of product categories. Here's what we learned deploying Milvus and Chroma at scale.

### Why Vector Search?

Traditional keyword search fails when users describe products in natural language — "comfortable shoes for standing all day" won't match a product titled "ergonomic memory foam sneakers." Vector embeddings capture semantic meaning, enabling results that match intent rather than exact terms.

### Embedding Pipeline

We used Azure OpenAI's embedding models to vectorize product catalogs nightly. Each product generated a 1536-dimensional embedding from its title, description, category, and attributes. The pipeline processes ~2M products in under 3 hours using batch APIs and parallel workers.

### Choosing Between Milvus and Chroma

- **Milvus** — Production-grade, distributed, handles billions of vectors. We used it for the main search workload with IVF_FLAT indexing.
- **Chroma** — Lightweight, great for prototyping and smaller auxiliary indices (e.g., FAQ matching). Ran in-process for the recommendation sidecar.

### Performance Tuning

The biggest wins came from:

- Pre-filtering by category before vector search (hybrid approach) — reduced search space 10x
- Quantization from float32 to int8 — halved memory usage with minimal recall loss
- Caching hot queries — 60% of searches are repeated within an hour

### Pitfalls

Embedding drift is real. As product catalogs change, embeddings from three months ago may not align with fresh ones. We retrain and re-index weekly. Also, vector search alone isn't enough — we combine it with BM25 keyword scores in a reciprocal rank fusion for the best results.

> Vector databases are powerful but not magic. The quality of your embeddings matters far more than the choice of vector DB. Invest in your embedding pipeline first.
