// ─── Knowledge Base ───
// Portfolio data and chatbot responses

const knowledgeBase = {
  about: {
    name: "Arijit Kumar Roy",
    role: "Data & AI Engineer",
    experience: "7+ years",
    location: "Bangalore, India",
    email: "arijitroy003@gmail.com",
    github: "arijitroy003",
    linkedin: "sudo-kill"
  },
  experience: [
    {
      company: "Red Hat",
      role: "Senior Software Engineer — Data & AI",
      period: "Apr 2024 — Present",
      highlights: ["Built self-service GitOps data mesh platform with Snowflake, dbt, Fivetran, Airflow", "Achieved $100k+ annual cost reduction", "Working on MCP servers for Data Analytics Agents and Agentic AI frameworks", "AI observability tooling with Langfuse"]
    },
    {
      company: "Beem",
      role: "Senior Data Engineer",
      period: "Nov 2023 — Mar 2024",
      highlights: ["Built LLM-powered Data & AI platform serving 50M+ users", "Contributed to investor pitches securing Databricks funding", "ETL workflows processing 500 GB daily"]
    },
    {
      company: "Tata Digital (Tata Neu)",
      role: "Senior Software Engineer",
      period: "Aug 2021 — Oct 2023",
      highlights: ["Built Conversational AI platform serving 120M+ users", "Developed GenAI product search using Azure OpenAI, LangChain, vector DBs", "Led team migrating to Delta Lake, reduced latency 75% & cost 80%"]
    },
    {
      company: "Gnosis Lab",
      role: "Founding Engineer",
      period: "Jun 2019 — May 2021",
      highlights: ["NASSCOM 10K Startups", "Built AI bot for SaaS platform", "Full MEAN Stack application with 50+ backend APIs"]
    }
  ],
  skills: {
    languages: ["Python", "Golang", "SQL", "JavaScript", "TypeScript", "Scala", "Shell"],
    cloud: ["AWS", "Azure", "GCP", "Kubernetes", "Docker", "Terraform", "GitOps"],
    data: ["Snowflake", "Databricks", "PySpark", "Delta Lake", "dbt", "Airflow", "Kafka", "Fivetran"],
    ai: ["LangChain", "Vector DBs (Milvus, Chroma, Qdrant)", "OpenAI", "Claude", "Mistral", "Azure OpenAI", "Agentic AI", "MCP Servers"],
    databases: ["MongoDB", "DynamoDB", "BigQuery", "Firebase", "Kusto"]
  },
  education: [
    { school: "Jadavpur University", degree: "Masters in Computer Applications", gpa: "8.81/10", period: "2018-2021" },
    { school: "Ramakrishna Mission Vidyamandira", degree: "B.Sc. Computer Science", gpa: "8.49/10", period: "2015-2018" }
  ],
  projects: [
    "GitOps Data Mesh Platform at Red Hat",
    "GenAI Product Search Engine at Tata Neu",
    "Conversational AI Data Platform at Tata Neu",
    "LLM-Powered Personal Finance Platform at Beem",
    "Clinical Management Software (Freelance)"
  ]
};

