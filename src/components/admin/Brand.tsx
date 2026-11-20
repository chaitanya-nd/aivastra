/** Login-screen / nav brand mark. */
export function Logo() {
  return (
    <div className="avbrand">
      <span className="avbrand-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19 12 4l8 15M8 14h8" /></svg></span>
      <span className="avbrand-name">AI Vastra <small>Studio</small></span>
    </div>
  )
}
export function Icon() {
  return <span className="avbrand-mark sm" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19 12 4l8 15M8 14h8" /></svg></span>
}
