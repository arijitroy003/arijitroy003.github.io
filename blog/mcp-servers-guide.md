---
title: MCP Servers for AI Agents: A Practical Guide
date: Mar 2025
preview: Connecting LLMs to databases using Model Context Protocol — patterns, pitfalls, and production lessons.
tags: [MCP, Agentic AI, LLMs]
medium: https://medium.com/@arijitroy003
substack: https://substack.com/@arijitroy003
linkedin: https://linkedin.com/in/sudo-kill
---

Model Context Protocol (MCP) is an open standard that lets AI agents interact with external tools and data sources through a unified interface. After building and deploying MCP servers in production, here are the patterns and pitfalls I've encountered.

### What is MCP?

MCP defines a JSON-RPC-based protocol for exposing "tools" — callable functions with typed parameters — to language models. Instead of writing custom integrations for every LLM provider, you build one MCP server and any compatible client can use it.

### Architecture

An MCP server exposes three core primitives:

- **Tools** — Actions the agent can invoke (e.g., run a SQL query, create a ticket)
- **Resources** — Read-only data the agent can reference (e.g., schema documentation)
- **Prompts** — Reusable prompt templates for common workflows

### Building a Database MCP Server

Our server connects LLMs to Snowflake, PostgreSQL, and BigQuery. The key design decision: expose parameterized query tools rather than raw SQL execution. This constrains the agent to safe, pre-defined operations while still allowing flexible data exploration.

```json
// Example tool definition
{
  "name": "query_sales_data",
  "description": "Query sales metrics by region and date range",
  "parameters": {
    "region": { "type": "string" },
    "start_date": { "type": "string", "format": "date" },
    "end_date": { "type": "string", "format": "date" }
  }
}
```

### Production Lessons

- Always set query timeouts and row limits — agents will happily scan your entire warehouse
- Log every tool invocation for audit trails; LLM decisions need observability
- Use connection pooling; agents make bursty, concurrent requests
- Return structured errors the LLM can reason about, not stack traces

> MCP turns the "how do I connect my LLM to X" problem into a solved, standardized pattern. The hard part is designing tools that are safe, useful, and well-documented enough for an AI to use correctly.
