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
    features: {
      sectionBadge: 'Platform Capabilities',
      sectionTitle: 'Five Core Advisory Capabilities',
      sectionSubtitle:
        'Practical agronomic modules covering pre-sowing planning through post-harvest market timing.',
      demoNotice: 'Illustrative Demo Placeholder — Non-Live Data',
      tabs: {
        crop: 'Crop Recommendation',
        disease: 'Disease Detection',
        cost: 'Cost Estimation',
        price: 'Price Forecasting',
        chatbot: 'AI Agri Chatbot',
      },
      previews: {
        crop: {
          title: 'Crop Recommendation Module',
          description:
            'Evaluates soil N-P-K nutrient profiles, soil pH level, rainfall patterns, and climate inputs to identify suitable crop varieties.',
          actionBtn: 'Open Crop Recommender',
          inputLabel: 'Generic Input Parameters:',
          param1: 'Soil Type: [Loam / Alluvial Profile]',
          param2: 'N-P-K Nutrients: [Standard Soil Test Values]',
          param3: 'Seasonal Climate: [Regional Temperature & Rainfall]',
          outputLabel: 'Generic Evaluation Preview:',
          resultHeading: '[Recommended Crop: Sample Variety]',
          resultSubtext:
            'Demonstration preview: The system compares user-entered soil characteristics against established agronomic growth requirements.',
        },
        disease: {
          title: 'Plant Pathology Diagnostic Module',
          description:
            'Analyzes leaf imagery using computer vision to identify visible symptoms and display standard management guidelines.',
          actionBtn: 'Open Disease Detector',
          inputLabel: 'Image Submission Preview:',
          param1: 'Visual Target: [Leaf Surface Photo]',
          param2: 'Analysis Region: [Foliar Diagnostic Boundary]',
          param3: 'Symptom Spectrum: [Discoloration & Lesion Pattern]',
          outputLabel: 'Generic Diagnostic Preview:',
          resultHeading: '[Pathology Pattern: Sample Condition]',
          resultSubtext:
            'Demonstration preview: Diagnostic outputs provide contextual observations and general crop protection practices for review by growers.',
        },
        cost: {
          title: 'Cultivation Cost Estimation Module',
          description:
            'Calculates operational expenditures across seeds, fertilizer, irrigation, and labor to aid seasonal financial budgeting.',
          actionBtn: 'Open Cost Estimator',
          inputLabel: 'Sample Budget Inputs:',
          param1: 'Land Area: [Standard Acreage Unit]',
          param2: 'Crop Selection: [Planned Seasonal Crop]',
          param3: 'Input Categories: [Seeds, Nutrients, Fuel & Labor]',
          outputLabel: 'Generic Ledger Preview:',
          resultHeading: '[Aggregated Expenditure & Margin Estimate]',
          resultSubtext:
            'Demonstration preview: Summarizes projected operational costs against expected crop yields to assist pre-season budget allocation.',
        },
        price: {
          title: 'APMC Mandi Price Forecasting Module',
          description:
            'Analyzes historical seasonal commodity arrival trends across state mandis to inform marketing and storage decisions.',
          actionBtn: 'Open Price Forecaster',
          inputLabel: 'Market Search Filters:',
          param1: 'Commodity: [Selected Agricultural Crop]',
          param2: 'Market Location: [State & Regional APMC Mandi]',
          param3: 'Time Horizon: [Projected Seasonal Interval]',
          outputLabel: 'Generic Market Trend Preview:',
          resultHeading: '[Historical Seasonal Trend vs Projected Band]',
          resultSubtext:
            'Demonstration preview: Visualizes seasonal market price trajectories based on past multi-year arrivals.',
        },
        chatbot: {
          title: 'Conversational Agricultural Assistant',
          description:
            'Provides responsive agronomic guidance on crop cycles, soil preparation, pest prevention, and weather considerations.',
          actionBtn: 'Open Agri Chatbot',
          inputLabel: 'Sample Farmer Query:',
          userQuery: '[Inquiry: e.g., Inquiring about optimal sowing depth and seed treatment]',
          outputLabel: 'Sample Assistant Response:',
          botResponse:
            '[Agronomic Advisory: Explains recommended agronomic practices, seed germination conditions, and soil aeration requirements.]',
          resultSubtext:
            'Demonstration preview: The conversational agent offers context-aware reference information for day-to-day farm management.',
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
    features: {
      sectionBadge: 'मंच की क्षमताएं',
      sectionTitle: 'पांच मुख्य कृषि सलाहकार क्षमताएं',
      sectionSubtitle:
        'बुवाई-पूर्व योजना से लेकर कटाई के बाद मंडी समय-निर्धारण तक व्यावहारिक कृषि मॉड्यूल।',
      demoNotice: 'उदाहरणात्मक डेमो पूर्वावलोकन — गैर-वास्तविक डेटा',
      tabs: {
        crop: 'फसल अनुशंसा',
        disease: 'रोग निदान',
        cost: 'लागत अनुमान',
        price: 'भाव पूर्वानुमान',
        chatbot: 'AI कृषि सहायक',
      },
      previews: {
        crop: {
          title: 'फसल अनुशंसा मॉड्यूल',
          description:
            'मिट्टी के N-P-K पोषक तत्वों, पीएच मान, वर्षा और क्षेत्रीय जलवायु मापदंडों का मूल्यांकन कर उपयुक्त फसलों का सुझाव देता है।',
          actionBtn: 'फसल अनुशंसा टूल खोलें',
          inputLabel: 'सामान्य इनपुट पैरामीटर:',
          param1: 'मिट्टी का प्रकार: [दोमट / जलोढ़ प्रोफ़ाइल]',
          param2: 'N-P-K पोषक तत्व: [मानक मृदा परीक्षण मान]',
          param3: 'मौसमी जलवायु: [क्षेत्रीय तापमान व वर्षा]',
          outputLabel: 'सामान्य मूल्यांकन पूर्वावलोकन:',
          resultHeading: '[सुझाई गई फसल: नमूना फसल]',
          resultSubtext:
            'प्रदर्शन पूर्वावलोकन: प्रणाली उपयोगकर्ता द्वारा दर्ज मृदा गुणों की तुलना स्थापित कृषि विकास आवश्यकताओं से करती है।',
        },
        disease: {
          title: 'पौध रोग निदान मॉड्यूल',
          description:
            'कंप्यूटर विज़न द्वारा पत्ती की तस्वीरों का विश्लेषण करके दृश्य लक्षणों की पहचान करता है और मानक प्रबंधन दिशानिर्देश प्रस्तुत करता है।',
          actionBtn: 'रोग निदान टूल खोलें',
          inputLabel: 'तस्वीर प्रस्तुति पूर्वावलोकन:',
          param1: 'निरीक्षण लक्ष्य: [पत्ती की सतह का फोटो]',
          param2: 'विश्लेषण क्षेत्र: [पत्ती निदान सीमा]',
          param3: 'लक्षण स्वरूप: [रंग परिवर्तन व धब्बे का पैटर्न]',
          outputLabel: 'सामान्य निदान पूर्वावलोकन:',
          resultHeading: '[रोग पैटर्न: नमूना स्थिति]',
          resultSubtext:
            'प्रदर्शन पूर्वावलोकन: नैदानिक परिणाम किसानों की समीक्षा के लिए प्रासंगिक अवलोकन और सामान्य पौध संरक्षण उपाय दर्शाते हैं।',
        },
        cost: {
          title: 'खेती लागत अनुमान मॉड्यूल',
          description:
            'बीज, खाद, सिंचाई और श्रम पर होने वाले परिचालन व्यय की गणना कर मौसमी वित्तीय बजट बनाने में सहायता करता है।',
          actionBtn: 'लागत अनुमान टूल खोलें',
          inputLabel: 'नमूना बजट इनपुट:',
          param1: 'भूमि क्षेत्रफल: [मानक एकड़ इकाई]',
          param2: 'फसल चयन: [योजनाबद्ध मौसमी फसल]',
          param3: 'लागत श्रेणियां: [बीज, उर्वरक, ईंधन व श्रम]',
          outputLabel: 'सामान्य बहीखाता पूर्वावलोकन:',
          resultHeading: '[कुल मौसमी व्यय व अनुमानित लाभ]',
          resultSubtext:
            'प्रदर्शन पूर्वावलोकन: बुवाई से पूर्व बजट आवंटन में सहायता के लिए अनुमानित परिचालन लागत को संभावित उपज के साथ संक्षेपित करता है।',
        },
        price: {
          title: 'मंडी भाव पूर्वानुमान मॉड्यूल',
          description:
            'फसल विपणन और भंडारण समय के बेहतर निर्णय के लिए राज्य मंडियों के ऐतिहासिक मौसमी आवक रुझानों का विश्लेषण करता है।',
          actionBtn: 'भाव पूर्वानुमान टूल खोलें',
          inputLabel: 'मंडी खोज फ़िल्टर:',
          param1: 'कृषि जिंस: [चयनित कृषि फसल]',
          param2: 'मंडी स्थान: [राज्य व क्षेत्रीय APMC मंडी]',
          param3: 'समयावधि: [प्रक्षेपित मौसमी अंतराल]',
          outputLabel: 'सामान्य बाजार रुझान पूर्वावलोकन:',
          resultHeading: '[ऐतिहासिक मौसमी रुझान बनाम अनुमानित सीमा]',
          resultSubtext:
            'प्रदर्शन पूर्वावलोकन: विगत वर्षों की आवक के आधार पर मौसमी मंडी मूल्य प्रक्षेपवक्र को दर्शाता है।',
        },
        chatbot: {
          title: 'संवादात्मक कृषि सहायक (AI चैटबॉट)',
          description:
            'फसल चक्र, खेत की तैयारी, कीट प्रबंधन और मौसम संबंधी प्रश्नों पर 24/7 उत्तर व प्रासंगिक मार्गदर्शन प्रदान करता है।',
          actionBtn: 'कृषि चैटबॉट खोलें',
          inputLabel: 'नमूना किसान प्रश्न:',
          userQuery: '[प्रश्न: उदा. बुवाई की उचित गहराई और बीज उपचार संबंधी परामर्श]',
          outputLabel: 'नमूना सहायक उत्तर:',
          botResponse:
            '[कृषि परामर्श: अनुशंसित कृषि पद्धतियों, बीज अंकुरण परिस्थितियों और मिट्टी के वातन पर प्रासंगिक मार्गदर्शन।]',
          resultSubtext:
            'प्रदर्शन पूर्वावलोकन: संवादात्मक एजेंट दैनिक कृषि प्रबंधन के लिए संदर्भ-सटीक संदर्भ जानकारी प्रस्तुत करता है।',
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
    common: {
      genericDemoBadge: 'उदाहरणात्मक डेमो पूर्वावलोकन — गैर-वास्तविक डेटा',
      selectLanguage: 'भाषा',
      english: 'English',
      hindi: 'हिंदी',
    },
  },
};
