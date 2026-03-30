(function() {
  // Register GSAP plugins
  gsap.registerPlugin(ScrollTrigger);

  // ===== Match Media =====
  let reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let isMobile = window.matchMedia("(max-width: 768px)").matches;

  // ===== Reduced Motion: skip all animations =====
  if (reducedMotion) {
    document.getElementById("loader").style.display = "none";
    return;
  }

  // ========================================
  // 1. CUSTOM CURSOR
  // ========================================
  (function initCursor() {
    const outer = document.getElementById("cursor-outer");
    const inner = document.getElementById("cursor-inner");
    if (!outer || !inner || isMobile) return;

    let mouseX = 0, mouseY = 0;
    let outerX = 0, outerY = 0;
    let innerX = 0, innerY = 0;

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      document.body.classList.add("cursor-active");
    });

    document.addEventListener("mouseleave", () => {
      document.body.classList.remove("cursor-active");
    });

    // Smooth cursor follow
    function updateCursor() {
      // Inner follows immediately
      innerX += (mouseX - innerX) * 0.9;
      innerY += (mouseY - innerY) * 0.9;
      inner.style.left = innerX + "px";
      inner.style.top = innerY + "px";

      // Outer lags behind
      outerX += (mouseX - outerX) * 0.15;
      outerY += (mouseY - outerY) * 0.15;
      outer.style.left = outerX + "px";
      outer.style.top = outerY + "px";

      requestAnimationFrame(updateCursor);
    }
    updateCursor();

    // Cursor hover states
    const interactiveEls = document.querySelectorAll("a, button, .card, .hero-tags span");
    interactiveEls.forEach(el => {
      el.addEventListener("mouseenter", () => {
        gsap.to(outer, { scale: 1.5, borderColor: "rgba(0, 255, 65, 0.9)", duration: 0.2 });
        gsap.to(inner, { scale: 2, duration: 0.2 });
      });
      el.addEventListener("mouseleave", () => {
        gsap.to(outer, { scale: 1, borderColor: "rgba(0, 255, 65, 0.6)", duration: 0.2 });
        gsap.to(inner, { scale: 1, duration: 0.2 });
      });
    });
  })();

  // ========================================
  // 2. PARTICLE TRAIL
  // ========================================
  (function initParticles() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas || isMobile) return;

    const ctx = canvas.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = window.innerWidth;
    let H = window.innerHeight;
    let particles = [];
    let mouseX = 0, mouseY = 0;

    canvas.width = W * dpr;
    canvas.height = H * dpr;
    ctx.scale(dpr, dpr);

    function resize() {
      W = window.innerWidth;
      H = window.innerHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      ctx.scale(dpr, dpr);
    }

    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;
        this.speedX = (Math.random() - 0.5) * 1.5;
        this.speedY = (Math.random() - 0.5) * 1.5;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.015;
        this.color = Math.random() > 0.3
          ? `rgba(0, 255, 65, ${this.life * 0.8})`
          : `rgba(0, 200, 255, ${this.life * 0.6})`;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.life -= this.decay;
        this.size *= 0.97;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        const alpha = Math.max(0, this.life * 0.8);
        ctx.fillStyle = Math.random() > 0.3
          ? `rgba(0, 255, 65, ${alpha})`
          : `rgba(0, 200, 255, ${alpha})`;
        ctx.fill();
        // Glow
        ctx.shadowBlur = 8;
        ctx.shadowColor = Math.random() > 0.3
          ? "rgba(0, 255, 65, 0.5)"
          : "rgba(0, 200, 255, 0.5)";
      }
    }

    let lastEmit = 0;
    function emitParticles(x, y, count) {
      for (let i = 0; i < count; i++) {
        particles.push(new Particle(x, y));
      }
    }

    function animate(now) {
      ctx.clearRect(0, 0, W, H);
      const elapsed = now - lastEmit;
      if (elapsed > 20) {
        emitParticles(mouseX, mouseY, 2);
        lastEmit = now;
      }
      particles = particles.filter(p => p.life > 0);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      ctx.shadowBlur = 0;
      requestAnimationFrame(animate);
    }

    document.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    window.addEventListener("resize", resize);
    requestAnimationFrame(animate);
  })();

  // ========================================
  // 3. LOADER
  // ========================================
  function runLoader() {
    const loaderEl = document.getElementById("loader");
    const loaderProgress = document.getElementById("loader-progress");

    const tl = gsap.timeline({
      onComplete: function() {
        gsap.to(loaderEl, {
          opacity: 0,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: function() {
            loaderEl.style.display = "none";
            runPageEntrance();
          }
        });
      }
    });

    tl.to(loaderProgress, {
      width: "100%",
      duration: 1.5,
      ease: "power2.inOut"
    })
    .from(".loader-text", {
      opacity: 0,
      x: -15,
      duration: 0.4,
      ease: "power2.out"
    }, 0)
    .from(".loader-bar", {
      scaleX: 0,
      duration: 0.3,
      ease: "power2.out"
    }, 0);
  }

  // ========================================
  // 4. PAGE ENTRANCE + SPLITTEXT
  // ========================================
  function runPageEntrance() {
    const tl = gsap.timeline();

    // Terminal
    tl.from(".terminal-bar", {
      opacity: 0, y: -30, duration: 0.6, ease: "power3.out"
    })
    .from(".terminal-body", {
      opacity: 0, y: 30, duration: 0.6, ease: "power3.out"
    }, "-=0.35")
    .from(".ascii-decoration", {
      opacity: 0, scale: 0.92, duration: 0.7, ease: "back.out(1.5)"
    }, "-=0.3");

    // SplitText hero name (manual char split — SplitText is a Club GSAP plugin)
    const heroName = document.getElementById("hero-name-split");
    if (heroName) {
      const text = heroName.textContent;
      heroName.innerHTML = "";
      heroName.style.display = "inline-block";
      heroName.style.transformStyle = "preserve-3d";

      const chars = [];
      for (let i = 0; i < text.length; i++) {
        const span = document.createElement("span");
        span.className = "hero-char";
        span.textContent = text[i];
        span.style.display = "inline-block";
        span.style.opacity = "0";
        chars.push(span);
        heroName.appendChild(span);
      }

      gsap.set(chars, { opacity: 0, y: 60, rotationX: -90, scale: 0.3 });

      tl.to(chars, {
        opacity: 1,
        y: 0,
        rotationX: 0,
        scale: 1,
        stagger: 0.07,
        duration: 0.8,
        ease: "power3.out"
      }, "-=0.3")
      .to(heroName, {
        textShadow: "0 0 30px rgba(0,255,65,0.7), 0 0 60px rgba(0,255,65,0.3)",
        duration: 0.5,
        ease: "power2.out"
      }, "-=0.2");
    } else {
      tl.from(".hero-name", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, "-=0.3");
    }

    // Hero subtitle
    tl.from(".hero-title", {
      opacity: 0,
      x: -25,
      duration: 0.6,
      ease: "power2.out"
    }, "-=0.4");

    // Hero tags with scramble
    const tags = document.querySelectorAll(".hero-tags span");
    tl.from(tags, {
      opacity: 0,
      scale: 0.5,
      stagger: 0.1,
      duration: 0.5,
      ease: "back.out(2.5)"
    }, "-=0.3");

    // Contact links with stagger
    tl.from(".hero-contact a", {
      opacity: 0,
      x: -20,
      stagger: 0.08,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.2");

    // Start terminal typing
    runTerminalTyping();
  }

  // ========================================
  // 5. TERMINAL TYPING (GSAP Timeline)
  // ========================================
  function runTerminalTyping() {
    const terminalBody = document.getElementById("terminal-typing");
    if (!terminalBody) return;

    const lines = [
      { type: "prompt", text: "who am i" },
      { type: "output", text: "汤俊飞", className: "terminal-out-accent" },
      { type: "output", text: "// 中级 / 高级 .NET 开发工程师（C#方向）", className: "terminal-out-muted", spaced: true },
      { type: "prompt", text: "cat ./skills.txt" },
      { type: "output", text: "C# · .NET Framework/.NET Core/.NET 5+ · Web API", className: "terminal-out-dim" },
      { type: "output", text: "SQL Server/MySQL · Redis · RabbitMQ", className: "terminal-out-dim" },
      { type: "output", text: "WinForm (AntdUI/HZHcontrol) · RESTful API · Swagger", className: "terminal-out-dim" }
    ];

    terminalBody.innerHTML = "";
    let lineIndex = 0;
    let charIndex = 0;
    let activeTarget = null;

    function random(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function createLine(line) {
      const wrapper = document.createElement("div");
      wrapper.className = line.spaced ? "terminal-line terminal-line--spaced" : "terminal-line";
      if (line.type === "prompt") {
        const prompt = document.createElement("span");
        prompt.className = "prompt";
        prompt.textContent = "$";
        const cmd = document.createElement("span");
        cmd.className = "cmd";
        wrapper.appendChild(prompt);
        wrapper.appendChild(cmd);
        terminalBody.appendChild(wrapper);
        return cmd;
      }
      wrapper.classList.add(line.className || "");
      terminalBody.appendChild(wrapper);
      return wrapper;
    }

    function appendIdlePrompt() {
      const line = document.createElement("div");
      line.className = "terminal-line";
      const prompt = document.createElement("span");
      prompt.className = "prompt";
      prompt.textContent = "$";
      const cursor = document.createElement("span");
      cursor.className = "cursor";
      line.appendChild(prompt);
      line.appendChild(cursor);
      terminalBody.appendChild(line);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      gsap.to(cursor, { opacity: 0, duration: 0, ease: "none", repeat: -1, yoyo: true, delay: 0.5 });
    }

    function tick() {
      if (lineIndex >= lines.length) {
        appendIdlePrompt();
        return;
      }
      const line = lines[lineIndex];
      if (!activeTarget) {
        activeTarget = createLine(line);
        charIndex = 0;
      }
      charIndex += 1;
      activeTarget.textContent = line.text.slice(0, charIndex);
      terminalBody.scrollTop = terminalBody.scrollHeight;
      if (charIndex >= line.text.length) {
        lineIndex++;
        activeTarget = null;
        setTimeout(tick, random(120, 260));
      } else {
        setTimeout(tick, random(30, 70));
      }
    }

    setTimeout(tick, 600);
  }

  // ========================================
  // 6. SCROLL ANIMATIONS (ScrollTrigger)
  // ========================================
  function runScrollAnimations() {
    // --- Sections ---
    gsap.utils.toArray(".section").forEach((section) => {
      gsap.from(section, {
        opacity: 0,
        y: 60,
        duration: 0.9,
        ease: "power3.out",
        scrollTrigger: {
          trigger: section,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      });
    });

    // --- Cards with 3D flip-in ---
    gsap.utils.toArray(".section .card").forEach((card) => {
      gsap.from(card, {
        opacity: 0,
        y: 50,
        rotationY: -8,
        transformPerspective: 1000,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: card,
          start: "top 88%",
          toggleActions: "play none none none"
        }
      });
    });

    // --- Timeline items ---
    gsap.utils.toArray(".timeline-item").forEach((item) => {
      gsap.from(item, {
        opacity: 0,
        x: -50,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: item,
          start: "top 85%"
        }
      });
    });

    // --- Timeline dot pulse ---
    gsap.utils.toArray(".timeline-dot").forEach((dot) => {
      gsap.from(dot, {
        scale: 0,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(3)",
        scrollTrigger: {
          trigger: dot,
          start: "top 90%"
        }
      });
    });

    // --- List items ---
    gsap.utils.toArray(".list li").forEach((li) => {
      gsap.from(li, {
        opacity: 0,
        x: -12,
        duration: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: li,
          start: "top 92%"
        }
      });
    });

    // --- Section titles slide-in ---
    gsap.utils.toArray(".section-title").forEach((title) => {
      gsap.from(title, {
        opacity: 0,
        x: -30,
        duration: 0.6,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 88%"
        }
      });
    });

    // --- Footer ---
    gsap.from(".footer", {
      opacity: 0,
      y: 30,
      duration: 0.7,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".footer",
        start: "top 95%"
      }
    });

    // --- Hero parallax on scroll ---
    const heroSection = document.querySelector(".hero");
    if (heroSection) {
      gsap.to(".hero", {
        y: -80,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1
        }
      });
    }

    // --- ASCII art parallax ---
    gsap.to(".ascii-decoration", {
      y: -40,
      ease: "none",
      scrollTrigger: {
        trigger: ".hero",
        start: "top top",
        end: "bottom top",
        scrub: 1.5
      }
    });
  }

  // ========================================
  // 7. ADVANCED GLITCH (GSAP Timeline)
  // ========================================
  function initGlitchOverlay() {
    const overlay = document.getElementById("glitch-overlay");
    if (!overlay) return;

    function triggerGlitch() {
      const tl = gsap.timeline();

      // Phase 1: quick flicker
      tl.to(overlay, { opacity: 0.22, duration: 0.02 })
        .set(overlay, { x: (Math.random() - 0.5) * 12 })
        .to(overlay, {
          background: `repeating-linear-gradient(90deg, rgba(0,255,65,0.2) 0 3px, transparent 3px 10px), linear-gradient(0deg, rgba(0,255,65,0.15), rgba(255,0,64,0.05))`,
          mixBlendMode: "screen",
          duration: 0.02
        })
        .to(overlay, { x: (Math.random() - 0.5) * 6, duration: 0.02 })
        .to(overlay, { opacity: 0.08, duration: 0.02 })
        .to(overlay, {
          background: `repeating-linear-gradient(0deg, rgba(0,255,65,0.1) 0 2px, transparent 2px 6px)`,
          x: (Math.random() - 0.5) * 4,
          duration: 0.02
        })
        .to(overlay, {
          opacity: 0,
          x: 0,
          background: "transparent",
          mixBlendMode: "normal",
          duration: 0.04
        });

      // Random interval
      const next = 1200 + Math.random() * 4000;
      setTimeout(triggerGlitch, next);
    }

    setTimeout(triggerGlitch, 2000 + Math.random() * 1500);
  }

  // ========================================
  // 8. HERO NAME GLITCH on scroll
  // ========================================
  function initHeroNameGlitch() {
    const heroName = document.getElementById("hero-name-split");
    if (!heroName) return;

    ScrollTrigger.create({
      trigger: heroName,
      start: "top 75%",
      onEnter: () => runNameGlitch(heroName)
    });
  }

  function runNameGlitch(el) {
    const tl = gsap.timeline();

    // Rapid skew + color shift
    tl.to(el, { skewX: 8, duration: 0.04, ease: "none" })
      .to(el, { skewX: -6, duration: 0.04, ease: "none" })
      .to(el, { skewX: 4, duration: 0.04, ease: "none" })
      .to(el, {
        textShadow: "3px 0 #ff0040, -3px 0 #00ffff, 0 0 40px rgba(0,255,65,0.9)",
        duration: 0.06,
        ease: "none"
      })
      .to(el, {
        textShadow: "-2px 0 #ff0040, 2px 0 #00ffff",
        duration: 0.04
      })
      .to(el, {
        textShadow: "0 0 20px rgba(0,255,65,0.5), 0 0 40px rgba(0,255,65,0.2)",
        duration: 0.2,
        ease: "power2.out"
      });
  }

  // ========================================
  // 9. CARD 3D TILT (GSAP)
  // ========================================
  function initCardTilt() {
    const cards = document.querySelectorAll(".card");
    if (isMobile) return;

    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const tiltX = dy / rect.height * -12;
        const tiltY = dx / rect.width * 12;

        gsap.to(card, {
          rotationY: tiltY,
          rotationX: tiltX,
          transformPerspective: 1000,
          boxShadow: `${tiltY * 0.5}px ${tiltX * 0.5}px 30px rgba(0, 255, 65, 0.15)`,
          borderColor: "rgba(0, 255, 65, 0.7)",
          duration: 0.3,
          ease: "power2.out"
        });
      });

      card.addEventListener("mouseleave", () => {
        gsap.to(card, {
          rotationY: 0,
          rotationX: 0,
          boxShadow: "0 0 0 transparent",
          borderColor: "var(--border)",
          duration: 0.5,
          ease: "power2.out"
        });
      });
    });
  }

  // ========================================
  // 10. SCRAMBLE TEXT on reveal (manual)
  // ========================================
  function initScrambleReveal() {
    const heroTitle = document.querySelector(".hero-title");
    if (!heroTitle) return;

    const finalText = heroTitle.textContent;
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789<>///*&^%$#@!";
    let iteration = 0;
    const totalIterations = 20;
    let interval = null;

    ScrollTrigger.create({
      trigger: heroTitle,
      start: "top 80%",
      onEnter: () => {
        if (interval) return;
        heroTitle.textContent = finalText;

        interval = setInterval(() => {
          heroTitle.textContent = finalText.split("").map((char, idx) => {
            if (idx < Math.floor(iteration)) return finalText[idx];
            if (char === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          }).join("");

          iteration += 0.5;
          if (iteration >= finalText.length) {
            clearInterval(interval);
            interval = null;
            heroTitle.textContent = finalText;
          }
        }, 40);
      }
    });
  }

  // ========================================
  // 11. FLOATING DECOR PARALLAX
  // ========================================
  function initFloatingDecor() {
    if (isMobile) return;

    gsap.utils.toArray(".floating-decor").forEach((el, i) => {
      gsap.to(el, {
        y: -60 - i * 20,
        rotation: 90 + i * 30,
        ease: "none",
        scrollTrigger: {
          trigger: "body",
          start: "top top",
          end: "bottom top",
          scrub: 2 + i * 0.5
        }
      });
    });

    // Continuous float animation
    gsap.utils.toArray(".floating-decor").forEach((el, i) => {
      gsap.to(el, {
        y: "random(-20, 20)",
        rotation: "random(-30, 30)",
        duration: 3 + i,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });
  }

  // ========================================
  // 12. GRID PARALLAX
  // ========================================
  function initGridParallax() {
    const grid = document.getElementById("grid-layer");
    if (!grid || isMobile) return;

    gsap.to(grid, {
      y: 100,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom top",
        scrub: 3
      }
    });
  }

  // ========================================
  // 13. HERO CONTINUOUS GLOW
  // ========================================
  function initHeroGlow() {
    const heroName = document.getElementById("hero-name-split");
    if (!heroName) return;

    gsap.to(heroName, {
      textShadow: "0 0 35px rgba(0,255,65,0.7), 0 0 70px rgba(0,255,65,0.3), 0 0 100px rgba(0,255,65,0.1)",
      duration: 2,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1
    });
  }

  // ========================================
  // 14. TAGS FLOAT
  // ========================================
  function initTagsAnimation() {
    gsap.utils.toArray(".hero-tags span").forEach((tag, i) => {
      gsap.to(tag, {
        y: -6,
        duration: 1.5 + i * 0.4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
      });
    });
  }

  // ========================================
  // 15. COUNTER ANIMATION (for any numbers)
  // ========================================
  function initCounters() {
    // No numeric stats currently visible, but this is ready
  }

  // ========================================
  // 16. SECTION TITLE LINE DRAW
  // ========================================
  function initSectionTitleLines() {
    gsap.utils.toArray(".section-title").forEach((title) => {
      const afterEl = title.querySelector(".title-line") || (() => {
        const line = document.createElement("span");
        line.className = "title-line";
        line.style.cssText = `
          display: block; height: 1px; background: linear-gradient(to right, var(--accent), transparent);
          margin-top: 8px; transform: scaleX(0); transform-origin: left;
        `;
        title.appendChild(line);
        return line;
      })();

      gsap.from(afterEl, {
        scaleX: 0,
        duration: 0.8,
        ease: "power2.out",
        scrollTrigger: {
          trigger: title,
          start: "top 88%"
        }
      });
    });
  }

  // ========================================
  // 17. CARD BORDER PROGRESS
  // ========================================
  function initCardBorderGlow() {
    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => {
      const glowBar = document.createElement("div");
      glowBar.className = "card-border-glow";
      glowBar.style.cssText = `
        position: absolute; bottom: 0; left: 0; height: 2px; width: 0;
        background: linear-gradient(to right, var(--accent), transparent);
        opacity: 0; transition: opacity 0.3s;
      `;
      card.style.position = "relative";
      card.appendChild(glowBar);

      card.addEventListener("mouseenter", () => {
        gsap.to(glowBar, { width: "100%", opacity: 1, duration: 0.6, ease: "power2.out" });
      });
      card.addEventListener("mouseleave", () => {
        gsap.to(glowBar, { width: 0, opacity: 0, duration: 0.4, ease: "power2.in" });
      });
    });
  }

  // ========================================
  // 18. CURSOR TRAIL LINK HOVER
  // ========================================
  function initLinkHoverTrail() {
    document.querySelectorAll("a").forEach(link => {
      link.addEventListener("mouseenter", () => {
        gsap.to("#cursor-inner", {
          backgroundColor: "#00ffff",
          boxShadow: "0 0 12px #00ffff",
          duration: 0.2
        });
      });
      link.addEventListener("mouseleave", () => {
        gsap.to("#cursor-inner", {
          backgroundColor: "var(--accent)",
          boxShadow: "0 0 0 transparent",
          duration: 0.2
        });
      });
    });
  }

  // ========================================
  // 19. MATRIX RAIN (enhanced)
  // ========================================
  (function initMatrix() {
    const canvas = document.getElementById("matrix-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const fontSize = 16;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const frameInterval = 1000 / 30;
    let columns = 0;
    let drops = [];
    let speeds = [];
    let lastFrameTime = 0;

    function resize() {
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      columns = Math.ceil(window.innerWidth / fontSize);
      drops = new Array(columns);
      speeds = new Array(columns);
      for (let i = 0; i < columns; i++) {
        drops[i] = -Math.random() * window.innerHeight;
        speeds[i] = 0.8 + Math.random() * 1.9;
      }
    }

    function draw(now) {
      if (now - lastFrameTime < frameInterval) {
        requestAnimationFrame(draw);
        return;
      }
      lastFrameTime = now;

      ctx.fillStyle = "rgba(13, 17, 23, 0.12)";
      ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
      ctx.font = `${fontSize}px "JetBrains Mono", monospace`;
      ctx.textBaseline = "top";

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i];

        ctx.fillStyle = "rgba(180, 255, 188, 0.92)";
        ctx.fillText(char, x, y);
        ctx.fillStyle = "rgba(0, 255, 65, 0.52)";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize);
        ctx.fillStyle = "rgba(0, 255, 65, 0.26)";
        ctx.fillText(chars[Math.floor(Math.random() * chars.length)], x, y - fontSize * 2);

        drops[i] += speeds[i];
        if (drops[i] > window.innerHeight + fontSize * 3) {
          drops[i] = -Math.random() * 320;
          speeds[i] = 0.8 + Math.random() * 1.9;
        }
      }
      requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener("resize", resize);
    draw();
  })();

  // ========================================
  // INIT ALL
  // ========================================
  function init() {
    runLoader();
    runScrollAnimations();
    initGlitchOverlay();
    initHeroNameGlitch();
    initCardTilt();
    initScrambleReveal();
    initFloatingDecor();
    initGridParallax();
    initHeroGlow();
    initTagsAnimation();
    initSectionTitleLines();
    initCardBorderGlow();
    initLinkHoverTrail();
    initCounters();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
