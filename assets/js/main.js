/* ==========================================================================
   DR. RAJIB DEB NATH WEBSITE - MAIN JAVASCRIPT & JQUERY SCRIPT
   Includes: Sticky Navbar, Scroll Reveal Animations, Testimonial Slider, 
             Accordion, Appointment Modal Popup, Toast Notifications, and CounterUp
   ========================================================================== */

/**
 * Dynamic Active Page Nav Link & Gradient Border Highlighting via Script
 * Standalone Pure Vanilla JS (0ms delay, zero CDN dependency)
 * Injects all active styles dynamically into DOM so no active CSS is needed in style.css.
 * Automatically detects current page URL/filename and activates the matching nav link.
 */
(function initActiveNavBorder() {
  // 1. Inject Active Nav Link & Border Styles dynamically via Script
  function injectActiveNavCSS() {
    if (document.getElementById('dynamic-active-nav-styles')) return;
    const style = document.createElement('style');
    style.id = 'dynamic-active-nav-styles';
    style.textContent = `
      /* ==========================================================
         CURRENT PAGE ACTIVE NAV LINK & BORDER STYLES (VIA SCRIPT)
         ========================================================== */
      .nav-links a.active {
        color: var(--primary, #0d9488) !important;
        font-weight: 700 !important;
      }
      .nav-links a.active::after {
        content: '' !important;
        position: absolute !important;
        bottom: -2px !important;
        left: 0 !important;
        width: 100% !important;
        height: 3.5px !important;
        background: linear-gradient(90deg, #06b6d4, #10b981, #6366f1) !important;
        border-radius: 4px !important;
        box-shadow: 0 2px 8px rgba(6, 182, 212, 0.4) !important;
        transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1) !important;
      }
    `;
    (document.head || document.documentElement).appendChild(style);
  }

  function applyActiveNavState() {
    injectActiveNavCSS();
    try {
      const pathname = window.location.pathname || '';
      const cleanPath = pathname.replace(/\\/g, '/');
      const segments = cleanPath.split('/').filter(Boolean);
      let filename = segments.pop() || 'index.html';

      // Remove query parameters or hash from filename
      filename = filename.split('#')[0].split('?')[0].toLowerCase();

      // Normalize root/empty path to index.html
      if (!filename || filename === '/' || filename === '') {
        filename = 'index.html';
      }

      // Add .html extension for clean server URLs (e.g. /about -> about.html)
      if (!filename.includes('.')) {
        filename += '.html';
      }

      // Map subpages/child routes to their primary navigation parent
      if (filename === 'single-service.html') {
        filename = 'services.html';
      } else if (filename === 'single-blog.html') {
        filename = 'blog.html';
      }

      const navAnchors = document.querySelectorAll('.nav-links > li > a');
      if (!navAnchors || navAnchors.length === 0) return;

      let matchFound = false;

      navAnchors.forEach(function (link) {
        const href = (link.getAttribute('href') || '').toLowerCase().trim();

        // Skip anchor/phone/action buttons
        if (!href || href.startsWith('#') || href.startsWith('tel:') || href.startsWith('mailto:')) {
          return;
        }

        let linkFilename = href.split('#')[0].split('?')[0].replace(/\\/g, '/').split('/').filter(Boolean).pop() || '';
        if (!linkFilename || linkFilename === '') {
          linkFilename = 'index.html';
        }
        if (!linkFilename.includes('.')) {
          linkFilename += '.html';
        }

        if (linkFilename === filename) {
          link.classList.add('active');
          matchFound = true;
        } else {
          link.classList.remove('active');
        }
      });

      // Fallback: If no match found and page is home/root, activate Home
      if (!matchFound && (filename === 'index.html' || pathname === '' || pathname === '/')) {
        const homeLink = document.querySelector('.nav-links > li > a[href="index.html"], .nav-links > li > a[href="./"], .nav-links > li > a[href="/"]');
        if (homeLink) homeLink.classList.add('active');
      }
    } catch (err) {
      console.warn('Active nav border script error:', err);
    }
  }

  // Inject CSS styles immediately
  injectActiveNavCSS();

  // Execute active state immediately if DOM elements exist, otherwise on DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', applyActiveNavState);
  } else {
    applyActiveNavState();
  }

  // Expose globally for dynamic routing
  window.initActiveNavBorder = applyActiveNavState;
})();

