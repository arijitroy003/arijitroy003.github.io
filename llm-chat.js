// ─── Browser LLM Chat (WebLLM Integration) ───
// Provides optional LLM-powered responses via WebGPU.
// Falls back gracefully to the rule-based chatbot when unavailable.

const LLMChat = (() => {
  const MODEL_ID = 'SmolLM2-135M-Instruct-q0f32-MLC';
  const MAX_HISTORY = 6;
  const CDN_URL = 'https://esm.run/@mlc-ai/web-llm';

  let engine = null;
  let ready = false;
  let loading = false;
  let webllm = null;
  let conversationHistory = [];

  function checkWebGPUSupport() {
    return !!navigator.gpu;
  }

  function buildSystemPrompt() {
    const kb = window.knowledgeBase;
    if (!kb) return 'You are a helpful portfolio assistant.';

    const a = kb.about;
    const exp = kb.experience.map(e =>
      `- ${e.company} (${e.period}): ${e.role}. ${e.highlights.join('; ')}`
    ).join('\n');

    const skills = Object.entries(kb.skills)
      .map(([cat, items]) => `${cat}: ${items.join(', ')}`)
      .join('\n');

    const edu = kb.education
      .map(e => `${e.school} - ${e.degree} (GPA: ${e.gpa}, ${e.period})`)
      .join('; ');

    return [
      `You are ${a.name}'s AI portfolio assistant. Be witty, concise, and personable.`,
      `Answer ONLY using the facts below. Never invent information.\n`,
      `NAME: ${a.name} | ROLE: ${a.role} | EXPERIENCE: ${a.experience} | LOCATION: ${a.location}`,
      `EMAIL: ${a.email} | GITHUB: ${a.github} | LINKEDIN: ${a.linkedin}\n`,
      `WORK HISTORY:\n${exp}\n`,
      `SKILLS:\n${skills}\n`,
      `EDUCATION: ${edu}\n`,
      `PROJECTS: ${kb.projects.join('; ')}\n`,
      `Keep answers to 2-4 sentences. Use humor sparingly. If asked about something not listed, say you don't have that info.`
    ].join('\n');
  }

  async function loadWebLLM() {
    if (webllm) return webllm;
    webllm = await import(CDN_URL);
    return webllm;
  }

  async function initEngine(onProgress) {
    if (ready || loading) return;
    if (!checkWebGPUSupport()) {
      throw new Error('WebGPU not supported');
    }

    loading = true;
    try {
      const lib = await loadWebLLM();
      engine = await lib.CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (progress) => {
          if (onProgress) onProgress(progress);
        }
      });
      ready = true;
    } catch (err) {
      engine = null;
      ready = false;
      throw err;
    } finally {
      loading = false;
    }
  }

  function isReady() {
    return ready && engine !== null;
  }

  function isLoading() {
    return loading;
  }

  function hasWebGPU() {
    return checkWebGPUSupport();
  }

  function trimHistory() {
    if (conversationHistory.length > MAX_HISTORY) {
      conversationHistory = conversationHistory.slice(-MAX_HISTORY);
    }
  }

  async function generate(userMessage, onToken) {
    if (!isReady()) throw new Error('LLM engine not ready');

    conversationHistory.push({ role: 'user', content: userMessage });
    trimHistory();

    const messages = [
      { role: 'system', content: buildSystemPrompt() },
      ...conversationHistory
    ];

    let fullResponse = '';

    const chunks = await engine.chat.completions.create({
      messages,
      temperature: 0.7,
      max_tokens: 256,
      stream: true,
    });

    for await (const chunk of chunks) {
      const token = chunk.choices[0]?.delta?.content || '';
      fullResponse += token;
      if (onToken) onToken(token, fullResponse);
    }

    conversationHistory.push({ role: 'assistant', content: fullResponse });
    trimHistory();

    return fullResponse;
  }

  function resetHistory() {
    conversationHistory = [];
  }

  return {
    checkWebGPUSupport: hasWebGPU,
    initEngine,
    generate,
    isReady,
    isLoading,
    resetHistory,
  };
})();
