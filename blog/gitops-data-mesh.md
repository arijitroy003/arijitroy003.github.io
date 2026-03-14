---
title: Building a GitOps Data Mesh from Scratch
date: Jan 2026
preview: How we built a self-service data mesh platform at Red Hat using Snowflake, dbt, and GitOps principles.
tags: [Data Mesh, GitOps, Snowflake]
medium: https://medium.com/@arijitroy003
substack: https://substack.com/@arijitroy003
linkedin: https://linkedin.com/in/sudo-kill
---

At Red Hat, our analytics engineering team faced a familiar challenge: a sprawling legacy data stack built on Redshift and Starburst that was expensive, hard to govern, and slow to deliver new data products. We decided to rebuild from the ground up using data mesh principles — domain-oriented ownership, self-service infrastructure, and federated governance — all driven through GitOps workflows.

### The Legacy Problem

Our previous stack had grown organically over several years. Analysts waited days for new tables. Cost attribution was nearly impossible. Schema changes broke downstream consumers without warning. We needed a platform that treated data products as first-class citizens with clear ownership, contracts, and lifecycle management.

### Architecture Overview

The new platform centres on four pillars:

- **Snowflake** as the compute and storage layer, with dedicated warehouses per domain
- **dbt-core** for transformation logic, testing, and documentation — all version-controlled
- **Fivetran** for managed ingestion from 30+ SaaS sources
- **Airflow on Kubernetes** for orchestration, with GitLab CI/CD triggering deployments

### GitOps Workflow

Every data product lives in a Git repository. A merge request triggers CI validation — schema checks, dbt tests, cost estimation — before deployment. Rollbacks are a `git revert` away. This gave domain teams confidence to ship independently while platform engineers maintained guardrails.

### Governance with Atlan

We integrated Atlan as our data catalog, automatically syncing lineage from dbt and tagging PII columns. Data stewards review classification before any product goes live. This shifted governance from a bottleneck to an automated checkpoint.

### Results

Within six months we migrated 100+ data products, reduced annual infrastructure costs by over $100k, and cut average delivery time for new datasets from weeks to hours. The platform now supports self-service access for 200+ internal users across finance, marketing, and product teams.

> The key insight: data mesh is not just an architecture pattern — it's an operating model. GitOps gave us the discipline to make it work at scale.
