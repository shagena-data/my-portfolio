/* ================================================================
   SHAGENA BEEBE M — MODERN PORTFOLIO CONTROLLER
   Interactive Logic, Theme Switcher, Filters & Modals
   ================================================================ */

(function () {
  'use strict';

  // ─── 1. Theme Management (Modern Light / Dark Mode) ───────────────
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = document.getElementById('themeIcon');
  const htmlRoot = document.documentElement;

  // Retrieve saved preference or default to modern light theme
  const savedTheme = localStorage.getItem('shagena-portfolio-theme') || 'light';
  applyTheme(savedTheme);

  function applyTheme(theme) {
    htmlRoot.setAttribute('data-theme', theme);
    localStorage.setItem('shagena-portfolio-theme', theme);

    if (theme === 'dark') {
      themeIcon.className = 'fas fa-sun';
      themeToggle.setAttribute('title', 'Switch to Light Theme');
    } else {
      themeIcon.className = 'fas fa-moon';
      themeToggle.setAttribute('title', 'Switch to Dark Theme');
    }
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = htmlRoot.getAttribute('data-theme') || 'light';
      const newTheme = currentTheme === 'light' ? 'dark' : 'light';
      applyTheme(newTheme);
      showToast(newTheme === 'dark' ? 'Dark mode enabled 🌙' : 'Modern light mode enabled ☀️');
    });
  }

  // ─── 2. Toast Notification System ──────────────────────────────────
  const toastAlert = document.getElementById('toastAlert');
  const toastMessage = document.getElementById('toastMessage');
  let toastTimer = null;

  function showToast(message) {
    if (!toastAlert || !toastMessage) return;
    toastMessage.textContent = message;
    toastAlert.classList.add('show');

    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toastAlert.classList.remove('show');
    }, 3200);
  }

  // ─── 3. Copy Email to Clipboard ────────────────────────────────────
  const copyEmailHeroBtn = document.getElementById('copyEmailHeroBtn');
  const emailAddress = 'shagena17112002@gmail.com';

  if (copyEmailHeroBtn) {
    copyEmailHeroBtn.addEventListener('click', (e) => {
      e.preventDefault();
      copyToClipboard(emailAddress);
    });
  }

  function copyToClipboard(text) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast('Email copied to clipboard! 📋');
      }).catch(() => fallbackCopy(text));
    } else {
      fallbackCopy(text);
    }
  }

  function fallbackCopy(text) {
    const tempInput = document.createElement('input');
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      showToast('Email copied: ' + text + ' 📋');
    } catch (err) {
      window.location.href = 'mailto:' + text;
    }
    document.body.removeChild(tempInput);
  }

  // ─── 4. Navbar Scroll & Active Section Highlighting ────────────────
  const navbar = document.getElementById('navbar');
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  function handleNavbarScroll() {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Active Section Detection
    const scrollPosition = window.scrollY + 100;
    let activeId = '';

    sections.forEach((sec) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPosition >= top && scrollPosition < top + height) {
        activeId = sec.getAttribute('id');
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + activeId) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', handleNavbarScroll, { passive: true });
  handleNavbarScroll();

  // ─── 5. Mobile Navigation Menu ─────────────────────────────────────
  const hamburger = document.getElementById('hamburger');
  const navLinksContainer = document.getElementById('navLinks');

  if (hamburger && navLinksContainer) {
    hamburger.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close menu on link click
    navLinksContainer.querySelectorAll('.nav-link').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        navLinksContainer.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ─── 6. Smooth Scroll for Anchor Links ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      const targetElem = document.querySelector(targetId);
      if (targetElem) {
        e.preventDefault();
        const navHeight = navbar ? navbar.offsetHeight : 70;
        const targetTop = targetElem.getBoundingClientRect().top + window.scrollY - navHeight + 2;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  // ─── 7. Interactive Project Category Filters ───────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const projectCards = document.querySelectorAll('.modern-project-card');

  filterTabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const filterValue = tab.getAttribute('data-filter');

      // Update active tab
      filterTabs.forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Filter cards with smooth entrance
      projectCards.forEach((card) => {
        const categories = (card.getAttribute('data-category') || '').toLowerCase();
        if (filterValue === 'all' || categories.includes(filterValue)) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(16px)';
          requestAnimationFrame(() => {
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
              card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            }, 10);
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ─── 8. Comprehensive Project Modal Data & Logic ───────────────────
  const projectDatabase = {
    'retail-powerbi': {
      category: 'Power BI Dashboard & Analytics',
      title: 'Retail Sales Analytics Interactive Dashboard',
      context: 'Retail management needed a real-time business intelligence dashboard to identify top-performing product categories, seasonal profit dips, and regional sales bottlenecks across multi-city store operations.',
      methods: 'Utilized Power Query for ETL data ingestion, built a star-schema relational model, and authored custom DAX measures for Year-over-Year (YoY) growth, customer acquisition cost, and gross profit margin.',
      insights: [
        'Delivered 360-degree sales visibility across 5 product departments and 4 geographic regions.',
        'Implemented interactive drill-through pages that isolate low-margin items within 2 clicks.',
        'Allowed regional managers to benchmark store profitability vs. quarterly targets.',
        'Structured automated data refresh schedules eliminating manual Excel consolidating.'
      ],
      github: 'https://github.com/shagena-data/retail-sales-analytics-powerbi'
    },
    'ecommerce-eda': {
      category: 'Python Exploratory Data Analysis',
      title: 'E-Commerce Exploratory Data Analysis (EDA)',
      context: 'Online retail merchants generate hundreds of thousands of transaction records weekly. The objective was to clean raw customer datasets, find sales trends, and segment customer purchasing frequencies.',
      methods: 'Engineered Python pipelines using Pandas for missing value imputation and datetime parsing. Leveraged Matplotlib and Seaborn for correlation heatmaps, distribution plots, and basket frequency histograms.',
      insights: [
        'Discovered that 20% of catalog SKUs generated 78% of total e-commerce revenue (Pareto Principle).',
        'Identified peak checkout volumes between 7:00 PM and 10:00 PM on weekdays.',
        'Detected customer return rate patterns correlating directly with specific third-party courier services.',
        'Provided clean CSV outputs and statistical summaries for predictive marketing segmentation.'
      ],
      github: 'https://github.com/shagena-data/retail-sales-eda-python'
    },
    'food-delivery-sql': {
      category: 'SQL Business Intelligence Case Study',
      title: 'Food Delivery Operations & Customer Analytics',
      context: 'A fast-growing food delivery service required data-driven insights into rider delivery delays, peak order surges, customer reorder frequency, and restaurant commission structures.',
      methods: 'Authored complex MySQL scripts utilizing Window Functions (ROW_NUMBER, DENSE_RANK, LEAD/LAG), Common Table Expressions (CTEs), multi-table Joins, and aggregations.',
      insights: [
        'Quantified peak demand windows to optimize driver dispatching during rush-hour meal times.',
        'Calculated average customer lifetime value and 30-day retention rates using cohort analysis.',
        'Identified top 10 underperforming delivery corridors causing 40% of customer complaints.',
        'Structured modular views and stored queries for seamless feeding into BI reporting layers.'
      ],
      github: 'https://github.com/shagena-data/food-delivery-sql-analysis'
    },
    'bank-credit-excel': {
      category: 'Excel Financial Modeling & BI',
      title: 'Bank Customer Credit Risk & Financial Analysis',
      context: 'Financial institutions evaluate thousands of loan applicants monthly. This project modeled creditworthiness, debt-to-income (DTI) metrics, and default risk probabilities to enhance risk underwriting.',
      methods: 'Built dynamic multi-tab Excel models utilizing Pivot Tables, Pivot Charts, complex nested formulas (XLOOKUP, INDEX/MATCH, IF/IFS), conditional formatting risk heatmaps, and interactive slicers.',
      insights: [
        'Created an interactive borrower risk matrix categorizing applicants into Low, Medium, and High default risk.',
        'Visualized default probability correlations against income stability and debt-to-income ratios.',
        'Accelerated loan approval assessment time by providing loan officers with automated summary views.',
        'Constructed clean summary dashboards ready for executive management credit committee reviews.'
      ],
      github: 'https://github.com/shagena-data/bank-customer-credit-risk-analysis-excel'
    },
    'sentiment-nlp': {
      category: 'Natural Language Processing & Machine Learning',
      title: 'Social Media Sentiment Analysis System',
      context: 'Brands need to understand user public sentiment at scale across social media platforms to protect brand reputation and capture customer feedback.',
      methods: 'Developed an NLP preprocessing pipeline in Python featuring tokenization, stopword removal, lemmatization, and TF-IDF vectorization. Trained classification models using Scikit-Learn (Multinomial Naive Bayes & Logistic Regression).',
      insights: [
        'Achieved high classification accuracy across positive, negative, and neutral comment corpuses.',
        'Generated interactive WordCloud graphics isolating recurring customer pain points and praises.',
        'Automated real-time categorization of consumer feedback for customer support triage teams.',
        'Documented precision, recall, and F1-scores with confusion matrix visual evaluations.'
      ],
      github: 'https://github.com/shagena-data'
    },
    'medical-ai': {
      category: 'Healthcare AI & Web Integration',
      title: 'Personalized Medical Diagnosis Support System',
      context: 'Healthcare accessibility in rural regions can be aided by rapid preliminary symptom screening tools that guide users to relevant specialists and nearby care facilities.',
      methods: 'Trained Machine Learning classification models on multi-symptom medical datasets. Integrated the predictive core into a lightweight web interface built with Python and Flask, incorporating speech recognition and automated PDF generation.',
      insights: [
        'Accurately predicted probable health conditions based on user-selected or spoken symptom profiles.',
        'Included integrated nearest hospital locator functionality based on user location.',
        'Engineered downloadable PDF diagnostic summary sheets users can carry to clinical consultations.',
        'Built full responsive user interface ensuring smooth usability on mobile smartphones.'
      ],
      github: 'https://github.com/shagena-data'
    }
  };

  const projectModal = document.getElementById('projectModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const modalCloseActionBtn = document.getElementById('modalCloseActionBtn');
  const modalCategory = document.getElementById('modalCategory');
  const modalTitle = document.getElementById('modalTitle');
  const modalContext = document.getElementById('modalContext');
  const modalMethods = document.getElementById('modalMethods');
  const modalInsights = document.getElementById('modalInsights');
  const modalGithubLink = document.getElementById('modalGithubLink');

  function openProjectModal(projectId) {
    const data = projectDatabase[projectId];
    if (!data || !projectModal) return;

    modalCategory.textContent = data.category;
    modalTitle.textContent = data.title;
    modalContext.textContent = data.context;
    modalMethods.textContent = data.methods;
    modalGithubLink.href = data.github;

    // Populate insights bullets
    modalInsights.innerHTML = '';
    data.insights.forEach((insight) => {
      const li = document.createElement('li');
      li.innerHTML = '<i class="fas fa-check"></i> <span>' + insight + '</span>';
      modalInsights.appendChild(li);
    });

    projectModal.classList.add('active');
    projectModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeProjectModal() {
    if (!projectModal) return;
    projectModal.classList.remove('active');
    projectModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Bind click on all detail buttons
  document.querySelectorAll('.open-modal-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const projectId = btn.getAttribute('data-project');
      if (projectId) openProjectModal(projectId);
    });
  });

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeProjectModal);
  if (modalCloseActionBtn) modalCloseActionBtn.addEventListener('click', closeProjectModal);

  // ─── 9. Digital Resume Modal Logic ─────────────────────────────────
  const resumeModal = document.getElementById('resumeModal');
  const openResumeBtn = document.getElementById('openResumeBtn');
  const heroResumeBtn = document.getElementById('heroResumeBtn');
  const closeResumeBtn = document.getElementById('closeResumeBtn');
  const closeResumeActionBtn = document.getElementById('closeResumeActionBtn');

  function openResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.add('active');
    resumeModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeResumeModal() {
    if (!resumeModal) return;
    resumeModal.classList.remove('active');
    resumeModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  if (openResumeBtn) openResumeBtn.addEventListener('click', openResumeModal);
  if (heroResumeBtn) heroResumeBtn.addEventListener('click', openResumeModal);
  if (closeResumeBtn) closeResumeBtn.addEventListener('click', closeResumeModal);
  if (closeResumeActionBtn) closeResumeActionBtn.addEventListener('click', closeResumeModal);

  // Close modals on clicking backdrop or pressing ESC
  window.addEventListener('click', (e) => {
    if (e.target === projectModal) closeProjectModal();
    if (e.target === resumeModal) closeResumeModal();
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeProjectModal();
      closeResumeModal();
    }
  });

  // ─── 10. CGPA Meter Bar Animation ──────────────────────────────────
  const cgpaFills = document.querySelectorAll('.cgpa-meter-fill');
  if ('IntersectionObserver' in window) {
    const cgpaObserver = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pct = entry.target.getAttribute('data-pct') || '85%';
            entry.target.style.width = pct;
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );

    cgpaFills.forEach((fill) => cgpaObserver.observe(fill));
  } else {
    cgpaFills.forEach((fill) => {
      fill.style.width = fill.getAttribute('data-pct') || '85%';
    });
  }

  // ─── 11. Scroll To Top Floating Button ─────────────────────────────
  const scrollToTopBtn = document.getElementById('scrollToTopBtn');

  if (scrollToTopBtn) {
    window.addEventListener(
      'scroll',
      () => {
        if (window.scrollY > 380) {
          scrollToTopBtn.classList.add('visible');
        } else {
          scrollToTopBtn.classList.remove('visible');
        }
      },
      { passive: true }
    );

    scrollToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── 12. Quick Message Form Handler ────────────────────────────────
  const quickMessageForm = document.getElementById('quickMessageForm');

  if (quickMessageForm) {
    quickMessageForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('senderName').value.trim();
      const subject = document.getElementById('senderSubject').value.trim();
      const message = document.getElementById('senderMessage').value.trim();

      const fullSubject = encodeURIComponent(`[Portfolio Inquiry] ${subject} — ${name}`);
      const fullBody = encodeURIComponent(`Hello Shagena,\n\n${message}\n\nBest regards,\n${name}`);

      showToast('Opening your default email client... ✉️');

      setTimeout(() => {
        window.location.href = `mailto:shagena17112002@gmail.com?subject=${fullSubject}&body=${fullBody}`;
      }, 400);
    });
  }

  console.log(
    '%c🚀 Shagena Beebe M | Modern Data Analyst Portfolio Loaded Successfully',
    'font-size:13px; font-weight:bold; color:#4f46e5; padding: 4px;'
  );
})();