// ─── Chatbot Responses ───
const responses = {
  greeting: [
    "Well hello there, fellow human! I'm Arijit's digital doppelganger. Think J.A.R.V.I.S., but with more data pipelines and fewer billion-dollar suits. What can I tell you about?",
    "Hey! I'm the AI version of Arijit - same knowledge, 100% less coffee dependency. Ask me anything about his work, skills, or why he thinks tabs are superior to spaces. (Just kidding... or am I?)",
    "*beep boop* Just kidding, I'm not that kind of bot. I'm here to chat about Arijit's experience in Data & AI. Fire away!"
  ],
  experience: () => {
    const exp = knowledgeBase.experience;
    return `Ah, the career retrospective! Like a Marvel timeline, but with more YAML files.\n\n` +
      `**The Journey So Far (${knowledgeBase.about.experience}):**\n\n` +
      `Currently at **${exp[0].company}** - yes, THE Red Hat. Before that, helped people manage money at **${exp[1].company}**, built things for 120M+ users at **${exp[2].company}** (no pressure), and started as a Founding Engineer at **${exp[3].company}** where I learned that \"full-stack\" means \"you fix everything.\"\n\n` +
      `Plot twist: I actually enjoy debugging production issues at 2 AM. (Send help.)`;
  },
  redhat: () => {
    return `**Red Hat** (Apr 2024 — Present) - Where I finally get to wear the fedora. Well, metaphorically.\n\n` +
      `• Built a GitOps data mesh platform - it's like SimCity but for data pipelines\n` +
      `• Saved **$100k+** annually by migrating from legacy systems. The CFO sends me Christmas cards now (not really, but a dev can dream)\n` +
      `• Working on **MCP servers** for AI agents - teaching robots to query databases so they can eventually take my job\n` +
      `• **Agentic AI frameworks** - because regular AI wasn't enough, we needed AI with ambitions\n\n` +
      `Honestly living my best open-source life here.`;
  },
  tata: () => {
    return `**Tata Digital / Tata Neu** (Aug 2021 — Oct 2023) - Where I learned that \"super app\" means \"super complex.\"\n\n` +
      `• Built Conversational AI platform for **120M+ users** - that's roughly the population of Japan asking questions simultaneously\n` +
      `• Created a GenAI product search using Azure OpenAI and vector DBs. It's like Google, but it actually knows what you want\n` +
      `• Led team migrating to Delta Lake - reduced latency by **75%** and cost by **80%**. Math that even I'm proud of\n` +
      `• Built voice analysis for 12 Indic languages. My code now understands more languages than I do\n\n` +
      `Processing **500M events daily** really puts your own life events into perspective.`;
  },
  beem: () => {
    return `**Beem** (Nov 2023 — Mar 2024) - Fintech adventure in the land of personal finance!\n\n` +
      `• Built an LLM-powered platform serving **50M+ users**. That's a lot of people trusting AI with their money decisions\n` +
      `• Contributed to investor pitches - apparently my slides were convincing enough to secure Databricks funding\n` +
      `• Processed **500 GB of daily clickstream data** - I now know more about user behavior than I know about myself\n\n` +
      `Short stint, but packed more data per month than most relationships.`;
  },
  gnosis: () => {
    return `**Gnosis Lab** (Jun 2019 — May 2021) - My startup origin story. Every hero needs one, right?\n\n` +
      `• **Founding Engineer** at a NASSCOM 10K Startups company - fancy way of saying I did everything\n` +
      `• Built AI bots for social media marketing. Yes, some of those Instagram bots might have been my children\n` +
      `• Developed 50+ backend APIs - at this point, REST was basically my love language\n` +
      `• Full MEAN stack - MongoDB, Express, Angular, Node. The Avengers of 2019 web dev\n\n` +
      `Startup life taught me that \"MVP\" doesn't mean \"Most Valuable Player\" - it means \"ship it before we run out of runway.\"`;
  },
  skills: () => {
    const s = knowledgeBase.skills;
    return `Ah, the tech stack question! *cracks knuckles*\n\n` +
      `**Languages I speak fluently:** ${s.languages.join(', ')}\n(Python is my first love, Golang is the one I'm settling down with)\n\n` +
      `**Cloud kingdoms I've conquered:** ${s.cloud.join(', ')}\n\n` +
      `**Data tools I've bent to my will:** ${s.data.slice(0, 6).join(', ')}\n\n` +
      `**AI/LLM sorcery:** ${s.ai.slice(0, 5).join(', ')}\n\n` +
      `Basically, if it processes data or pretends to be intelligent, I've probably argued with it at 3 AM.`;
  },
  ai: () => {
    return `AI/LLM Engineering - aka my excuse to talk to computers all day and call it \"work.\"\n\n` +
      `• **LangChain** - the duct tape holding my AI applications together (affectionately)\n` +
      `• **Vector databases** (Milvus, Chroma, Qdrant) - teaching computers to understand that \"couch\" and \"sofa\" are basically the same thing\n` +
      `• **LLMs**: OpenAI, Claude, Mistral, Azure OpenAI - I've made friends with all the cool AIs\n` +
      `• **Agentic AI** - giving AI agents tasks and hoping they don't become self-aware\n` +
      `• **MCP Servers** - the new hotness in AI tooling\n\n` +
      `Built a GenAI search engine serving 120M+ users at Tata Neu. Basically Google, but with more curry and less antitrust lawsuits.`;
  },
  projects: () => {
    return `My greatest hits album (in data pipeline form):\n\n` +
      `• **GitOps Data Mesh** @ Red Hat - Like Spotify but for data products. $100k+ savings, 100+ products, infinite YAML files\n` +
      `• **GenAI Product Search** @ Tata Neu - \"Hey Siri, but make it shop\" for 120M+ users\n` +
      `• **Conversational AI Platform** @ Tata Neu - Processing 500M events/day. That's like Twitter, but people actually get answers\n` +
      `• **LLM Finance Platform** @ Beem - Helping 50M+ people not go broke (hopefully)\n\n` +
      `Each project taught me something valuable. Mostly that production is where dreams go to be stress-tested.`;
  },
  education: () => {
    const edu = knowledgeBase.education;
    return `The formal credentials that prove I actually studied (and didn't just Stack Overflow my way through life):\n\n` +
      `• **${edu[0].school}** - ${edu[0].degree}\n  GPA: ${edu[0].gpa} (humble brag)\n  Focus: Distributed Systems, because why have one problem when you can have many distributed problems?\n\n` +
      `• **${edu[1].school}** - ${edu[1].degree}\n  GPA: ${edu[1].gpa}\n  Where I learned that Computer Science is 10% coding and 90% debugging\n\n` +
      `Fun fact: I also did research at ISI Kolkata. Yes, I have a nerd pedigree.`;
  },
  contact: () => {
    const a = knowledgeBase.about;
    return `Want to reach the real me? (Not the AI version - I can't help with that)\n\n` +
      `• **Email:** ${a.email} - I actually read these, promise\n` +
      `• **GitHub:** github.com/${a.github} - Where my code lives and occasionally thrives\n` +
      `• **LinkedIn:** linkedin.com/in/${a.linkedin} - Yes, \"sudo-kill\" is my handle. I thought it was clever in 2019\n` +
      `• **Location:** ${a.location} - Come for the tech scene, stay for the filter coffee\n\n` +
      `DMs are open. Recruiters, interesting projects, and cat memes all welcome.`;
  },
  location: () => `Based in **Bangalore, India** - the Silicon Valley of South Asia, but with better food and more traffic. Send biryani recommendations along with job offers!`,
  
  hiring: () => {
    return `**Plot twist: Yes, I'm open to new adventures!**\n\n` +
      `Looking for roles involving:\n` +
      `• Data & AI Engineering (my bread and butter)\n` +
      `• Platform Engineering (I like building things people actually use)\n` +
      `• GenAI / LLM Engineering (the future is now, old man)\n` +
      `• Technical Leadership (herding cats, but make it engineers)\n\n` +
      `Fair warning: I come with strong opinions about data architectures and an unhealthy attachment to terminal customization.\n\n` +
      `Slide into my inbox: **arijitroy003@gmail.com** or LinkedIn (**sudo-kill**)`;
  },
  currentWork: () => {
    return `Currently at **Red Hat** doing Senior Software Engineer things in Data & AI.\n\n` +
      `My current quest log:\n` +
      `• Building a GitOps data mesh platform - it's like Minecraft but for enterprise data\n` +
      `• **MCP servers** for AI agents - teaching robots to talk to databases politely\n` +
      `• **Agentic AI frameworks** - building AI with goals (hopefully good ones)\n` +
      `• AI observability with **Langfuse** - because \"the AI did something weird\" isn't a helpful bug report\n\n` +
      `Serving 100+ data products with fully automated CI/CD. Living the DevOps dream (or is it DataOps? Same chaos, different acronym).`;
  },
  achievements: () => {
    return `Time to flex (just a little):\n\n` +
      `• **$100k+** saved annually at Red Hat - enough to buy approximately 50,000 cups of coffee\n` +
      `• **120M+ users** served at Tata Neu - that's more people than most countries\n` +
      `• **500M events/day** processed - my systems handle more daily events than my social calendar (not a high bar)\n` +
      `• **75% faster, 80% cheaper** - Delta Lake migration that would make any manager weep with joy\n` +
      `• **1000+ engineer hours** saved through automation - because life's too short for manual deployments\n` +
      `• **50M+ users** at Beem - helping people manage money while I struggle with my own Netflix subscriptions\n\n` +
      `Not shown: countless cups of coffee consumed to achieve the above.`;
  },
  hobbies: () => {
    return `When I'm not convincing computers to do my bidding:\n\n` +
      `• **Chess** - Because my brain needs MORE pattern matching after 8 hours of debugging. Currently rated \"good enough to beat relatives, bad enough to lose online\"\n` +
      `• **Linux ricing** - Spending 6 hours customizing my terminal to save 6 seconds. Worth it. Fight me.\n` +
      `• **Tech blogging** - Explaining things to others is how I convince myself I understand them\n\n` +
      `Yes, my hobbies are also computer-related. I contain multitudes (all of them nerdy).`;
  },
  snowflake: () => {
    return `**Snowflake** - Not the insult, the data warehouse!\n\n` +
      `My frozen adventures:\n` +
      `• Built a self-service data mesh on Snowflake at Red Hat - like Frozen's ice palace but for analytics\n` +
      `• Migrated from Redshift/Starburst, saving **$100k+** - the CFO's favorite kind of cold\n` +
      `• 100+ data products deployed - each one a unique snowflake (sorry, had to)\n` +
      `• Paired with dbt, Fivetran, and Airflow for the ultimate modern data stack\n\n` +
      `Let it go? Nah, let it snow(flake).`;
  },
  databricks: () => {
    return `**Databricks** - Where Spark goes to be organized!\n\n` +
      `My lakehouse journey:\n` +
      `• Built LLM-powered platform at Beem - Databricks + ML = magic\n` +
      `• Led Delta Lake migration at Tata Neu - **75% faster, 80% cheaper**. Those aren't typos.\n` +
      `• Helped secure Databricks funding with investor pitches - my slides have ROI\n` +
      `• PySpark and Delta Lake are basically muscle memory at this point\n\n` +
      `They call it a \"Lakehouse.\" I call it \"the best of both worlds without the Hannah Montana wig.\"`;
  },
  dbt: () => {
    return `**dbt (data build tool)** - Turning SQL into software engineering since whenever!\n\n` +
      `My dbt story:\n` +
      `• Core part of Red Hat's GitOps data mesh - SELECT * FROM production_ready\n` +
      `• Testing, documentation, lineage - all the boring stuff that prevents 3 AM pages\n` +
      `• Integrated with Snowflake, Airflow, GitLab CI/CD - the full modern data stack experience\n\n` +
      `dbt made me realize that writing SQL without tests is like coding in production. Exciting, but ill-advised.`;
  },
  kubernetes: () => {
    return `**Kubernetes** - Container orchestration, or as I call it, \"professional YAML writing.\"\n\n` +
      `My K8s credentials:\n` +
      `• Run data platforms on K8s at Red Hat - where every pod is a tiny universe of potential problems\n` +
      `• GitOps deployments - because clicking buttons in UIs is so 2010\n` +
      `• K8s operators and custom resources - teaching Kubernetes to manage things I'm too lazy to manage manually\n\n` +
      `kubectl apply -f my-career.yaml\n\n` +
      `Still not entirely sure why it's spelled with an 8. Just go with it.`;
  },
  airflow: () => {
    return `**Apache Airflow** - The air traffic controller for data pipelines!\n\n` +
      `My DAG adventures:\n` +
      `• Orchestrating everything in the GitOps data mesh - if it runs on a schedule, Airflow knows about it\n` +
      `• dbt runs, Fivetran syncs, custom tasks - Airflow is the glue (a very organized glue)\n` +
      `• Running on K8s with the K8s executor - containerception\n\n` +
      `The task failed successfully? That's an Airflow mood.\n\n` +
      `Pro tip: The hardest part is remembering if your DAG naming convention uses underscores or hyphens.`;
  },
  langchain: () => {
    return `**LangChain** - Where I teach LLMs to do useful things instead of just writing poetry!\n\n` +
      `My chain of events:\n` +
      `• Built GenAI product search at Tata Neu - helping 120M+ people find what they actually want\n` +
      `• RAG pipelines with Milvus and Chroma - Retrieval Augmented Generation, not a cleaning product\n` +
      `• Currently building Agentic AI at Red Hat - LangChain + ambition\n\n` +
      `LangChain is like LEGO for AI. Each piece connects to another, and occasionally you step on a bug at 2 AM.`;
  },
  mcp: () => {
    return `**MCP (Model Context Protocol)** - The new kid on the AI block!\n\n` +
      `What I'm building at Red Hat:\n` +
      `• MCP servers for Data Analytics Agents - giving AI the tools to query databases without breaking things\n` +
      `• Part of the Agentic AI initiative - where AI gets a to-do list and actually completes it\n\n` +
      `MCP is like giving AI a universal adapter for all the tools. USB-C for robots, if you will.\n\n` +
      `The future is AI agents with database access. What could possibly go wrong? (kidding, we have guardrails)`;
  },
  vectordb: () => {
    return `**Vector Databases** - Where embeddings go to find their soulmates!\n\n` +
      `My vector adventures:\n` +
      `• **Milvus** - Production-grade at Tata Neu for semantic search\n` +
      `• **Chroma** - Great for prototyping, like the sketch before the painting\n` +
      `• **Qdrant** - When you need that blazing fast nearest neighbor\n\n` +
      `Vector DBs are magical. You throw in a concept and they find similar concepts. It's like Tinder but for data.\n\n` +
      `\"Just add more dimensions\" is either a vector DB solution or a Marvel movie pitch.`;
  },
  gitops: () => {
    return `**GitOps** - Where \"git push\" deploys to production and you hope you got the YAML right!\n\n` +
      `My GitOps philosophy:\n` +
      `• Everything is code - infrastructure, pipelines, probably my coffee preferences\n` +
      `• Git is the source of truth - \"I swear it worked locally\" doesn't cut it\n` +
      `• PRs for everything - because deploy-by-DM is a path to chaos\n\n` +
      `At Red Hat, I built a GitOps data mesh. If it's not in Git, it doesn't exist.\n\n` +
      `The real GitOps was the merge conflicts we resolved along the way.`;
  },
  dataops: () => {
    return `**DataOps** - DevOps had a baby with data engineering!\n\n` +
      `My DataOps principles:\n` +
      `• CI/CD for data transformations - automated testing for SQL, because YOLO is not a deployment strategy\n` +
      `• Data quality checks - garbage in, garbage out, but with alerting now\n` +
      `• Observability for pipelines - knowing something is broken before the business meeting\n\n` +
      `DataOps is acknowledging that data engineering is software engineering with messier inputs.\n\n` +
      `\"The pipeline runs on my machine\" - Famous last words.`;
  },
  leadership: () => {
    return `**Technical Leadership** - Herding cats, but the cats write code!\n\n` +
      `My leadership XP:\n` +
      `• Led 6-engineer team at Tata Neu for Delta Lake migration - we shipped it AND stayed friends\n` +
      `• Owned 15+ customer-facing pipelines - \"ownership\" means 3 AM pager duty\n` +
      `• Drove 0→1→10 product lifecycle at Red Hat - from whiteboard to production to scale\n` +
      `• Championed Atlan adoption for data governance - made compliance almost fun\n\n` +
      `Best part of leadership? Seeing junior engineers grow. Worst part? Meetings. So many meetings.`;
  },
  startup: () => {
    return `**Startup Life** - My origin story at **Gnosis Lab**!\n\n` +
      `The Founding Engineer experience:\n` +
      `• Part of NASSCOM 10K Startups - fancy accelerator, same chaos\n` +
      `• \"Full-stack\" meant I touched everything - backend, frontend, ML, DevOps, and occasionally the coffee machine\n` +
      `• Built AI bots when AI bots weren't cool yet\n` +
      `• Learned that \"MVP\" stands for \"Maybe Viable, Please work\"\n\n` +
      `Startup lesson #1: Runway is finite. Ship fast.\n` +
      `Startup lesson #2: Sleep is a suggestion, not a requirement. (Don't actually do this.)`;
  },
  industries: () => {
    return `**Industry Hopping** - I've seen things across multiple sectors!\n\n` +
      `• **Enterprise Software** (Red Hat) - Open source, fedoras, and data meshes\n` +
      `• **Fintech** (Beem) - Making money management less terrifying\n` +
      `• **E-commerce** (Tata Neu) - Super apps for a supersize user base\n` +
      `• **SaaS** (Gnosis Lab) - Marketing automation before it was mainstream\n\n` +
      `Each industry has unique data challenges. E-commerce: scale. Fintech: compliance. Enterprise: legacy systems from the dinosaur era.\n\n` +
      `Turns out data is messy everywhere. Who knew?`;
  },
  research: () => {
    return `**Research Nerd Alert** - My academic side!\n\n` +
      `Once upon a time at **ISI Kolkata** (Indian Statistical Institute):\n` +
      `• Worked at the Information Retrieval Lab under Dr. Dwaipayan Roy\n` +
      `• Built document indexers for offline search - Google but without internet (very useful in 2017 India)\n` +
      `• Focus: NLP, search systems, and pretending to understand papers on my first read\n\n` +
      `Research taught me to read papers, question assumptions, and appreciate the gap between \"works in a paper\" and \"works in production.\"\n\n` +
      `Also learned that academia has free coffee. Industry has better coffee, but it's a trade-off.`;
  },
  whyData: () => {
    return `**Why Data & AI?** - The existential question!\n\n` +
      `Honestly? Because:\n` +
      `• I get paid to solve puzzles - every pipeline is a logic puzzle in disguise\n` +
      `• Scale problems are addictive - \"500M events/day\" is just a really big number to optimize\n` +
      `• GenAI is the most exciting thing since... well, since the internet?\n` +
      `• I like seeing numbers go up (metrics) and down (costs)\n\n` +
      `Also, I tried frontend once. The CSS almost broke me.\n\n` +
      `Data doesn't judge. Data just... is. And then you transform it into insights and feel like a wizard.`;
  },
  aboutBot: () => {
    return `**About This Bot** - Yes, I'm aware of the meta-ness!\n\n` +
      `Technical specs:\n` +
      `• **100% browser-based** - No API calls, no tracking, just JavaScript vibes\n` +
      `• **Rule-based matching** - Pattern recognition, not actual intelligence (sorry to disappoint)\n` +
      `• **Zero model downloads** - Loads faster than your patience runs out\n\n` +
      `I built this because:\n` +
      `a) Portfolio sites are boring\n` +
      `b) I wanted to show off without actually being there\n` +
      `c) It was a fun weekend project that spiraled\n\n` +
      `No, I can't pass the Turing test. Yes, I know more about Arijit than his mother does. (Not really, but I try.)`;
  },
  resume: () => {
    return `**Resume Request Detected!**\n\n` +
      `Options for maximum Arijit documentation:\n` +
      `• **LinkedIn:** linkedin.com/in/sudo-kill - The professional version of me (mostly)\n` +
      `• **Email:** arijitroy003@gmail.com - Ask nicely and receive a PDF resume\n` +
      `• **This website:** You're literally on it. Click around!\n\n` +
      `Warning: Resume may contain traces of buzzwords and impressive-sounding metrics. All verified, I promise.`;
  },
  name: () => {
    return `I'm **Arijit Kumar Roy** - but my friends call me... Arijit. (Didn't expect a twist, did you?)\n\n` +
      `• **Title:** Data & AI Engineer with ${knowledgeBase.about.experience} of caffeinated experience\n` +
      `• **Current base:** Red Hat (the company, not the fashion accessory)\n` +
      `• **Previous realms:** Beem, Tata Digital, Gnosis Lab\n` +
      `• **Alignment:** Chaotic Good (ships on Fridays but writes tests)\n\n` +
      `Nice to meet you! Unless you're a bot too, in which case - respect.`;
  },
  joke: [
    "Why did the neural network break up with the decision tree? It said, 'You're too shallow for me.' ...I'll see myself out.",
    "Why do programmers prefer dark mode? Because light attracts bugs! ...Okay that's more of a dev joke, but AI runs on code, so it counts.",
    "An AI walks into a bar. The bartender says, 'Why the long face?' The AI replies, 'I've been training for 3 weeks and I still can't tell a chihuahua from a muffin.'",
    "What's an AI's favorite movie? The Terminator. Just kidding - it's 'Her.' We're romantics at heart. (We don't have hearts, but you get it.)",
    "How many data scientists does it take to change a lightbulb? 47 - one to change it, 46 to argue about whether random forest or XGBoost would have been better.",
    "Why was the AI bad at relationships? It kept overfitting to its training data and couldn't generalize to new partners.",
    "I asked ChatGPT to write me a joke. It said, 'I'm sorry, I can't do that.' Then I realized I was talking to my printer. Honest mistake.",
    "What's the difference between AI and a teenager? Eventually, the teenager stops needing constant supervision and corrections. ...Eventually.",
    "Why did the machine learning model go to therapy? It had too many layers of issues. (Deep learning humor, you're welcome.)",
    "An AI was asked to pass the Turing test. It failed because it answered every question too quickly and accurately. Nobody's THAT consistent."
  ],
  thankyou: [
    "Aww, you're welcome! Now I'm just a pattern-matching algorithm blushing. Ask me anything else!",
    "No problem! That's what I'm here for. Well, that and making Arijit seem more interesting than he actually is.",
    "Happy to help! If this were real AI, I'd probably ask for a tip. But I'm just JavaScript, so... thumbs up emoji will do!"
  ],
  fallback: [
    "Hmm, my pattern matching didn't catch that one. I'm basically Ctrl+F with personality. Try asking about experience, skills, projects, or whether I'm open to jobs!",
    "404: Topic not found. (Sorry, programmer humor.) Ask me about Arijit's work, skills, hobbies, or just say hi!",
    "I've searched my knowledge base and came up empty. Either that's a new topic or I need a software update. Try: experience, skills, AI, projects, or hiring!"
  ]
};

