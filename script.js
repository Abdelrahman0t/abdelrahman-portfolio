/**
 * ABDELRAHMAN PORTFOLIO — BUTTERY SMOOTH FLUID ENGINE + FRAMER CHARACTER BLUR REVEAL
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. INITIAL RENDER TYPEWRITER & ANIMATED TEXT REVEAL
     ========================================================================== */
  const greetingTextEl = document.querySelector('.greeting-text');
  
  if (greetingTextEl) {
    const fullText = "Hey, I'm Abdelrahman";
    greetingTextEl.textContent = "";
    let charIndex = 0;

    // Fast, natural typewriter typing sequence for initial render
    setTimeout(() => {
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          greetingTextEl.textContent += fullText.charAt(charIndex);
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 35);
    }, 250);
  }

  /* ==========================================================================
     2. FLUID EXPANDING / FOLDING HEADER NAV MECHANICS
     ========================================================================== */
  const navPill = document.getElementById('main-nav');
  const navToggleBtn = document.getElementById('nav-toggle');

  let lastScrollY = window.scrollY;
  let mobileUserExpanded = false;

  // Manual Toggle on 3-Dots Click
  if (navToggleBtn && navPill) {
    navToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (window.innerWidth <= 768) {
        mobileUserExpanded = !mobileUserExpanded;
        if (mobileUserExpanded) {
          navPill.classList.remove('is-collapsed');
          navPill.classList.add('is-expanded');
        } else {
          navPill.classList.remove('is-expanded');
          navPill.classList.add('is-collapsed');
        }
      } else {
        if (navPill.classList.contains('is-collapsed')) {
          navPill.classList.remove('is-collapsed');
          navPill.classList.add('is-expanded');
        } else {
          navPill.classList.toggle('is-expanded');
        }
      }
    });
  }

  // Close nav on mobile link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 768 && navPill) {
        mobileUserExpanded = false;
        navPill.classList.remove('is-expanded');
        navPill.classList.add('is-collapsed');
      }
    });
  });

  // Smooth scroll direction tracking for Expanding / Collapsing Navbar
  function handleNavScroll() {
    const currentScrollY = window.scrollY;
    const isMobile = window.innerWidth <= 768;
    const scrollDelta = currentScrollY - lastScrollY;

    if (isMobile) {
      // On mobile: collapse menu automatically when user scrolls up (or scrolls significantly)
      if (Math.abs(scrollDelta) > 10) {
        if (mobileUserExpanded) {
          mobileUserExpanded = false;
        }
        navPill.classList.add('is-collapsed');
        navPill.classList.remove('is-expanded');
      }
      lastScrollY = currentScrollY;
      return;
    }

    if (currentScrollY < 60) {
      // Near top of page: keep expanded on desktop
      navPill.classList.add('is-expanded');
      navPill.classList.remove('is-collapsed');
    } else if (currentScrollY < lastScrollY - 6) {
      // Scrolling UP: Expand header smoothly
      navPill.classList.add('is-expanded');
      navPill.classList.remove('is-collapsed');
    } else if (currentScrollY > lastScrollY + 12) {
      // Scrolling DOWN: Fold/Collapse header smoothly
      navPill.classList.remove('is-expanded');
      navPill.classList.add('is-collapsed');
    }

    lastScrollY = currentScrollY;
  }

  /* ==========================================================================
     3. GRADUAL SCROLL WORD COLOR-FILL ANIMATION ("WHAT I DO")
     Matched to reference site: 50% lit at mid-screen, 100% lit as you pass section
     ========================================================================== */
  const statement = document.getElementById('what-i-do-statement');
  const revealWords = statement ? statement.querySelectorAll('.reveal-word') : [];

  function updateTextScrollHighlight() {
    if (!statement || revealWords.length === 0) return;

    const rect = statement.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Start coloring when statement top reaches 75% of viewport height
    // Finish coloring 100% ONLY when statement reaches 15% top of viewport (as user passes section)
    const startY = viewportHeight * 0.75;
    const endY = viewportHeight * 0.15;

    let progress = (startY - rect.top) / (startY - endY);
    progress = Math.min(Math.max(progress, 0), 1);

    const totalWords = revealWords.length;
    revealWords.forEach((word, index) => {
      const wordThreshold = index / (totalWords - 0.5);
      if (progress >= wordThreshold) {
        word.classList.add('is-lit');
      } else {
        word.classList.remove('is-lit');
      }
    });
  }

  /* ==========================================================================
     3B. COUNT-UP ANIMATION FOR STATS (5+ and 30+)
     ========================================================================== */
  const statNumbers = document.querySelectorAll('.stat-number-spec');
  if (statNumbers.length > 0) {
    let statsAnimated = false;
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !statsAnimated) {
          statsAnimated = true;
          statNumbers.forEach(statEl => {
            const target = parseInt(statEl.getAttribute('data-count'), 10) || 0;
            const suffix = statEl.getAttribute('data-suffix') || '+';
            let current = 0;
            const duration = 1400;
            const stepTime = Math.max(15, Math.floor(duration / Math.max(target, 1)));

            const timer = setInterval(() => {
              current += 1;
              if (current >= target) {
                statEl.textContent = target + suffix;
                clearInterval(timer);
              } else {
                statEl.textContent = current + suffix;
              }
            }, stepTime);
          });
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const statsGrid = document.querySelector('.stats-grid-spec');
    if (statsGrid) {
      statsObserver.observe(statsGrid);
    }
  }

  /* ==========================================================================
     4. CLEAN FULL-WIDTH CARD DYNAMIC SHRINK ENGINE
     - Active Card starts at scale(1.0) full width
     - As subsequent cards scroll over, covered cards shrink on scroll (scale = 0.94 -> 0.88)
     ========================================================================== */
  const cardWrappers = Array.from(document.querySelectorAll('.stacking-card-wrapper'));

  function updateStackingCards() {
    if (cardWrappers.length === 0) return;

    const viewportHeight = window.innerHeight;

    cardWrappers.forEach((wrapper, index) => {
      const card = wrapper.querySelector('.stacking-card');
      if (!card) return;

      const nextWrapper = cardWrappers[index + 1];
      if (!nextWrapper) {
        card.style.transform = 'scale(1)';
        return;
      }

      const nextRect = nextWrapper.getBoundingClientRect();
      const stickyTop = 0;
      const distance = stickyTop - nextRect.top;

      if (distance > 0) {
        const progress = Math.min(Math.max(distance / (viewportHeight * 0.8), 0), 1);
        const scale = 1 - progress * 0.08;
        const borderRadius = progress * 32;

        card.style.transform = `scale(${scale.toFixed(4)})`;
        card.style.borderRadius = `${borderRadius.toFixed(1)}px`;
      } else {
        card.style.transform = 'scale(1)';
        card.style.borderRadius = '';
      }
    });
  }

  /* ==========================================================================
     5. UNIFIED HIGH-PERFORMANCE SCROLL LOOP & ACTIVE NAV HIGHLIGHT
     ========================================================================== */
  const navLinks = Array.from(document.querySelectorAll('.nav-link'));
  const navSectionMap = [
    { ids: ['work', 'cards-container'], href: '#work' },
    { ids: ['about', 'journey'], href: '#about' },
    { ids: ['contact'], href: '#contact' }
  ];

  function updateActiveNav() {
    if (navLinks.length === 0) return;

    // Check if scrolled near bottom of page
    const isAtBottom = (window.innerHeight + window.scrollY) >= (document.documentElement.scrollHeight - 120);
    
    let activeHref = '';

    if (isAtBottom) {
      activeHref = '#contact';
    } else {
      const viewportCenter = window.innerHeight * 0.4;
      
      for (const group of navSectionMap) {
        for (const id of group.ids) {
          const el = document.getElementById(id);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= viewportCenter && rect.bottom >= 100) {
              activeHref = group.href;
              break;
            }
          }
        }
        if (activeHref) break;
      }
    }

    navLinks.forEach(link => {
      if (activeHref && link.getAttribute('href') === activeHref) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });
  }

  let ticking = false;

  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        handleNavScroll();
        updateTextScrollHighlight();
        updateStackingCards();
        updateActiveNav();
        ticking = false;
      });
      ticking = true;
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });

  // Initial trigger
  handleNavScroll();
  updateTextScrollHighlight();
  updateStackingCards();
  updateActiveNav();

  /* ==========================================================================
     6. SCROLL-TRIGGERED CHARACTER BLUR-REVEAL FOR "Some Of My Work" & SUBTITLE
     ========================================================================== */
  const workHeaderSec = document.getElementById('work');
  const workChars = document.querySelectorAll('.work-char');
  const workDescWrap = document.getElementById('work-desc-wrap');

  if (workHeaderSec && workChars.length > 0) {
    let workRevealed = false;

    const triggerWorkReveal = () => {
      if (workRevealed) return;
      workRevealed = true;

      workChars.forEach((char, index) => {
        setTimeout(() => {
          char.classList.add('is-visible');
        }, index * 35);
      });

      setTimeout(() => {
        if (workDescWrap) {
          workDescWrap.classList.add('is-visible');
        }
      }, workChars.length * 35 + 80);
    };

    const workObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          triggerWorkReveal();
          workObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    workObserver.observe(workHeaderSec);

    // Immediate check if already visible on load
    const rect = workHeaderSec.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      triggerWorkReveal();
    }
  }

  /* ==========================================================================
     7. SCROLL-TRIGGERED FRAMER CHARACTER BLUR-REVEAL FOR "a little about myself" & BIO
     ========================================================================== */
  const aboutSection = document.getElementById('about');
  const aboutChars = document.querySelectorAll('.about-char');
  const aboutBioWrap = document.getElementById('about-bio-wrap');

  if (aboutSection && aboutChars.length > 0) {
    let revealed = false;

    const aboutObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !revealed) {
          revealed = true;

          // Staggered character-by-character blur-to-sharp reveal (inline-block animation)
          aboutChars.forEach((char, index) => {
            setTimeout(() => {
              char.classList.add('is-visible');
            }, index * 35);
          });

          // Bio text & signature fade in after title characters finish
          setTimeout(() => {
            if (aboutBioWrap) {
              aboutBioWrap.classList.add('is-visible');
            }
          }, aboutChars.length * 35 + 100);

          aboutObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });

    aboutObserver.observe(aboutSection);
  }

  /* ==========================================================================
     8. GENTLE SCROLL REVEAL ANIMATIONS (INTERSECTION OBSERVER)
     ========================================================================== */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -80px 0px',
      threshold: 0.15
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('is-visible'));
  }

  /* ==========================================================================
     9. EDITABLE STAT COUNTERS
     ========================================================================== */
  const editableStatNumbers = document.querySelectorAll('.stat-number-spec');
  editableStatNumbers.forEach(stat => {
    stat.addEventListener('blur', () => {
      if (stat.textContent.trim() === '') {
        stat.textContent = '0+';
      }
    });
    stat.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        stat.blur();
      }
    });
  });

  /* ==========================================================================
     10. DYNAMIC ROTATING WORD FOR FOOTER ("design" -> "create" -> "build" -> "ship")
     ========================================================================== */
  const dynamicFooterWord = document.getElementById('dynamic-footer-word');
  if (dynamicFooterWord) {
    const words = ["design", "create", "build", "ship"];
    let wordIdx = 0;

    setInterval(() => {
      // Blur & fade out with upward movement
      dynamicFooterWord.classList.add('word-anim-out');

      setTimeout(() => {
        // Change text to next word
        wordIdx = (wordIdx + 1) % words.length;
        dynamicFooterWord.textContent = words[wordIdx];

        // Prepare for enter from below
        dynamicFooterWord.classList.remove('word-anim-out');
        dynamicFooterWord.classList.add('word-anim-in');

        // Smoothly animate in
        requestAnimationFrame(() => {
          setTimeout(() => {
            dynamicFooterWord.classList.remove('word-anim-in');
          }, 40);
        });
      }, 400);
    }, 2400);
  }

  /* ==========================================================================
     11. AUTOPLAY SKY FOOTER VIDEO
     ========================================================================== */
  const skyVideo = document.querySelector('.sky-card-frame video');
  if (skyVideo) {
    skyVideo.play().catch(() => {
      // Autoplay fallback handler
    });
  }

  /* ==========================================================================
     12. MY TECH JOURNEY — HORIZONTAL SCROLL-DRIVEN TIMELINE MECHANICS
     ========================================================================== */
  const journeySection = document.getElementById('journey');
  const journeyTrackWindow = document.querySelector('.journey-track-window');
  const journeyTrack = document.getElementById('journey-track');
  const journeyNodes = document.querySelectorAll('.journey-node');
  const journeyChars = document.querySelectorAll('.journey-char');
  const journeySubtitleWrap = document.getElementById('journey-subtitle-wrap');

  if (journeySection && journeyChars.length > 0) {
    let journeyTitleRevealed = false;
    const journeyTitleObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !journeyTitleRevealed) {
          journeyTitleRevealed = true;
          journeyChars.forEach((char, index) => {
            setTimeout(() => {
              char.classList.add('is-visible');
            }, index * 35);
          });

          setTimeout(() => {
            if (journeySubtitleWrap) {
              journeySubtitleWrap.classList.add('is-visible');
            }
          }, journeyChars.length * 35 + 80);

          journeyTitleObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });

    journeyTitleObserver.observe(journeySection);
  }

  if (journeySection && journeyTrack) {
    const updateJourneyScroll = () => {
      const rect = journeySection.getBoundingClientRect();
      const sectionHeight = journeySection.offsetHeight;
      const windowHeight = window.innerHeight;

      const scrollableDistance = sectionHeight - windowHeight;
      if (scrollableDistance <= 0) return;

      const currentScroll = -rect.top;
      const progress = Math.max(0, Math.min(1, currentScroll / scrollableDistance));

      const windowWidth = journeyTrackWindow ? journeyTrackWindow.clientWidth : window.innerWidth;
      const maxTranslate = Math.max(0, journeyTrack.scrollWidth - windowWidth);

      const translateX = -progress * maxTranslate;
      journeyTrack.style.transform = `translate3d(${translateX}px, 0, 0)`;

      let closestIdx = 0;
      let minDistance = Infinity;
      const windowCenter = window.innerWidth / 2;

      journeyNodes.forEach((node, idx) => {
        const nodeRect = node.getBoundingClientRect();
        const nodeCenter = nodeRect.left + nodeRect.width / 2;
        const dist = Math.abs(nodeCenter - windowCenter);
        if (dist < minDistance) {
          minDistance = dist;
          closestIdx = idx;
        }
      });

      journeyNodes.forEach((node, idx) => {
        if (idx === closestIdx) {
          node.classList.add('is-focused');
        } else {
          node.classList.remove('is-focused');
        }
      });
    };

    window.addEventListener('scroll', () => {
      requestAnimationFrame(updateJourneyScroll);
    });

    window.addEventListener('resize', updateJourneyScroll);
    updateJourneyScroll();
  }

});
