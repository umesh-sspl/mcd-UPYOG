import React, { useEffect, useRef, useState } from 'react';

/**
 * Created by: Umesh Kumar on 02/05/2026.
 * FinanceIframe Component
 * Integrates the legacy Finance ERP via a POST-authenticated iframe.
 * Includes dynamic resizing, error detection, and navigation containment.
 */
const FinanceIframe = () => {
    const iframeRef = useRef(null);
    const formRef = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showInvalidRoute, setShowInvalidRoute] = useState(false);

    // --- Context & Auth Extraction ---
    const authToken = window.Digit?.UserService?.getUser()?.access_token || '';
    const tenantId = window.Digit?.ULBService?.getCurrentTenantId() || '';
    const locale = window.Digit?.SessionStorage?.get('locale') || 'en_IN';
    const erpUrl = window.location.pathname.replace('/digit-ui/employee/finance', '');

    // --- Core Logic ---

    const resizeIframe = () => {
        try {
            const iframe = iframeRef.current;
            if (!iframe) return;

            const iframeDoc = iframe.contentWindow.document;
            const isErrorPage = iframeDoc.body.classList.contains("finance-error-page");

            if (isErrorPage) {
                Object.assign(iframe.style, { 
                    height: "100vh", minHeight: "100vh", maxHeight: "100vh", 
                    overflow: "hidden", display: "block" 
                });
                return;
            }

            const { body, documentElement: html } = iframeDoc;
            const height = Math.max(
                body.scrollHeight, body.offsetHeight,
                html.clientHeight, html.scrollHeight, html.offsetHeight
            );

            iframe.style.height = iframe.style.minHeight = `${height + 20}px`;
        } catch (e) {
            console.warn("Unable to resize iframe:", e);
        }
    };

    const attachIframeTarget = () => {
        try {
            const iframeDoc = iframeRef.current?.contentWindow.document;
            if (!iframeDoc) return;

            iframeDoc.querySelectorAll('a').forEach(link => {
                const href = link.getAttribute('href');
                if (href && !href.startsWith('javascript') && !href.startsWith('#')) {
                    link.setAttribute('target', 'erp_iframe');
                }
            });

            iframeDoc.querySelectorAll('form').forEach(form => form.setAttribute('target', 'erp_iframe'));
        } catch (e) {
            console.warn('Unable to attach iframe target:', e);
        }
    };

    const handleIframeLoad = () => {
        setIsLoading(false);
        try {
            const iframe = iframeRef.current;
            if (!iframe) return;

            const iframeDoc = iframe.contentWindow.document;
            const bodyText = iframeDoc.body.innerText || "";
            const title = iframeDoc.title || "";

            const isInvalidRoute = 
                bodyText.includes("500 Internal Server Error") || 
                bodyText.includes("404 Not Found") ||
                title.includes("500") || title.includes("404") || title.includes("nginx");

            setShowInvalidRoute(isInvalidRoute);

            if (isInvalidRoute) {
                iframe.style.display = "none";
            } else {
                iframe.style.display = "block";
                resizeIframe();
                attachIframeTarget();
            }
        } catch (e) {
            console.warn("Unable to inspect iframe:", e);
        }
    };

    // --- Effects ---

    useEffect(() => {
        if (formRef.current) {
            setIsLoading(true);
            setShowInvalidRoute(false);
            formRef.current.submit();

            const timer = setTimeout(() => {
                setIsLoading(false);
                resizeIframe();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [erpUrl]);

    useEffect(() => {
        document.body.style.margin = document.body.style.padding = '0';
        return () => { document.body.style.margin = document.body.style.padding = ''; };
    }, []);

    // --- Render Helpers ---

    const containerStyle = { position: 'relative', width: '100%', minHeight: '100vh', background: '#fff', overflow: 'hidden' };
    const overlayStyle = { position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'rgba(255,255,255,0.92)', zIndex: 9999 };
    const errorCardStyle = { width: "100%", maxWidth: "520px", background: "white", borderRadius: "24px", padding: "48px", textAlign: "center", boxShadow: "0 12px 40px rgba(0,0,0,0.08)" };

    return (
        <div style={containerStyle}>
            {/* LOADER */}
            {isLoading && (
                <div style={overlayStyle}>
                    <div className='finance-scale-loader'><div/><div/><div/><div/><div/></div>
                    <div style={{ marginTop: '18px', fontSize: '14px', fontWeight: 500, color: '#505A5F', letterSpacing: '0.3px' }}>
                        Loading Finance Module...
                    </div>
                    <style>{`
                        .finance-scale-loader { display: flex; align-items: center; justify-content: center; gap: 5px; height: 40px; }
                        .finance-scale-loader div { width: 6px; height: 100%; border-radius: 10px; background: linear-gradient(180deg, #D81B60 0%, #AD1457 100%); box-shadow: 0 0 8px rgba(216, 27, 96, 0.25); animation: financeScale 1s infinite ease-in-out; }
                        .finance-scale-loader div:nth-child(1) { animation-delay: -0.4s; }
                        .finance-scale-loader div:nth-child(2) { animation-delay: -0.3s; }
                        .finance-scale-loader div:nth-child(3) { animation-delay: -0.2s; }
                        .finance-scale-loader div:nth-child(4) { animation-delay: -0.1s; }
                        .finance-scale-loader div:nth-child(5) { animation-delay: 0s; }
                        @keyframes financeScale { 0%, 40%, 100% { transform: scaleY(0.4); opacity: 0.5; } 20% { transform: scaleY(1); opacity: 1; } }
                    `}</style>
                </div>
            )}

            {/* INVALID ROUTE UI */}
            {showInvalidRoute && (
                <div style={{ ...overlayStyle, background: "linear-gradient(135deg,#F7F8FA,#EEF1F5)", zIndex: 9998, padding: "40px" }}>
                    <div style={errorCardStyle}>
                        <div style={{ fontSize: "68px", marginBottom: "24px" }}>📄</div>
                        <div style={{ fontSize: "28px", fontWeight: 700, color: "#222", marginBottom: "16px" }}>Page Not Available</div>
                        <div style={{ color: "#666", lineHeight: "1.8", fontSize: "15px" }}>
                            The requested Finance page does not exist or may have been removed. Please verify the menu or contact your administrator.
                        </div>
                        <button 
                            onClick={() => window.history.back()}
                            style={{ marginTop: "32px", background: "linear-gradient(135deg,#D81B60,#AD1457)", color: "white", border: "none", borderRadius: "10px", padding: "14px 28px", fontSize: "14px", fontWeight: 600, cursor: "pointer", boxShadow: "0 8px 20px rgba(173,20,87,0.25)" }}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            )}

            {/* IFRAME */}
            <iframe
                ref={iframeRef}
                name='erp_iframe'
                id='erp_iframe'
                title='Finance'
                onLoad={handleIframeLoad}
                style={{ width: '100%', minHeight: '100vh', border: 'none', display: 'block', overflow: 'hidden' }}
            />

            {/* HIDDEN AUTH BRIDGE */}
            <form ref={formRef} action={erpUrl} method='POST' target='erp_iframe' style={{ display: 'none' }}>
                <input type='hidden' name='auth_token' value={authToken} />
                <input type='hidden' name='tenantId' value={tenantId} />
                <input type='hidden' name='locale' value={locale} />
                <input type='hidden' name='formPage' value='true' />
            </form>
        </div>
    );
};

export default FinanceIframe;