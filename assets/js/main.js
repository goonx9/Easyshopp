/**
 * Car Jump Starter - Main JavaScript (Vanilla JS)
 * Zero frameworks, zero dependencies, 100% GitHub Pages Compatible
 * Conversion-focused Direct-Response Landing Page Engine
 */

// EmailJS Configuration Object
const EMAILJS_CONFIG = {
  serviceId: window.EMAILJS_SERVICE_ID || 'service_gxhivxk',
  templateId: window.EMAILJS_TEMPLATE_ID || 'template_239s5yz',
  publicKey: window.EMAILJS_PUBLIC_KEY || '_h1UzYlyePtWt0IqM'
};

document.addEventListener('DOMContentLoaded', () => {
  initEmailJS();
  initMobileNav();
  initVideoPlayers();
  initFaqAccordion();
  initVariantSelectors();
  initOrderNowCTAs();
  initOrderForm();
  initMetaPixelTracking();
  initStickyMobileBar();
});

/**
 * Initialize EmailJS SDK
 * Safely fetches public config from backend if available, or uses window constants
 */
async function initEmailJS() {
  if (!EMAILJS_CONFIG.publicKey) {
    try {
      const res = await fetch('/api/emailjs-config');
      if (res.ok) {
        const data = await res.json();
        if (data.serviceId) EMAILJS_CONFIG.serviceId = data.serviceId;
        if (data.templateId) EMAILJS_CONFIG.templateId = data.templateId;
        if (data.publicKey) EMAILJS_CONFIG.publicKey = data.publicKey;
      }
    } catch (err) {
      // Running statically without server endpoint
    }
  }

  if (typeof window.emailjs !== 'undefined' && EMAILJS_CONFIG.publicKey) {
    try {
      window.emailjs.init({
        publicKey: EMAILJS_CONFIG.publicKey
      });
      console.log('EmailJS initialized successfully.');
    } catch (e) {
      console.warn('EmailJS initialization warning:', e);
    }
  }
}

/* ==========================================================================
   1. REUSABLE CLICK-TO-LOAD VIDEO COMPONENT
   Critical Performance Requirement: Zero MP4 preloading before user click
   ========================================================================== */
