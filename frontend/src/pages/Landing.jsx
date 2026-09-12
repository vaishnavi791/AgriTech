import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  ChevronRight, 
  Volume2, 
  VolumeX, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import useInView from '../hooks/useInView';

export const Landing = () => {
  const { t } = useLanguage();

  // Audio Ambience State & Controller
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = new Audio('/wind-ambience.mp3');
    audio.loop = true;
    audio.volume = 0.12; // Subtle 10-15% ambient level
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, []);

  const toggleAudio = () => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsAudioPlaying(true))
        .catch(() => {
          // Handled if browser restricts playback
          setIsAudioPlaying(false);
        });
    }
  };

  const scrollToStory = () => {
    const el = document.getElementById('story-soil');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Scroll Viewport Observers for Cinematic Reveals
  const [soilRef, soilInView] = useInView({ threshold: 0.25 });
  const [diseaseRef, diseaseInView] = useInView({ threshold: 0.25 });
  const [costRef, costInView] = useInView({ threshold: 0.25 });
  const [marketRef, marketInView] = useInView({ threshold: 0.25 });
  const [copilotRef, copilotInView] = useInView({ threshold: 0.25 });

  return (
    <div className="w-full bg-cream-100 text-earth-dark selection:bg-sage-200 selection:text-agri-950 overflow-x-hidden">
      
      {/* ========================================================================= */}
      {/* 1. HERO: Full-Screen Agricultural Video with Transparent Nav & Audio      */}
      {/* ========================================================================= */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden -mt-20">
        {/* Full-Screen Real Agricultural Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] filter brightness-[0.96]"
          aria-label="Real agricultural stock footage of golden wheat harvest field"
        >
          <source src="/videos/hero-farm.webm" type="video/webm" />
          <img
            src="/images/hero-poster.jpg"
            alt="Golden wheat field harvest"
            className="w-full h-full object-cover object-[70%_center]"
          />
        </video>

        {/* Directional Vignette Overlay for Crisp Typography Contrast */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-cream-100 to-transparent pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-40 lg:pb-28 w-full">
          <div className="max-w-2xl space-y-6 sm:space-y-7 animate-fade-up">
            
            {/* Minimal Category Lead-in */}
            <p className="text-[11px] sm:text-xs tracking-[0.25em] text-cream-200/90 font-medium uppercase">
              {t('hero.badge')}
            </p>

            {/* Editorial Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.14]">
              {t('hero.titlePrimary')}
              <span className="block text-cream-100 font-light mt-2">
                {t('hero.titleSecondary')}
              </span>
            </h1>

            {/* Value Proposition */}
            <p className="text-sm sm:text-base lg:text-lg text-white/85 font-light leading-relaxed max-w-xl">
              {t('hero.valueProposition')}
            </p>

            {/* Understated CTAs & Sound Toggle */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={scrollToStory}
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-white/95 hover:bg-white text-earth-dark text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                <span>{t('story.scrollPrompt')}</span>
                <ChevronRight className="w-4 h-4 text-agri-700" />
              </button>

              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-6 py-3.5 rounded-xl bg-black/30 hover:bg-black/45 text-white border border-white/25 hover:border-white/50 text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                <span>{t('hero.createAccountBtn')}</span>
                <ArrowRight className="w-4 h-4 text-cream-200" />
              </Link>

              {/* Minimal Sound Toggle Integrated in Hero */}
              <button
                type="button"
                onClick={toggleAudio}
                className={`inline-flex items-center space-x-2 px-4 py-3 rounded-xl border text-xs font-medium backdrop-blur-md transition-all duration-200 ${
                  isAudioPlaying
                    ? 'bg-agri-600/90 border-agri-400 text-white'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white/85'
                }`}
                aria-label={t('story.audio.toggle')}
                title={t('story.audio.toggle')}
              >
                {isAudioPlaying ? (
                  <>
                    <Volume2 className="w-4 h-4 text-cream-100 animate-pulse" />
                    <span>{t('story.audio.playing')}</span>
                  </>
                ) : (
                  <>
                    <VolumeX className="w-4 h-4 text-white/80" />
                    <span>{t('story.audio.muted')}</span>
                  </>
                )}
              </button>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 2. CHAPTER 1: CROP & SOIL — Immersive Viewport Visual (NOT A CARD)         */}
      {/* ========================================================================= */}
      <section
        id="story-soil"
        ref={soilRef}
        className="relative w-full min-h-[85vh] lg:min-h-screen flex items-center overflow-hidden"
      >
        {/* Full-bleed agricultural soil landscape */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/images/soil-field.jpg"
            alt="Rich agricultural soil and cultivated field rows"
            className={`w-full h-full object-cover object-center filter brightness-[0.9] transition-transform duration-1000 ease-out ${
              soilInView ? 'scale-100' : 'scale-105'
            }`}
            loading="lazy"
          />
          {/* Deep dark gradient overlay allowing text to float naturally */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/20 lg:w-3/4 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream-100/30 to-transparent pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
        </div>

        {/* Layered Editorial Typography */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div
            className={`max-w-xl space-y-5 transition-all duration-1000 ease-out ${
              soilInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-300">
              {t('story.soil.tag')}
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.14]">
              {t('story.soil.headline')}
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-cream-200/90 font-light leading-relaxed">
              {t('story.soil.description')}
            </p>

            <div className="pt-2">
              <Link
                to="/crop-recommendation"
                className="inline-flex items-center space-x-2 text-sage-300 hover:text-white font-medium text-sm sm:text-base group transition-colors"
              >
                <span className="border-b border-sage-400/60 pb-0.5 group-hover:border-white">
                  {t('story.soil.cta')}
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 3. CHAPTER 2: PLANT HEALTH — Expansive Asymmetrical Split (NOT A CARD)    */}
      {/* ========================================================================= */}
      <section
        ref={diseaseRef}
        className="w-full min-h-[85vh] py-20 sm:py-28 lg:py-36 bg-cream-100 flex items-center border-t border-cream-300/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Airy Editorial Typography */}
            <div
              className={`lg:col-span-6 space-y-6 transition-all duration-1000 ease-out ${
                diseaseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-agri-700">
                {t('story.disease.tag')}
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-earth-dark tracking-tight leading-[1.16]">
                {t('story.disease.headline')}
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-earth-muted font-light leading-relaxed max-w-xl">
                {t('story.disease.description')}
              </p>

              <div className="pt-2">
                <Link
                  to="/disease-detection"
                  className="inline-flex items-center space-x-2 text-agri-700 hover:text-agri-950 font-semibold text-sm sm:text-base group transition-colors"
                >
                  <span className="border-b border-agri-600/50 pb-0.5 group-hover:border-agri-950">
                    {t('story.disease.cta')}
                  </span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Right Column: Dominant Macro Foliar Visual */}
            <div
              className={`lg:col-span-6 transition-all duration-1000 delay-150 ease-out ${
                diseaseInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="relative w-full aspect-[4/5] sm:aspect-[16/11] lg:aspect-[4/5] rounded-2xl overflow-hidden shadow-card group">
                <img
                  src="/images/leaf-specimen.jpg"
                  alt="Close-up inspection of healthy crop leaves in sunlight"
                  className="w-full h-full object-cover filter brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" />

                {/* Subtle Botanical Focus Marker */}
                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white/90 text-xs font-mono">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-sage-400 inline-block" />
                    <span>Foliar Pathology Detection</span>
                  </span>
                  <span className="text-white/70">Computer-Vision Model</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 4. CHAPTER 3: FARM ECONOMICS — Wide Cinematic Harvest Landscape           */}
      {/* ========================================================================= */}
      <section
        ref={costRef}
        className="relative w-full min-h-[85vh] flex items-center overflow-hidden"
      >
        {/* Wide harvest imagery background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          <img
            src="/images/harvest-field.jpg"
            alt="Agricultural field harvest and operational farming inputs"
            className={`w-full h-full object-cover object-center filter brightness-[0.88] transition-transform duration-1000 ease-out ${
              costInView ? 'scale-100' : 'scale-105'
            }`}
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/30 lg:w-3/4 pointer-events-none" />
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cream-100/40 to-transparent pointer-events-none" />
        </div>

        {/* Staggered Editorial Typography */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div
            className={`max-w-xl space-y-5 transition-all duration-1000 ease-out ${
              costInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-300">
              {t('story.cost.tag')}
            </p>

            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.14]">
              {t('story.cost.headline')}
            </h2>

            <p className="text-sm sm:text-base lg:text-lg text-cream-200/90 font-light leading-relaxed">
              {t('story.cost.description')}
            </p>

            <div className="pt-2">
              <Link
                to="/cost-estimation"
                className="inline-flex items-center space-x-2 text-sage-300 hover:text-white font-medium text-sm sm:text-base group transition-colors"
              >
                <span className="border-b border-sage-400/60 pb-0.5 group-hover:border-white">
                  {t('story.cost.cta')}
                </span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 5. CHAPTER 4: FROM FARM TO MARKET — Offset Harvest & Mandi Visual         */}
      {/* ========================================================================= */}
      <section
        ref={marketRef}
        className="w-full min-h-[85vh] py-20 sm:py-28 lg:py-36 bg-cream-50 flex items-center border-t border-cream-300/60"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Visual Column */}
            <div
              className={`lg:col-span-6 order-2 lg:order-1 transition-all duration-1000 ease-out ${
                marketInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden shadow-card group">
                <img
                  src="/images/market-produce.jpg"
                  alt="Harvested golden grain produce ready for mandi arrival"
                  className="w-full h-full object-cover filter brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />

                <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white/90 text-xs font-mono">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                    <span>APMC Mandi Intelligence</span>
                  </span>
                  <span className="text-white/70">Seasonal Price Series</span>
                </div>
              </div>
            </div>

            {/* Editorial Column */}
            <div
              className={`lg:col-span-6 order-1 lg:order-2 space-y-6 transition-all duration-1000 delay-150 ease-out ${
                marketInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-agri-700">
                {t('story.market.tag')}
              </p>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-earth-dark tracking-tight leading-[1.16]">
                {t('story.market.headline')}
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-earth-muted font-light leading-relaxed max-w-xl">
                {t('story.market.description')}
              </p>

              <div className="pt-2">
                <Link
                  to="/price-forecasting"
                  className="inline-flex items-center space-x-2 text-agri-700 hover:text-agri-950 font-semibold text-sm sm:text-base group transition-colors"
                >
                  <span className="border-b border-agri-600/50 pb-0.5 group-hover:border-agri-950">
                    {t('story.market.cta')}
                  </span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 6. CONVERSATIONAL COPILOT: Integrated Typographic Vignette (CARD-FREE)     */}
      {/* ========================================================================= */}
      <section
        ref={copilotRef}
        className="w-full bg-agri-950 text-cream-100 py-24 sm:py-32 border-y border-agri-900"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div
            className={`space-y-4 transition-all duration-1000 ease-out ${
              copilotInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-sage-300">
              {t('story.copilot.tag')}
            </p>

            <h3 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-cream-50 leading-tight">
              {t('story.copilot.headline')}
            </h3>
          </div>

          {/* Quiet Sample Dialogue Line */}
          <div
            className={`pt-2 space-y-4 max-w-2xl mx-auto text-left transition-all duration-1000 delay-150 ease-out ${
              copilotInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
            }`}
          >
            <div className="border-l-2 border-sage-500/50 pl-5 py-2 space-y-2">
              <p className="text-xs text-sage-300 font-mono">
                Farmer Inquiry:
              </p>
              <p className="text-sm sm:text-base text-white/90 font-light italic">
                {t('story.copilot.prompt')}
              </p>
            </div>

            <div className="border-l-2 border-cream-400/40 pl-5 py-2 space-y-2">
              <p className="text-xs text-cream-300 font-mono">
                AgriTech Advisory:
              </p>
              <p className="text-sm sm:text-base text-cream-100 font-light leading-relaxed">
                {t('story.copilot.response')}
              </p>
            </div>
          </div>

          {/* Minimal Assistant Launcher */}
          <div className="pt-4">
            <a
              href="#chatbot"
              className="inline-flex items-center space-x-2 text-sage-300 hover:text-white font-medium text-sm sm:text-base transition-colors"
            >
              <Sparkles className="w-4 h-4 text-sage-300" />
              <span className="border-b border-sage-400/50 pb-0.5 hover:border-white">
                {t('story.copilot.cta')}
              </span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 7. COMPACT 5-TOOL INDEX & SCIENTIFIC INTEGRITY CREDIT                      */}
      {/* ========================================================================= */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-6 text-center">
          
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-earth-muted">
            {t('story.index.label')}
          </p>

          {/* Minimal Single-Line Horizontal Tool Directory */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm text-earth-dark font-semibold">
            <Link
              to="/crop-recommendation"
              className="hover:text-agri-700 transition-colors border-b border-transparent hover:border-agri-700 pb-0.5"
            >
              {t('story.index.crop')}
            </Link>
            <span className="text-cream-400 hidden sm:inline">•</span>

            <Link
              to="/disease-detection"
              className="hover:text-agri-700 transition-colors border-b border-transparent hover:border-agri-700 pb-0.5"
            >
              {t('story.index.disease')}
            </Link>
            <span className="text-cream-400 hidden sm:inline">•</span>

            <Link
              to="/cost-estimation"
              className="hover:text-agri-700 transition-colors border-b border-transparent hover:border-agri-700 pb-0.5"
            >
              {t('story.index.cost')}
            </Link>
            <span className="text-cream-400 hidden sm:inline">•</span>

            <Link
              to="/price-forecasting"
              className="hover:text-agri-700 transition-colors border-b border-transparent hover:border-agri-700 pb-0.5"
            >
              {t('story.index.price')}
            </Link>
            <span className="text-cream-400 hidden sm:inline">•</span>

            <a
              href="#chatbot"
              className="hover:text-agri-700 transition-colors border-b border-transparent hover:border-agri-700 pb-0.5 flex items-center space-x-1"
            >
              <span>{t('story.index.chatbot')}</span>
              <ExternalLink className="w-3 h-3 text-earth-subtle" />
            </a>
          </div>

          {/* One-Line Scientific Integrity Credit (Replacing 3-Card Block) */}
          <p className="text-xs text-earth-muted/80 max-w-2xl mx-auto leading-relaxed pt-2">
            {t('story.scientificCredit')}
          </p>
        </div>
      </section>


      {/* ========================================================================= */}
      {/* 8. CLOSING ONBOARDING CALL TO ACTION                                      */}
      {/* ========================================================================= */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-24 text-center space-y-6">
        <h3 className="font-serif text-3xl sm:text-4xl font-normal text-earth-dark tracking-tight">
          {t('cta.heading')}
        </h3>
        <p className="text-sm sm:text-base text-earth-muted font-light max-w-xl mx-auto">
          {t('cta.description')}
        </p>
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/register"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-agri-600 hover:bg-agri-700 text-cream-50 text-sm font-semibold shadow-card hover:shadow-card-hover transition"
          >
            {t('cta.createAccount')}
          </Link>
          <Link
            to="/login"
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-white hover:bg-cream-100 text-earth-dark border border-cream-300 text-sm font-semibold transition"
          >
            {t('cta.signIn')}
          </Link>
        </div>
      </section>

    </div>
  );
};

export default Landing;