$(document).ready(function () {
  // 1. Sticky Header & Scroll Progress Bar
  $(window).on('scroll', function () {
    const winScroll = $(window).scrollTop();
    const height = $(document).height() - $(window).height();
    const scrolled = (winScroll / (height || 1)) * 100;
    $('#scrollProgressBar').css('width', scrolled + '%');

    if (winScroll > 30) {
      $('.header-main').addClass('scrolled');
    } else {
      $('.header-main').removeClass('scrolled');
    }
  });

  // 2. Active Page Nav Link Highlighting (Triggered via Script)
  if (window.initActiveNavBorder) {
    window.initActiveNavBorder();
  }

  // 3. Mobile Navigation Menu Toggle Drawer
  $(document).on('click', '.mobile-menu-btn', function (e) {
    e.stopPropagation();
    $('.nav-links').toggleClass('active');
    const icon = $(this).find('i');
    if ($('.nav-links').hasClass('active')) {
      icon.removeClass('fa-bars').addClass('fa-xmark');
    } else {
      icon.removeClass('fa-xmark').addClass('fa-bars');
    }
  });

  $(document).on('click', function (e) {
    if (!$(e.target).closest('.navbar').length) {
      $('.nav-links').removeClass('active');
      $('.mobile-menu-btn i').removeClass('fa-xmark').addClass('fa-bars');
    }
  });

  // 4. Ensure Light Theme Mode Globally
  localStorage.removeItem('dr_rajib_theme');
  $('body').removeClass('dark-theme dark');

  // 5. High-Performance Scroll Reveal Animation Observer (IntersectionObserver)
  function initScrollReveal() {
    const revealElements = document.querySelectorAll('.reveal, .reveal-up, .reveal-left, .reveal-right, .reveal-scale');
    if (!revealElements.length) return;

    if ('IntersectionObserver' in window) {
      const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, {
        root: null,
        rootMargin: '0px 0px 60px 0px',
        threshold: 0.08
      });

      revealElements.forEach(el => {
        // Elements already in the initial viewport
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight + 60) {
          el.classList.add('in-view');
        } else {
          revealObserver.observe(el);
        }
      });
    } else {
      // Fallback for older browsers
      revealElements.forEach(el => el.classList.add('in-view'));
    }
  }
  initScrollReveal();

  // 6. Appointment Modal Popup Controls
  $(document).on('click', '.open-appointment-modal', function (e) {
    e.preventDefault();
    const selectedTime = $(this).attr('data-time');
    if (selectedTime) {
      $('#problemNote').val(`Preferred Time Slot: ${selectedTime}`);
    }
    $('#appointmentModal').css('display', 'flex').hide().fadeIn(300);
    $('body').css('overflow', 'hidden');
  });

  $(document).on('click', '.close-modal, #appointmentModal', function (e) {
    if (e.target.id === 'appointmentModal' || $(e.target).hasClass('close-modal') || $(e.target).closest('.close-modal').length > 0) {
      $('#appointmentModal').fadeOut(250, function () {
        $('body').css('overflow', 'auto');
      });
    }
  });

  // Default Appointment Date min & value to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  $('#appointDate, #cAppointDate').attr('min', tomorrowStr).val(tomorrowStr);

  // 7. Appointment Form Submission Handling (Modal & Contact Page)
  const APPOINTMENT_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz5LD_wqV8E4iiFfF6U_tRjWVxAdfzL8B2Q4bkwOQfZsI3V_q-27mzbhJUJc5khwxM/exec';

  $('#appointmentForm, #contactPageForm').on('submit', function (e) {
    e.preventDefault();
    const isContactForm = $(this).attr('id') === 'contactPageForm';
    const nameInput = isContactForm ? $('#cPatientName') : $('#patientName');
    const phoneInput = isContactForm ? $('#cPatientPhone') : $('#patientPhone');
    const ageInput = isContactForm ? $('#cPatientAge') : $('#patientAge');
    const dateInput = isContactForm ? $('#cAppointDate') : $('#appointDate');
    const chamberSelect = isContactForm ? $('#cChamber') : $('#chamberLocation');
    const noteInput = isContactForm ? $('#cNote') : $('#problemNote');

    const patientName = nameInput.val().trim();
    const patientPhone = phoneInput.val().trim();
    const patientAge = ageInput.val() ? ageInput.val().trim() : '';
    const appointDate = dateInput.val() ? dateInput.val().trim() : '';
    const chamberLocation = chamberSelect.val() ? chamberSelect.find('option:selected').text().trim() : '';
    const problemNote = noteInput.val() ? noteInput.val().trim() : '';

    if (!patientName || !patientPhone) {
      showToast('অনুগ্রহ করে নাম এবং মোবাইল নম্বর দিন', 'error');
      return;
    }

    const submitBtn = $(this).find('button[type="submit"]');
    const originalText = submitBtn.html();
    submitBtn.html('<i class="fa-solid fa-spinner fa-spin"></i> সাবমিট হচ্ছে...').prop('disabled', true);

    const formData = new URLSearchParams();
    formData.append('patientName', patientName);
    formData.append('patientPhone', patientPhone);
    formData.append('patientAge', patientAge);
    formData.append('appointDate', appointDate);
    formData.append('chamberLocation', chamberLocation);
    formData.append('problemNote', problemNote);

    // ১. Google Sheets এবং Gmail-এ ডাটা প্রেরণ
    fetch(APPOINTMENT_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: formData.toString()
    })
    .then(function () {
      finishSubmission();
    })
    .catch(function () {
      // Even if fetch returns CORS warning in some browsers, Google Script still processes POST
      finishSubmission();
    });

    function finishSubmission() {
      if (!isContactForm) {
        $('#appointmentModal').fadeOut(250, function () {
          $('body').css('overflow', 'auto');
        });
      }

      submitBtn.html(originalText).prop('disabled', false);
      if (isContactForm) {
        $('#contactPageForm')[0].reset();
      } else {
        $('#appointmentForm')[0].reset();
      }

      showToast(`ধন্যবাদ ${patientName}! আপনার সিরিয়াল রিকোয়েস্ট সফলভাবে জমা হয়েছে।`);

      // ২. WhatsApp-এ বিস্তারিত তথ্যসহ মেসেজ ওপেন
      const waMessage = `হ্যালো ডা. রাজীব দেবনাথ, আমি চেম্বার সিরিয়াল বুক করতে চাই:\n\n*নাম:* ${patientName}\n*মোবাইল:* ${patientPhone}\n*বয়স:* ${patientAge || 'N/A'}\n*তারিখ:* ${appointDate}\n*চেম্বার:* ${chamberLocation}\n*সমস্যা:* ${problemNote || 'N/A'}`;
      const waUrl = `https://wa.me/8801325109870?text=${encodeURIComponent(waMessage)}`;

      setTimeout(function () {
        window.open(waUrl, '_blank');
      }, 700);
    }
  });

  // 8. FAQ Accordion Click Handler
  $(document).on('click', '.faq-question, .accordion-header', function () {
    const item = $(this).closest('.faq-item, .accordion-item');
    const content = item.find('.faq-answer, .accordion-content');

    $('.faq-item, .accordion-item').not(item).removeClass('active').find('.faq-answer, .accordion-content').slideUp(300);

    item.toggleClass('active');
    content.slideToggle(300);
  });

  // 9. Floating Back-to-Top Button Handler (Appears when scrolled 50px)
  function checkBackToTop() {
    if ($(window).scrollTop() > 50) {
      $('#backToTop, .back-to-top-btn').addClass('show');
    } else {
      $('#backToTop, .back-to-top-btn').removeClass('show');
    }
  }

  $(window).on('scroll resize', checkBackToTop);
  checkBackToTop();

  $(document).on('click', '#backToTop, .back-to-top-btn', function (e) {
    e.preventDefault();
    $('html, body').animate({ scrollTop: 0 }, 500);
  });

  // 10. Smooth CounterUp Number Animation
  function animateCounters() {
    $('.counter-value').each(function () {
      const $this = $(this);
      const target = parseInt($this.attr('data-target'), 10);
      const suffix = $this.attr('data-suffix') || '';

      if (isNaN(target) || $this.hasClass('animated')) return;
      $this.addClass('animated');

      $({ countNum: 0 }).animate(
        { countNum: target },
        {
          duration: 2000,
          easing: 'swing',
          step: function () {
            const formatted = Math.floor(this.countNum).toLocaleString('en-US');
            $this.text(formatted + suffix);
          },
          complete: function () {
            const formatted = target.toLocaleString('en-US');
            $this.text(formatted + suffix);
          }
        }
      );
    });
  }

  if ('IntersectionObserver' in window) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounters();
        }
      });
    }, { threshold: 0.2 });

    document.querySelectorAll('#stats, .stats-section, #impact-metrics, .stats-grid, #why-choose-us').forEach(el => counterObserver.observe(el));
  } else {
    animateCounters();
  }

  // 11. Lightbox Image Gallery Popup
  let galleryImagesList = [];
  let currentGalleryIndex = 0;

  function updateGalleryPopup(index) {
    if (galleryImagesList.length === 0) return;
    if (index < 0) index = galleryImagesList.length - 1;
    if (index >= galleryImagesList.length) index = 0;
    currentGalleryIndex = index;

    const item = galleryImagesList[currentGalleryIndex];
    $('#popupImage').fadeOut(150, function () {
      $(this).attr('src', item.src).fadeIn(150);
    });
    $('#popupImageCaption').text(item.title || '');
    $('#popupImageCounter').text(`${currentGalleryIndex + 1} / ${galleryImagesList.length}`);
  }

  $(document).on('click', '.open-image-popup, .gallery-card-item', function (e) {
    e.preventDefault();

    galleryImagesList = [];
    $('.open-image-popup, .gallery-card-item').each(function (idx) {
      const src = $(this).attr('data-img-src') || $(this).find('img').attr('src');
      const title = $(this).attr('data-img-title') || $(this).find('.gallery-overlay span').text() || $(this).find('img').attr('alt');
      if (src) {
        galleryImagesList.push({ src, title });
        if (this === e.currentTarget || $(this).has(e.target).length > 0) {
          currentGalleryIndex = idx;
        }
      }
    });

    if (galleryImagesList.length > 0) {
      updateGalleryPopup(currentGalleryIndex);
      $('#imageModal').css('display', 'flex').hide().fadeIn(300);
      $('body').css('overflow', 'hidden');
    }
  });

  $(document).on('click', '#nextImgBtn', function (e) {
    e.stopPropagation();
    updateGalleryPopup(currentGalleryIndex + 1);
  });

  $(document).on('click', '#prevImgBtn', function (e) {
    e.stopPropagation();
    updateGalleryPopup(currentGalleryIndex - 1);
  });

  $(document).on('keydown', function (e) {
    if ($('#imageModal').is(':visible')) {
      if (e.key === 'ArrowRight') {
        updateGalleryPopup(currentGalleryIndex + 1);
      } else if (e.key === 'ArrowLeft') {
        updateGalleryPopup(currentGalleryIndex - 1);
      } else if (e.key === 'Escape') {
        $('#imageModal').fadeOut(250, function () {
          $('#popupImage').attr('src', '');
          $('body').css('overflow', 'auto');
        });
      }
    }
  });

  $(document).on('click', '#closeImageModal, #imageModal', function (e) {
    if (e.target.id === 'closeImageModal' || e.target.id === 'imageModal' || $(e.target).hasClass('close-image-modal')) {
      $('#imageModal').fadeOut(250, function () {
        $('#popupImage').attr('src', '');
        $('body').css('overflow', 'auto');
      });
    }
  });

  // 12. Toast Notification Global Function
  window.showToast = function (message, type = 'success') {
    let toast = $('#toastNotification');
    if (toast.length === 0) {
      $('body').append(`
        <div id="toastNotification" class="toast-notification">
          <i class="fa-solid fa-circle-check"></i>
          <span class="toast-msg"></span>
        </div>
      `);
      toast = $('#toastNotification');
    }

    if (type === 'error') {
      toast.css('background', '#ef4444').find('i').attr('class', 'fa-solid fa-circle-exclamation');
    } else {
      toast.css('background', '#10b981').find('i').attr('class', 'fa-solid fa-circle-check');
    }

    toast.find('.toast-msg').text(message);
    toast.addClass('show');

    setTimeout(function () {
      toast.removeClass('show');
    }, 4000);
  };

  // 13. PDF Direct Download Helper
  window.forceDownloadPDF = function (event, url, filename, toastMsg) {
    if (event) event.preventDefault();
    if (toastMsg && window.showToast) {
      window.showToast(toastMsg);
    }

    fetch(url)
      .then(response => {
        if (!response.ok) throw new Error('Network response failed');
        return response.blob();
      })
      .then(blob => {
        const blobUrl = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(blobUrl), 300);
      })
      .catch(() => {
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  };

  // 14. Reel Inline Video & Lightbox Handler
  $(document).on('click', '.reel-phone-card .reel-play-btn-circle, .reel-phone-card .reel-thumb-box', function (e) {
    if ($(e.target).closest('.reel-share-btn').length > 0) return;
    e.preventDefault();
    e.stopPropagation();
    const card = $(this).closest('.reel-phone-card');
    const thumbBox = card.find('.reel-thumb-box');
    const videoUrl = card.attr('data-video-url');

    if (videoUrl && !card.hasClass('playing')) {
      card.addClass('playing');
      const autoplayUrl = videoUrl.includes('?') ? `${videoUrl}&autoplay=true` : `${videoUrl}?autoplay=true`;
      thumbBox.html(`
        <iframe src="${autoplayUrl}" width="100%" height="100%" style="border:none;overflow:hidden;width:100%;height:100%;" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"></iframe>
      `);
    }
  });

  $(document).on('click', '.open-video-modal', function (e) {
    if ($(e.target).closest('.reel-share-btn').length > 0) return;
    e.preventDefault();
    const videoUrl = $(this).attr('data-video-url');
    const reelUrl = $(this).attr('data-reel-url');
    if (videoUrl) {
      $('#videoIframe').attr('src', videoUrl);
      $('#videoModal').css('display', 'flex').hide().fadeIn(300);
      $('body').css('overflow', 'hidden');
    } else if (reelUrl) {
      window.open(reelUrl, '_blank', 'noopener,noreferrer');
    }
  });

  $(document).on('click', '#closeVideoModal, #videoModal', function (e) {
    if (e.target.id === 'closeVideoModal' || e.target.id === 'videoModal' || $(e.target).hasClass('close-video-modal')) {
      $('#videoModal').fadeOut(250, function () {
        $('#videoIframe').attr('src', '');
        $('body').css('overflow', 'auto');
      });
    }
  });

  // 17. Blog Category Filter Handler
  $(document).on('click', '.filter-btn', function () {
    const filter = $(this).attr('data-filter');
    $('.filter-btn').removeClass('active');
    $(this).addClass('active');

    $('#blogSearchInput').val('');

    if (filter === 'all') {
      $('.blog-card').stop(true, true).fadeIn(300);
    } else {
      $('.blog-card').each(function () {
        const category = $(this).attr('data-category');
        if (category && category.includes(filter)) {
          $(this).stop(true, true).fadeIn(300);
        } else {
          $(this).stop(true, true).fadeOut(200);
        }
      });
    }
  });

  // 18. Blog Real-time Search Handler
  $(document).on('keyup', '#blogSearchInput', function () {
    const searchTerm = $(this).val().toLowerCase().trim();
    $('.filter-btn').removeClass('active');
    $('.filter-btn[data-filter="all"]').addClass('active');

    $('.blog-card').each(function () {
      const text = $(this).text().toLowerCase();
      if (text.includes(searchTerm)) {
        $(this).stop(true, true).fadeIn(300);
      } else {
        $(this).stop(true, true).fadeOut(200);
      }
    });
  });

  // 19. Blog Interactive Pagination Click Handler
  $(document).on('click', '.blog-pagination .pagination-btn', function () {
    const btn = $(this);
    if (btn.hasClass('disabled') || btn.is(':disabled')) return;

    if (btn.hasClass('page-num')) {
      $('.blog-pagination .page-num').removeClass('active');
      btn.addClass('active');
    } else if (btn.hasClass('next-btn')) {
      const currentActive = $('.blog-pagination .page-num.active');
      const nextBtn = currentActive.next('.page-num');
      if (nextBtn.length) {
        $('.blog-pagination .page-num').removeClass('active');
        nextBtn.addClass('active');
      }
    } else if (btn.hasClass('prev-btn')) {
      const currentActive = $('.blog-pagination .page-num.active');
      const prevBtn = currentActive.prev('.page-num');
      if (prevBtn.length) {
        $('.blog-pagination .page-num').removeClass('active');
        prevBtn.addClass('active');
      }
    }

    // Update prev/next disabled status based on active page
    const activePageNum = parseInt($('.blog-pagination .page-num.active').attr('data-page') || '1');
    if (activePageNum <= 1) {
      $('.prev-btn').addClass('disabled').prop('disabled', true);
    } else {
      $('.prev-btn').removeClass('disabled').prop('disabled', false);
    }

    if (activePageNum >= 8) {
      $('.next-btn').addClass('disabled').prop('disabled', true);
    } else {
      $('.next-btn').removeClass('disabled').prop('disabled', false);
    }

    // Smooth scroll to top of blog section
    $('html, body').animate({
      scrollTop: $('#blog-posts-section').offset().top - 80
    }, 400);

    showToast(`Switched to Blog Page ${activePageNum}`);
  });
});

