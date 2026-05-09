import React, { useEffect, useRef, useState } from 'react'

const FinanceIframe = () => {
    const iframeRef = useRef(null)

    const formRef = useRef(null)

    const [isLoading, setIsLoading] = useState(true)

    /**
     * ==========================================
     * DIGIT AUTH DETAILS
     * ==========================================
     */

    const authToken = window.Digit?.UserService?.getUser()?.access_token || ''

    const tenantId = window.Digit?.ULBService?.getCurrentTenantId() || ''

    const locale = window.Digit?.SessionStorage?.get('locale') || 'en_IN'

    /**
     * ==========================================
     * DYNAMIC JSP URL
     * ==========================================
     *
     */

    const erpUrl = window.location.pathname.replace('/digit-ui/employee/finance', '')

    /**
     * ==========================================
     * DEBUG LOGS
     * ==========================================
     */

    // console.log('Browser URL:', window.location.pathname)

    // console.log('Finance JSP URL:', erpUrl)

    /**
     * ==========================================
     * AUTO RESIZE IFRAME
     * ==========================================
     */

    const resizeIframe = () => {
        try {
            const iframe = iframeRef.current

            if (!iframe) return

            const iframeDocument = iframe.contentWindow.document

            const body = iframeDocument.body

            const html = iframeDocument.documentElement

            const height = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight)

            iframe.style.height = `${height + 20}px`
        } catch (error) {
            console.warn('Unable to resize iframe:', error)
        }
    }

    /**
     * ==========================================
     * KEEP ALL NAVIGATION INSIDE IFRAME
     * ==========================================
     */

    const attachIframeTarget = () => {
        try {
            const iframe = iframeRef.current

            if (!iframe) return

            const iframeDocument = iframe.contentWindow.document

            /**
             * HANDLE ALL LINKS
             */

            const links = iframeDocument.querySelectorAll('a')

            links.forEach(link => {
                const href = link.getAttribute('href')

                if (href && !href.startsWith('javascript') && !href.startsWith('#')) {
                    link.setAttribute('target', 'erp_iframe')
                }
            })

            /**
             * HANDLE ALL FORMS
             */

            const forms = iframeDocument.querySelectorAll('form')

            forms.forEach(form => {
                form.setAttribute('target', 'erp_iframe')
            })
        } catch (error) {
            console.warn('Unable to attach iframe target:', error)
        }
    }

    /**
     * ==========================================
     * SUBMIT FORM TO IFRAME
     * ==========================================
     */

    useEffect(() => {
        if (formRef.current) {
            setIsLoading(true)

            // console.log('Submitting Finance Form:', erpUrl)

            formRef.current.submit()

            /**
             * FALLBACK LOADER HIDE
             */

            setTimeout(() => {
                setIsLoading(false)

                resizeIframe()
            }, 3000)
        }
    }, [erpUrl])

    /**
     * ==========================================
     * REMOVE BODY SPACING
     * ==========================================
     */

    useEffect(() => {
        document.body.style.margin = '0'

        document.body.style.padding = '0'

        return () => {
            document.body.style.margin = ''

            document.body.style.padding = ''
        }
    }, [])

    /**
     * ==========================================
     * RENDER
     * ==========================================
     */

    return (
        <div
            style={{
                position: 'relative',
                width: '100%',
                minHeight: '100vh',
                background: '#fff',
                overflow: 'hidden'
            }}
        >
            {/* ===================================== */}
            {/* LOADER */}
            {/* ===================================== */}

            {isLoading && (
                <div
                    style={{
                        position: 'absolute',
                        inset: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        background: 'rgba(255,255,255,0.92)',
                        zIndex: 9999
                    }}
                >
                    {/* Scale Loader */}

                    <div className='finance-scale-loader'>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                        <div></div>
                    </div>

                    {/* Text */}

                    <div
                        style={{
                            marginTop: '18px',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: '#505A5F',
                            letterSpacing: '0.3px'
                        }}
                    >
                        Loading Finance Module...
                    </div>

                    {/* CSS */}

                    <style>
                        {`

      .finance-scale-loader {

        display: flex;
        align-items: center;
        justify-content: center;

        gap: 5px;

        height: 40px;

      }

      .finance-scale-loader div {

  width: 6px;
  height: 100%;

  border-radius: 10px;

  background: linear-gradient(
        180deg,
        #D81B60 0%,
        #AD1457 100%
    );

    box-shadow:
        0 0 8px rgba(216, 27, 96, 0.25);

    animation:
        financeScale 1s infinite ease-in-out;

    }

      .finance-scale-loader div:nth-child(1) {
        animation-delay: -0.4s;
      }

      .finance-scale-loader div:nth-child(2) {
        animation-delay: -0.3s;
      }

      .finance-scale-loader div:nth-child(3) {
        animation-delay: -0.2s;
      }

      .finance-scale-loader div:nth-child(4) {
        animation-delay: -0.1s;
      }

      .finance-scale-loader div:nth-child(5) {
        animation-delay: 0s;
      }

      @keyframes financeScale {

        0%, 40%, 100% {

          transform: scaleY(0.4);

          opacity: 0.5;

        }

        20% {

          transform: scaleY(1);

          opacity: 1;

        }

      }

    `}
                    </style>
                </div>
            )}

            {/* ===================================== */}
            {/* IFRAME */}
            {/* ===================================== */}

            <iframe
                ref={iframeRef}
                name='erp_iframe'
                id='erp_iframe'
                title='Finance'
                onLoad={() => {
                    setIsLoading(false)

                    resizeIframe()

                    attachIframeTarget()
                }}
                style={{
                    width: '100%',
                    minHeight: '100vh',
                    border: 'none',
                    display: 'block',
                    overflow: 'hidden'
                }}
            />

            {/* ===================================== */}
            {/* HIDDEN FORM */}
            {/* ===================================== */}
            <form ref={formRef} action={erpUrl} method='POST' target='erp_iframe' style={{ display: 'none' }}>
                <input type='hidden' name='auth_token' value={authToken} />
                <input type='hidden' name='tenantId' value={tenantId} />
                <input type='hidden' name='locale' value={locale} />
                <input type='hidden' name='formPage' value='true' />
            </form>
        </div>
    )
}

export default FinanceIframe
