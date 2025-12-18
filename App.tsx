import React, { Suspense, useState, useEffect, useCallback, memo } from 'react';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Canvas } from '@react-three/fiber';
import { SceneWrapper } from './components/Scene';
import { CustomCursor } from './components/CustomCursor';
import { GrainOverlay } from './components/GrainOverlay';
import { Loader } from './components/Loader';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from './components/Navbar';
import { TransitionCurtain } from './components/TransitionCurtain';
import { ProjectsPage, AboutPage, ContactPage, PrivacyPolicyPage } from './components/ContentPages';
import { MobileSwipeScroll } from './components/MobileSwipeScroll';
import { ScrollToTop } from './components/ScrollToTop';
import { ViewState } from './types';

const useIsMobile = () => {
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.innerWidth <= 768;
        }
        return false;
    });

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);
    return isMobile;
};

const useIsTablet = () => {
    const [isTablet, setIsTablet] = useState(() => {
        if (typeof window !== 'undefined') {
            const width = window.innerWidth;
            return width > 768 && width <= 1024;
        }
        return false;
    });

    useEffect(() => {
        const checkTablet = () => {
            const width = window.innerWidth;
            setIsTablet(width > 768 && width <= 1024);
        };
        window.addEventListener('resize', checkTablet);
        return () => window.removeEventListener('resize', checkTablet);
    }, []);
    return isTablet;
};

const pathToView = (path: string): ViewState => {
    switch (path) {
        case '/product':
            return 'PRODUCT';
        case '/about':
            return 'ABOUT_US';
        case '/contact':
            return 'CONTACT';
        case '/privacy':
            return 'PRIVACY_POLICY';
        default:
            return 'HOME';
    }
};

const viewToPath = (view: ViewState): string => {
    switch (view) {
        case 'PRODUCT':
            return '/product';
        case 'ABOUT_US':
            return '/about';
        case 'CONTACT':
            return '/contact';
        case 'PRIVACY_POLICY':
            return '/privacy';
        default:
            return '/';
    }
};

const App = () => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [targetView, setTargetView] = useState<ViewState>('HOME');
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [isCanvasVisible, setIsCanvasVisible] = useState(true);
    const [resetKey, setResetKey] = useState(0);
    const isMobile = useIsMobile();
    const isTablet = useIsTablet();
    const shouldUseMobileLayout = isMobile || isTablet;
    const navigate = useNavigate();
    const location = useLocation();
    const view = pathToView(location.pathname);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 2000);
        return () => clearTimeout(timer);
    }, []);

    const handleNavigate = useCallback((newView: ViewState) => {
        if (isTransitioning) return;
        if (newView === view && newView !== 'HOME') return;

        setTargetView(newView);
        setIsTransitioning(true);

        setTimeout(() => {
            setIsCanvasVisible(false);

            if (newView === view) {
                setResetKey(prev => prev + 1);
            } else {
                navigate(viewToPath(newView));
            }

            setTimeout(() => {
                setIsCanvasVisible(true);
                setIsTransitioning(false);
            }, 150);

        }, 1050);
    }, [isTransitioning, view, navigate]);

    return (
        <div className={`w-full h-screen bg-[#050505] text-white overflow-hidden relative ${shouldUseMobileLayout ? '' : 'cursor-none'}`}>
            <ScrollToTop />
            <GrainOverlay />

            {view === 'HOME' && (
                <Helmet>
                    <title>株式会社ドットファウンド（.Found Inc.）| AI・テクノロジーで人の心を起点とした革新的なソリューション | 静岡県富士宮市</title>
                    <meta name="description" content="株式会社ドットファウンドは、AI・テクノロジーの力で人の心を起点とした革新的なソリューションを提供します。静岡県富士宮市発のテックカンパニー。" />
                    <meta property="og:title" content="株式会社ドットファウンド（.Found Inc.）" />
                    <meta property="og:description" content="株式会社ドットファウンドは、AI・テクノロジーの力で人の心を起点とした革新的なソリューションを提供します。静岡県富士宮市発のテックカンパニー。" />
                    <meta property="og:url" content="https://www.dotfound.co.jp/" />
                </Helmet>
            )}

            {!shouldUseMobileLayout && <CustomCursor />}

            <AnimatePresence>
                {!isLoaded && <Loader key="loader" />}
            </AnimatePresence>

            <Navbar currentView={view} onNavigate={handleNavigate} />

            <TransitionCurtain isVisible={isTransitioning} targetView={targetView} />

            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={null} />
                    <Route path="/product" element={<div className="absolute inset-0 z-20 pointer-events-auto overflow-y-auto overscroll-contain"><div className="min-h-full"><ProjectsPage onNavigate={handleNavigate} /></div></div>} />
                    <Route path="/about" element={<div className="absolute inset-0 z-20 pointer-events-auto overflow-y-auto overscroll-contain"><div className="min-h-full"><AboutPage onNavigate={handleNavigate} /></div></div>} />
                    <Route path="/contact" element={<div className="absolute inset-0 z-20 pointer-events-auto overflow-y-auto overscroll-contain"><div className="min-h-full"><ContactPage onNavigate={handleNavigate} /></div></div>} />
                    <Route path="/privacy" element={<div className="absolute inset-0 z-20 pointer-events-auto overflow-y-auto overscroll-contain"><div className="min-h-full"><PrivacyPolicyPage onNavigate={handleNavigate} /></div></div>} />
                    <Route path="*" element={null} />
                </Routes>
            </AnimatePresence>

            {view === 'HOME' && shouldUseMobileLayout ? (
                <div className={`absolute inset-0 z-0 transition-opacity duration-75 ${isCanvasVisible ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'opacity', transform: 'translateZ(0)' }}>
                    <MobileSwipeScroll key={`mobile-home-${resetKey}`} onNavigate={handleNavigate} />
                </div>
            ) : (
                <div className={`absolute inset-0 z-0 transition-opacity duration-75 ${isCanvasVisible ? 'opacity-100' : 'opacity-0'}`} style={{ willChange: 'opacity', transform: 'translateZ(0)' }}>
                    <Canvas
                        dpr={[1, 2]}
                        camera={{ position: [0, 0, 5], fov: 45 }}
                        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
                        className="w-full h-full"
                    >
                        <Suspense fallback={null}>
                            <SceneWrapper
                                key={`scene-${view}-${resetKey}`}
                                mode={view === 'HOME' ? 'HOME' : 'AMBIENT'}
                                onNavigate={handleNavigate}
                            />
                        </Suspense>
                    </Canvas>
                </div>
            )}
        </div>
    );
};

export default App;