/* ==========================================================================
   20. Social Media Share Helper Functions
   ========================================================================== */
window.shareArticleOnFB = function(e) {
  if (e) e.preventDefault();
  const url = encodeURIComponent(window.location.href);
  const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  window.open(fbShareUrl, 'facebook-share-dialog', 'width=626,height=436,location=no,toolbar=no,menubar=no');
  if (window.showToast) window.showToast('Opening Facebook Share...');
};

window.shareArticleOnWhatsApp = function(e) {
  if (e) e.preventDefault();
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const waUrl = `https://api.whatsapp.com/send?text=${title}%20${url}`;
  window.open(waUrl, '_blank', 'noopener,noreferrer');
  if (window.showToast) window.showToast('Opening WhatsApp Share...');
};

window.shareArticleOnLinkedIn = function(e) {
  if (e) e.preventDefault();
  const url = encodeURIComponent(window.location.href);
  const inUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
  window.open(inUrl, '_blank', 'noopener,noreferrer');
  if (window.showToast) window.showToast('Opening LinkedIn Share...');
};

window.shareArticleOnX = function(e) {
  if (e) e.preventDefault();
  const url = encodeURIComponent(window.location.href);
  const title = encodeURIComponent(document.title);
  const xUrl = `https://twitter.com/intent/tweet?text=${title}&url=${url}`;
  window.open(xUrl, '_blank', 'noopener,noreferrer');
  if (window.showToast) window.showToast('Opening X (Twitter) Share...');
};

window.copyArticleLink = function(e, btnElement) {
  if (e) e.preventDefault();
  const url = window.location.href;
  const $btn = $(btnElement);
  
  function onSuccess() {
    $btn.addClass('copied');
    const originalContent = $btn.html();
    $btn.html('<span class="share-btn-icon"><i class="fa-solid fa-check"></i></span><span class="share-btn-text">Copied!</span>');
    if (window.showToast) window.showToast('Article link copied to clipboard!');
    
    setTimeout(() => {
      $btn.removeClass('copied');
      $btn.html(originalContent);
    }, 2500);
  }

  function fallbackCopy() {
    const tempInput = document.createElement('input');
    tempInput.value = url;
    document.body.appendChild(tempInput);
    tempInput.select();
    try {
      document.execCommand('copy');
      onSuccess();
    } catch (err) {
      if (window.showToast) window.showToast('Could not copy link', 'error');
    }
    document.body.removeChild(tempInput);
  }

  if (navigator.clipboard && window.isSecureContext) {
    navigator.clipboard.writeText(url).then(onSuccess).catch(fallbackCopy);
  } else {
    fallbackCopy();
  }
};
