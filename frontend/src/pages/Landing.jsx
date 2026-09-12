import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sprout, 
  ScanLine, 
  Calculator, 
  TrendingUp, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Info, 
  ShieldCheck, 
  Layers, 
  Compass,
  ChevronRight,
  ExternalLink,
  Activity,
  Droplets,
  AlertTriangle,
  Pill,
  BarChart3,
  Sparkles,
  MapPin
} from 'lucide-react';
import useLanguage from '../hooks/useLanguage';

export const Landing = () => {
  const { t } = useLanguage();
  const [activeFeatureTab, setActiveFeatureTab] = useState('crop');

  const scrollToFeatures = () => {
    const el = document.getElementById('core-features');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const featureTabs = [
    { id: 'crop', label: t('features.tabs.crop'), icon: Sprout, path: '/crop-recommendation' },
    { id: 'disease', label: t('features.tabs.disease'), icon: ScanLine, path: '/disease-detection' },
    { id: 'cost', label: t('features.tabs.cost'), icon: Calculator, path: '/cost-estimation' },
    { id: 'price', label: t('features.tabs.price'), icon: TrendingUp, path: '/price-forecasting' },
    { id: 'chatbot', label: t('features.tabs.chatbot'), icon: Bot, path: '#chatbot' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. HERO SECTION: Full-Screen Cinematic Agricultural Video */}
      <section className="relative w-full min-h-[92vh] lg:min-h-screen flex items-center overflow-hidden -mt-20">
        {/* Full-Screen Edge-to-Edge Real Agricultural Video Background */}
        <video
          autoPlay
          muted
          loop
          playsInline
          poster="/images/hero-poster.jpg"
          className="absolute inset-0 w-full h-full object-cover object-[70%_center] filter brightness-[0.98]"
          aria-label="Real agricultural stock footage of golden wheat field in sunlight"
        >
          <source src="/videos/hero-farm.webm" type="video/webm" />
          <img
            src="/images/hero-poster.jpg"
            alt="Golden wheat field harvest"
            className="w-full h-full object-cover object-[70%_center]"
          />
        </video>

        {/* Directional gradient overlay: from-black/55 via-black/30 to-transparent */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/30 to-transparent pointer-events-none" />
        {/* Subtle bottom fade to transition gracefully into the following section */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-cream-100 to-transparent pointer-events-none" />

        {/* Hero Content: Placed directly over the video with generous whitespace */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 lg:pt-36 lg:pb-28 w-full">
          <div className="max-w-2xl space-y-6 sm:space-y-7 animate-fade-up">
            
            {/* Category Lead-in: Small and subtle */}
            <p className="text-[11px] sm:text-xs tracking-[0.25em] text-white/85 font-medium uppercase">
              INTELLIGENT AGRICULTURAL ADVISORY PLATFORM
            </p>

            {/* Main Editorial Serif Headline */}
            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-white tracking-tight leading-[1.16]">
              {t('hero.titlePrimary')}
              <span className="block text-cream-100 font-light mt-1.5">
                {t('hero.titleSecondary')}
              </span>
            </h1>

            {/* Concise Supporting Description */}
            <p className="text-sm sm:text-base lg:text-lg text-white/85 font-light leading-relaxed max-w-xl">
              {t('hero.valueProposition')}
            </p>

            {/* Subtle, Understated CTAs */}
            <div className="pt-2 flex flex-wrap items-center gap-3.5">
              <button
                type="button"
                onClick={scrollToFeatures}
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-white/95 hover:bg-white text-earth-dark text-xs sm:text-sm font-semibold transition-all duration-200 shadow-sm"
              >
                <span>{t('hero.exploreToolsBtn')}</span>
                <ChevronRight className="w-4 h-4 text-agri-700 ml-0.5" />
              </button>

              <Link
                to="/register"
                className="inline-flex items-center space-x-2 px-6 py-3 rounded-xl bg-black/25 hover:bg-black/40 text-white border border-white/25 hover:border-white/50 text-xs sm:text-sm font-medium transition-all duration-200 backdrop-blur-sm"
              >
                <span>{t('hero.createAccountBtn')}</span>
                <ArrowRight className="w-4 h-4 text-cream-200 ml-0.5" />
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* 2. TRANSITION SECTION: Key Platform Impact Metrics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-50 border border-cream-300 rounded-2xl p-6 sm:p-8 shadow-card space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-200 pb-4">
            <div className="flex items-center space-x-2 text-xs font-semibold uppercase tracking-wider text-agri-800">
              <Activity className="w-4 h-4 text-agri-600" />
              <span>Platform Agronomic Footprint</span>
            </div>
            <div className="inline-flex items-center space-x-2 text-xs text-earth-muted font-medium bg-cream-200/60 px-3 py-1 rounded-full border border-cream-300">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block animate-pulse" />
              <span>{t('transition.telemetryLive')}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-agri-700">
                {t('transition.stat1Value')}
              </div>
              <div className="text-sm font-bold text-earth-dark">
                {t('transition.stat1Label')}
              </div>
              <p className="text-xs text-earth-muted leading-relaxed">
                {t('transition.stat1Sub')}
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-agri-700">
                {t('transition.stat2Value')}
              </div>
              <div className="text-sm font-bold text-earth-dark">
                {t('transition.stat2Label')}
              </div>
              <p className="text-xs text-earth-muted leading-relaxed">
                {t('transition.stat2Sub')}
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-agri-700">
                {t('transition.stat3Value')}
              </div>
              <div className="text-sm font-bold text-earth-dark">
                {t('transition.stat3Label')}
              </div>
              <p className="text-xs text-earth-muted leading-relaxed">
                {t('transition.stat3Sub')}
              </p>
            </div>

            <div className="space-y-1">
              <div className="font-serif text-3xl sm:text-4xl font-bold text-agri-700">
                {t('transition.stat4Value')}
              </div>
              <div className="text-sm font-bold text-earth-dark">
                {t('transition.stat4Label')}
              </div>
              <p className="text-xs text-earth-muted leading-relaxed">
                {t('transition.stat4Sub')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. FIVE CORE ADVISORY CAPABILITIES SECTION */}
      <section id="core-features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-sage-100 text-agri-900 border border-sage-200 text-xs font-semibold uppercase tracking-wider">
            {t('features.sectionBadge')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-dark tracking-tight">
            {t('features.sectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-earth-muted">
            {t('features.sectionSubtitle')}
          </p>

          <div className="pt-1 flex justify-center">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-cream-200/90 border border-cream-300 text-xs text-earth-dark font-medium">
              <Info className="w-3.5 h-3.5 text-agri-700" />
              <span>{t('features.demoNotice')}</span>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs with clean horizontal scroll */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 border-b border-cream-300">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap transition-all duration-200 ${
                  isActive
                    ? 'bg-agri-600 text-cream-50 shadow-sm'
                    : 'text-earth-muted hover:text-earth-dark hover:bg-cream-200/70'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cream-50' : 'text-agri-600'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* High-Fidelity Feature Interactive Previews Box */}
        <div className="bg-white rounded-2xl border border-cream-300 shadow-card p-6 sm:p-8 transition-all duration-300">
          
          {/* TAB 1: CROP RECOMMENDATION */}
          {activeFeatureTab === 'crop' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-earth-dark">
                    {t('features.previews.crop.title')}
                  </h3>
                  <p className="mt-1 text-sm text-earth-muted max-w-2xl">
                    {t('features.previews.crop.description')}
                  </p>
                </div>
                <Link
                  to="/crop-recommendation"
                  className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-agri-600 text-cream-50 hover:bg-agri-700 shadow-card transition self-start sm:self-auto"
                >
                  <span>{t('features.previews.crop.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Soil Profile Inputs Display */}
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-earth-charcoal uppercase tracking-wider mb-3">
                      <span>{t('features.previews.crop.soilProfileLabel')}</span>
                      <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-900 border border-sage-200 text-[10px] font-semibold">
                        Alluvial Loam
                      </span>
                    </div>

                    <div className="space-y-3 text-xs">
                      <div>
                        <div className="flex justify-between text-earth-dark font-medium mb-1">
                          <span>Nitrogen (N)</span>
                          <span className="font-semibold text-agri-700">90 mg/kg (Optimal)</span>
                        </div>
                        <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-agri-600 h-2 rounded-full" style={{ width: '70%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-earth-dark font-medium mb-1">
                          <span>Phosphorus (P)</span>
                          <span className="font-semibold text-agri-700">42 mg/kg</span>
                        </div>
                        <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-agri-500 h-2 rounded-full" style={{ width: '55%' }} />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-earth-dark font-medium mb-1">
                          <span>Potassium (K)</span>
                          <span className="font-semibold text-agri-700">43 mg/kg</span>
                        </div>
                        <div className="w-full bg-cream-200 h-2 rounded-full overflow-hidden">
                          <div className="bg-agri-600 h-2 rounded-full" style={{ width: '60%' }} />
                        </div>
                      </div>

                      <div className="pt-2 grid grid-cols-2 gap-2 text-[11px] text-earth-muted">
                        <div className="p-2 bg-white rounded border border-cream-200">
                          <span className="block font-semibold text-earth-dark">pH Reaction</span>
                          <span>6.5 (Neutral-Ideal)</span>
                        </div>
                        <div className="p-2 bg-white rounded border border-cream-200">
                          <span className="block font-semibold text-earth-dark">Seasonal Rain</span>
                          <span>200 mm Avg</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5 pt-2 border-t border-cream-200">
                    <Info className="w-3.5 h-3.5 text-agri-600" />
                    <span>Run the live calculator to submit laboratory test readings.</span>
                  </div>
                </div>

                {/* Recommendation Output Card */}
                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 sm:p-6 border border-cream-300 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-agri-800 uppercase tracking-wider mb-3">
                      <span>Agronomic Suitability Verdict</span>
                      <span className="px-2.5 py-1 rounded-full bg-sage-200 text-agri-900 border border-sage-300 text-xs font-semibold">
                        {t('features.previews.crop.suitability')}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-sage-300 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="p-2.5 bg-agri-50 border border-agri-200 text-agri-700 rounded-xl">
                            <Sprout className="w-6 h-6" />
                          </div>
                          <div>
                            <h4 className="font-serif text-xl font-bold text-earth-dark">
                              {t('features.previews.crop.resultHeading')}
                            </h4>
                            <span className="text-xs text-agri-700 font-medium">
                              {t('features.previews.crop.season')}
                            </span>
                          </div>
                        </div>
                        <span className="hidden sm:inline-block px-2.5 py-1 bg-agri-100 text-agri-800 text-xs font-semibold rounded-md border border-agri-200">
                          High Yield Potential
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                        {t('features.previews.crop.resultSubtext')}
                      </p>

                      <div className="pt-2 border-t border-cream-200 grid grid-cols-2 gap-2 text-xs text-earth-charcoal font-medium">
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
                          <span>Water: 450-650 mm</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-agri-600" />
                          <span>Soil: Loam / Alluvial</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-earth-muted pt-2 border-t border-cream-200">
                    <span>Multi-variable random forest prediction engine</span>
                    <Link to="/crop-recommendation" className="text-agri-700 font-semibold hover:underline flex items-center">
                      <span>Test Soil Parameters</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DISEASE DETECTION */}
          {activeFeatureTab === 'disease' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-earth-dark">
                    {t('features.previews.disease.title')}
                  </h3>
                  <p className="mt-1 text-sm text-earth-muted max-w-2xl">
                    {t('features.previews.disease.description')}
                  </p>
                </div>
                <Link
                  to="/disease-detection"
                  className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-agri-600 text-cream-50 hover:bg-agri-700 shadow-card transition self-start sm:self-auto"
                >
                  <span>{t('features.previews.disease.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Visual Viewport with Scanning Target Overlay */}
                <div className="lg:col-span-5 bg-agri-950 rounded-xl overflow-hidden border border-cream-300 relative aspect-video sm:aspect-auto sm:h-72 lg:h-80 shadow-card flex items-center justify-center group">
                  <img
                    src="/images/leaf-specimen.jpg"
                    alt="Close-up inspection of diseased crop leaf"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                  {/* Subtle animated scanline */}
                  <div className="absolute left-0 right-0 h-0.5 bg-emerald-400 shadow-[0_0_8px_#34d399] animate-scanline pointer-events-none" />

                  {/* Foliar Target Viewfinder */}
                  <div className="absolute inset-6 border border-dashed border-emerald-400/60 rounded-lg pointer-events-none flex flex-col justify-between p-2">
                    <div className="flex justify-between items-center text-[10px] font-mono text-emerald-300 bg-agri-950/70 px-2 py-0.5 rounded backdrop-blur-sm w-fit">
                      TARGET: FOLIAR BLIGHT REGION
                    </div>
                    <div className="self-end text-[10px] font-mono text-emerald-300 bg-agri-950/70 px-2 py-0.5 rounded backdrop-blur-sm">
                      MATCH: 96.4%
                    </div>
                  </div>
                </div>

                {/* Diagnostics Report */}
                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 sm:p-6 border border-cream-300 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-harvest-600 uppercase tracking-wider mb-3">
                      <span>{t('features.previews.disease.scanStatus')}</span>
                      <span className="px-2.5 py-1 rounded-full bg-terracotta-50 text-terracotta-700 border border-red-200 text-xs font-semibold">
                        {t('features.previews.disease.confidence')}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-cream-300 shadow-sm space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <AlertTriangle className="w-5 h-5 text-harvest-600" />
                        <h4 className="font-serif text-lg font-bold text-earth-dark">
                          {t('features.previews.disease.resultHeading')}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                        {t('features.previews.disease.resultSubtext')}
                      </p>

                      <div className="p-3 bg-cream-100 rounded-lg border border-cream-200 space-y-1.5">
                        <span className="text-xs font-bold text-agri-800 uppercase flex items-center space-x-1.5">
                          <Pill className="w-3.5 h-3.5 text-agri-600" />
                          <span>{t('features.previews.disease.remedyLabel')}</span>
                        </span>
                        <ul className="text-xs text-earth-charcoal space-y-1 list-disc list-inside">
                          <li>Apply organic copper hydroxide / mancozeb protective spray at 7-day intervals.</li>
                          <li>Improve air circulation by pruning infected lower canopy foliage.</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-earth-muted pt-2 border-t border-cream-200">
                    <span>Convolutional neural network leaf model</span>
                    <Link to="/disease-detection" className="text-agri-700 font-semibold hover:underline flex items-center">
                      <span>Upload Leaf Photo</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COST ESTIMATION */}
          {activeFeatureTab === 'cost' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-earth-dark">
                    {t('features.previews.cost.title')}
                  </h3>
                  <p className="mt-1 text-sm text-earth-muted max-w-2xl">
                    {t('features.previews.cost.description')}
                  </p>
                </div>
                <Link
                  to="/cost-estimation"
                  className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-agri-600 text-cream-50 hover:bg-agri-700 shadow-card transition self-start sm:self-auto"
                >
                  <span>{t('features.previews.cost.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Itemized Allocation Ledger */}
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-earth-charcoal uppercase tracking-wider mb-2">
                      <span>{t('features.previews.cost.budgetSummary')}</span>
                      <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px] font-semibold">
                        {t('features.previews.cost.landUnit')}
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="flex justify-between items-center p-2 bg-white rounded border border-cream-200">
                        <span className="text-earth-dark font-medium">Seeds & Saplings</span>
                        <span className="font-bold text-earth-dark">₹6,000 (14%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border border-cream-200">
                        <span className="text-earth-dark font-medium">Fertilizers & Nutrients</span>
                        <span className="font-bold text-earth-dark">₹12,500 (29%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border border-cream-200">
                        <span className="text-earth-dark font-medium">Farm Labor & Tillage</span>
                        <span className="font-bold text-earth-dark">₹11,000 (26%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border border-cream-200">
                        <span className="text-earth-dark font-medium">Machinery & Fuel</span>
                        <span className="font-bold text-earth-dark">₹8,000 (19%)</span>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-white rounded border border-cream-200">
                        <span className="text-earth-dark font-medium">Irrigation & Power</span>
                        <span className="font-bold text-earth-dark">₹5,000 (12%)</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5 pt-2 border-t border-cream-200">
                    <Info className="w-3.5 h-3.5 text-agri-600" />
                    <span>Cost models calibrated with regional input and labor rates.</span>
                  </div>
                </div>

                {/* Financial Overview Card */}
                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 sm:p-6 border border-cream-300 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-agri-800 uppercase tracking-wider mb-3">
                      <span>Profitability Ledger</span>
                      <span className="px-2.5 py-1 rounded-full bg-sage-200 text-agri-900 border border-sage-300 text-xs font-semibold">
                        {t('features.previews.cost.margin')}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-cream-300 shadow-sm space-y-3">
                      <div className="flex items-center space-x-2.5">
                        <Calculator className="w-5 h-5 text-agri-700" />
                        <h4 className="font-serif text-lg font-bold text-earth-dark">
                          {t('features.previews.cost.resultHeading')}
                        </h4>
                      </div>

                      <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                        {t('features.previews.cost.resultSubtext')}
                      </p>

                      <div className="grid grid-cols-3 gap-2.5 pt-2 border-t border-cream-200 text-center">
                        <div className="p-2.5 bg-cream-100 rounded-lg border border-cream-200">
                          <span className="block text-[10px] text-earth-muted uppercase font-semibold">Expenditure</span>
                          <span className="font-serif text-sm sm:text-base font-bold text-earth-dark">₹42,500</span>
                        </div>
                        <div className="p-2.5 bg-agri-50 rounded-lg border border-agri-200">
                          <span className="block text-[10px] text-agri-800 uppercase font-semibold">Gross Return</span>
                          <span className="font-serif text-sm sm:text-base font-bold text-agri-900">₹70,125</span>
                        </div>
                        <div className="p-2.5 bg-sage-100 rounded-lg border border-sage-200">
                          <span className="block text-[10px] text-agri-900 uppercase font-semibold">Net Profit</span>
                          <span className="font-serif text-sm sm:text-base font-bold text-agri-900">₹27,625</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-earth-muted pt-2 border-t border-cream-200">
                    <span>Comprehensive multi-crop budgeting engine</span>
                    <Link to="/cost-estimation" className="text-agri-700 font-semibold hover:underline flex items-center">
                      <span>Calculate Plot Budget</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PRICE FORECASTING */}
          {activeFeatureTab === 'price' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-earth-dark">
                    {t('features.previews.price.title')}
                  </h3>
                  <p className="mt-1 text-sm text-earth-muted max-w-2xl">
                    {t('features.previews.price.description')}
                  </p>
                </div>
                <Link
                  to="/price-forecasting"
                  className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-agri-600 text-cream-50 hover:bg-agri-700 shadow-card transition self-start sm:self-auto"
                >
                  <span>{t('features.previews.price.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Mandi Search & Filters */}
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-earth-charcoal uppercase tracking-wider mb-2">
                      <span>Mandi Parameters</span>
                      <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-900 border border-sage-200 text-[10px] font-semibold">
                        Maharashtra APMC
                      </span>
                    </div>

                    <div className="space-y-2.5 text-xs">
                      <div className="p-2.5 bg-white rounded border border-cream-200">
                        <span className="text-earth-muted block text-[10px] uppercase font-semibold">Commodity Target</span>
                        <span className="font-bold text-earth-dark">Wheat / Sharbati Variety</span>
                      </div>
                      <div className="p-2.5 bg-white rounded border border-cream-200">
                        <span className="text-earth-muted block text-[10px] uppercase font-semibold">APMC Market Yard</span>
                        <span className="font-bold text-earth-dark">{t('features.previews.price.marketSummary')}</span>
                      </div>
                      <div className="p-2.5 bg-white rounded border border-cream-200">
                        <span className="text-earth-muted block text-[10px] uppercase font-semibold">Forecast Horizon</span>
                        <span className="font-bold text-earth-dark">{t('features.previews.price.horizon')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5 pt-2 border-t border-cream-200">
                    <Info className="w-3.5 h-3.5 text-agri-600" />
                    <span>Real-time models sync with historical mandi arrival volumes.</span>
                  </div>
                </div>

                {/* Price Trajectory Chart & Rate */}
                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 sm:p-6 border border-cream-300 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-agri-800 uppercase tracking-wider mb-3">
                      <span>Seasonal Forecast Curve</span>
                      <span className="px-2.5 py-1 rounded-full bg-sage-100 text-agri-800 border border-sage-200 text-xs font-semibold">
                        {t('features.previews.price.trend')}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-cream-300 shadow-sm space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2.5">
                          <TrendingUp className="w-5 h-5 text-agri-700" />
                          <h4 className="font-serif text-lg font-bold text-earth-dark">
                            {t('features.previews.price.resultHeading')}
                          </h4>
                        </div>
                        <span className="text-xs font-bold text-agri-700 bg-agri-50 px-2.5 py-1 rounded border border-agri-200">
                          +₹170/q (+7.2%)
                        </span>
                      </div>

                      {/* Stylized Visual Trend Line Graphic */}
                      <div className="h-20 w-full bg-cream-100/70 rounded-lg border border-cream-200 flex items-center px-4 py-2">
                        <svg className="w-full h-14" viewBox="0 0 320 48" fill="none">
                          <path
                            d="M 10 36 C 50 30 90 22 130 24 C 170 26 210 12 250 16 C 280 18 310 10 310 10"
                            stroke="#2F5D50"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                          />
                          <path
                            d="M 190 12 C 230 8 270 12 310 8"
                            stroke="#A4B69A"
                            strokeWidth="2"
                            strokeDasharray="4 4"
                          />
                          <circle cx="310" cy="10" r="4" fill="#2F5D50" stroke="#FBF9F5" strokeWidth="2" />
                        </svg>
                      </div>

                      <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                        {t('features.previews.price.resultSubtext')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-earth-muted pt-2 border-t border-cream-200">
                    <span>APMC time-series autoregressive forecasting</span>
                    <Link to="/price-forecasting" className="text-agri-700 font-semibold hover:underline flex items-center">
                      <span>Explore Mandi Trends</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI CHATBOT */}
          {activeFeatureTab === 'chatbot' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-cream-200">
                <div>
                  <h3 className="font-serif text-xl sm:text-2xl font-bold text-earth-dark">
                    {t('features.previews.chatbot.title')}
                  </h3>
                  <p className="mt-1 text-sm text-earth-muted max-w-2xl">
                    {t('features.previews.chatbot.description')}
                  </p>
                </div>
                <a
                  href="#chatbot"
                  className="inline-flex items-center space-x-1.5 px-4.5 py-2.5 text-xs sm:text-sm font-semibold rounded-lg bg-agri-600 text-cream-50 hover:bg-agri-700 shadow-card transition self-start sm:self-auto"
                >
                  <span>{t('features.previews.chatbot.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4 ml-1" />
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                {/* Farmer Query Simulator */}
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-earth-charcoal uppercase tracking-wider mb-2">
                      <span>Farmer Inquiry Prompt</span>
                      <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px] font-semibold">
                        Bilingual NLP
                      </span>
                    </div>

                    <div className="p-3.5 bg-white rounded-xl border border-cream-200 text-xs sm:text-sm text-earth-dark leading-relaxed font-medium">
                      "{t('features.previews.chatbot.userQuery')}"
                    </div>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5 pt-2 border-t border-cream-200">
                    <Sparkles className="w-3.5 h-3.5 text-agri-600" />
                    <span>Supports voice & natural language inputs in English and Hindi.</span>
                  </div>
                </div>

                {/* Structured Advisory Response */}
                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 sm:p-6 border border-cream-300 space-y-4 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-agri-800 uppercase tracking-wider mb-3">
                      <span>Agronomic Advisory Protocol</span>
                      <span className="px-2.5 py-1 rounded-full bg-sage-100 text-agri-900 border border-sage-200 text-xs font-semibold">
                        {t('features.previews.chatbot.badge')}
                      </span>
                    </div>

                    <div className="p-4 bg-white rounded-xl border border-sage-300 shadow-sm space-y-2.5">
                      <div className="flex items-center space-x-2 text-agri-700">
                        <Bot className="w-5 h-5" />
                        <h4 className="font-serif text-sm font-bold text-earth-dark">
                          AgriTech Field Assistant Response
                        </h4>
                      </div>
                      <p className="text-xs sm:text-sm text-earth-dark leading-relaxed bg-cream-50 p-3.5 rounded-lg border border-cream-200">
                        {t('features.previews.chatbot.botResponse')}
                      </p>
                      <p className="text-[11px] text-earth-muted pt-1">
                        {t('features.previews.chatbot.resultSubtext')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-earth-muted pt-2 border-t border-cream-200">
                    <span>24/7 agricultural advisory microservice</span>
                    <a href="#chatbot" className="text-agri-700 font-semibold hover:underline flex items-center">
                      <span>Launch AI Assistant</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* 5-Feature Direct Directory Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 pt-4">
          {featureTabs.map((item) => {
            const Icon = item.icon;
            const isSelected = activeFeatureTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveFeatureTab(item.id)}
                className={`p-4 rounded-xl border text-left transition-card ${
                  isSelected
                    ? 'bg-cream-50 border-agri-600 shadow-sm ring-1 ring-agri-600'
                    : 'bg-white border-cream-300 hover:border-sage-400 hover:bg-cream-50/70 hover:shadow-card'
                }`}
              >
                <div className="p-2 w-fit rounded-lg bg-agri-50 text-agri-700 border border-agri-200 mb-2.5">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="font-serif text-sm font-bold text-earth-dark">
                  {item.label}
                </h4>
                <div className="mt-2 text-xs font-semibold text-agri-700 flex items-center space-x-1">
                  <span>View preview</span>
                  <ChevronRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 4. AGRONOMIC PRINCIPLES & SCIENTIFIC INTEGRITY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-agri-950 rounded-3xl p-8 sm:p-12 text-cream-200 border border-agri-900 shadow-xl">
          <div className="max-w-2xl mx-auto text-center mb-10 space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-sage-300">
              {t('pillars.badge')}
            </span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cream-50">
              {t('pillars.title')}
            </h3>
            <p className="text-xs sm:text-sm text-cream-300">
              {t('pillars.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 bg-agri-900/60 p-6 rounded-2xl border border-agri-800">
              <div className="inline-flex p-2.5 rounded-xl bg-agri-800 text-sage-300 border border-agri-700">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-cream-50">
                {t('pillars.p1Title')}
              </h4>
              <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                {t('pillars.p1Desc')}
              </p>
            </div>

            <div className="space-y-3 bg-agri-900/60 p-6 rounded-2xl border border-agri-800">
              <div className="inline-flex p-2.5 rounded-xl bg-agri-800 text-sage-300 border border-agri-700">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-cream-50">
                {t('pillars.p2Title')}
              </h4>
              <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                {t('pillars.p2Desc')}
              </p>
            </div>

            <div className="space-y-3 bg-agri-900/60 p-6 rounded-2xl border border-agri-800">
              <div className="inline-flex p-2.5 rounded-xl bg-agri-800 text-sage-300 border border-agri-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-cream-50">
                {t('pillars.p3Title')}
              </h4>
              <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                {t('pillars.p3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ONBOARDING CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-50 border border-cream-300 rounded-3xl p-8 sm:p-12 text-center space-y-4 shadow-card">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-earth-dark">
            {t('cta.heading')}
          </h3>
          <p className="text-sm sm:text-base text-earth-muted max-w-xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3.5">
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
        </div>
      </section>
    </div>
  );
};

export default Landing;
