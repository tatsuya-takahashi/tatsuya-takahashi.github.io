(function () {
  "use strict";

  const dataElement = document.getElementById("portfolio-data");
  const root = document.getElementById("portfolio-root");
  if (!dataElement || !root) return;

  const data = JSON.parse(dataElement.textContent || "{}");
  const locales = ["en", "ja"];

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

  function skillSymbol(icon) {
    const symbols = {
      code: "&lt;/&gt;",
      data: "▥",
      layers: "◇",
      creative: "✳",
      cloud: "⌂",
      language: "文",
    };
    return symbols[icon] || "•";
  }

  function renderSkills() {
    const groups = data.skills
      .map(function (group) {
        const items = group.items
          .map(function (item) {
            return "<li>" + escapeHTML(localized(item)) + "</li>";
          })
          .join("");

        return (
          '<section class="skill-group" aria-labelledby="skill-' +
          escapeHTML(group.id) +
          '"><div class="skill-heading"><span class="skill-symbol skill-symbol--' +
          escapeHTML(group.icon) +
          '" aria-hidden="true">' +
          skillSymbol(group.icon) +
          '</span><h3 id="skill-' +
          escapeHTML(group.id) +
          '">' +
          escapeHTML(localized(group.title)) +
          '</h3></div><ul class="skill-list">' +
          items +
          "</ul></section>"
        );
      })
      .join("");

    return (
      '<section class="content-section skills-section" id="skills" aria-labelledby="skills-title">' +
      '<div class="section-heading"><h2 id="skills-title">' +
      escapeHTML(localized(data.ui.skills)) +
      "</h2></div><div class=\"skills-grid\">" +
      groups +
      "</div></section>"
    );
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
