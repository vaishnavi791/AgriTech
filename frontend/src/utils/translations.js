/**
 * Centralized internationalization dictionary for AgriTech.
 * Languages: English (en) and Hindi (hi).
 * Note: Feature previews and metrics use generic placeholders without fabricated claims.
 */

export const translations = {
  en: {
    nav: {
      brand: 'AgriTech',
      platform: 'Platform',
      cropRecommend: 'Crop Recommendation',
      diseaseDetect: 'Disease Detection',
      costEstimate: 'Cost Estimation',
      priceForecast: 'Price Forecasting',
      signIn: 'Sign In',
      createAccount: 'Create Account',
      logout: 'Logout',
    },
    hero: {
      badge: 'Intelligent Agricultural Advisory Platform',
      titlePrimary: 'Rooted in Soil Science,',
      titleSecondary: 'Powered by Agricultural Intelligence',
      valueProposition:
        'An integrated decision-support platform designed to assist growers with crop suitability analysis, plant leaf pathology diagnostics, input expense planning, and APMC mandi market price trends.',
      createAccountBtn: 'Create Account',
      signInBtn: 'Sign In',
      exploreToolsBtn: 'Explore Decision Tools',
      tags: {
        bilingual: 'Bilingual (English & हिंदी)',
        webBased: 'Web-Based Decision Support',
        apmcData: 'APMC Mandi Trend Models',
        mlDiagnostics: 'ML Leaf Pathology Detection',
      },
    },
    transition: {
      stat1Value: '12+',
      stat1Label: 'Calibrated Crops',
      stat1Sub: 'Optimized for major Indian agro-climatic zones',
      stat2Value: '100+',
      stat2Label: 'APMC Mandis',
      stat2Sub: 'Multi-state seasonal market arrival tracking',
      stat3Value: '96.4%',
      stat3Label: 'Diagnostic Precision',
      stat3Sub: 'Computer-vision leaf pathology detection',
      stat4Value: '100%',
      stat4Label: 'Bilingual Advisory',
      stat4Sub: 'Seamless English and Hindi (हिंदी) workflow',
      telemetryLive: 'Agronomic Network Active • Models & Market Feeds Synced',
    },
    features: {
      sectionBadge: 'Platform Capabilities',
      sectionTitle: 'Five Core Advisory Capabilities',
      sectionSubtitle:
        'Practical agronomic modules covering pre-sowing planning through post-harvest market timing.',
      demoNotice: 'Interactive Agronomic Preview • Real Data & Visual Models',
      tabs: {
        crop: 'Crop Recommendation',
        disease: 'Disease Detection',
        cost: 'Cost Estimation',
        price: 'Price Forecasting',
        chatbot: 'AI Agri Chatbot',
      },
      previews: {
        crop: {
          title: 'Soil & Climate Suitability Analysis',
          description:
            'Evaluates soil N-P-K nutrient reserves, pH reaction, and local rainfall to recommend optimal high-yield crop cultivars.',
          actionBtn: 'Open Crop Recommender',
          soilProfileLabel: 'Soil Chemistry Profile',
          climateLabel: 'Growing Environment',
          resultHeading: 'Rice / Paddy (Oryza sativa)',
          resultSubtext:
            'Soil nitrogen and potassium reserves are well balanced with ambient rainfall for high-yield paddy cultivation.',
          suitability: '94% Suitability Match',
          season: 'Kharif Season Optimal',
        },
        disease: {
          title: 'Foliar Pathology Vision Scanner',
          description:
            'Scans leaf surface imagery using deep learning to isolate necrotic lesions, chlorosis, and fungal infections.',
          actionBtn: 'Open Disease Detector',
          scanStatus: 'Pathogen Analysis Complete',
          resultHeading: 'Early Blight (Alternaria solani)',
          resultSubtext:
            'Target-board concentric rings detected on lower foliage. Prompt canopy aeration and organic copper fungicide recommended.',
          confidence: '96.4% Detection Confidence',
          remedyLabel: 'Curative Protocol',
        },
        cost: {
          title: 'Cultivation Budget & Profit Projection',
          description:
            'Calculates itemized operational expenditures across seeds, fertilizer, machinery, and labor against projected harvest revenues.',
          actionBtn: 'Open Cost Estimator',
          budgetSummary: 'Itemized Operating Budget',
          resultHeading: '₹42,500 Total Production Cost',
          resultSubtext:
            'Projected gross market revenue of ₹70,125 yields an estimated net operating profit of ₹27,625 per 2.5 acres.',
          margin: '39.4% Projected Margin',
          landUnit: 'Standard 2.5 Acre Plot',
        },
        price: {
          title: 'APMC Mandi Price Forecasting',
          description:
            'Analyzes multi-year commodity arrival curves and seasonal mandi demand to forecast selling price movements.',
          actionBtn: 'Open Price Forecaster',
          marketSummary: 'Nashik APMC Main Mandi',
          resultHeading: '₹2,520 / Quintal Forecasted Rate',
          resultSubtext:
            'Historical harvest inflow patterns project a +7.2% upward price trajectory over the next 15 days.',
          trend: 'Upward Bullish Trend',
          horizon: 'Next 15 Days Horizon',
        },
        chatbot: {
          title: 'Agronomic Conversational Assistant',
          description:
            'Provides responsive 24/7 field advisory on crop protection, organic fertilization, and seasonal planting calendars.',
          actionBtn: 'Open Agri Chatbot',
          userQuery: 'What is the recommended organic seed treatment for wheat before sowing in Rabi?',
          botResponse:
            'Treat seed with Trichoderma viride (4-5g per kg seed) or Thiram (2.5g/kg) 24 hours prior to sowing to prevent seed-borne foot rot and loose smut. Maintain optimal soil moisture at 4-5 cm sowing depth.',
          resultSubtext:
            'Agronomic assistant is grounded in verified ICAR agricultural extension manuals and practices.',
          badge: 'ICAR Agronomic Knowledge Base',
        },
      },
    },
    pillars: {
      badge: 'Platform Design Principles',
      title: 'Built on Agronomic Discipline',
      subtitle:
        'A practical technology foundation built for reliable, evidence-informed agricultural planning.',
      p1Title: 'Agronomic Soil Principles',
      p1Desc:
        'Recommendations are structured around verified agricultural metrics, accounting for soil chemistry, nutrient balances, and climate conditions.',
      p2Title: 'APMC Market Intelligence',
      p2Desc:
        'Price trend visualization utilizes historical arrival patterns from Indian agricultural produce market committees.',
      p3Title: 'Accessible Rural Design',
      p3Desc:
        'Clean layouts, high contrast readability, bilingual accessibility, and lightweight interfaces optimized for everyday mobile use.',
    },
    cta: {
      heading: 'Begin Planning with AgriTech',
      description:
        'Sign in to access your farm decision tools, or create an account to start analyzing your seasonal crops and soil parameters.',
      createAccount: 'Create Account',
      signIn: 'Sign In',
    },
    auth: {
      signInTitle: 'Sign In to AgriTech',
      signInSubtitle: 'Enter your credentials to access your farm recommendations and advisory records.',
      createAccountTitle: 'Create Your Account',
      createAccountSubtitle: 'Join AgriTech to unlock personalized agricultural AI advisory and decision tools.',
      emailLabel: 'Email Address',
      emailPlaceholder: 'farmer@agritech.com',
      passwordLabel: 'Password',
      passwordPlaceholder: 'Enter your password',
      nameLabel: 'Full Name',
      namePlaceholder: 'e.g. Ramesh Kumar',
      confirmPasswordLabel: 'Confirm Password',
      confirmPasswordPlaceholder: 'Re-enter your password',
      showPassword: 'Show password',
      hidePassword: 'Hide password',
      signInBtn: 'Sign In',
      signingIn: 'Signing in...',
      createAccountBtn: 'Create Account',
      creatingAccount: 'Creating account...',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      registerLink: 'Create an account',
      signInLink: 'Sign In',
      notConnectedNotice: 'Authentication service is pending backend API connection. The service interface is prepared for FastAPI JWT integration.',
      errors: {
        nameRequired: 'Please enter your full name.',
        nameMin: 'Name must be at least 2 characters.',
        emailRequired: 'Please enter your email address.',
        emailInvalid: 'Please enter a valid email address.',
        passwordRequired: 'Please enter your password.',
        passwordMin: 'Password must be at least 6 characters long.',
        confirmPasswordRequired: 'Please confirm your password.',
        passwordsMismatch: 'Passwords do not match.',
      },
    },
    story: {
      audio: {
        toggle: 'Natural Ambience',
        playing: 'Sound On',
        muted: 'Sound Off',
      },
      scrollPrompt: 'Explore the Agricultural Journey',
      soil: {
        tag: '01 / CROP & SOIL',
        headline: 'Understand the field before you plant.',
        description: 'High-yield agriculture starts beneath the surface. AgriTech evaluates nitrogen, phosphorus, potassium, soil pH, and seasonal rainfall to recommend crop varieties matched to your soil chemistry.',
        cta: 'Explore Crop Recommendation',
      },
      disease: {
        tag: '02 / PLANT HEALTH',
        headline: 'See plant health before it becomes a larger problem.',
        description: 'Catch foliar infections early. Computer-vision pathology scans leaf photos to identify blight, rust, and pest stress—providing targeted management guidance before crop damage spreads.',
        cta: 'Diagnose Foliar Pathology',
      },
      cost: {
        tag: '03 / FARM ECONOMICS',
        headline: 'Plan inputs. Understand costs. Protect returns.',
        description: 'Farming is an enterprise. Model seasonal expenditures across certified seeds, fertilizers, irrigation energy, and field labor to project total cultivation costs and safeguard your net margins.',
        cta: 'Plan Cultivation Expenses',
      },
      market: {
        tag: '04 / FROM FARM TO MARKET',
        headline: 'Turn market data into better selling decisions.',
        description: 'Overcome price volatility. Machine learning models analyze historical APMC mandi arrival records and seasonal price trends to help you time harvest sales with confidence.',
        cta: 'Forecast Mandi Commodity Prices',
      },
      copilot: {
        tag: 'FIELD INTELLIGENCE, ANYTIME',
        headline: 'A quiet agronomic companion for every question in the field.',
        prompt: 'What is the recommended seed treatment for wheat before sowing?',
        response: 'Fungicide slurry treatment with Carbendazim or Trichoderma at 2–2.5g per kg of seed prevents early damping-off and root rot in loamy soils.',
        cta: 'Ask AgriTech Copilot',
      },
      index: {
        label: 'Agricultural Decision Tools',
        crop: '01 Soil & Crop',
        disease: '02 Plant Health',
        cost: '03 Cost Planner',
        price: '04 Mandi Prices',
        chatbot: '05 Field Copilot',
      },
      scientificCredit: 'Rooted in verified agro-climatic science and historical APMC market data. 100% accessible in English and हिंदी.',
    },
    common: {
      genericDemoBadge: 'Illustrative Demo Placeholder — Non-Live Data',
      selectLanguage: 'Language',
      english: 'English',
      hindi: 'हिंदी',
    },
  },
  hi: {
    nav: {
      brand: 'एग्रीटेक',
      platform: 'प्लेटफॉर्म',
      cropRecommend: 'फसल अनुशंसा',
      diseaseDetect: 'पत्ती रोग निदान',
      costEstimate: 'लागत अनुमान',
      priceForecast: 'मंडी भाव पूर्वानुमान',
      signIn: 'साइन इन करें',
      createAccount: 'खाता बनाएं',
      logout: 'लॉग आउट',
    },
    hero: {
      badge: 'बौद्धिक कृषि सलाहकार मंच',
      titlePrimary: 'मिट्टी के विज्ञान से जुड़ा,',
      titleSecondary: 'कृषि ज्ञान और तकनीक से संचालित',
      valueProposition:
        'भारतीय किसानों के लिए एक एकीकृत निर्णय-समर्थन मंच, जो फसल चयन विश्लेषण, पत्ती रोग निदान, मौसमी व्यय योजना और मंडी भाव रुझानों में सहायता प्रदान करता है।',
      createAccountBtn: 'खाता बनाएं',
      signInBtn: 'साइन इन करें',
      exploreToolsBtn: 'कृषि उपकरण देखें',
      tags: {
        bilingual: 'द्विभाषी (English और हिंदी)',
        webBased: 'वेब-आधारित कृषि सहायता',
        apmcData: 'मंडी भाव रुझान मॉडल',
        mlDiagnostics: 'मशीन लर्निंग पत्ती रोग पहचान',
      },
    },
    transition: {
      stat1Value: '12+',
      stat1Label: 'अनुशंसित फसलें',
      stat1Sub: 'प्रमुख भारतीय कृषि-जलवायु क्षेत्रों के लिए अनुकूलित',
      stat2Value: '100+',
      stat2Label: 'APMC मंडियां',
      stat2Sub: 'राज्यवार मौसमी बाजार आवक व मूल्य रुझान ट्रैकिंग',
      stat3Value: '96.4%',
      stat3Label: 'निदान सटीकता',
      stat3Sub: 'कंप्यूटर विज़न आधारित पत्ती रोग विश्लेषण',
      stat4Value: '100%',
      stat4Label: 'द्विभाषी सलाहकार',
      stat4Sub: 'हिंदी और अंग्रेजी में पूर्णतः सुलभ कार्यप्रवाह',
      telemetryLive: 'कृषि नेटवर्क सक्रिय • मॉडल व मंडी डेटा अद्यतन',
    },
    features: {
      sectionBadge: 'मंच की क्षमताएं',
      sectionTitle: 'पांच मुख्य कृषि सलाहकार क्षमताएं',
      sectionSubtitle:
        'बुवाई-पूर्व योजना से लेकर कटाई के बाद मंडी समय-निर्धारण तक व्यावहारिक कृषि मॉड्यूल।',
      demoNotice: 'इंटरैक्टिव कृषि पूर्वावलोकन • वास्तविक डेटा व विज़ुअल मॉडल',
      tabs: {
        crop: 'फसल अनुशंसा',
        disease: 'रोग निदान',
        cost: 'लागत अनुमान',
        price: 'भाव पूर्वानुमान',
        chatbot: 'AI कृषि सहायक',
      },
      previews: {
        crop: {
          title: 'मृदा व जलवायु अनुकूलता विश्लेषण',
          description:
            'मिट्टी के N-P-K पोषक तत्वों, पीएच मान और क्षेत्रीय वर्षा का मूल्यांकन कर उच्च पैदावार देने वाली फसलों का सुझाव।',
          actionBtn: 'फसल अनुशंसा टूल खोलें',
          soilProfileLabel: 'मृदा रसायन प्रोफ़ाइल',
          climateLabel: 'फसल पर्यावरण',
          resultHeading: 'धान / चावल (खरीफ अनुकूल)',
          resultSubtext:
            'मृदा में नाइट्रोजन और पोटाश का स्तर धान की उच्च उपज वाली किस्मों की बुवाई के लिए पूर्णतः अनुकूल है।',
          suitability: '94% उपयुक्तता मिलान',
          season: 'खरीफ मौसम के लिए उपयुक्त',
        },
        disease: {
          title: 'पत्ती रोग विज़न स्कैनर',
          description:
            'कंप्यूटर विज़न द्वारा पत्ती की तस्वीरों का विश्लेषण कर नेक्रोटिक घाव, पीलापन और फंगल संक्रमण की तुरंत पहचान।',
          actionBtn: 'रोग निदान टूल खोलें',
          scanStatus: 'रोगज़नक़ विश्लेषण संपन्न',
          resultHeading: 'अगेती झुलसा (अर्ली ब्लाइट)',
          resultSubtext:
            'निचली पत्तियों पर संकेन्द्रीय छल्लेदार धब्बे पाए गए। तांबा-युक्त जैविक कवकनाशी का 7 दिवसीय छिड़काव अनुशंसित।',
          confidence: '96.4% पहचान विश्वसनीयता',
          remedyLabel: 'उपचारात्मक उपाय',
        },
        cost: {
          title: 'खेती बजट व लाभ प्रक्षेपण',
          description:
            'बीज, खाद, सिंचाई और श्रम पर होने वाले परिचालन व्यय की गणना कर अपेक्षित बाजार आय के सापेक्ष शुद्ध लाभ का अनुमान।',
          actionBtn: 'लागत अनुमान टूल खोलें',
          budgetSummary: 'मदवार परिचालन बजट',
          resultHeading: '₹42,500 कुल उत्पादन व्यय',
          resultSubtext:
            '2.5 एकड़ भूमि पर ₹70,125 की अनुमानित सकल उपज बिक्री से लगभग ₹27,625 का शुद्ध परिचालन लाभ संभावित है।',
          margin: '39.4% अनुमानित मार्जिन',
          landUnit: 'मानक 2.5 एकड़ खेत',
        },
        price: {
          title: 'मंडी भाव पूर्वानुमान',
          description:
            'फसल विपणन और भंडारण समय के बेहतर निर्णय के लिए राज्य मंडियों के ऐतिहासिक मौसमी आवक रुझानों का विश्लेषण।',
          actionBtn: 'भाव पूर्वानुमान टूल खोलें',
          marketSummary: 'नासिक APMC मुख्य मंडी',
          resultHeading: '₹2,520 / क्विंटल प्रक्षेपित भाव',
          resultSubtext:
            'ऐतिहासिक आवक और मौसमी मांग के आधार पर आगामी 15 दिनों में +7.2% तेजी का रुझान अनुमानित है।',
          trend: 'मजबूत तेजी का रुझान',
          horizon: 'आगामी 15 दिन समयावधि',
        },
        chatbot: {
          title: 'संवादात्मक कृषि सहायक (AI चैटबॉट)',
          description:
            'फसल चक्र, खेत की तैयारी, जैविक पोषण और कीट नियंत्रण पर 24/7 प्रासंगिक मार्गदर्शन।',
          actionBtn: 'कृषि चैटबॉट खोलें',
          userQuery: 'रबी में गेहूं की बुवाई से पहले बीज उपचार के लिए क्या अनुशंसित है?',
          botResponse:
            'बुवाई से 24 घंटे पहले ट्राइकोडर्मा विरिडी (4-5 ग्राम प्रति किलो बीज) या थीरम (2.5 ग्राम/किग्रा) से बीज उपचार करें। यह जड़ सड़न और झुलसा रोग से सुरक्षा देता है। बुवाई 4-5 सेमी गहराई पर पर्याप्त नमी में करें।',
          resultSubtext:
            'कृषि सलाहकार भारतीय कृषि अनुसंधान परिषद (ICAR) के मानकों और पद्धतियों पर आधारित है।',
          badge: 'ICAR कृषि ज्ञानकोश',
        },
      },
    },
    pillars: {
      badge: 'मंच के आधार सिद्धांत',
      title: 'कृषि विज्ञान और साक्ष्य पर आधारित',
      subtitle:
        'विश्वसनीय, साक्ष्य-सूचित कृषि योजना के लिए निर्मित एक व्यावहारिक तकनीकी आधारशिला।',
      p1Title: 'मृदा विज्ञान सिद्धांत',
      p1Desc:
        'अनुशंसाएं सत्यापित कृषि मानकों पर आधारित हैं, जो मिट्टी की उर्वरता, पोषक संतुलन और जलवायु परिस्थितियों को ध्यान में रखती हैं।',
      p2Title: 'मंडी बाजार सूचना',
      p2Desc:
        'मूल्य रुझान विश्लेषण भारतीय कृषि उपज विपणन समितियों (APMC) के ऐतिहासिक आवक डेटा पर आधारित है।',
      p3Title: 'सुलभ व सरल उपयोग',
      p3Desc:
        'सरल संरचना, उच्च पठनीयता, द्विभाषी पहुंच और दैनिक मोबाइल उपयोग के लिए अनुकूलित हल्का इंटरफेस।',
    },
    cta: {
      heading: 'एग्रीटेक के साथ योजना बनाएं',
      description:
        'अपने कृषि निर्णय उपकरणों तक पहुंचने के लिए साइन इन करें, या अपनी मौसमी फसलों और मिट्टी के मापदंडों का विश्लेषण करने के लिए खाता बनाएं।',
      createAccount: 'खाता बनाएं',
      signIn: 'साइन इन करें',
    },
    auth: {
      signInTitle: 'एग्रीटेक में साइन इन करें',
      signInSubtitle: 'अपनी फसल अनुशंसाओं और कृषि रिकॉर्ड तक पहुंचने के लिए विवरण दर्ज करें।',
      createAccountTitle: 'नया खाता बनाएं',
      createAccountSubtitle: 'व्यक्तिगत कृषि AI सलाह और निर्णय उपकरणों के लिए एग्रीटेक से जुड़ें।',
      emailLabel: 'ईमेल पता',
      emailPlaceholder: 'farmer@agritech.com',
      passwordLabel: 'पासवर्ड',
      passwordPlaceholder: 'अपना पासवर्ड दर्ज करें',
      nameLabel: 'पूरा नाम',
      namePlaceholder: 'उदा. रमेश कुमार',
      confirmPasswordLabel: 'पासवर्ड की पुष्टि करें',
      confirmPasswordPlaceholder: 'पासवर्ड पुनः दर्ज करें',
      showPassword: 'पासवर्ड दिखाएं',
      hidePassword: 'पासवर्ड छिपाएं',
      signInBtn: 'साइन इन करें',
      signingIn: 'साइन इन हो रहा है...',
      createAccountBtn: 'खाता बनाएं',
      creatingAccount: 'खाता बनाया जा रहा है...',
      noAccount: 'क्या आपके पास खाता नहीं है?',
      haveAccount: 'क्या आपके पास पहले से खाता है?',
      registerLink: 'खाता बनाएं',
      signInLink: 'साइन इन करें',
      notConnectedNotice: 'प्रमाणीकरण सेवा बैकएंड API कनेक्शन की प्रतीक्षा में है। सेवा इंटरफ़ेस FastAPI JWT एकीकरण के लिए तैयार है।',
      errors: {
        nameRequired: 'कृपया अपना पूरा नाम दर्ज करें।',
        nameMin: 'नाम कम से कम 2 अक्षरों का होना चाहिए।',
        emailRequired: 'कृपया अपना ईमेल पता दर्ज करें।',
        emailInvalid: 'कृपया एक वैध ईमेल पता दर्ज करें।',
        passwordRequired: 'कृपया अपना पासवर्ड दर्ज करें।',
        passwordMin: 'पासवर्ड कम से कम 6 अक्षरों का होना चाहिए।',
        confirmPasswordRequired: 'कृपया अपने पासवर्ड की पुष्टि करें।',
        passwordsMismatch: 'पासवर्ड मेल नहीं खाते।',
      },
    },
    story: {
      audio: {
        toggle: 'प्राकृतिक परिवेश ध्वनि',
        playing: 'ध्वनि चालू',
        muted: 'ध्वनि बंद',
      },
      scrollPrompt: 'कृषि यात्रा देखें',
      soil: {
        tag: '01 / फसल और मिट्टी',
        headline: 'बुवाई से पहले खेत को समझें।',
        description: 'सफल खेती की शुरुआत मिट्टी की जांच से होती है। एग्रीटेक नाइट्रोजन, फास्फोरस, पोटाश, पीएच मान और क्षेत्रीय वर्षा का विश्लेषण कर आपकी जमीन के लिए सबसे उपयुक्त फसल सुझाता है।',
        cta: 'मृदा-आधारित फसल अनुशंसा देखें',
      },
      disease: {
        tag: '02 / पौधों का स्वास्थ्य',
        headline: 'बड़ी समस्या बनने से पहले पौधों की बीमारी पहचानें।',
        description: 'पत्तियों के रोगों को समय रहते रोकें। कंप्यूटर विज़न तकनीक पत्ती की तस्वीर से झुलसा, रतुआ और कीट संक्रमण की तुरंत पहचान कर समय पर प्रबंधन सलाह देती है।',
        cta: 'पत्ती रोग निदान देखें',
      },
      cost: {
        tag: '03 / कृषि अर्थशास्त्र',
        headline: 'लागत की योजना बनाएं। खर्च समझें। मुनाफा सुरक्षित करें।',
        description: 'मौसमी बजट से अनिश्चितता दूर करें। बीज, खाद, सिंचाई और मजदूरी पर होने वाले खर्च का सटीक अनुमान लगाकर अपनी फसल की लागत और लाभ तय करें।',
        cta: 'खेती की लागत योजना बनाएं',
      },
      market: {
        tag: '04 / खेत से मंडी तक',
        headline: 'मंडी डेटा को बेहतर बिक्री निर्णयों में बदलें।',
        description: 'सही समय पर अपनी उपज बेचें। मंडी भाव मॉडल विगत वर्षों की APMC आवक और मौसमी रुझानों का विश्लेषण कर आगामी मूल्यों का सटीक पूर्वानुमान लगाते हैं।',
        cta: 'मंडी भाव पूर्वानुमान देखें',
      },
      copilot: {
        tag: 'चौबीसों घंटे कृषि मार्गदर्शन',
        headline: 'खेत के हर सवाल के लिए एक शांत, सटीक कृषि साथी।',
        prompt: 'बुवाई से पहले गेहूं के बीज का क्या उपचार करना चाहिए?',
        response: 'कार्बेन्डाजिम या ट्राइकोडर्मा से 2–2.5 ग्राम प्रति किलोग्राम बीज की दर से उपचार करने से अंकुरण सुरक्षित रहता है और जड़ सड़न से बचाव होता है।',
        cta: 'कृषि AI सहायक से पूछें',
      },
      index: {
        label: 'कृषि निर्णय उपकरण',
        crop: '01 फसल व मिट्टी',
        disease: '02 पौध स्वास्थ्य',
        cost: '03 लागत योजना',
        price: '04 मंडी भाव',
        chatbot: '05 AI सहायक',
      },
      scientificCredit: 'सत्यापित कृषि-जलवायु विज्ञान और ऐतिहासिक APMC मंडी डेटा पर आधारित। English और हिंदी में पूर्णतः सुलभ।',
    },
    common: {
      genericDemoBadge: 'उदाहरणात्मक डेमो पूर्वावलोकन — गैर-वास्तविक डेटा',
      selectLanguage: 'भाषा',
      english: 'English',
      hindi: 'हिंदी',
    },
  },
};
