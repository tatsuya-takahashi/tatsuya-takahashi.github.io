(function () {
  "use strict";

  const dataElement = document.getElementById("portfolio-data");
  const root = document.getElementById("portfolio-root");
  if (!dataElement || !root) return;

  const data = JSON.parse(dataElement.textContent || "{}");
  const locales = ["en", "ja"];
  let skillSimulation = null;
  let skillCloudResizeObserver = null;
  let skillCloudResizeFrame = null;
  let skillCloudResizeHandler = null;

  function savedLocale() {
    try {
      const value = window.localStorage.getItem("portfolio-language");
      return locales.includes(value) ? value : data.ui.defaultLocale;
    } catch (_error) {
      return data.ui.defaultLocale;
    }
  }

  let locale = savedLocale();

  function localized(value) {
    if (typeof value === "string") return value;
    if (!value) return "";
    return value[locale] || value.en || "";
  }

  function escapeHTML(value) {
    return String(value == null ? "" : value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function safeURL(value) {
    if (typeof value !== "string") return "";
    return /^(https?:\/\/|mailto:)/i.test(value) ? value : "";
  }

  function externalAttributes(url) {
    return url.indexOf("http") === 0
      ? ' target="_blank" rel="noopener noreferrer"'
      : "";
  }

  function socialMark(id) {
    const marks = {
      linkedin: '<span class="social-mark social-mark--box">in</span>',
      x: '<span class="social-mark social-mark--x">𝕏</span>',
      github:
        '<svg class="social-icon" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.76-1.31-3.76-1.31-.5-1.29-1.24-1.63-1.24-1.63-1.02-.7.08-.69.08-.69 1.13.08 1.72 1.16 1.72 1.16 1 1.72 2.61 1.22 3.24.93.1-.72.39-1.22.71-1.5-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.22 1.16-3-.12-.29-.5-1.42.11-2.96 0 0 .95-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.1-1.43 3.04-1.14 3.04-1.14.61 1.54.23 2.67.11 2.96.72.78 1.16 1.78 1.16 3 0 4.29-2.61 5.24-5.1 5.52.4.35.76 1.03.76 2.08v3.06c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z"/></svg>',
      kaggle: '<span class="social-mark social-mark--kaggle">K</span>',
      email:
        '<svg class="social-icon social-icon--stroke" viewBox="0 0 24 24" aria-hidden="true"><rect x="3.25" y="5.25" width="17.5" height="13.5" rx="1.4"/><path d="m4.2 6.6 7.8 6.1 7.8-6.1"/></svg>',
    };
    return marks[id] || "";
  }

  function renderSocialLink(link, compact) {
    const url = safeURL(link.url);
    if (!url) return "";

    const label = localized(link.label);
    const compactClass = compact ? " social-link--compact" : "";
    return (
      '<a class="social-link' +
      compactClass +
      '" href="' +
      escapeHTML(url) +
      '"' +
      externalAttributes(url) +
      ' aria-label="' +
      escapeHTML(label) +
      '">' +
      socialMark(link.id) +
      "<span>" +
      escapeHTML(label) +
      "</span></a>"
    );
  }

  function renderLanguageControl() {
    return (
      '<div class="language-control" role="group" aria-label="' +
      escapeHTML(localized(data.ui.languageLabel)) +
      '">' +
      '<button class="language-button' +
      (locale === "en" ? " is-current" : "") +
      '" type="button" data-locale="en" aria-pressed="' +
      (locale === "en") +
      '">EN</button>' +
      '<span class="language-divider" aria-hidden="true"></span>' +
      '<button class="language-button' +
      (locale === "ja" ? " is-current" : "") +
      '" type="button" data-locale="ja" aria-pressed="' +
      (locale === "ja") +
      '">JP</button></div>'
    );
  }

  function renderHero() {
    return (
      '<section class="hero" id="top" aria-labelledby="hero-title">' +
      '<div class="hero-copy">' +
      '<p class="eyebrow">' +
      escapeHTML(localized(data.profile.role)) +
      "</p>" +
      '<h1 id="hero-title">' +
      escapeHTML(data.profile.name) +
      "</h1>" +
      '<p class="hero-summary">' +
      escapeHTML(localized(data.profile.summary)) +
      "</p>" +
      '<nav class="social-links" aria-label="' +
      escapeHTML(localized(data.ui.socialLinksLabel)) +
      '">' +
      data.links.map(function (link) {
        return renderSocialLink(link, false);
      }).join("") +
      "</nav></div>" +
      '<div class="hero-portrait">' +
      '<span class="portrait-wash portrait-wash--one" aria-hidden="true"></span>' +
      '<span class="portrait-wash portrait-wash--two" aria-hidden="true"></span>' +
      '<img src="' +
      escapeHTML(data.profile.portrait) +
      '" alt="' +
      escapeHTML(localized(data.profile.portraitAlt)) +
      '" width="180" height="180">' +
      '<svg class="botanical" viewBox="0 0 120 180" aria-hidden="true">' +
      '<g fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round">' +
      '<path d="M12 166C45 137 71 103 98 25"/>' +
      '<path d="M38 143C22 136 16 124 17 111c13 4 22 13 21 26Z"/>' +
      '<path d="M51 126c17 0 29-7 35-19-14-1-26 5-35 19Z"/>' +
      '<path d="M62 103C46 96 40 85 42 73c13 5 21 15 20 30Z"/>' +
      '<path d="M73 83c15 0 25-6 31-17-13-1-23 5-31 17Z"/>' +
      '<path d="M84 57c-12-6-17-16-15-27 10 5 16 13 15 27Z"/>' +
      '<path d="M92 39c11-3 18-10 21-20-10 2-17 8-21 20Z"/>' +
      "</g></svg></div></section>"
    );
  }

  function renderWorks() {
    const items = data.works
      .map(function (work) {
        const title = localized(work.title);
        const url = safeURL(work.url);
        const titleMarkup = url
          ? '<a class="work-title-link" href="' +
            escapeHTML(url) +
            '"' +
            externalAttributes(url) +
            ">" +
            escapeHTML(title) +
            "</a>"
          : "<span>" + escapeHTML(title) + "</span>";
        const arrow = url
          ? '<a class="work-arrow" href="' +
            escapeHTML(url) +
            '"' +
            externalAttributes(url) +
            ' aria-label="' +
            escapeHTML(localized(data.ui.openProject)) +
            ": " +
            escapeHTML(title) +
            '"><span aria-hidden="true">→</span></a>'
          : '<span class="work-arrow work-arrow--quiet" aria-hidden="true">→</span>';
        const tags = Array.isArray(work.tags)
          ? '<ul class="work-tags">' +
            work.tags
              .map(function (tag) {
                return "<li>" + escapeHTML(localized(tag)) + "</li>";
              })
              .join("") +
            "</ul>"
          : "";

        return (
          '<article class="work-item">' +
          '<img class="work-image" src="' +
          escapeHTML(work.image) +
          '" alt="' +
          escapeHTML(localized(work.imageAlt)) +
          '" loading="lazy">' +
          '<div class="work-copy">' +
          '<p class="eyebrow work-category">' +
          escapeHTML(localized(work.category)) +
          "</p><h3>" +
          titleMarkup +
          "</h3><p class=\"work-description\">" +
          escapeHTML(localized(work.description)) +
          "</p>" +
          tags +
          "</div>" +
          arrow +
          "</article>"
        );
      })
      .join("");

    return (
      '<section class="content-section works-section" id="works" aria-labelledby="works-title">' +
      '<div class="section-heading"><div>' +
      '<p class="section-note">' +
      escapeHTML(localized(data.ui.worksNote)) +
      "</p><h2 id=\"works-title\">" +
      escapeHTML(localized(data.ui.works)) +
      "</h2></div></div>" +
      '<div class="works-list">' +
      items +
      "</div></section>"
    );
  }

  function renderCareer() {
    const entries = data.career
      .map(function (entry, index) {
        return (
          '<li class="career-item"><p class="career-date">' +
          escapeHTML(localized(entry.years)) +
          '</p><span class="career-marker' +
          (index === 0 ? " career-marker--current" : "") +
          '" aria-hidden="true"></span><div class="career-copy"><h3>' +
          escapeHTML(localized(entry.title)) +
          '</h3><p class="career-role"><span>' +
          escapeHTML(localized(data.ui.rolePrefix)) +
          "</span> " +
          escapeHTML(localized(entry.role)) +
          '</p><p class="career-description">' +
          escapeHTML(localized(entry.description)) +
          "</p></div></li>"
        );
      })
      .join("");

    return (
      '<section class="content-section career-section" id="career" aria-labelledby="career-title">' +
      '<div class="section-heading"><h2 id="career-title">' +
      escapeHTML(localized(data.ui.career)) +
      "</h2></div><ol class=\"career-list\">" +
      entries +
      "</ol></section>"
    );
  }

  function renderSkills() {
    const items = data.skills
      .map(function (skill) {
        const iconMarkup = /^[a-z0-9-]+$/.test(skill.icon || "")
          ? '<img class="skill-cloud__icon" src="/assets/icons/skills/' +
            escapeHTML(skill.icon) +
            '.svg" alt="" aria-hidden="true" width="20" height="20">'
          : skillGlyph(skill.glyph);

        return (
          '<li class="skill-cloud__item" data-skill="' +
          escapeHTML(skill.id) +
          '"><span class="skill-cloud__chip">' +
          iconMarkup +
          '<span class="skill-cloud__name">' +
          escapeHTML(localized(skill.name)) +
          "</span></span></li>"
        );
      })
      .join("");

    return (
      '<section class="content-section skills-section" id="skills" aria-labelledby="skills-title">' +
      '<div class="section-heading"><h2 id="skills-title">' +
      escapeHTML(localized(data.ui.skills)) +
      '</h2></div><div class="skill-cloud-stage"><ul class="skill-cloud" aria-label="' +
      escapeHTML(localized(data.ui.skills)) +
      '">' +
      items +
      "</ul></div></section>"
    );
  }

  function skillGlyph(name) {
    const paths = {
      sparkles:
        '<path d="m12 3 1.7 5.3L19 10l-5.3 1.7L12 17l-1.7-5.3L5 10l5.3-1.7L12 3Z"/><path d="m19 14 .9 2.1L22 17l-2.1.9L19 20l-.9-2.1L16 17l2.1-.9L19 14Z"/>',
      cpu:
        '<rect x="6" y="6" width="12" height="12" rx="2"/><path d="M9 9h6v6H9zM9 2v4m6-4v4m-6 12v4m6-4v4M2 9h4m-4 6h4m12-6h4m-4 6h4"/>',
      cloud:
        '<path d="M7.5 18h9.6a4.4 4.4 0 0 0 .4-8.8 6 6 0 0 0-11.4.6A4.1 4.1 0 0 0 7.5 18Z"/>',
      layers:
        '<path d="m12 3 9 5-9 5-9-5 9-5Z"/><path d="m3 12 9 5 9-5M3 16l9 5 9-5"/>',
      bolt: '<path d="m13 2-9 12h7l-1 8 10-13h-7l1-7Z"/>',
      database:
        '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
      network:
        '<circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="18" r="2.5"/><circle cx="19" cy="18" r="2.5"/><path d="m10.8 7.2-4.6 8.6m7-8.6 4.6 8.6M7.5 18h9"/>',
    };
    return (
      '<svg class="skill-cloud__fallback-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
      (paths[name] || paths.sparkles) +
      "</g></svg>"
    );
  }

  function forceRectCollide(gap) {
    let nodes = [];
    const padding = gap || 12;

    function force(alpha) {
      for (let iteration = 0; iteration < 3; iteration += 1) {
        for (let left = 0; left < nodes.length; left += 1) {
          const a = nodes[left];
          for (let right = left + 1; right < nodes.length; right += 1) {
            const b = nodes[right];
            const dx = b.x - a.x;
            const dy = b.y - a.y;
            const overlapX = (a.width + b.width) / 2 + padding - Math.abs(dx);
            const overlapY = (a.height + b.height) / 2 + padding - Math.abs(dy);

            if (overlapX <= 0 || overlapY <= 0) continue;

            const directionX = dx === 0 ? (left % 2 === 0 ? 1 : -1) : Math.sign(dx);
            const directionY = dy === 0 ? (right % 2 === 0 ? 1 : -1) : Math.sign(dy);
            if (overlapX < overlapY) {
              const shift = (overlapX * alpha) / 2;
              a.vx -= directionX * shift;
              b.vx += directionX * shift;
            } else {
              const shift = (overlapY * alpha) / 2;
              a.vy -= directionY * shift;
              b.vy += directionY * shift;
            }
          }
        }
      }
    }

    force.initialize = function (nextNodes) {
      nodes = nextNodes;
    };
    return force;
  }

  function settleSkillCloud(nodes, width, height) {
    const gap = 16;
    const clamp = function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    };

    for (let pass = 0; pass < 120; pass += 1) {
      let foundOverlap = false;
      for (let left = 0; left < nodes.length; left += 1) {
        const a = nodes[left];
        for (let right = left + 1; right < nodes.length; right += 1) {
          const b = nodes[right];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const overlapX = (a.width + b.width) / 2 + gap - Math.abs(dx);
          const overlapY = (a.height + b.height) / 2 + gap - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;

          foundOverlap = true;
          const useX = overlapX < overlapY;
          const overlap = (useX ? overlapX : overlapY) + 1;
          const axis = useX ? "x" : "y";
          const direction = (useX ? dx : dy) === 0
            ? ((left + right) % 2 === 0 ? 1 : -1)
            : Math.sign(useX ? dx : dy);
          const availableA = useX
            ? [a.width / 2 + 4, width - a.width / 2 - 4]
            : [a.height / 2 + 4, height - a.height / 2 - 4];
          const availableB = useX
            ? [b.width / 2 + 4, width - b.width / 2 - 4]
            : [b.height / 2 + 4, height - b.height / 2 - 4];
          const beforeA = a[axis];
          const beforeB = b[axis];
          a[axis] = clamp(beforeA - direction * overlap / 2, availableA[0], availableA[1]);
          b[axis] = clamp(beforeB + direction * overlap / 2, availableB[0], availableB[1]);

          let remaining = overlap - Math.abs(a[axis] - beforeA) - Math.abs(b[axis] - beforeB);
          if (remaining > 0) {
            b[axis] = clamp(b[axis] + direction * remaining, availableB[0], availableB[1]);
            remaining = overlap - Math.abs(a[axis] - beforeA) - Math.abs(b[axis] - beforeB);
          }
          if (remaining > 0) {
            a[axis] = clamp(a[axis] - direction * remaining, availableA[0], availableA[1]);
          }
        }
      }
      if (!foundOverlap) break;
    }
  }

  function stopSkillCloud() {
    if (skillSimulation) skillSimulation.stop();
    if (skillCloudResizeObserver) skillCloudResizeObserver.disconnect();
    if (skillCloudResizeHandler) {
      window.removeEventListener("resize", skillCloudResizeHandler);
    }
    if (skillCloudResizeFrame !== null) {
      window.cancelAnimationFrame(skillCloudResizeFrame);
      skillCloudResizeFrame = null;
    }
    skillSimulation = null;
    skillCloudResizeObserver = null;
    skillCloudResizeHandler = null;
  }

  function initializeSkillCloud() {
    stopSkillCloud();
    const stage = root.querySelector(".skill-cloud-stage");
    const list = stage && stage.querySelector(".skill-cloud");
    if (!stage || !list) return;

    const items = Array.from(list.querySelectorAll(".skill-cloud__item"));
    if (!window.d3 || !items.length) {
      list.classList.add("skill-cloud--static");
      return;
    }

    function layout() {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      if (skillSimulation) skillSimulation.stop();

      const centerX = width / 2;
      const centerY = height / 2;
      const nodes = items.map(function (element, index) {
        const fontSizes = [0.94, 1.08, 0.98, 1.14, 1.02, 0.91, 1.06];
        element.style.setProperty("--skill-size", fontSizes[index % fontSizes.length] + "rem");
        const bounds = element.getBoundingClientRect();
        const nodeWidth = bounds.width;
        const nodeHeight = bounds.height;
        const spread = Math.sqrt((index + 0.5) / items.length);
        const angle = index * 2.399963229728653;
        const radialX = Math.max(0, width / 2 - nodeWidth / 2 - 12);
        const radialY = Math.max(0, height / 2 - nodeHeight / 2 - 12);

        return {
          element: element,
          width: nodeWidth,
          height: nodeHeight,
          x: centerX + ((index % 3) - 1) * 1.5,
          y: centerY + ((index % 4) - 1.5) * 1.5,
          targetX: centerX + Math.cos(angle) * spread * radialX,
          targetY: centerY + Math.sin(angle) * spread * radialY,
        };
      });

      skillSimulation = window.d3
        .forceSimulation(nodes)
        .velocityDecay(0.38)
        .alphaDecay(0.025)
        .force("x", window.d3.forceX(function (node) { return node.targetX; }).strength(0.12))
        .force("y", window.d3.forceY(function (node) { return node.targetY; }).strength(0.15))
        .force("rect-collide", forceRectCollide(12));

      function update() {
        nodes.forEach(function (node) {
          const x = Math.max(node.width / 2 + 4, Math.min(width - node.width / 2 - 4, node.x));
          const y = Math.max(node.height / 2 + 4, Math.min(height - node.height / 2 - 4, node.y));
          node.element.style.transform =
            "translate(" + (x - node.width / 2) + "px, " + (y - node.height / 2) + "px)";
        });
      }

      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        skillSimulation.stop();
        skillSimulation.tick(320);
        settleSkillCloud(nodes, width, height);
        update();
      } else {
        skillSimulation.on("tick", update).on("end", function () {
          settleSkillCloud(nodes, width, height);
          update();
        });
      }
    }

    layout();
    if ("ResizeObserver" in window) {
      skillCloudResizeObserver = new ResizeObserver(function () {
        if (skillCloudResizeFrame !== null) window.cancelAnimationFrame(skillCloudResizeFrame);
        skillCloudResizeFrame = window.requestAnimationFrame(function () {
          skillCloudResizeFrame = null;
          layout();
        });
      });
      skillCloudResizeObserver.observe(stage);
    } else {
      skillCloudResizeHandler = layout;
      window.addEventListener("resize", skillCloudResizeHandler, { passive: true });
    }
  }

  function render() {
    document.documentElement.lang = locale;
    document.title = localized(data.ui.title);
    const description = document.querySelector('meta[name="description"]');
    if (description) {
      description.setAttribute("content", localized(data.profile.summary));
    }

    root.innerHTML =
      '<a class="skip-link" href="#main">' +
      escapeHTML(localized(data.ui.skipToContent)) +
      '</a><div class="page-shell"><header class="site-header">' +
      '<a class="brand" href="#top">' +
      escapeHTML(data.profile.name) +
      '</a><div class="header-right"><nav class="primary-nav" aria-label="' +
      escapeHTML(localized(data.ui.navigationLabel)) +
      '"><a href="#works">' +
      escapeHTML(localized(data.ui.works)) +
      '</a><a href="#career">' +
      escapeHTML(localized(data.ui.career)) +
      '</a><a href="#skills">' +
      escapeHTML(localized(data.ui.skills)) +
      "</a></nav>" +
      renderLanguageControl() +
      "</div></header><main id=\"main\">" +
      renderHero() +
      renderWorks() +
      renderCareer() +
      renderSkills() +
      '</main><footer class="site-footer"><div class="footer-identity">' +
      '<a class="footer-name" href="#top">' +
      escapeHTML(data.profile.name) +
      '</a><span class="footer-divider" aria-hidden="true"></span><span class="footer-role">' +
      escapeHTML(localized(data.profile.role)) +
      '</span></div><nav class="footer-links" aria-label="' +
      escapeHTML(localized(data.ui.socialLinksLabel)) +
      '">' +
      data.links.map(function (link) {
        return renderSocialLink(link, true);
      }).join("") +
      '</nav></footer></div><p class="visually-hidden" id="language-status" aria-live="polite"></p>';

    initializeSkillCloud();

    root.querySelectorAll("[data-locale]").forEach(function (button) {
      button.addEventListener("click", function () {
        changeLocale(button.dataset.locale);
      });
    });
  }

  function changeLocale(nextLocale) {
    if (!locales.includes(nextLocale) || nextLocale === locale) return;

    const visibleSection = Array.from(root.querySelectorAll("main section")).find(
      function (section) {
        return section.getBoundingClientRect().bottom > 0;
      },
    );
    const sectionTop = visibleSection
      ? visibleSection.getBoundingClientRect().top
      : null;
    const sectionId = visibleSection ? visibleSection.id : "";

    locale = nextLocale;
    try {
      window.localStorage.setItem("portfolio-language", locale);
    } catch (_error) {
      // Keep the selection for the current page view when storage is unavailable.
    }

    render();
    const status = root.querySelector("#language-status");
    if (status) status.textContent = localized(data.ui.languageChanged);

    const activeButton = root.querySelector('[data-locale="' + locale + '"]');
    if (activeButton) activeButton.focus({ preventScroll: true });

    if (sectionId && sectionTop !== null) {
      window.requestAnimationFrame(function () {
        const updatedSection = document.getElementById(sectionId);
        if (updatedSection) {
          window.scrollBy(0, updatedSection.getBoundingClientRect().top - sectionTop);
        }
      });
    }
  }

  render();
})();
