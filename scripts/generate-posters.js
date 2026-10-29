const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const OUTPUT_DIR = path.join(__dirname, '..', 'public', 'posters');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Convert local images to base64 so Chrome headless renders them instantly without network delay
function getBase64Image(filePath) {
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filePath).replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : 'image/png';
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${data}`;
  }
  return '';
}

const logoBase64 = getBase64Image(path.join(OUTPUT_DIR, 'nexaform-logo.png'));
const roomImgBase64 = getBase64Image(path.join(OUTPUT_DIR, 'hero-room.jpg'));
const exteriorImgBase64 = getBase64Image(path.join(OUTPUT_DIR, 'hero-exterior.jpg'));
const rooftopImgBase64 = getBase64Image(path.join(OUTPUT_DIR, 'hero-rooftop.jpg'));

console.log("Images loaded. Generating HTML posters...");

const posters = [
  // POSTER 0: Nexaform Initial Intro - Desktop & Mobile Hero Showcase
  {
    id: 'poster-0-nexaform-intro',
    tag: '🚀 नेक्साफर्म विशेष लन्च • स्मार्ट वेबसाइट',
    title: 'Nexaform ले ल्यायो<br><span class="highlight">होस्टेलका लागि वेबसाइट!</span>',
    subtitle: 'मोबाइल र कम्प्युटर दुवैमा चल्ने अत्याधुनिक वेबसाइट। अब विद्यार्थी भर्ना बढाउनुहोस् र आफ्नो होस्टेललाई बनाउनुहोस् १००% डिजिटल।',
    renderVisual: () => `
      <div class="duo-mockup-wrapper">
        <!-- Floating Badges -->
        <div class="floating-platform-badge badge-desktop-pos">
          <span>💻 डेस्कटप भर्सन (Desktop)</span>
        </div>
        <div class="floating-platform-badge badge-mobile-pos">
          <span class="live-pulse-dot"></span>
          <span>📱 मोबाइल भर्सन (Mobile)</span>
        </div>

        <!-- Desktop Laptop Mockup -->
        <div class="desktop-frame">
          <div class="desktop-top-bar">
            <div class="window-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="url-bar">himalayannest.com.np</div>
            <span class="status-badge live">● LIVE SYSTEM</span>
          </div>

          <div class="desktop-screen">
            <!-- Simulated Website Header -->
            <div class="web-navbar">
              <div class="web-logo">🏔️ HIMALAYAN NEST</div>
              <div class="web-links">
                <span class="active-link">होम</span>
                <span>रुमहरू</span>
                <span>सुविधाहरू</span>
                <span>खाना मेनु</span>
                <span>सम्पर्क</span>
              </div>
              <div class="web-btn">बेड बुक गर्नुहोस् ➔</div>
            </div>

            <!-- Simulated Hero Content -->
            <div class="web-hero-content">
              <img src="${exteriorImgBase64}" class="web-hero-img" alt="Hostel Exterior" />
              <div class="web-hero-overlay">
                <div class="hero-top-tag">🌟 पुतलीसडक, काठमाडौँ (कलेज क्षेत्र)</div>
                <h1 class="web-hero-h1">Study Hard,<br>Live Easy</h1>
                <p class="web-hero-sub">काठमाडौँका मुख्य कलेजहरू नजिकै शान्त, सुरक्षित र सफा वातावरणमा विद्यार्थीहरूको पहिलो रोजाइको होस्टेल।</p>
                <div class="web-hero-cta">
                  <div class="hero-price-badge">
                    सुरुवाती शुल्क <span>रू. १२,५००</span> / महिना
                  </div>
                  <button class="hero-book-btn">Book Bed Now ➔</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Floating Mobile Smartphone Mockup -->
        <div class="mobile-frame">
          <div class="mobile-notch"></div>
          <div class="mobile-screen">
            <div class="mobile-top-bar">
              <div class="mobile-brand">🏔️ HIMALAYAN NEST</div>
              <div class="mobile-menu-btn">☰</div>
            </div>
            <img src="${exteriorImgBase64}" class="mobile-hero-img" alt="Mobile Hero" />
            <div class="mobile-hero-overlay">
              <span class="mobile-pill">✨ प्रिमियम होस्टेल</span>
              <h2 class="mobile-h1">Study Hard,<br>Live Easy</h2>
              <p class="mobile-sub">विद्यार्थीका लागि सुरक्षित र घरजस्तै वातावरण।</p>
              <div class="mobile-price">मासिक शुल्क: <strong>रू. १२,५००</strong></div>
              <button class="mobile-cta-btn">सिधै अनलाइन बुक गर्नुहोस् ➔</button>
            </div>
          </div>
        </div>
      </div>
    `,
    benefits: [
      { icon: '📱', title: 'मोबाइल र ल्यापटप दुवैमा फिट', desc: 'सबै डिभाइसमा उत्तिकै छिटो र आकर्षक' },
      { icon: '🌐', title: 'आफ्नै नाम र ब्रान्डमा वेबसाइट', desc: 'सयौं विद्यार्थी र अभिभावकमा विश्वास' },
      { icon: '⚡', title: 'सुपर फास्ट र १००% रेस्पोन्सिभ', desc: 'आधुनिक Next.js प्रविधिमा निर्मित' }
    ]
  },

  // POSTER 1: Direct Student Booking
  {
    id: 'poster-1-student-booking',
    tag: '⚡ फिचर १ • अनलाइन बुकिङ',
    title: 'विद्यार्थीले सिधै अनलाइन<br><span class="highlight">बुक गर्न मिल्ने!</span>',
    subtitle: 'कुनै झन्झट बिना विद्यार्थीले मोबाइलबाटै सिधै आफ्नो मनपर्ने बेड र रुम बुक गर्न सक्छन्।',
    renderVisual: () => `
      <div class="mockup-card">
        <div class="mockup-header">
          <div class="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="url-bar">himalayannest.com.np/rooms/book</div>
          <span class="status-badge live">● LIVE SYSTEM</span>
        </div>
        
        <div class="mockup-body">
          <div class="room-preview-row">
            <img src="${roomImgBase64}" class="preview-thumb" alt="Room" />
            <div class="preview-details">
              <span class="cat-pill">डबल सिटर डिलक्स रुम</span>
              <div class="price-text">रू. १४,५०० <span class="per-month">/ महिना</span></div>
              <div class="room-tags">
                <span class="tag">✓ स्टडी टेबल</span>
                <span class="tag">✓ वातानुकूलित</span>
                <span class="tag">✓ तातो पानी</span>
              </div>
            </div>
          </div>

          <div class="booking-form-box">
            <div class="form-title">📝 विद्यार्थी बुकिङ फारम</div>
            <div class="input-grid">
              <div class="input-group">
                <label>विद्यार्थीको नाम</label>
                <div class="fake-input">रोहन श्रेष्ठ (Rohan Shrestha)</div>
              </div>
              <div class="input-group">
                <label>सम्पर्क नम्बर</label>
                <div class="fake-input">९८६८७३१६०७</div>
              </div>
              <div class="input-group">
                <label>कलेज / अध्ययन</label>
                <div class="fake-input">Apex College (BBA 1st Sem)</div>
              </div>
              <div class="input-group">
                <label>रोजेको बेड</label>
                <div class="fake-input active-selection">Bed B • विन्डो साइड [खाली छ] ✓</div>
              </div>
            </div>
            
            <button class="cta-button pulse">
              <span>सिधै बेड बुक गर्नुहोस् (Book Now)</span>
              <span class="arrow">➔</span>
            </button>
          </div>

          <div class="notification-float">
            <div class="notif-icon">⚡</div>
            <div class="notif-text">
              <strong>तुरुन्तै सूचना:</strong> बुकिङको जानकारी सिधै एडमिनलाई पुग्छ!
            </div>
          </div>
        </div>
      </div>
    `,
    benefits: [
      { icon: '📱', title: 'मोबाइलबाटै १ मिनेटमा बुकिङ', desc: 'कुनै लामो फर्म भर्नु नपर्ने' },
      { icon: '🔔', title: 'सिधै एडमिनमा नोटिफिकेसन', desc: 'सञ्चालकलाई तुरुन्तै थाहा हुने' },
      { icon: '🔒', title: 'अग्रिम सिट सुरक्षित', desc: 'विद्यार्थी र अभिभावक दुवैलाई सजिलो' }
    ]
  },

  // POSTER 2: Room & Bed Type Preview
  {
    id: 'poster-2-room-preview',
    tag: '🛏️ फिचर २ • लाइभ रुम प्रिभ्यु',
    title: 'कस्तो रुम, कस्तो बेड<br><span class="highlight">खाली छ हेर्न मिल्ने!</span>',
    subtitle: 'विद्यार्थीले होस्टेल नपुग्दै प्रत्येक कोठाको बनावट, सुविधा र खाली बेडहरू हेर्न पाउँछन्।',
    renderVisual: () => `
      <div class="mockup-card">
        <div class="mockup-header">
          <div class="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="url-bar">himalayannest.com.np/rooms</div>
          <span class="status-badge available">● ३ प्रकारका कोठा उपलब्ध</span>
        </div>
        
        <div class="mockup-body">
          <div class="featured-room-hero">
            <img src="${roomImgBase64}" class="hero-room-img" alt="Room" />
            <div class="hero-overlay">
              <span class="overlay-badge">रू. १२,५०० देखि सुरु</span>
              <span class="vacancy-count-pill">🔥 ४ बेड बाँकी मात्र</span>
            </div>
          </div>

          <div class="beds-visual-layout">
            <div class="layout-label">🛏️ कोठाभित्रको लाइभ बेड स्थिति:</div>
            <div class="beds-grid">
              <div class="bed-chip available-bed">
                <div class="bed-icon">🛏️</div>
                <div class="bed-info">
                  <strong>बेड १ (Bed A)</strong>
                  <span class="badge-free">खाली छ (Available)</span>
                </div>
              </div>
              <div class="bed-chip occupied-bed">
                <div class="bed-icon">🛏️</div>
                <div class="bed-info">
                  <strong>बेड २ (Bed B)</strong>
                  <span class="badge-busy">बुक भइसक्यो (Booked)</span>
                </div>
              </div>
              <div class="bed-chip available-bed">
                <div class="bed-icon">🛏️</div>
                <div class="bed-info">
                  <strong>बेड ३ (Bed C)</strong>
                  <span class="badge-free">खाली छ (Available)</span>
                </div>
              </div>
            </div>
          </div>

          <div class="amenities-strip">
            <div class="amenity">📶 २४सै घण्टा WiFi</div>
            <div class="amenity">🚿 तातो/चिसो पानी</div>
            <div class="amenity">🍽️ ४ छाक ताजा खाना</div>
            <div class="amenity">🧹 दैनिक सरसफाइ</div>
          </div>
        </div>
      </div>
    `,
    benefits: [
      { icon: '👀', title: 'पारदर्शी कोठा विवरण', desc: 'प्रत्येक बेडको वास्तविक अवस्था देखिने' },
      { icon: '📸', title: 'HD फोटो सहितको विवरण', desc: 'विद्यार्थीलाई विश्वासिलो लाग्ने' },
      { icon: '🏷️', title: 'शुल्क र सुविधाहरू स्पष्ट', desc: 'कुनै लुकेको शुल्क नहुने' }
    ]
  },

  // POSTER 3: Self-Update Bed Availability in Seconds
  {
    id: 'poster-3-bed-counter-update',
    tag: '⚙️ फिचर ३ • एडमिन कन्ट्रोल',
    title: 'बेड के कति खाली छ<br><span class="highlight">आफैले अपडेट गर्न मिल्ने!</span>',
    subtitle: 'कुनै प्राविधिक ज्ञान नचाहिने, मोबाइलबाटै १ सेकेन्डमा बेड थपघट (Update) गर्नुहोस्।',
    renderVisual: () => `
      <div class="mockup-card admin-theme">
        <div class="mockup-header dark-head">
          <div class="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="url-bar">himalayannest.com.np/admin/dashboard</div>
          <span class="status-badge admin">👑 ADMIN PANEL</span>
        </div>
        
        <div class="mockup-body">
          <div class="admin-top-stats">
            <div class="stat-box">
              <span class="stat-num">५६</span>
              <span class="stat-lbl">जम्मा बेड</span>
            </div>
            <div class="stat-box highlight-stat">
              <span class="stat-num">१२</span>
              <span class="stat-lbl">खाली बेड</span>
            </div>
            <div class="stat-box">
              <span class="stat-num">७९%</span>
              <span class="stat-lbl">ओक्युपेन्सी</span>
            </div>
          </div>

          <div class="steppers-card">
            <div class="steppers-title">
              <span>⚡ बेड खाली स्थिति कन्ट्रोलर (Bed Stepper)</span>
              <span class="synced-tag">✓ वेबसाइटमा सिधै अपडेट हुन्छ</span>
            </div>

            <div class="stepper-row">
              <div class="room-meta">
                <strong>सिंगल सिटर (Single Bed)</strong>
                <span class="sub-meta">६ मध्ये १ खाली</span>
              </div>
              <div class="stepper-controls">
                <button class="step-btn minus">−</button>
                <span class="step-val">१</span>
                <button class="step-btn plus">+</button>
              </div>
            </div>

            <div class="stepper-row active-row">
              <div class="room-meta">
                <strong>डबल सिटर (Double Bed)</strong>
                <span class="sub-meta">२० मध्ये ४ खाली</span>
              </div>
              <div class="stepper-controls">
                <button class="step-btn minus">−</button>
                <span class="step-val focus">४</span>
                <button class="step-btn plus glowing">+</button>
              </div>
            </div>

            <div class="stepper-row">
              <div class="room-meta">
                <strong>ट्रिपल सिटर (Triple Bed)</strong>
                <span class="sub-meta">३० मध्ये ७ खाली</span>
              </div>
              <div class="stepper-controls">
                <button class="step-btn minus">−</button>
                <span class="step-val">७</span>
                <button class="step-btn plus">+</button>
              </div>
            </div>
          </div>

          <div class="sync-banner">
            <span class="sync-pulse"></span>
            <span>तपाईंले यहाँ <strong>+ / −</strong> थिच्नासाथ वेबसाइटमा स्वतः अपडेट हुन्छ!</span>
          </div>
        </div>
      </div>
    `,
    benefits: [
      { icon: '👆', title: 'एकै क्लिकमा + / − कन्ट्रोल', desc: 'विद्यार्थी भर्ना वा बिदा हुँदा तुरुन्त अपडेट' },
      { icon: '⚡', title: 'रियल-टाइम सिंक', desc: 'वेबसाइटमा एक सेकेन्डमै परिवर्तन देखिने' },
      { icon: '📱', title: 'मोबाइलबाटै सजिलो', desc: 'जहाँसुकै बसेर पनि अपडेट गर्न सकिने' }
    ]
  },

  // POSTER 4: Upload Photos & Edit Everything
  {
    id: 'poster-4-edit-everything',
    tag: '🎨 फिचर ४ • पूर्ण व्यवस्थापन',
    title: 'फोटोहरु राख्न र सबै कुरा<br><span class="highlight">इडिट गर्न मिल्ने!</span>',
    subtitle: 'होस्टेलका नयाँ फोटो, ७ दिने खानाको मेनु, नियमहरू र शुल्क आफै परिवर्तन गर्नुहोस्।',
    renderVisual: () => `
      <div class="mockup-card">
        <div class="mockup-header dark-head">
          <div class="window-dots">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="url-bar">himalayannest.com.np/admin/settings</div>
          <span class="status-badge admin">⚙️ पूर्ण नियन्त्रण</span>
        </div>
        
        <div class="mockup-body">
          <div class="photo-upload-section">
            <div class="section-title">
              <span>📸 फोटो ग्यालरी व्यवस्थापन</span>
              <span class="upload-badge">+ नयाँ फोटो थप्नुहोस्</span>
            </div>
            <div class="photo-gallery-preview">
              <div class="photo-thumb-wrap">
                <img src="${roomImgBase64}" class="gallery-thumb" alt="Room" />
                <span class="badge-caption">कोठा</span>
              </div>
              <div class="photo-thumb-wrap">
                <img src="${exteriorImgBase64}" class="gallery-thumb" alt="Exterior" />
                <span class="badge-caption">भवन</span>
              </div>
              <div class="photo-thumb-wrap">
                <img src="${rooftopImgBase64}" class="gallery-thumb" alt="Rooftop" />
                <span class="badge-caption">रूफटप</span>
              </div>
            </div>
          </div>

          <div class="features-edit-grid">
            <div class="edit-tile">
              <div class="tile-icon">🍛</div>
              <div class="tile-txt">
                <strong>७-दिने खाना मेनु</strong>
                <span>दैनिक मेनु सजिलै एडिट</span>
              </div>
              <span class="edit-pencil">✎</span>
            </div>
            <div class="edit-tile">
              <div class="tile-icon">📢</div>
              <div class="tile-txt">
                <strong>पप-अप सूचना</strong>
                <span>अफर र एडमिसन सूचना</span>
              </div>
              <span class="edit-pencil">✎</span>
            </div>
            <div class="edit-tile">
              <div class="tile-icon">🎨</div>
              <div class="tile-txt">
                <strong>ब्रान्ड कलर र लोगो</strong>
                <span>मनपर्ने कलरमा वेबसाइट</span>
              </div>
              <span class="edit-pencil">✎</span>
            </div>
            <div class="edit-tile">
              <div class="tile-icon">📜</div>
              <div class="tile-txt">
                <strong>होस्टेल नियमहरू</strong>
                <span>सर्त र गाइडलाइनहरू</span>
              </div>
              <span class="edit-pencil">✎</span>
            </div>
          </div>
        </div>
      </div>
    `,
    benefits: [
      { icon: '🚫', title: 'डेभलपरलाई गुहार्न नपर्ने', desc: 'आफैले आफ्नो कम्प्युटर वा मोबाइलबाटै एडिट' },
      { icon: '🍱', title: 'खानाको तालिका परिवर्तन', desc: 'प्रत्येक हप्ताको मेनु अद्यावधिक' },
      { icon: '🌟', title: 'तपाईंको आफ्नै ब्रान्ड', desc: 'होस्टेलको आफ्नै नाम र लोगोमा संचालन' }
    ]
  },

  // POSTER 5: Grand Finale / Call To Action & WhatsApp Contact (with 9868731607)
  {
    id: 'poster-5-grand-finale-cta',
    tag: '🚀 होस्टेल डिजिटल बनाउने समय',
    title: 'तपाईंको होस्टेललाई आजै<br><span class="highlight">स्मार्ट र डिजिटल बनाउनुहोस्!</span>',
    subtitle: 'विद्यार्थी भर्ना बढाउनुहोस् र होस्टेल व्यवस्थापनलाई बनाउनुहोस् १०० गुना सजिलो।',
    renderVisual: () => `
      <div class="cta-master-card">
        <div class="floating-tech-badge">
          <img src="${logoBase64}" class="mini-logo" alt="Nexaform" />
          <span>POWERED BY NEXAFORM</span>
        </div>

        <div class="cta-central-box">
          <div class="whatsapp-circle-3d">
            <svg viewBox="0 0 24 24" class="wa-svg" fill="currentColor">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.353.101.173.449.741.964 1.2 0.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564c.173.087.289.13.332.202.043.073.043.419-.101.824z"/>
            </svg>
          </div>
          
          <div class="cta-direct-text">लाइभ डेमो हेर्न सिधै सम्पर्क गर्नुहोस्</div>
          <div class="whatsapp-number-display">+977 9868731607</div>
          <div class="sub-wa-hint">वा WhatsApp मा तुरुन्तै म्यासेज गर्नुहोस् • ९८६८७३१६०७</div>

          <div class="guarantee-pills">
            <span class="gpill">⚡ २४ घण्टामा तयार</span>
            <span class="gpill">📱 १ वर्ष फ्री सपोर्ट</span>
            <span class="gpill">🔒 १००% सुरक्षित</span>
          </div>
        </div>

        <div class="branding-footer-card">
          <div class="brand-left">
            <img src="${logoBase64}" class="footer-logo" alt="Nexaform" />
            <div class="footer-brand-info">
              <strong>Nexaform Technologies</strong>
              <span>Nepal's Modern Digital Solutions</span>
            </div>
          </div>
          <div class="brand-right">
            <span class="tech-tag">Next.js 15</span>
            <span class="tech-tag">Supabase</span>
          </div>
        </div>
      </div>
    `,
    benefits: [
      { icon: '🏆', title: 'नेपालभरका होस्टेलहरूको रोजाइ', desc: 'सयौं विद्यार्थीहरूलाई आकर्षित गर्नुहोस्' },
      { icon: '💰', title: 'किफायती मूल्यमा आधुनिक वेबसाइट', desc: 'होस्टेल व्यवस्थापन झन् सरल' },
      { icon: '🚀', title: 'आजै सुरु गर्नुहोस्', desc: 'अहिले नै ९८६८७३१६०७ मा सम्पर्क गर्नुहोस्' }
    ]
  }
];

function buildPosterHTML(poster) {
  return `<!DOCTYPE html>
