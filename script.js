(function() {
  const canvas = document.getElementById('matrix-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
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
  window.addEventListener('resize', resize);
  draw();
})();

(function() {
  const overlay = document.querySelector(".glitch-overlay");
  if (!overlay) return;

  function triggerFlash() {
    const flashDuration = 70 + Math.random() * 160;
    overlay.classList.add("flash");
    overlay.style.transform = `translateX(${(Math.random() - 0.5) * 8}px)`;
    setTimeout(() => {
      overlay.classList.remove("flash");
      overlay.style.transform = "translateX(0)";
    }, flashDuration);

    const next = 1600 + Math.random() * 5000;
    setTimeout(triggerFlash, next);
  }

  setTimeout(triggerFlash, 1000 + Math.random() * 1200);
})();

(function() {
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    card.addEventListener('mousemove', function(e) {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mouse-x', x + '%');
      card.style.setProperty('--mouse-y', y + '%');
      const glow = Math.max(160, Math.min(280, Math.min(rect.width, rect.height) * 0.95));
      card.style.setProperty('--glow-size', glow + 'px');
    });
  });
})();

(function() {
  const terminalBody = document.getElementById("terminal-typing");
  if (!terminalBody) return;

  const lines = [
    { type: "prompt", text: "who am i", spaced: false },
    { type: "output", text: "汤俊飞", className: "terminal-out-accent", spaced: false },
    { type: "output", text: "// 中级 / 高级 .NET 开发工程师（C#方向）", className: "terminal-out-muted", spaced: true },
    { type: "prompt", text: "cat ./skills.txt", spaced: false },
    { type: "output", text: "C# · .NET Framework/.NET Core/.NET 5+ · Web API", className: "terminal-out-dim", spaced: false },
    { type: "output", text: "SQL Server/MySQL · Redis · RabbitMQ", className: "terminal-out-dim", spaced: false },
    { type: "output", text: "WinForm (AntdUI/HZHcontrol) · RESTful API · Swagger", className: "terminal-out-dim", spaced: false }
  ];
  const typeMin = 30;
  const typeMax = 70;
  const lineGapMin = 120;
  const lineGapMax = 260;
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
  }

  function tick() {
    if (lineIndex >= lines.length) {
      appendIdlePrompt();
      terminalBody.scrollTop = terminalBody.scrollHeight;
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
      lineIndex += 1;
      activeTarget = null;
      setTimeout(tick, random(lineGapMin, lineGapMax));
      return;
    }

    setTimeout(tick, random(typeMin, typeMax));
  }

  terminalBody.innerHTML = "";
  tick();
})();
