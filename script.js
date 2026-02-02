// ─── SPA Navigation ───
const pages = ['index','experience','projects','skills'];

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
function addMessage(text, isUser = false) {
  const container = document.getElementById('chat-messages');
  const msg = document.createElement('div');
  msg.className = 'chat-message ' + (isUser ? 'user' : 'bot');
  msg.innerHTML = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
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
  
  // Hide quick replies after first message
  document.getElementById('chat-quick-replies').style.display = 'none';
  
  showTyping();
  
  setTimeout(() => {
    hideTyping();
    const intent = detectIntent(text);
    const response = getResponse(intent);
    addMessage(response);
  }, 600 + Math.random() * 400);
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

// ─── Initialize ───
// Init footer on home page
appendFooter('index');