function initVideoPlayers() {
  const containers = document.querySelectorAll('.video-container');

  containers.forEach(container => {
    container.addEventListener('click', function handleVideoPlay() {
      const videoSrc = this.getAttribute('data-video-src');
      if (!videoSrc) return;

      // Prevent duplicate video creation
      if (this.querySelector('video')) return;

      // Remove thumbnail & play overlay
      this.innerHTML = '';

      // Create video element strictly matching requirements
      const video = document.createElement('video');
      video.setAttribute('controls', 'true');
      video.setAttribute('playsinline', 'true');
      video.setAttribute('preload', 'none');
      video.className = 'video-player';

      const source = document.createElement('source');
      source.src = videoSrc;
      source.type = 'video/mp4';

      video.appendChild(source);
      this.appendChild(video);

      // Start playback
      video.play().catch(err => {
        console.log('Video play error or permissions block:', err);
      });

      // Track interaction if Meta Pixel is loaded
      if (typeof window.fbq === 'function') {
        window.fbq('trackCustom', 'WatchProductVideo', { video_src: videoSrc });
      }
    });
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
  const menuBtn = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');

  if (!menuBtn || !mobileNav) return;

  menuBtn.addEventListener('click', () => {
    mobileNav.classList.toggle('open');
  });

  // Close when clicking a nav link
  mobileNav.querySelectorAll('.nav-link, .btn').forEach(link => {
    link.addEventListener('click', () => {
      mobileNav.classList.remove('open');
    });
  });
}

/* ==========================================================================
   3. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    if (!question) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Close all others
      faqItems.forEach(otherItem => {
        if (otherItem !== item) otherItem.classList.remove('active');
      });

      // Toggle current
      item.classList.toggle('active', !isActive);
    });
  });
}

/* ==========================================================================
   4. PRODUCT VARIANTS & CONFIGURATION
   Standard: ₦59,900 (Jump Starter Only) 
   Premium: ₦69,900 (Jump Starter + Digital Tire Inflator Pump)
   ========================================================================== */
const PRODUCTS = {
  'standard': {
    id: 'jump-starter-standard',
    name: 'Car Jump Starter (Jump Starter Only)',
    variant: 'Standard (Jump Starter Only)',
    price: 59900,
    priceFormatted: '₦59,900',
    originalPriceFormatted: '₦95,000',
    image: 'https://res.cloudinary.com/dmy2yiax9/image/upload/f_auto,q_auto,w_800/v1787000239/5771575669845332195_duiuzr.jpg'
  },
  'premium': {
    id: 'jump-starter-premium-tire-inflator',
    name: '2-in-1 Combo (Jump Starter + Digital Tire Inflator)',
    variant: 'Premium (Jump Starter + Tire Inflator)',
    price: 69900,
    priceFormatted: '₦69,900',
    originalPriceFormatted: '₦115,000',
    image: 'https://res.cloudinary.com/dmy2yiax9/image/upload/f_auto,q_auto,w_800/v1787000239/5771575669845332193_u8om14.jpg'
  }
};

let currentVariantKey = 'standard';
let currentQuantity = 1;

function initVariantSelectors() {
  const variantCards = document.querySelectorAll('.variant-card');
  const mainGalleryImg = document.getElementById('mainGalleryImg');
  const priceDisplay = document.getElementById('productPriceDisplay');
  const origPriceDisplay = document.getElementById('productOrigPriceDisplay');
  const thumbButtons = document.querySelectorAll('.thumb-btn');

  // Variant selector cards on product section
  variantCards.forEach(card => {
    card.addEventListener('click', function () {
      const selectedVariant = this.getAttribute('data-variant');
      if (!PRODUCTS[selectedVariant]) return;

      selectVariant(selectedVariant);
    });
  });

  // Gallery Thumbnail Clicks
  thumbButtons.forEach(btn => {
    btn.addEventListener('click', function () {
      const imgSrc = this.getAttribute('data-img-src');
      if (mainGalleryImg && imgSrc) {
        mainGalleryImg.src = imgSrc;
        thumbButtons.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      }
    });
  });

  // Quantity adjustments
  const qtyMinus = document.getElementById('qtyMinus');
  const qtyPlus = document.getElementById('qtyPlus');
  const qtyValue = document.getElementById('qtyValue');
  const formQtySelect = document.getElementById('orderQty');

  if (qtyMinus && qtyPlus && qtyValue) {
    qtyMinus.addEventListener('click', () => {
      if (currentQuantity > 1) {
        currentQuantity--;
        qtyValue.textContent = currentQuantity;
        if (formQtySelect) formQtySelect.value = currentQuantity;
        updateOrderSummary();
      }
    });

    qtyPlus.addEventListener('click', () => {
      if (currentQuantity < 10) {
        currentQuantity++;
        qtyValue.textContent = currentQuantity;
        if (formQtySelect) formQtySelect.value = currentQuantity;
        updateOrderSummary();
      }
    });
  }

  // Radio buttons inside order form
  const formRadios = document.querySelectorAll('input[name="formVariant"]');
  formRadios.forEach(radio => {
    radio.addEventListener('change', function () {
      if (this.checked) {
        selectVariant(this.value);
      }
    });
  });

  if (formQtySelect) {
    formQtySelect.addEventListener('change', function () {
      currentQuantity = parseInt(this.value, 10) || 1;
      if (qtyValue) qtyValue.textContent = currentQuantity;
      updateOrderSummary();
    });
  }

  // Support for package comparison buttons
  const selectPackageBtns = document.querySelectorAll('[data-select-package]');
  selectPackageBtns.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const pkg = this.getAttribute('data-select-package');
      if (pkg && PRODUCTS[pkg]) {
        selectVariant(pkg);
        const orderFormSection = document.getElementById('order-form');
        if (orderFormSection) {
          orderFormSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });
}

function selectVariant(variantKey) {
  if (!PRODUCTS[variantKey]) return;
  currentVariantKey = variantKey;
  const product = PRODUCTS[variantKey];

  // Update top cards
  const variantCards = document.querySelectorAll('.variant-card');
  variantCards.forEach(c => {
    if (c.getAttribute('data-variant') === variantKey) {
      c.classList.add('selected');
    } else {
      c.classList.remove('selected');
    }
  });

  // Update form radio buttons and parent labels
  const formRadios = document.querySelectorAll('input[name="formVariant"]');
  formRadios.forEach(radio => {
    const parentLabel = radio.closest('.form-variant-label') || radio.closest('.edition-card-label');
    if (radio.value === variantKey) {
      radio.checked = true;
      if (parentLabel) parentLabel.classList.add('selected');
    } else {
      radio.checked = false;
      if (parentLabel) parentLabel.classList.remove('selected');
    }
  });

  // Update gallery & price
  const mainGalleryImg = document.getElementById('mainGalleryImg');
  const priceDisplay = document.getElementById('productPriceDisplay');
  const origPriceDisplay = document.getElementById('productOrigPriceDisplay');

  if (priceDisplay) priceDisplay.textContent = product.priceFormatted;
  if (origPriceDisplay) origPriceDisplay.textContent = product.originalPriceFormatted;
  if (mainGalleryImg) mainGalleryImg.src = product.image;

  updateOrderSummary();
}

function updateOrderSummary() {
  const summaryVariant = document.getElementById('summaryVariant');
  const summaryPrice = document.getElementById('summaryPrice');
  const summaryTotal = document.getElementById('summaryTotal');
  const stickyBarPrice = document.getElementById('stickyBarPrice');

  const product = PRODUCTS[currentVariantKey] || PRODUCTS['standard'];
  const totalAmount = product.price * currentQuantity;

  if (summaryVariant) {
    summaryVariant.textContent = `${product.variant} Edition (Qty: ${currentQuantity})`;
  }
  if (summaryPrice) {
    summaryPrice.textContent = `₦${(product.price * currentQuantity).toLocaleString()}`;
  }
  if (summaryTotal) {
    summaryTotal.textContent = `₦${totalAmount.toLocaleString()}`;
  }
  if (stickyBarPrice) {
    stickyBarPrice.textContent = `₦${(product.price * currentQuantity).toLocaleString()}`;
  }
}

/**
 * Sticky Mobile Bar Controller
 * Shows sticky CTA bar after scrolling past hero, hides inside checkout area
 */
function initStickyMobileBar() {
  const stickyBar = document.getElementById('stickyMobileBar');
  const heroSection = document.getElementById('hero');
  const orderSection = document.getElementById('order-form');
  if (!stickyBar) return;

  function onScroll() {
    const scrollY = window.scrollY;
    const heroH = heroSection ? heroSection.offsetHeight : 300;
    const orderRect = orderSection ? orderSection.getBoundingClientRect() : null;

    const isPastHero = scrollY > heroH * 0.7;
    const isInsideOrder = orderRect && orderRect.top <= (window.innerHeight - 50) && orderRect.bottom >= 50;

    if (isPastHero && !isInsideOrder && window.innerWidth <= 640) {
      stickyBar.style.display = 'flex';
    } else {
      stickyBar.style.display = 'none';
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();
}

/* ==========================================================================
   5. ORDER NOW CTAs & SMOOTH SCROLLING
   Smoothly scroll to #order-form and trigger Meta Pixel InitiateCheckout
   ========================================================================== */
let lastCheckoutEventTime = 0;

function initOrderNowCTAs() {
  // Target every CTA that triggers ordering
  const orderButtons = document.querySelectorAll('a[href="#order-form"], button.btn-order-now, .order-cta-btn');

  orderButtons.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      
      const orderFormSection = document.getElementById('order-form');
      if (orderFormSection) {
        orderFormSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Fire Meta Pixel InitiateCheckout once per intent (with 10-second debounce)
      const now = Date.now();
      if (now - lastCheckoutEventTime > 10000) {
        lastCheckoutEventTime = now;
        if (typeof window.fbq === 'function') {
          const product = PRODUCTS[currentVariantKey] || PRODUCTS['standard'];
          window.fbq('track', 'InitiateCheckout', {
            content_name: product.name,
            content_ids: [product.id],
            content_type: 'product',
            content_category: 'Automotive Accessories',
            num_items: currentQuantity,
            value: product.price * currentQuantity,
            currency: 'NGN'
          });
        }
      }
    });
  });
}

/* ==========================================================================
   6. META PIXEL: VIEWCONTENT TRACKING
   Triggered once when visitor reaches the main product engagement area
   ========================================================================== */
function initMetaPixelTracking() {
  let viewContentFired = false;
  const productSection = document.getElementById('product') || document.getElementById('benefits');

  if (productSection && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !viewContentFired) {
          viewContentFired = true;
          if (typeof window.fbq === 'function') {
            window.fbq('track', 'ViewContent', {
              content_name: 'Car Jump Starter - AutoPower Nigeria',
              content_ids: ['jump-starter-standard'],
              content_type: 'product',
              content_category: 'Automotive Emergency Power',
              value: 59900,
              currency: 'NGN'
            });
          }
          observer.disconnect();
        }
      });
    }, { threshold: 0.2 });

    observer.observe(productSection);
  }
}

