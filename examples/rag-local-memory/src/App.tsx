const SAMPLE_QUESTIONS = [
  {
    id: "refund",
    title: "Refund policy",
    description: 'Ask: "What is the refund policy?"',
    source: "docs/faq.json",
  },
  {
    id: "pricing",
    title: "Pro plan pricing",
    description: 'Ask: "How much does the Pro plan cost?"',
    source: "docs/pricing.txt",
  },
  {
    id: "password",
    title: "Password reset",
    description: 'Ask: "How do I reset my password?"',
    source: "docs/getting-started.md",
  },
] as const;

export default function App() {
  return (
    <>
      <header className="header">
        <div className="container header__inner">
          <span className="header__brand">RAG Local Memory Demo</span>
          <nav className="header__nav" aria-label="Sample questions">
            {SAMPLE_QUESTIONS.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="header__link">
                {item.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="container">
            <p className="hero__badge">RAG + widget example</p>
            <h1 className="hero__title">
              Chat widget backed by local docs in memory
            </h1>
            <p className="hero__text">
              This app uses <code>ai-chat-toolkit-widget</code> with a RAG-enabled{" "}
              <code>ai-chat-toolkit-server</code> backend. Documents from{" "}
              <code>./docs</code> are indexed at startup and retrieved before each
              LLM call. Open the chat in the corner and try the sample questions.
            </p>
            <ul className="hero__meta">
              <li>
                Frontend: <strong>http://localhost:5176</strong>
              </li>
              <li>
                Backend: <strong>http://localhost:3336</strong> (set via{" "}
                <code>PORT</code> in <code>.env</code>)
              </li>
              <li>
                Chat: <strong>POST /my-chat</strong> — proxied through Vite in dev
              </li>
            </ul>
          </div>
        </section>

        <section className="cards">
          <div className="container">
            <h2 className="section-title">Try the assistant</h2>
            <ul className="cards__grid">
              {SAMPLE_QUESTIONS.map((item) => (
                <li key={item.id} id={item.id} className="card">
                  <h3 className="card__title">{item.title}</h3>
                  <p className="card__description">{item.description}</p>
                  <p className="card__source">
                    Source: <code>{item.source}</code>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container">
          <p>
            RAG example · server + rag + source-local + store-memory + widget
          </p>
        </div>
      </footer>

      <ai-chat
        title="Demo Product"
        subtitle="Ask about pricing, refunds, or getting started"
        primary-color="#059669"
        path="/my-chat"
      />
    </>
  );
}
