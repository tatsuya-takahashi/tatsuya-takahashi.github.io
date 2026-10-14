(function () {
  "use strict";

  const dataElement = document.getElementById("portfolio-data");
  const root = document.getElementById("portfolio-root");
  if (!dataElement || !root) return;

  const data = JSON.parse(dataElement.textContent || "{}");
  const locales = ["en", "ja"];
  const skillGroups = [
    { id: "llm", name: "LLM" },
    { id: "cloud", name: "Cloud" },
    { id: "programming", name: "Programming" },
  ];
  let skillNetworkSimulation = null;
  let skillNetworkResizeObserver = null;
  let skillNetworkResizeFrame = null;
  let skillNetworkResizeHandler = null;

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
      '" width="180" height="180"></div></section>'
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
      '<h2 id="works-title">' +
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
    const items = skillGroups
      .map(function (group) {
        const groupNode =
          '<li class="skill-network__item skill-network__item--group" data-node-id="group-' +
          escapeHTML(group.id) +
          '" data-category="' +
          escapeHTML(group.id) +
          '"><button class="skill-network__group-node" type="button" aria-label="' +
          escapeHTML(group.name) +
          '">' +
          escapeHTML(group.name) +
          "</button></li>";
        const skillNodes = data.skills
          .filter(function (skill) { return skill.category === group.id; })
          .map(function (skill) {
            const iconMarkup = /^[a-z0-9-]+$/.test(skill.icon || "")
              ? '<img class="skill-network__icon" src="/assets/icons/skills/' +
                escapeHTML(skill.icon) +
                '.svg" alt="" aria-hidden="true" width="20" height="20">'
              : skillGlyph(skill.glyph);

            return (
              '<li class="skill-network__item skill-network__item--skill" data-node-id="' +
              escapeHTML(skill.id) +
              '" data-skill="' +
              escapeHTML(skill.id) +
              '" data-category="' +
              escapeHTML(skill.category) +
              '"><button class="skill-network__skill-node" type="button" aria-label="' +
              escapeHTML(localized(skill.name)) +
              '">' +
              iconMarkup +
              '<span class="skill-network__name">' +
              escapeHTML(localized(skill.name)) +
              "</span></button></li>"
            );
          })
          .join("");
        return groupNode + skillNodes;
      })
      .join("");

    return (
      '<section class="content-section skills-section" id="skills" aria-labelledby="skills-title">' +
      '<div class="section-heading"><h2 id="skills-title">' +
      escapeHTML(localized(data.ui.skills)) +
      '</h2></div><div class="skill-network-stage"><svg class="skill-network__edges" aria-hidden="true"></svg><ul class="skill-network" aria-label="' +
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
      '<svg class="skill-network__fallback-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">' +
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

  function stopSkillNetwork() {
    if (skillNetworkSimulation) skillNetworkSimulation.stop();
    if (skillNetworkResizeObserver) skillNetworkResizeObserver.disconnect();
    if (skillNetworkResizeHandler) {
      window.removeEventListener("resize", skillNetworkResizeHandler);
    }
    if (skillNetworkResizeFrame !== null) {
      window.cancelAnimationFrame(skillNetworkResizeFrame);
      skillNetworkResizeFrame = null;
    }
    skillNetworkSimulation = null;
    skillNetworkResizeObserver = null;
    skillNetworkResizeHandler = null;
  }

  function initializeSkillNetwork() {
    stopSkillNetwork();
    const stage = root.querySelector(".skill-network-stage");
    const list = stage && stage.querySelector(".skill-network");
    const edgeSvg = stage && stage.querySelector(".skill-network__edges");
    if (!stage || !list || !edgeSvg) return;

    const items = Array.from(list.querySelectorAll(".skill-network__item"));
    if (!window.d3 || !items.length) {
      stage.classList.add("skill-network-stage--static");
      list.classList.add("skill-network--static");
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const clamp = function (value, min, max) {
      return Math.max(min, Math.min(max, value));
    };

    function layout() {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      if (!width || !height) return;
      if (skillNetworkSimulation) skillNetworkSimulation.stop();
      list.classList.remove("skill-network--ready");
      items.forEach(function (item) {
        item.style.transform = "translate(0px, 0px)";
      });
      edgeSvg.replaceChildren();

      const compact = width <= 600;
      const anchors = compact
        ? {
            llm: { x: width * 0.5, y: height * 0.16 },
            cloud: { x: width * 0.5, y: height * 0.5 },
            programming: { x: width * 0.5, y: height * 0.84 },
          }
        : {
            llm: { x: width * 0.24, y: height * 0.32 },
            cloud: { x: width * 0.76, y: height * 0.32 },
            programming: { x: width * 0.5, y: height * 0.77 },
          };

      const groupNodes = skillGroups.map(function (group) {
        const element = items.find(function (item) {
          return item.dataset.nodeId === "group-" + group.id;
        });
        const bounds = element.getBoundingClientRect();
        const anchor = anchors[group.id];
        const x = clamp(anchor.x, bounds.width / 2 + 8, width - bounds.width / 2 - 8);
        const y = clamp(anchor.y, bounds.height / 2 + 8, height - bounds.height / 2 - 8);
        return {
          id: "group-" + group.id,
          type: "group",
          category: group.id,
          element: element,
          control: element.querySelector(".skill-network__group-node"),
          width: bounds.width,
          height: bounds.height,
          x: x,
          y: y,
          fx: x,
          fy: y,
          targetX: x,
          targetY: y,
        };
      });
      const groupById = new Map(groupNodes.map(function (node) { return [node.category, node]; }));
      const childIndexes = Object.create(null);
      const childCounts = Object.create(null);
      data.skills.forEach(function (skill) {
        childCounts[skill.category] = (childCounts[skill.category] || 0) + 1;
      });

      const skillNodes = data.skills.map(function (skill, index) {
        const element = items.find(function (item) {
          return item.dataset.nodeId === skill.id;
        });
        const control = element.querySelector(".skill-network__skill-node");
        const bounds = control.getBoundingClientRect();
        control.style.setProperty("--skill-float-delay", index * -0.45 + "s");
        const group = groupById.get(skill.category);
        const childIndex = childIndexes[skill.category] || 0;
        childIndexes[skill.category] = childIndex + 1;
        const count = childCounts[skill.category] || 1;
        const angle = (childIndex / count) * Math.PI * 2 - Math.PI / 2;
        const radiusX = Math.min(width * (compact ? 0.34 : 0.13), compact ? 152 : 148);
        const radiusY = compact ? 94 : 126;
        const initialOffsetX = Math.cos(angle) * radiusX;
        const initialOffsetY = Math.sin(angle) * radiusY;
        const x = clamp(group.x + initialOffsetX, bounds.width / 2 + 5, width - bounds.width / 2 - 5);
        const y = clamp(group.y + initialOffsetY, bounds.height / 2 + 5, height - bounds.height / 2 - 5);
        const offsetX = x - group.x;
        const offsetY = y - group.y;
        return {
          id: skill.id,
          type: "skill",
          category: skill.category,
          element: element,
          control: control,
          width: bounds.width,
          height: bounds.height,
          x: x,
          y: y,
          targetX: x,
          targetY: y,
          offsetX: offsetX,
          offsetY: offsetY,
          restLength: Math.hypot(offsetX, offsetY),
        };
      });
      const nodes = groupNodes.concat(skillNodes);
      const links = skillNodes.map(function (node) {
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("class", "skill-network__edge");
        line.setAttribute("data-category", node.category);
        edgeSvg.appendChild(line);
        return {
          source: node.id,
          target: "group-" + node.category,
          distance: node.restLength,
          line: line,
        };
      });

      function forceParentSprings(alpha) {
        skillNodes.forEach(function (node) {
          const parent = groupById.get(node.category);
          const dx = node.x - parent.x;
          const dy = node.y - parent.y;
          const distance = Math.hypot(dx, dy);
          if (!distance) return;
          const stretch = distance - node.restLength;
          const force = (stretch / distance) * alpha * 2.2;
          node.vx -= dx * force;
          node.vy -= dy * force;
        });
      }
      forceParentSprings.initialize = function () {};
      const forceX = window.d3.forceX(function (node) { return node.targetX; }).strength(0.34);
      const forceY = window.d3.forceY(function (node) { return node.targetY; }).strength(0.34);

      skillNetworkSimulation = window.d3
        .forceSimulation(nodes)
        .velocityDecay(0.62)
        .alphaDecay(0.035)
        .force(
          "link",
          window.d3.forceLink(links)
            .id(function (node) { return node.id; })
            .distance(function (link) { return link.distance; })
            .strength(0.82),
        )
        .force("charge", window.d3.forceManyBody().strength(function (node) {
          return node.type === "group" ? -38 : -18;
        }))
        .force("x", forceX)
        .force("y", forceY)
        .force("parent-spring", forceParentSprings)
        .force("rect-collide", forceRectCollide(12));

      function update() {
        nodes.forEach(function (node) {
          if (node.type === "skill") {
            node.x = node.fx === null || node.fx === undefined
              ? clamp(node.x, node.width / 2 + 5, width - node.width / 2 - 5)
              : clamp(node.fx, node.width / 2 + 5, width - node.width / 2 - 5);
            node.y = node.fy === null || node.fy === undefined
              ? clamp(node.y, node.height / 2 + 5, height - node.height / 2 - 5)
              : clamp(node.fy, node.height / 2 + 5, height - node.height / 2 - 5);
            if (node.fx !== null && node.fx !== undefined) node.fx = node.x;
            if (node.fy !== null && node.fy !== undefined) node.fy = node.y;
          }
          node.element.style.transform =
            "translate(" + (node.x - node.width / 2) + "px, " + (node.y - node.height / 2) + "px)";
        });

        links.forEach(function (link) {
          link.line.setAttribute("x1", link.source.x);
          link.line.setAttribute("y1", link.source.y);
          link.line.setAttribute("x2", link.target.x);
          link.line.setAttribute("y2", link.target.y);
        });
      }

      skillNetworkSimulation.on("tick", update);
      if (reducedMotion) {
        skillNetworkSimulation.stop();
        skillNetworkSimulation.tick(360);
        update();
        list.classList.add("skill-network--ready");
      } else {
        skillNetworkSimulation.on("end", function () {
          update();
          list.classList.add("skill-network--ready");
        });
      }

      function moveChildrenWithGroup(groupNode) {
        skillNodes.forEach(function (child) {
          if (child.category !== groupNode.category) return;
          child.targetX = groupNode.x + child.offsetX;
          child.targetY = groupNode.y + child.offsetY;
        });
        forceX.x(function (node) { return node.targetX; });
        forceY.y(function (node) { return node.targetY; });
      }

      const drag = window.d3
        .drag()
        .container(function () { return stage; })
        .subject(function (_event, node) { return node; })
        .on("start", function (event, node) {
          node.fx = node.x;
          node.fy = node.y;
          node.element.classList.add("is-dragging");
          if (!reducedMotion) skillNetworkSimulation.alphaTarget(0.12).restart();
        })
        .on("drag", function (event, node) {
          node.fx = clamp(event.x, node.width / 2 + 5, width - node.width / 2 - 5);
          node.fy = clamp(event.y, node.height / 2 + 5, height - node.height / 2 - 5);
          node.x = node.fx;
          node.y = node.fy;
          if (node.type === "group") moveChildrenWithGroup(node);
          if (reducedMotion) update();
        })
        .on("end", function (_event, node) {
          node.element.classList.remove("is-dragging");
          if (node.type === "skill") {
            node.fx = null;
            node.fy = null;
          } else {
            node.fx = node.x;
            node.fy = node.y;
            node.targetX = node.x;
            node.targetY = node.y;
            moveChildrenWithGroup(node);
          }
          if (reducedMotion) {
            skillNetworkSimulation.alpha(0.34);
            skillNetworkSimulation.tick(120);
            update();
          } else {
            skillNetworkSimulation.alpha(0.38).alphaTarget(0).restart();
          }
        });

      nodes.forEach(function (node) {
        window.d3.select(node.control).datum(node).call(drag);
        node.control.addEventListener("keydown", function (event) {
          const step = event.shiftKey ? 20 : 8;
          const directions = {
            ArrowLeft: [-step, 0],
            ArrowRight: [step, 0],
            ArrowUp: [0, -step],
            ArrowDown: [0, step],
          };
          const direction = directions[event.key];
          if (!direction) return;
          event.preventDefault();
          node.fx = clamp(node.x + direction[0], node.width / 2 + 5, width - node.width / 2 - 5);
          node.fy = clamp(node.y + direction[1], node.height / 2 + 5, height - node.height / 2 - 5);
          node.x = node.fx;
          node.y = node.fy;
          if (node.type === "group") {
            node.targetX = node.x;
            node.targetY = node.y;
            moveChildrenWithGroup(node);
          }
          node.vx = 0;
          node.vy = 0;
          update();
          if (!reducedMotion) skillNetworkSimulation.alpha(0.14).alphaTarget(0).restart();
        });
      });
    }

    layout();
    if ("ResizeObserver" in window) {
      skillNetworkResizeObserver = new ResizeObserver(function () {
        if (skillNetworkResizeFrame !== null) window.cancelAnimationFrame(skillNetworkResizeFrame);
        skillNetworkResizeFrame = window.requestAnimationFrame(function () {
          skillNetworkResizeFrame = null;
          layout();
        });
      });
      skillNetworkResizeObserver.observe(stage);
    } else {
      skillNetworkResizeHandler = layout;
      window.addEventListener("resize", skillNetworkResizeHandler, { passive: true });
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

    initializeSkillNetwork();

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