<html lang="ne">
<head>
  <meta charset="UTF-8">
  <title>${poster.id}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800;900&family=Outfit:wght@400;600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    
    body {
      width: 1080px;
      height: 1920px;
      overflow: hidden;
      background-color: #ffffff;
      font-family: 'Noto Sans Devanagari', 'Mukta', sans-serif;
      color: #0f172a;
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 70px 65px;
      background: radial-gradient(circle at 10% 10%, rgba(255, 115, 68, 0.06) 0%, transparent 40%),
                  radial-gradient(circle at 90% 85%, rgba(99, 102, 241, 0.08) 0%, transparent 45%),
                  #ffffff;
      font-feature-settings: "kern" 1, "liga" 1, "clig" 1;
      -webkit-font-smoothing: antialiased;
    }

    /* Subtle geometric grid background */
    body::before {
      content: "";
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(to right, rgba(0, 0, 0, 0.025) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 0, 0, 0.025) 1px, transparent 1px);
      background-size: 50px 50px;
      pointer-events: none;
      z-index: 0;
    }

    .content-wrapper {
      position: relative;
      z-index: 1;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Top Navigation Bar with Logo */
    .top-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding-bottom: 25px;
      border-bottom: 1.5px solid rgba(0, 0, 0, 0.06);
    }

    .brand-logo-group {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .brand-logo-img {
      width: 68px;
      height: 68px;
      object-fit: contain;
      filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.08));
    }

    .brand-text {
      display: flex;
      flex-direction: column;
    }

    .brand-title {
      font-family: 'Outfit', sans-serif;
      font-size: 26px;
      font-weight: 800;
      letter-spacing: -0.5px;
      color: #0f172a;
      line-height: 1.1;
    }

    .brand-tagline {
      font-size: 14px;
      color: #64748b;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1px;
    }

    .badge-feature {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      background: #f1f5f9;
      color: #0f172a;
      padding: 10px 22px;
      border-radius: 9999px;
      font-size: 17px;
      font-weight: 700;
      border: 1px solid rgba(0, 0, 0, 0.08);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
    }

    /* Hero Text Area */
    .hero-text-block {
      margin-top: 35px;
      margin-bottom: 35px;
    }

    .main-title {
      font-size: 64px;
      font-weight: 800;
      line-height: 1.18;
      letter-spacing: -0.5px;
      color: #090d16;
    }

    .main-title .highlight {
      color: #ea580c;
      display: inline-block;
    }

    .subtitle {
      margin-top: 14px;
      font-size: 24px;
      line-height: 1.45;
      color: #475569;
      font-weight: 500;
      max-width: 920px;
    }

    /* Central Visual Canvas */
    .visual-container {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 780px;
    }

    /* ----------------------------------------------------
       RESPONSIVE DUO MOCKUP (Desktop + Overlapping Mobile)
    ---------------------------------------------------- */
    .duo-mockup-wrapper {
      position: relative;
      width: 100%;
      height: 740px;
      display: flex;
      align-items: center;
      justify-content: flex-start;
    }

    .floating-platform-badge {
      position: absolute;
      z-index: 40;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 9999px;
      padding: 10px 20px;
      font-size: 16px;
      font-weight: 800;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge-desktop-pos {
      top: -15px;
      left: 10px;
      color: #0f172a;
    }

    .badge-mobile-pos {
      top: 40px;
      right: 15px;
      color: #ea580c;
      background: #fff7ed;
      border-color: #fed7aa;
    }

    .live-pulse-dot {
      width: 10px;
      height: 10px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.3);
    }

    .desktop-frame {
      width: 780px;
      height: 560px;
      background: #0f172a;
      border-radius: 24px;
      overflow: hidden;
      box-shadow: 
        0 25px 65px -15px rgba(0, 0, 0, 0.3),
        0 0 0 1.5px rgba(0, 0, 0, 0.1);
      display: flex;
      flex-direction: column;
    }

    .desktop-top-bar {
      background: #1e293b;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid #334155;
    }

    .desktop-screen {
      flex: 1;
      position: relative;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .web-navbar {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
      background: rgba(15, 23, 42, 0.88);
      backdrop-filter: blur(10px);
      padding: 12px 22px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .web-logo {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 17px;
      color: #ffffff;
      letter-spacing: 0.5px;
    }

    .web-links {
      display: flex;
      gap: 16px;
      font-size: 13px;
      color: #94a3b8;
      font-weight: 600;
    }

    .web-links .active-link {
      color: #fdba74;
      font-weight: 700;
    }

    .web-btn {
      background: #ea580c;
      color: white;
      padding: 7px 16px;
      border-radius: 8px;
      font-size: 12px;
      font-weight: 700;
    }

    .web-hero-content {
      position: relative;
      width: 100%;
      height: 100%;
    }

    .web-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .web-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 55%, rgba(0,0,0,0.15) 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 70px 40px;
      color: white;
    }

    .hero-top-tag {
      font-size: 13px;
      font-weight: 700;
      color: #fdba74;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 10px;
    }

    .web-hero-h1 {
      font-size: 46px;
      font-weight: 900;
      line-height: 1.08;
      margin-bottom: 12px;
      font-family: 'Outfit', sans-serif;
      text-shadow: 0 4px 16px rgba(0,0,0,0.6);
    }

    .web-hero-sub {
      font-size: 15px;
      color: #e2e8f0;
      max-width: 440px;
      line-height: 1.45;
      margin-bottom: 20px;
    }

    .web-hero-cta {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .hero-price-badge {
      font-size: 13px;
      color: #cbd5e1;
      font-weight: 600;
    }

    .hero-price-badge span {
      font-size: 24px;
      color: #ea580c;
      font-weight: 900;
      font-family: 'Outfit', sans-serif;
    }

    .hero-book-btn {
      background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
      color: white;
      border: none;
      padding: 12px 24px;
      border-radius: 10px;
      font-weight: 800;
      font-size: 15px;
      box-shadow: 0 8px 20px rgba(234, 88, 12, 0.4);
    }

    /* Floating Mobile Mockup */
    .mobile-frame {
      position: absolute;
      right: 15px;
      bottom: -15px;
      width: 310px;
      height: 610px;
      background: #0f172a;
      border-radius: 40px;
      border: 8px solid #1e293b;
      box-shadow: 
        0 35px 80px -15px rgba(0, 0, 0, 0.45),
        0 0 0 2px rgba(255, 255, 255, 0.2);
      overflow: hidden;
      display: flex;
      flex-direction: column;
      z-index: 30;
    }

    .mobile-notch {
      width: 110px;
      height: 22px;
      background: #000;
      border-radius: 0 0 14px 14px;
      margin: 0 auto;
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      z-index: 35;
    }

    .mobile-screen {
      flex: 1;
      position: relative;
      overflow: hidden;
    }

    .mobile-hero-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mobile-hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(180deg, rgba(0,0,0,0.5) 0%, rgba(0,0,0,0.92) 100%);
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 24px 20px;
      color: white;
    }

    .mobile-top-bar {
      position: absolute;
      top: 28px;
      left: 16px;
      right: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 25;
    }

    .mobile-brand {
      font-size: 14px;
      font-weight: 800;
      color: white;
      font-family: 'Outfit', sans-serif;
    }

    .mobile-menu-btn {
      font-size: 16px;
      background: rgba(255,255,255,0.2);
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .mobile-pill {
      font-size: 12px;
      background: rgba(234, 88, 12, 0.2);
      border: 1px solid #ea580c;
      color: #fdba74;
      padding: 4px 10px;
      border-radius: 6px;
      font-weight: 700;
      width: fit-content;
      margin-bottom: 8px;
    }

    .mobile-h1 {
      font-size: 26px;
      font-weight: 900;
      line-height: 1.15;
      margin-bottom: 6px;
      font-family: 'Outfit', sans-serif;
    }

    .mobile-sub {
      font-size: 12px;
      color: #cbd5e1;
      line-height: 1.35;
      margin-bottom: 12px;
    }

    .mobile-price {
      font-size: 13px;
      color: #94a3b8;
      margin-bottom: 14px;
    }

    .mobile-price strong {
      font-size: 18px;
      color: #ea580c;
      font-weight: 800;
    }

    .mobile-cta-btn {
      width: 100%;
      background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
      color: white;
      border: none;
      padding: 14px;
      border-radius: 12px;
      font-size: 15px;
      font-weight: 800;
      text-align: center;
      box-shadow: 0 6px 18px rgba(234, 88, 12, 0.4);
    }

    /* ----------------------------------------------------
       STANDARD MOCKUP CARD & STYLES
    ---------------------------------------------------- */
    .mockup-card {
      width: 100%;
      background: #ffffff;
      border-radius: 28px;
      box-shadow: 
        0 20px 50px -10px rgba(0, 0, 0, 0.1),
        0 0 0 1.5px rgba(0, 0, 0, 0.07);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    .mockup-header {
      background: #f8fafc;
      padding: 18px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1.5px solid #e2e8f0;
    }

    .mockup-header.dark-head {
      background: #0f172a;
      border-bottom: 1px solid #1e293b;
    }

    .window-dots {
      display: flex;
      gap: 9px;
    }

    .dot {
      width: 14px;
      height: 14px;
      border-radius: 50%;
    }
    .dot.red { background: #ef4444; }
    .dot.yellow { background: #f59e0b; }
    .dot.green { background: #10b981; }

    .url-bar {
      font-family: 'Outfit', monospace;
      font-size: 15px;
      font-weight: 600;
      color: #64748b;
      background: #ffffff;
      padding: 6px 20px;
      border-radius: 8px;
      border: 1px solid #e2e8f0;
    }

    .mockup-header.dark-head .url-bar {
      background: #1e293b;
      color: #94a3b8;
      border-color: #334155;
    }

    .status-badge {
      font-size: 13px;
      font-weight: 800;
      padding: 6px 14px;
      border-radius: 9999px;
      letter-spacing: 0.5px;
    }

    .status-badge.live {
      background: #dcfce7;
      color: #15803d;
    }

    .status-badge.available {
      background: #e0e7ff;
      color: #4338ca;
    }

    .status-badge.admin {
      background: #fef3c7;
      color: #92400e;
    }

    .mockup-body {
      padding: 34px;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      gap: 22px;
    }

    /* Feature 1 Specifics */
    .room-preview-row {
      display: flex;
      gap: 22px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 18px;
      padding: 18px;
    }

    .preview-thumb {
      width: 180px;
      height: 125px;
      border-radius: 14px;
      object-fit: cover;
    }

    .preview-details {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;
    }

    .cat-pill {
      font-size: 16px;
      font-weight: 700;
      color: #0f172a;
    }

    .price-text {
      font-size: 26px;
      font-weight: 800;
      color: #ea580c;
    }

    .per-month {
      font-size: 15px;
      color: #64748b;
      font-weight: 500;
    }

    .room-tags {
      display: flex;
      gap: 8px;
    }

    .tag {
      font-size: 12px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      padding: 3px 8px;
      border-radius: 6px;
      font-weight: 600;
      color: #334155;
    }

    .booking-form-box {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      padding: 24px;
    }

    .form-title {
      font-size: 20px;
      font-weight: 800;
      margin-bottom: 16px;
      color: #0f172a;
    }

    .input-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 16px;
      margin-bottom: 20px;
    }

    .input-group label {
      display: block;
      font-size: 14px;
      font-weight: 700;
      color: #64748b;
      margin-bottom: 6px;
    }

    .fake-input {
      background: #f8fafc;
      border: 1.5px solid #cbd5e1;
      border-radius: 10px;
      padding: 12px 16px;
      font-size: 17px;
      font-weight: 600;
      color: #0f172a;
    }

    .fake-input.active-selection {
      background: #eff6ff;
      border-color: #3b82f6;
      color: #1d4ed8;
      font-weight: 700;
    }

    .cta-button {
      width: 100%;
      background: linear-gradient(135deg, #ea580c 0%, #f97316 100%);
      color: #ffffff;
      border: none;
      border-radius: 14px;
      padding: 18px 24px;
      font-size: 22px;
      font-weight: 800;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
      box-shadow: 0 10px 25px -5px rgba(234, 88, 12, 0.4);
    }

    .notification-float {
      display: flex;
      align-items: center;
      gap: 14px;
      background: #ecfdf5;
      border: 1.5px solid #a7f3d0;
      border-radius: 14px;
      padding: 14px 20px;
    }

    .notif-icon {
      width: 38px;
      height: 38px;
      background: #10b981;
      color: white;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
    }

    .notif-text {
      font-size: 16px;
      color: #065f46;
    }

    /* Feature 2 Specifics */
    .featured-room-hero {
      position: relative;
      width: 100%;
      height: 340px;
      border-radius: 20px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }

    .hero-room-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .hero-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(to top, rgba(0, 0, 0, 0.75) 0%, transparent 60%);
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      padding: 24px;
    }

    .overlay-badge {
      background: rgba(255, 255, 255, 0.95);
      color: #0f172a;
      font-size: 20px;
      font-weight: 800;
      padding: 8px 18px;
      border-radius: 10px;
    }

    .vacancy-count-pill {
      background: #ea580c;
      color: white;
      font-size: 18px;
      font-weight: 800;
      padding: 8px 18px;
      border-radius: 10px;
    }

    .beds-visual-layout {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 18px;
      padding: 20px;
    }

    .layout-label {
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
      margin-bottom: 14px;
    }

    .beds-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .bed-chip {
      background: #ffffff;
      border-radius: 14px;
      padding: 16px;
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1.5px solid #e2e8f0;
    }

    .bed-chip.available-bed {
      border-color: #22c55e;
      background: #f0fdf4;
    }

    .bed-chip.occupied-bed {
      border-color: #cbd5e1;
      background: #f8fafc;
      opacity: 0.75;
    }

    .bed-icon {
      font-size: 28px;
    }

    .bed-info strong {
      display: block;
      font-size: 15px;
      color: #0f172a;
    }

    .badge-free {
      font-size: 13px;
      font-weight: 800;
      color: #16a34a;
    }

    .badge-busy {
      font-size: 13px;
      font-weight: 700;
      color: #94a3b8;
    }

    .amenities-strip {
      display: flex;
      justify-content: space-between;
      gap: 10px;
    }

    .amenity {
      flex: 1;
      text-align: center;
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 12px;
      padding: 12px 6px;
      font-size: 14px;
      font-weight: 700;
      color: #334155;
    }

    /* Feature 3 Specifics (Admin Bed Stepper) */
    .admin-top-stats {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    .stat-box {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 18px;
      text-align: center;
    }

    .stat-box.highlight-stat {
      background: #fff7ed;
      border-color: #fdba74;
    }

    .stat-num {
      display: block;
      font-size: 40px;
      font-weight: 900;
      color: #0f172a;
      line-height: 1;
      font-family: 'Outfit', sans-serif;
    }

    .stat-box.highlight-stat .stat-num {
      color: #ea580c;
    }

    .stat-lbl {
      font-size: 15px;
      font-weight: 700;
      color: #64748b;
      margin-top: 6px;
      display: block;
    }

    .steppers-card {
      background: #ffffff;
      border: 2px solid #e2e8f0;
      border-radius: 20px;
      padding: 24px;
    }

    .steppers-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      font-size: 18px;
      font-weight: 800;
      color: #0f172a;
    }

    .synced-tag {
      font-size: 13px;
      background: #dcfce7;
      color: #15803d;
      padding: 5px 12px;
      border-radius: 9999px;
      font-weight: 700;
    }

    .stepper-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px;
      border-radius: 14px;
      margin-bottom: 10px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }

    .stepper-row.active-row {
      background: #eff6ff;
      border-color: #bfdbfe;
    }

    .room-meta strong {
      display: block;
      font-size: 18px;
      color: #0f172a;
    }

    .room-meta .sub-meta {
      font-size: 14px;
      color: #64748b;
    }

    .stepper-controls {
      display: flex;
      align-items: center;
      gap: 12px;
    }

    .step-btn {
      width: 44px;
      height: 44px;
      border-radius: 12px;
      border: 1.5px solid #cbd5e1;
      background: #ffffff;
      font-size: 24px;
      font-weight: 800;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0f172a;
    }

    .step-btn.glowing {
      background: #ea580c;
      color: white;
      border-color: #ea580c;
      box-shadow: 0 4px 14px rgba(234, 88, 12, 0.4);
    }

    .step-val {
      font-size: 28px;
      font-weight: 800;
      min-width: 40px;
      text-align: center;
      font-family: 'Outfit', sans-serif;
    }

    .step-val.focus {
      color: #ea580c;
      font-size: 32px;
    }

    .sync-banner {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 14px;
      padding: 14px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 16px;
      color: #334155;
    }

    .sync-pulse {
      width: 12px;
      height: 12px;
      background: #22c55e;
      border-radius: 50%;
      box-shadow: 0 0 0 4px rgba(34, 197, 94, 0.25);
    }

    /* Feature 4 Specifics (Photos & Edit All) */
    .photo-upload-section {
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      padding: 22px;
    }

    .section-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 18px;
      font-weight: 800;
      margin-bottom: 16px;
    }

    .upload-badge {
      background: #ea580c;
      color: white;
      font-size: 14px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 8px;
    }

    .photo-gallery-preview {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
    }

    .photo-thumb-wrap {
      position: relative;
      height: 160px;
      border-radius: 14px;
      overflow: hidden;
      border: 1.5px solid #e2e8f0;
    }

    .gallery-thumb {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .badge-caption {
      position: absolute;
      bottom: 8px;
      left: 8px;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      font-size: 13px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 6px;
    }

    .features-edit-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
    }

    .edit-tile {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 16px;
      padding: 18px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .tile-icon {
      font-size: 32px;
    }

    .tile-txt strong {
      display: block;
      font-size: 16px;
      color: #0f172a;
    }

    .tile-txt span {
      font-size: 13px;
      color: #64748b;
    }

    .edit-pencil {
      margin-left: auto;
      font-size: 18px;
      color: #94a3b8;
    }

    /* Feature 5 Grand Finale Specifics */
    .cta-master-card {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 28px;
    }

    .floating-tech-badge {
      display: inline-flex;
      align-items: center;
      gap: 12px;
      background: #f8fafc;
      border: 1.5px solid #e2e8f0;
      padding: 10px 22px;
      border-radius: 9999px;
      align-self: center;
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 15px;
      letter-spacing: 1px;
      color: #334155;
    }

    .mini-logo {
      width: 28px;
      height: 28px;
      object-fit: contain;
    }

    .cta-central-box {
      background: linear-gradient(145deg, #ffffff 0%, #f0fdf4 100%);
      border: 2px solid #86efac;
      border-radius: 32px;
      padding: 50px 36px;
      text-align: center;
      box-shadow: 
        0 25px 60px -15px rgba(22, 163, 74, 0.15),
        0 0 0 1px rgba(34, 197, 94, 0.1);
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .whatsapp-circle-3d {
      width: 110px;
      height: 110px;
      background: #25d366;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      box-shadow: 0 14px 35px rgba(37, 211, 102, 0.45);
      margin-bottom: 24px;
    }

    .wa-svg {
      width: 65px;
      height: 65px;
    }

    .cta-direct-text {
      font-size: 24px;
      font-weight: 700;
      color: #166534;
      margin-bottom: 10px;
    }

    .whatsapp-number-display {
      font-family: 'Outfit', sans-serif;
      font-size: 62px;
      font-weight: 900;
      color: #0f172a;
      letter-spacing: -0.5px;
      line-height: 1.1;
      margin-bottom: 8px;
    }

    .sub-wa-hint {
      font-size: 20px;
      color: #15803d;
      font-weight: 700;
      margin-bottom: 28px;
    }

    .guarantee-pills {
      display: flex;
      gap: 14px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .gpill {
      background: #ffffff;
      border: 1.5px solid #bbf7d0;
      color: #15803d;
      padding: 8px 18px;
      border-radius: 9999px;
      font-size: 16px;
      font-weight: 800;
    }

    .branding-footer-card {
      background: #0f172a;
      color: white;
      border-radius: 24px;
      padding: 24px 32px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .brand-left {
      display: flex;
      align-items: center;
      gap: 18px;
    }

    .footer-logo {
      width: 52px;
      height: 52px;
      object-fit: contain;
    }

    .footer-brand-info strong {
      display: block;
      font-family: 'Outfit', sans-serif;
      font-size: 20px;
      font-weight: 800;
    }

    .footer-brand-info span {
      font-size: 14px;
      color: #94a3b8;
    }

    .brand-right {
      display: flex;
      gap: 10px;
    }

    .tech-tag {
      background: #1e293b;
      color: #e2e8f0;
      font-family: 'Outfit', sans-serif;
      font-size: 13px;
      font-weight: 700;
      padding: 6px 14px;
      border-radius: 8px;
      border: 1px solid #334155;
    }

    /* Bottom Benefits Bar (3 cards) */
    .benefits-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-top: 35px;
    }

    .benefit-card {
      background: #ffffff;
      border: 1.5px solid #e2e8f0;
      border-radius: 20px;
      padding: 22px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.03);
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .benefit-icon {
      font-size: 32px;
      margin-bottom: 4px;
    }

    .benefit-title {
      font-size: 19px;
      font-weight: 800;
      color: #0f172a;
      line-height: 1.25;
    }

    .benefit-desc {
      font-size: 15px;
      color: #64748b;
      font-weight: 500;
    }

    /* Bottom Copyright Bar */
    .bottom-bar {
      margin-top: 25px;
      padding-top: 20px;
      border-top: 1.5px solid rgba(0, 0, 0, 0.06);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 15px;
      color: #64748b;
      font-weight: 600;
    }

    .powered-by {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      color: #0f172a;
    }
  </style>
</head>
<body>
  <div class="content-wrapper">
    <!-- Top Bar with Nexaform Logo on Top-Left -->
    <header class="top-header">
      <div class="brand-logo-group">
        <img src="${logoBase64}" class="brand-logo-img" alt="Nexaform Logo" />
        <div class="brand-text">
          <span class="brand-title">NEXAFORM</span>
          <span class="brand-tagline">HOSTEL WEB TECH</span>
        </div>
      </div>
      <div class="badge-feature">${poster.tag}</div>
    </header>

    <!-- Main Headline Area -->
    <section class="hero-text-block">
      <h1 class="main-title">${poster.title}</h1>
      <p class="subtitle">${poster.subtitle}</p>
    </section>

    <!-- Center Interactive Mockup Graphic -->
    <div class="visual-container">
      ${poster.renderVisual()}
    </div>

    <!-- Bottom Feature Benefits -->
    <div class="benefits-grid">
      ${poster.benefits.map(b => `
        <div class="benefit-card">
          <div class="benefit-icon">${b.icon}</div>
          <div class="benefit-title">${b.title}</div>
          <div class="benefit-desc">${b.desc}</div>
        </div>
      `).join('')}
    </div>

    <!-- Bottom Footer Bar -->
    <footer class="bottom-bar">
      <span>🌐 www.nexaform.com • आधुनिक होस्टेल व्यवस्थापन सफ्टवेयर</span>
      <span class="powered-by">Smart Digital System 2026</span>
    </footer>
  </div>
</body>
</html>`;
}

// Generate the 6 HTML files and then take screenshots
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

for (const poster of posters) {
  const htmlFile = path.join(OUTPUT_DIR, `${poster.id}.html`);
  const pngFile = path.join(OUTPUT_DIR, `${poster.id}.png`);
  
  fs.writeFileSync(htmlFile, buildPosterHTML(poster), 'utf-8');
  console.log(`Saved HTML: ${htmlFile}`);

  // Use chrome headless to render 1080x1920 screenshot
  try {
    const cmd = `"${chromePath}" --headless --screenshot="${pngFile}" --window-size=1080,1920 --default-background-color=00000000 --hide-scrollbars "file:///${htmlFile.replace(/\\/g, '/')}"`;
    console.log(`Rendering PNG for ${poster.id}...`);
    execSync(cmd, { stdio: 'inherit' });
    console.log(`Successfully generated: ${pngFile}`);
  } catch (err) {
    console.error(`Error rendering ${poster.id}:`, err);
  }
}

console.log("All posters generated successfully!");