/* ==========================================================================
   7. SIMPLE ORDER FORM AT THE BOTTOM (MAIN CONVERSION POINT)
   ========================================================================== */
function initOrderForm() {
  const orderForm = document.getElementById('orderForm');
  if (!orderForm) return;

  // Initialize summary display
  updateOrderSummary();

  orderForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const fullName = document.getElementById('fullName')?.value.trim();
    const phone = document.getElementById('phone')?.value.trim();
    const whatsapp = document.getElementById('whatsapp')?.value.trim() || phone;
    const altPhone = document.getElementById('altPhone')?.value.trim() || '';
    const state = document.getElementById('state')?.value;
    const city = document.getElementById('city')?.value.trim();
    const address = document.getElementById('address')?.value.trim();

    if (!fullName || !phone || !state || !city || !address) {
      alert('Please complete all required fields (Full Name, Phone Number, State, City, and Delivery Address).');
      return;
    }

    const submitBtn = orderForm.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <span style="display:inline-flex; align-items:center; justify-content:center; gap:0.5rem;">
          <svg style="animation: spin 1s linear infinite; width: 20px; height: 20px;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10" stroke="currentColor" stroke-opacity="0.25"></circle><path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-linecap="round"></path></svg>
          Processing Order...
        </span>
      `;
    }

    const product = PRODUCTS[currentVariantKey] || PRODUCTS['standard'];
    const totalAmount = product.price * currentQuantity;
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    const dateFormatted = new Date().toLocaleString('en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      timeZone: 'Africa/Lagos'
    });

    const orderData = {
      orderId: orderId,
      customer: { fullName, phone, whatsapp, altPhone, state, city, address },
      product: {
        id: product.id,
        name: product.name,
        variant: product.variant,
        price: product.price,
        quantity: currentQuantity
      },
      total: totalAmount,
      currency: 'NGN',
      paymentMethod: 'Payment on Delivery',
      createdAt: new Date().toISOString()
    };

    console.log('New Order Placed:', orderData);

    // 1. Send Order to Server Backup Endpoint (Logs order & stores for retrieval)
    try {
      fetch('/api/submit-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      }).then(r => r.json()).then(data => {
        console.log('Server Backup: Order logged with response:', data);
      }).catch(err => {
        // Static host environment
      });
    } catch (e) {}

    // 2. Send Email Notification via EmailJS
    if (typeof window.emailjs !== 'undefined' && EMAILJS_CONFIG.serviceId && EMAILJS_CONFIG.templateId && EMAILJS_CONFIG.publicKey) {
      try {
        const templateParams = {
          // Standard Identifiers
          order_id: orderId,
          orderId: orderId,
          to_name: 'Store Admin',
          to_email: 'franklinlaptop10@gmail.com',
          reply_to: 'franklinlaptop10@gmail.com',
          
          // Customer Details
          customer_name: fullName,
          name: fullName,
          customer_phone: phone,
          phone: phone,
          customer_whatsapp: whatsapp,
          whatsapp: whatsapp,
          alt_phone: altPhone || 'N/A',
          altPhone: altPhone || 'N/A',
          alternative_phone: altPhone || 'N/A',
          
          // Location & Address
          delivery_address: `${address}, ${city}, ${state} State`,
          address: `${address}, ${city}, ${state} State`,
          customer_state: state,
          state: state,
          customer_city: city,
          city: city,
          customer_street: address,
          
          // Product Details
          package_edition: `${product.variant} Edition`,
          package: `${product.variant} Edition`,
          variant: product.variant,
          product_name: product.name,
          quantity: currentQuantity,
          qty: currentQuantity,
          unit_price: `₦${product.price.toLocaleString()}`,
          total_amount: `₦${totalAmount.toLocaleString()}`,
          total: `₦${totalAmount.toLocaleString()}`,
          payment_method: 'Payment on Delivery',
          order_date: dateFormatted,
          date: dateFormatted
        };

        const emailResponse = await window.emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.templateId,
          templateParams,
          EMAILJS_CONFIG.publicKey
        );
        console.log('EmailJS: Order notification email dispatched successfully!', emailResponse);
      } catch (emailErr) {
        console.error('EmailJS Error: Failed to send email. Details:', emailErr);
      }
    } else {
      console.warn('EmailJS Notice: EmailJS credentials not set yet. To receive emails, configure EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, and EMAILJS_PUBLIC_KEY.');
    }

      // Advanced matching: pass user data before Purchase for better attribution
      if (typeof window.fbq === 'function') {
        window.fbq('init', '446510071587010', {
          ph: phone.replace(/\D/g, ''),
          fn: (fullName.split(' ')[0] || '').toLowerCase(),
          ln: (fullName.split(' ').slice(1).join(' ') || '').toLowerCase(),
          ct: city.toLowerCase().trim(),
          st: state.toLowerCase().trim(),
          country: 'ng'
        });
      }
    }

    // 3. Track Meta Pixel Lead & Purchase
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'Lead', {
        content_name: `${product.variant} Car Jump Starter`,
        value: totalAmount,
        currency: 'NGN'
      });
      window.fbq('track', 'Purchase', {
        content_name: product.name,
        content_ids: [product.id],
        content_type: 'product',
        num_items: currentQuantity,
        value: totalAmount,
        currency: 'NGN'
      });
    }

    /* --------------------------------------------------------------------------
       Direct WhatsApp Dispatch Hook for Nigerian Operations (08039940408)
       -------------------------------------------------------------------------- */
    const whatsappMessage = encodeURIComponent(
      `*NEW ORDER - CAR JUMP STARTER*\n` +
      `🔖 *Order Ref:* #${orderId}\n\n` +
      `📦 *Package:* ${product.variant} Edition (Qty: ${currentQuantity})\n` +
      `💰 *Total Amount:* ₦${totalAmount.toLocaleString()}\n` +
      `👤 *Full Name:* ${fullName}\n` +
      `📞 *Phone:* ${phone}\n` +
      `💬 *WhatsApp:* ${whatsapp}\n` +
      (altPhone ? `📱 *Alt Phone:* ${altPhone}\n` : '') +
      `📍 *Delivery Address:* ${address}, ${city}, ${state} State\n` +
      `💳 *Payment Terms:* Pay on Delivery\n\n` +
      `Please confirm my delivery dispatch.`
    );

    // Render Success UI
    orderForm.innerHTML = `
      <div style="text-align: center; padding: 2.5rem 1rem;">
        <div style="width: 64px; height: 64px; background-color: #dcfce7; color: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 1.5rem auto;">
          <svg xmlns="http://www.w3.org/2000/svg" width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
        </div>
        <div style="display: inline-block; background: #f1f5f9; padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.82rem; font-weight: 700; color: #475569; margin-bottom: 0.75rem;">
          Order Ref: #${orderId}
        </div>
        <h3 style="font-size: 1.6rem; font-weight: 800; color: #0f172a; margin-bottom: 0.5rem;">Order Received Successfully!</h3>
        <p style="color: #64748b; font-size: 1rem; margin-bottom: 1.5rem; line-height: 1.6; max-width: 520px; margin-left: auto; margin-right: auto;">
          Thank you, <strong>${fullName}</strong>. Your order for the <strong>${product.variant} Car Jump Starter (Qty: ${currentQuantity})</strong> has been logged. Our dispatch team will call or message you on <strong>${phone}</strong> shortly before delivery to <strong>${city}, ${state}</strong>.
        </p>
        <div style="display: flex; flex-direction: column; gap: 0.75rem; max-width: 360px; margin: 0 auto;">
          <a href="https://wa.me/2348039940408?text=${whatsappMessage}" target="_blank" rel="noopener" class="btn btn-primary btn-lg btn-full" style="background-color: #25D366; color: #ffffff;">
            Confirm Instantly on WhatsApp
          </a>
          <a href="#hero" class="btn btn-outline btn-sm">Back to Top</a>
        </div>
      </div>
    `;

    // Smoothly ensure order confirmation is in view
    const orderFormSection = document.getElementById('order-form');
    if (orderFormSection) {
      orderFormSection.scrollIntoView({ behavior: 'smooth' });
    }
  });
}