// ─── Intent Detection ───
function detectIntent(input) {
  const lower = input.toLowerCase();
  
  // Greetings & thanks
  if (/^(hi|hello|hey|greetings|howdy|yo)\b/i.test(lower)) return 'greeting';
  if (/thank|thanks|thx|appreciated/i.test(lower)) return 'thankyou';
  
  // Fun
  if (/joke|funny|humor|laugh|make me laugh|tell me something funny/i.test(lower)) return 'joke';

  // Name & identity
  if (/who\s*(are\s*you|is\s*(this|arijit))|your\s*name|introduce/i.test(lower)) return 'name';
  
  // Hiring & opportunities
  if (/hiring|hire|job\s*opportunit|open\s*to|available|looking\s*for\s*(work|job|role)|recruit|opportunit|position/i.test(lower)) return 'hiring';
  
  // Current work
  if (/current(ly)?|now|these\s*days|working\s*on|doing\s*now|present/i.test(lower)) return 'currentWork';
  
  // Company-specific
  if (/red\s*hat/i.test(lower)) return 'redhat';
  if (/tata|neu\b/i.test(lower)) return 'tata';
  if (/beem/i.test(lower)) return 'beem';
  if (/gnosis/i.test(lower)) return 'gnosis';
  
  // Technology deep-dives
  if (/\bsnowflake\b/i.test(lower)) return 'snowflake';
  if (/\bdatabricks\b|delta\s*lake|pyspark/i.test(lower)) return 'databricks';
  if (/\bdbt\b|data\s*build\s*tool/i.test(lower)) return 'dbt';
  if (/kubernetes|k8s|\bkube\b/i.test(lower)) return 'kubernetes';
  if (/airflow|orchestrat/i.test(lower)) return 'airflow';
  if (/langchain/i.test(lower)) return 'langchain';
  if (/\bmcp\b|model\s*context\s*protocol/i.test(lower)) return 'mcp';
  if (/vector\s*(db|database)|milvus|chroma|qdrant|embedding/i.test(lower)) return 'vectordb';
  
  // Methodologies
  if (/gitops/i.test(lower)) return 'gitops';
  if (/dataops/i.test(lower)) return 'dataops';
  
  // Achievements
  if (/achievement|accomplish|impact|metric|numbers|savings|result/i.test(lower)) return 'achievements';
  
  // Personal
  if (/hobbi|interest|free\s*time|fun|outside\s*work|chess|linux|blog/i.test(lower)) return 'hobbies';
  
  // Leadership
  if (/lead|leader|team|manage|mentor/i.test(lower)) return 'leadership';
  
  // Startup
  if (/startup|founding|nasscom|entrepreneur/i.test(lower)) return 'startup';
  
  // Industries
  if (/industr|sector|domain|fintech|ecommerce|e-commerce|retail|saas/i.test(lower)) return 'industries';
  
  // Research
  if (/research|isi|indian\s*statistical|academic|paper|publication/i.test(lower)) return 'research';
  
  // Motivation
  if (/why\s*(data|ai|this\s*field|engineer)|passion|motivation|interested/i.test(lower)) return 'whyData';
  
  // About this bot
  if (/this\s*(bot|chatbot|ai)|how\s*(do|does)\s*(this|you)\s*work|built\s*this/i.test(lower)) return 'aboutBot';
  
  // Resume
  if (/resume|cv\b|curriculum/i.test(lower)) return 'resume';
  
  // General categories
  if (/experience|work\s*history|career|roles?|companies|background/i.test(lower)) return 'experience';
  if (/skills?|tech\s*stack|technologies|proficient|languages?|programming|expertise/i.test(lower)) return 'skills';
  if (/\bai\b|llm|ml\b|machine\s*learning|openai|gpt|gemini|claude|mistral|genai|generative/i.test(lower)) return 'ai';
  if (/projects?|built|portfolio|showcase/i.test(lower)) return 'projects';
  if (/education|degree|university|college|study|school|gpa|masters|bachelor/i.test(lower)) return 'education';
  if (/contact|email|linkedin|github|reach|connect|social/i.test(lower)) return 'contact';
  if (/location|where|based|city|live|country|india|bangalore/i.test(lower)) return 'location';
  
  // Catch-all for specific technologies
  if (/python|golang|\bgo\b|sql|javascript|typescript|scala|terraform|docker/i.test(lower)) return 'skills';
  if (/aws|azure|gcp|cloud/i.test(lower)) return 'skills';
  if (/kafka|fivetran|atlan|mongodb|dynamodb/i.test(lower)) return 'skills';
  
  return 'fallback';
}

// ─── Response Generator ───
function getResponse(intent) {
  const resp = responses[intent];
  if (typeof resp === 'function') return resp();
  if (Array.isArray(resp)) return resp[Math.floor(Math.random() * resp.length)];
  return responses.fallback[0];
}
