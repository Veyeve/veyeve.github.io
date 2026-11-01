(() => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector("#primary-nav");
  if (toggle && nav) {
    const closeNav = () => {
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open navigation");
      nav.classList.remove("is-open");
    };
    toggle.addEventListener("click", () => {
      const open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      toggle.setAttribute("aria-label", open ? "Open navigation" : "Close navigation");
      nav.classList.toggle("is-open", !open);
    });
    nav.querySelectorAll("a").forEach(link => link.addEventListener("click", closeNav));
    window.addEventListener("resize", () => { if (window.innerWidth > 650) closeNav(); });
  }

  const themeButton = document.querySelector("#theme-toggle");
  const modes = ["light", "system", "dark"];
  const labels = { light: "Light", system: "System", dark: "Dark" };
  let saved = "system";
  try { saved = localStorage.getItem("veyeve-theme") || "system"; } catch (_) {}
  if (!modes.includes(saved)) saved = "system";
  const applyTheme = mode => {
    document.documentElement.dataset.theme = mode;
    if (!themeButton) return;
    const label = themeButton.querySelector(".theme-label");
    const icon = themeButton.querySelector(".theme-icon");
    if (label) label.textContent = labels[mode];
    if (icon) icon.textContent = mode === "light" ? "☼" : mode === "dark" ? "☾" : "◐";
    themeButton.setAttribute("aria-label", "Color theme: " + labels[mode] + ". Click to change.");
    themeButton.title = "Color theme: " + labels[mode] + " (click to change)";
  };
  applyTheme(saved);
  themeButton?.addEventListener("click", () => {
    const next = modes[(modes.indexOf(document.documentElement.dataset.theme) + 1) % modes.length];
    applyTheme(next);
    try { localStorage.setItem("veyeve-theme", next); } catch (_) {}
  });

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const desktop = document.querySelector("#win95-easter");
  const startMenu = document.querySelector("#win95-start-menu");
  const closeDesktop = () => {
    desktop?.classList.remove("is-open");
    desktop?.setAttribute("aria-hidden", "true");
    startMenu?.classList.remove("is-open");
  };
  const openDesktop = () => {
    if (!desktop) return;
    desktop.classList.add("is-open");
    desktop.setAttribute("aria-hidden", "false");
    closeSearch();
  };
  desktop?.addEventListener("click", event => {
    const action = event.target.closest("[data-win-action]")?.dataset.winAction;
    if (!action) return;
    if (action === "close") closeDesktop();
    if (action === "start") startMenu?.classList.toggle("is-open");
    if (action === "projects") window.location.href = "projects.html";
    if (action === "about") window.location.href = "about.html";
    if (action === "github") window.open("https://github.com/Veyeve", "_blank", "noopener,noreferrer");
  });
  const clock = document.querySelector("#win95-clock");
  if (clock) {
    const updateClock = () => { clock.textContent = new Date().toLocaleTimeString([], { hour: "numeric", minute: "2-digit" }); };
    updateClock();
    window.setInterval(updateClock, 30000);
  }

  const search = document.querySelector("#site-search");
  const searchInput = document.querySelector("#site-search-input");
  const results = document.querySelector("#site-search-results");
  const entries = [
    {title:"Home",url:"index.html",type:"Page",desc:"Who Vey is, what we make, and the latest highlights.",terms:"vey veyeve independent studio developers home"},
    {title:"Projects",url:"projects.html",type:"Page",desc:"Browse active projects, public work, and upcoming releases.",terms:"projects work portfolio public private internal coming soon"},
    {title:"Veyeve Website",url:"https://veyeve.github.io/",type:"Private",desc:"The main Veyeve website and digital home.",terms:"website site homepage web design"},
    {title:"Veyeve Docs",url:"https://github.com/Veyeve",type:"Public",desc:"Documentation and project information.",terms:"docs documentation guides help public"},
    {title:"Veyeve Lab",url:"projects.html",type:"Internal",desc:"Experiments, prototypes, and ideas in progress.",terms:"lab experiments prototypes"},
    {title:"Veyeve DNS",url:"projects.html",type:"Coming soon",desc:"A planned DNS project. Details will be shared as it develops.",terms:"dns domain name system network"},
    {title:"Veyeve Website Builder",url:"projects.html",type:"Coming soon",desc:"A planned visual website creation tool.",terms:"builder website creator design no code"},
    {title:"Veyeve Discord Bot",url:"projects.html",type:"Coming soon",desc:"A planned community bot with commands and server utilities.",terms:"discord bot community automation"},
    {title:"About Vey",url:"about.html",type:"Page",desc:"Our story, principles, and approach to open source.",terms:"about team story values principles"},
    {title:"Open source",url:"about.html#open-source",type:"Topic",desc:"How we share source code and explain what cannot be public.",terms:"open source github code license repositories"},
    {title:"Contact",url:"contact.html",type:"Page",desc:"Find Vey and reach out through GitHub.",terms:"contact hello reach out message"},
    {title:"GitHub",url:"https://github.com/Veyeve",type:"External",desc:"Explore repositories and follow project updates.",terms:"github source repositories code"}
  ];
  const closeSearch = () => {
    search?.classList.remove("is-open");
    search?.setAttribute("aria-hidden", "true");
  };
  const openSearch = () => {
    if (!search) { openDesktop(); return; }
    search.classList.add("is-open");
    search.setAttribute("aria-hidden", "false");
    if (searchInput) { searchInput.value = ""; renderResults(""); window.setTimeout(() => searchInput.focus(), 0); }
  };
  function renderResults(raw) {
    if (!results) return;
    const query = raw.trim().toLowerCase();
    if (!query) {
      results.innerHTML = '<p class="site-search-empty">Try “projects”, “DNS”, “open source”, “contact”, or type <b>cmd</b> to open the Vey 95 desktop.</p>';
      return;
    }
    if (query === "cmd" || query === "command" || query === "desktop") {
      results.innerHTML = '<button class="site-search-result" type="button" data-open-desktop><span><strong>Vey 95 desktop</strong><small>Open the retro desktop Easter egg.</small></span><em>OPEN ↵</em></button>';
      return;
    }
    const words = query.split(/\s+/).filter(Boolean);
    const ranked = entries.map(item => {
      const haystack = (item.title+" "+item.type+" "+item.desc+" "+item.terms).toLowerCase();
      const score = words.reduce((sum,word) => sum + (item.title.toLowerCase().includes(word)?5:0) + (item.terms.includes(word)?2:0) + (item.desc.toLowerCase().includes(word)?1:0),0);
      return {item,score};
    }).filter(row => row.score > 0).sort((a,b)=>b.score-a.score).slice(0,7);
    results.innerHTML = ranked.length ? ranked.map(({item}) => '<a class="site-search-result" href="'+item.url+'"><span><strong>'+item.title+'</strong><small>'+item.desc+'</small></span><em>'+item.type.toUpperCase()+' ↗</em></a>').join("") : '<p class="site-search-empty">No matches yet. Try a project name, “open source”, “about”, or “contact”.</p>';
  }
  searchInput?.addEventListener("input", () => renderResults(searchInput.value));
  search?.addEventListener("click", event => {
    if (event.target.closest("[data-search-close]")) closeSearch();
    if (event.target.closest("[data-open-desktop]")) openDesktop();
  });

  document.addEventListener("keydown", event => {
    const target = event.target;
    const typing = target && (target.isContentEditable || /INPUT|TEXTAREA|SELECT/.test(target.tagName));
    if (event.shiftKey && event.key.toLowerCase() === "r" && !typing) {
      event.preventDefault();
      openSearch();
    } else if (event.key === "Escape") {
      if (search?.classList.contains("is-open")) closeSearch();
      else if (desktop?.classList.contains("is-open")) closeDesktop();
    } else if (event.key === "Enter" && search?.classList.contains("is-open") && document.activeElement === searchInput) {
      const command = searchInput.value.trim().toLowerCase();
      if (["cmd","command","desktop"].includes(command)) openDesktop();
      else {
        const first = results?.querySelector("a.site-search-result");
        if (first) window.location.href = first.href;
      }
    }
  });
})();