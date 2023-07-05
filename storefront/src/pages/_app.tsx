import { MEDUSA_BACKEND_URL, queryClient } from "@lib/config"
import { AccountProvider } from "@lib/context/account-context"
import { CartDropdownProvider } from "@lib/context/cart-dropdown-context"
import { MobileMenuProvider } from "@lib/context/mobile-menu-context"
import { StoreProvider } from "@lib/context/store-context"
import { CartProvider, MedusaProvider } from "medusa-react"
import { Hydrate } from "react-query"
import "styles/globals.css"
import { AppPropsWithLayout } from "types/global"
import Script from "next/script"

function App({
  Component,
  pageProps,
}: AppPropsWithLayout<{ dehydratedState?: unknown }>) {
  const getLayout = Component.getLayout ?? ((page) => page)

  return (
    <MedusaProvider
      baseUrl={MEDUSA_BACKEND_URL}
      queryClientProviderProps={{
        client: queryClient,
      }}
    >
      <Hydrate state={pageProps.dehydratedState}>

      <>
<Script id="td_js_load">
{`
!function(t,e){if(void 0===e[t]){e[t]=function(){e[t].clients.push(this),this._init=[Array.prototype.slice.call(arguments)]},e[t].clients=[];for(var r=["addRecord","blockEvents","fetchServerCookie","fetchGlobalID","fetchUserSegments","resetUUID","ready","setSignedMode","setAnonymousMode","set","trackEvent","trackPageview","trackClicks","unblockEvents"],s=0;s<r.length;s++){var c=r[s];e[t].prototype[c]=function(t){return function(){return this["_"+t]=this["_"+t]||[],this["_"+t].push(Array.prototype.slice.call(arguments)),this}}(c)}var n=document.createElement("script"),o=(n.type="text/javascript",n.async=!0,n.src=("https:"===document.location.protocol?"https:":"http:")+"//cdn.treasuredata.com/sdk/4.0/td.min.js",document.getElementsByTagName("script")[0]);o.parentNode.insertBefore(n,o)}}("Treasure",this);
`}
</Script>

<Script strategy="afterInteractive"  id="td_analytics">
{`
var td = new Treasure({
  host: 'API Endpoint',
  writeKey: 'TD_API_KEY',
  database: 'Your_DB'
});
td.setSignedMode();
td.set('$global', 'td_global_id', 'td_global_id');
td.trackPageview('pageviews');
td.trackClicks('clicks');
`}
</Script>
</>


        <CartDropdownProvider>
          <MobileMenuProvider>
            <CartProvider>
              <StoreProvider>
                <AccountProvider>
                  {getLayout(<Component {...pageProps} />)}
                </AccountProvider>
              </StoreProvider>
            </CartProvider>
          </MobileMenuProvider>
        </CartDropdownProvider>
      </Hydrate>
    </MedusaProvider>
  )
}

export default App
