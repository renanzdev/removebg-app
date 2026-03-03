import { useState, useRef, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=SF+Pro+Display:wght@300;400;500;600;700&display=swap');

  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --bg: #000;
    --surface: rgba(255,255,255,0.04);
    --surface-hover: rgba(255,255,255,0.08);
    --border: rgba(255,255,255,0.1);
    --border-strong: rgba(255,255,255,0.2);
    --text: #fff;
    --text-secondary: rgba(255,255,255,0.55);
    --text-tertiary: rgba(255,255,255,0.3);
    --accent: #0a84ff;
    --accent-glow: rgba(10,132,255,0.3);
    --success: #30d158;
    --radius: 20px;
    --radius-sm: 12px;
  }

  body {
    margin: 0;
    background: #000;
    font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'SF Pro Text', sans-serif;
    -webkit-font-smoothing: antialiased;
    overflow-x: hidden;
  }

  .app {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    position: relative;
    background: #000;
    overflow: hidden;
  }

  /* Ambient background orbs */
  .bg-orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(120px);
    pointer-events: none;
    z-index: 0;
    animation: float 8s ease-in-out infinite;
  }

  .bg-orb-1 {
    width: 600px;
    height: 600px;
    top: -200px;
    left: -150px;
    background: radial-gradient(circle, rgba(99,102,241,0.12) 0%, transparent 70%);
    animation-delay: 0s;
  }

  .bg-orb-2 {
    width: 500px;
    height: 500px;
    top: -100px;
    right: -100px;
    background: radial-gradient(circle, rgba(10,132,255,0.1) 0%, transparent 70%);
    animation-delay: -3s;
  }

  .bg-orb-3 {
    width: 700px;
    height: 700px;
    bottom: -200px;
    left: 50%;
    transform: translateX(-50%);
    background: radial-gradient(circle, rgba(48,209,88,0.06) 0%, transparent 70%);
    animation-delay: -6s;
  }

  @keyframes float {
    0%, 100% { transform: translateY(0px) scale(1); }
    50% { transform: translateY(-30px) scale(1.05); }
  }

  /* Noise overlay */
  .noise {
    position: fixed;
    inset: 0;
    z-index: 0;
    opacity: 0.035;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
    background-size: 200px 200px;
  }

  /* Header */
  .header {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 32px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border-bottom: 1px solid var(--border);
    animation: slideDown 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-100%); }
    to { opacity: 1; transform: translateY(0); }
  }

  .header-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 15px;
    font-weight: 600;
    color: var(--text);
    letter-spacing: -0.3px;
  }

  .logo-icon {
    width: 28px;
    height: 28px;
    background: linear-gradient(135deg, #0a84ff, #5ac8fa);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
  }

  .header-nav {
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .nav-pill {
    padding: 6px 14px;
    border-radius: 100px;
    font-size: 13px;
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.2s ease;
    border: none;
    background: transparent;
    font-family: inherit;
  }

  .nav-pill:hover {
    color: var(--text);
    background: var(--surface-hover);
  }

  .nav-pill-cta {
    background: var(--surface);
    color: var(--text);
    border: 1px solid var(--border-strong);
  }

  .nav-pill-cta:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.35);
  }

  /* Main */
  .main {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 100px 24px 80px;
    position: relative;
    z-index: 1;
  }

  /* Hero */
  .hero {
    width: 100%;
    max-width: 600px;
    text-align: center;
    animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.2s both;
  }

  @keyframes heroIn {
    from { opacity: 0; transform: translateY(32px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 5px 12px 5px 8px;
    border-radius: 100px;
    background: rgba(10,132,255,0.12);
    border: 1px solid rgba(10,132,255,0.25);
    font-size: 12px;
    font-weight: 500;
    color: #5ac8fa;
    margin-bottom: 24px;
    letter-spacing: 0.2px;
  }

  .badge-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #0a84ff;
    animation: pulse 2s ease-in-out infinite;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.5; transform: scale(0.8); }
  }

  .hero h1 {
    font-size: clamp(38px, 6vw, 60px);
    font-weight: 700;
    line-height: 1.05;
    letter-spacing: -2px;
    color: var(--text);
    margin-bottom: 16px;
    background: linear-gradient(180deg, #fff 60%, rgba(255,255,255,0.5) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .hero p {
    font-size: 17px;
    font-weight: 400;
    color: var(--text-secondary);
    line-height: 1.6;
    margin-bottom: 48px;
    letter-spacing: -0.2px;
  }

  /* Upload Card */
  .upload-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 8px;
    margin-bottom: 12px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.3s ease;
  }

  .upload-card:has(.dropzone:hover) {
    border-color: rgba(255,255,255,0.2);
    background: rgba(255,255,255,0.05);
  }

  .dropzone {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 40px 24px;
    border-radius: 18px;
    border: 1.5px dashed rgba(255,255,255,0.15);
    color: var(--text-secondary);
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.16,1,0.3,1);
    position: relative;
    overflow: hidden;
  }

  .dropzone::before {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(ellipse at 50% 0%, rgba(10,132,255,0.06) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  .dropzone:hover {
    border-color: rgba(10,132,255,0.4);
    color: var(--text);
  }

  .dropzone:hover::before {
    opacity: 1;
  }

  .dropzone.ready {
    border-color: rgba(48,209,88,0.4);
    border-style: solid;
    background: rgba(48,209,88,0.03);
  }

  .dropzone-icon {
    width: 52px;
    height: 52px;
    border-radius: 16px;
    background: rgba(255,255,255,0.06);
    border: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 22px;
    transition: all 0.3s ease;
  }

  .dropzone:hover .dropzone-icon {
    background: rgba(10,132,255,0.12);
    border-color: rgba(10,132,255,0.3);
    transform: scale(1.05);
  }

  .dropzone.ready .dropzone-icon {
    background: rgba(48,209,88,0.12);
    border-color: rgba(48,209,88,0.3);
  }

  .dropzone-text {
    font-size: 15px;
    font-weight: 500;
    letter-spacing: -0.2px;
  }

  .dropzone-sub {
    font-size: 12px;
    color: var(--text-tertiary);
  }

  /* Button */
  .btn-remove {
    width: 100%;
    padding: 17px 24px;
    border-radius: 18px;
    border: none;
    background: #fff;
    color: #000;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.25s cubic-bezier(0.16,1,0.3,1);
    font-family: inherit;
    letter-spacing: -0.2px;
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .btn-remove::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.3) 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }

  .btn-remove:hover:not(:disabled)::before {
    opacity: 1;
  }

  .btn-remove:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 8px 32px rgba(255,255,255,0.2);
  }

  .btn-remove:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: none;
  }

  .btn-remove:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .btn-remove.loading {
    background: rgba(255,255,255,0.1);
    color: rgba(255,255,255,0.8);
    border: 1px solid rgba(255,255,255,0.15);
  }

  /* Spinner */
  .spinner {
    width: 16px;
    height: 16px;
    border: 2px solid rgba(0,0,0,0.2);
    border-top-color: #000;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
  }

  .loading .spinner {
    border-color: rgba(255,255,255,0.2);
    border-top-color: rgba(255,255,255,0.8);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  /* Progress bar */
  .progress-bar {
    height: 2px;
    background: rgba(255,255,255,0.06);
    border-radius: 100px;
    margin-top: 12px;
    overflow: hidden;
    opacity: 0;
    transition: opacity 0.3s;
  }

  .progress-bar.active {
    opacity: 1;
  }

  .progress-fill {
    height: 100%;
    background: linear-gradient(90deg, #0a84ff, #5ac8fa);
    border-radius: 100px;
    animation: progressAnim 2s cubic-bezier(0.4,0,0.2,1) infinite;
  }

  @keyframes progressAnim {
    0% { width: 0%; margin-left: 0%; }
    50% { width: 60%; margin-left: 20%; }
    100% { width: 0%; margin-left: 100%; }
  }

  /* Result section */
  .result-section {
    width: 100%;
    max-width: 600px;
    margin-top: 24px;
    animation: resultIn 0.6s cubic-bezier(0.16,1,0.3,1) both;
  }

  @keyframes resultIn {
    from { opacity: 0; transform: translateY(24px) scale(0.98); }
    to { opacity: 1; transform: translateY(0) scale(1); }
  }

  .result-card {
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--border);
    border-radius: 24px;
    overflow: hidden;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
  }

  .result-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid var(--border);
  }

  .result-header-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--text-secondary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .success-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: var(--success);
  }

  .result-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1px;
    background: var(--border);
  }

  .result-img-wrap {
    background: #000;
    position: relative;
    overflow: hidden;
  }

  .result-img-wrap::before {
    content: '';
    display: block;
    padding-top: 75%;
  }

  .result-img-wrap img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 16px;
  }

  /* Checkerboard for result */
  .result-img-wrap.transparent-bg {
    background-image: repeating-conic-gradient(rgba(255,255,255,0.04) 0% 25%, transparent 0% 50%);
    background-size: 20px 20px;
    background-color: rgba(255,255,255,0.02);
  }

  .img-label {
    position: absolute;
    top: 10px;
    left: 10px;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(8px);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 3px 8px;
    font-size: 10px;
    font-weight: 500;
    color: var(--text-secondary);
    letter-spacing: 0.4px;
    text-transform: uppercase;
  }

  .result-actions {
    padding: 16px;
    display: flex;
    gap: 8px;
  }

  .btn-download {
    flex: 1;
    padding: 14px 20px;
    border-radius: var(--radius-sm);
    background: #fff;
    color: #000;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s cubic-bezier(0.16,1,0.3,1);
    font-family: inherit;
    letter-spacing: -0.2px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    border: none;
    cursor: pointer;
  }

  .btn-download:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(255,255,255,0.2);
  }

  .btn-new {
    padding: 14px 18px;
    border-radius: var(--radius-sm);
    background: var(--surface);
    border: 1px solid var(--border-strong);
    color: var(--text);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    font-family: inherit;
    white-space: nowrap;
  }

  .btn-new:hover {
    background: var(--surface-hover);
    border-color: rgba(255,255,255,0.3);
  }

  /* Features strip */
  .features {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 32px;
    margin-top: 52px;
    padding-top: 32px;
    border-top: 1px solid var(--border);
    animation: heroIn 0.8s cubic-bezier(0.16,1,0.3,1) 0.4s both;
  }

  .feature {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--text-tertiary);
  }

  .feature-icon {
    font-size: 15px;
    opacity: 0.7;
  }

  /* Footer */
  .footer {
    position: relative;
    z-index: 1;
    padding: 24px 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-top: 1px solid var(--border);
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
  }

  .footer-copy {
    font-size: 12px;
    color: var(--text-tertiary);
    letter-spacing: -0.1px;
  }

  .footer-credit {
    font-size: 12px;
    color: var(--text-tertiary);
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .footer-credit a {
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-credit a:hover {
    color: var(--text);
  }

  .footer-links {
    display: flex;
    gap: 20px;
  }

  .footer-link {
    font-size: 12px;
    color: var(--text-tertiary);
    text-decoration: none;
    transition: color 0.2s;
  }

  .footer-link:hover {
    color: rgba(255,255,255,0.6);
  }

  @media (max-width: 600px) {
    .header { padding: 0 20px; }
    .header-nav { display: none; }
    .features { gap: 20px; flex-wrap: wrap; }
    .footer { flex-direction: column; gap: 12px; text-align: center; }
    .footer-links { justify-content: center; }
  }
`;

export default function App() {
  const [file, setFile] = useState(null);
  const [original, setOriginal] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef(null);

  const handleFile = useCallback((f) => {
    if (!f || !f.type.startsWith("image/")) return;
    setFile(f);
    setOriginal(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragging(false);
      handleFile(e.dataTransfer.files[0]);
    },
    [handleFile],
  );

  const reset = () => {
    setFile(null);
    setOriginal(null);
    setResult(null);
  };

  async function removeBackground() {
    if (!file) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("image_file", file);
      const res = await fetch("/api/remove-bg", {
        method: "POST",
        body: formData,
      });
      const blob = await res.blob();
      setResult(URL.createObjectURL(blob));
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        {/* Ambient background */}
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
        <div className="noise" />

        {/* Header */}
        <header className="header">
          <div className="header-logo">
            <div className="logo-icon">✦</div>
            RemoveBG
          </div>
          <nav className="header-nav">
            <button className="nav-pill">Features</button>
            <button className="nav-pill">Pricing</button>
            <button className="nav-pill">API</button>
            <button className="nav-pill nav-pill-cta">Sign in</button>
          </nav>
        </header>

        {/* Main */}
        <main className="main">
          {!result ? (
            <div className="hero">
              <div className="badge">
                <div className="badge-dot" />
                AI-Powered · Instant Results
              </div>
              <h1>
                Remove backgrounds
                <br />
                in one click.
              </h1>
              <p>
                Drop your image and get a clean PNG in seconds.
                <br />
                No signup. No watermarks. No limits.
              </p>

              <div className="upload-card">
                <label
                  className={`dropzone ${file ? "ready" : ""} ${dragging ? "dragging" : ""}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={handleDrop}
                >
                  <input
                    ref={inputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => handleFile(e.target.files[0])}
                  />
                  <div className="dropzone-icon">{file ? "✓" : "↑"}</div>
                  <span className="dropzone-text">
                    {file ? file.name : "Drop image here or click to upload"}
                  </span>
                  <span className="dropzone-sub">
                    {file
                      ? `${(file.size / 1024 / 1024).toFixed(1)} MB · Ready to process`
                      : "PNG, JPG, WEBP up to 25MB"}
                  </span>
                </label>
              </div>

              <button
                className={`btn-remove ${loading ? "loading" : ""}`}
                onClick={removeBackground}
                disabled={!file || loading}
              >
                {loading ? (
                  <>
                    <div className="spinner" />
                    Processing…
                  </>
                ) : (
                  <>✦ Remove Background</>
                )}
              </button>

              <div className={`progress-bar ${loading ? "active" : ""}`}>
                {loading && <div className="progress-fill" />}
              </div>

              <div className="features">
                <div className="feature">
                  <span className="feature-icon">⚡</span>
                  Under 3 seconds
                </div>
                <div className="feature">
                  <span className="feature-icon">🎯</span>
                  Pixel-perfect edges
                </div>
                <div className="feature">
                  <span className="feature-icon">🔒</span>
                  Private & secure
                </div>
                <div className="feature">
                  <span className="feature-icon">✦</span>
                  Free forever
                </div>
              </div>
            </div>
          ) : (
            <div className="result-section">
              <div className="result-card">
                <div className="result-header">
                  <div className="result-header-title">
                    <div className="success-dot" />
                    Background removed successfully
                  </div>
                  <span
                    style={{ fontSize: "12px", color: "var(--text-tertiary)" }}
                  >
                    {file?.name}
                  </span>
                </div>

                <div className="result-grid">
                  <div className="result-img-wrap">
                    <div className="img-label">Original</div>
                    <img src={original} alt="Original" />
                  </div>
                  <div className="result-img-wrap transparent-bg">
                    <div className="img-label">Result</div>
                    <img src={result} alt="Result" />
                  </div>
                </div>

                <div className="result-actions">
                  <a
                    className="btn-download"
                    href={result}
                    download="clearcut-result.png"
                  >
                    ↓ Download PNG
                  </a>
                  <button className="btn-new" onClick={reset}>
                    New Image
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-copy">
            © 2026 RenanDev. All rights reserved.
          </div>
          <div className="footer-links">
            <a href="#" className="footer-link">
              Privacy
            </a>
            <a href="#" className="footer-link">
              Terms
            </a>
            <a href="#" className="footer-link">
              API
            </a>
          </div>
          <div className="footer-credit">
            Crafted by{" "}
            <a
              href="https://instagram.com/renann7d"
              target="_blank"
              rel="noreferrer"
            >
              @renanzdev
            </a>
          </div>
        </footer>
      </div>
    </>
  );
}
