import { getGlobalContent, getNavigation, getSettings } from '@/lib/data'
import { WpMenu } from './menu'

const THEME = 'https://aivastra.com/wp-content/themes/aivastrachild'

/** 1:1 port of the theme's header.php. */
export async function Header() {
  const [nav, gc, settings] = await Promise.all([getNavigation(), getGlobalContent(), getSettings()])
  const g = gc as any
  const items = (nav.header ?? []) as any[]
  return (
    <>
      <div id="floatingMenu">
        <div className="floatingMenu-list">
          <a href="javascript:void(0);" id="cloaseFloatingMenu">&times;</a>
          <div className="sticky-mobinav mobinav">
            <div className="container">
              <div className="top_logo">
                <a href="/" rel="home">
                  <img src={`${THEME}/images/newlogohorizontal-white.svg`} alt={settings.siteName} width={344} height={78} />
                </a>
              </div>
              <WpMenu items={items} id="primary-menu-mobile" />
            </div>
          </div>
        </div>
        <a href="javascript:void(0);" id="cloaseFloatingMenu2">&times;</a>
      </div>
      <header className="site-header">
        <div className="container">
          <div className="logo-section">
            <div className="site-list">
              <div className="site-branding">
                <a href="/" rel="home">
                  <img src={`${THEME}/images/newlogohorizontal.svg`} alt={settings.siteName} width={155} height={44} />
                </a>
              </div>
              <div className="site-header-menu">
                <nav id="main-navigation">
                  <button className="menu-toggle" aria-controls="primary-menu" aria-expanded="false">Primary Menu</button>
                  <WpMenu items={items} id="primary-menu" />
                </nav>
              </div>
            </div>
            <div className="top-rite">
              <nav id="main-navigation-cta">
                <ul>
                  <li><a>{g.catalogue_content}</a></li>
                </ul>
              </nav>
              <div className="tophdr-btn sign">
                <a href={g.sign_link || '#'} target="_blank" rel="noopener" className="cmn-btn">{g.sign_text}</a>
              </div>
              {g.shopify_image && g.shopify_link && (
                <div className="share-scl-icons shpfy">
                  <a href={g.shopify_link} target="_blank" rel="noopener"><img src={g.shopify_image} alt="Shopify" /></a>
                </div>
              )}
              {g.google_play_image && g.google_play_link && (
                <div className="share-scl-icons shpfy ggle">
                  <a href={g.google_play_link} target="_blank" rel="noopener"><img src={g.google_play_image} alt="Google Play" /></a>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mobile_src_nav">
          <div className="container">
            <a className="showhide"><b className="txtr">&equiv;</b><b className="txtl">Menu</b></a>
            <div className="hdr-dskscr">
              <div className="hdr-src"><div className="srcshow"> Search </div></div>
              <div className="srcbox">
                <SearchForm />
                <div className="close_search" />
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}

export function SearchForm() {
  return (
    <form role="search" method="get" className="search-form" action="/search/">
      <label>
        <span className="screen-reader-text">Search for:</span>
        <input type="search" className="search-field" placeholder="Search …" name="s" />
      </label>
      <input type="submit" className="search-submit" value="Search" />
    </form>
  )
}
