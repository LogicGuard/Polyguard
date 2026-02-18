
import React, { useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

// New Imports
import AuthModal from './landing/AuthModal';
import LandingNavbar from './landing/LandingNavbar';
import HeroSection from './landing/HeroSection';
import PricingSection from './landing/PricingSection';
import TrustedBy from './landing/TrustedBy';
import HowItWorks from './landing/HowItWorks';
import Testimonials from './landing/Testimonials';
import FAQ from './landing/FAQ';
import FeatureShowcase from './landing/FeatureShowcase';
import ContactModal from './landing/ContactModal';
import Footer from './landing/Footer';
import SecurityTicker from './landing/SecurityTicker';
import StatsGrid from './landing/StatsGrid';
import LiveAuditDemo from './landing/LiveAuditDemo';
import CTASection from './landing/CTASection';

interface LandingPageProps {
    onEnterApp: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnterApp }) => {
    const [isAuthOpen, setIsAuthOpen] = useState(false);
    const [isContactOpen, setIsContactOpen] = useState(false);
    const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');

    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    const openAuth = (mode: 'login' | 'signup') => {
        setAuthMode(mode);
        setIsAuthOpen(true);
    };

    const handleAuthSuccess = () => {
        setIsAuthOpen(false);
        onEnterApp();
    };

    return (
        <div className="min-h-screen bg-[#030303] text-[#EAEAEA] font-sans selection:bg-blue-500/30 selection:text-white overflow-x-hidden">
            
            {/* Global Overlays */}
            <div className="grain-overlay"></div>
            
            {/* Scroll Progress */}
            <motion.div
                className="fixed top-0 left-0 right-0 h-[2px] bg-blue-500 origin-left z-[1000]"
                style={{ scaleX }}
            />

            {/* Modals */}
            <AuthModal 
                isOpen={isAuthOpen} 
                onClose={() => setIsAuthOpen(false)} 
                initialMode={authMode}
                onSuccess={handleAuthSuccess}
            />
            <ContactModal 
                isOpen={isContactOpen}
                onClose={() => setIsContactOpen(false)}
            />

            {/* Expert Navbar & Ticker Container */}
            <div className="relative z-[110]">
              <LandingNavbar 
                  onOpenAuth={openAuth} 
                  onOpenContact={() => setIsContactOpen(true)} 
              />
              <div className="h-16 md:h-20"></div> {/* Reduced spacer for compact ticker */}
              <SecurityTicker />
            </div>

            {/* Overhauled Sections */}
            <HeroSection onStart={() => openAuth('signup')} />
            
            <TrustedBy />

            <StatsGrid />

            <div id="platform">
                <FeatureShowcase />
            </div>

            <LiveAuditDemo />

            <HowItWorks />

            <Testimonials />

            <PricingSection 
                onSelect={() => openAuth('signup')} 
                onContact={() => setIsContactOpen(true)}
            />

            <FAQ />

            <CTASection onStart={() => openAuth('signup')} />

            <Footer />
        </div>
    );
};

export default LandingPage;
