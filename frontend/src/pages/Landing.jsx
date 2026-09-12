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
  ExternalLink
} from 'lucide-react';
import useLanguage from '../hooks/useLanguage';
import LanguageSwitcher from '../components/LanguageSwitcher';
import heroIllustration from '../assets/hero-illustration.svg';

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
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-cream-100 border-b border-cream-300 pt-10 pb-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Top Context Row: Platform Badge + Quick Language Switcher */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-sage-100 text-agri-800 border border-sage-200 text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-agri-600 inline-block animate-pulse" />
              <span>{t('hero.badge')}</span>
            </div>
            <div className="flex items-center space-x-2">
              <LanguageSwitcher size="sm" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6">
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-earth-dark tracking-tight leading-[1.2]">
                {t('hero.titlePrimary')}{' '}
                <span className="text-agri-600 block mt-1">
                  {t('hero.titleSecondary')}
                </span>
              </h1>

              <p className="text-base sm:text-lg text-earth-muted leading-relaxed max-w-2xl">
                {t('hero.valueProposition')}
              </p>

              {/* CTAs: Sign In & Create Account */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-cream-50 bg-agri-600 hover:bg-agri-700 rounded-lg shadow-card hover:shadow-card-hover transition-all duration-200"
                >
                  <span>{t('hero.createAccountBtn')}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>

                <Link
                  to="/login"
                  className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-agri-700 bg-cream-50 hover:bg-cream-200/80 border border-agri-600/40 rounded-lg shadow-card transition-all duration-200"
                >
                  <span>{t('hero.signInBtn')}</span>
                </Link>

                <button
                  type="button"
                  onClick={scrollToFeatures}
                  className="inline-flex items-center justify-center px-5 py-3 text-sm font-medium text-earth-muted hover:text-earth-dark transition-colors"
                >
                  <span>{t('hero.exploreToolsBtn')}</span>
                  <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              </div>

              {/* Factual Platform Tags (Strictly Non-marketing) */}
              <div className="pt-6 border-t border-cream-300/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-earth-muted font-medium">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0" />
                  <span>{t('hero.tags.bilingual')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0" />
                  <span>{t('hero.tags.webBased')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0" />
                  <span>{t('hero.tags.apmcData')}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-agri-600 flex-shrink-0" />
                  <span>{t('hero.tags.mlDiagnostics')}</span>
                </div>
              </div>
            </div>

            {/* Right Illustration Column */}
            <div className="lg:col-span-5">
              <div className="relative p-2 bg-cream-50 rounded-2xl border border-cream-300 shadow-card hover:shadow-card-hover transition-all duration-300">
                <img
                  src={heroIllustration}
                  alt="Agricultural landscape with terraced fields and crop observation telemetry"
                  className="w-full h-auto rounded-xl object-cover"
                  loading="eager"
                />
                <div className="px-4 py-3 bg-cream-100/90 border-t border-cream-200 rounded-b-xl flex items-center justify-between text-xs text-earth-muted">
                  <span className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-sage-500 inline-block" />
                    <span>AgriTech Agronomic Platform</span>
                  </span>
                  <span className="font-mono text-[11px] text-earth-subtle">
                    APMC & ML Reference Engine
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Five Core Advisory Capabilities Section */}
      <section id="core-features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-sage-100 text-agri-800 border border-sage-200 text-xs font-semibold uppercase tracking-wider">
            {t('features.sectionBadge')}
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-earth-dark tracking-tight">
            {t('features.sectionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-earth-muted">
            {t('features.sectionSubtitle')}
          </p>

          {/* Transparent Non-Live Demo Notice */}
          <div className="pt-1 flex justify-center">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-cream-200/90 border border-cream-300 text-xs text-earth-dark font-medium">
              <Info className="w-3.5 h-3.5 text-agri-700" />
              <span>{t('features.demoNotice')}</span>
            </div>
          </div>
        </div>

        {/* Feature Navigation Tabs */}
        <div className="flex items-center justify-start sm:justify-center overflow-x-auto pb-2 gap-2 border-b border-cream-300">
          {featureTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeFeatureTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFeatureTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 ${
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

        {/* Feature Interactive Demo Preview Box */}
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-agri-50 text-agri-700 hover:bg-agri-100 border border-agri-200 self-start sm:self-auto transition"
                >
                  <span>{t('features.previews.crop.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              {/* Generic Demo Preview Layout */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Inputs Placeholder */}
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-earth-muted uppercase">
                    <span>{t('features.previews.crop.inputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px]">
                      Generic Demo
                    </span>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-earth-dark">
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.crop.param1')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.crop.param2')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.crop.param3')}
                    </div>
                  </div>
                </div>

                {/* Output Placeholder */}
                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-agri-800 uppercase">
                    <span>{t('features.previews.crop.outputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-800 border border-sage-200 text-[10px]">
                      Illustrative Only
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-sage-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-agri-700">
                      <Sprout className="w-5 h-5" />
                      <h4 className="font-serif text-lg font-bold text-earth-dark">
                        {t('features.previews.crop.resultHeading')}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                      {t('features.previews.crop.resultSubtext')}
                    </p>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Run the live calculator to submit exact local soil laboratory metrics.</span>
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-agri-50 text-agri-700 hover:bg-agri-100 border border-agri-200 self-start sm:self-auto transition"
                >
                  <span>{t('features.previews.disease.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-earth-muted uppercase">
                    <span>{t('features.previews.disease.inputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px]">
                      Generic Demo
                    </span>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-earth-dark">
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.disease.param1')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.disease.param2')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.disease.param3')}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-agri-800 uppercase">
                    <span>{t('features.previews.disease.outputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-800 border border-sage-200 text-[10px]">
                      Illustrative Only
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-sage-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-agri-700">
                      <ScanLine className="w-5 h-5" />
                      <h4 className="font-serif text-lg font-bold text-earth-dark">
                        {t('features.previews.disease.resultHeading')}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                      {t('features.previews.disease.resultSubtext')}
                    </p>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Upload leaf photos in the diagnosis tool to analyze visual pathology patterns.</span>
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-agri-50 text-agri-700 hover:bg-agri-100 border border-agri-200 self-start sm:self-auto transition"
                >
                  <span>{t('features.previews.cost.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-earth-muted uppercase">
                    <span>{t('features.previews.cost.inputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px]">
                      Generic Demo
                    </span>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-earth-dark">
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.cost.param1')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.cost.param2')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.cost.param3')}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-agri-800 uppercase">
                    <span>{t('features.previews.cost.outputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-800 border border-sage-200 text-[10px]">
                      Illustrative Only
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-sage-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-agri-700">
                      <Calculator className="w-5 h-5" />
                      <h4 className="font-serif text-lg font-bold text-earth-dark">
                        {t('features.previews.cost.resultHeading')}
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                      {t('features.previews.cost.resultSubtext')}
                    </p>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Enter your exact land acreage and regional input rates in the cost planner.</span>
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-agri-50 text-agri-700 hover:bg-agri-100 border border-agri-200 self-start sm:self-auto transition"
                >
                  <span>{t('features.previews.price.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-earth-muted uppercase">
                    <span>{t('features.previews.price.inputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px]">
                      Generic Demo
                    </span>
                  </div>
                  <div className="space-y-2.5 font-mono text-xs text-earth-dark">
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.price.param1')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.price.param2')}
                    </div>
                    <div className="p-2.5 bg-white rounded border border-cream-200">
                      {t('features.previews.price.param3')}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-agri-800 uppercase">
                    <span>{t('features.previews.price.outputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-800 border border-sage-200 text-[10px]">
                      Illustrative Only
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-sage-300 shadow-sm space-y-3">
                    <div className="flex items-center space-x-2 text-agri-700">
                      <TrendingUp className="w-5 h-5" />
                      <h4 className="font-serif text-lg font-bold text-earth-dark">
                        {t('features.previews.price.resultHeading')}
                      </h4>
                    </div>

                    {/* Stylized Non-numeric Seasonal Trend Line Graphic */}
                    <div className="h-16 w-full bg-cream-100 rounded border border-cream-200 flex items-center px-4">
                      <svg className="w-full h-10" viewBox="0 0 300 40" fill="none">
                        <path
                          d="M 10 30 C 50 25 80 15 120 18 C 160 22 200 8 240 12 C 270 15 290 10 290 10"
                          stroke="#2F5D50"
                          strokeWidth="2.5"
                          strokeLinecap="round"
                        />
                        <path
                          d="M 180 8 C 210 5 250 8 290 5"
                          stroke="#A4B69A"
                          strokeWidth="2"
                          strokeDasharray="3 3"
                        />
                      </svg>
                    </div>

                    <p className="text-xs sm:text-sm text-earth-muted leading-relaxed">
                      {t('features.previews.price.resultSubtext')}
                    </p>
                  </div>

                  <div className="text-[11px] text-earth-subtle flex items-center space-x-1.5">
                    <Info className="w-3.5 h-3.5" />
                    <span>Select specific state APMC mandis to inspect historical commodity records.</span>
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
                  className="inline-flex items-center space-x-1.5 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg bg-agri-50 text-agri-700 hover:bg-agri-100 border border-agri-200 self-start sm:self-auto transition"
                >
                  <span>{t('features.previews.chatbot.actionBtn')}</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-5 bg-cream-100 rounded-xl p-5 border border-cream-300 space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-earth-muted uppercase">
                    <span>{t('features.previews.chatbot.inputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-cream-200 text-earth-dark text-[10px]">
                      Generic Demo
                    </span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-cream-200 text-xs text-earth-dark leading-relaxed font-mono">
                    {t('features.previews.chatbot.userQuery')}
                  </div>
                </div>

                <div className="lg:col-span-7 bg-cream-50 rounded-xl p-5 border border-cream-300 space-y-4">
                  <div className="flex items-center justify-between text-xs font-semibold text-agri-800 uppercase">
                    <span>{t('features.previews.chatbot.outputLabel')}</span>
                    <span className="px-2 py-0.5 rounded bg-sage-100 text-agri-800 border border-sage-200 text-[10px]">
                      Illustrative Only
                    </span>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-sage-300 shadow-sm space-y-2">
                    <div className="flex items-center space-x-2 text-agri-700">
                      <Bot className="w-5 h-5" />
                      <h4 className="font-serif text-sm font-bold text-earth-dark">
                        Agronomic Assistant Reference Output
                      </h4>
                    </div>
                    <p className="text-xs sm:text-sm text-earth-dark leading-relaxed bg-cream-50 p-3 rounded border border-cream-200">
                      {t('features.previews.chatbot.botResponse')}
                    </p>
                    <p className="text-[11px] text-earth-muted pt-1">
                      {t('features.previews.chatbot.resultSubtext')}
                    </p>
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
                className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                  isSelected
                    ? 'bg-cream-50 border-agri-600 shadow-sm'
                    : 'bg-white border-cream-300 hover:border-sage-400 hover:bg-cream-50'
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

      {/* 3. Agronomic Principles & Scientific Integrity Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-agri-950 rounded-2xl p-8 sm:p-12 text-cream-200 border border-agri-900 shadow-card">
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
            <div className="space-y-3 bg-agri-900/60 p-6 rounded-xl border border-agri-800">
              <div className="inline-flex p-2.5 rounded-lg bg-agri-800 text-sage-300 border border-agri-700">
                <Compass className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-cream-50">
                {t('pillars.p1Title')}
              </h4>
              <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                {t('pillars.p1Desc')}
              </p>
            </div>

            <div className="space-y-3 bg-agri-900/60 p-6 rounded-xl border border-agri-800">
              <div className="inline-flex p-2.5 rounded-lg bg-agri-800 text-sage-300 border border-agri-700">
                <Layers className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-bold text-cream-50">
                {t('pillars.p2Title')}
              </h4>
              <p className="text-xs sm:text-sm text-cream-300 leading-relaxed">
                {t('pillars.p2Desc')}
              </p>
            </div>

            <div className="space-y-3 bg-agri-900/60 p-6 rounded-xl border border-agri-800">
              <div className="inline-flex p-2.5 rounded-lg bg-agri-800 text-sage-300 border border-agri-700">
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

      {/* 4. Onboarding Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-cream-50 border border-cream-300 rounded-2xl p-8 sm:p-10 text-center space-y-4 shadow-card">
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-earth-dark">
            {t('cta.heading')}
          </h3>
          <p className="text-sm sm:text-base text-earth-muted max-w-xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-agri-600 hover:bg-agri-700 text-cream-50 text-sm font-semibold shadow-card hover:shadow-card-hover transition"
            >
              {t('cta.createAccount')}
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-6 py-3 rounded-lg bg-white hover:bg-cream-100 text-earth-dark border border-cream-300 text-sm font-semibold transition"
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
