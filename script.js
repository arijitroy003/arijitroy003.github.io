// ─── SPA Navigation ───
const pages = ['index','experience','projects','skills','blog'];

function navigate(id) {
  event && event.preventDefault();
  pages.forEach(p => {
    document.getElementById('page-' + p).classList.remove('active');
    const navEl = document.getElementById('nav-' + p);
    if (navEl) navEl.classList.remove('active');
  });
  document.getElementById('page-' + id).classList.add('active');
  const navEl = document.getElementById('nav-' + id);
  if (navEl) navEl.classList.add('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Re-trigger fade-ups for newly shown page
  const cards = document.querySelectorAll('#page-' + id + ' .fade-up');
  cards.forEach(el => {
    el.style.animation = 'none';
    void el.offsetHeight; // trigger reflow
    el.style.animation = '';
  });

  // Ensure footer is appended
  appendFooter(id);
  
  // Trigger skills network initialization when navigating to skills page
  if (id === 'skills' && typeof initSkillsNetwork === 'function') {
    setTimeout(initSkillsNetwork, 100);
  }
}

function appendFooter(pageId) {
  // Remove any existing footer inside pages
  document.querySelectorAll('.page .page-footer').forEach(f => f.remove());

  const footer = document.createElement('footer');
  footer.className = 'page-footer';
  footer.style.cssText = 'max-width:780px;margin:48px auto 0;padding:28px 0 36px;border-top:1px solid #1a1a1a;display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:12px;';
  footer.innerHTML = `
    <div style="font-family:var(--mono);font-size:11px;color:var(--white-dim);">
      © 2026 Arijit Roy · <a href="https://github.com/arijitroy003" target="_blank" style="color:var(--white-dim);text-decoration:none;transition:color .2s;" onmouseover="this.style.color='var(--green)'" onmouseout="this.style.color='var(--white-dim)'">github</a> · <a href="https://linkedin.com/in/sudo-kill" target="_blank" style="color:var(--white-dim);text-decoration:none;transition:color .2s;" onmouseover="this.style.color='var(--green)'" onmouseout="this.style.color='var(--white-dim)'">linkedin</a>
    </div>
    <div style="font-family:var(--mono);font-size:10px;color:#3a3a3a;">bangalore, india</div>
  `;
  document.getElementById('page-' + pageId).appendChild(footer);
}

// ─── Chat UI Functions ───
function formatChatText(text) {
  return text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
}

function addMessage(text, isUser = false) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message ' + (isUser ? 'user' : 'bot');
  msg.innerHTML = formatChatText(text);
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function createStreamingBubble() {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message bot streaming';
  msg.innerHTML = '<span class="stream-cursor"></span>';
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
  return msg;
}

function showTyping() {
  const container = document.getElementById('chat-messages');
  const typing = document.createElement('div');
  typing.className = 'chat-typing';
  typing.id = 'typing-indicator';
  typing.innerHTML = '<span></span><span></span><span></span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;
}

function hideTyping() {
  const typing = document.getElementById('typing-indicator');
  if (typing) typing.remove();
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const text = input.value.trim();
  if (!text) return;
  
  addMessage(text, true);
  input.value = '';
  
  document.getElementById('chat-quick-replies').style.display = 'none';

  // Hybrid routing: rule-based responses are curated and accurate,
  // so use them for any recognized intent. Only fall through to the
  // LLM for questions the regex can't handle.
  const intent = detectIntent(text);
  if (intent !== 'fallback') {
    sendRuleBasedMessage(text, intent);
  } else if (typeof LLMChat !== 'undefined' && LLMChat.isReady()) {
    sendLLMMessage(text);
  } else {
    sendRuleBasedMessage(text, intent);
  }
}

function sendRuleBasedMessage(text, precomputedIntent) {
  showTyping();
  setTimeout(() => {
    hideTyping();
    const intent = precomputedIntent || detectIntent(text);
    const response = getResponse(intent);
    addMessage(response);
  }, 600 + Math.random() * 400);
}

async function sendLLMMessage(text) {
  const bubble = createStreamingBubble();
  const container = document.getElementById('chat-messages');
  try {
    await LLMChat.generate(text, (token, fullText) => {
      bubble.innerHTML = formatChatText(fullText) + '<span class="stream-cursor"></span>';
      container.scrollTop = container.scrollHeight;
    });
    bubble.classList.remove('streaming');
    const cursor = bubble.querySelector('.stream-cursor');
    if (cursor) cursor.remove();
  } catch (err) {
    bubble.remove();
    sendRuleBasedMessage(text, 'fallback');
  }
}

// ─── LLM Toggle ───
function toggleLLM() {
  const toggle = document.getElementById('llm-toggle');
  if (!toggle) return;

  if (typeof LLMChat === 'undefined') {
    showLLMStatus('LLM module not loaded', true);
    return;
  }

  if (LLMChat.isReady()) return;
  if (LLMChat.isLoading()) return;

  if (!LLMChat.checkWebGPUSupport()) {
    showLLMStatus('WebGPU not supported in this browser', true);
    toggle.disabled = true;
    return;
  }

  toggle.disabled = true;
  toggle.textContent = 'loading...';

  const progressBar = document.getElementById('llm-progress');
  const progressFill = document.getElementById('llm-progress-fill');
  if (progressBar) progressBar.style.display = 'block';

  LLMChat.initEngine((progress) => {
    const pct = Math.round((progress.progress || 0) * 100);
    if (progressFill) progressFill.style.width = pct + '%';
    toggle.textContent = 'loading ' + pct + '%';
  }).then(() => {
    if (progressBar) progressBar.style.display = 'none';
    toggle.textContent = 'AI on';
    toggle.classList.add('active');
    toggle.disabled = false;
    updateChatHeader(true);
    addMessage("AI mode enabled! I'll use curated answers for common topics and the LLM for freeform questions I don't have a scripted response for.");
  }).catch((err) => {
    if (progressBar) progressBar.style.display = 'none';
    toggle.textContent = 'enable AI';
    toggle.disabled = false;
    showLLMStatus('Failed to load AI model: ' + err.message, true);
  });
}

function showLLMStatus(message, isError) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message bot' + (isError ? ' llm-error' : '');
  msg.innerHTML = formatChatText(message);
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

function updateChatHeader(llmActive) {
  const title = document.getElementById('chat-header-title');
  if (!title) return;
  title.textContent = llmActive
    ? 'AI-Powered Assistant (SmolLM2 · runs in your browser)'
    : 'Talk to my AI Assistant (!Warning: I\'m not very smart)';
}

function sendQuickReply(topic) {
  const questions = {
    experience: "Tell me about your work experience",
    skills: "What are your technical skills?",
    projects: "What projects have you worked on?",
    contact: "How can I contact you?"
  };
  document.getElementById('chat-input').value = questions[topic];
  sendMessage();
}

function handleChatKeypress(e) {
  if (e.key === 'Enter') sendMessage();
}

// ─── Article Modal (close only; open handled by blog.js) ───
function closeArticle(e, force) {
  var overlay = document.getElementById('article-overlay');
  if (!overlay) return;
  if (force || (e && e.target === overlay)) {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
}

document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeArticle(null, true);
});

// ─── Initialize ───
// Init footer on home page
appendFooter('index');
