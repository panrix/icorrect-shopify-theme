/* @ds-bundle: {"format":4,"namespace":"ICorrectDesignSystem_ddcb23","components":[{"name":"AppTopBar","sourcePath":"components/app/AppTopBar.jsx"},{"name":"CapacityMeter","sourcePath":"components/app/CapacityMeter.jsx"},{"name":"DockPanel","sourcePath":"components/app/DockPanel.jsx"},{"name":"JobCard","sourcePath":"components/app/JobCard.jsx"},{"name":"NavRail","sourcePath":"components/app/NavRail.jsx"},{"name":"Segmented","sourcePath":"components/app/Segmented.jsx"},{"name":"StatePill","sourcePath":"components/app/StatePill.jsx"},{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Card","sourcePath":"components/core/Card.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"Input","sourcePath":"components/core/Input.jsx"},{"name":"Logo","sourcePath":"components/core/Logo.jsx"},{"name":"MonoLabel","sourcePath":"components/core/MonoLabel.jsx"},{"name":"Stars","sourcePath":"components/core/Stars.jsx"},{"name":"StatusPill","sourcePath":"components/core/StatusPill.jsx"},{"name":"FaqItem","sourcePath":"components/marketing/FaqItem.jsx"},{"name":"ProductTile","sourcePath":"components/marketing/ProductTile.jsx"},{"name":"ProofCard","sourcePath":"components/marketing/ProofCard.jsx"},{"name":"SectionHead","sourcePath":"components/marketing/SectionHead.jsx"},{"name":"StickyCta","sourcePath":"components/marketing/StickyCta.jsx"},{"name":"TrustBand","sourcePath":"components/marketing/TrustBand.jsx"},{"name":"Breadcrumbs","sourcePath":"components/navigation/Breadcrumbs.jsx"},{"name":"Nav","sourcePath":"components/navigation/Nav.jsx"}],"sourceHashes":{"components/app/AppTopBar.jsx":"b5fa27f987f6","components/app/CapacityMeter.jsx":"9a01f61bcd5a","components/app/DockPanel.jsx":"12a9932b8e28","components/app/JobCard.jsx":"c9222f79593c","components/app/NavRail.jsx":"7e5188f57060","components/app/Segmented.jsx":"08899818f650","components/app/StatePill.jsx":"fe36975f7794","components/core/Badge.jsx":"7cbdd989390f","components/core/Button.jsx":"03632fb31a75","components/core/Card.jsx":"93aaed3d8ef0","components/core/Icon.jsx":"6e56e347a206","components/core/Input.jsx":"e438a4c70368","components/core/Logo.jsx":"ddc89f8d7b0e","components/core/MonoLabel.jsx":"6fc693ec75d6","components/core/Stars.jsx":"73a3fe36fd61","components/core/StatusPill.jsx":"68e96533cd13","components/marketing/FaqItem.jsx":"ffa2b764bfa7","components/marketing/ProductTile.jsx":"6b1064236e8d","components/marketing/ProofCard.jsx":"55d1cd59efa4","components/marketing/SectionHead.jsx":"731151ab2056","components/marketing/StickyCta.jsx":"7ceaa64c69ba","components/marketing/TrustBand.jsx":"3802fb08ef84","components/navigation/Breadcrumbs.jsx":"ba07ea2719aa","components/navigation/Nav.jsx":"b0f611377d77","icorrect/Careers.jsx":"1009ab2e6e57","icorrect/CaseStudy.jsx":"21a4cb53d6dd","icorrect/Corporate.jsx":"545a8e96ab0f","icorrect/HeroDiagnose.jsx":"6c6624c99298","icorrect/Heros.jsx":"3fd37c0b1259","icorrect/Homepage.jsx":"b160122ea0d5","icorrect/HomepageSections.jsx":"9d6ae6aab895","icorrect/HowItWorks.jsx":"948b40f78ccb","icorrect/InfoSections.jsx":"27640c88af01","icorrect/MacBookRepairs.jsx":"3d77b83acd13","icorrect/Placeholders.jsx":"ea51c0e93161","icorrect/Shell.jsx":"70c42b9233f5","icorrect/UniversalWizard.jsx":"d9e4ad9f9c89","icorrect/WhyUs.jsx":"f68a1af95154","icorrect/Wizard.jsx":"b167b287f94b","icorrect/diagnose-data.jsx":"00bd1e1fd1db","icorrect/diagnose-trees.jsx":"ffd1f93e2219","icorrect/tweaks-panel.jsx":"82c387552588","icorrect/wizard-catalog.jsx":"31115302e77c","image-slot.js":"5ade9426e255","ios-frame.jsx":"d67eb3ffe562","qw/QuoteWizard.jsx":"e91e28dfb2a8","qw/ServiceMapper.jsx":"357295e16bf7","qw/data.js":"f426ca0840d8","ui_kits/website/Components.jsx":"a2a0c867b1f8","ui_kits/website/Sections.jsx":"b75dc5b5e71d","ui_kits/workshop-os/QueueBoard.jsx":"98ad43e8f750"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.ICorrectDesignSystem_ddcb23 = window.ICorrectDesignSystem_ddcb23 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/app/AppTopBar.jsx
try { (() => {
/** Translucent app header: mono lane eyebrow, day stepper, live clock pill, right-hand controls. */
function AppTopBar({
  eyebrow,
  title,
  onPrev,
  onNext,
  live = true,
  clock = "",
  children
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0,
      background: "rgba(255,255,255,0.9)",
      backdropFilter: "blur(10px)",
      boxShadow: "rgba(0,0,0,0.08) 0 1px 0 0",
      padding: "12px 24px",
      display: "flex",
      alignItems: "center",
      gap: 16,
      zIndex: 4
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: 0
    }
  }, eyebrow ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "#808080"
    }
  }, eyebrow) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 10
    }
  }, onPrev ? /*#__PURE__*/React.createElement("button", {
    onClick: onPrev,
    style: {
      width: 26,
      height: 26,
      border: "none",
      background: "#fff",
      boxShadow: "rgb(235,235,235) 0 0 0 1px",
      borderRadius: 6,
      cursor: "pointer",
      color: "#4d4d4d",
      fontSize: 13
    }
  }, "\u2039") : null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 19,
      fontWeight: 600,
      letterSpacing: "-0.5px",
      whiteSpace: "nowrap"
    }
  }, title), onNext ? /*#__PURE__*/React.createElement("button", {
    onClick: onNext,
    style: {
      width: 26,
      height: 26,
      border: "none",
      background: "#fff",
      boxShadow: "rgb(235,235,235) 0 0 0 1px",
      borderRadius: 6,
      cursor: "pointer",
      color: "#4d4d4d",
      fontSize: 13
    }
  }, "\u203A") : null, live ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginLeft: 4,
      padding: "3px 9px",
      borderRadius: 9999,
      background: "#ecfdf5",
      boxShadow: "#a7f3d0 0 0 0 1px"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 9999,
      background: "#047857",
      animation: "icpulse 2s infinite"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      color: "#047857",
      letterSpacing: "0.04em"
    }
  }, "LIVE ", clock)) : null)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), children);
}
Object.assign(__ds_scope, { AppTopBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/AppTopBar.jsx", error: String((e && e.message) || e) }); }

// components/app/CapacityMeter.jsx
try { (() => {
/** Per-tech hands-on load bars. Lives inside the dark DockPanel. */
function CapacityMeter({
  techs = [],
  cap = 7
}) {
  return /*#__PURE__*/React.createElement("div", null, techs.map(t => {
    const pct = Math.min(100, t.hours / cap * 100);
    const over = t.hours > cap;
    const off = t.hours === 0;
    const col = off ? "#666" : over ? "#DB8A4D" : "#fff";
    return /*#__PURE__*/React.createElement("div", {
      key: t.name,
      style: {
        marginBottom: 11
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: 5,
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 500,
        color: off ? "#808080" : "#fff"
      }
    }, t.name), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 11,
        color: col,
        fontFeatureSettings: '"tnum"',
        whiteSpace: "nowrap"
      }
    }, off ? "off" : `${t.hours.toFixed(1)}/${cap}h`, over ? " \u26A0" : "")), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 5,
        borderRadius: 9999,
        background: "#333",
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        height: "100%",
        borderRadius: 9999,
        width: `${pct}%`,
        background: over ? "#DB8A4D" : "#fff"
      }
    })));
  }));
}
Object.assign(__ds_scope, { CapacityMeter });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/CapacityMeter.jsx", error: String((e && e.message) || e) }); }

// components/app/DockPanel.jsx
try { (() => {
/** A dockable side panel. tone="dark" for the capacity/authority panel. */
function DockPanel({
  title,
  dot,
  count,
  note,
  tone = "light",
  children,
  onDragOver,
  onDrop
}) {
  const dark = tone === "dark";
  return /*#__PURE__*/React.createElement("div", {
    onDragOver: onDragOver,
    onDrop: onDrop,
    style: {
      background: dark ? "#171717" : "#fff",
      boxShadow: dark ? "none" : "rgba(0,0,0,0.08) 0 0 0 1px",
      borderRadius: 10,
      padding: dark ? "14px 15px" : 14,
      color: dark ? "#fff" : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: note ? 4 : 10,
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      minWidth: 0
    }
  }, dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 7,
      height: 7,
      borderRadius: 9999,
      background: dot,
      flexShrink: 0
    }
  }) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      letterSpacing: "0.07em",
      textTransform: "uppercase",
      color: dark ? "#808080" : "#4d4d4d",
      fontWeight: 600
    }
  }, title)), count ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "#0068d6",
      background: "#ebf5ff",
      boxShadow: "#cce4ff 0 0 0 1px",
      padding: "1px 7px",
      borderRadius: 9999,
      whiteSpace: "nowrap"
    }
  }, count) : null), note ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#a3a3a3",
      marginBottom: 10
    }
  }, note) : null, children);
}
Object.assign(__ds_scope, { DockPanel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/DockPanel.jsx", error: String((e && e.message) || e) }); }

// components/app/NavRail.jsx
try { (() => {
/** The 78px WorkshopOS left rail: iC tile, icon+mono-label destinations, user avatar pinned bottom. */
const GLYPHS = {
  intake: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 13l3 0 1.8 2.4h6.4L17 13l3 0"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M6 13V6.5A1.5 1.5 0 0 1 7.5 5h9A1.5 1.5 0 0 1 18 6.5V13"
  })),
  queue: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
    x: "3.5",
    y: "5",
    width: "4.2",
    height: "14",
    rx: "1.2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "10",
    y: "5",
    width: "4.2",
    height: "10",
    rx: "1.2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "16.5",
    y: "5",
    width: "4.2",
    height: "14",
    rx: "1.2"
  })),
  qc: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M12 3l7 3v5c0 4.2-3 7.4-7 9-4-1.6-7-4.8-7-9V6z"
  }), /*#__PURE__*/React.createElement("polyline", {
    points: "9 12 11.3 14.3 15.3 10"
  })),
  tradeIn: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M4 9h13l-3.2-3.2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20 15H7l3.2 3.2"
  })),
  customers: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("circle", {
    cx: "9.5",
    cy: "9",
    r: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3.8 18.5c0-3 2.6-5 5.7-5s5.7 2 5.7 5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 6.5a3 3 0 0 1 0 5.8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M20.5 18.5c0-2.2-1.4-3.8-3.4-4.5"
  })),
  comms: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
    d: "M21 11.5a8.4 8.4 0 0 1-9 8.4 9.5 9.5 0 0 1-2.8-.4L4 21l1.5-4.2A8.3 8.3 0 0 1 3.6 11.5 8.4 8.4 0 0 1 12 3.1a8.4 8.4 0 0 1 9 8.4z"
  }))
};
function NavRail({
  items,
  active,
  user = "RN",
  userTitle = "Ronnie · ops lead",
  onSelect
}) {
  const list = items || [{
    id: "intake",
    label: "Intake",
    title: "Walk-in intake"
  }, {
    id: "queue",
    label: "Queue",
    title: "Repair queue"
  }, {
    id: "qc",
    label: "QC",
    title: "Quality control"
  }, {
    id: "tradeIn",
    label: "Trade-in",
    title: "Buy-back / trade-in"
  }, {
    id: "customers",
    label: "Customers",
    title: "Customers"
  }];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width: 78,
      flexShrink: 0,
      background: "#fff",
      boxShadow: "rgba(0,0,0,0.08) -1px 0 0 0 inset",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "14px 0",
      gap: 3,
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 34,
      height: 34,
      borderRadius: 9,
      background: "#171717",
      color: "#fff",
      fontFamily: "var(--font-mono)",
      fontWeight: 700,
      fontSize: 14,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      letterSpacing: "-0.5px",
      marginBottom: 12
    }
  }, "iC"), list.map(it => {
    const on = it.id === active;
    return /*#__PURE__*/React.createElement("div", {
      key: it.id,
      title: it.title || it.label,
      onClick: onSelect ? () => onSelect(it.id) : undefined,
      style: {
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 3,
        padding: on ? "8px 0" : "7px 0",
        cursor: "pointer",
        color: on ? "#171717" : "#a3a3a3",
        background: on ? "#f4f4f6" : undefined,
        boxShadow: on ? "rgb(235,235,235) 0 0 0 1px" : undefined,
        borderRadius: on ? 10 : undefined
      }
    }, /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }, GLYPHS[it.id] || GLYPHS.queue), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--font-mono)",
        fontSize: 8.5,
        letterSpacing: "0.02em",
        fontWeight: on ? 600 : 400
      }
    }, it.label));
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }), /*#__PURE__*/React.createElement("div", {
    title: userTitle,
    style: {
      width: 32,
      height: 32,
      borderRadius: 9999,
      background: "#ebebeb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: 11,
      fontWeight: 600,
      color: "#4d4d4d",
      cursor: "pointer"
    }
  }, user));
}
Object.assign(__ds_scope, { NavRail });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/NavRail.jsx", error: String((e && e.message) || e) }); }

// components/app/Segmented.jsx
try { (() => {
/** Compact view switcher. tone="dark" marks the authority control (mode), light for lenses. */
function Segmented({
  options = [],
  value,
  onChange,
  tone = "light",
  label
}) {
  const dark = tone === "dark";
  const seg = on => ({
    border: "none",
    cursor: "pointer",
    padding: "5px 11px",
    borderRadius: 6,
    fontFamily: "var(--font-sans)",
    fontSize: 12.5,
    fontWeight: on ? 600 : 500,
    letterSpacing: "-0.1px",
    background: on ? dark ? "#fff" : "#fff" : "transparent",
    color: on ? "#171717" : dark ? "#a3a3a3" : "#666",
    boxShadow: on && !dark ? "rgba(0,0,0,0.08) 0 1px 2px" : "none",
    transition: "background 140ms, color 140ms"
  });
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 7,
      padding: label ? "0 4px" : 0
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      letterSpacing: "0.06em",
      color: "#a3a3a3",
      textTransform: "uppercase"
    }
  }, label) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      background: dark ? "#171717" : "#f1f1f1",
      borderRadius: 8,
      padding: 3,
      gap: 2
    }
  }, options.map(o => /*#__PURE__*/React.createElement("button", {
    key: o,
    type: "button",
    onClick: onChange ? () => onChange(o) : undefined,
    style: seg(o === value)
  }, o))));
}
Object.assign(__ds_scope, { Segmented });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/Segmented.jsx", error: String((e && e.message) || e) }); }

// components/app/StatePill.jsx
try { (() => {
/** Job live-state badge. Must be unmistakable at wallboard distance. */
const STATES = {
  active: {
    glyph: "\u25B6",
    label: "Active",
    fg: "#047857",
    bg: "#ecfdf5",
    ring: "#a7f3d0"
  },
  paused: {
    glyph: "\u23F8",
    label: "Paused",
    fg: "#a96a00",
    bg: "#fef7e6",
    ring: "#f5deb0"
  },
  blocked: {
    glyph: "\u25A0",
    label: "Blocked",
    fg: "#C73838",
    bg: "#fdeceb",
    ring: "#f5c6c3"
  },
  atRisk: {
    glyph: "\u26A0",
    label: "At risk",
    fg: "#a96a00",
    bg: "#fef7e6",
    ring: "#f5deb0"
  },
  ready: {
    glyph: "\u25CB",
    label: "Ready",
    fg: "#0068d6",
    bg: "#ebf5ff",
    ring: "#cce4ff"
  },
  done: {
    glyph: "\u2713",
    label: "Done",
    fg: "#4d4d4d",
    bg: "#f4f4f6",
    ring: "#ebebeb"
  }
};
function StatePill({
  state = "active",
  children,
  reason,
  glyphOnly = false
}) {
  const s = STATES[state] || STATES.active;
  const label = glyphOnly ? null : children !== undefined ? children : s.label;
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 5,
      whiteSpace: "nowrap",
      padding: glyphOnly ? "3px 6px" : "2px 8px",
      borderRadius: 9999,
      background: s.bg,
      boxShadow: `${s.ring} 0 0 0 1px`,
      color: s.fg,
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      letterSpacing: "0.04em"
    }
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": glyphOnly ? undefined : "true",
    style: {
      fontSize: 8
    },
    title: glyphOnly ? s.label : undefined
  }, s.glyph), label, reason ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      opacity: 0.8
    }
  }, "\xB7 ", reason) : null);
}
Object.assign(__ds_scope, { StatePill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/StatePill.jsx", error: String((e && e.message) || e) }); }

// components/app/JobCard.jsx
try { (() => {
/**
 * The atomic draggable unit of WorkshopOS, at two densities.
 * standard = day-board columns · compact = wallboard and week blocks.
 */
function JobCard({
  density = "standard",
  queueNo,
  customer,
  device,
  model,
  type,
  state,
  reason,
  elapsed,
  standard,
  progress,
  eta,
  due,
  flags = [],
  tech,
  onClick,
  draggable = false,
  onDragStart
}) {
  const compact = density === "compact";
  return /*#__PURE__*/React.createElement("div", {
    draggable: draggable,
    onDragStart: onDragStart,
    onClick: onClick,
    style: {
      background: "#fff",
      boxShadow: "rgba(0,0,0,0.08) 0 0 0 1px",
      borderRadius: 8,
      padding: compact ? "8px 10px" : "11px 12px",
      cursor: draggable ? "grab" : onClick ? "pointer" : "default"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginBottom: 2,
      minWidth: 0
    }
  }, queueNo != null ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      fontWeight: 600,
      color: "#a3a3a3",
      flexShrink: 0
    }
  }, "#", queueNo) : null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: compact ? 12.5 : 13.5,
      fontWeight: 600,
      letterSpacing: "-0.2px",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0
    }
  }, customer || device), compact && state ? /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: "auto",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatePill, {
    state: state,
    glyphOnly: true
  })) : null), type ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12,
      color: "#171717",
      fontWeight: 500
    }
  }, type) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: 2
    }
  }, customer && device ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11,
      color: "#666"
    }
  }, device) : null, model ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      color: "#a3a3a3"
    }
  }, model) : null), !compact && state ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 7,
      display: "flex",
      flexWrap: "wrap",
      gap: 5,
      alignItems: "center",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.StatePill, {
    state: state
  }), reason ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "#666",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap",
      minWidth: 0
    }
  }, reason) : null) : null, elapsed && standard ? /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10.5,
      fontWeight: 600,
      color: "#171717",
      fontFeatureSettings: '"tnum"'
    }
  }, elapsed, " / ", standard), eta ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "#666"
    }
  }, "ETA ", eta) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 4,
      borderRadius: 9999,
      background: "#f1f1f1",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100%",
      borderRadius: 9999,
      width: `${Math.min(100, progress || 0)}%`,
      background: (progress || 0) > 100 ? "#a96a00" : "#171717"
    }
  }))) : null, flags.length || due ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 6,
      marginTop: 7,
      paddingTop: 7,
      boxShadow: "#f1f1f1 0 1px 0 0 inset",
      flexWrap: "wrap"
    }
  }, due ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: "#a96a00",
      fontWeight: 600
    }
  }, "Due ", due) : null, flags.map(fl => /*#__PURE__*/React.createElement("span", {
    key: fl,
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      letterSpacing: "0.05em",
      textTransform: "uppercase",
      color: "#4d4d4d",
      background: "#f4f4f6",
      padding: "2px 6px",
      borderRadius: 9999
    }
  }, fl)), tech ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      color: "#a3a3a3",
      marginLeft: "auto"
    }
  }, tech) : null) : null);
}
Object.assign(__ds_scope, { JobCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/app/JobCard.jsx", error: String((e && e.message) || e) }); }

// components/core/Badge.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Fully-rounded status pill. One accent per component — never a rainbow of badges. */
function Badge({
  variant = "ring",
  children,
  className = "",
  ...rest
}) {
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["badge", `badge-${variant}`, className].filter(Boolean).join(" ")
  }, rest), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * iCorrect button. Rings not borders; hover darkens (dark) or inverts (light).
 * Renders <a> when href is given, otherwise <button>.
 */
function Button({
  variant = "dark",
  size,
  arrow = false,
  href,
  disabled = false,
  onClick,
  children,
  className = "",
  ...rest
}) {
  const cls = ["btn", `btn-${variant}`, size ? `btn-${size}` : null, className].filter(Boolean).join(" ");
  const inner = /*#__PURE__*/React.createElement(React.Fragment, null, children, arrow ? /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)"
    }
  }, "\u2192") : null);
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    className: cls,
    href: href,
    onClick: onClick
  }, rest), inner);
  return /*#__PURE__*/React.createElement("button", _extends({
    className: cls,
    type: "button",
    disabled: disabled,
    onClick: onClick
  }, rest), inner);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/Card.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * Two tiers only: elevated (.card) and quiet (.card-ring).
 * Borders are box-shadow rings — a real CSS border is a bug in this system.
 */
function Card({
  tier = "elevated",
  hoverLift = false,
  as: Tag = "div",
  children,
  className = "",
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const base = tier === "quiet" ? "card-ring" : "card";
  const lift = hoverLift ? {
    transition: "transform 180ms cubic-bezier(0.16,1,0.3,1), box-shadow 180ms cubic-bezier(0.16,1,0.3,1)",
    transform: hover ? "translateY(-4px)" : "translateY(0)",
    boxShadow: hover ? "0 0 0 1px rgba(0,0,0,0.08), 0 4px 8px rgba(0,0,0,0.04), 0 16px 24px -8px rgba(0,0,0,0.08), inset 0 0 0 1px #fafafa" : undefined
  } : null;
  return /*#__PURE__*/React.createElement(Tag, _extends({
    className: [base, className].filter(Boolean).join(" "),
    style: {
      ...lift,
      ...style
    },
    onMouseEnter: hoverLift ? () => setHover(true) : undefined,
    onMouseLeave: hoverLift ? () => setHover(false) : undefined
  }, rest), children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Card.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The hand-authored iCorrect glyph set: currentColor, 1.5 stroke, round joins, 22–24px box.
 * No icon library is loaded — add new glyphs to this map and match the spec.
 */
const PATHS = {
  chip: {
    box: 22,
    body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "6",
      width: "10",
      height: "10",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.5 4.5V2M11 4.5V2M13.5 4.5V2M8.5 20V17.5M11 20V17.5M13.5 20V17.5M4.5 8.5H2M4.5 11H2M4.5 13.5H2M20 8.5H17.5M20 11H17.5M20 13.5H17.5"
    }))
  },
  shield: {
    box: 22,
    body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M11 2.5l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6l7-2.5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11l2.2 2.2L14.5 9"
    }))
  },
  display: {
    box: 22,
    body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "2.5",
      y: "3.5",
      width: "17",
      height: "11",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 18.5h6M11 14.5v4"
    }))
  },
  walkIn: {
    box: 24,
    body: /*#__PURE__*/React.createElement("path", {
      d: "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
    })
  },
  courier: {
    box: 24,
    body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "6",
      width: "22",
      height: "12",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v.01"
    }))
  },
  mail: {
    box: 24,
    body: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("path", {
      d: "M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 2v4M8 2v4M3 10h18"
    }))
  }
};
function Icon({
  name = "chip",
  size = 22,
  tile = false,
  tone,
  style,
  ...rest
}) {
  const glyph = PATHS[name] || PATHS.chip;
  const svg = /*#__PURE__*/React.createElement("svg", _extends({
    width: size,
    height: size,
    viewBox: `0 0 ${glyph.box} ${glyph.box}`,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round",
    strokeLinecap: "round",
    "aria-hidden": "true",
    style: tile ? undefined : style
  }, tile ? {} : rest), glyph.body);
  if (!tile) return svg;
  return /*#__PURE__*/React.createElement("span", _extends({
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      flexShrink: 0,
      background: tone === "warm" ? "var(--ic-orange-tint)" : "#fff",
      boxShadow: tone === "warm" ? "none" : "0 0 0 1px rgba(0,0,0,0.08)",
      color: "var(--fg-1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      ...style
    }
  }, rest), svg);
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Input.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Ringed field. Focus is always visible — never remove the outline. */
function Input({
  label,
  hint,
  invalid = false,
  mono = false,
  style,
  ...rest
}) {
  const field = {
    width: "100%",
    padding: "12px 14px",
    border: 0,
    borderRadius: 8,
    background: "#fff",
    boxShadow: invalid ? "0 0 0 1px var(--ic-red)" : "0 0 0 1px rgba(0,0,0,0.12)",
    font: mono ? "500 15px/1.2 var(--font-mono)" : "400 15px/1.2 var(--font-sans)",
    color: "var(--fg-1)",
    ...style
  };
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 6
    }
  }, label ? /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, label) : null, /*#__PURE__*/React.createElement("input", _extends({
    style: field
  }, rest)), hint ? /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 13px/1.4 var(--font-sans)",
      color: invalid ? "var(--ic-red)" : "var(--fg-3)"
    }
  }, hint) : null);
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Input.jsx", error: String((e && e.message) || e) }); }

// components/core/Logo.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * The iCorrect logo: the DIP-chip tile beside the wordmark ("2a" lockup), or the
 * chip alone ("3c" avatar cut). The markup is inlined from assets/logo.svg and
 * assets/logo-glyph.svg so the mark inherits currentColor and needs no asset path.
 */
const MARKS = {
  wordmark: {
    w: 186,
    h: 64,
    svg: `<mask id="tile-knockout">
    <rect x="8" y="6" width="48" height="52" fill="#fff"></rect>
    <circle cx="18" cy="21" r="2.6" fill="#000"></circle>
    <path fill="#000" d="M32.84 40L22.76 40L22.76 37.84L26.74 37.84L26.74 31.44L22.96 31.44L22.96 29.28L29.46 29.28L29.46 37.84L32.84 37.84L32.84 40ZM29.42 27.96L26.66 27.96L26.66 25.60L29.42 25.60L29.42 27.96ZM38.68 40.32L38.68 40.32Q36.96 40.32 35.74 39.42Q34.52 38.52 33.88 36.86Q33.24 35.20 33.24 32.92L33.24 32.92Q33.24 30.62 33.88 28.95Q34.52 27.28 35.74 26.38Q36.96 25.48 38.68 25.48L38.68 25.48Q40.76 25.48 42.10 26.85Q43.44 28.22 43.82 30.74L43.82 30.74L40.90 30.88Q40.68 29.48 40.09 28.74Q39.50 28 38.68 28L38.68 28Q37.46 28 36.81 29.28Q36.16 30.56 36.16 32.92L36.16 32.92Q36.16 35.26 36.81 36.53Q37.46 37.80 38.68 37.80L38.68 37.80Q39.54 37.80 40.15 37.01Q40.76 36.22 40.96 34.72L40.96 34.72L43.86 34.86Q43.52 37.46 42.16 38.89Q40.80 40.32 38.68 40.32Z"></path>
  </mask>
  <g mask="url(#tile-knockout)">
    <rect x="15" y="8" width="7" height="8" rx="1"></rect>
    <rect x="28.5" y="8" width="7" height="8" rx="1"></rect>
    <rect x="42" y="8" width="7" height="8" rx="1"></rect>
    <rect x="15" y="48" width="7" height="8" rx="1"></rect>
    <rect x="28.5" y="48" width="7" height="8" rx="1"></rect>
    <rect x="42" y="48" width="7" height="8" rx="1"></rect>
    <rect x="10" y="13" width="44" height="38" rx="8"></rect>
  </g>
  <path d="M75.94 43L72.10 43L72.10 26.98L75.94 26.98L75.94 43ZM76.03 24.85L72.04 24.85L72.04 21.43L76.03 21.43L76.03 24.85ZM87.63 43.48L87.63 43.48Q84.72 43.48 82.50 42.15Q80.28 40.81 79.02 38.34Q77.76 35.86 77.76 32.38L77.76 32.38Q77.76 28.96 78.99 26.46Q80.22 23.95 82.44 22.59Q84.66 21.22 87.66 21.22L87.66 21.22Q91.74 21.22 93.99 23.25Q96.24 25.27 96.93 28.90L96.93 28.90L92.85 29.11Q92.46 27.01 91.17 25.81Q89.88 24.61 87.66 24.61L87.66 24.61Q84.96 24.61 83.37 26.71Q81.78 28.81 81.78 32.38L81.78 32.38Q81.78 35.98 83.39 38.03Q84.99 40.09 87.63 40.09L87.63 40.09Q90 40.09 91.30 38.78Q92.61 37.48 92.97 35.20L92.97 35.20L97.05 35.41Q96.42 39.16 94.03 41.32Q91.65 43.48 87.63 43.48ZM105.65 43.36L105.65 43.36Q103.25 43.36 101.48 42.33Q99.71 41.29 98.73 39.41Q97.76 37.54 97.76 34.99L97.76 34.99Q97.76 32.44 98.73 30.57Q99.71 28.69 101.48 27.66Q103.25 26.62 105.65 26.62L105.65 26.62Q108.02 26.62 109.79 27.66Q111.56 28.69 112.53 30.57Q113.51 32.44 113.51 34.99L113.51 34.99Q113.51 37.54 112.53 39.41Q111.56 41.29 109.79 42.33Q108.02 43.36 105.65 43.36ZM105.65 40.24L105.65 40.24Q107.48 40.24 108.50 38.86Q109.52 37.48 109.52 34.99L109.52 34.99Q109.52 32.50 108.50 31.12Q107.48 29.74 105.65 29.74L105.65 29.74Q103.79 29.74 102.77 31.12Q101.75 32.50 101.75 34.99L101.75 34.99Q101.75 37.48 102.77 38.86Q103.79 40.24 105.65 40.24ZM119.02 43L115.18 43L115.18 26.98L118.78 26.98L118.87 30.10Q119.35 28.48 120.28 27.73Q121.21 26.98 122.71 26.98L122.71 26.98L124.18 26.98L124.18 30.28L122.68 30.28Q120.85 30.28 119.94 31.11Q119.02 31.93 119.02 33.76L119.02 33.76L119.02 43ZM129.69 43L125.85 43L125.85 26.98L129.45 26.98L129.54 30.10Q130.02 28.48 130.95 27.73Q131.88 26.98 133.38 26.98L133.38 26.98L134.85 26.98L134.85 30.28L133.35 30.28Q131.52 30.28 130.60 31.11Q129.69 31.93 129.69 33.76L129.69 33.76L129.69 43ZM143.45 43.36L143.45 43.36Q141.05 43.36 139.28 42.33Q137.51 41.29 136.55 39.40Q135.59 37.51 135.59 34.99L135.59 34.99Q135.59 32.47 136.55 30.58Q137.51 28.69 139.26 27.66Q141.02 26.62 143.36 26.62L143.36 26.62Q145.64 26.62 147.35 27.64Q149.06 28.66 150.00 30.58Q150.95 32.50 150.95 35.20L150.95 35.20L150.95 36.07L139.58 36.07Q139.67 38.17 140.72 39.23Q141.77 40.30 143.48 40.30L143.48 40.30Q146.09 40.30 146.81 38.08L146.81 38.08L150.74 38.32Q150.08 40.66 148.14 42.01Q146.21 43.36 143.45 43.36ZM139.58 33.49L139.58 33.49L146.99 33.49Q146.84 31.54 145.86 30.59Q144.89 29.65 143.36 29.65L143.36 29.65Q141.80 29.65 140.81 30.64Q139.82 31.63 139.58 33.49ZM159.61 43.36L159.61 43.36Q157.21 43.36 155.44 42.33Q153.67 41.29 152.69 39.40Q151.72 37.51 151.72 34.99L151.72 34.99Q151.72 32.47 152.69 30.58Q153.67 28.69 155.44 27.66Q157.21 26.62 159.61 26.62L159.61 26.62Q162.67 26.62 164.69 28.21Q166.72 29.80 167.08 32.65L167.08 32.65L163.12 32.86Q162.88 31.33 161.93 30.54Q160.99 29.74 159.61 29.74L159.61 29.74Q157.75 29.74 156.73 31.12Q155.71 32.50 155.71 34.99L155.71 34.99Q155.71 37.48 156.73 38.86Q157.75 40.24 159.61 40.24L159.61 40.24Q161.02 40.24 161.96 39.43Q162.91 38.62 163.12 36.91L163.12 36.91L167.08 37.09Q166.75 39.97 164.72 41.66Q162.70 43.36 159.61 43.36ZM178.29 43L174.87 43Q172.47 43 171.34 41.91Q170.22 40.81 170.22 38.41L170.22 38.41L170.22 29.95L167.70 29.95L167.70 26.98L170.22 26.98L170.22 23.23L174.06 23.23L174.06 26.98L178.29 26.98L178.29 29.95L174.06 29.95L174.06 38.05Q174.06 39.19 174.56 39.61Q175.05 40.03 176.04 40.03L176.04 40.03L178.29 40.03L178.29 43Z"></path>`
  },
  glyph: {
    w: 64,
    h: 64,
    svg: `<mask id="glyph-knockout">
    <rect x="0" y="0" width="64" height="64" fill="#fff"></rect>
    <path fill="#000" d="M31.77 42L18.67 42L18.67 39.19L23.84 39.19L23.84 30.87L18.93 30.87L18.93 28.06L27.38 28.06L27.38 39.19L31.77 39.19L31.77 42ZM27.33 26.35L23.74 26.35L23.74 23.28L27.33 23.28L27.33 26.35ZM39.40 42.42L39.40 42.42Q37.17 42.42 35.58 41.25Q34.00 40.08 33.16 37.92Q32.33 35.76 32.33 32.80L32.33 32.80Q32.33 29.81 33.16 27.63Q34.00 25.46 35.58 24.29Q37.17 23.12 39.40 23.12L39.40 23.12Q42.11 23.12 43.85 24.90Q45.59 26.69 46.09 29.96L46.09 29.96L42.29 30.14Q42.00 28.32 41.24 27.36Q40.47 26.40 39.40 26.40L39.40 26.40Q37.82 26.40 36.97 28.06Q36.13 29.73 36.13 32.80L36.13 32.80Q36.13 35.84 36.97 37.49Q37.82 39.14 39.40 39.14L39.40 39.14Q40.52 39.14 41.31 38.11Q42.11 37.09 42.37 35.14L42.37 35.14L46.14 35.32Q45.70 38.70 43.93 40.56Q42.16 42.42 39.40 42.42Z"></path>
  </mask>
  <g mask="url(#glyph-knockout)">
    <rect x="15" y="3" width="9" height="9" rx="2"></rect>
    <rect x="27.5" y="3" width="9" height="9" rx="2"></rect>
    <rect x="40" y="3" width="9" height="9" rx="2"></rect>
    <rect x="15" y="52" width="9" height="9" rx="2"></rect>
    <rect x="27.5" y="52" width="9" height="9" rx="2"></rect>
    <rect x="40" y="52" width="9" height="9" rx="2"></rect>
    <rect x="8" y="8" width="48" height="48" rx="10"></rect>
  </g>`
  }
};
function Logo({
  variant = "wordmark",
  height = 28,
  style,
  ...rest
}) {
  const m = MARKS[variant] || MARKS.wordmark;
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: `0 0 ${m.w} ${m.h}`,
    height: height,
    width: Math.round(height * m.w / m.h),
    fill: "currentColor",
    role: "img",
    "aria-label": "iCorrect",
    style: {
      display: "block",
      flexShrink: 0,
      ...style
    },
    dangerouslySetInnerHTML: {
      __html: m.svg
    }
  }, rest));
}
Object.assign(__ds_scope, { Logo });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Logo.jsx", error: String((e && e.message) || e) }); }

// components/core/MonoLabel.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The workshop tag: mono, uppercase, 0.04em tracking. Used for eyebrows, labels and metadata. */
function MonoLabel({
  dot = false,
  tone = "muted",
  children,
  className = "",
  style,
  ...rest
}) {
  const color = tone === "strong" ? "var(--fg-1)" : tone === "blue" ? "var(--ic-blue)" : "var(--fg-3)";
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["mono-label", className].filter(Boolean).join(" "),
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      color,
      ...style
    }
  }, rest), dot ? /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 6,
      borderRadius: 9999,
      background: "currentColor",
      flexShrink: 0
    }
  }) : null, children);
}
Object.assign(__ds_scope, { MonoLabel });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/MonoLabel.jsx", error: String((e && e.message) || e) }); }

// components/core/Stars.jsx
try { (() => {
const PATH = "M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z";

/** Monochrome rating stars (--ic-star). Supports fractional fill. */
function Stars({
  rating = 4.9,
  size = 14,
  showValue = false
}) {
  const id = React.useId ? React.useId() : "ic-stars";
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      alignItems: "center",
      gap: 6
    },
    "aria-label": `${rating} out of 5`
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-flex",
      gap: 2,
      color: "var(--ic-star)"
    }
  }, [0, 1, 2, 3, 4].map(i => {
    const fill = Math.max(0, Math.min(1, rating - i));
    const clip = `${id}-${i}`;
    return /*#__PURE__*/React.createElement("svg", {
      key: i,
      width: size,
      height: size,
      viewBox: "0 0 14 14",
      "aria-hidden": "true"
    }, /*#__PURE__*/React.createElement("path", {
      d: PATH,
      fill: "var(--ds-gray-200)"
    }), fill > 0 ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("clipPath", {
      id: clip
    }, /*#__PURE__*/React.createElement("rect", {
      x: "0",
      y: "0",
      width: 14 * fill,
      height: "14"
    })), /*#__PURE__*/React.createElement("path", {
      d: PATH,
      fill: "currentColor",
      clipPath: `url(#${clip})`
    })) : null);
  })), showValue ? /*#__PURE__*/React.createElement("strong", {
    style: {
      font: "600 13px var(--font-sans)",
      color: "var(--fg-1)",
      fontFeatureSettings: '"tnum"'
    }
  }, rating) : null);
}
Object.assign(__ds_scope, { Stars });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Stars.jsx", error: String((e && e.message) || e) }); }

// components/core/StatusPill.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** The nav's "Open · Fitzrovia" indicator — mono uppercase with a glowing dot. */
function StatusPill({
  state = "open",
  children = "Open · Fitzrovia",
  className = "",
  ...rest
}) {
  const dot = state === "open" ? "#16a34a" : state === "closed" ? "var(--fg-4)" : "var(--ic-orange)";
  const glow = state === "open" ? "0 0 0 3px rgba(22,163,74,0.18)" : "none";
  return /*#__PURE__*/React.createElement("span", _extends({
    className: ["icnav-status", className].filter(Boolean).join(" ")
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "icnav-status-dot",
    style: {
      background: dot,
      boxShadow: glow
    }
  }), children);
}
Object.assign(__ds_scope, { StatusPill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/StatusPill.jsx", error: String((e && e.message) || e) }); }

// components/marketing/FaqItem.jsx
try { (() => {
/** Hairline-separated disclosure row. The + rotates 45° to an × when open. */
function FaqItem({
  question,
  children,
  defaultOpen = false
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return /*#__PURE__*/React.createElement("div", {
    className: "faq-item" + (open ? " open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-q",
    role: "button",
    tabIndex: 0,
    onClick: () => setOpen(!open),
    onKeyDown: e => (e.key === "Enter" || e.key === " ") && (e.preventDefault(), setOpen(!open))
  }, question, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "faq-a"
  }, children));
}
Object.assign(__ds_scope, { FaqItem });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/FaqItem.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ProductTile.jsx
try { (() => {
/** Muted catalogue tile. Hover just darkens the ring — no lift, no shadow. */
function ProductTile({
  name,
  price,
  image,
  href = "#"
}) {
  const [hover, setHover] = React.useState(false);
  return /*#__PURE__*/React.createElement("a", {
    className: "pg-item",
    href: href,
    style: {
      boxShadow: hover ? "0 0 0 1px rgba(0,0,0,0.2)" : undefined
    },
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false)
  }, /*#__PURE__*/React.createElement("div", {
    className: "pg-thumb"
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: "",
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      borderRadius: 6,
      display: "block"
    }
  }) : /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, "No image")), /*#__PURE__*/React.createElement("span", {
    className: "pg-name"
  }, name), price ? /*#__PURE__*/React.createElement("span", {
    className: "pg-price"
  }, price) : null);
}
Object.assign(__ds_scope, { ProductTile });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ProductTile.jsx", error: String((e && e.message) || e) }); }

// components/marketing/ProofCard.jsx
try { (() => {
/** The signature proof card: dark-framed bench photo, a mono tag, and the Apple-quote vs our-price contrast. */
function ProofCard({
  image,
  alt = "",
  tag = "Fixed · 4 days",
  quote,
  theirLabel = "Apple quote",
  theirPrice,
  ourLabel = "iCorrect",
  ourPrice
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "card",
    style: {
      padding: 0,
      overflow: "hidden",
      borderRadius: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "relative",
      background: "#0a0a0a",
      aspectRatio: "4 / 3"
    }
  }, image ? /*#__PURE__*/React.createElement("img", {
    src: image,
    alt: alt,
    style: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      display: "block"
    }
  }) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      inset: 0,
      background: "linear-gradient(180deg, rgba(0,0,0,0.45) 0%, transparent 30%, transparent 65%, rgba(0,0,0,0.55) 100%)"
    }
  }), tag ? /*#__PURE__*/React.createElement("span", {
    style: {
      position: "absolute",
      top: 14,
      left: 14,
      padding: "5px 10px",
      borderRadius: 9999,
      background: "rgba(255,255,255,0.92)",
      font: "500 11px/1 var(--font-mono)",
      textTransform: "uppercase",
      letterSpacing: "0.04em",
      color: "var(--ic-green-text)"
    }
  }, tag) : null), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: 24,
      display: "flex",
      flexDirection: "column",
      gap: 20
    }
  }, quote ? /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 16px/1.55 var(--font-sans)",
      color: "var(--fg-1)",
      margin: 0
    }
  }, quote) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, theirLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 26px/1 var(--font-sans)",
      letterSpacing: "-1px",
      color: "var(--fg-4)",
      textDecoration: "line-through",
      fontFeatureSettings: '"tnum"'
    }
  }, theirPrice)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label"
  }, ourLabel), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "600 26px/1 var(--font-sans)",
      letterSpacing: "-1px",
      color: "var(--fg-1)",
      fontFeatureSettings: '"tnum"'
    }
  }, ourPrice)))));
}
Object.assign(__ds_scope, { ProofCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/ProofCard.jsx", error: String((e && e.message) || e) }); }

// components/marketing/SectionHead.jsx
try { (() => {
/** Two-column section head: title left, lede right. Collapses to one column under 880px. */
function SectionHead({
  eyebrow,
  title,
  lede,
  children
}) {
  const [narrow, setNarrow] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 880px)");
    const on = () => setNarrow(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: narrow ? "1fr" : "minmax(0,1fr) minmax(0,1fr)",
      gap: narrow ? 16 : 48,
      alignItems: "end",
      marginBottom: 40
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, eyebrow ? /*#__PURE__*/React.createElement(__ds_scope.MonoLabel, null, eyebrow) : null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0
    }
  }, title)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16,
      alignItems: "flex-start"
    }
  }, lede ? /*#__PURE__*/React.createElement("p", {
    className: "t-body-md",
    style: {
      maxWidth: 520
    }
  }, lede) : null, children));
}
Object.assign(__ds_scope, { SectionHead });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/SectionHead.jsx", error: String((e && e.message) || e) }); }

// components/marketing/StickyCta.jsx
try { (() => {
/** Mobile-only bar that slides up from the bottom past a scroll threshold. */
function StickyCta({
  label = "Get a quote",
  threshold = 400,
  onClick,
  href
}) {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => {
    const on = () => setVisible(window.scrollY > threshold);
    on();
    window.addEventListener("scroll", on, {
      passive: true
    });
    return () => window.removeEventListener("scroll", on);
  }, [threshold]);
  const cls = "sticky-cta" + (visible ? " visible" : "");
  if (href) return /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: href,
    style: {
      display: undefined
    }
  }, label);
  return /*#__PURE__*/React.createElement("button", {
    className: cls,
    type: "button",
    onClick: onClick
  }, label);
}
Object.assign(__ds_scope, { StickyCta });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/StickyCta.jsx", error: String((e && e.message) || e) }); }

// components/marketing/TrustBand.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function Item({
  icon,
  title,
  sub,
  first
}) {
  return /*#__PURE__*/React.createElement("li", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: first ? "8px 14px 8px 6px" : "8px 14px",
      position: "relative"
    }
  }, !first ? /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: "14%",
      bottom: "14%",
      width: 1,
      background: "rgba(0,0,0,0.08)"
    }
  }) : null, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    tile: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      font: "600 13px var(--font-sans)",
      letterSpacing: "-0.2px",
      color: "var(--fg-1)",
      lineHeight: 1.25
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px/1.35 var(--font-sans)",
      color: "var(--fg-3)"
    }
  }, sub)));
}

/** Four-up #fafafa proof band that sits directly under the hero. */
function TrustBand({
  rating = 4.9,
  reviewCount = 719,
  items
}) {
  const cells = items || [{
    icon: "display",
    title: "Apple parts",
    sub: "Calibrated in-house"
  }, {
    icon: "chip",
    title: "Microsoldering",
    sub: "Board-level repairs"
  }, {
    icon: "shield",
    title: "2-yr warranty",
    sub: "Double the standard"
  }];
  return /*#__PURE__*/React.createElement("section", {
    style: {
      padding: "20px 0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("ul", {
    role: "list",
    style: {
      listStyle: "none",
      margin: 0,
      padding: 18,
      display: "grid",
      gridTemplateColumns: `repeat(${cells.length + 1}, 1fr)`,
      gap: 8,
      background: "#fafafa",
      borderRadius: 14,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.06)"
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: "8px 14px 8px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 30px var(--font-sans)",
      letterSpacing: "-1.2px",
      color: "var(--fg-1)",
      fontFeatureSettings: '"tnum"',
      lineHeight: 1
    }
  }, rating), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Stars, {
    rating: rating
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px var(--font-sans)",
      color: "var(--fg-3)",
      whiteSpace: "nowrap"
    }
  }, reviewCount, " Google reviews"))), cells.map((c, i) => /*#__PURE__*/React.createElement(Item, _extends({
    key: c.title
  }, c))))));
}
Object.assign(__ds_scope, { TrustBand });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/marketing/TrustBand.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Breadcrumbs.jsx
try { (() => {
/** Mono uppercase breadcrumb trail for collection and detail pages. */
function Breadcrumbs({
  items = []
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "crumbs container"
  }, items.map((it, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 ? /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/") : null, it.href && i < items.length - 1 ? /*#__PURE__*/React.createElement("a", {
    href: it.href
  }, it.label) : /*#__PURE__*/React.createElement("span", {
    style: {
      color: i === items.length - 1 ? "var(--fg-1)" : undefined
    }
  }, it.label))));
}
Object.assign(__ds_scope, { Breadcrumbs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Breadcrumbs.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Nav.jsx
try { (() => {
/** Sticky translucent site header with backdrop blur. */
function Nav({
  links = ["Repairs", "Diagnostic", "Specialist", "How it works", "Workshop"],
  cta = "Get a quote",
  showStatus = true,
  active
}) {
  return /*#__PURE__*/React.createElement("nav", {
    className: "icnav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container icnav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "icnav-logo",
    href: "#",
    style: {
      display: "inline-flex",
      alignItems: "center"
    },
    "aria-label": "iCorrect"
  }, /*#__PURE__*/React.createElement(__ds_scope.Logo, {
    height: 26
  })), /*#__PURE__*/React.createElement("div", {
    className: "icnav-links"
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    href: "#",
    style: l === active ? {
      color: "var(--fg-1)"
    } : undefined
  }, l))), showStatus ? /*#__PURE__*/React.createElement(__ds_scope.StatusPill, null) : null, /*#__PURE__*/React.createElement("a", {
    className: "icnav-cta",
    href: "#wizard"
  }, cta, " ", /*#__PURE__*/React.createElement("span", null, "\u2192"))));
}
Object.assign(__ds_scope, { Nav });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Nav.jsx", error: String((e && e.message) || e) }); }

// icorrect/Careers.jsx
try { (() => {
// Careers page — all section components
// Voice: professional, structured, direct. Speak to skilled technicians and ops talent.

function CareersBreadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "Careers")));
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
function CareersHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "careers-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Careers at iCorrect"), /*#__PURE__*/React.createElement("h1", null, "Repair what others replace."), /*#__PURE__*/React.createElement("p", null, "We're a specialist Apple repair team in Fitzrovia, London \u2014 working at component level on devices the manufacturers write off. If you want to do precise, meaningful work with a growing team, we're hiring."), /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#careers-apply",
    className: "btn btn-dark btn-lg"
  }, "Apply now \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#careers-roles",
    className: "btn btn-lg",
    style: {
      background: "rgba(0,0,0,0.04)",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.1)"
    }
  }, "View open roles"))), /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "5"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Open roles")), /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "11"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Years trading")), /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "40k+"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Devices repaired")), /*#__PURE__*/React.createElement("div", {
    className: "careers-hero-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "W1"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Central London")))));
}

/* ── Why work here ─────────────────────────────────────────────────────── */
function CareersWhy() {
  const cards = [{
    title: "Competitive salary",
    body: "We pay well and review regularly. Skilled technicians and experienced operators are valued and compensated accordingly."
  }, {
    title: "Continuous training",
    body: "Stay at the cutting edge. We invest in ongoing training — from advanced microsoldering techniques to new Apple silicon architectures."
  }, {
    title: "Central London workshop",
    body: "Based in Fitzrovia, W1. Well-equipped workspace with professional-grade tooling, easy transport links, and a good team around you."
  }, {
    title: "Flexible hours",
    body: "Flexible scheduling for technical roles. We focus on output and quality, not clock-watching."
  }, {
    title: "Team culture",
    body: "Small team, low politics. Regular team events, direct communication, and a shared commitment to doing precise, high-quality work."
  }, {
    title: "Growing company",
    body: "We're scaling — expanding our corporate client base, building new services, and hiring across the board. Early joiners shape how we grow."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "careers-why"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Why iCorrect"), /*#__PURE__*/React.createElement("h2", null, "What we offer."), /*#__PURE__*/React.createElement("p", null, "We're building a team of specialists who take pride in doing work that most repair shops can't. Here's what that looks like day to day.")), /*#__PURE__*/React.createElement("div", {
    className: "careers-why-grid"
  }, cards.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "careers-why-card"
  }, /*#__PURE__*/React.createElement("h3", null, c.title), /*#__PURE__*/React.createElement("p", null, c.body))))));
}

/* ── Open roles ────────────────────────────────────────────────────────── */
const ROLES = [{
  title: "Advanced Microelectronics Technician",
  type: "Full-time",
  location: "Fitzrovia, London",
  dept: "Technical",
  responsibilities: ["Diagnose and repair faults at component level on Apple logic boards", "Use schematics, boardview data, and diagnostic tools to isolate failures", "Perform BGA rework, microsoldering, and reballing on current and legacy boards", "Document repair outcomes and maintain quality records", "Contribute to internal training and knowledge sharing"],
  requirements: ["Proven experience with board-level repair and microsoldering", "Ability to read schematics and use diagnostic equipment (multimeter, oscilloscope, thermal camera)", "Familiarity with Apple Mac and iPhone logic board architectures", "Attention to detail and a methodical approach to fault-finding", "Ability to work independently and manage a repair queue"]
}, {
  title: "MacBook Repair Technician",
  type: "Full-time",
  location: "Fitzrovia, London",
  dept: "Technical",
  responsibilities: ["Carry out MacBook repairs — screens, batteries, keyboards, trackpads, and ports", "Run diagnostics and triage incoming devices accurately", "Escalate board-level faults to the microelectronics team with clear notes", "Perform post-repair quality checks and stress testing", "Maintain a clean, organised workspace and follow intake procedures"],
  requirements: ["Experience with MacBook hardware repair (Pro and Air, Retina era onward)", "Comfortable disassembling and reassembling Apple portables to a high standard", "Basic understanding of macOS diagnostics and Apple hardware test tools", "Reliable, detail-oriented, and comfortable working to turnaround targets", "Training provided on advanced techniques — willingness to learn is essential"]
}, {
  title: "Operations Manager",
  type: "Full-time",
  location: "Fitzrovia, London",
  dept: "Operations",
  responsibilities: ["Oversee day-to-day workshop operations — intake, repair queue, dispatch, and logistics", "Manage and develop the operations and logistics team", "Coordinate with corporate clients on SLAs, bulk submissions, and reporting", "Improve internal processes — tracking, communication, and turnaround efficiency", "Report on KPIs including turnaround time, repair volume, and client satisfaction"],
  requirements: ["Experience in operations or service management, ideally in a technical or repair environment", "Strong organisational skills and the ability to manage competing priorities", "Comfortable with CRM and ticketing tools — experience with repair-specific platforms a plus", "Clear communicator who can work with technicians, clients, and suppliers", "A proactive mindset — you see problems before they become bottlenecks"]
}, {
  title: "Operations Assistant",
  type: "Full-time",
  location: "Fitzrovia, London",
  dept: "Operations",
  responsibilities: ["Support the operations manager with daily workshop coordination", "Log devices on intake — record serial numbers, faults, and client details", "Communicate with clients on repair status, quotes, and collection", "Prepare devices for dispatch and coordinate with courier partners", "Maintain accurate records across all active repairs"],
  requirements: ["Organised, reliable, and comfortable in a fast-paced environment", "Good written and verbal communication", "Basic familiarity with Apple products — technical knowledge a bonus, not required", "Experience in admin, customer service, or logistics preferred", "Keen to learn and grow into a broader operations role"]
}, {
  title: "Logistics Assistant",
  type: "Full-time",
  location: "Fitzrovia, London",
  dept: "Operations",
  responsibilities: ["Manage inbound and outbound shipments — booking couriers, printing labels, tracking parcels", "Coordinate with corporate clients on collection and return scheduling", "Ensure devices are securely packaged for transit", "Maintain the parts and consumables inventory — reorder when needed", "Support the operations team with ad-hoc tasks as the business grows"],
  requirements: ["Experience in logistics, warehouse, or dispatch — even if informal", "Comfortable with tracking systems and spreadsheets", "Physically able to handle parcels and keep a stockroom organised", "Reliable and punctual — logistics runs on timing", "A team player who communicates clearly when things change"]
}];
function CareersRoles() {
  const [openIndex, setOpenIndex] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    id: "careers-roles",
    className: "careers-roles"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Open positions"), /*#__PURE__*/React.createElement("h2", null, "Current roles."), /*#__PURE__*/React.createElement("p", null, "We're hiring across technical and operations. Every role is based at our Fitzrovia workshop in central London.")), /*#__PURE__*/React.createElement("div", {
    className: "careers-roles-list"
  }, ROLES.map((role, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `careers-role-card${openIndex === i ? " open" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-role-header",
    onClick: () => setOpenIndex(openIndex === i ? -1 : i)
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-role-header-left"
  }, /*#__PURE__*/React.createElement("h3", null, role.title), /*#__PURE__*/React.createElement("div", {
    className: "careers-role-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "careers-role-tag"
  }, role.type), /*#__PURE__*/React.createElement("span", {
    className: "careers-role-tag"
  }, role.dept), /*#__PURE__*/React.createElement("span", {
    className: "careers-role-tag"
  }, role.location))), /*#__PURE__*/React.createElement("div", {
    className: "careers-role-chevron"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 5l4 4 4-4"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "careers-role-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-role-body-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-role-section"
  }, /*#__PURE__*/React.createElement("h4", null, "What you'll do"), /*#__PURE__*/React.createElement("ul", null, role.responsibilities.map((r, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, r)))), /*#__PURE__*/React.createElement("div", {
    className: "careers-role-section"
  }, /*#__PURE__*/React.createElement("h4", null, "What we're looking for"), /*#__PURE__*/React.createElement("ul", null, role.requirements.map((r, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, r))), /*#__PURE__*/React.createElement("a", {
    href: "#careers-apply",
    className: "careers-role-apply-link"
  }, "Apply for this role \u2192")))))))));
}

/* ── Application form ──────────────────────────────────────────────────── */
function CareersApply() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    role: "",
    cover: ""
  });
  const [fileName, setFileName] = React.useState("");
  const update = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  const handleFile = e => {
    const f = e.target.files[0];
    if (f) setFileName(f.name);
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "careers-apply",
    className: "careers-apply"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container careers-apply-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Apply"), /*#__PURE__*/React.createElement("h2", null, "Interested? Let's talk."), /*#__PURE__*/React.createElement("p", null, "Send us your details and we'll be in touch within a few working days. No cover letter required \u2014 but if you want to tell us why you're a good fit, we'll read every word."), /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-email"
  }, "Prefer email? ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:careers@icorrect.co.uk"
  }, "careers@icorrect.co.uk")), /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-proof"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "We respond to every application")), /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Interview within 5 working days")), /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "No recruitment agencies")), /*#__PURE__*/React.createElement("div", {
    className: "careers-apply-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Training provided for the right candidate")))), /*#__PURE__*/React.createElement("form", {
    className: "careers-form",
    onSubmit: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Full name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: form.name,
    onChange: update("name"),
    placeholder: "Alex Johnson"
  })), /*#__PURE__*/React.createElement("div", {
    className: "careers-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: form.email,
    onChange: update("email"),
    placeholder: "alex@email.com"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "careers-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Phone"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    value: form.phone,
    onChange: update("phone"),
    placeholder: "+44 7700 000000"
  })), /*#__PURE__*/React.createElement("div", {
    className: "careers-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Role"), /*#__PURE__*/React.createElement("select", {
    value: form.role,
    onChange: update("role")
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select a role"), ROLES.map((r, i) => /*#__PURE__*/React.createElement("option", {
    key: i,
    value: r.title
  }, r.title))))), /*#__PURE__*/React.createElement("div", {
    className: "careers-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-form-field full"
  }, /*#__PURE__*/React.createElement("label", null, "CV / Resume"), /*#__PURE__*/React.createElement("div", {
    className: `careers-cv-upload${fileName ? " has-file" : ""}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "file",
    accept: ".pdf,.doc,.docx",
    onChange: handleFile
  }), /*#__PURE__*/React.createElement("div", {
    className: "upload-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "16",
    height: "16",
    viewBox: "0 0 16 16",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8 12V3M4 7l4-4 4 4"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M2 13h12"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "upload-text"
  }, fileName || "Drop your CV here or click to browse"), /*#__PURE__*/React.createElement("span", {
    className: "upload-hint"
  }, "PDF or Word \xB7 5MB max")))), /*#__PURE__*/React.createElement("div", {
    className: "careers-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "careers-form-field full"
  }, /*#__PURE__*/React.createElement("label", null, "Cover note (optional)"), /*#__PURE__*/React.createElement("textarea", {
    rows: "4",
    value: form.cover,
    onChange: update("cover"),
    placeholder: "Tell us a bit about yourself \u2014 your experience, what interests you about iCorrect, or anything else you'd like us to know."
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn"
  }, "Submit application \u2192"))));
}
Object.assign(window, {
  CareersBreadcrumb,
  CareersHero,
  CareersWhy,
  CareersRoles,
  CareersApply,
  ROLES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Careers.jsx", error: String((e && e.message) || e) }); }

// icorrect/CaseStudy.jsx
try { (() => {
// === Repair Case Study page components ===
// One worked example: "Apple quoted £1,400. We fixed it for £380."
// Template is generic — swap the data object for any repair.

const CASE = {
  id: "2026-0418",
  tag: "Case study",
  device: "MacBook Pro 14\" (M1 Pro)",
  model: "A2442",
  fault: "Backlight IC failure",
  outcome: "Repaired",
  title: "Apple quoted £1,400 for a logic board. We replaced one chip for £380.",
  lede: "A 2021 MacBook Pro came in with a black screen — fans running, keyboard lit, external monitor fine. Apple's Genius Bar diagnosed it as a logic-board failure and quoted £1,400 for a full replacement. We found a single failed backlight IC and microsoldered a new one in four days.",
  appleQuote: "£1,400",
  icorrectPrice: "£380",
  saving: "73%",
  turnaround: "4 days",
  warranty: "2 years",
  date: "April 2026",
  technician: "R. Sheridan",
  tags: ["Microsoldering", "Backlight IC", "MacBook Pro", "Board-level"],
  steps: [{
    num: "01",
    title: "Intake and initial triage",
    body: "Customer walked in with a MacBook Pro 14\" (A2442, M1 Pro, 2021). Complaint: black screen, no image at all. External monitor worked fine via USB-C. Apple had quoted a full logic-board replacement at £1,400 — customer wanted a second opinion.",
    meta: [["Time", "15 min"], ["Status", "Intake"]],
    imageTag: "S1 · Intake",
    imagePlaceholder: "Photo: MacBook on intake bench"
  }, {
    num: "02",
    title: "Board-level diagnosis under the scope",
    body: "Removed the bottom case and connected the board to our DC power supply. Current draw was normal at 0.3A — the board was alive, just not driving the backlight. Probed the backlight power rail with a multimeter: 0V at the connector. Traced upstream to U7600, the backlight boost IC. Cold solder joint visible under 40× magnification.",
    meta: [["Time", "45 min"], ["Tool", "Stereo microscope · 40×"]],
    imageTag: "S2 · Diagnosis",
    imagePlaceholder: "Photo: Board under microscope, IC circled"
  }, {
    num: "03",
    title: "Backlight IC removal and replacement",
    body: "Applied flux paste around U7600 and reflowed with hot air at 380°C for 12 seconds. Removed the failed IC with vacuum tweezers. Cleaned the pads with solder wick and IPA. Placed a new LP8548 backlight driver IC from stock, reflowed, and inspected the joints under the scope.",
    meta: [["Time", "1.5 hrs"], ["Temp", "380°C reflow"], ["Part", "LP8548"]],
    imageTag: "S3 · Microsoldering",
    imagePlaceholder: "Photo: IC removal under hot air"
  }, {
    num: "04",
    title: "Backlight rail verification",
    body: "Powered the board on the bench (no screen attached). Measured the backlight rail at the display connector: 48.2V — within spec. Connected a test display: full brightness, all dimming zones active, no flicker. The repair was holding.",
    meta: [["Voltage", "48.2V (spec: 48V)"], ["Result", "Pass"]],
    imageTag: "S4 · Verification",
    imagePlaceholder: "Photo: Multimeter reading on backlight rail"
  }, {
    num: "05",
    title: "Full reassembly and QA pass",
    body: "Reconnected the original display, battery, and all flex cables. Ran our 30-point QA checklist: True Tone calibration, brightness uniformity across all zones, keyboard, speakers, camera, Wi-Fi throughput, trackpad. Every test passed.",
    meta: [["Tests", "30-point QA"], ["True Tone", "Preserved"]],
    imageTag: "S5 · QA",
    imagePlaceholder: "Photo: QA checklist on screen"
  }, {
    num: "06",
    title: "Returned to customer",
    body: "MacBook returned fully assembled with a printed QA report and a 2-year warranty card covering the backlight IC, labour, and any rework. Total time on bench: 4 working days including parts sourcing. Customer saved £1,020 versus the Apple quote.",
    meta: [["Turnaround", "4 days"], ["Warranty", "2 years"]],
    imageTag: "S6 · Complete",
    imagePlaceholder: "Photo: MacBook powered on, ready for collection"
  }],
  eliminated: ["External monitor works → GPU and display controller alive", "Current draw normal → no short-circuit, board is powered", "Backlight rail at 0V → fault is upstream of the display", "U7600 cold joint visible → root cause identified at IC level", "New IC + 48.2V on rail → repair confirmed before reassembly"],
  related: [{
    tag: "Liquid damage",
    title: "Coffee spill recovery — MBA 13\" M1",
    meta: "6 days · £420 · 100% data recovered",
    href: "#"
  }, {
    tag: "Touch ID",
    title: "T2 pairing fault after third-party screen swap",
    meta: "2 days · £190 · Fingerprint unlock restored",
    href: "#"
  }, {
    tag: "Stage Light",
    title: "Flexgate repair on MBP 15\" 2017",
    meta: "3 days · £280 · Flex cable replaced",
    href: "#"
  }]
};
function CaseStudyHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "cs-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container cs-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "cs-hero-eyebrow"
  }, CASE.tag, " \xB7 ", CASE.id), /*#__PURE__*/React.createElement("h1", null, CASE.title), /*#__PURE__*/React.createElement("p", {
    className: "cs-hero-lede"
  }, CASE.lede), /*#__PURE__*/React.createElement("div", {
    className: "cs-outcome-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-outcome-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-outcome-label"
  }, "Apple quote"), /*#__PURE__*/React.createElement("span", {
    className: "cs-outcome-value strike"
  }, CASE.appleQuote)), /*#__PURE__*/React.createElement("div", {
    className: "cs-outcome-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-outcome-label"
  }, "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "cs-outcome-value green"
  }, CASE.icorrectPrice)), /*#__PURE__*/React.createElement("div", {
    className: "cs-outcome-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-outcome-label"
  }, "Saving"), /*#__PURE__*/React.createElement("span", {
    className: "cs-outcome-value"
  }, CASE.saving))), /*#__PURE__*/React.createElement("div", {
    className: "cs-meta-row"
  }, CASE.tags.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    className: "cs-meta-tag"
  }, t)))), /*#__PURE__*/React.createElement("div", {
    className: "cs-hero-image"
  }, /*#__PURE__*/React.createElement("img", {
    className: "cs-photo",
    src: "uploads/repair-rework.jpg",
    alt: "Microsoldering the backlight IC on a MacBook Pro logic board"
  }), /*#__PURE__*/React.createElement("span", {
    className: "cs-hero-image-tag resolved"
  }, "Resolved \xB7 ", CASE.turnaround))));
}
function CaseStudySteps() {
  const STEP_PHOTOS = {
    "01": "uploads/repair-teardown.jpg",
    "02": "uploads/repair-scope.jpg",
    "03": "uploads/repair-rework.jpg",
    "04": "uploads/repair-boardview.jpg",
    "05": "uploads/repair-scope.jpg",
    "06": "uploads/repair-teardown.jpg"
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "cs-steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-steps-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-hero-eyebrow"
  }, "Repair log \xB7 ", CASE.steps.length, " steps"), /*#__PURE__*/React.createElement("h2", null, "What we actually did.")), CASE.steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "cs-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-step-num"
  }, s.num), /*#__PURE__*/React.createElement("div", {
    className: "cs-step-text"
  }, /*#__PURE__*/React.createElement("h3", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body), /*#__PURE__*/React.createElement("div", {
    className: "cs-step-meta"
  }, s.meta.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    className: "cs-step-meta-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-step-meta-key"
  }, k), /*#__PURE__*/React.createElement("span", {
    className: "cs-step-meta-val"
  }, v))))), /*#__PURE__*/React.createElement("div", {
    className: "cs-step-image"
  }, /*#__PURE__*/React.createElement("img", {
    className: "cs-photo",
    src: STEP_PHOTOS[s.num],
    alt: s.title
  }), /*#__PURE__*/React.createElement("div", {
    className: "cs-step-image-tag"
  }, s.imageTag))))));
}
function CaseStudyDiagnosis() {
  return /*#__PURE__*/React.createElement("section", {
    className: "cs-diagnosis"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-diagnosis-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "cs-diagnosis-card"
  }, /*#__PURE__*/React.createElement("h3", null, "Diagnosis summary"), /*#__PURE__*/React.createElement("p", null, "A single failed backlight boost IC (LP8548 / U7600) was preventing the internal display from receiving power. The GPU, display panel, flex cables, and all other components were functional. Apple's standard procedure replaces the entire logic board for this fault because they don't perform component-level repair. We replaced the one chip."), /*#__PURE__*/React.createElement("table", {
    className: "cs-diagnosis-table"
  }, /*#__PURE__*/React.createElement("tbody", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Root cause"), /*#__PURE__*/React.createElement("td", null, "Cold solder joint on U7600 (backlight boost IC)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Repair"), /*#__PURE__*/React.createElement("td", null, "IC removal + replacement (LP8548) via hot-air reflow")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Parts cost"), /*#__PURE__*/React.createElement("td", null, "~\xA312 (IC) + consumables")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Apple approach"), /*#__PURE__*/React.createElement("td", null, "Full logic-board replacement (\xA31,400)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Our approach"), /*#__PURE__*/React.createElement("td", null, "Component-level microsoldering (\xA3380)")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Warranty"), /*#__PURE__*/React.createElement("td", null, "2 years \u2014 part, labour, rework")), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Technician"), /*#__PURE__*/React.createElement("td", null, CASE.technician)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, "Date"), /*#__PURE__*/React.createElement("td", null, CASE.date))))), /*#__PURE__*/React.createElement("div", {
    className: "cs-eliminated"
  }, /*#__PURE__*/React.createElement("h3", null, "What we eliminated to get here"), /*#__PURE__*/React.createElement("ul", {
    className: "cs-eliminated-list"
  }, CASE.eliminated.map((e, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "cs-eliminated-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-eliminated-check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, e))))))));
}
function CaseStudyCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "cs-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container cs-cta-inner"
  }, /*#__PURE__*/React.createElement("h2", null, "Same problem? Let's fix it."), /*#__PURE__*/React.createElement("p", null, "If your MacBook has a black screen but fans still run, it's likely the same fault. Get a quote in 60 seconds or book a free pre-diagnosis."), /*#__PURE__*/React.createElement("div", {
    className: "cs-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "iCorrect Homepage.html#wizard",
    className: "cs-cta-btn cs-cta-primary"
  }, "Get a quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "iCorrect Homepage.html#diagnose",
    className: "cs-cta-btn cs-cta-secondary"
  }, "Help me diagnose \u2192"))));
}
function CaseStudyRelated() {
  return /*#__PURE__*/React.createElement("section", {
    className: "cs-related"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("h2", null, "More from the bench."), /*#__PURE__*/React.createElement("div", {
    className: "cs-related-grid"
  }, CASE.related.map((r, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    href: r.href,
    className: "cs-related-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "cs-related-tag"
  }, r.tag), /*#__PURE__*/React.createElement("span", {
    className: "cs-related-title"
  }, r.title), /*#__PURE__*/React.createElement("span", {
    className: "cs-related-meta"
  }, r.meta))))));
}

// Nav + Footer reused from homepage
function CaseStudyNav() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "hp-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "hp-logo",
    href: "iCorrect Homepage.html"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo-mark"
  }, "iC"), "iCorrect"), /*#__PURE__*/React.createElement("div", {
    className: "hp-nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "iCorrect Homepage.html"
  }, "Home"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Case studies"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "How it works")), /*#__PURE__*/React.createElement("a", {
    href: "iCorrect Homepage.html#wizard",
    className: "hp-nav-cta"
  }, "Get a quote \u2192")));
}
function CaseStudyBreadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container",
    style: {
      padding: "20px 32px 0"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      font: "500 13px var(--font-sans)",
      color: "#666"
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "iCorrect Homepage.html",
    style: {
      color: "#666",
      textDecoration: "none"
    }
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#c4c4c4",
      fontFamily: "var(--font-mono)"
    }
  }, "\u203A"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: "#666",
      textDecoration: "none"
    }
  }, "Case studies"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#c4c4c4",
      fontFamily: "var(--font-mono)"
    }
  }, "\u203A"), /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#171717"
    }
  }, CASE.device, " \u2014 ", CASE.fault)));
}
Object.assign(window, {
  CaseStudyNav,
  CaseStudyBreadcrumb,
  CaseStudyHero,
  CaseStudySteps,
  CaseStudyDiagnosis,
  CaseStudyCTA,
  CaseStudyRelated
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/CaseStudy.jsx", error: String((e && e.message) || e) }); }

// icorrect/Corporate.jsx
try { (() => {
// Corporate Services page — all section components (v2 — conversion-led)
// Structure: Pain → Proof → Solution → Process → Contact
// Voice: direct, empathetic to IT frustration, then confident on the fix.

function CorpBreadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "Corporate Services")));
}

/* ── Hero — lead with the frustration ──────────────────────────────────── */
function CorpHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "corp-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Corporate device repair"), /*#__PURE__*/React.createElement("h1", null, "Apple quoted you \xA31,200. We'll fix it for \xA3400."), /*#__PURE__*/React.createElement("p", null, "Your fleet is down. Apple says it'll take a week \u2014 or suggests you buy new. We repair at component level, return devices in 1\u20133 days, and save you up to 65% per unit."), /*#__PURE__*/React.createElement("div", {
    className: "corp-hero-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#corp-contact",
    className: "btn btn-dark btn-lg"
  }, "Get a fleet quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#corp-cost",
    className: "btn btn-lg",
    style: {
      background: "rgba(0,0,0,0.04)",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.1)"
    }
  }, "See the cost breakdown")))));
}

/* ── Pain cards — the three frustrations ───────────────────────────────── */
function CorpPain() {
  return /*#__PURE__*/React.createElement("section", {
    className: "corp-pain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pain-label"
  }, "The wait"), /*#__PURE__*/React.createElement("h3", null, "Apple turnaround is too long."), /*#__PURE__*/React.createElement("p", null, "5\u20137 business days minimum. During peak, often longer. Every day a device is out, your team loses productivity and you're fielding complaints."), /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "1\u20133"), /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "days \xB7 our turnaround"))), /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pain-label"
  }, "The cost"), /*#__PURE__*/React.createElement("h3", null, "Repairs cost nearly as much as new."), /*#__PURE__*/React.createElement("p", null, "Apple's out-of-warranty pricing pushes you toward replacement. A logic board \"repair\" becomes a \xA31,200 unit swap. Your budget shouldn't work that way."), /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "50\u201365%"), /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "less \xB7 typical saving"))), /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pain-label"
  }, "The verdict"), /*#__PURE__*/React.createElement("h3", null, "\"Not repairable\" \u2014 but it is."), /*#__PURE__*/React.createElement("p", null, "Apple doesn't do component-level board work. When they say a device can't be fixed, they mean they won't fix it. We diagnose at circuit level and repair what others replace."), /*#__PURE__*/React.createElement("div", {
    className: "corp-pain-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "85%+"), /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "of \"unrepairable\" devices \xB7 fixed"))))));
}

/* ── Trust band — logos + stats ─────────────────────────────────────────── */
function CorpTrust() {
  return /*#__PURE__*/React.createElement("section", {
    className: "corp-trust"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container corp-trust-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-trust-logos"
  }, /*#__PURE__*/React.createElement("span", {
    className: "corp-trust-logos-label"
  }, "Trusted by"), /*#__PURE__*/React.createElement("span", {
    className: "corp-logo-item"
  }, "Inditex"), /*#__PURE__*/React.createElement("span", {
    className: "corp-logo-item"
  }, "Panasonic"), /*#__PURE__*/React.createElement("span", {
    className: "corp-logo-item"
  }, "JLL"), /*#__PURE__*/React.createElement("span", {
    className: "corp-logo-item"
  }, "Prada")), /*#__PURE__*/React.createElement("div", {
    className: "corp-trust-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-trust-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "40k+"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Repairs")), /*#__PURE__*/React.createElement("div", {
    className: "corp-trust-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "4.9"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Rating")), /*#__PURE__*/React.createElement("div", {
    className: "corp-trust-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "11"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Years")), /*#__PURE__*/React.createElement("div", {
    className: "corp-trust-stat"
  }, /*#__PURE__*/React.createElement("span", {
    className: "num"
  }, "2yr"), /*#__PURE__*/React.createElement("span", {
    className: "label"
  }, "Warranty")))));
}

/* ── Cost comparison (elevated, early) ─────────────────────────────────── */
function CorpCost() {
  return /*#__PURE__*/React.createElement("section", {
    id: "corp-cost",
    className: "corp-cost-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Cost comparison"), /*#__PURE__*/React.createElement("h2", null, "Same device. Different outcome."), /*#__PURE__*/React.createElement("p", null, "Based on a typical MacBook Pro logic board failure \u2014 the most common high-value corporate repair.")), /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-layout"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-col them"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-col-head"
  }, /*#__PURE__*/React.createElement("h3", null, "Apple / manufacturer"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-ring"
  }, "Their quote")), /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "amount"
  }, "\xA31,200+"), /*#__PURE__*/React.createElement("span", {
    className: "context"
  }, "Full unit swap \u2014 out of warranty")), /*#__PURE__*/React.createElement("ul", {
    className: "corp-cost-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Assembly replacement, not component repair")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Data wiped as standard procedure")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "5\u20137 business day turnaround")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "90-day warranty on replacement")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Often advised to buy new instead")))), /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-col us"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-col-head"
  }, /*#__PURE__*/React.createElement("h3", null, "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-dark"
  }, "Board-level")), /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-price"
  }, /*#__PURE__*/React.createElement("span", {
    className: "amount"
  }, "\xA3400\u2013550"), /*#__PURE__*/React.createElement("span", {
    className: "context"
  }, "Targeted component repair")), /*#__PURE__*/React.createElement("ul", {
    className: "corp-cost-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Faulty component identified and replaced")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Data safely retained throughout")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "1\u20133 business day turnaround")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "2-year warranty on parts and labour")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "marker"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Devices Apple called \"unrepairable\" \u2014 fixed"))))), /*#__PURE__*/React.createElement("div", {
    className: "corp-cost-savings"
  }, /*#__PURE__*/React.createElement("span", {
    className: "save-num"
  }, "\xA3650+"), /*#__PURE__*/React.createElement("span", {
    className: "save-text"
  }, "saved per device on average \u2014 across a fleet of 50 MacBooks, that's over \xA332,000 back in your IT budget."))));
}

/* ── Process ───────────────────────────────────────────────────────────── */
function CorpProcess() {
  const steps = [{
    num: "01",
    title: "Intake",
    body: "Email, phone, or bulk submission. We log device details and reported faults against your account."
  }, {
    num: "02",
    title: "Collection",
    body: "Nationwide insured courier, London express, or in-person drop-off at our Fitzrovia workshop."
  }, {
    num: "03",
    title: "Diagnostic",
    body: "£49 board-level diagnosis. Written quote issued — deducted from repair cost if you proceed."
  }, {
    num: "04",
    title: "Repair",
    body: "Component-level repair in-house. Devices cleaned and stress-tested before sign-off."
  }, {
    num: "05",
    title: "Return",
    body: "Returned via courier with repair summary, QA report, and VAT invoice for your records."
  }];
  return /*#__PURE__*/React.createElement("section", {
    id: "corp-process",
    className: "corp-process"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Service workflow"), /*#__PURE__*/React.createElement("h2", null, "Intake to return in 1\u20133 days."), /*#__PURE__*/React.createElement("p", null, "Every corporate repair follows the same documented path. Full audit trail, no surprises.")), /*#__PURE__*/React.createElement("div", {
    className: "corp-process-grid"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "corp-process-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-process-num"
  }, s.num), /*#__PURE__*/React.createElement("h3", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body))))));
}

/* ── Device coverage ───────────────────────────────────────────────────── */
function CorpDevices() {
  const devices = [{
    title: "MacBook",
    body: "Pro and Air, Intel and Apple Silicon. Screen, battery, keyboard, and logic board repairs.",
    icon: "laptop"
  }, {
    title: "iPhone",
    body: "All recent models. Screen, battery, charging port, camera, and board-level repairs.",
    icon: "phone"
  }, {
    title: "iPad",
    body: "Pro, Air, and standard. Screen, battery, charging port, and logic board repairs.",
    icon: "tablet"
  }, {
    title: "Apple Watch",
    body: "Selected models. Screen, battery, and liquid damage assessment.",
    icon: "watch"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "corp-devices"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Fleet coverage"), /*#__PURE__*/React.createElement("h2", null, "Every Apple device your team uses."), /*#__PURE__*/React.createElement("p", null, "From common part swaps to component-level board work \u2014 we cover the full range.")), /*#__PURE__*/React.createElement("div", {
    className: "corp-devices-grid"
  }, devices.map((d, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "corp-device-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-device-icon"
  }, /*#__PURE__*/React.createElement(CorpDeviceIcon, {
    type: d.icon
  })), /*#__PURE__*/React.createElement("h3", null, d.title), /*#__PURE__*/React.createElement("p", null, d.body), /*#__PURE__*/React.createElement("a", {
    href: "#corp-contact",
    className: "corp-device-link"
  }, "Enquire \u2192"))))));
}
function CorpDeviceIcon({
  type
}) {
  const s = {
    width: 22,
    height: 22,
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (type) {
    case "laptop":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "4",
        width: "16",
        height: "11",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M1 18h20M8 15h6"
      }));
    case "phone":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "2",
        width: "10",
        height: "18",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 17h2"
      }));
    case "tablet":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "2",
        width: "14",
        height: "18",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 17h2"
      }));
    case "watch":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "7",
        y: "5",
        width: "8",
        height: "12",
        rx: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 2h4M9 20h4M7 8h8M7 14h8"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
      }));
  }
}

/* ── SLA tiers ─────────────────────────────────────────────────────────── */
function CorpSLA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "corp-sla"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Turnaround commitments"), /*#__PURE__*/React.createElement("h2", null, "SLA tiers built for fleet operations."), /*#__PURE__*/React.createElement("p", null, "Turnaround measured from device receipt to dispatch. Final timeline confirmed after diagnostic.")), /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-tiers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "Standard")), /*#__PURE__*/React.createElement("p", null, "Non-urgent repairs and planned maintenance cycles."), /*#__PURE__*/React.createElement("dl", {
    className: "corp-sla-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-meta-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Turnaround"), /*#__PURE__*/React.createElement("dd", null, "3\u20135 business days")), /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-meta-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Best for"), /*#__PURE__*/React.createElement("dd", null, "Spare pool devices")))), /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-card featured"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "Priority"), /*#__PURE__*/React.createElement("span", {
    className: "corp-sla-badge corp-sla-badge-pop"
  }, "Popular")), /*#__PURE__*/React.createElement("p", null, "Business-critical devices that need a fast return."), /*#__PURE__*/React.createElement("dl", {
    className: "corp-sla-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-meta-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Turnaround"), /*#__PURE__*/React.createElement("dd", null, "1\u20132 business days")), /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-meta-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Best for"), /*#__PURE__*/React.createElement("dd", null, "Active staff devices")))), /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "Express VIP"), /*#__PURE__*/React.createElement("span", {
    className: "corp-sla-badge corp-sla-badge-rec"
  }, "Fastest")), /*#__PURE__*/React.createElement("p", null, "Urgent \u2014 executive devices, live-event kit, zero-downtime roles."), /*#__PURE__*/React.createElement("dl", {
    className: "corp-sla-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-meta-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Turnaround"), /*#__PURE__*/React.createElement("dd", null, "Same day")), /*#__PURE__*/React.createElement("div", {
    className: "corp-sla-meta-row"
  }, /*#__PURE__*/React.createElement("dt", null, "Note"), /*#__PURE__*/React.createElement("dd", null, "Subject to availability")))))));
}

/* ── Admin (trimmed — 6 cards, not 9) ──────────────────────────────────── */
function CorpAdmin() {
  const cards = [{
    title: "PO & invoicing",
    body: "Purchase orders accepted. VAT invoices issued per repair with serial number, fault description, and cost breakdown."
  }, {
    title: "Payment terms",
    body: "Net-30 terms available for approved corporate clients. Consolidated invoicing by agreement."
  }, {
    title: "Chain of custody",
    body: "Devices tracked by serial from receipt to return. Condition documented at intake and before dispatch."
  }, {
    title: "Data handling",
    body: "Devices stay locked. Passcodes not required for most repairs. Data is never accessed unless unavoidable and agreed."
  }, {
    title: "NDA available",
    body: "Non-disclosure agreements on request. We work with our standard NDA or your own."
  }, {
    title: "Approval workflow",
    body: "No work without written approval. Quote must be confirmed before any repair proceeds."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "corp-admin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Administration"), /*#__PURE__*/React.createElement("h2", null, "Built for procurement and IT ops."), /*#__PURE__*/React.createElement("p", null, "Invoicing, data handling, and approvals structured for corporate requirements.")), /*#__PURE__*/React.createElement("div", {
    className: "corp-admin-grid"
  }, cards.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "corp-admin-card"
  }, /*#__PURE__*/React.createElement("h4", null, c.title), /*#__PURE__*/React.createElement("p", null, c.body))))));
}

/* ── Contact (dark, with proof points) ─────────────────────────────────── */
function CorpContact() {
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    phone: "",
    title: "",
    company: "",
    fleet: "",
    sla: "",
    notes: ""
  });
  const update = k => e => setForm({
    ...form,
    [k]: e.target.value
  });
  return /*#__PURE__*/React.createElement("section", {
    id: "corp-contact",
    className: "corp-contact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container corp-contact-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Get started"), /*#__PURE__*/React.createElement("h2", null, "Stop overpaying. Start repairing."), /*#__PURE__*/React.createElement("p", null, "Tell us your fleet size and we'll send a tailored proposal within one business day. No commitment, no hard sell."), /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-email"
  }, "Prefer email? ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:support@icorrect.co.uk"
  }, "support@icorrect.co.uk")), /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-proof"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Most clients onboarded within 24 hours")), /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "\xA349 diagnostic \u2014 deducted if you proceed")), /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "2-year warranty on every repair")), /*#__PURE__*/React.createElement("div", {
    className: "corp-contact-proof-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "check"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "No minimum fleet size")))), /*#__PURE__*/React.createElement("form", {
    className: "corp-form",
    onSubmit: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Full name"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: form.name,
    onChange: update("name"),
    placeholder: "Jane Smith"
  })), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Work email"), /*#__PURE__*/React.createElement("input", {
    type: "email",
    value: form.email,
    onChange: update("email"),
    placeholder: "jane@company.com"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Phone"), /*#__PURE__*/React.createElement("input", {
    type: "tel",
    value: form.phone,
    onChange: update("phone"),
    placeholder: "+44 20 7099 8517"
  })), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Job title"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: form.title,
    onChange: update("title"),
    placeholder: "IT Manager"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field full"
  }, /*#__PURE__*/React.createElement("label", null, "Company"), /*#__PURE__*/React.createElement("input", {
    type: "text",
    value: form.company,
    onChange: update("company"),
    placeholder: "Acme Ltd"
  }))), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Fleet size"), /*#__PURE__*/React.createElement("select", {
    value: form.fleet,
    onChange: update("fleet")
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select"), /*#__PURE__*/React.createElement("option", null, "1\u201320 devices"), /*#__PURE__*/React.createElement("option", null, "21\u201350 devices"), /*#__PURE__*/React.createElement("option", null, "51\u2013100 devices"), /*#__PURE__*/React.createElement("option", null, "101\u2013500 devices"), /*#__PURE__*/React.createElement("option", null, "500+ devices"))), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field"
  }, /*#__PURE__*/React.createElement("label", null, "Urgency"), /*#__PURE__*/React.createElement("select", {
    value: form.sla,
    onChange: update("sla")
  }, /*#__PURE__*/React.createElement("option", {
    value: ""
  }, "Select"), /*#__PURE__*/React.createElement("option", null, "Standard (3\u20135 days)"), /*#__PURE__*/React.createElement("option", null, "Priority (1\u20132 days)"), /*#__PURE__*/React.createElement("option", null, "Express VIP (Same day)")))), /*#__PURE__*/React.createElement("div", {
    className: "corp-form-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "corp-form-field full"
  }, /*#__PURE__*/React.createElement("label", null, "Anything else?"), /*#__PURE__*/React.createElement("textarea", {
    rows: "3",
    value: form.notes,
    onChange: update("notes"),
    placeholder: "Device types, common faults, volume \u2014 whatever helps us quote accurately."
  }))), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-dark",
    style: {
      background: "#fff",
      color: "#171717"
    }
  }, "Get your fleet quote \u2192"))));
}
Object.assign(window, {
  CorpBreadcrumb,
  CorpHero,
  CorpPain,
  CorpTrust,
  CorpCost,
  CorpProcess,
  CorpDifference: CorpCost,
  CorpDevices,
  CorpSLA,
  CorpAdmin,
  CorpContact,
  CorpDeviceIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Corporate.jsx", error: String((e && e.message) || e) }); }

// icorrect/HeroDiagnose.jsx
try { (() => {
// HeroDiagnose — the "Help me diagnose" journey.
//
// Five-stage flow:
//   1. Device     → which kind of device
//   2. Model      → which exact model (skippable, with visual-guide helper)
//   3. Fault      → fault category
//   4. Symptoms   → guided 3–6 question diagnostic tree
//   5. Diagnosis  → confidence + eliminated trail + 3 CTAs
//
// Lives in place of the marketing hero. URL synced to #diagnose. Esc / back
// button closes. State persisted in localStorage so refresh-mid-flow is OK.

const DIAG_LS = "icorrect-diag-v1";
function loadDiagState() {
  try {
    const raw = localStorage.getItem(DIAG_LS);
    if (raw) return JSON.parse(raw);
  } catch {}
  return {
    stage: "device",
    // device | model | fault | symptoms | diagnosis
    deviceId: null,
    modelName: null,
    modelSkipped: false,
    faultId: null,
    nodeId: null,
    // current node in the tree
    history: [],
    // [{ nodeId, answer: { label, evidence } }, ...]
    diagnosisId: null // terminal node id once we hit one
  };
}
function saveDiagState(s) {
  try {
    localStorage.setItem(DIAG_LS, JSON.stringify(s));
  } catch {}
}
function useDiagState() {
  const [state, setState] = React.useState(loadDiagState);
  React.useEffect(() => {
    saveDiagState(state);
  }, [state]);
  const reset = () => setState({
    stage: "device",
    deviceId: null,
    modelName: null,
    modelSkipped: false,
    faultId: null,
    nodeId: null,
    history: [],
    diagnosisId: null
  });
  return [state, setState, reset];
}

// Stage labels for the breadcrumb + workshop notes
const STAGE_LABELS = {
  device: "Step 1 of 5 · Device",
  model: "Step 2 of 5 · Model",
  fault: "Step 3 of 5 · Fault area",
  symptoms: "Step 4 of 5 · Symptoms",
  diagnosis: "Step 5 of 5 · Diagnosis"
};

// Workshop-notes copy per stage. Keeps the rail purposeful, not filler.
function railCopy(stage, state) {
  switch (stage) {
    case "device":
      return {
        eyebrow: "Workshop notes",
        title: "Most common at this stage",
        items: [{
          kind: "iPhone",
          note: "Screen, battery, rear glass — fixed-price repairs while-you-wait"
        }, {
          kind: "MacBook",
          note: "Flexgate, backlight ICs, liquid recovery — board-level work"
        }, {
          kind: "iPad",
          note: "Glass, charging port, battery — most fixes 2–4 days"
        }, {
          kind: "Watch",
          note: "Screen replacements, battery, water seal restoration"
        }],
        footer: "Don't see your device? Pick anything — there's a \"none of these\" option on the next step."
      };
    case "model":
      return {
        eyebrow: "Why we ask",
        title: "Model affects pricing, not diagnosis",
        items: [{
          kind: "Skip if unsure",
          note: "We can diagnose most faults without knowing the exact model."
        }, {
          kind: "Visual guide",
          note: "Camera layout, edges, screen — we'll narrow it down."
        }, {
          kind: "About this Mac / Settings",
          note: "Apple → About This Mac (macOS), Settings → General → About (iOS)."
        }],
        footer: "Skipping is fine — we'll just need the model later if you want a fixed price."
      };
    case "fault":
      return {
        eyebrow: "Workshop notes",
        title: "What we mean by each",
        items: [{
          kind: "Screen / Display",
          note: "Cracks, lines, flicker, dead pixels, backlight, touch issues"
        }, {
          kind: "Power / Battery",
          note: "Won't charge, drains fast, random shutdowns, swelling"
        }, {
          kind: "Water Damage",
          note: "Anything liquid-related — coffee, rain, full submersion"
        }, {
          kind: "Something else",
          note: "Pick this if your fault straddles categories. We'll guide you."
        }]
      };
    case "symptoms":
      return {
        eyebrow: "What we're doing",
        title: "Eliminating possibilities",
        items: [{
          kind: "Each question narrows it down",
          note: "Most faults have 3–4 plausible causes. We rule them out one at a time."
        }, {
          kind: "We work like this on the bench too",
          note: "Same questions, same elimination order — we just do it with the device in hand."
        }, {
          kind: "Skip any time",
          note: "If you'd rather we just look at it, click \"book pre-diagnosis\" below."
        }],
        footer: state.history?.length ? `So far: ${state.history.length} thing${state.history.length === 1 ? "" : "s"} eliminated.` : null
      };
    case "diagnosis":
      return {
        eyebrow: "Workshop notes",
        title: "What happens next",
        items: [{
          kind: "Drop-off in Fitzrovia",
          note: "12 Margaret Street · open Mon–Fri"
        }, {
          kind: "Free UK collection",
          note: "Tracked, insured, signed-for both ways"
        }, {
          kind: "Two-year warranty",
          note: "On the part and the labour"
        }],
        footer: "Diagnosis confidence reflects what we can tell from your answers. In-person scope is always more accurate."
      };
    default:
      return null;
  }
}

/* ===== Breadcrumb ===== */
function DiagBreadcrumb({
  stage,
  onClose,
  onJump,
  history
}) {
  const stages = ["device", "model", "fault", "symptoms", "diagnosis"];
  const idx = stages.indexOf(stage);
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-breadcrumb"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-back",
    onClick: onClose,
    "aria-label": "Back to homepage"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-back-arrow"
  }, "\u2190"), /*#__PURE__*/React.createElement("span", null, "Back")), /*#__PURE__*/React.createElement("span", {
    className: "diag-bc-sep",
    "aria-hidden": "true"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "diag-bc-trail"
  }, "Diagnostic"), /*#__PURE__*/React.createElement("span", {
    className: "diag-bc-sep",
    "aria-hidden": "true"
  }, "/"), /*#__PURE__*/React.createElement("span", {
    className: "diag-bc-step"
  }, STAGE_LABELS[stage]));
}

/* ===== Right rail ===== */
function DiagRail({
  stage,
  state
}) {
  const copy = railCopy(stage, state);
  if (!copy) return null;
  return /*#__PURE__*/React.createElement("aside", {
    className: "diag-rail",
    "aria-label": "Workshop notes"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-rail-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-eyebrow"
  }, copy.eyebrow), /*#__PURE__*/React.createElement("h3", {
    className: "diag-rail-title"
  }, copy.title)), /*#__PURE__*/React.createElement("ul", {
    className: "diag-rail-list"
  }, copy.items.map((it, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "diag-rail-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-kind"
  }, it.kind), /*#__PURE__*/React.createElement("span", {
    className: "diag-rail-note"
  }, it.note)))), copy.footer && /*#__PURE__*/React.createElement("p", {
    className: "diag-rail-aside"
  }, copy.footer));
}

/* ===== Stage 1: Device ===== */
function DiagStepDevice({
  onPick
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-stage"
  }, /*#__PURE__*/React.createElement("h2", {
    className: "diag-q-title"
  }, "What needs fixing?"), /*#__PURE__*/React.createElement("p", {
    className: "diag-q-sub"
  }, "Pick your device. We'll take it from there."), /*#__PURE__*/React.createElement("div", {
    className: "diag-device-grid"
  }, DIAG_DEVICES.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    className: "diag-device-card",
    onClick: () => onPick(d.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-device-icon"
  }, /*#__PURE__*/React.createElement(DiagIcon, {
    name: d.id
  })), /*#__PURE__*/React.createElement("span", {
    className: "diag-device-name"
  }, d.name), /*#__PURE__*/React.createElement("span", {
    className: "diag-device-detail"
  }, d.detail)))));
}

/* ===== Stage 2: Model (skippable) ===== */
function DiagStepModel({
  deviceId,
  onPickModel,
  onSkip,
  onBack
}) {
  const groups = DIAG_MODELS[deviceId] || [];
  const [openGroup, setOpenGroup] = React.useState(null);
  const [helperOpen, setHelperOpen] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-stage"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-textback",
    onClick: onBack
  }, "\u2190 Back to device"), /*#__PURE__*/React.createElement("h2", {
    className: "diag-q-title"
  }, "Which model?"), /*#__PURE__*/React.createElement("p", {
    className: "diag-q-sub"
  }, "This helps us give you a price later. ", /*#__PURE__*/React.createElement("strong", null, "You can skip it"), " \u2014 we can diagnose most faults without it."), /*#__PURE__*/React.createElement("div", {
    className: "diag-model-groups"
  }, groups.map(g => {
    const open = openGroup === g.g;
    return /*#__PURE__*/React.createElement("div", {
      key: g.g,
      className: "diag-mg " + (open ? "is-open" : "")
    }, /*#__PURE__*/React.createElement("button", {
      className: "diag-mg-head",
      onClick: () => setOpenGroup(open ? null : g.g)
    }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, g.g), /*#__PURE__*/React.createElement("span", {
      className: "diag-mg-count"
    }, g.m.length, " variant", g.m.length === 1 ? "" : "s")), /*#__PURE__*/React.createElement("span", {
      className: "diag-mg-chev",
      "aria-hidden": "true"
    }, "\u2304")), open && /*#__PURE__*/React.createElement("div", {
      className: "diag-mg-list"
    }, g.m.map(m => /*#__PURE__*/React.createElement("button", {
      key: m.n,
      className: "diag-mg-item",
      onClick: () => onPickModel(m.n)
    }, /*#__PURE__*/React.createElement("span", null, m.n), /*#__PURE__*/React.createElement("span", {
      className: "diag-mg-y"
    }, m.y)))));
  })), /*#__PURE__*/React.createElement("div", {
    className: "diag-model-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-helper-trigger",
    onClick: () => setHelperOpen(o => !o)
  }, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\uD83D\uDD0D"), " Not sure which one? ", /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: "underline"
    }
  }, "Help me identify it")), /*#__PURE__*/React.createElement("button", {
    className: "diag-skip",
    onClick: onSkip
  }, "I don't know \u2014 keep going ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))), helperOpen && /*#__PURE__*/React.createElement("div", {
    className: "diag-helper"
  }, /*#__PURE__*/React.createElement("p", {
    className: "diag-helper-lede"
  }, /*#__PURE__*/React.createElement("strong", null, "Quickest way:"), " Apple menu \u2192 ", /*#__PURE__*/React.createElement("em", null, "About This Mac"), " (macOS), or Settings \u2192 General \u2192 About (iPhone / iPad / Watch). Look for the marketing name (e.g. \"MacBook Pro (16-inch, 2021)\") or the model identifier (A2442)."), /*#__PURE__*/React.createElement("p", {
    className: "diag-helper-lede",
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("strong", null, "For iPhone:"), " we have a visual guide based on camera layout and edges \u2014 ", /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "launch visual guide \u2192"))));
}

/* ===== Stage 3: Fault ===== */
function DiagStepFault({
  deviceId,
  onPick,
  onBack
}) {
  const faults = DIAG_FAULTS[deviceId] || DIAG_FAULTS.iphone;
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-stage"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-textback",
    onClick: onBack
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h2", {
    className: "diag-q-title"
  }, "What kind of fault?"), /*#__PURE__*/React.createElement("p", {
    className: "diag-q-sub"
  }, "Pick the area that's affected. We'll narrow down the cause next."), /*#__PURE__*/React.createElement("div", {
    className: "diag-fault-grid"
  }, faults.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: "diag-fault-card",
    onClick: () => onPick(f.id)
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-fault-icon"
  }, /*#__PURE__*/React.createElement(DiagIcon, {
    name: f.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "diag-fault-label"
  }, f.label)))));
}

/* ===== Stage 4: Symptoms — the decision tree ===== */
function DiagStepSymptoms({
  state,
  setState,
  onBack,
  onAdvance,
  onPrediag
}) {
  const treeKey = `${state.deviceId}:${state.faultId}`;
  const tree = DIAG_TREES[treeKey];
  const nodeId = state.nodeId || tree?.root;
  const node = tree?.nodes?.[nodeId];
  if (!tree || !node) {
    return /*#__PURE__*/React.createElement("div", {
      className: "diag-stage"
    }, /*#__PURE__*/React.createElement("p", null, "Something's missing \u2014 let's book you a free pre-diagnosis."), /*#__PURE__*/React.createElement("button", {
      className: "diag-cta-primary",
      onClick: onPrediag
    }, "Book pre-diagnosis \u2192"));
  }

  // If it's a terminal node, advance to diagnosis stage
  React.useEffect(() => {
    if (node.terminal) onAdvance(nodeId);
    // eslint-disable-next-line
  }, [nodeId, node.terminal]);
  const pickAnswer = answer => {
    setState(s => ({
      ...s,
      nodeId: answer.next,
      history: [...s.history, {
        nodeId,
        question: node.question,
        answer: {
          label: answer.label,
          evidence: answer.evidence
        }
      }]
    }));
  };
  const stepNum = state.history.length + 1;
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-stage diag-symptoms"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-textback",
    onClick: onBack
  }, "\u2190 Back"), state.history.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "diag-trail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-trail-head"
  }, "What you've told us"), /*#__PURE__*/React.createElement("ol", {
    className: "diag-trail-list"
  }, state.history.map((h, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "diag-trail-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-trail-num"
  }, i + 1), /*#__PURE__*/React.createElement("span", {
    className: "diag-trail-text"
  }, h.answer.evidence || h.answer.label))))), /*#__PURE__*/React.createElement("div", {
    className: "diag-question-card"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-q-step"
  }, "Question ", stepNum), /*#__PURE__*/React.createElement("h3", {
    className: "diag-q-text"
  }, node.question), node.hint && /*#__PURE__*/React.createElement("p", {
    className: "diag-q-hint"
  }, node.hint), /*#__PURE__*/React.createElement("div", {
    className: "diag-answers"
  }, node.answers.map((a, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    className: "diag-answer",
    onClick: () => pickAnswer(a)
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-answer-main"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-answer-label"
  }, a.label), a.detail && /*#__PURE__*/React.createElement("span", {
    className: "diag-answer-detail"
  }, a.detail)), /*#__PURE__*/React.createElement("span", {
    className: "diag-answer-arrow",
    "aria-hidden": "true"
  }, "\u2192"))))), /*#__PURE__*/React.createElement("div", {
    className: "diag-symptoms-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-skip-quiet",
    onClick: onPrediag
  }, "Skip the questions \u2014 book a free pre-diagnosis \u2192")));
}

/* ===== Stage 5: Diagnosis ===== */
function DiagStepDiagnosis({
  state,
  onReset,
  onBack
}) {
  const tree = DIAG_TREES[`${state.deviceId}:${state.faultId}`];
  const node = tree?.nodes?.[state.diagnosisId];
  if (!node) return null;
  const conf = node.confidence || "medium";
  const confLabel = {
    high: "High confidence",
    medium: "Likely",
    low: "Possible — needs verification"
  }[conf];
  return /*#__PURE__*/React.createElement("div", {
    className: "diag-stage diag-diagnosis"
  }, /*#__PURE__*/React.createElement("button", {
    className: "diag-textback",
    onClick: onBack
  }, "\u2190 Adjust answers"), /*#__PURE__*/React.createElement("div", {
    className: "diag-diag-card conf-" + conf
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-diag-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-conf-pill conf-" + conf
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-conf-dot"
  }), confLabel), /*#__PURE__*/React.createElement("span", {
    className: "diag-diag-eyebrow"
  }, "Most likely diagnosis")), /*#__PURE__*/React.createElement("h2", {
    className: "diag-diag-title"
  }, node.title), /*#__PURE__*/React.createElement("p", {
    className: "diag-diag-summary"
  }, node.summary), node.repair && !node.prediagnosis && /*#__PURE__*/React.createElement("div", {
    className: "diag-repair"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-repair-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-repair-label"
  }, "Repair"), /*#__PURE__*/React.createElement("span", {
    className: "diag-repair-value"
  }, node.repair.name)), /*#__PURE__*/React.createElement("div", {
    className: "diag-repair-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-repair-label"
  }, "From"), /*#__PURE__*/React.createElement("span", {
    className: "diag-repair-value diag-repair-price"
  }, "\xA3", node.repair.priceFrom)), /*#__PURE__*/React.createElement("div", {
    className: "diag-repair-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "diag-repair-label"
  }, "Turnaround"), /*#__PURE__*/React.createElement("span", {
    className: "diag-repair-value"
  }, node.repair.days))), state.history.length > 0 && /*#__PURE__*/React.createElement("details", {
    className: "diag-eliminated"
  }, /*#__PURE__*/React.createElement("summary", null, "What we eliminated to get here (", state.history.length, ")"), /*#__PURE__*/React.createElement("ul", null, state.history.map((h, i) => /*#__PURE__*/React.createElement("li", {
    key: i
  }, h.answer.evidence || h.answer.label)))), /*#__PURE__*/React.createElement("div", {
    className: "diag-diag-ctas"
  }, node.prediagnosis ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "diag-cta-primary"
  }, "Book free pre-diagnosis \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "diag-cta-secondary"
  }, "Talk to a specialist")) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "diag-cta-primary"
  }, state.modelName ? `Get a fixed quote for my ${state.modelName.split(' ').slice(0, 3).join(' ')}` : "Get a fixed quote", " \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "diag-cta-secondary"
  }, "Book free pre-diagnosis instead")), node.reading && /*#__PURE__*/React.createElement("a", {
    href: node.reading.url,
    className: "diag-cta-tertiary"
  }, "Read more: ", node.reading.title, " \u2192"))), /*#__PURE__*/React.createElement("button", {
    className: "diag-restart",
    onClick: onReset
  }, "\u21BA Start a new diagnostic"));
}

/* ===== The shell ===== */
function HeroDiagnose({
  onClose
}) {
  const [state, setState, reset] = useDiagState();

  // Esc to close
  React.useEffect(() => {
    const onKey = e => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const setStage = (stage, patch = {}) => setState(s => ({
    ...s,
    stage,
    ...patch
  }));
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-hero hp-hero-diagnose"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-hero-grid diag-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "diag-main"
  }, /*#__PURE__*/React.createElement(DiagBreadcrumb, {
    stage: state.stage,
    onClose: onClose
  }), /*#__PURE__*/React.createElement("div", {
    className: "diag-frame"
  }, state.stage === "device" && /*#__PURE__*/React.createElement(DiagStepDevice, {
    onPick: deviceId => setStage("model", {
      deviceId
    })
  }), state.stage === "model" && /*#__PURE__*/React.createElement(DiagStepModel, {
    deviceId: state.deviceId,
    onPickModel: modelName => setStage("fault", {
      modelName,
      modelSkipped: false
    }),
    onSkip: () => setStage("fault", {
      modelName: null,
      modelSkipped: true
    }),
    onBack: () => setStage("device")
  }), state.stage === "fault" && /*#__PURE__*/React.createElement(DiagStepFault, {
    deviceId: state.deviceId,
    onPick: faultId => setStage("symptoms", {
      faultId,
      nodeId: null,
      history: []
    }),
    onBack: () => setStage("model")
  }), state.stage === "symptoms" && /*#__PURE__*/React.createElement(DiagStepSymptoms, {
    state: state,
    setState: setState,
    onBack: () => {
      // pop one history; if empty, back to fault
      setState(s => {
        if (s.history.length === 0) return {
          ...s,
          stage: "fault",
          nodeId: null
        };
        const last = s.history[s.history.length - 1];
        return {
          ...s,
          nodeId: last.nodeId,
          history: s.history.slice(0, -1)
        };
      });
    },
    onAdvance: nodeId => setStage("diagnosis", {
      diagnosisId: nodeId
    }),
    onPrediag: () => setStage("diagnosis", {
      diagnosisId: null,
      _forcedPrediag: true
    })
  }), state.stage === "diagnosis" && /*#__PURE__*/React.createElement(DiagStepDiagnosis, {
    state: state,
    onReset: reset,
    onBack: () => setStage("symptoms")
  }))), /*#__PURE__*/React.createElement(DiagRail, {
    stage: state.stage,
    state: state
  })));
}
Object.assign(window, {
  HeroDiagnose
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/HeroDiagnose.jsx", error: String((e && e.message) || e) }); }

// icorrect/Heros.jsx
try { (() => {
// Three hero variants. Each one takes the Wizard as a child and provides its own surrounding frame.

function HeroV1({
  reviewCount = 719,
  showFilters = true
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero-v1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hero-v1-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v1-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "MacBook \xB7 Screen Repair"), /*#__PURE__*/React.createElement("h1", {
    className: "h1-v1"
  }, "Your MacBook screen, restored to original."), /*#__PURE__*/React.createElement("p", null, "Genuine Apple displays, calibrated in-house at our Fitzrovia workshop. Most repairs complete in 1\u20132 days, all backed by a 2-year warranty."), /*#__PURE__*/React.createElement("div", {
    className: "hero-v1-trust-inline"
  }, /*#__PURE__*/React.createElement("div", null, "\u2605 ", /*#__PURE__*/React.createElement("strong", null, "4.8"), " \xB7 ", reviewCount, " Google reviews"), /*#__PURE__*/React.createElement("div", null, "\xB7"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "2-year"), " warranty"), /*#__PURE__*/React.createElement("div", null, "\xB7"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Genuine"), " Apple parts"))), /*#__PURE__*/React.createElement("div", {
    className: "hero-v1-wizard",
    id: "wizard"
  }, /*#__PURE__*/React.createElement(Wizard, {
    variant: "v1",
    showFilters: showFilters
  }))));
}
function HeroV2({
  reviewCount = 719,
  rating = 4.8,
  headerStyle = "merged",
  showFilters = true
}) {
  // headerStyle:
  //   "merged"     — eyebrow = "MacBook Screen Repair · Fitzrovia" + action-led headline
  //   "stacked"    — banner stays above; hero shows wizard only (no duplicate H1)
  //   "keyword-h1" — single SEO H1 "MacBook Screen Repair" with instant-quote subtitle
  //   "original"   — pre-change layout: banner H1 above + second H1 in hero (for comparison)
  return /*#__PURE__*/React.createElement("section", {
    className: "hero-v2 hero-v2-hs-" + headerStyle
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-gradient-bg"
  }), /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, headerStyle === "merged" && /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-headline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " MacBook Screen Repair \xB7 Fitzrovia, London"), /*#__PURE__*/React.createElement("h1", null, "Get your instant quote."), /*#__PURE__*/React.createElement("p", null, "Tell us your model. See your price. Book in 60 seconds \u2014 with a 2-year warranty and genuine Apple parts.")), headerStyle === "stacked" && /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-headline hero-v2-headline-slim"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " In stock today \xB7 1\u20132 day turnaround"), /*#__PURE__*/React.createElement("p", null, "Tell us your model. See your price. Book in 60 seconds \u2014 genuine Apple parts, 2-year warranty.")), headerStyle === "keyword-h1" && /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-headline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " Fitzrovia workshop \xB7 in stock today"), /*#__PURE__*/React.createElement("h1", null, "MacBook Screen Repair"), /*#__PURE__*/React.createElement("p", null, "Instant quote in 60 seconds. Genuine Apple parts. 2-year warranty. Most repairs complete in 1\u20132 days at our Fitzrovia workshop.")), headerStyle === "original" && /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-headline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " Fitzrovia workshop \xB7 in stock today"), /*#__PURE__*/React.createElement("h1", null, "Get an instant MacBook screen quote."), /*#__PURE__*/React.createElement("p", null, "Tell us your model. See your price. Book in 60 seconds \u2014 with a 2-year warranty and genuine Apple parts.")), /*#__PURE__*/React.createElement("div", {
    className: "hero-v2-wizard",
    id: "wizard"
  }, /*#__PURE__*/React.createElement(Wizard, {
    variant: "v2",
    showFilters: showFilters
  }))));
}
function HeroV3({
  reviewCount = 719,
  showFilters = true
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hero-v3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hero-v3-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "MacBook \xB7 Screen Repair \xB7 Fitzrovia, London"), /*#__PURE__*/React.createElement("h1", null, "The workshop other repair shops send their MacBooks to."), /*#__PURE__*/React.createElement("p", null, "Board-level specialists. Genuine Apple displays. A 2-year warranty that's double the industry standard \u2014 because we know what's in the repair."), /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-trust-stack"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-trust-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tick"
  }, "\u2605"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "4.8 from ", reviewCount, " Google reviews."), " Verified by Google Business, not curated.")), /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-trust-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Genuine Apple parts, calibrated in-house."), " True Tone, full brightness, colour-accurate \u2014 same as Apple Store.")), /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-trust-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tick"
  }, "\u25C9"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "Microsoldering specialists."), " Backlight IC, liquid damage, Stage Light effect \u2014 repairs other shops can't do.")), /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-trust-row"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tick"
  }, "\u29D7"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("strong", null, "1\u20132 working day turnaround."), " Walk in before 11am and same-day is usually possible.")))), /*#__PURE__*/React.createElement("div", {
    className: "hero-v3-wizard",
    id: "wizard"
  }, /*#__PURE__*/React.createElement(Wizard, {
    variant: "v3",
    showFilters: showFilters
  })))));
}
function CollectionHeader({
  variant,
  headerStyle = "merged"
}) {
  if (variant === "v3") return null;

  // "merged" / "keyword-h1": show breadcrumb only — H1 lives in the hero
  // "stacked" / "original": full banner with the "MacBook Screen Repair" H1
  if (headerStyle !== "stacked" && headerStyle !== "original") {
    return /*#__PURE__*/React.createElement("header", {
      className: "collection-header collection-header-slim"
    }, /*#__PURE__*/React.createElement("div", {
      className: "container"
    }, /*#__PURE__*/React.createElement("nav", {
      className: "coll-breadcrumb",
      "aria-label": "Breadcrumb"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "Services"), /*#__PURE__*/React.createElement("span", {
      className: "coll-breadcrumb-sep"
    }, "\u203A"), /*#__PURE__*/React.createElement("a", {
      href: "#"
    }, "MacBook"), /*#__PURE__*/React.createElement("span", {
      className: "coll-breadcrumb-sep"
    }, "\u203A"), /*#__PURE__*/React.createElement("span", {
      "aria-current": "page"
    }, "Screen Repair"))));
  }
  return /*#__PURE__*/React.createElement("header", {
    className: "collection-header"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      marginTop: 32
    }
  }, "Collection \xB7 MacBook \xB7 Screen"), /*#__PURE__*/React.createElement("div", {
    className: "coll-head-title"
  }, /*#__PURE__*/React.createElement("h1", {
    className: "display"
  }, "MacBook Screen Repair"), /*#__PURE__*/React.createElement("div", {
    className: "coll-head-lede"
  }, "Cracked, dead, flickering, or stuck on Stage Light? We replace the display only \u2014 never the full lid \u2014 using genuine Apple parts, at prices that make sense."))));
}
Object.assign(window, {
  HeroV1,
  HeroV2,
  HeroV3,
  CollectionHeader
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Heros.jsx", error: String((e && e.message) || e) }); }

// icorrect/Homepage.jsx
try { (() => {
// Homepage Nav, Hero variants, Proof section, and small support components.

// Fired when any "Help me diagnose" CTA is clicked. App listens and morphs hero.
function openDiagnose(e) {
  if (e) e.preventDefault();
  window.dispatchEvent(new CustomEvent("icorrect:diagnose-open"));
}
function HomepageNav() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "hp-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "hp-logo",
    href: "#"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo-mark"
  }, "iC"), "iCorrect"), /*#__PURE__*/React.createElement("div", {
    className: "hp-nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Diagnostic"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Specialist"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "How it works"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Workshop")), /*#__PURE__*/React.createElement("span", {
    className: "hp-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " Open \xB7 Fitzrovia"), /*#__PURE__*/React.createElement("a", {
    href: "#wizard",
    className: "hp-nav-cta"
  }, "Get a quote \u2192")));
}
function HeroTrust({
  reviewCount = 719,
  rating = 4.9
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-trust"
  }, /*#__PURE__*/React.createElement("span", {
    className: "stars",
    "aria-hidden": "true"
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Star, {
    key: i
  }))), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, rating), " \xB7 ", reviewCount, " Google reviews"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "2-year"), " warranty"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Microsoldering"), " certified"));
}
function Star() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "13",
    height: "13",
    viewBox: "0 0 14 14",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z"
  }));
}

/* ===== HERO V1 — Workshop split ===== */
function HeroWorkshop({
  reviewCount,
  rating
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-hero hp-hero-v1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "Microelectronic specialists \xB7 Fitzrovia, London"), /*#__PURE__*/React.createElement("h1", null, "We repair what they can't."), /*#__PURE__*/React.createElement("p", {
    className: "hp-hero-sub"
  }, "Microsoldering, liquid damage recovery, and the repairs Apple writes off \u2014 done in-house at our Fitzrovia workshop. Genuine parts. Two-year warranty."), /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#wizard",
    className: "hp-cta hp-cta-primary"
  }, "Get a quote ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "workshop-frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "workshop-caption"
  }, /*#__PURE__*/React.createElement("span", {
    className: "live-dot"
  }), " From the workshop"), /*#__PURE__*/React.createElement("img", {
    className: "workshop-photo",
    src: "uploads/workshop-bench.jpg",
    alt: "Stereo microscope board-level repair at the Fitzrovia workshop"
  }), /*#__PURE__*/React.createElement("div", {
    className: "workshop-meta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "workshop-meta-label"
  }, "Microsoldering \xB7 Fitzrovia")))));
}

/* ===== HERO V2 — Proof-forward ===== */
function HeroProof({
  reviewCount,
  rating
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-hero hp-hero-v2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "Real case \xB7 April 2026"), /*#__PURE__*/React.createElement("h1", null, "We repair what they can't."), /*#__PURE__*/React.createElement("p", {
    className: "hp-hero-sub"
  }, "When Apple says \"logic board, \xA31,400\" we say \"backlight IC, \xA3380.\" Microsoldering is what we do \u2014 it's why other repair shops send their tough jobs to us."), /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#wizard",
    className: "hp-cta hp-cta-primary"
  }, "Get a quote ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "proof-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-card-image"
  }, /*#__PURE__*/React.createElement("img", {
    className: "proof-photo",
    src: "uploads/backlight-repair.jpg",
    alt: "The actual MacBook backlight circuit we repaired \u2014 backlight driver IC and coils"
  }), /*#__PURE__*/React.createElement("span", {
    className: "proof-card-tag success"
  }, "Fixed \xB7 4 days")), /*#__PURE__*/React.createElement("div", {
    className: "proof-card-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "proof-card-quote"
  }, "\"Apple quoted \xA31,400 for a full logic-board swap. We microsoldered the failed backlight IC and returned it in four days.\""), /*#__PURE__*/React.createElement("div", {
    className: "proof-card-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-card-stat strike"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-label"
  }, "Apple quote"), /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-value"
  }, "\xA31,400")), /*#__PURE__*/React.createElement("div", {
    className: "proof-card-stat fix"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-label"
  }, "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-value"
  }, "\xA3380")))))));
}

/* ===== HERO V3 — Wizard inline ===== */
function HeroWizardInline({
  reviewCount,
  rating
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-hero hp-hero-v3"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), "Apple repair \xB7 Fitzrovia, London"), /*#__PURE__*/React.createElement("h1", null, "We repair what they can't."), /*#__PURE__*/React.createElement("p", {
    className: "hp-hero-sub"
  }, "Tell us your model and the symptom \u2014 see your price in 60 seconds. Or, if you don't know what's wrong yet, walk us through it."), /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#diagnose",
    onClick: openDiagnose,
    className: "hp-cta hp-cta-secondary"
  }, "I don't know what's wrong ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))), /*#__PURE__*/React.createElement("div", {
    id: "wizard",
    className: "wizard-frame"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wizard-frame-head"
  }, /*#__PURE__*/React.createElement("span", null, "Instant quote \xB7 Step 1"), /*#__PURE__*/React.createElement("span", null, "\u21B3 60 sec")), /*#__PURE__*/React.createElement(Wizard, {
    variant: "hero",
    showFilters: true
  }))));
}

/* ===== Proof section ===== */
function ProofSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-proof",
    id: "proof"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-proof-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Proof \xB7 what Apple won't touch"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "The repairs other shops send to us.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "Real cases from the bench, last 90 days. Boards, not stock photos. Prices, not promises. Click any case for the full repair log.")), /*#__PURE__*/React.createElement("div", {
    className: "proof-grid"
  }, /*#__PURE__*/React.createElement("article", {
    className: "proof-case hp-reveal"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-img"
  }, /*#__PURE__*/React.createElement("img", {
    className: "proof-photo",
    src: "uploads/repair-scope.jpg",
    alt: "MacBook logic board under the stereo microscope"
  }), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-tag"
  }, "Apple: write-off"), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "swatch",
    style: {
      background: "#34d399"
    }
  }), "MBP 14\" \xB7 A2442 \xB7 4 days")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "proof-case-quote"
  }, "\"Backlight IC failure \u2014 exactly the chip Apple's logic-board swap covers up. We replaced it under the scope. Same Mac. Different bill.\""), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-numbers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num strike"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "Apple quote"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "\xA31,400")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num win"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "\xA3380")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "Saving"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "73%"))), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-foot"
  }, /*#__PURE__*/React.createElement("span", null, "Case #2026-0418"), /*#__PURE__*/React.createElement("a", {
    href: "Repair Case Study.html"
  }, "Read repair log \u2192")))), /*#__PURE__*/React.createElement("article", {
    className: "proof-case hp-reveal hp-reveal-d1"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-img"
  }, /*#__PURE__*/React.createElement("img", {
    className: "proof-photo",
    src: "uploads/repair-boardview.jpg",
    alt: "Board-level diagnosis with multimeter and boardview software"
  }), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-tag"
  }, "Two weeks in rice"), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "swatch",
    style: {
      background: "#f59e0b"
    }
  }), "MBA 13\" \xB7 liquid \xB7 6 days")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "proof-case-quote"
  }, "\"Coffee, then a fortnight of denial. We pulled the board, ultrasonic'd it, recovered the data, and reflowed three corroded IC pads.\""), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-numbers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num win"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "Recovered"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "100%")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "Repair"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "\xA3420"))), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-foot"
  }, /*#__PURE__*/React.createElement("span", null, "Case #2026-0331"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Read \u2192")))), /*#__PURE__*/React.createElement("article", {
    className: "proof-case hp-reveal hp-reveal-d2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-img"
  }, /*#__PURE__*/React.createElement("img", {
    className: "proof-photo",
    src: "uploads/repair-teardown.jpg",
    alt: "Opened MacBook with ESD strap during board access"
  }), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-tag"
  }, "\"Unfixable\" elsewhere"), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "swatch",
    style: {
      background: "#7dd3fc"
    }
  }), "MBP 13\" \xB7 Touch ID \xB7 2 days")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "proof-case-quote"
  }, "\"Touch ID dead after a third-party screen swap. Two shops gave up. We repaired the T2 pairing trace \u2014 back to fingerprint unlock.\""), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-numbers"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num win"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "Functional"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "Yes")), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, "Repair"), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, "\xA3190"))), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-foot"
  }, /*#__PURE__*/React.createElement("span", null, "Case #2026-0402"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Read \u2192"))))), /*#__PURE__*/React.createElement("div", {
    className: "proof-capabilities"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-capabilities-text"
  }, /*#__PURE__*/React.createElement("strong", null, "The capability stack."), /*#__PURE__*/React.createElement("p", null, "Every case above started with the same toolkit. Most repair shops can't do any of this \u2014 that's what \"specialist\" actually means.")), /*#__PURE__*/React.createElement("div", {
    className: "proof-cap-list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-cap-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-num"
  }, "40\xD7"), /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-label"
  }, "Stereo microscope \xB7 0201 components")), /*#__PURE__*/React.createElement("div", {
    className: "proof-cap-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-num"
  }, "220\xB0C"), /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-label"
  }, "Lead-free reflow \xB7 IC replacement")), /*#__PURE__*/React.createElement("div", {
    className: "proof-cap-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-num"
  }, "XRF"), /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-label"
  }, "Fault tracing \xB7 short-circuit isolation")), /*#__PURE__*/React.createElement("div", {
    className: "proof-cap-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-num"
  }, "ISO 9001"), /*#__PURE__*/React.createElement("span", {
    className: "proof-cap-label"
  }, "Repair log \xB7 audit trail"))))));
}

/* ===== Wizard section (when wizard isn't already in hero) ===== */
function WizardSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-wizard-section",
    id: "wizard-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-wizard-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Quote \xB7 60 seconds"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "Tell us your model. See your price.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "Most screen and battery repairs have a fixed price the moment we know the model. Microsoldering and liquid jobs need a free pre-diagnosis first \u2014 the wizard knows the difference.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-wizard-shell",
    id: "wizard"
  }, /*#__PURE__*/React.createElement(Wizard, {
    variant: "home",
    showFilters: true
  })), /*#__PURE__*/React.createElement("div", {
    className: "hp-wizard-aside"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-wizard-aside-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-num"
  }, "01 \xB7 Quote-ready?"), /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-title"
  }, "Get a price in 60 seconds."), /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-body"
  }, "Pick model, pick symptom, see the price. Book on the spot or save the quote for later.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-wizard-aside-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-num"
  }, "02 \xB7 Not sure yet?"), /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-title"
  }, "Walk us through the symptom."), /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-body"
  }, "Three quick questions. We route you to the right repair, the right article, or a real human.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-wizard-aside-item"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-num"
  }, "03 \xB7 Critical case?"), /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-title"
  }, "Talk to a specialist."), /*#__PURE__*/React.createElement("span", {
    className: "hp-wizard-aside-body"
  }, "Business-critical, time-critical, or \"Apple said unfixable.\" Skip the queue \u2014 go straight to a technician.")))));
}
Object.assign(window, {
  HomepageNav,
  HeroTrust,
  HeroWorkshop,
  HeroProof,
  HeroWizardInline,
  ProofSection,
  WizardSection,
  openDiagnose
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Homepage.jsx", error: String((e && e.message) || e) }); }

// icorrect/HomepageSections.jsx
try { (() => {
// Homepage sections 2+: Trust strip, Data safety, Price confidence,
// London access, Corporate doorway, FAQ. The hero + proof + wizard
// sections live in Homepage.jsx.

/* ===== Section 2: Trust band =============================================
   Ported from the collection page's TrustBand — #fafafa card, 4-up grid,
   icon boxes, dividers. Same component, same visual language.
   ====================================================================== */
function TrustStrip({
  reviewCount = 719,
  rating = 4.9
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "trust-band",
    style: {
      padding: "20px 0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "trust-band-inner",
    role: "list",
    style: {
      listStyle: "none",
      margin: 0,
      padding: "18px",
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "8px",
      background: "#fafafa",
      borderRadius: "14px",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("li", {
    className: "trust-item",
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      padding: "8px 14px",
      paddingLeft: "6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 30px var(--font-sans)",
      letterSpacing: "-1.2px",
      color: "#171717",
      fontFeatureSettings: '"tnum"',
      lineHeight: 1
    }
  }, rating), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "4px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: "2px"
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement("svg", {
    key: i,
    width: "14",
    height: "14",
    viewBox: "0 0 14 14"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z",
    fill: "#f5a623"
  })))), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px var(--font-sans)",
      color: "#666",
      whiteSpace: "nowrap"
    }
  }, reviewCount, " Google reviews"))), /*#__PURE__*/React.createElement(TrustItem, {
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 22 22",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "2.5",
      y: "3.5",
      width: "17",
      height: "11",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 18.5h6M11 14.5v4"
    })),
    title: "Apple parts",
    sub: "Calibrated in-house"
  }), /*#__PURE__*/React.createElement(TrustItem, {
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 22 22",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "6",
      y: "6",
      width: "10",
      height: "10",
      rx: "1.5"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8.5 4.5V2M11 4.5V2M13.5 4.5V2M8.5 20V17.5M11 20V17.5M13.5 20V17.5M4.5 8.5H2M4.5 11H2M4.5 13.5H2M20 8.5H17.5M20 11H17.5M20 13.5H17.5"
    })),
    title: "Microsoldering",
    sub: "Board-level repairs"
  }), /*#__PURE__*/React.createElement(TrustItem, {
    icon: /*#__PURE__*/React.createElement("svg", {
      width: "22",
      height: "22",
      viewBox: "0 0 22 22",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5",
      strokeLinejoin: "round"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M11 2.5l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6l7-2.5z"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M8 11l2.2 2.2L14.5 9"
    })),
    title: "2-yr warranty",
    sub: "Double the standard"
  }))));
}
function TrustItem({
  icon,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("li", {
    style: {
      display: "flex",
      gap: "12px",
      alignItems: "center",
      padding: "8px 14px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: "14%",
      bottom: "14%",
      width: "1px",
      background: "rgba(0,0,0,0.08)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: "36px",
      height: "36px",
      borderRadius: "8px",
      background: "#fff",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#171717",
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      font: "600 13px var(--font-sans)",
      letterSpacing: "-0.2px",
      color: "#171717",
      lineHeight: "1.25"
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px/1.35 var(--font-sans)",
      color: "#666"
    }
  }, sub)));
}
Object.assign(window, {
  TrustStrip
});

/* ===== Section 5: Data safety ============================================
   "Your data stays on your drive." Quiet, specific, no hype.
   ======================================================================== */
function DataSafetySection() {
  const items = [{
    num: "01",
    title: "Screen repairs never touch your drive",
    body: "The display is a separate assembly. We replace it without powering on — your data doesn't enter the equation."
  }, {
    num: "02",
    title: "GDPR-compliant workshop",
    body: "No passcodes requested unless post-repair testing requires it — and you can be present for that step. NDA on request for corporate clients."
  }, {
    num: "03",
    title: "No cloud, no sync",
    body: "Your device doesn't connect to our network. Diagnosis happens on an isolated bench with board-level tools, not software."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-datasafety"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Data & privacy"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "Your data stays on your device.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "We're board-level hardware specialists, not IT support. We don't need your passwords, we don't image your drive, and we don't plug your Mac into our network.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-datasafety-grid"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-datasafety-card hp-reveal hp-reveal-d" + (i + 1)
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-datasafety-num"
  }, it.num), /*#__PURE__*/React.createElement("h3", null, it.title), /*#__PURE__*/React.createElement("p", null, it.body))))));
}

/* ===== Section 6: Price confidence ======================================
   "What you're quoted is what you pay." Counters the industry's bait-and-switch reputation.
   ======================================================================== */
function PriceConfidenceSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-priceconf"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "The quote is the price. No surprises.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "We don't lowball to get you through the door and then discover \"additional damage.\" If diagnosis reveals something we didn't expect, we call you with an updated quote before touching anything.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-card hp-priceconf-card-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-label"
  }, "Fixed-price repairs"), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-value"
  }, "Screen, battery, rear glass \u2014 priced by model, not by mood.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-label"
  }, "Free pre-diagnosis"), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-value"
  }, "15 minutes on the scope. Written quote before any work. Walk away for free.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-label"
  }, "No hidden fees"), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-value"
  }, "The price includes parts, labour, calibration, QA, and a 2-year warranty. Collection and return are the only add-on."))), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare-head"
  }, /*#__PURE__*/React.createElement("span", null, "Why we're different from Apple")), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-row-compare"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-label"
  }, "Backlight IC failure"), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare-prices"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-theirs"
  }, "Apple: ", /*#__PURE__*/React.createElement("strong", null, "\xA31,400"), " ", /*#__PURE__*/React.createElement("em", null, "(full board swap)")), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-ours"
  }, "iCorrect: ", /*#__PURE__*/React.createElement("strong", null, "\xA3380"), " ", /*#__PURE__*/React.createElement("em", null, "(chip replacement)")))), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-row-compare"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-label"
  }, "MacBook Pro 14\" screen"), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare-prices"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-theirs"
  }, "Apple: ", /*#__PURE__*/React.createElement("strong", null, "\xA3669")), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-ours"
  }, "iCorrect: ", /*#__PURE__*/React.createElement("strong", null, "\xA3449"))))))));
}

/* ===== Section 7: London access ==========================================
   Walk-in, courier, mail-in. Three equal-weight paths.
   ======================================================================== */
function LondonAccessSection() {
  const paths = [{
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
    })),
    title: "Walk in",
    detail: "12 Margaret Street, Fitzrovia W1W 8JQ",
    meta: "Free · Mon–Fri · No appointment needed",
    body: "Opposite The London Palladium. Free diagnosis while you wait. Most screen and battery repairs returned same-day or next-day."
  }, {
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "1",
      y: "6",
      width: "22",
      height: "12",
      rx: "2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v.01"
    })),
    title: "Same-day courier",
    detail: "London postcodes only",
    meta: "+ £20 · Collected within 3 hours",
    body: "We send a tracked courier to your door. Your device is on the bench the same day, returned as soon as the repair's done."
  }, {
    icon: /*#__PURE__*/React.createElement("svg", {
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.5"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M16 2v4M8 2v4M3 10h18"
    })),
    title: "UK-wide mail-in",
    detail: "Pre-paid tracked shipping",
    meta: "+ £24 · Next-day collection kit",
    body: "We send you a pre-paid, insured shipping kit. Post it, we repair it, we courier it back. Same warranty, same quality."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-access"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Getting your device to us"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "Three ways in. One standard of repair.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "Walk in from Oxford Circus, send a London courier, or post it from anywhere in the UK. Every repair uses the same bench, the same parts, the same warranty.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-access-grid"
  }, paths.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-access-card hp-reveal hp-reveal-d" + (i + 1)
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-access-icon"
  }, p.icon), /*#__PURE__*/React.createElement("h3", {
    className: "hp-access-title"
  }, p.title), /*#__PURE__*/React.createElement("div", {
    className: "hp-access-detail"
  }, p.detail), /*#__PURE__*/React.createElement("div", {
    className: "hp-access-meta"
  }, p.meta), /*#__PURE__*/React.createElement("p", {
    className: "hp-access-body"
  }, p.body))))));
}

/* ===== Section 8: Corporate doorway =====================================
   Quiet, B2B-leaning. Dark band. "When it's business-critical."
   ======================================================================== */
function CorporateSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-corporate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-corporate-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow",
    style: {
      color: "#a3a3a3"
    }
  }, "Specialist & Corporate"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-corporate-title"
  }, "When it's business-critical,", /*#__PURE__*/React.createElement("br", null), "skip the queue."), /*#__PURE__*/React.createElement("p", {
    className: "hp-corporate-body"
  }, "Time-sensitive data recovery. Fleet repairs on retainer. The device Apple said was a write-off that your board presentation lives on. We handle the cases other shops won't touch \u2014 and we don't route you through a chatbot to get there."), /*#__PURE__*/React.createElement("ul", {
    className: "hp-corporate-list"
  }, /*#__PURE__*/React.createElement("li", null, "Priority bench slot \u2014 same-day or next-day turnaround"), /*#__PURE__*/React.createElement("li", null, "Dedicated technician, not a call centre"), /*#__PURE__*/React.createElement("li", null, "NDA, audit trail, GDPR-compliant handling"), /*#__PURE__*/React.createElement("li", null, "Fleet pricing for 5+ devices")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "hp-corporate-cta"
  }, "Talk to a specialist \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-aside"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-stat hp-reveal hp-reveal-d1"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-num"
  }, "94%"), /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-label"
  }, "Data recovered from \"dead\" Macs in 2025")), /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-stat hp-reveal hp-reveal-d2"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-num"
  }, "4 h"), /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-label"
  }, "Average turnaround on priority bench repairs")), /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-stat hp-reveal hp-reveal-d3"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-num"
  }, "NDA"), /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-label"
  }, "Signed on request for every corporate job")))));
}

/* ===== Section 9: FAQ + final CTA =======================================
   Working accordions. Top 6 questions.
   ======================================================================== */
const HP_FAQ_ITEMS = [{
  q: "How long does a repair take?",
  a: "Most screen and battery repairs are done in 1–2 working days. Walk in before 11am with a common repair and same-day turnaround is usually possible. Board-level work (backlight IC, liquid damage) takes 3–5 days because we need to scope, repair, and QA under the microscope."
}, {
  q: "Are the parts genuine Apple?",
  a: "Yes. We source original Apple displays and batteries — not aftermarket \"compatible\" parts. Every screen is True Tone calibrated in-house to factory standards. That's why we can warrant them for two years instead of the usual six months."
}, {
  q: "Is my data safe?",
  a: "Completely. Screen and battery repairs don't touch your storage at all. For board-level work, your device stays on an isolated bench — it never connects to our network. We sign NDAs for corporate clients on request, and we never ask for your passcode unless post-repair testing requires it."
}, {
  q: "What does the 2-year warranty cover?",
  a: "Every part we fit and the labour to install it. If anything we touched fails inside 24 months, we fix it free — no diagnostic fee, no \"goodwill\" negotiation. Accidental damage isn't covered, but we'll always quote fairly for re-repairs."
}, {
  q: "Do I need to book, or can I walk in?",
  a: "Either. Walk in Mon–Fri (Mon–Thu 9–6, Fri 10–6) for a free diagnosis and written quote. Booking via the wizard reserves a bench slot and is usually faster — particularly for board-level work or if you want same-day courier collection."
}, {
  q: "What if Apple says it's unfixable?",
  a: "That's what we specialise in. \"Unfixable\" at Apple usually means they've quoted a full logic-board replacement because they don't repair at the chip level. We do. Backlight IC failures, liquid damage recovery, T2/Touch ID pairing faults — these are routine for us. Bring it in or send it over, and we'll scope it for free."
}];
function HomepageFAQ() {
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-faq",
    id: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-faq-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-faq-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Frequently asked"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "Questions, answered honestly."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 16px/1.55 var(--font-sans)",
      color: "#4d4d4d",
      marginTop: 16,
      textWrap: "pretty"
    }
  }, "If your question isn't here, call ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517",
    style: {
      color: "#171717",
      fontWeight: 500
    }
  }, "+44 (0)207 099 8517"), " or drop in \u2014 we're opposite The London Palladium.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-faq-right"
  }, HP_FAQ_ITEMS.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-faq-item" + (open === i ? " is-open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "hp-faq-q",
    onClick: () => setOpen(open === i ? -1 : i)
  }, /*#__PURE__*/React.createElement("span", null, it.q), /*#__PURE__*/React.createElement("span", {
    className: "hp-faq-icon",
    "aria-hidden": "true"
  }, "+")), open === i && /*#__PURE__*/React.createElement("div", {
    className: "hp-faq-a"
  }, it.a))))));
}

/* ===== Final CTA + Footer =============================================== */
function FinalCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-finalcta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-finalcta-inner"
  }, /*#__PURE__*/React.createElement("h2", null, "Ready to get it fixed?"), /*#__PURE__*/React.createElement("p", null, "Tell us your device and the symptom. See your price in 60 seconds \u2014 or let us diagnose it for free."), /*#__PURE__*/React.createElement("div", {
    className: "hp-finalcta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#wizard",
    className: "hp-cta hp-cta-primary hp-cta-lg"
  }, "Get a quote ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("a", {
    href: "#diagnose",
    onClick: openDiagnose,
    className: "hp-cta hp-cta-secondary hp-cta-lg"
  }, "Help me diagnose ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))));
}
function HomepageFooter() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "hp-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-footer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-footer-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo",
    style: {
      color: "#fff",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo-mark",
    style: {
      background: "#fff",
      color: "#171717"
    }
  }, "iC"), "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-tag"
  }, "Apple repair specialists \xB7 Fitzrovia, London")), /*#__PURE__*/React.createElement("div", {
    className: "hp-footer-cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-col-title"
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "iPhone"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "MacBook"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "iPad"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Apple Watch")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-col-title"
  }, "Company"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Why us"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Corporate"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "How it works"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Contact")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-col-title"
  }, "Legal"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Warranty"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms")))), /*#__PURE__*/React.createElement("div", {
    className: "container hp-footer-base"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 iCorrect Ltd. Not affiliated with Apple Inc."), /*#__PURE__*/React.createElement("span", null, "Company No. 09392844 \xB7 VAT GB 203495788")));
}
Object.assign(window, {
  TrustStrip,
  DataSafetySection,
  PriceConfidenceSection,
  LondonAccessSection,
  CorporateSection,
  HomepageFAQ,
  FinalCTA,
  HomepageFooter
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/HomepageSections.jsx", error: String((e && e.message) || e) }); }

// icorrect/HowItWorks.jsx
try { (() => {
// How It Works page — all section components
// Voice: clear, simple, reassuring. Remove friction. Make the process feel effortless.

function HIWHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hiw-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hiw-hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "How it works"), /*#__PURE__*/React.createElement("h1", null, "Get a quote. Book in. We handle the rest."), /*#__PURE__*/React.createElement("p", null, "Whether you walk in, send a courier, or post your device \u2014 the process is the same. Simple, transparent, and backed by a 2-year warranty."), /*#__PURE__*/React.createElement("div", {
    className: "hiw-hero-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "MacBook Screen Collection.html",
    className: "btn btn-dark btn-lg"
  }, "Get an instant quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517",
    className: "btn btn-light btn-lg"
  }, "Call us"))));
}
function ThreeStepsSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hiw-steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Three steps"), /*#__PURE__*/React.createElement("h2", null, "From broken to fixed \u2014 here's the full picture."), /*#__PURE__*/React.createElement("p", null, "Every repair follows the same path. No surprises, no hidden stages, no waiting in the dark for a callback.")), /*#__PURE__*/React.createElement("div", {
    className: "hiw-steps-grid hiw-steps-grid-with-arrows"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-num"
  }, "1"), /*#__PURE__*/React.createElement("h3", null, "Get your quote"), /*#__PURE__*/React.createElement("p", null, "Tell us your device and what's wrong. You'll see a fixed price instantly \u2014 or if it needs diagnosis, we'll inspect it for free and quote before any work begins."), /*#__PURE__*/React.createElement("ul", {
    className: "hiw-step-detail"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Instant online pricing for standard repairs")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Free in-person or mail-in diagnosis for complex issues")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Written quote \u2014 no obligation, no pressure")))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-arrow",
    "aria-hidden": "true"
  }, "\u2192"), /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-num"
  }, "2"), /*#__PURE__*/React.createElement("h3", null, "Book your device in"), /*#__PURE__*/React.createElement("p", null, "Choose how you'd like to get your device to us \u2014 walk in, same-day London courier, or post it from anywhere in the UK. Pick a date and time that works for you."), /*#__PURE__*/React.createElement("ul", {
    className: "hiw-step-detail"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Walk-in appointments or drop-in \u2014 your choice")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Same-day courier collection within London")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Pre-paid Royal Mail label for UK-wide posting")))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-arrow",
    "aria-hidden": "true"
  }, "\u2192"), /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-step-num"
  }, "3"), /*#__PURE__*/React.createElement("h3", null, "We take care of everything"), /*#__PURE__*/React.createElement("p", null, "Your device goes straight to the bench. We repair it with genuine parts, calibrate it, run a 30-point QA check, and return it \u2014 with a 2-year warranty and a full report."), /*#__PURE__*/React.createElement("ul", {
    className: "hiw-step-detail"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Timestamped bench photos at each stage")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "SMS updates so you always know where it's at")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "tick"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Collect in person or tracked return delivery")))))));
}
function ServicesSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hiw-services"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Our services"), /*#__PURE__*/React.createElement("h2", null, "Three ways we can help."), /*#__PURE__*/React.createElement("p", null, "Most repairs fall into one of these categories. Not sure which you need? That's fine \u2014 start with a free diagnosis and we'll tell you exactly what's going on.")), /*#__PURE__*/React.createElement("div", {
    className: "hiw-services-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-banner hiw-service-banner-blue"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-body"
  }, /*#__PURE__*/React.createElement("h3", null, "Standard repairs"), /*#__PURE__*/React.createElement("p", null, "The fix is known, the price is fixed, and we have the parts in stock. Cracked screens, dead batteries, broken keyboards, faulty speakers \u2014 these are our bread and butter."), /*#__PURE__*/React.createElement("ul", {
    className: "hiw-service-includes"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-blue"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Fixed pricing"), " \u2014 you see the cost before you commit")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-blue"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Genuine Apple parts"), " calibrated in-house")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-blue"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "1\u20132 day turnaround"), " for most repairs")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-blue"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "2-year warranty"), " on parts and labour"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-price"
  }, "From ", /*#__PURE__*/React.createElement("strong", null, "\xA379"), " \xB7 fixed price per repair"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-banner hiw-service-banner-green"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-body"
  }, /*#__PURE__*/React.createElement("h3", null, "Diagnostics"), /*#__PURE__*/React.createElement("p", null, "Something's wrong but you're not sure what. We'll inspect your device on the bench, identify the fault at the component level, and give you a written quote \u2014 before any work starts."), /*#__PURE__*/React.createElement("ul", {
    className: "hiw-service-includes"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-green"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Bench inspection"), " \u2014 thorough component-level diagnosis")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-green"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Component-level fault finding"), " using microscopy and schematics")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-green"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Written quote"), " with a clear explanation of the issue")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-green"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\xA30 if we can't fix it"), " \u2014 you only pay for a successful repair"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-price"
  }, /*#__PURE__*/React.createElement("strong", null, "\xA349"), " \xB7 no obligation to proceed"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-banner hiw-service-banner-amber"
  }), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-body"
  }, /*#__PURE__*/React.createElement("h3", null, "Liquid damage"), /*#__PURE__*/React.createElement("p", null, "Spills, splashes, full submersion \u2014 liquid damage needs specialist attention fast. We ultrasonically clean the board, trace the corrosion, and replace only the components that failed."), /*#__PURE__*/React.createElement("ul", {
    className: "hiw-service-includes"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-amber"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Ultrasonic board cleaning"), " to remove corrosion")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-amber"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Microscopy inspection"), " to map the damage path")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-amber"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Targeted component replacement"), " \u2014 not a full board swap")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "dot dot-amber"
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Data recovery"), " available if the board can't be saved"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-service-price"
  }, "From ", /*#__PURE__*/React.createElement("strong", null, "\xA3149"), " \xB7 quoted after inspection"))))));
}
function DeliveryMethodsSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hiw-delivery"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Getting your device to us"), /*#__PURE__*/React.createElement("h2", null, "Walk in. Send a courier. Or post it."), /*#__PURE__*/React.createElement("p", null, "Three ways to get your device onto our bench \u2014 pick the one that suits you. The repair process is the same regardless.")), /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 19v-7a8 8 0 0116 0v7"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 19h16"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "12",
    width: "6",
    height: "7",
    rx: "1"
  })))), /*#__PURE__*/React.createElement("h3", null, "Walk in"), /*#__PURE__*/React.createElement("p", null, "Drop into our Fitzrovia workshop \u2014 no appointment needed for a free diagnosis. Book ahead through our wizard to reserve a bench slot and skip the queue."), /*#__PURE__*/React.createElement("dl", {
    className: "hiw-delivery-details"
  }, /*#__PURE__*/React.createElement("dt", null, "Where"), /*#__PURE__*/React.createElement("dd", null, "12 Margaret St, London W1W 8JQ"), /*#__PURE__*/React.createElement("dt", null, "Hours"), /*#__PURE__*/React.createElement("dd", null, "Mon\u2013Thu 9am\u20136pm, Fri 10am\u20136pm"), /*#__PURE__*/React.createElement("dt", null, "Cost"), /*#__PURE__*/React.createElement("dd", null, "Free"), /*#__PURE__*/React.createElement("dt", null, "Best for"), /*#__PURE__*/React.createElement("dd", null, "London-based, same-day turnaround"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "6",
    width: "12",
    height: "10",
    rx: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M14 9h4l2 3v4h-6V9z"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "6",
    cy: "18",
    r: "2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "18",
    cy: "18",
    r: "2"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "hiw-delivery-badge hiw-delivery-badge-popular"
  }, "Popular")), /*#__PURE__*/React.createElement("h3", null, "London courier"), /*#__PURE__*/React.createElement("p", null, "We send a same-day courier to your door \u2014 tracked, insured, and door-to-door. Pick a date and a 3-hour collection window that works for you."), /*#__PURE__*/React.createElement("dl", {
    className: "hiw-delivery-details"
  }, /*#__PURE__*/React.createElement("dt", null, "Coverage"), /*#__PURE__*/React.createElement("dd", null, "Central London (zones 1\u20133)"), /*#__PURE__*/React.createElement("dt", null, "Collection"), /*#__PURE__*/React.createElement("dd", null, "Same day, 3-hour window"), /*#__PURE__*/React.createElement("dt", null, "Cost"), /*#__PURE__*/React.createElement("dd", null, "\xA320 \u2014 tracked and insured"), /*#__PURE__*/React.createElement("dt", null, "Best for"), /*#__PURE__*/React.createElement("dd", null, "London professionals, corporate fleets"))), /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-card-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-delivery-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "3",
    y: "6",
    width: "16",
    height: "12",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M3 6l8 6 8-6"
  }))), /*#__PURE__*/React.createElement("span", {
    className: "hiw-delivery-badge hiw-delivery-badge-soon"
  }, "Intl. soon")), /*#__PURE__*/React.createElement("h3", null, "Mail it in"), /*#__PURE__*/React.createElement("p", null, "Post your device from anywhere in the UK using our pre-paid Royal Mail Special Delivery label. International shipping is coming soon \u2014 register your interest."), /*#__PURE__*/React.createElement("dl", {
    className: "hiw-delivery-details"
  }, /*#__PURE__*/React.createElement("dt", null, "Coverage"), /*#__PURE__*/React.createElement("dd", null, "UK-wide (international soon)"), /*#__PURE__*/React.createElement("dt", null, "Delivery"), /*#__PURE__*/React.createElement("dd", null, "Next-day Royal Mail Special Delivery"), /*#__PURE__*/React.createElement("dt", null, "Cost"), /*#__PURE__*/React.createElement("dd", null, "\xA324 \u2014 pre-paid label included"), /*#__PURE__*/React.createElement("dt", null, "Best for"), /*#__PURE__*/React.createElement("dd", null, "Outside London, remote workers"))))));
}
function OnTheBenchSection() {
  const steps = [{
    num: "1",
    title: "Intake & inspection",
    body: "We log your device, photograph its condition, and run a preliminary diagnostic on the bench. If you're walking in, we do this with you — takes about 30 minutes.",
    time: "30 min"
  }, {
    num: "2",
    title: "Fault confirmation & quote",
    body: "We identify the specific fault — at the component level where needed — and confirm or refine your quote. For standard repairs, the price won't change. For diagnostic cases, this is where you get your written quote.",
    time: "Included"
  }, {
    num: "3",
    title: "Repair",
    body: "Work happens on our own bench in Fitzrovia — never outsourced. Screen assemblies are replaced with the hinge and antenna carefully transferred. Board-level repairs are done under a stereo microscope with lead-free solder.",
    time: "1–2 days"
  }, {
    num: "4",
    title: "Calibration",
    body: "Every display is True Tone calibrated against a reference colour sensor, brightness-matched, and colour-profile checked. Non-screen repairs get a hardware function pass instead.",
    time: "45 min"
  }, {
    num: "5",
    title: "30-point QA",
    body: "Brightness uniformity, touch response, keyboard, trackpad, speakers, camera, microphones, Wi-Fi throughput, Bluetooth, battery health, sensor checks. Everything gets tested. Anything that fails gets addressed.",
    time: "45 min"
  }, {
    num: "✓",
    title: "Ready — collect or delivered",
    body: "We text you the moment QA passes. Walk-in customers can collect the same day; courier and mail-in customers get a tracked return delivery. Every repair ships with your QA report and 2-year warranty.",
    time: "Same day"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "hiw-bench"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "On the bench"), /*#__PURE__*/React.createElement("h2", null, "What happens between \"drop-off\" and \"fixed.\""), /*#__PURE__*/React.createElement("p", null, "Here's exactly what your device goes through once it's in our hands. No grey areas \u2014 we send you timestamped photos at each stage.")), /*#__PURE__*/React.createElement("div", {
    className: "hiw-bench-timeline"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hiw-bench-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hiw-bench-marker"
  }, s.num), /*#__PURE__*/React.createElement("div", {
    className: "hiw-bench-body"
  }, /*#__PURE__*/React.createElement("h4", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body), /*#__PURE__*/React.createElement("div", {
    className: "hiw-bench-time"
  }, s.time)))))));
}
function HIWCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hiw-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hiw-cta-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Ready to start?"), /*#__PURE__*/React.createElement("h2", null, "Your repair is 60 seconds away."), /*#__PURE__*/React.createElement("p", null, "Tell us your device and what's wrong. You'll see a price, pick a date, and book \u2014 with genuine Apple parts, a 2-year warranty, and a free diagnosis if we need to look first."), /*#__PURE__*/React.createElement("div", {
    className: "hiw-cta-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "MacBook Screen Collection.html",
    className: "btn btn-dark btn-lg"
  }, "Get an instant quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517",
    className: "btn btn-light btn-lg"
  }, "+44 (0)207 099 8517")), /*#__PURE__*/React.createElement("div", {
    className: "hiw-cta-trust"
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "4.9"), " \xB7 719 Google reviews"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "2-year"), " warranty"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Genuine"), " Apple parts"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\xA30"), " if we can't fix it"))));
}
function HIWBreadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "How It Works")));
}
Object.assign(window, {
  HIWHero,
  ThreeStepsSection,
  ServicesSection,
  DeliveryMethodsSection,
  OnTheBenchSection,
  HIWCTA,
  HIWBreadcrumb
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/HowItWorks.jsx", error: String((e && e.message) || e) }); }

// icorrect/InfoSections.jsx
try { (() => {
// Content sections: Process, Parts, Warranty. Placed between product grid and FAQ.
// Vercel voice: confident, specific, quantified. No hype words.

function ProcessSection() {
  const steps = [{
    label: "01",
    title: "Free Pre-diagnosis",
    time: "30 min",
    body: "Walk in or ship your MacBook. We inspect the display, test backlight channels on the scope, and check for related damage — hinge flex, logic board shorts, Stage Light. You get a written quote before anything is opened."
  }, {
    label: "02",
    title: "Repair on the bench",
    time: "1–2 days",
    body: "Work happens in our Fitzrovia workshop — never sent out. Screen assemblies are replaced with the hinge and antenna transferred to the new unit; backlight IC replacements are done under a stereo microscope with lead-free solder."
  }, {
    label: "03",
    title: "Calibration & QA",
    time: "45 min",
    body: "Every repair is True-Tone calibrated against a reference sensor, colour-profile matched, and run through a 30-point QA pass — brightness uniformity, touch-bar response, keyboard, speakers, camera, Wi-Fi throughput."
  }, {
    label: "04",
    title: "Collection or courier",
    time: "Same day",
    body: "Collect in person (Mon–Fri) or opt for insured next-day courier back to you. Every repair ships with a printed QA report, the 2-year warranty card, and the original (or recycled) parts if you want them returned."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "info info-process"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Our process"), /*#__PURE__*/React.createElement("h2", null, "What happens between \"drop-off\" and \"fixed\"."), /*#__PURE__*/React.createElement("p", null, "Four stages. No grey area. You'll know where your Mac is at every step \u2014 we send timestamped photos from the bench when the display comes off.")), /*#__PURE__*/React.createElement("ol", {
    className: "process-grid"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "process-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "process-step-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "process-step-num"
  }, s.label), /*#__PURE__*/React.createElement("span", {
    className: "process-step-time"
  }, s.time)), /*#__PURE__*/React.createElement("h3", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body))))));
}
function PartsSection() {
  const facts = [{
    k: "Source",
    v: "Genuine Apple LCD & OLED assemblies — reclaimed from first-party stock, not aftermarket."
  }, {
    k: "Calibration",
    v: "Every display factory-matched for colour temperature, gamma, and True Tone before it leaves the bench."
  }, {
    k: "What's new",
    v: "LCD panel, backlight driver, digitizer cable, hinge covers, adhesive perimeter. Camera and antenna transferred."
  }, {
    k: "What's recycled",
    v: "Your original LCD is stripped for recoverable components. You can request the carcass back at collection."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "info info-parts"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container info-parts-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-parts-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Parts & materials"), /*#__PURE__*/React.createElement("h2", null, "Apple OEM displays, recalibrated in-house."), /*#__PURE__*/React.createElement("p", null, "Aftermarket \"compatible\" screens cost less up front and fail inside 18 months \u2014 lower brightness, off-white point, dead True Tone. We don't fit them. Every screen we install is a genuine Apple assembly, tested against a reference panel, and warrantied for two years."), /*#__PURE__*/React.createElement("dl", {
    className: "info-parts-dl"
  }, facts.map((f, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("dt", null, f.k), /*#__PURE__*/React.createElement("dd", null, f.v))))), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-parts-card-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mono-label",
    style: {
      color: "#666"
    }
  }, "Supply chain"), /*#__PURE__*/React.createElement("span", {
    className: "info-badge"
  }, "Verified")), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-chain"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node-title"
  }, "Apple authorised stock"), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node-body"
  }, "First-party LCD / mini-LED assemblies, sealed.")), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-arrow",
    "aria-hidden": "true"
  }, "\u2193"), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node-title"
  }, "Recalibration bench"), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node-body"
  }, "White-point, gamma, True Tone profile flashed.")), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-arrow",
    "aria-hidden": "true"
  }, "\u2193"), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node-title"
  }, "Your MacBook"), /*#__PURE__*/React.createElement("div", {
    className: "info-parts-node-body"
  }, "Fitted, QA'd, returned with a 2-year warranty."))))));
}
function WarrantySection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "info info-warranty"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Warranty & standards"), /*#__PURE__*/React.createElement("h2", null, "Two years of cover. No asterisks."), /*#__PURE__*/React.createElement("p", null, "Apple's own out-of-warranty screen repair runs 90 days. Most London repair shops offer 6 or 12 months. We warrant every MacBook screen we fit for 24 months \u2014 parts, labour, and any re-work.")), /*#__PURE__*/React.createElement("div", {
    className: "warranty-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "warranty-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "warranty-num"
  }, "24 mo"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-label"
  }, "Warranty period"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-body"
  }, "Against functional defect of the display assembly we fitted. Covers parts, labour, and return shipping.")), /*#__PURE__*/React.createElement("div", {
    className: "warranty-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "warranty-num"
  }, "0"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-label"
  }, "Excess on re-work"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-body"
  }, "If anything we touched fails inside warranty, we fix it free. No diagnostic fee, no \"goodwill\" bargaining.")), /*#__PURE__*/React.createElement("div", {
    className: "warranty-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "warranty-num"
  }, "48 h"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-label"
  }, "Warranty turnaround"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-body"
  }, "Priority bench slot if a warrantied repair fails. Drop in or use our pre-paid courier label.")), /*#__PURE__*/React.createElement("div", {
    className: "warranty-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "warranty-num"
  }, "ISO 9001"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-label"
  }, "Workshop standard"), /*#__PURE__*/React.createElement("div", {
    className: "warranty-body"
  }, "Repair log, torque spec, calibration reference for every job. Corporate clients get the audit trail on request.")))));
}
Object.assign(window, {
  ProcessSection,
  PartsSection,
  WarrantySection
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/InfoSections.jsx", error: String((e && e.message) || e) }); }

// icorrect/MacBookRepairs.jsx
try { (() => {
// MacBook Repairs pillar page — all section components
// Deep SEO pillar: inform → prove → quote → convert
// Voice: authoritative but accessible. Explain the technical simply.

function MBRBreadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Repairs"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "MacBook Repairs")));
}

/* ── Hero ──────────────────────────────────────────────────────────────── */
function MBRHero({
  accentColor = "#6B9E8A",
  accentStyle = "filled"
}) {
  const diagBtnStyle = accentStyle === "filled" ? {
    background: accentColor,
    color: "#fff",
    boxShadow: "none"
  } : {
    background: "transparent",
    color: accentColor,
    boxShadow: `0 0 0 2px ${accentColor}`
  };
  const goToQuote = e => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("mbr:set-mode", {
      detail: "quote"
    }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({
      top: el.offsetTop - 40,
      behavior: "smooth"
    });
  };
  const goToDiagnose = e => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("mbr:set-mode", {
      detail: "diagnose"
    }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({
      top: el.offsetTop - 40,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("section", {
    className: "mbr-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Fitzrovia, London \xB7 Walk-ins welcome"), /*#__PURE__*/React.createElement("h1", null, "MacBook Repair Specialists."), /*#__PURE__*/React.createElement("p", null, "Board-level diagnostics and component repairs for every MacBook model. Screens, batteries, liquid damage, keyboards, charging faults, and logic board failures \u2014 repaired to original factory standards with genuine Apple parts and a 2-year warranty."), /*#__PURE__*/React.createElement("div", {
    className: "mbr-hero-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#mbr-wizard",
    className: "btn btn-dark btn-lg",
    onClick: goToQuote
  }, "Get an instant quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "#mbr-wizard",
    className: "btn btn-lg",
    style: diagBtnStyle,
    onClick: goToDiagnose
  }, "Help me diagnose \u2192")))));
}

/* ── Repair types ──────────────────────────────────────────────────────── */
const REPAIR_TYPES = [{
  title: "Screen repair",
  body: "Cracked, dead, flickering, or Stage Light effect. We replace the display assembly using genuine Apple panels, recalibrated in-house. True Tone, full brightness, original colour accuracy preserved.",
  price: "from £299",
  icon: "screen"
}, {
  title: "Battery replacement",
  body: "Swollen, degraded, or not holding charge. We remove the old cell safely, fit a genuine replacement, and recalibrate the battery management system so macOS reports accurate health.",
  price: "from £179",
  icon: "battery"
}, {
  title: "Liquid damage",
  body: "Spills, condensation, or submersion. We strip the board, ultrasonically clean every component, then diagnose and replace corroded ICs at component level. The faster you bring it in, the more we can save.",
  price: "from £249",
  icon: "liquid"
}, {
  title: "Power diagnostics",
  body: "Won't turn on, random shutdowns, or no charge. We trace the power delivery path from the USB-C port through the charging IC, power rails, and CPU power management to find the exact failure point.",
  price: "£49",
  icon: "power"
}, {
  title: "Keyboard repair",
  body: "Dead keys, sticky butterfly mechanism, or full keyboard failure. We repair or replace the top case assembly and test every key. Backlight functionality fully restored.",
  price: "from £199",
  icon: "keyboard"
}, {
  title: "Trackpad repair",
  body: "Unresponsive, phantom clicks, or physical damage. Often caused by battery swelling pressing against the trackpad. We replace the trackpad and address the root cause.",
  price: "from £149",
  icon: "trackpad"
}, {
  title: "Charging port",
  body: "USB-C port not recognising cables, intermittent charging, or physical damage. We replace the port assembly or, where possible, repair the individual port at board level.",
  price: "from £129",
  icon: "port"
}];
function MBRTypeIcon({
  type
}) {
  const s = {
    width: 22,
    height: 22,
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (type) {
    case "screen":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "3",
        width: "18",
        height: "13",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 19h8M11 16v3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 8l4 4M14 8l-4 4",
        strokeOpacity: "0.4"
      }));
    case "battery":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "7",
        width: "14",
        height: "8",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M19 10v2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 11h4M9 9v4"
      }));
    case "liquid":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("path", {
        d: "M11 3c-3 4.5-6 7.5-6 10.5a6 6 0 0012 0c0-3-3-6-6-10.5z"
      }));
    case "power":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("path", {
        d: "M13 2L7 12h4l-2 8 8-12h-5l1-6z"
      }));
    case "keyboard":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "2",
        y: "6",
        width: "18",
        height: "10",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 13h10M6 10h2M10 10h2M14 10h2"
      }));
    case "trackpad":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "3",
        width: "14",
        height: "16",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 13h14"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "8",
        r: "2"
      }));
    case "port":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "8",
        width: "10",
        height: "6",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M3 11h3M16 11h3M9 8V5M13 8V5"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
      }));
  }
}
function MBRTypes() {
  const handleQuote = e => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("mbr:set-mode", {
      detail: "quote"
    }));
    const el = document.getElementById("mbr-wizard");
    if (el) window.scrollTo({
      top: el.offsetTop - 40,
      behavior: "smooth"
    });
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "mbr-types",
    className: "mbr-types"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Repair services"), /*#__PURE__*/React.createElement("h2", null, "Every MacBook repair we offer."), /*#__PURE__*/React.createElement("p", null, "From common part swaps to advanced board-level microsoldering. All repairs use genuine Apple parts and carry a 2-year warranty.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-types-grid"
  }, REPAIR_TYPES.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mbr-type-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-icon"
  }, /*#__PURE__*/React.createElement(MBRTypeIcon, {
    type: r.icon
  })), /*#__PURE__*/React.createElement("h3", null, r.title), /*#__PURE__*/React.createElement("p", null, r.body), /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-price"
  }, r.price), /*#__PURE__*/React.createElement("a", {
    href: "#mbr-wizard",
    className: "mbr-type-cta",
    onClick: handleQuote
  }, "Get a quote \u2192")))), /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-card mbr-type-card-diag"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-icon"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "11",
    r: "8"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M11 7v5M11 15h.01"
  }))), /*#__PURE__*/React.createElement("h3", null, "Not sure what's wrong?"), /*#__PURE__*/React.createElement("p", null, "Don't worry \u2014 most people aren't. Book a \xA349 diagnostic and we'll identify the exact fault, give you a written quote, and only proceed if you approve. The fee is deducted from the repair cost."), /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-type-price"
  }, "\xA349 ", /*#__PURE__*/React.createElement("span", null, "diagnostic")), /*#__PURE__*/React.createElement("a", {
    href: "#mbr-wizard",
    className: "mbr-type-cta",
    onClick: e => {
      e.preventDefault();
      window.dispatchEvent(new CustomEvent("mbr:set-mode", {
        detail: "diagnose"
      }));
      const el = document.getElementById("mbr-wizard");
      if (el) window.scrollTo({
        top: el.offsetTop - 40,
        behavior: "smooth"
      });
    }
  }, "Book diagnostic \u2192"))))));
}

/* ── Specialist section — narrative, not comparison ─────────────────────── */
function MBRSpecialist() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mbr-specialist"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "What board-level repair means"), /*#__PURE__*/React.createElement("h2", null, "We find the failed chip. Not the failed board.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-story"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-scenario"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-scenario-label"
  }, "A real scenario"), /*#__PURE__*/React.createElement("p", {
    className: "mbr-spec-scenario-text"
  }, "Your MacBook Pro won't turn on. You take it to Apple. They run their diagnostic, tell you the logic board has failed, and quote you ", /*#__PURE__*/React.createElement("strong", null, "\xA31,000+"), " for a full board replacement. Your data? Gone \u2014 it's on the old board."), /*#__PURE__*/React.createElement("p", {
    className: "mbr-spec-scenario-text"
  }, "You bring it to us. We put the board under a thermal camera and find a single failed charging IC \u2014 a chip smaller than your fingernail. We remove it, solder a replacement, and your MacBook powers on. Same board. Same data. ", /*#__PURE__*/React.createElement("strong", null, "\xA3400\u2013500"), ".")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-num"
  }, "50\u201360%"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-label"
  }, "less than Apple's quote"), /*#__PURE__*/React.createElement("p", null, "Because we replace a \xA34 component, not a \xA3600 board. The saving scales across every logic board repair we do.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-num"
  }, "85%+"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-label"
  }, "of \"unrepairable\" devices fixed"), /*#__PURE__*/React.createElement("p", null, "When Apple or another shop says it can't be repaired, they mean they can't repair it at their level. We work at circuit level \u2014 schematics, boardview, multimeter, thermal imaging.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-num"
  }, "100%"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-spec-why-label"
  }, "data preserved"), /*#__PURE__*/React.createElement("p", null, "We repair the board your data lives on. No swap, no wipe, no migration. Your files, settings, and accounts stay exactly where they are."))))));
}

/* ── Case study — real liquid damage recovery ──────────────────────────── */
function MBRCaseStudy() {
  return /*#__PURE__*/React.createElement("section", {
    className: "mbr-case"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container mbr-case-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-story"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Real repair \xB7 Liquid damage"), /*#__PURE__*/React.createElement("h2", null, "A MacBook Pro full of Coke. Apple said replace it. We saved it."), /*#__PURE__*/React.createElement("p", null, "A client came to us after spilling a full glass of Coca-Cola across their MacBook Pro 14\". They'd taken it to Apple first. ", /*#__PURE__*/React.createElement("strong", null, "Apple's verdict: logic board replacement, \xA31,100+, data wiped, 7\u201310 days.")), /*#__PURE__*/React.createElement("p", null, "They brought it to us the next morning. We stripped the board within an hour, ran it through ultrasonic cleaning to dissolve the sugar residue and corrosion, then inspected every IC under magnification. Three components had corroded \u2014 the charging IC, a power MOSFET, and a USB-C retimer. We replaced all three at board level."), /*#__PURE__*/React.createElement("p", null, /*#__PURE__*/React.createElement("strong", null, "The MacBook powered on with all data intact."), " Total repair time: 2 days. Total cost: a fraction of Apple's quote. The client left a 5-star Google review."), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-urgency"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-urgency-icon"
  }, "\u23F1"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-urgency-text"
  }, /*#__PURE__*/React.createElement("strong", null, "With liquid damage, speed is everything."), " Corrosion starts within hours. The faster you get your MacBook to us, the more components we can save \u2014 and the cheaper the repair. Don't dry it out and wait. Bring it in."))), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-proof"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-review"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-review-stars"
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("blockquote", null, "\"Spilled an entire Coke on my MacBook Pro. Apple told me it was beyond repair and quoted over a thousand pounds for a replacement board. iCorrect had it back to me in two days, fully working, with all my data. Genuinely can't recommend them enough.\""), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-review-author"
  }, "Verified client"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-review-source"
  }, /*#__PURE__*/React.createElement("span", null, "\u2605"), " Google Review")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-breakdown"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Repair breakdown"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-breakdown-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-label"
  }, "Diagnostic & ultrasonic clean"), /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-value"
  }, "\xA349")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-breakdown-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-label"
  }, "Charging IC replacement"), /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-value"
  }, "\xA3180")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-breakdown-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-label"
  }, "Power MOSFET + USB-C retimer"), /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-value"
  }, "\xA3220")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-breakdown-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-label"
  }, "Apple's quote"), /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-value",
    style: {
      color: "#808080",
      textDecoration: "line-through"
    }
  }, "\xA31,100+")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-case-breakdown-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-label"
  }, "iCorrect total"), /*#__PURE__*/React.createElement("span", {
    className: "mbr-case-breakdown-value"
  }, "\xA3449"))), /*#__PURE__*/React.createElement("a", {
    href: "#mbr-wizard",
    className: "btn btn-dark btn-lg mbr-case-cta",
    style: {
      textAlign: "center"
    }
  }, "Spilled something? Get help now \u2192"))));
}

/* ── Common faults explained (deep SEO content) ────────────────────────── */
const FAULTS = [{
  title: "Cracked or broken screen",
  subtitle: "The most common MacBook repair — and the one most often overpriced.",
  whatHappens: "A MacBook display is a layered sandwich: the outer glass, the LCD panel, the backlight sheet, and a metal frame. When the glass cracks, it usually damages the LCD beneath it too — which is why you'll see black patches, colour bleeding, or lines alongside the crack. The display still technically works, but the damage spreads over time as the cracked glass flexes.",
  howWeRepair: "We replace the entire display assembly — glass, LCD, and backlight — as a single calibrated unit. Every replacement is a genuine Apple panel, recalibrated in-house so True Tone, auto-brightness, and full colour accuracy work exactly as they did from factory. The repair takes 1–2 hours once the part is matched.",
  signs: ["Visible cracks or shatter marks", "Black patches or colour bleeding", "Lines across part of the screen", "Touch Bar still works but main display is damaged"]
}, {
  title: "Stage Light effect",
  subtitle: "A backlight cable failure unique to MacBook Pro models — Apple's most notorious design flaw.",
  whatHappens: "On MacBook Pro models from 2016–2020, the backlight flex cable runs over the display hinge. Every time you open and close the lid, the cable flexes. Over thousands of cycles, the cable fatigues and the backlight LEDs start failing from the bottom up. You'll see bright spotlights at the base of the screen, or the backlight dies completely while the image is still faintly visible.",
  howWeRepair: "We don't replace the whole display for this. We repair the backlight circuit at board level — replacing the failed flex cable and, where needed, the backlight driver IC on the display's T-CON board. This costs significantly less than a full screen replacement and solves the root cause, not just the symptom.",
  signs: ["Bright spots or 'stage lights' along the bottom edge", "Backlight works intermittently when the lid is at certain angles", "Screen goes completely dark but image is faintly visible with a torch", "Progressively worsening over weeks"]
}, {
  title: "Battery degradation and swelling",
  subtitle: "Every lithium battery degrades — but swelling is a safety issue that needs immediate attention.",
  whatHappens: "MacBook batteries are lithium-polymer cells glued into the top case. Over 2–4 years of charge cycles, the chemistry degrades and capacity drops. This is normal. What's not normal is swelling — when the internal layers of the cell produce gas and the battery physically expands. A swollen battery pushes against the trackpad (causing phantom clicks), warps the bottom case, and in extreme cases can crack the display from internal pressure.",
  howWeRepair: "We safely remove the old battery (including dissolving the adhesive Apple uses to bond it to the chassis), fit a genuine replacement cell, and recalibrate the battery management system. Post-repair, macOS will report accurate cycle count and health data. If the swelling has damaged the trackpad or case, we'll quote that separately before proceeding.",
  signs: ["macOS reports 'Service Recommended' or 'Replace Now'", "Battery drains in under 2 hours", "Trackpad feels stiff or clicks on its own", "Bottom case is visibly warped or doesn't sit flat", "Less than 80% maximum capacity in System Report"]
}, {
  title: "Liquid damage",
  subtitle: "The repair most shops refuse — and the one where speed matters most.",
  whatHappens: "When liquid reaches the logic board, it doesn't just short-circuit components — it starts a chemical reaction. Water, coffee, and wine are all slightly acidic or conductive. Within hours, copper traces on the board begin corroding. The longer you wait, the more components fail. This is why a MacBook that 'worked fine after drying out' can die days later — the corrosion was progressing invisibly.",
  howWeRepair: "Step one is always ultrasonic cleaning — we fully strip the board and submerge it in a specialised cleaning solution that dissolves corrosion without damaging components. Then we inspect every IC and trace under magnification. Failed components are replaced individually at board level. We've recovered MacBooks that were fully submerged — the key is how quickly you get it to us and how thorough the cleaning is.",
  signs: ["Visible liquid residue around keyboard or ports", "Won't power on at all after a spill", "Powers on but has erratic behaviour — random shutdowns, missing ports, fans spinning constantly", "Keyboard or trackpad partially unresponsive", "Worked fine after drying, then failed days later"]
}, {
  title: "Power and charging faults",
  subtitle: "Won't turn on, won't charge, or shuts down randomly — the diagnostic starts at the USB-C port and works inward.",
  whatHappens: "MacBook power delivery is a chain: USB-C port → charging IC (CD3217) → power management unit → individual voltage rails that feed the CPU, GPU, RAM, and SSD. A failure at any point in this chain can look like 'it won't turn on.' The USB-C port might be physically damaged. The charging IC might have failed from a surge. A power rail might be shorted by a failed component elsewhere on the board. Without board-level diagnostic tools, most shops can only guess.",
  howWeRepair: "We start with a £49 diagnostic that traces the power path systematically — measuring voltage at each stage with a multimeter and checking for shorts with a thermal camera. Once we've isolated the failure point, we replace the specific component. Common repairs include USB-C port replacement, charging IC (CD3217) swap, and PPBUS voltage rail fault repair. Most power faults are fixable at board level for a fraction of the cost of a new logic board.",
  signs: ["Completely dead — no light, no fan, no chime", "Charges intermittently or only on one USB-C port", "Shows charging icon but battery percentage doesn't increase", "Random shutdowns under load", "Fan spins briefly then everything dies"]
}, {
  title: "Keyboard failure",
  subtitle: "From the infamous butterfly mechanism to flex cable faults — and why Apple's solution is often overkill.",
  whatHappens: "MacBook keyboards fail in two main ways. The butterfly-mechanism keyboards (2016–2019) are notorious for keys that stick, double-type, or stop working when debris gets under the keycap. The mechanism is so thin that a single grain of dust can prevent the key from actuating. On newer models, keyboard failures are more often caused by liquid ingress or a failed flex cable connecting the keyboard to the logic board.",
  howWeRepair: "For butterfly keyboards, we can sometimes clean and restore individual keys — but if multiple keys are affected, a top case replacement is more reliable. For flex cable failures, we repair at board level where possible. Apple's standard fix is to replace the entire top case (keyboard, battery, trackpad, and speakers as one unit) — which is expensive and unnecessary when only the keyboard is at fault. We isolate the actual failure and repair only what's broken.",
  signs: ["Keys that stick, repeat, or don't register", "Entire rows of keys unresponsive", "Keyboard works intermittently — worse after the laptop warms up", "Backlight on but keys don't type"]
}];
function MBRFaults() {
  const [openIndex, setOpenIndex] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "mbr-faults"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Fault guides"), /*#__PURE__*/React.createElement("h2", null, "Common MacBook faults \u2014 explained simply."), /*#__PURE__*/React.createElement("p", null, "Not sure what's wrong with your MacBook? Here's what each symptom usually means, how the repair actually works, and what to look for. Written by our technicians, not a marketing team.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-faults-list"
  }, FAULTS.map((f, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: `mbr-fault-card${openIndex === i ? " open" : ""}`
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-header",
    onClick: () => setOpenIndex(openIndex === i ? -1 : i)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-header-left"
  }, /*#__PURE__*/React.createElement("h3", null, f.title), /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-sub"
  }, f.subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-chevron"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M3 5l4 4 4-4"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-body-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-section"
  }, /*#__PURE__*/React.createElement("h4", null, "What's happening"), /*#__PURE__*/React.createElement("p", null, f.whatHappens)), /*#__PURE__*/React.createElement("div", {
    className: "mbr-fault-section"
  }, /*#__PURE__*/React.createElement("h4", null, "How we repair it"), /*#__PURE__*/React.createElement("p", null, f.howWeRepair), /*#__PURE__*/React.createElement("h4", {
    style: {
      marginTop: 20
    }
  }, "Signs to look for"), /*#__PURE__*/React.createElement("ul", null, f.signs.map((s, j) => /*#__PURE__*/React.createElement("li", {
    key: j
  }, s))), /*#__PURE__*/React.createElement("a", {
    href: "#mbr-wizard",
    className: "mbr-fault-cta"
  }, "Get a quote for this repair \u2192")))))))));
}

/* ── Videos removed — add back when real footage is ready ──────────────── */

/* ── Process strip ─────────────────────────────────────────────────────── */
function MBRProcess() {
  const steps = [{
    num: "01",
    title: "Diagnosis",
    body: "£49 board-level inspection. We identify the exact fault and give you a written quote — no obligation. Deducted from repair cost if you proceed."
  }, {
    num: "02",
    title: "Quote approval",
    body: "You see the price before any work starts. Approve by email, phone, or in person. No surprises, no hidden fees."
  }, {
    num: "03",
    title: "Repair",
    body: "Component-level work in our Fitzrovia workshop. Genuine Apple parts, microsoldering where needed, and full post-repair testing."
  }, {
    num: "04",
    title: "Collection",
    body: "Walk in and collect, or we ship back via tracked courier. Every repair leaves with a 2-year warranty and a clear repair summary."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "mbr-process"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "How it works"), /*#__PURE__*/React.createElement("h2", null, "Drop off to collection in 48 hours."), /*#__PURE__*/React.createElement("p", null, "Walk in or send your MacBook by post. Every repair follows the same documented process.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-process-steps"
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "mbr-process-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-process-num"
  }, s.num), /*#__PURE__*/React.createElement("h3", null, s.title), /*#__PURE__*/React.createElement("p", null, s.body))))));
}

/* ── Dual-path CTA + compact wizard ─────────────────────────────────────── */
function MBRWizardSection({
  accentColor = "#6B9E8A",
  accentStyle = "filled"
}) {
  const [mode, setMode] = React.useState(null); // null | "quote" | "diagnose"

  // Listen for hero CTA events to skip the dual-path choice
  React.useEffect(() => {
    const handler = e => setMode(e.detail);
    window.addEventListener("mbr:set-mode", handler);
    return () => window.removeEventListener("mbr:set-mode", handler);
  }, []);
  const diagIconStyle = accentStyle === "filled" ? {
    background: accentColor,
    color: "#fff"
  } : {
    background: "transparent",
    color: accentColor,
    boxShadow: `inset 0 0 0 2px ${accentColor}`
  };
  return /*#__PURE__*/React.createElement("section", {
    id: "mbr-wizard",
    className: "mbr-wizard-section"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, !mode && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Next step"), /*#__PURE__*/React.createElement("h2", null, "How can we help?"), /*#__PURE__*/React.createElement("p", null, "Two ways in \u2014 pick whichever fits.")), /*#__PURE__*/React.createElement("div", {
    className: "mbr-dual-cta"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mbr-path-card",
    onClick: () => setMode("quote")
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-path-icon"
  }, "\u2192"), /*#__PURE__*/React.createElement("h3", null, "Get an instant quote"), /*#__PURE__*/React.createElement("p", null, "You know roughly what's wrong. Pick your MacBook model, select the fault, and see your price in 60 seconds."), /*#__PURE__*/React.createElement("span", {
    className: "mbr-path-action"
  }, "Start quote \u2192")), /*#__PURE__*/React.createElement("button", {
    className: "mbr-path-card",
    onClick: () => setMode("diagnose")
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-path-icon",
    style: diagIconStyle
  }, "?"), /*#__PURE__*/React.createElement("h3", null, "Help me diagnose"), /*#__PURE__*/React.createElement("p", null, "Not sure what's wrong? Walk us through the symptoms and we'll narrow it down \u2014 then give you a price or book a \xA349 diagnostic."), /*#__PURE__*/React.createElement("span", {
    className: "mbr-path-action",
    style: {
      color: accentColor
    }
  }, "Start diagnostic \u2192")))), mode === "quote" && /*#__PURE__*/React.createElement("div", {
    className: "mbr-wizard-compact"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-wizard-compact-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mbr-wizard-back",
    onClick: () => setMode(null)
  }, "\u2190 Back to options"), /*#__PURE__*/React.createElement("div", {
    className: "info-head",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Instant quote \xB7 60 seconds"), /*#__PURE__*/React.createElement("h2", null, "Select your MacBook model."))), /*#__PURE__*/React.createElement("div", {
    id: "wizard"
  }, /*#__PURE__*/React.createElement(Wizard, {
    variant: "v2",
    showFilters: true
  }))), mode === "diagnose" && /*#__PURE__*/React.createElement("div", {
    className: "mbr-diagnose-compact"
  }, /*#__PURE__*/React.createElement("button", {
    className: "mbr-wizard-back",
    onClick: () => setMode(null)
  }, "\u2190 Back to options"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-diagnose-flow"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head",
    style: {
      marginTop: 8
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Guided diagnostic"), /*#__PURE__*/React.createElement("h2", null, "Let's figure out what's wrong."), /*#__PURE__*/React.createElement("p", null, "Answer a few quick questions and we'll narrow down the fault, suggest the most likely repair, and give you a price \u2014 or book you a \xA349 in-person diagnostic.")), /*#__PURE__*/React.createElement(MBRDiagnoseSteps, null)))));
}

/* ── Simplified diagnostic flow for the MacBook page ───────────────────── */
function MBRDiagnoseSteps() {
  const faults = [{
    id: "screen",
    label: "Screen / Display",
    detail: "Cracked, dead, flickering, lines, Stage Light effect",
    icon: "screen"
  }, {
    id: "power",
    label: "Power / Battery",
    detail: "Won't turn on, won't charge, drains fast, shutdowns, swelling",
    icon: "power"
  }, {
    id: "liquid",
    label: "Liquid damage",
    detail: "Spill, submersion, corrosion — any liquid contact",
    icon: "liquid"
  }, {
    id: "keyboard",
    label: "Keyboard / Trackpad",
    detail: "Dead keys, sticky keys, phantom clicks, unresponsive",
    icon: "keyboard"
  }, {
    id: "port",
    label: "Charging / Ports",
    detail: "USB-C not working, intermittent charging, no data",
    icon: "port"
  }, {
    id: "other",
    label: "Something else",
    detail: "Fan noise, overheating, slow performance, other",
    icon: "other"
  }];
  const [selected, setSelected] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "mbr-diag-result"
    }, /*#__PURE__*/React.createElement("div", {
      className: "mbr-diag-result-icon"
    }, "\u2713"), /*#__PURE__*/React.createElement("h3", null, "We'd recommend a \xA349 board-level diagnostic."), /*#__PURE__*/React.createElement("p", null, "Based on what you've described, an in-person inspection will give us the exact fault and a fixed-price quote. The \xA349 fee is deducted from the repair cost if you proceed."), /*#__PURE__*/React.createElement("div", {
      className: "mbr-diag-result-actions"
    }, /*#__PURE__*/React.createElement("a", {
      href: "#",
      className: "btn btn-dark btn-lg"
    }, "Book diagnostic \xB7 \xA349 \u2192"), /*#__PURE__*/React.createElement("a", {
      href: "tel:+442070998517",
      className: "btn btn-lg",
      style: {
        background: "rgba(0,0,0,0.04)",
        boxShadow: "0 0 0 1px rgba(0,0,0,0.1)"
      }
    }, "Call us instead")), /*#__PURE__*/React.createElement("p", {
      className: "mbr-diag-result-note"
    }, "Or walk in \u2014 Mon\u2013Thu 9am\u20136pm, Fri 10am\u20136pm, 12 Margaret Street, Fitzrovia W1W 8JQ."));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "mbr-diag-faults"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-diag-label"
  }, "What's happening with your MacBook?"), /*#__PURE__*/React.createElement("div", {
    className: "mbr-diag-grid"
  }, faults.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: "mbr-diag-fault" + (selected === f.id ? " active" : ""),
    onClick: () => setSelected(f.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "mbr-diag-fault-icon"
  }, /*#__PURE__*/React.createElement(MBRTypeIcon, {
    type: f.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "mbr-diag-fault-text"
  }, /*#__PURE__*/React.createElement("strong", null, f.label), /*#__PURE__*/React.createElement("span", null, f.detail))))), selected && /*#__PURE__*/React.createElement("button", {
    className: "btn btn-dark btn-lg",
    style: {
      width: "100%",
      marginTop: 16
    },
    onClick: () => setSubmitted(true)
  }, selected === "other" ? "Get diagnostic recommendation →" : `Continue with ${faults.find(f => f.id === selected)?.label} →`));
}

/* ── FAQ (comprehensive, SEO-targeted) ─────────────────────────────────── */
function MBRFAQ() {
  const items = [{
    q: "How much does a MacBook repair cost?",
    a: "It depends on the model and fault. Screen repairs start from £299, battery replacements from £179, and liquid damage recovery from £249. Power diagnostics are £49, which is deducted from the repair cost if you proceed. Use our quote wizard for an instant price, or walk in for a free initial assessment."
  }, {
    q: "How long does a MacBook repair take?",
    a: "Most repairs are completed in 1–2 working days. Screen and battery replacements are often same-day if you drop in before 11am and we have the part in stock. Complex board-level work — liquid damage, power faults — typically takes 2–3 days. We'll confirm the timeline after diagnosis."
  }, {
    q: "Do you use genuine Apple parts?",
    a: "Yes. We source original Apple displays, batteries, and components. Every screen is recalibrated in-house to preserve True Tone, full brightness, and colour accuracy. We don't use third-party panels or aftermarket batteries."
  }, {
    q: "Is my data safe during repair?",
    a: "Yes. Most MacBook repairs don't require access to your data. We never ask for your passcode unless post-repair testing requires it — and you're welcome to be present for that step. We run a GDPR-compliant workshop and offer NDAs for corporate clients."
  }, {
    q: "What does the 2-year warranty cover?",
    a: "Every repair carries a 2-year warranty covering the replaced component, the labour, and any rework needed. If the same fault recurs within the warranty period, we'll repair it at no charge. Accidental damage isn't covered, but we'll always quote fairly for re-repairs."
  }, {
    q: "Can you fix a MacBook that Apple said is unrepairable?",
    a: "In most cases, yes. Apple doesn't perform component-level board repairs — when they say a device 'can't be repaired,' they mean they won't repair it at that level. We diagnose at circuit level and regularly fix devices that Apple, insurers, and other repair shops have written off. Over 85% of 'unrepairable' MacBooks we receive are successfully repaired."
  }, {
    q: "Do I need to book, or can I walk in?",
    a: "Either works. Walk in Mon–Thu 9am–6pm, Fri 10am–6pm at our Fitzrovia workshop — no appointment needed for diagnosis. Booking ahead via the quote wizard reserves a workshop slot and is usually faster for board-level work."
  }, {
    q: "Can you repair MacBooks bought outside the UK?",
    a: "Yes. MacBook hardware is the same worldwide. We repair devices regardless of where they were purchased. If you're visiting London, you can drop in for a same-day repair — we're in Fitzrovia, W1."
  }, {
    q: "Do you offer corporate or fleet repair services?",
    a: "Yes. We work with companies including Inditex, Panasonic, JLL, and Prada. Corporate accounts get SLA-backed turnarounds, PO acceptance, consolidated invoicing, and dedicated account management. See our Corporate Services page for details."
  }];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container faq-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Frequently asked"), /*#__PURE__*/React.createElement("h2", null, "MacBook repair questions, answered."), /*#__PURE__*/React.createElement("p", null, "If your question isn't here, call ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517"
  }, "+44 (0)207 099 8517"), " or drop into our Fitzrovia workshop.")), /*#__PURE__*/React.createElement("div", {
    className: "faq-right"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "faq-item" + (open === i ? " open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-q",
    onClick: () => setOpen(open === i ? -1 : i)
  }, it.q, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "faq-a"
  }, it.a))))));
}
Object.assign(window, {
  MBRBreadcrumb,
  MBRHero,
  MBRTypes,
  MBRSpecialist,
  MBRCaseStudy,
  MBRFaults,
  MBRProcess,
  MBRWizardSection,
  MBRFAQ,
  MBRTypeIcon,
  REPAIR_TYPES,
  FAULTS
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/MacBookRepairs.jsx", error: String((e && e.message) || e) }); }

// icorrect/Placeholders.jsx
try { (() => {
// Workshop / board / device SVG placeholders — stylised line art that signals "real photo will go here"

function WorkshopSceneSVG() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 500",
    preserveAspectRatio: "xMidYMid slice",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "ws-bg",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#1a1208",
    stopOpacity: "0.04"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#1a1208",
    stopOpacity: "0.10"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: "ws-grid",
    width: "20",
    height: "20",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 20 0 L 0 0 0 20",
    fill: "none",
    stroke: "rgba(120,53,15,0.08)",
    strokeWidth: "0.5"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "500",
    fill: "url(#ws-bg)"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "500",
    fill: "url(#ws-grid)"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "320",
    x2: "400",
    y2: "320",
    stroke: "rgba(0,0,0,0.18)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "#171717",
    strokeWidth: "1.4",
    fill: "none",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "30",
    y: "240",
    width: "80",
    height: "14",
    rx: "2"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "70",
    y1: "254",
    x2: "70",
    y2: "290"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "55",
    y1: "290",
    x2: "85",
    y2: "290"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "50",
    y: "290",
    width: "40",
    height: "22",
    rx: "3"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 70 240 L 70 130 L 200 130 L 200 220"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "170",
    y: "120",
    width: "60",
    height: "34",
    rx: "4"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "200",
    cy: "240",
    r: "14"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "200",
    cy: "240",
    r: "6",
    fill: "#171717",
    fillOpacity: "0.1"
  })), /*#__PURE__*/React.createElement("g", {
    stroke: "#171717",
    strokeWidth: "1.4",
    fill: "rgba(255,255,255,0.6)",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 120 380 L 280 380 L 300 410 L 100 410 Z"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "130",
    y: "320",
    width: "140",
    height: "60",
    rx: "3",
    fill: "rgba(255,255,255,0.9)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "138",
    y: "328",
    width: "124",
    height: "44",
    rx: "1",
    fill: "rgba(120,53,15,0.06)",
    stroke: "rgba(0,0,0,0.18)"
  })), /*#__PURE__*/React.createElement("g", {
    stroke: "#171717",
    strokeWidth: "1.3",
    fill: "none"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "320",
    y1: "350",
    x2: "380",
    y2: "295"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "312",
    y: "346",
    width: "14",
    height: "28",
    rx: "2",
    transform: "rotate(-42 319 360)"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "380",
    y1: "295",
    x2: "384",
    y2: "291"
  })), /*#__PURE__*/React.createElement("g", {
    stroke: "#171717",
    strokeWidth: "1.2",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 290 340 L 340 360 M 290 344 L 340 364"
  })), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(120,53,15,0.55)",
    strokeWidth: "0.8",
    fill: "none",
    strokeDasharray: "3 3"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "200",
    y1: "240",
    x2: "270",
    y2: "180"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "200",
    y1: "350",
    x2: "280",
    y2: "80"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "rgba(120,53,15,0.85)",
    fontFamily: "var(--font-mono)",
    fontSize: "9",
    letterSpacing: "0.5"
  }, /*#__PURE__*/React.createElement("text", {
    x: "275",
    y: "178"
  }, "STEREO 40\xD7"), /*#__PURE__*/React.createElement("text", {
    x: "285",
    y: "78"
  }, "A2442 LOGIC BD")));
}
function BoardSVG({
  tone = "warm"
}) {
  // Logic board with components — stylised line art
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "bd-bg",
    x1: "0",
    y1: "0",
    x2: "1",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: tone === "warm" ? "#1a0f06" : "#0a1018"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: tone === "warm" ? "#0f0904" : "#050810"
  })), /*#__PURE__*/React.createElement("pattern", {
    id: "bd-traces",
    x: "0",
    y: "0",
    width: "40",
    height: "40",
    patternUnits: "userSpaceOnUse"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M 0 10 L 40 10 M 10 0 L 10 40 M 20 20 L 40 20 M 30 0 L 30 30",
    stroke: "rgba(120, 80, 30, 0.18)",
    strokeWidth: "0.4",
    fill: "none"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#bd-bg)"
  }), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#bd-traces)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "30",
    y: "40",
    width: "340",
    height: "220",
    rx: "6",
    fill: "rgba(120, 80, 30, 0.18)",
    stroke: "rgba(200, 160, 90, 0.35)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "120",
    y: "100",
    width: "100",
    height: "100",
    rx: "2",
    fill: "rgba(20,20,20,0.85)",
    stroke: "rgba(220, 180, 100, 0.5)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("text", {
    x: "170",
    y: "155",
    fontFamily: "var(--font-mono)",
    fontSize: "11",
    textAnchor: "middle",
    fill: "rgba(220, 180, 100, 0.6)"
  }, "M3 PRO"), /*#__PURE__*/React.createElement("rect", {
    x: "240",
    y: "100",
    width: "60",
    height: "40",
    rx: "1",
    fill: "rgba(20,20,20,0.7)",
    stroke: "rgba(220, 180, 100, 0.4)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "240",
    y: "160",
    width: "60",
    height: "40",
    rx: "1",
    fill: "rgba(20,20,20,0.7)",
    stroke: "rgba(220, 180, 100, 0.4)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "60",
    y: "120",
    width: "40",
    height: "20",
    rx: "1",
    fill: "rgba(20,20,20,0.85)",
    stroke: "rgba(255, 100, 80, 0.9)",
    strokeWidth: "1.2"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "80",
    cy: "130",
    r: "32",
    fill: "none",
    stroke: "rgba(255, 100, 80, 0.45)",
    strokeWidth: "1",
    strokeDasharray: "2 3"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "115",
    y1: "130",
    x2: "180",
    y2: "60",
    stroke: "rgba(255, 100, 80, 0.7)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("text", {
    x: "180",
    y: "55",
    fontFamily: "var(--font-mono)",
    fontSize: "9",
    fill: "rgba(255, 140, 120, 0.95)",
    letterSpacing: "0.5"
  }, "U7600 \xB7 BACKLIGHT IC"), [...Array(40)].map((_, i) => {
    const x = 40 + i * 47 % 320;
    const y = 50 + i * 37 % 200;
    const inMain = x > 115 && x < 305 && y > 95 && y < 205;
    if (inMain) return null;
    return /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: x,
      y: y,
      width: i % 3 === 0 ? 6 : 3,
      height: 2,
      fill: "rgba(220, 180, 100, 0.35)"
    });
  }), /*#__PURE__*/React.createElement("rect", {
    x: "60",
    y: "220",
    width: "80",
    height: "14",
    rx: "1",
    fill: "rgba(40,40,40,0.85)",
    stroke: "rgba(220, 180, 100, 0.45)",
    strokeWidth: "0.5"
  }), [...Array(20)].map((_, i) => /*#__PURE__*/React.createElement("line", {
    key: i,
    x1: 62 + i * 4,
    y1: "222",
    x2: 62 + i * 4,
    y2: "232",
    stroke: "rgba(220, 180, 100, 0.5)",
    strokeWidth: "0.4"
  })));
}
function MacBookHeroSVG() {
  // Open MacBook, slight 3/4 view, with screen showing damage / repair
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 400",
    preserveAspectRatio: "xMidYMid meet",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
    id: "mb-screen",
    x1: "0",
    y1: "0",
    x2: "0",
    y2: "1"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "#0a0a0a"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "#1a1a1a"
  }))), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M 80 80 L 320 80 L 330 250 L 70 250 Z",
    fill: "rgba(120, 80, 30, 0.18)",
    stroke: "rgba(0,0,0,0.35)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "92",
    y: "92",
    width: "216",
    height: "146",
    fill: "url(#mb-screen)",
    rx: "2"
  }), /*#__PURE__*/React.createElement("g", {
    opacity: "0.45"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "100",
    y: "220",
    width: "2",
    height: "14",
    fill: "#7dd3fc"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "120",
    y: "218",
    width: "2",
    height: "16",
    fill: "#7dd3fc"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "155",
    y: "216",
    width: "2",
    height: "18",
    fill: "#7dd3fc"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "200",
    y: "220",
    width: "2",
    height: "14",
    fill: "#7dd3fc"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "240",
    y: "216",
    width: "2",
    height: "18",
    fill: "#7dd3fc"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "285",
    y: "218",
    width: "2",
    height: "16",
    fill: "#7dd3fc"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "186",
    y: "92",
    width: "28",
    height: "6",
    rx: "2",
    fill: "#000"
  })), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("path", {
    d: "M 50 250 L 350 250 L 380 290 L 20 290 Z",
    fill: "rgba(120, 80, 30, 0.22)",
    stroke: "rgba(0,0,0,0.35)",
    strokeWidth: "1"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M 20 290 L 380 290 L 376 295 L 24 295 Z",
    fill: "rgba(0,0,0,0.18)"
  })), /*#__PURE__*/React.createElement("g", {
    opacity: "0.3",
    stroke: "rgba(0,0,0,0.4)",
    strokeWidth: "0.4",
    fill: "none"
  }, [...Array(5)].map((_, r) => [...Array(13)].map((_, c) => /*#__PURE__*/React.createElement("rect", {
    key: `${r}-${c}`,
    x: 70 + c * 20,
    y: 258 + r * 5,
    width: "16",
    height: "3",
    rx: "0.5"
  })))), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(180, 80, 50, 0.7)",
    strokeWidth: "0.8",
    fill: "none",
    strokeDasharray: "2 3"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "200",
    y1: "226",
    x2: "350",
    y2: "160"
  })), /*#__PURE__*/React.createElement("text", {
    x: "350",
    y: "155",
    fontFamily: "var(--font-mono)",
    fontSize: "10",
    textAnchor: "end",
    fill: "rgba(180, 80, 50, 0.95)",
    letterSpacing: "0.4"
  }, "STAGE LIGHT EFFECT"));
}
function LiquidDamageSVG() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("radialGradient", {
    id: "ld-bg",
    cx: "0.3",
    cy: "0.4"
  }, /*#__PURE__*/React.createElement("stop", {
    offset: "0",
    stopColor: "rgba(80, 45, 20, 0.45)"
  }), /*#__PURE__*/React.createElement("stop", {
    offset: "1",
    stopColor: "rgba(0, 0, 0, 0.95)"
  }))), /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "url(#ld-bg)"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "40",
    y: "60",
    width: "320",
    height: "180",
    rx: "6",
    fill: "rgba(120, 80, 30, 0.25)",
    stroke: "rgba(200, 160, 90, 0.35)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("g", {
    fill: "rgba(140, 90, 40, 0.5)",
    stroke: "rgba(180, 110, 50, 0.7)",
    strokeWidth: "0.5"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "120",
    cy: "130",
    rx: "55",
    ry: "38"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "180",
    cy: "160",
    rx: "38",
    ry: "22"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "240",
    cy: "120",
    rx: "28",
    ry: "18"
  })), /*#__PURE__*/React.createElement("g", {
    fill: "rgba(220, 180, 100, 0.18)"
  }, /*#__PURE__*/React.createElement("ellipse", {
    cx: "110",
    cy: "125",
    rx: "35",
    ry: "22"
  }), /*#__PURE__*/React.createElement("ellipse", {
    cx: "175",
    cy: "155",
    rx: "22",
    ry: "12"
  })), /*#__PURE__*/React.createElement("rect", {
    x: "240",
    y: "140",
    width: "40",
    height: "40",
    rx: "1",
    fill: "rgba(20,20,20,0.85)",
    stroke: "rgba(220, 180, 100, 0.4)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "290",
    y: "90",
    width: "50",
    height: "20",
    rx: "1",
    fill: "rgba(20,20,20,0.7)",
    stroke: "rgba(220, 180, 100, 0.4)",
    strokeWidth: "0.5"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(180, 80, 50, 0.8)",
    strokeWidth: "0.8",
    fill: "none",
    strokeDasharray: "2 3"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "120",
    y1: "130",
    x2: "50",
    y2: "40"
  })), /*#__PURE__*/React.createElement("text", {
    x: "46",
    y: "36",
    fontFamily: "var(--font-mono)",
    fontSize: "9",
    fill: "rgba(220, 120, 90, 0.95)",
    letterSpacing: "0.4"
  }, "CORROSION \xB7 DAY 14"));
}
function TouchIDSVG() {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 400 300",
    preserveAspectRatio: "xMidYMid slice",
    xmlns: "http://www.w3.org/2000/svg"
  }, /*#__PURE__*/React.createElement("rect", {
    width: "400",
    height: "300",
    fill: "#0a0a0a"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(220, 180, 100, 0.18)",
    strokeWidth: "0.4",
    fill: "rgba(120, 80, 30, 0.12)"
  }, [...Array(4)].map((_, r) => [...Array(13)].map((_, c) => /*#__PURE__*/React.createElement("rect", {
    key: `${r}-${c}`,
    x: 40 + c * 25,
    y: 80 + r * 32,
    width: "20",
    height: "20",
    rx: "2"
  })))), /*#__PURE__*/React.createElement("g", null, /*#__PURE__*/React.createElement("circle", {
    cx: "350",
    cy: "100",
    r: "15",
    fill: "rgba(40,40,40,0.95)",
    stroke: "rgba(220, 180, 100, 0.55)",
    strokeWidth: "0.8"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "350",
    cy: "100",
    r: "22",
    fill: "none",
    stroke: "rgba(255, 100, 80, 0.7)",
    strokeWidth: "1.2",
    strokeDasharray: "2 3"
  }), /*#__PURE__*/React.createElement("g", {
    stroke: "rgba(220, 180, 100, 0.45)",
    strokeWidth: "0.5",
    fill: "none"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "350",
    cy: "100",
    r: "3"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "350",
    cy: "100",
    r: "6"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "350",
    cy: "100",
    r: "9"
  }))), /*#__PURE__*/React.createElement("path", {
    d: "M 350 115 Q 350 160 320 200 Q 280 230 200 230",
    stroke: "rgba(220, 180, 100, 0.4)",
    strokeWidth: "1.5",
    fill: "none"
  }), /*#__PURE__*/React.createElement("text", {
    x: "298",
    y: "68",
    fontFamily: "var(--font-mono)",
    fontSize: "9",
    textAnchor: "end",
    fill: "rgba(255, 140, 120, 0.95)",
    letterSpacing: "0.4"
  }, "T2 CHIP PAIR FAULT"));
}
Object.assign(window, {
  WorkshopSceneSVG,
  BoardSVG,
  MacBookHeroSVG,
  LiquidDamageSVG,
  TouchIDSVG
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Placeholders.jsx", error: String((e && e.message) || e) }); }

// icorrect/Shell.jsx
try { (() => {
// Shell: Nav, Trust Band, Identify helper, Product grid, FAQ, Location, Footer

function Nav() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "icnav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container icnav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "icnav-logo",
    href: "iCorrect Homepage.html"
  }, "iCorrect"), /*#__PURE__*/React.createElement("div", {
    className: "icnav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "MacBook Repairs.html"
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "Corporate Services.html"
  }, "Corporate"), /*#__PURE__*/React.createElement("a", {
    href: "Why Us.html"
  }, "Why us"), /*#__PURE__*/React.createElement("a", {
    href: "How It Works.html"
  }, "How it works"), /*#__PURE__*/React.createElement("a", {
    href: "Careers.html"
  }, "Careers")), /*#__PURE__*/React.createElement("span", {
    className: "icnav-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "icnav-status-dot"
  }), " Open \xB7 Fitzrovia"), /*#__PURE__*/React.createElement("a", {
    href: "iCorrect Homepage.html#wizard",
    className: "icnav-cta"
  }, "Get a quote ", /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2192"))));
}
function Breadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Repairs"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "MacBook Screen")));
}
function TrustBand({
  reviewCount = 719,
  rating = 4.8
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "trust-band"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "trust-band-inner",
    role: "list"
  }, /*#__PURE__*/React.createElement("li", {
    className: "trust-item trust-item-rating"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-rating-num"
  }, rating), /*#__PURE__*/React.createElement("div", {
    className: "trust-rating-meta"
  }, /*#__PURE__*/React.createElement(Stars, {
    rating: rating
  }), /*#__PURE__*/React.createElement("span", null, reviewCount, " Google reviews"))), /*#__PURE__*/React.createElement("li", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-icon"
  }, /*#__PURE__*/React.createElement(AppleLogo, null)), /*#__PURE__*/React.createElement("div", {
    className: "trust-label"
  }, /*#__PURE__*/React.createElement("strong", null, "Apple parts"), /*#__PURE__*/React.createElement("span", null, "Calibrated in-house"))), /*#__PURE__*/React.createElement("li", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-icon"
  }, /*#__PURE__*/React.createElement(ChipIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: "trust-label"
  }, /*#__PURE__*/React.createElement("strong", null, "Microsoldering"), /*#__PURE__*/React.createElement("span", null, "Board-level repairs"))), /*#__PURE__*/React.createElement("li", {
    className: "trust-item"
  }, /*#__PURE__*/React.createElement("div", {
    className: "trust-icon"
  }, /*#__PURE__*/React.createElement(ShieldIcon, null)), /*#__PURE__*/React.createElement("div", {
    className: "trust-label"
  }, /*#__PURE__*/React.createElement("strong", null, "2-yr warranty"), /*#__PURE__*/React.createElement("span", null, "Double the standard"))))));
}
function Stars({
  rating
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "stars",
    "aria-label": `${rating} out of 5`
  }, [0, 1, 2, 3, 4].map(i => {
    const fill = Math.max(0, Math.min(1, rating - i));
    return /*#__PURE__*/React.createElement("svg", {
      key: i,
      width: "14",
      height: "14",
      viewBox: "0 0 14 14",
      style: {
        flexShrink: 0,
        fill: "rgb(245, 166, 35)",
        stroke: "rgb(245, 166, 35)"
      }
    }, /*#__PURE__*/React.createElement("defs", null, /*#__PURE__*/React.createElement("linearGradient", {
      id: `g${i}`
    }, /*#__PURE__*/React.createElement("stop", {
      offset: `${fill * 100}%`,
      stopColor: "#171717"
    }), /*#__PURE__*/React.createElement("stop", {
      offset: `${fill * 100}%`,
      stopColor: "#e5e5e5"
    }))), /*#__PURE__*/React.createElement("path", {
      d: "M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z",
      fill: `url(#g${i})`,
      style: {
        fill: "rgb(245, 166, 35)",
        stroke: "rgb(245, 166, 35)"
      }
    }));
  }));
}
function AppleLogo() {
  // Generic display icon — explicitly NOT an Apple bitten-apple silhouette
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "3.5",
    width: "17",
    height: "11",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 18.5h6M11 14.5v4"
  }));
}
function ChipIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "10",
    height: "10",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 4.5V2M11 4.5V2M13.5 4.5V2M8.5 20V17.5M11 20V17.5M13.5 20V17.5M4.5 8.5H2M4.5 11H2M4.5 13.5H2M20 8.5H17.5M20 11H17.5M20 13.5H17.5"
  }));
}
function ShieldIcon() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11 2.5l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6l7-2.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11l2.2 2.2L14.5 9"
  }));
}
function IdentifyStrip() {
  const [input, setInput] = React.useState("");
  return /*#__PURE__*/React.createElement("section", {
    className: "identify-strip"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container identify-strip-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "identify-strip-icon"
  }, "A2442"), /*#__PURE__*/React.createElement("div", {
    className: "identify-strip-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Don't know which MacBook you have?"), /*#__PURE__*/React.createElement("span", null, "Type the model code from the underside \u2014 or jump to the visual guide.")), /*#__PURE__*/React.createElement("form", {
    className: "identify-strip-form",
    onSubmit: e => {
      e.preventDefault();
      const el = document.getElementById("identify");
      if (el) window.scrollTo({
        top: el.offsetTop - 80,
        behavior: "smooth"
      });
    }
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "e.g. A2442",
    value: input,
    onChange: e => setInput(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Identify"))));
}
function IdentifyHelper() {
  const [input, setInput] = React.useState("");
  return /*#__PURE__*/React.createElement("section", {
    id: "identify",
    className: "identify"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container identify-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "identify-visual"
  }, /*#__PURE__*/React.createElement("div", {
    className: "identify-visual-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "identify-plate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "identify-plate-line"
  }, "Designed by Apple in California."), /*#__PURE__*/React.createElement("div", {
    className: "identify-plate-line muted"
  }, "Assembled in China"), /*#__PURE__*/React.createElement("div", {
    className: "identify-plate-line highlight"
  }, "Model ", /*#__PURE__*/React.createElement("span", {
    className: "hl"
  }, "A2442")), /*#__PURE__*/React.createElement("div", {
    className: "identify-plate-line muted small"
  }, "EMC 3650 \xB7 61W USB-C")), /*#__PURE__*/React.createElement("div", {
    className: "mono-label identify-hint"
  }, "\u2190 Look on the underside"))), /*#__PURE__*/React.createElement("div", {
    className: "identify-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Not sure which model you have?"), /*#__PURE__*/React.createElement("h2", null, "Find your model number in 5 seconds."), /*#__PURE__*/React.createElement("p", null, "Flip your MacBook over. Look for a four-character code starting with \"A\" \u2014 it's printed in small grey type near the hinge. Tell us that code and we'll match the repair exactly."), /*#__PURE__*/React.createElement("form", {
    className: "identify-form",
    onSubmit: e => e.preventDefault()
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "e.g. A2442",
    value: input,
    onChange: e => setInput(e.target.value)
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-dark"
  }, "Identify")), /*#__PURE__*/React.createElement("div", {
    className: "identify-foot"
  }, "Or ", /*#__PURE__*/React.createElement("a", {
    href: "#wizard"
  }, "browse models in the wizard \u2192")))));
}
const GRID_ITEMS = [{
  name: "MacBook Pro 14\" (M3) Screen Repair",
  price: "£449",
  year: "2023–24"
}, {
  name: "MacBook Pro 16\" (M3) Screen Repair",
  price: "£599",
  year: "2023–24"
}, {
  name: "MacBook Pro 14\" (M1/M2) Screen Repair",
  price: "£419",
  year: "2021–23"
}, {
  name: "MacBook Pro 16\" (M1/M2) Screen Repair",
  price: "£549",
  year: "2021–23"
}, {
  name: "MacBook Air 15\" Screen Repair",
  price: "£379",
  year: "2023–24"
}, {
  name: "MacBook Air 13\" (M-series) Screen Repair",
  price: "£329",
  year: "2020–24"
}, {
  name: "MacBook Pro 13\" Touch Bar Screen Repair",
  price: "£389",
  year: "2016–22"
}, {
  name: "MacBook Air 13\" (Retina) Screen Repair",
  price: "£299",
  year: "2018–20"
}, {
  name: "Stage Light Effect Repair (MBP 13/14/16)",
  price: "from £329",
  year: "Diagnosis"
}];
function ProductGrid() {
  return /*#__PURE__*/React.createElement("section", {
    className: "product-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pg-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "All repairs"), /*#__PURE__*/React.createElement("h2", null, "Browse every MacBook screen repair we offer.")), /*#__PURE__*/React.createElement("div", {
    className: "pg-foot-note"
  }, "9 services \xB7 Genuine Apple parts \xB7 2-year warranty")), /*#__PURE__*/React.createElement("div", {
    className: "pg"
  }, GRID_ITEMS.map((item, i) => /*#__PURE__*/React.createElement("a", {
    key: i,
    className: "pg-item",
    href: "#"
  }, /*#__PURE__*/React.createElement("div", {
    className: "pg-thumb"
  }, /*#__PURE__*/React.createElement(DeviceGlyph, null)), /*#__PURE__*/React.createElement("div", {
    className: "pg-name"
  }, item.name), /*#__PURE__*/React.createElement("div", {
    className: "pg-price"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: "#171717"
    }
  }, item.price), " \xB7 ", item.year))))));
}
function DeviceGlyph() {
  return /*#__PURE__*/React.createElement("svg", {
    width: "64",
    height: "44",
    viewBox: "0 0 64 44",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.2"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "8",
    y: "4",
    width: "48",
    height: "30",
    rx: "2"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "34",
    width: "60",
    height: "4",
    rx: "1"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "28",
    y1: "38",
    x2: "36",
    y2: "38",
    stroke: "currentColor",
    strokeWidth: "1.2"
  }));
}
function FAQ() {
  const items = [{
    q: "How long does a MacBook screen repair take?",
    a: "Most screen repairs are completed in 1–2 working days. If you drop in before 11am and we have the part in stock, same-day turnaround is often possible. Walk-ins welcome at our Fitzrovia workshop — no appointment needed for diagnosis."
  }, {
    q: "Are the replacement screens genuine Apple parts?",
    a: "Yes. We source original Apple displays, reclaim them where possible, and recalibrate every unit in-house to original factory standards. That means True Tone, full brightness, and colour accuracy are preserved — no downgrade in quality versus an Apple Store repair."
  }, {
    q: "Is my data safe during the repair?",
    a: "Completely. Screen repairs don't touch your drive, but we run a GDPR-compliant workshop and sign an NDA on request for corporate clients. We never ask for your passcode unless post-repair testing requires it — and you can be present for that step."
  }, {
    q: "What does the 2-year warranty cover?",
    a: "Every MacBook screen repair carries a full 2-year warranty against functional defects — double what most shops offer. The warranty covers the replaced display, the labour, and any re-work needed during that period. Accidental damage isn't covered, but we'll always quote fairly for re-repairs."
  }, {
    q: "Do I need to book, or can I just walk in?",
    a: "Either works. Walk in Mon–Fri 9am–6pm (Fri until 6pm, closed weekends) for a free diagnosis and written quote before any work starts. Booking ahead via the wizard reserves a workshop slot and is usually faster — particularly for Stage Light repairs or logic-board work."
  }, {
    q: "You're microsoldering specialists — what does that mean?",
    a: "Most repair shops swap whole components. We work at the board level: individual chips, resistors, and solder joints under a microscope. That's why other repair shops (and insurers) send their tougher cases to us — backlight IC replacements, liquid damage recovery, and the infamous MBP Stage Light fix are routine for our team."
  }];
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container faq-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Frequently asked"), /*#__PURE__*/React.createElement("h2", null, "Questions, answered honestly."), /*#__PURE__*/React.createElement("p", null, "If you want to speak to a human first, call ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517"
  }, "+44 (0)207 099 8517"), " or drop in \u2014 we're opposite The London Palladium.")), /*#__PURE__*/React.createElement("div", {
    className: "faq-right"
  }, items.map((it, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "faq-item" + (open === i ? " open" : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "faq-q",
    onClick: () => setOpen(open === i ? -1 : i)
  }, it.q, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "+")), /*#__PURE__*/React.createElement("div", {
    className: "faq-a"
  }, it.a))))));
}
function Location() {
  return /*#__PURE__*/React.createElement("section", {
    className: "location"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container location-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Visit the workshop"), /*#__PURE__*/React.createElement("h2", null, "Fitzrovia, London."), /*#__PURE__*/React.createElement("p", null, "Opposite The London Palladium. Drop-in diagnosis, no appointment needed."), /*#__PURE__*/React.createElement("dl", {
    className: "location-dl"
  }, /*#__PURE__*/React.createElement("dt", null, "Address"), /*#__PURE__*/React.createElement("dd", null, "12 Margaret Street", /*#__PURE__*/React.createElement("br", null), "Audley House", /*#__PURE__*/React.createElement("br", null), "London W1W 8JQ"), /*#__PURE__*/React.createElement("dt", null, "Phone"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517"
  }, "+44 (0)207 099 8517")), /*#__PURE__*/React.createElement("dt", null, "Email"), /*#__PURE__*/React.createElement("dd", null, /*#__PURE__*/React.createElement("a", {
    href: "mailto:support@icorrect.co.uk"
  }, "support@icorrect.co.uk")), /*#__PURE__*/React.createElement("dt", null, "Hours"), /*#__PURE__*/React.createElement("dd", null, "Mon\u2013Thu 9am\u20136pm", /*#__PURE__*/React.createElement("br", null), "Fri 10am\u20136pm \xB7 Sat/Sun closed"))), /*#__PURE__*/React.createElement("div", {
    className: "location-map"
  }, /*#__PURE__*/React.createElement("div", {
    className: "location-map-pin"
  }, /*#__PURE__*/React.createElement("div", {
    className: "location-map-pin-card"
  }, /*#__PURE__*/React.createElement("strong", null, "iCorrect"), /*#__PURE__*/React.createElement("span", null, "12 Margaret St, London W1W 8JQ"), /*#__PURE__*/React.createElement("div", {
    className: "location-map-pin-rating"
  }, "\u2605 4.8 \xB7 719 reviews")), /*#__PURE__*/React.createElement("div", {
    className: "location-map-marker"
  }, "\uD83D\uDCCD")), /*#__PURE__*/React.createElement("div", {
    className: "location-map-bg"
  }, [...Array(20)].map((_, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "map-street",
    style: {
      top: `${i * 11 % 100}%`,
      left: `${i * 17 % 100}%`,
      width: `${40 + i * 13 % 60}%`,
      transform: `rotate(${i * 31 % 180}deg)`
    }
  }))))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "icfooter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container icfooter-inner"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "icnav-logo",
    style: {
      color: "#fff"
    }
  }, "iCorrect"), /*#__PURE__*/React.createElement("div", {
    className: "icfooter-tag"
  }, "Apple repair specialists \xB7 Fitzrovia, London")), /*#__PURE__*/React.createElement("div", {
    className: "icfooter-cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: "#808080"
    }
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "MacBook Repairs.html"
  }, "MacBook"), /*#__PURE__*/React.createElement("a", {
    href: "MacBook Screen Collection.html"
  }, "MacBook Screen"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "iPhone"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "iPad")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: "#808080"
    }
  }, "Company"), /*#__PURE__*/React.createElement("a", {
    href: "Why Us.html"
  }, "Why us"), /*#__PURE__*/React.createElement("a", {
    href: "Corporate Services.html"
  }, "Corporate"), /*#__PURE__*/React.createElement("a", {
    href: "How It Works.html"
  }, "How it works"), /*#__PURE__*/React.createElement("a", {
    href: "Careers.html"
  }, "Careers")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: "#808080"
    }
  }, "Legal"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Warranty"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms")))), /*#__PURE__*/React.createElement("div", {
    className: "container icfooter-base"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 iCorrect Ltd. Not affiliated with Apple Inc."), /*#__PURE__*/React.createElement("span", null, "Company No. 09392844 \xB7 VAT GB 203495788")));
}
Object.assign(window, {
  Nav,
  Breadcrumb,
  TrustBand,
  IdentifyStrip,
  IdentifyHelper,
  ProductGrid,
  FAQ,
  Location,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Shell.jsx", error: String((e && e.message) || e) }); }

// icorrect/UniversalWizard.jsx
try { (() => {
// UniversalWizard — configurable entry-point quote wizard
//
// Props:
//   device     — "macbook" | "iphone" | "ipad" | "watch" | null (show device step)
//   repairType — "screen" | "battery" | etc. | null (show repair type step)
//   variant    — visual variant key passed to inner wiz wrapper
//   showFilters — show family/size filter chips on model step
//
// Steps:  Device → RepairType → Model → Issue → Quote+Booking
// Any pre-selected step is skipped. The Quote step reuses the full
// booking flow from Wizard.jsx (postcode, delivery, dates, timeline).

function UniversalWizard({
  device = null,
  repairType = null,
  variant = "v2",
  showFilters = true
}) {
  const LS_KEY = "icorrect-uwiz";
  const initialState = React.useMemo(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // If props changed (different page), reset
        if (parsed._device !== device || parsed._repairType !== repairType) return null;
        return parsed;
      }
    } catch {}
    return null;
  }, []);
  const makeDefault = () => {
    // Determine first visible step
    let step = "device";
    if (device) step = "repairType";
    if (device && repairType) step = "model";
    return {
      _device: device,
      _repairType: repairType,
      step,
      deviceId: device,
      repairTypeId: repairType,
      family: null,
      modelId: null,
      issueId: null,
      delivery: null,
      address: {
        line1: "",
        postcode: ""
      },
      contact: {
        name: "",
        email: "",
        phone: ""
      }
    };
  };
  const [state, setState] = React.useState(initialState || makeDefault());
  React.useEffect(() => {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(state));
    } catch {}
  }, [state]);
  const set = patch => setState(s => ({
    ...s,
    ...patch
  }));

  // Derived data
  const models = MODEL_CATALOG[state.deviceId] || [];
  const families = FAMILY_CATALOG[state.deviceId] || [];
  const repairTypes = REPAIR_TYPES_CATALOG[state.deviceId] || [];
  const issues = ISSUE_CATALOG[state.repairTypeId] || [];
  const model = models.find(m => m.id === state.modelId) || null;
  const issue = issues.find(i => i.id === state.issueId) || null;
  const price = model && state.repairTypeId ? getCatalogPrice(model.id, state.repairTypeId, state.deviceId) : null;
  const requiresDiagnosis = issue?.diagnosis || price == null;

  // Step navigation
  const steps = [];
  if (!device) steps.push("device");
  if (!repairType) steps.push("repairType");
  steps.push("model", "issue", "quote");
  const stepIdx = steps.indexOf(state.step);
  const totalSteps = steps.length;
  const stepNum = stepIdx + 1;
  const goBack = () => {
    if (stepIdx > 0) set({
      step: steps[stepIdx - 1]
    });
  };
  const reset = () => setState(makeDefault());

  // Device label for titles
  const deviceLabel = DEVICE_CATALOG.find(d => d.id === state.deviceId)?.name || "device";
  const repairLabel = repairTypes.find(r => r.id === state.repairTypeId)?.label || "repair";
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz wiz-" + variant,
    id: "wizard-root"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-progress-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: "#666"
    }
  }, "Step ", stepNum, " of ", totalSteps), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "wiz-escape-link",
    onClick: e => {
      e.preventDefault();
      set({
        step: "quote"
      });
    }
  }, "Have a question? Talk to us \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-dots"
  }, steps.map((s, i) => {
    const isDone = i < stepIdx;
    const isCurrent = i === stepIdx;
    const label = {
      device: "Device",
      repairType: "Repair",
      model: "Model",
      issue: "Issue",
      quote: "Quote"
    }[s];
    return /*#__PURE__*/React.createElement("button", {
      key: s,
      type: "button",
      disabled: i > stepIdx,
      onClick: () => i < stepIdx && set({
        step: s
      }),
      className: "wiz-dot" + (isDone ? " done" : "") + (isCurrent ? " current" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "wiz-dot-num"
    }, i + 1), /*#__PURE__*/React.createElement("div", {
      className: "wiz-dot-label"
    }, label));
  }))), state.step === "device" && /*#__PURE__*/React.createElement(UWizStepDevice, {
    onSelect: id => set({
      deviceId: id,
      repairTypeId: null,
      modelId: null,
      issueId: null,
      family: null,
      step: "repairType"
    })
  }), state.step === "repairType" && /*#__PURE__*/React.createElement(UWizStepRepairType, {
    deviceId: state.deviceId,
    onSelect: id => set({
      repairTypeId: id,
      modelId: null,
      issueId: null,
      step: "model"
    }),
    onBack: !device ? goBack : null
  }), state.step === "model" && /*#__PURE__*/React.createElement(UWizStepModel, {
    deviceId: state.deviceId,
    repairTypeId: state.repairTypeId,
    models: models,
    families: families,
    family: state.family,
    selected: model,
    showFilters: showFilters,
    onSelectFamily: f => set({
      family: f
    }),
    onSelect: m => set({
      modelId: m.id,
      step: "issue"
    }),
    onBack: goBack,
    deviceLabel: deviceLabel
  }), state.step === "issue" && /*#__PURE__*/React.createElement(UWizStepIssue, {
    issues: issues,
    selected: issue,
    repairLabel: repairLabel,
    onSelect: i => set({
      issueId: i.id,
      step: "quote"
    }),
    onBack: goBack
  }), state.step === "quote" && /*#__PURE__*/React.createElement(StepQuote, {
    model: model ? {
      ...model,
      price
    } : null,
    issue: issue,
    price: price,
    requiresDiagnosis: requiresDiagnosis,
    contact: state.contact,
    setContact: c => set({
      contact: c
    }),
    delivery: state.delivery,
    setDelivery: d => set({
      delivery: d
    }),
    address: state.address,
    setAddress: a => set({
      address: {
        ...state.address,
        ...a
      }
    }),
    onBack: goBack,
    onReset: reset
  }));
}

/* ── Step: Device ──────────────────────────────────────────────────────── */
function UWizStepDevice({
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "What device needs repairing?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, "We'll tailor the quote to your exact model."), /*#__PURE__*/React.createElement("div", {
    className: "uwiz-device-grid"
  }, DEVICE_CATALOG.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    className: "uwiz-device-card",
    onClick: () => onSelect(d.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "uwiz-device-icon"
  }, /*#__PURE__*/React.createElement(UWizDeviceIcon, {
    type: d.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "uwiz-device-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "uwiz-device-name"
  }, d.name), /*#__PURE__*/React.createElement("div", {
    className: "uwiz-device-detail"
  }, d.detail)), /*#__PURE__*/React.createElement("span", {
    className: "wiz-arrow"
  }, "\u2192")))));
}
function UWizDeviceIcon({
  type
}) {
  const s = {
    width: 28,
    height: 28,
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (type) {
    case "laptop":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "4",
        width: "16",
        height: "11",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M1 18h20M8 15h6"
      }));
    case "phone":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "6",
        y: "2",
        width: "10",
        height: "18",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 17h2"
      }));
    case "tablet":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "2",
        width: "14",
        height: "18",
        rx: "2"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M10 17h2"
      }));
    case "watch":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "7",
        y: "5",
        width: "8",
        height: "12",
        rx: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9 2h4M9 20h4"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("circle", {
        cx: "11",
        cy: "11",
        r: "8"
      }));
  }
}

/* ── Step: Repair type ─────────────────────────────────────────────────── */
function UWizStepRepairType({
  deviceId,
  onSelect,
  onBack
}) {
  const types = REPAIR_TYPES_CATALOG[deviceId] || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, onBack && /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: onBack
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "What needs fixing?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, "Pick the repair type \u2014 we'll match it to your model next."), /*#__PURE__*/React.createElement("div", {
    className: "wiz-list"
  }, types.map(t => {
    const fromPrice = getFromPrice(deviceId, t.id);
    return /*#__PURE__*/React.createElement("button", {
      key: t.id,
      className: "wiz-option-row",
      onClick: () => onSelect(t.id)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-name"
    }, t.label), /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-detail"
    }, t.detail)), /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-price"
    }, fromPrice ? /*#__PURE__*/React.createElement(React.Fragment, null, "from ", /*#__PURE__*/React.createElement("span", null, "\xA3", fromPrice)) : /*#__PURE__*/React.createElement("span", {
      className: "wiz-option-diag"
    }, "From \xA349")));
  })));
}

/* ── Step: Model (universal) ───────────────────────────────────────────── */
function UWizStepModel({
  deviceId,
  repairTypeId,
  models,
  families,
  family,
  selected,
  showFilters,
  onSelectFamily,
  onSelect,
  onBack,
  deviceLabel
}) {
  // MacBook gets a special guided flow: size → family (if ambiguous) → chip
  if (deviceId === "macbook") {
    return /*#__PURE__*/React.createElement(UWizMacBookModelFlow, {
      models: models,
      repairTypeId: repairTypeId,
      onSelect: onSelect,
      onBack: onBack
    });
  }
  // Other devices: standard list with family filter
  return /*#__PURE__*/React.createElement(UWizStepModelGeneric, {
    deviceId: deviceId,
    repairTypeId: repairTypeId,
    models: models,
    families: families,
    family: family,
    selected: selected,
    showFilters: showFilters,
    onSelectFamily: onSelectFamily,
    onSelect: onSelect,
    onBack: onBack,
    deviceLabel: deviceLabel
  });
}

/* ── MacBook guided model flow: Size → Family → Chip ───────────────────── */
function UWizMacBookModelFlow({
  models,
  repairTypeId,
  onSelect,
  onBack
}) {
  const [size, setSize] = React.useState(null); // 13 | 14 | 15 | 16
  const [familyPick, setFamilyPick] = React.useState(null); // "pro" | "air"

  // Available sizes (excluding "older" which has null size)
  const sizes = [...new Set(models.filter(m => m.size).map(m => m.size))].sort((a, b) => a - b);

  // Models matching selected size
  const modelsForSize = size ? models.filter(m => m.size === size) : [];

  // Distinct families for this size (to see if we need to ask pro/air)
  const familiesForSize = [...new Set(modelsForSize.map(m => m.family))];
  const needsFamilyPick = familiesForSize.length > 1 && !familyPick;

  // Models after filtering by family (if needed)
  const filteredModels = familyPick ? modelsForSize.filter(m => m.family === familyPick) : modelsForSize;

  // If only one model matches after size + family, auto-select it
  React.useEffect(() => {
    if (filteredModels.length === 1 && size && !needsFamilyPick) {
      // Don't auto-select — let user confirm via chip button
    }
  }, [filteredModels, size, needsFamilyPick]);
  const resetToSize = () => {
    setSize(null);
    setFamilyPick(null);
  };
  const resetToFamily = () => {
    setFamilyPick(null);
  };

  // Step 1: Pick screen size
  if (!size) {
    return /*#__PURE__*/React.createElement("div", {
      className: "wiz-step"
    }, /*#__PURE__*/React.createElement("button", {
      className: "wiz-back",
      onClick: onBack
    }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
      className: "wiz-step-title"
    }, "What size is your MacBook screen?"), /*#__PURE__*/React.createElement("p", {
      className: "wiz-step-sub"
    }, "Check the lid or look in Apple menu \u2192 About This Mac."), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-size-grid"
    }, sizes.map(s => /*#__PURE__*/React.createElement("button", {
      key: s,
      className: "uwiz-size-card",
      onClick: () => setSize(s)
    }, /*#__PURE__*/React.createElement("div", {
      className: "uwiz-size-visual"
    }, /*#__PURE__*/React.createElement(UWizScreenGlyph, {
      size: s
    })), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-size-label"
    }, s, "\""), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-size-detail"
    }, s === 13 && "Pro & Air", s === 14 && "Pro only", s === 15 && "Air only", s === 16 && "Pro only"))), /*#__PURE__*/React.createElement("button", {
      className: "uwiz-size-card uwiz-size-unsure",
      onClick: () => onSelect(models.find(m => m.family === "old"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "uwiz-size-label"
    }, "Not sure"), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-size-detail"
    }, "We'll identify it for you \xB7 \xA349 diagnostic"))));
  }

  // Step 2: Pick family (only if 13" — both Pro and Air exist)
  if (needsFamilyPick) {
    return /*#__PURE__*/React.createElement("div", {
      className: "wiz-step"
    }, /*#__PURE__*/React.createElement("button", {
      className: "wiz-back",
      onClick: resetToSize
    }, "\u2190 Change size"), /*#__PURE__*/React.createElement("h3", {
      className: "wiz-step-title"
    }, "MacBook Pro or Air?"), /*#__PURE__*/React.createElement("p", {
      className: "wiz-step-sub"
    }, "Both come in ", size, "\". Check the text on the lid or Apple menu \u2192 About This Mac."), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-family-pick"
    }, familiesForSize.filter(f => f !== "old").map(f => {
      const label = f === "pro" ? "MacBook Pro" : "MacBook Air";
      const detail = f === "pro" ? "Touch Bar · heavier · dual fan" : "Thinner · lighter · fanless (M1+)";
      return /*#__PURE__*/React.createElement("button", {
        key: f,
        className: "uwiz-family-card",
        onClick: () => setFamilyPick(f)
      }, /*#__PURE__*/React.createElement("div", {
        className: "uwiz-family-card-name"
      }, label), /*#__PURE__*/React.createElement("div", {
        className: "uwiz-family-card-detail"
      }, detail), /*#__PURE__*/React.createElement("span", {
        className: "wiz-arrow"
      }, "\u2192"));
    }), /*#__PURE__*/React.createElement("button", {
      className: "uwiz-family-card uwiz-family-unsure",
      onClick: () => onSelect(models.find(m => m.family === "old"))
    }, /*#__PURE__*/React.createElement("div", {
      className: "uwiz-family-card-name"
    }, "Not sure"), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-family-card-detail"
    }, "We'll identify it \xB7 \xA349 diagnostic"))));
  }

  // Step 3: Pick chip / generation
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: familiesForSize.length > 1 ? resetToFamily : resetToSize
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "Which chip?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, "Apple menu \u2192 About This Mac \u2192 look for \"Chip\" (Apple Silicon) or \"Processor\" (Intel)."), /*#__PURE__*/React.createElement("div", {
    className: "uwiz-chip-grid"
  }, filteredModels.map(m => {
    const p = repairTypeId ? m.prices[repairTypeId] : null;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      className: "uwiz-chip-card",
      onClick: () => onSelect(m)
    }, /*#__PURE__*/React.createElement("div", {
      className: "uwiz-chip-name"
    }, m.chipDetail || m.chip), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-chip-year"
    }, m.detail.split("·").pop().trim()), /*#__PURE__*/React.createElement("div", {
      className: "uwiz-chip-price"
    }, p != null ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("span", {
      className: "uwiz-chip-from"
    }, "from"), " \xA3", p) : "Diagnosis required"));
  })));
}
function UWizScreenGlyph({
  size
}) {
  // Proportional screen rectangles
  const scale = {
    13: 0.8,
    14: 0.88,
    15: 0.94,
    16: 1
  }[size] || 0.85;
  const w = Math.round(48 * scale);
  const h = Math.round(32 * scale);
  return /*#__PURE__*/React.createElement("svg", {
    width: "48",
    height: "36",
    viewBox: "0 0 48 36",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4"
  }, /*#__PURE__*/React.createElement("rect", {
    x: (48 - w) / 2,
    y: (32 - h) / 2,
    width: w,
    height: h,
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: (48 - w - 4) / 2,
    y: (32 - h) / 2 + h,
    width: w + 4,
    height: "3",
    rx: "0.5"
  }));
}

/* ── Generic model step (iPhone, iPad, Watch) ──────────────────────────── */
function UWizStepModelGeneric({
  deviceId,
  repairTypeId,
  models,
  families,
  family,
  selected,
  showFilters,
  onSelectFamily,
  onSelect,
  onBack,
  deviceLabel
}) {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia("(max-width: 640px)").matches);
  const [familyFilter, setFamilyFilter] = React.useState("all");
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  const shownModels = React.useMemo(() => {
    if (isMobile && family) return models.filter(m => m.family === family);
    if (familyFilter !== "all") return models.filter(m => m.family === familyFilter);
    return models;
  }, [models, isMobile, family, familyFilter]);
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: onBack
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "Which ", deviceLabel, "?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, "Select your model to see the exact price."), isMobile && !family && families.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-grid"
  }, families.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: "wiz-family-btn",
    onClick: () => onSelectFamily(f.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-name"
  }, f.name), /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-detail"
  }, f.detail)), /*#__PURE__*/React.createElement("span", {
    className: "wiz-arrow"
  }, "\u2192")))), (!isMobile || family) && /*#__PURE__*/React.createElement(React.Fragment, null, isMobile && family && /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: () => onSelectFamily(null)
  }, "\u2190 All families"), !isMobile && showFilters && families.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "wiz-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-filter-group",
    role: "group"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-filter-label"
  }, "Family"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-chip" + (familyFilter === "all" ? " active" : ""),
    onClick: () => setFamilyFilter("all")
  }, "All"), families.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    type: "button",
    className: "wiz-chip" + (familyFilter === f.id ? " active" : ""),
    onClick: () => setFamilyFilter(f.id)
  }, f.name.replace(/^(MacBook |iPhone |iPad |Apple Watch )/, ""))))), /*#__PURE__*/React.createElement("div", {
    className: "wiz-grid"
  }, shownModels.map(m => {
    const p = repairTypeId ? m.prices[repairTypeId] : null;
    return /*#__PURE__*/React.createElement("button", {
      key: m.id,
      className: "wiz-option" + (selected?.id === m.id ? " selected" : ""),
      onClick: () => onSelect(m)
    }, /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-main"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-name"
    }, m.name), /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-detail"
    }, m.detail)), /*#__PURE__*/React.createElement("div", {
      className: "wiz-option-price"
    }, p != null ? /*#__PURE__*/React.createElement(React.Fragment, null, "from ", /*#__PURE__*/React.createElement("span", null, "\xA3", p)) : /*#__PURE__*/React.createElement("span", {
      className: "wiz-option-diag"
    }, "Requires diagnosis")));
  }))));
}

/* ── Step: Issue ───────────────────────────────────────────────────────── */
function UWizStepIssue({
  issues,
  selected,
  repairLabel,
  onSelect,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: onBack
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "What's happening?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, "This helps us match the right repair. Some faults have a fixed price; others need diagnosis."), /*#__PURE__*/React.createElement("div", {
    className: "wiz-list"
  }, issues.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.id,
    className: "wiz-option-row" + (selected?.id === i.id ? " selected" : ""),
    onClick: () => onSelect(i)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-name"
  }, i.label), /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-detail"
  }, i.detail)), i.diagnosis ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-ring"
  }, "Diagnosis") : /*#__PURE__*/React.createElement("span", {
    className: "wiz-arrow"
  }, "\u2192")))));
}
Object.assign(window, {
  UniversalWizard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/UniversalWizard.jsx", error: String((e && e.message) || e) }); }

// icorrect/WhyUs.jsx
try { (() => {
// Why Us page — all section components
// Voice: confident, specific, quantified. No hype. Let the facts do the selling.

function WhyUsHero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-hero"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container whyus-hero-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-hero-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Why iCorrect"), /*#__PURE__*/React.createElement("h1", null, "The workshop other repair shops send their hardest jobs to."), /*#__PURE__*/React.createElement("p", null, "We're not a parts-swapping service. We're microelectronics engineers who work at the board level \u2014 individual chips, solder joints, and backlight circuits under a microscope. That's why insurers, corporates, and other repair shops trust us with the cases they can't solve."), /*#__PURE__*/React.createElement("div", {
    className: "whyus-hero-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "MacBook Screen Collection.html",
    className: "btn btn-dark btn-lg"
  }, "Get an instant quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517",
    className: "btn btn-light btn-lg"
  }, "Call us"))), /*#__PURE__*/React.createElement("div", {
    className: "whyus-hero-stats"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-num"
  }, "4.9"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-label"
  }, "Google rating"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-body"
  }, "719 verified reviews. Not curated, not incentivised \u2014 just honest feedback.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-num"
  }, "24 mo"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-label"
  }, "Warranty"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-body"
  }, "Double the industry standard. Parts, labour, and any re-work \u2014 no asterisks.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-num"
  }, "11 yr"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-label"
  }, "In business"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-body"
  }, "Founded in 2015 at our Fitzrovia workshop. Same team, same bench, same standards.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-num"
  }, "40k+"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-label"
  }, "Repairs completed"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-stat-body"
  }, "MacBooks, iPhones, iPads \u2014 from cracked screens to liquid-damaged logic boards.")))));
}
function DifferenceSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-diff"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "The difference"), /*#__PURE__*/React.createElement("h2", null, "Most repair shops replace parts. We repair them."), /*#__PURE__*/React.createElement("p", null, "The majority of repair services swap entire assemblies \u2014 screen, battery, logic board. We go deeper. That means lower cost, less waste, and fixes for problems other shops call \"unrepairable.\"")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-diff-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-diff-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-diff-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "A typical repair shop"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-ring"
  }, "Industry norm")), /*#__PURE__*/React.createElement("ul", {
    className: "whyus-diff-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Swaps the entire logic board when one chip fails \u2014 \xA3800+ for a \xA340 component")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Uses aftermarket screens that lose True Tone, peak brightness, and colour accuracy")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Sends complex jobs out to a third-party lab (adding days and markup)")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "6-month warranty at best \u2014 some offer 90 days or none at all")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2014"), /*#__PURE__*/React.createElement("span", null, "Diagnosis is a guess-and-swap process \u2014 you pay even if they can't fix it")))), /*#__PURE__*/React.createElement("div", {
    className: "whyus-diff-card highlight"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-diff-card-head"
  }, /*#__PURE__*/React.createElement("h3", null, "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "badge badge-dark"
  }, "Board-level")), /*#__PURE__*/React.createElement("ul", {
    className: "whyus-diff-list"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Replaces the individual chip, resistor, or capacitor under a microscope \u2014 saving you hundreds")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Genuine Apple displays, recalibrated in-house for True Tone, full brightness, and colour match")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "Every repair happens on our own bench in Fitzrovia \u2014 never outsourced, ever")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "2-year warranty on every repair \u2014 parts, labour, and re-work included")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    className: "icon"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, "\xA349 diagnosis with a written quote before any work starts \u2014 deducted from the repair cost if you proceed")))))));
}
function CapabilitiesSection() {
  const caps = [{
    icon: "microscope",
    title: "Microsoldering",
    body: "We rework individual BGA chips, capacitors, and resistors under a stereo microscope with lead-free solder. This is how we fix problems — like backlight failure or no-power faults — that other shops declare terminal.",
    tag: "Board-level",
    tagColor: "blue"
  }, {
    icon: "display",
    title: "Display calibration",
    body: "Every screen we fit is True Tone calibrated against a reference colour sensor, brightness-matched, and run through a 30-point QA checklist. No white-point drift, no aftermarket guesswork.",
    tag: "In-house",
    tagColor: "green"
  }, {
    icon: "water",
    title: "Liquid damage recovery",
    body: "Spilled liquid doesn't always mean a write-off. We ultrasonically clean the board, map the corrosion path under magnification, and replace only the components that shorted — recovering data and function.",
    tag: "Specialist",
    tagColor: "amber"
  }, {
    icon: "stagelight",
    title: "Stage Light repair",
    body: "The MacBook Pro 'Stage Light effect' — bright spots at the bottom of the display — is caused by a flex cable fatigue issue. We replace the backlight cable and driver IC, not the entire display assembly.",
    tag: "Board-level",
    tagColor: "blue"
  }, {
    icon: "chip",
    title: "IC replacement",
    body: "Backlight driver, USB-C controller, power management IC — we stock common Apple silicon and can reball or reflow BGAs on-site. No waiting for a third-party lab.",
    tag: "In-house",
    tagColor: "green"
  }, {
    icon: "data",
    title: "Data recovery",
    body: "Even when the logic board is too far gone to repair economically, we can often recover your data by transplanting the NAND storage to a donor board — encrypted and intact.",
    tag: "Specialist",
    tagColor: "amber"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-cap"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "What we can do"), /*#__PURE__*/React.createElement("h2", null, "Repairs other shops can't \u2014 or won't \u2014 attempt."), /*#__PURE__*/React.createElement("p", null, "Our technicians are trained in microelectronics, not just parts replacement. Here's what that means in practice.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-cap-grid"
  }, caps.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "whyus-cap-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-cap-icon"
  }, /*#__PURE__*/React.createElement(CapIcon, {
    type: c.icon
  })), /*#__PURE__*/React.createElement("span", {
    className: "whyus-cap-tag whyus-cap-tag-" + c.tagColor
  }, c.tag), /*#__PURE__*/React.createElement("h3", null, c.title), /*#__PURE__*/React.createElement("p", null, c.body))))));
}
function CapIcon({
  type
}) {
  const s = {
    width: 24,
    height: 24,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    strokeLinecap: "round",
    strokeLinejoin: "round"
  };
  switch (type) {
    case "microscope":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "7",
        r: "4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M12 11v6M8 21h8M10 17h4"
      }));
    case "display":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "3",
        y: "4",
        width: "18",
        height: "12",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M8 20h8M12 16v4"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 9h2M11 9h2M15 9h2",
        strokeWidth: "2",
        strokeLinecap: "round"
      }));
    case "water":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("path", {
        d: "M12 3c0 0-6 7-6 11a6 6 0 0012 0c0-4-6-11-6-11z"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.5 16a2.5 2.5 0 003.5-1"
      }));
    case "stagelight":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "4",
        y: "5",
        width: "16",
        height: "11",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M7 19h10"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M6 13h12",
        strokeWidth: "2",
        opacity: "0.4"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "9",
        cy: "13",
        r: "1",
        fill: "currentColor",
        stroke: "none"
      }), /*#__PURE__*/React.createElement("circle", {
        cx: "15",
        cy: "13",
        r: "1",
        fill: "currentColor",
        stroke: "none"
      }));
    case "chip":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("rect", {
        x: "7",
        y: "7",
        width: "10",
        height: "10",
        rx: "1.5"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M9.5 5V3M12 5V3M14.5 5V3M9.5 21V19M12 21V19M14.5 21V19M5 9.5H3M5 12H3M5 14.5H3M21 9.5H19M21 12H19M21 14.5H19"
      }));
    case "data":
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("ellipse", {
        cx: "12",
        cy: "6",
        rx: "8",
        ry: "3"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 6v6c0 1.66 3.58 3 8 3s8-1.34 8-3V6"
      }), /*#__PURE__*/React.createElement("path", {
        d: "M4 12v6c0 1.66 3.58 3 8 3s8-1.34 8-3v-6"
      }));
    default:
      return /*#__PURE__*/React.createElement("svg", s, /*#__PURE__*/React.createElement("circle", {
        cx: "12",
        cy: "12",
        r: "8"
      }));
  }
}
function TransparencySection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-transparent"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "How we work"), /*#__PURE__*/React.createElement("h2", null, "Total transparency. No grey areas."), /*#__PURE__*/React.createElement("p", null, "You'll know exactly what's happening with your device at every stage. We don't hide behind jargon or vague timelines.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-num"
  }, "\xA349"), /*#__PURE__*/React.createElement("h3", null, "Diagnosis"), /*#__PURE__*/React.createElement("p", null, "Walk in or send your device. We'll inspect it, identify the fault on the scope, and give you a written quote \u2014 no commitment. The fee is deducted from the repair cost if you proceed.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-num"
  }, "30-pt"), /*#__PURE__*/React.createElement("h3", null, "QA checklist"), /*#__PURE__*/React.createElement("p", null, "Every repair runs through a 30-point quality assurance pass before it leaves the bench \u2014 brightness uniformity, True Tone, keyboard, speakers, camera, Wi-Fi, and more.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-transparent-num"
  }, "Live"), /*#__PURE__*/React.createElement("h3", null, "Bench photos"), /*#__PURE__*/React.createElement("p", null, "We send timestamped photos from the workbench when your display comes off, when the new part goes on, and when QA passes. You see exactly what we did and why.")))));
}
function ReviewsSection() {
  const reviews = [{
    text: "Took my MacBook Pro in with the Stage Light issue. They explained exactly what was wrong at the component level, showed me the damaged flex cable, and had it back to me next day. Genuinely impressed by the technical knowledge.",
    author: "James T.",
    date: "3 weeks ago",
    initials: "JT"
  }, {
    text: "Our company sends all Apple repairs to iCorrect. They handle NDAs, provide audit trails for our IT department, and the turnaround is consistently faster than Apple's own service. The 2-year warranty sealed it for us.",
    author: "Sarah M.",
    date: "1 month ago",
    initials: "SM"
  }, {
    text: "I was told by two other shops that my water-damaged MacBook Air was beyond repair. iCorrect recovered the board and my data. I don't usually leave reviews but these people genuinely know what they're doing at a level most shops don't.",
    author: "David K.",
    date: "2 months ago",
    initials: "DK"
  }, {
    text: "Screen replaced on my M1 Pro 14-inch. True Tone still works perfectly, colours are spot-on, and the whole thing was done in under 24 hours. Half the price of the Apple Store. Will be back for anything else.",
    author: "Emma R.",
    date: "3 weeks ago",
    initials: "ER"
  }, {
    text: "I run a repair shop myself and outsource board-level work to iCorrect. Their microsoldering is excellent — backlight IC replacements, NAND transplants, things I can't do in-house. Fast, reliable, and they communicate well throughout.",
    author: "Chris W.",
    date: "1 month ago",
    initials: "CW"
  }, {
    text: "Brought in a 2019 MacBook Pro with a flickering display. They diagnosed a failing T-CON connection in about 20 minutes, quoted me on the spot, and I collected it fixed the next afternoon. Straightforward, no nonsense.",
    author: "Priya N.",
    date: "5 weeks ago",
    initials: "PN"
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-reviews"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-reviews-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "What our customers say"), /*#__PURE__*/React.createElement("h2", null, "719 Google reviews. Read any of them."), /*#__PURE__*/React.createElement("p", null, "We don't cherry-pick. These are verified Google Business reviews \u2014 the same ones you'd see if you searched \"iCorrect London\" right now.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-reviews-score"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-reviews-score-num"
  }, "4.9"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Stars, {
    rating: 4.9
  }), /*#__PURE__*/React.createElement("div", {
    className: "whyus-reviews-score-meta"
  }, "on Google")))), /*#__PURE__*/React.createElement("div", {
    className: "whyus-reviews-grid"
  }, reviews.map((r, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "whyus-review-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-stars"
  }, "\u2605\u2605\u2605\u2605\u2605"), /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-text"
  }, r.text), /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-author"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-avatar"
  }, r.initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-name"
  }, r.author), /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-date"
  }, r.date)), /*#__PURE__*/React.createElement("div", {
    className: "whyus-review-source"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7.14 6.36H11.2v1.92H7.14V13H5.04V8.28H1V6.36h4.04V1.5h2.1v4.86z",
    fill: "#4285F4"
  })), "Google")))))));
}
function TrustedBySection() {
  const clients = [{
    icon: "🏢",
    title: "Corporate IT departments",
    body: "We manage fleet repairs for London businesses — NDAs signed, GDPR-compliant processes, audit-ready repair logs, and priority turnaround on bulk work."
  }, {
    icon: "🛡",
    title: "Insurance companies",
    body: "Insurers refer policyholders to us because our quotes are itemised, our diagnostics are documented, and our repair-vs-replace decisions save them money."
  }, {
    icon: "🔧",
    title: "Other repair shops",
    body: "When a repair shop hits a board-level problem they can't solve in-house — a backlight IC, a NAND transplant, liquid damage — they send it to our bench."
  }, {
    icon: "🎓",
    title: "Universities & schools",
    body: "Education institutions trust us with student and staff MacBook fleets. We offer volume pricing, documented processes, and term-time priority scheduling."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-trusted"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "info-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Who trusts us"), /*#__PURE__*/React.createElement("h2", null, "Not just individuals. Businesses send their toughest repairs to us."), /*#__PURE__*/React.createElement("p", null, "From solo freelancers to corporate IT departments with 500-device fleets \u2014 our clients choose us because the work speaks for itself.")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-trusted-grid"
  }, clients.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "whyus-trusted-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "whyus-trusted-icon"
  }, c.icon), /*#__PURE__*/React.createElement("h4", null, c.title), /*#__PURE__*/React.createElement("p", null, c.body))))));
}
function WhyUsCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "whyus-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container whyus-cta-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Ready?"), /*#__PURE__*/React.createElement("h2", null, "Get a quote in 60 seconds. Or just walk in."), /*#__PURE__*/React.createElement("p", null, "Tell us your model and your issue. You'll see a fixed price, pick a date, and book \u2014 with a 2-year warranty and genuine Apple parts. No commitment until you say go."), /*#__PURE__*/React.createElement("div", {
    className: "whyus-cta-actions"
  }, /*#__PURE__*/React.createElement("a", {
    href: "MacBook Screen Collection.html",
    className: "btn btn-dark btn-lg"
  }, "Get an instant quote \u2192"), /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517",
    className: "btn btn-light btn-lg"
  }, "+44 (0)207 099 8517")), /*#__PURE__*/React.createElement("div", {
    className: "whyus-cta-contact"
  }, "Or email ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:support@icorrect.co.uk"
  }, "support@icorrect.co.uk"), " \xB7 Walk in Mon\u2013Fri, 12 Margaret St, Fitzrovia W1W 8JQ")));
}
function WhyUsBreadcrumb() {
  return /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Home"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), /*#__PURE__*/React.createElement("span", null, "Why Us")));
}
Object.assign(window, {
  WhyUsHero,
  DifferenceSection,
  CapabilitiesSection,
  TransparencySection,
  ReviewsSection,
  TrustedBySection,
  WhyUsCTA,
  WhyUsBreadcrumb,
  CapIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/WhyUs.jsx", error: String((e && e.message) || e) }); }

// icorrect/Wizard.jsx
try { (() => {
// === iCorrect wizard — pre-scoped to MacBook / Screen on collection page ===
// Step 1: Model (grouped by family) · Step 2: Issue · Step 3: Quote

const MAC_FAMILIES = [{
  id: "pro",
  name: "MacBook Pro",
  detail: "13\" · 14\" · 16\""
}, {
  id: "air",
  name: "MacBook Air",
  detail: "13\" · 15\""
}, {
  id: "old",
  name: "Older / Unsure",
  detail: "Pre-2018 or not listed"
}];
const MAC_MODELS = [{
  id: "mbp-14-m3",
  family: "pro",
  size: 14,
  name: "MacBook Pro 14\"",
  detail: "M3 / M3 Pro / M3 Max · 2023–24",
  price: 449
}, {
  id: "mbp-16-m3",
  family: "pro",
  size: 16,
  name: "MacBook Pro 16\"",
  detail: "M3 Pro / M3 Max · 2023–24",
  price: 599
}, {
  id: "mbp-14-m2",
  family: "pro",
  size: 14,
  name: "MacBook Pro 14\"",
  detail: "M1 Pro / M1 Max / M2 · 2021–23",
  price: 419
}, {
  id: "mbp-16-m2",
  family: "pro",
  size: 16,
  name: "MacBook Pro 16\"",
  detail: "M1 Pro / M1 Max / M2 · 2021–23",
  price: 549
}, {
  id: "mbp-13",
  family: "pro",
  size: 13,
  name: "MacBook Pro 13\"",
  detail: "Touch Bar · 2016–22",
  price: 389
}, {
  id: "mba-15",
  family: "air",
  size: 15,
  name: "MacBook Air 15\"",
  detail: "M2 / M3 · 2023–24",
  price: 379
}, {
  id: "mba-13-m",
  family: "air",
  size: 13,
  name: "MacBook Air 13\"",
  detail: "M1 / M2 / M3 · 2020–24",
  price: 329
}, {
  id: "mba-13-i",
  family: "air",
  size: 13,
  name: "MacBook Air 13\"",
  detail: "Intel / Retina · 2018–20",
  price: 299
}, {
  id: "older",
  family: "old",
  size: null,
  name: "Older MacBook",
  detail: "Pre-2018 · requires diagnosis",
  price: null
}];
const ISSUES = [{
  id: "cracked",
  label: "Cracked glass",
  detail: "Visible cracks or shatter"
}, {
  id: "dead",
  label: "Dead / black screen",
  detail: "No backlight or won't wake"
}, {
  id: "flicker",
  label: "Flickering",
  detail: "Lines, artifacts, or flashing"
}, {
  id: "ghost",
  label: "Stage light effect",
  detail: "Vertical bars (MBP 13/14/16)"
}, {
  id: "hinge",
  label: "Hinge / lid damage",
  detail: "Lid won't close or stuck",
  diagnosis: true
}, {
  id: "other",
  label: "Something else",
  detail: "Diagnosis required",
  diagnosis: true
}];

// Shared wizard state hook — persists to localStorage so mirror + main stay in sync
function useWizardState() {
  const initial = React.useMemo(() => {
    try {
      const raw = localStorage.getItem("icorrect-wizard");
      if (raw) return JSON.parse(raw);
    } catch {}
    return {
      step: 1,
      modelId: null,
      issueId: null,
      family: null,
      delivery: null,
      address: {
        line1: "",
        postcode: ""
      },
      contact: {
        name: "",
        email: "",
        phone: ""
      }
    };
  }, []);
  const [state, setState] = React.useState(initial);
  React.useEffect(() => {
    try {
      localStorage.setItem("icorrect-wizard", JSON.stringify(state));
    } catch {}
  }, [state]);
  const model = MAC_MODELS.find(m => m.id === state.modelId) || null;
  const issue = ISSUES.find(i => i.id === state.issueId) || null;
  const setStep = step => setState(s => ({
    ...s,
    step
  }));
  const setModel = m => setState(s => ({
    ...s,
    modelId: m?.id ?? null,
    family: m?.family ?? s.family,
    step: m ? 2 : s.step
  }));
  const setIssue = i => setState(s => ({
    ...s,
    issueId: i?.id ?? null,
    step: i ? 3 : s.step
  }));
  const setFamily = family => setState(s => ({
    ...s,
    family
  }));
  const setContact = contact => setState(s => ({
    ...s,
    contact
  }));
  const setDelivery = delivery => setState(s => ({
    ...s,
    delivery
  }));
  const setAddress = address => setState(s => ({
    ...s,
    address: {
      ...s.address,
      ...address
    }
  }));
  const reset = () => setState({
    step: 1,
    modelId: null,
    issueId: null,
    family: null,
    delivery: null,
    address: {
      line1: "",
      postcode: ""
    },
    contact: {
      name: "",
      email: "",
      phone: ""
    }
  });
  return {
    state,
    model,
    issue,
    setStep,
    setModel,
    setIssue,
    setFamily,
    setContact,
    setDelivery,
    setAddress,
    reset
  };
}
function Wizard({
  variant = "middle",
  showFilters = true
}) {
  const w = useWizardState();
  const requiresDiagnosis = w.issue?.diagnosis || w.model?.price == null;
  const price = requiresDiagnosis ? null : w.model?.price;

  // "Talk to us" escape → jump to step 3 with "chat" secondary open
  const handleAsk = () => {
    if (w.state.step < 3) w.setStep(3);
    // The secondary state lives inside StepQuote; we signal via a ref or just
    // scroll the user to step 3 where the Ask button is visible.
    // For now, jump to step 3 — StepQuote auto-shows the chat if ?ask is set.
    window.__wizAskOnMount = true;
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz wiz-" + variant,
    id: "wizard-root"
  }, /*#__PURE__*/React.createElement(WizProgress, {
    step: w.state.step,
    model: w.model,
    issue: w.issue,
    onJump: w.setStep,
    onAsk: handleAsk
  }), w.state.step === 1 && /*#__PURE__*/React.createElement(StepModel, {
    family: w.state.family,
    selected: w.model,
    onSelectFamily: w.setFamily,
    onSelect: w.setModel,
    showFilters: showFilters
  }), w.state.step === 2 && /*#__PURE__*/React.createElement(StepIssue, {
    issues: ISSUES,
    selected: w.issue,
    onSelect: w.setIssue,
    onBack: () => w.setStep(1)
  }), w.state.step === 3 && /*#__PURE__*/React.createElement(StepQuote, {
    model: w.model,
    issue: w.issue,
    price: price,
    requiresDiagnosis: requiresDiagnosis,
    contact: w.state.contact,
    setContact: w.setContact,
    delivery: w.state.delivery,
    setDelivery: w.setDelivery,
    address: w.state.address,
    setAddress: w.setAddress,
    onBack: () => w.setStep(2),
    onReset: w.reset
  }));
}
function WizProgress({
  step,
  model,
  issue,
  onJump,
  onAsk
}) {
  const steps = [{
    label: "Model",
    value: model?.name
  }, {
    label: "Issue",
    value: issue?.label
  }, {
    label: "Quote",
    value: null
  }];
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-progress-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: "#666"
    }
  }, "Step ", step, " of 3"), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "wiz-escape-link",
    onClick: e => {
      e.preventDefault();
      if (onAsk) onAsk();
    }
  }, "Have a question? Talk to us \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-dots"
  }, steps.map((s, i) => {
    const idx = i + 1;
    const isDone = idx < step;
    const isCurrent = idx === step;
    const canJump = idx < step || idx === 2 && model || idx === 3 && model && issue;
    return /*#__PURE__*/React.createElement("button", {
      key: s.label,
      type: "button",
      disabled: !canJump,
      onClick: () => canJump && onJump(idx),
      className: "wiz-dot" + (isDone ? " done" : "") + (isCurrent ? " current" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "wiz-dot-num"
    }, idx), /*#__PURE__*/React.createElement("div", {
      className: "wiz-dot-label"
    }, s.label));
  })));
}
function StepModel({
  family,
  selected,
  onSelectFamily,
  onSelect,
  showFilters = true
}) {
  // Mobile: family → variant. Desktop: show everything flat with filter chips.
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia("(max-width: 640px)").matches);
  const [familyFilter, setFamilyFilter] = React.useState("all"); // all | pro | air
  const [sizeFilter, setSizeFilter] = React.useState("all"); // all | 13 | 14 | 15 | 16

  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  const pickFamily = family;

  // Available sizes per family filter — only show size chips that exist in the current family
  const sizesForFamily = React.useMemo(() => {
    const pool = familyFilter === "all" ? MAC_MODELS : MAC_MODELS.filter(m => m.family === familyFilter);
    const sizes = [...new Set(pool.map(m => m.size).filter(Boolean))].sort((a, b) => a - b);
    return sizes;
  }, [familyFilter]);

  // If current size filter isn't valid for the selected family, reset it
  React.useEffect(() => {
    if (sizeFilter !== "all" && !sizesForFamily.includes(sizeFilter)) {
      setSizeFilter("all");
    }
  }, [sizesForFamily, sizeFilter]);
  const shownModels = React.useMemo(() => {
    if (isMobile && pickFamily) return MAC_MODELS.filter(m => m.family === pickFamily);
    return MAC_MODELS.filter(m => {
      if (familyFilter !== "all" && m.family !== familyFilter) return false;
      if (sizeFilter !== "all" && m.size !== sizeFilter) return false;
      return true;
    });
  }, [isMobile, pickFamily, familyFilter, sizeFilter]);
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "Which MacBook?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, isMobile && !pickFamily ? "Pick your family first — we'll narrow it down." : "We've identified the repair — just select your model."), isMobile && !pickFamily && /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-grid"
  }, MAC_FAMILIES.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    className: "wiz-family-btn",
    onClick: () => onSelectFamily(f.id)
  }, /*#__PURE__*/React.createElement(FamilyGlyph, {
    id: f.id
  }), /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-name"
  }, f.name), /*#__PURE__*/React.createElement("div", {
    className: "wiz-family-detail"
  }, f.detail)), /*#__PURE__*/React.createElement("span", {
    className: "wiz-arrow"
  }, "\u2192")))), (!isMobile || pickFamily) && /*#__PURE__*/React.createElement(React.Fragment, null, isMobile && pickFamily && /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: () => onSelectFamily(null)
  }, "\u2190 All families"), !isMobile && showFilters && /*#__PURE__*/React.createElement("div", {
    className: "wiz-filters"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-filter-group",
    role: "group",
    "aria-label": "Filter by family"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-filter-label"
  }, "Family"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-chip" + (familyFilter === "all" ? " active" : ""),
    onClick: () => setFamilyFilter("all")
  }, "All"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-chip" + (familyFilter === "pro" ? " active" : ""),
    onClick: () => setFamilyFilter("pro")
  }, "Pro"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-chip" + (familyFilter === "air" ? " active" : ""),
    onClick: () => setFamilyFilter("air")
  }, "Air")), sizesForFamily.length > 1 && /*#__PURE__*/React.createElement("div", {
    className: "wiz-filter-group",
    role: "group",
    "aria-label": "Filter by screen size"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-filter-label"
  }, "Size"), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-chip" + (sizeFilter === "all" ? " active" : ""),
    onClick: () => setSizeFilter("all")
  }, "All"), sizesForFamily.map(s => /*#__PURE__*/React.createElement("button", {
    key: s,
    type: "button",
    className: "wiz-chip" + (sizeFilter === s ? " active" : ""),
    onClick: () => setSizeFilter(s)
  }, s, "\""))), (familyFilter !== "all" || sizeFilter !== "all") && /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-filter-clear",
    onClick: () => {
      setFamilyFilter("all");
      setSizeFilter("all");
    }
  }, "Clear")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-grid"
  }, shownModels.map(m => /*#__PURE__*/React.createElement("button", {
    key: m.id,
    className: "wiz-option" + (selected?.id === m.id ? " selected" : ""),
    onClick: () => onSelect(m)
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-name"
  }, m.name), /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-detail"
  }, m.detail)), /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-price"
  }, m.price ? /*#__PURE__*/React.createElement(React.Fragment, null, "from ", /*#__PURE__*/React.createElement("span", null, "\xA3", m.price)) : /*#__PURE__*/React.createElement("span", {
    className: "wiz-option-diag"
  }, "Requires diagnosis")))), shownModels.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "wiz-empty"
  }, "No models match. ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: () => {
      setFamilyFilter("all");
      setSizeFilter("all");
    }
  }, "Clear filters")))), /*#__PURE__*/React.createElement(ModelHelpCard, null));
}
function FamilyGlyph({
  id
}) {
  const common = {
    width: 48,
    height: 32,
    viewBox: "0 0 48 32",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4
  };
  if (id === "pro") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
    x: "4",
    y: "3",
    width: "40",
    height: "24",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "27",
    width: "48",
    height: "3",
    rx: "0.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "20",
    y1: "29",
    x2: "28",
    y2: "29"
  }));
  if (id === "air") return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "5",
    width: "36",
    height: "20",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "25",
    width: "44",
    height: "3",
    rx: "0.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "21",
    y1: "27",
    x2: "27",
    y2: "27"
  }));
  return /*#__PURE__*/React.createElement("svg", common, /*#__PURE__*/React.createElement("rect", {
    x: "5",
    y: "4",
    width: "38",
    height: "22",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "5",
    y1: "8",
    x2: "43",
    y2: "8"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "26",
    width: "48",
    height: "3",
    rx: "0.5"
  }));
}
function ModelHelpCard() {
  const [code, setCode] = React.useState("");
  const submit = e => {
    e.preventDefault();
    const el = document.getElementById("identify");
    if (el) el.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-help-cta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-help-cta-icon",
    "aria-hidden": "true"
  }, "A2442"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-help-cta-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Don't know which MacBook you have?"), /*#__PURE__*/React.createElement("span", null, "Type the model code from the underside \u2014 or jump to the visual guide.")), /*#__PURE__*/React.createElement("form", {
    className: "wiz-help-cta-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("input", {
    placeholder: "e.g. A2442",
    value: code,
    onChange: e => setCode(e.target.value),
    "aria-label": "MacBook model code"
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit"
  }, "Identify")));
}
function StepIssue({
  issues,
  selected,
  onSelect,
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: onBack
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "wiz-step-title"
  }, "What's happening?"), /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub"
  }, "Most screen issues have a fixed price. Some require diagnosis."), /*#__PURE__*/React.createElement("div", {
    className: "wiz-list"
  }, issues.map(i => /*#__PURE__*/React.createElement("button", {
    key: i.id,
    className: "wiz-option-row" + (selected?.id === i.id ? " selected" : ""),
    onClick: () => onSelect(i)
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-name"
  }, i.label), /*#__PURE__*/React.createElement("div", {
    className: "wiz-option-detail"
  }, i.detail)), i.diagnosis ? /*#__PURE__*/React.createElement("span", {
    className: "badge badge-ring"
  }, "Diagnosis") : /*#__PURE__*/React.createElement("span", {
    className: "wiz-arrow"
  }, "\u2192")))));
}
const LONDON_POSTCODES = ["E", "EC", "N", "NW", "SE", "SW", "W", "WC"];
function isLondonPostcode(pc) {
  if (!pc) return false;
  const trimmed = pc.trim().toUpperCase().replace(/\s+/g, "");
  if (trimmed.length < 2) return false;
  // Match against area prefixes (letters before the first digit)
  const area = trimmed.match(/^[A-Z]+/)?.[0];
  return LONDON_POSTCODES.includes(area);
}

// Postcode → service zone classifier.
// Returns 'london' | 'uk' | 'international' | 'invalid' | 'empty'.
function classifyPostcode(pc) {
  if (!pc || !pc.trim()) return "empty";
  const trimmed = pc.trim().toUpperCase().replace(/\s+/g, "");
  // UK postcode shape: 1–2 letters, then digit, optional letter, then digit + 2 letters.
  // Be lenient — accept partial postcodes once they have at least 1 letter + 1 digit.
  if (!/^[A-Z]{1,2}[0-9][A-Z0-9]?/.test(trimmed)) return "international";
  return isLondonPostcode(trimmed) ? "london" : "uk";
}
const COURIER_FEE = 20; // legacy London-courier fee (used while pricing isn't wired to zones yet)
const NEXT_DAY_COURIER_FEE = 24; // UK-wide next-day courier kit
const FAST_TURNAROUND_FEE = 79;

// ── Date helpers (UK working days, Mon–Fri, excl. UK bank holidays) ───────
// England & Wales bank holidays — extended through end of 2026.
// Source: gov.uk/bank-holidays. Dates are ISO YYYY-MM-DD.
const UK_BANK_HOLIDAYS = new Set([
// 2026
"2026-01-01",
// New Year's Day
"2026-04-03",
// Good Friday
"2026-04-06",
// Easter Monday
"2026-05-04",
// Early May bank holiday
"2026-05-25",
// Spring bank holiday
"2026-08-31",
// Summer bank holiday
"2026-12-25",
// Christmas Day
"2026-12-28",
// Boxing Day (substitute, since 26 Dec is Sat)
// 2027 (so the calendar still works rolling forward)
"2027-01-01", "2027-03-26",
// Good Friday
"2027-03-29",
// Easter Monday
"2027-05-03", "2027-05-31", "2027-08-30", "2027-12-27",
// Christmas Day substitute
"2027-12-28" // Boxing Day substitute
]);
function isoDate(d) {
  // Local-date ISO (YYYY-MM-DD), not UTC, so timezone doesn't shift the day.
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}
function isWorkingDay(d) {
  const dow = d.getDay();
  if (dow === 0 || dow === 6) return false;
  if (UK_BANK_HOLIDAYS.has(isoDate(d))) return false;
  return true;
}
function bankHolidayName(d) {
  // Friendly label for blackout dates the user can see.
  const map = {
    "2026-01-01": "New Year's Day",
    "2026-04-03": "Good Friday",
    "2026-04-06": "Easter Monday",
    "2026-05-04": "May Day",
    "2026-05-25": "Spring bank holiday",
    "2026-08-31": "Summer bank holiday",
    "2026-12-25": "Christmas Day",
    "2026-12-28": "Boxing Day",
    "2027-01-01": "New Year's Day",
    "2027-03-26": "Good Friday",
    "2027-03-29": "Easter Monday",
    "2027-05-03": "May Day",
    "2027-05-31": "Spring bank holiday",
    "2027-08-30": "Summer bank holiday",
    "2027-12-27": "Christmas",
    "2027-12-28": "Boxing Day"
  };
  return map[isoDate(d)] || null;
}
function addWorkingDays(d, n) {
  const out = new Date(d);
  let added = 0;
  while (added < n) {
    out.setDate(out.getDate() + 1);
    if (isWorkingDay(out)) added += 1;
  }
  return out;
}
function nextWorkingDay(d) {
  return addWorkingDays(d, 1);
}
function fmtDate(d) {
  // Accept either a Date or an ISO/parsable date string — walkInDate is stored as
  // ISO so callers shouldn't have to remember to wrap it.
  const date = d instanceof Date ? d : new Date(d);
  if (!date || isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function fmtDateRange(a, b) {
  const sameMonth = a.getMonth() === b.getMonth();
  const aStr = a.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    ...(sameMonth ? {} : {
      month: "short"
    })
  });
  const bStr = b.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
  return `${aStr} – ${bStr}`;
}
// Mon–Fri working dates (excl. UK bank holidays) for the next ~3 weeks
function upcomingWalkInDates(count = 8) {
  const out = [];
  const d = new Date();
  while (out.length < count) {
    d.setDate(d.getDate() + 1);
    if (isWorkingDay(d)) out.push(new Date(d));
  }
  return out;
}
const WALK_IN_TIMES = [{
  time: "10:00",
  full: false
}, {
  time: "11:00",
  full: false
}, {
  time: "12:00",
  full: true
},
// mock: full
{
  time: "13:00",
  full: false
}, {
  time: "14:00",
  full: false
}, {
  time: "15:00",
  full: true
},
// mock: full
{
  time: "16:00",
  full: false
}, {
  time: "17:00",
  full: false
}];

// Build the stepped timeline shown on Step 3 once the customer has picked a
// delivery method and turnaround tier. Returns an ordered list of {label, date, note?, final?}.
function buildTimeline({
  delivery,
  walkInDate,
  walkInTime,
  courierDate,
  courierWindow,
  arrivalDate,
  today,
  returnDate,
  turnaround
}) {
  const steps = [];
  const turnaroundLabel = turnaround === "fast" ? "Fast turnaround" : "Standard turnaround";
  const courierWindowLabel = courierWindow ? COURIER_WINDOWS.find(w => w.id === courierWindow)?.label : null;
  if (delivery === "walkin" && walkInDate) {
    steps.push({
      label: "Drop off at our Fitzrovia workshop",
      date: fmtDate(walkInDate) + (walkInTime ? ` · ${walkInTime}` : ""),
      note: "We'll inspect with you and confirm the price."
    });
    steps.push({
      label: "We repair on-site",
      date: turnaroundLabel,
      note: "Genuine Apple parts, calibrated in-house."
    });
  } else if (delivery === "courier" && courierDate) {
    steps.push({
      label: "We collect by same-day courier",
      date: fmtDate(courierDate) + (courierWindowLabel ? ` · ${courierWindowLabel}` : ""),
      note: "Tracked door-to-door · £20 within central London."
    });
    steps.push({
      label: "We repair at the workshop",
      date: turnaroundLabel,
      note: "Status updates by SMS at each stage."
    });
  } else if (delivery === "mail") {
    steps.push({
      label: "Post your MacBook (any UK address)",
      date: `Post by ${fmtDate(today)}`,
      note: "Use our prepaid Royal Mail Special Delivery label."
    });
    steps.push({
      label: "Arrives at workshop",
      date: fmtDate(arrivalDate)
    });
    steps.push({
      label: "We repair",
      date: turnaroundLabel,
      note: "Status updates by SMS at each stage."
    });
  }
  if (returnDate) {
    steps.push({
      label: delivery === "walkin" ? "Ready to collect" : "Returned to you",
      date: fmtDate(returnDate),
      note: delivery === "walkin" ? "We'll text when it's ready — pop in any time before 6pm." : "Tracked return delivery, signed-for.",
      final: true
    });
  }
  return steps;
}

// 3-hour same-day courier collection windows
const COURIER_WINDOWS = [{
  id: "morn",
  label: "9:00 – 12:00"
}, {
  id: "mid",
  label: "12:00 – 15:00"
}, {
  id: "aft",
  label: "15:00 – 18:00"
}];
function StepQuote({
  model,
  issue,
  price,
  requiresDiagnosis,
  contact,
  setContact,
  delivery,
  setDelivery,
  address,
  setAddress,
  onBack,
  onReset
}) {
  const [secondary, setSecondary] = React.useState(() => {
    // If the user clicked "Talk to us" from another step, auto-open chat.
    if (window.__wizAskOnMount) {
      window.__wizAskOnMount = false;
      return "chat";
    }
    return null;
  });
  const [submitted, setSubmitted] = React.useState(false);
  const [walkInDate, setWalkInDate] = React.useState(null);
  const [walkInTime, setWalkInTime] = React.useState(null);
  const [courierDate, setCourierDate] = React.useState(null);
  const [courierWindow, setCourierWindow] = React.useState(null);
  const [turnaround, setTurnaround] = React.useState("standard"); // "standard" | "fast"

  const londonOk = isLondonPostcode(address?.postcode);
  const zone = classifyPostcode(address?.postcode);
  const postcodeKnown = zone === "london" || zone === "uk";

  // Once we know a zone, narrow what services appear. Until then we ask for the postcode.
  // Available service ids by zone.
  const availableServices = (() => {
    if (zone === "london") return ["walkin", "courier", "mail"];
    if (zone === "uk") return ["walkin", "mail"];
    return []; // empty / international → ask for postcode first
  })();

  // If the user had courier picked but their postcode is not London, fall back to mail.
  const effectiveDelivery = delivery === "courier" && postcodeKnown && !londonOk ? "mail" : delivery;
  const courierFee = effectiveDelivery === "courier" && londonOk ? COURIER_FEE : 0;
  const fastFee = turnaround === "fast" ? FAST_TURNAROUND_FEE : 0;
  const total = price != null ? price + courierFee + fastFee : null;

  // Estimated dates
  const today = new Date();
  // Courier date defaults to next working day if user hasn't picked one yet.
  const collectionDate = effectiveDelivery === "courier" ? courierDate ? new Date(courierDate) : nextWorkingDay(today) : null;
  const arrivalDate = effectiveDelivery === "mail" ? addWorkingDays(today, 2) : null;

  // The day work actually starts in the workshop, regardless of turnaround tier.
  const serviceStartDate = effectiveDelivery === "walkin" && walkInDate ? new Date(walkInDate) : effectiveDelivery === "courier" ? collectionDate : effectiveDelivery === "mail" ? arrivalDate : null;

  // Compute return-by dates for BOTH tiers so each turnaround card can show its own date.
  const computeReturn = (start, days) => {
    if (!start) return null;
    return nextWorkingDay(addWorkingDays(start, days));
  };
  const standardReturnDate = computeReturn(serviceStartDate, 2);
  const fastReturnDate = computeReturn(serviceStartDate, 1);
  const returnDate = turnaround === "fast" ? fastReturnDate : standardReturnDate;

  // Surface the next bank-holiday blackout if it falls inside the active timeline.
  const nextBlackout = (() => {
    const start = new Date(today);
    const end = returnDate || addWorkingDays(today, 7);
    const cursor = new Date(start);
    while (cursor <= end) {
      const dow = cursor.getDay();
      if (dow !== 0 && dow !== 6 && UK_BANK_HOLIDAYS.has(isoDate(cursor))) {
        return new Date(cursor);
      }
      cursor.setDate(cursor.getDate() + 1);
    }
    return null;
  })();
  const canSubmit = !!delivery && (delivery !== "courier" || londonOk && courierDate && courierWindow) && (delivery !== "walkin" || walkInDate && walkInTime) && (!secondary || contact.name && contact.email);

  // Smart button label — tells the user exactly what's blocking them.
  const nextAction = (() => {
    if (!postcodeKnown) return {
      label: "Enter postcode to continue",
      target: "wiz-postcode"
    };
    if (!delivery) return {
      label: "Pick a service to continue",
      target: "wiz-delivery-section"
    };
    if (delivery === "walkin" && !walkInDate) return {
      label: "Pick a day to continue",
      target: "wiz-walkin-dates"
    };
    if (delivery === "walkin" && !walkInTime) return {
      label: "Pick a time to continue",
      target: "wiz-walkin-times"
    };
    if (delivery === "courier" && !courierDate) return {
      label: "Pick a collection day to continue",
      target: "wiz-courier-dates"
    };
    if (delivery === "courier" && !courierWindow) return {
      label: "Pick a collection window to continue",
      target: "wiz-courier-windows"
    };
    if (secondary && !contact.name) return {
      label: "Enter your name to continue",
      target: null
    };
    if (secondary && !contact.email) return {
      label: "Enter your email to continue",
      target: null
    };
    return null; // all good → canSubmit is true
  })();
  const ctaLabel = nextAction ? nextAction.label : requiresDiagnosis ? "Continue to checkout · Free diagnosis" : `Continue to checkout · £${total}`;

  // When user taps the disabled button, nudge the incomplete section into view.
  const nudgeRef = React.useRef(null);
  const [nudgeTarget, setNudgeTarget] = React.useState(null);
  const handleDisabledTap = () => {
    if (canSubmit) return;
    if (nextAction?.target) {
      const el = document.getElementById(nextAction.target);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        setNudgeTarget(nextAction.target);
        clearTimeout(nudgeRef.current);
        nudgeRef.current = setTimeout(() => setNudgeTarget(null), 1600);
      }
    }
  };

  // Booking sub-flow progress (postcode → service → date/time → checkout)
  const bookingProgress = {
    postcode: postcodeKnown,
    service: !!delivery,
    dateTime: delivery === "mail" ? true : delivery === "walkin" ? !!(walkInDate && walkInTime) : delivery === "courier" ? !!(courierDate && courierWindow) : false
  };
  const submit = e => {
    e.preventDefault();
    setSubmitted(true);
  };
  if (submitted) {
    const copy = secondary === "email" ? {
      title: "Quote sent",
      sub: "Check your inbox — we've sent a formatted quote you can forward to your insurer. Reply any time to book the repair."
    } : secondary === "chat" ? {
      title: "We'll be in touch",
      sub: "One of our technicians will message you within 2 working hours to answer your questions before you decide."
    } : {
      title: "Redirecting to checkout…",
      sub: effectiveDelivery === "walkin" ? `We'll see you ${walkInDate ? fmtDate(walkInDate) : "soon"}${walkInTime ? ` at ${walkInTime}` : ""} at 12 Margaret St, W1W 8JQ.` : effectiveDelivery === "courier" ? `Your London courier will collect ${collectionDate ? fmtDate(collectionDate) : "tomorrow"}${courierWindow ? ` between ${COURIER_WINDOWS.find(w => w.id === courierWindow)?.label}` : ""}.` : "We'll email a pre-paid shipping label as soon as your order is confirmed."
    };
    return /*#__PURE__*/React.createElement("div", {
      className: "wiz-step wiz-quote"
    }, /*#__PURE__*/React.createElement("div", {
      className: "wiz-check"
    }, "\u2713"), /*#__PURE__*/React.createElement("h3", {
      className: "wiz-step-title"
    }, copy.title), /*#__PURE__*/React.createElement("p", {
      className: "wiz-step-sub",
      style: {
        maxWidth: 440,
        margin: "0 auto 24px"
      }
    }, copy.sub), /*#__PURE__*/React.createElement("button", {
      className: "btn btn-light",
      onClick: onReset
    }, "Start over"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "wiz-step wiz-quote"
  }, /*#__PURE__*/React.createElement("button", {
    className: "wiz-back",
    onClick: onBack
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Your quote"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Device"), /*#__PURE__*/React.createElement("span", null, model?.name)), /*#__PURE__*/React.createElement("div", {
    className: "wiz-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Issue"), /*#__PURE__*/React.createElement("span", null, issue?.label)), /*#__PURE__*/React.createElement("div", {
    className: "wiz-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Warranty"), /*#__PURE__*/React.createElement("span", null, "2 years")), !requiresDiagnosis && price && /*#__PURE__*/React.createElement("div", {
    className: "wiz-price-row"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label"
  }, "Repair"), (courierFee > 0 || fastFee > 0) && /*#__PURE__*/React.createElement("div", {
    className: "wiz-price-note"
  }, [fastFee > 0 ? `+ £${fastFee} fast turnaround` : null, courierFee > 0 ? `+ £${courierFee} London courier` : null].filter(Boolean).join(" · "))), /*#__PURE__*/React.createElement("div", {
    className: "wiz-price"
  }, "\xA3", total)), requiresDiagnosis && /*#__PURE__*/React.createElement("div", {
    className: "wiz-diagnosis-note"
  }, /*#__PURE__*/React.createElement("strong", null, "Free diagnosis first."), " We'll inspect your device and send an exact quote within 24 hours before any work begins.")), !requiresDiagnosis && price && /*#__PURE__*/React.createElement("div", {
    className: "wiz-quote-trust",
    role: "list",
    "aria-label": "Why iCorrect"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-quote-trust-item",
    role: "listitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-quote-trust-icon",
    "aria-hidden": "true"
  }, "\u2605"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "4.8"), " \xB7 719 Google reviews")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-quote-trust-item",
    role: "listitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-quote-trust-icon",
    "aria-hidden": "true"
  }, "\u23F1"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "2-year"), " warranty")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-quote-trust-item",
    role: "listitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-quote-trust-icon",
    "aria-hidden": "true"
  }, "\u2699"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "Apple-original"), " parts")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-quote-trust-item",
    role: "listitem"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-quote-trust-icon",
    "aria-hidden": "true"
  }, "\u2713"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "\xA30"), " if we can't fix it"))), /*#__PURE__*/React.createElement("form", {
    className: "wiz-contact",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-booking-progress",
    "aria-label": "Booking steps"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-step" + (bookingProgress.postcode ? " done" : " current")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-num"
  }, bookingProgress.postcode ? "✓" : "1"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-label"
  }, "Postcode")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-step" + (bookingProgress.service ? " done" : bookingProgress.postcode ? " current" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-num"
  }, bookingProgress.service ? "✓" : "2"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-label"
  }, "Service")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-step" + (bookingProgress.dateTime ? " done" : bookingProgress.service ? " current" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-num"
  }, bookingProgress.dateTime ? "✓" : "3"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-label"
  }, delivery === "mail" ? "Ready" : "Date & time")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "wiz-bp-step" + (canSubmit && !secondary ? " current" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-num"
  }, "4"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-bp-label"
  }, "Checkout"))), /*#__PURE__*/React.createElement("div", {
    className: "wiz-postcode-card" + (postcodeKnown ? " wiz-postcode-card-resolved" : "")
  }, /*#__PURE__*/React.createElement("label", {
    className: "wiz-postcode-label",
    htmlFor: "wiz-postcode"
  }, "See when you'll get it back", /*#__PURE__*/React.createElement("span", {
    className: "wiz-postcode-hint"
  }, "Enter your postcode for delivery options and a real return-by date \u2014 most repairs collected today are back tomorrow.")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-postcode-row"
  }, /*#__PURE__*/React.createElement("input", {
    id: "wiz-postcode",
    className: "wiz-postcode-input",
    placeholder: "e.g. W1W 8JQ",
    autoComplete: "postal-code",
    value: address?.postcode || "",
    onChange: e => setAddress({
      ...address,
      postcode: e.target.value
    })
  })), zone === "international" && /*#__PURE__*/React.createElement("div", {
    className: "wiz-postcode-warn"
  }, /*#__PURE__*/React.createElement("strong", null, "Looks like a non-UK postcode."), " We currently ship within the UK only \u2014 you can still ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-postcode-link",
    onClick: () => {
      setAddress({
        ...address,
        postcode: ""
      });
      setDelivery("walkin");
    }
  }, "walk in to our Fitzrovia workshop"), "."), !postcodeKnown && zone !== "international" && /*#__PURE__*/React.createElement("ul", {
    className: "wiz-postcode-unlocks",
    "aria-label": "What you can choose from"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2713"), " Walk in ", /*#__PURE__*/React.createElement("span", {
    className: "wiz-postcode-unlocks-meta"
  }, "(free)")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2713"), " Same-day London courier"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2713"), " Next-day UK courier"))), postcodeKnown && /*#__PURE__*/React.createElement("div", {
    id: "wiz-delivery-section",
    className: "wiz-delivery-grid" + (nudgeTarget === "wiz-delivery-section" ? " wiz-nudge" : "")
  }, /*#__PURE__*/React.createElement(DeliveryCard, {
    id: "walkin",
    active: delivery === "walkin",
    onSelect: () => setDelivery("walkin"),
    title: "Walk in",
    subtitle: "12 Margaret St, Fitzrovia W1W 8JQ",
    price: "Free",
    badge: null
  }), availableServices.includes("courier") && /*#__PURE__*/React.createElement(DeliveryCard, {
    id: "courier",
    active: delivery === "courier",
    onSelect: () => setDelivery("courier"),
    title: "Same-day courier",
    subtitle: "London only \xB7 door-to-door",
    price: "+£" + COURIER_FEE,
    badge: "Popular"
  }), /*#__PURE__*/React.createElement(DeliveryCard, {
    id: "mail",
    active: delivery === "mail",
    onSelect: () => setDelivery("mail"),
    title: "Next-day courier",
    subtitle: "Pre-paid kit \xB7 UK-wide",
    price: "+£" + NEXT_DAY_COURIER_FEE,
    badge: null
  })), delivery === "walkin" && /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-section-label"
  }, "Pick a day & time"), /*#__PURE__*/React.createElement("div", {
    id: "wiz-walkin-dates",
    className: "wiz-walkin-dates" + (nudgeTarget === "wiz-walkin-dates" ? " wiz-nudge" : "")
  }, upcomingWalkInDates(8).map((d, i) => {
    const sel = walkInDate && d.toDateString() === new Date(walkInDate).toDateString();
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "wiz-walkin-date" + (sel ? " active" : ""),
      onClick: () => setWalkInDate(d.toISOString())
    }, /*#__PURE__*/React.createElement("span", {
      className: "wiz-walkin-dow"
    }, d.toLocaleDateString("en-GB", {
      weekday: "short"
    })), /*#__PURE__*/React.createElement("span", {
      className: "wiz-walkin-day"
    }, d.getDate()), /*#__PURE__*/React.createElement("span", {
      className: "wiz-walkin-mon"
    }, d.toLocaleDateString("en-GB", {
      month: "short"
    })));
  })), walkInDate && /*#__PURE__*/React.createElement("div", {
    id: "wiz-walkin-times",
    className: "wiz-walkin-times" + (nudgeTarget === "wiz-walkin-times" ? " wiz-nudge" : "")
  }, WALK_IN_TIMES.map(slot => /*#__PURE__*/React.createElement("button", {
    key: slot.time,
    type: "button",
    disabled: slot.full,
    className: "wiz-walkin-time" + (walkInTime === slot.time ? " active" : "") + (slot.full ? " full" : ""),
    onClick: () => !slot.full && setWalkInTime(slot.time)
  }, slot.time, slot.full && /*#__PURE__*/React.createElement("span", {
    className: "wiz-slot-full"
  }, "Full"))))), delivery === "courier" && londonOk && /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-courier-confirm"
  }, "\u2713 Same-day courier available for ", /*#__PURE__*/React.createElement("strong", null, (address?.postcode || "").toUpperCase()), " \xB7 \xA3", COURIER_FEE, " \xB7 full address at checkout."), /*#__PURE__*/React.createElement("div", {
    className: "wiz-section-label"
  }, "Pick a collection day"), /*#__PURE__*/React.createElement("div", {
    id: "wiz-courier-dates",
    className: "wiz-walkin-dates" + (nudgeTarget === "wiz-courier-dates" ? " wiz-nudge" : "")
  }, upcomingWalkInDates(8).map((d, i) => {
    const sel = courierDate && d.toDateString() === new Date(courierDate).toDateString();
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "wiz-walkin-date" + (sel ? " active" : ""),
      onClick: () => setCourierDate(d.toISOString())
    }, /*#__PURE__*/React.createElement("span", {
      className: "wiz-walkin-dow"
    }, d.toLocaleDateString("en-GB", {
      weekday: "short"
    })), /*#__PURE__*/React.createElement("span", {
      className: "wiz-walkin-day"
    }, d.getDate()), /*#__PURE__*/React.createElement("span", {
      className: "wiz-walkin-mon"
    }, d.toLocaleDateString("en-GB", {
      month: "short"
    })));
  })), courierDate && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "wiz-section-label wiz-section-label-sub"
  }, "Pick a 3-hour collection window"), /*#__PURE__*/React.createElement("div", {
    id: "wiz-courier-windows",
    className: "wiz-courier-windows" + (nudgeTarget === "wiz-courier-windows" ? " wiz-nudge" : "")
  }, COURIER_WINDOWS.map(w => /*#__PURE__*/React.createElement("button", {
    key: w.id,
    type: "button",
    className: "wiz-courier-window" + (courierWindow === w.id ? " active" : ""),
    onClick: () => setCourierWindow(w.id)
  }, w.label))))), !requiresDiagnosis && price && postcodeKnown && /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-section-label"
  }, "Repair turnaround"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-grid"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-turnaround-card" + (turnaround === "standard" ? " active" : ""),
    onClick: () => setTurnaround("standard")
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-title"
  }, "Standard"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-meta"
  }, "1\u20132 working days"), standardReturnDate && /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-eta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-turnaround-eta-label"
  }, "Ready by"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-turnaround-eta-date"
  }, fmtDate(standardReturnDate)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-turnaround-card" + (turnaround === "fast" ? " active" : ""),
    onClick: () => setTurnaround("fast")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-turnaround-badge"
  }, "Faster"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-turnaround-price-corner"
  }, "+\xA3", FAST_TURNAROUND_FEE), /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-title"
  }, "Fast"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-meta"
  }, "Same or next working day"), fastReturnDate && /*#__PURE__*/React.createElement("div", {
    className: "wiz-turnaround-eta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-turnaround-eta-label"
  }, "Ready by"), /*#__PURE__*/React.createElement("span", {
    className: "wiz-turnaround-eta-date"
  }, fmtDate(fastReturnDate)))))), !requiresDiagnosis && price && postcodeKnown && returnDate && (delivery === "walkin" && walkInDate || delivery === "courier" && londonOk && courierDate || delivery === "mail") ? /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline",
    role: "list",
    "aria-label": "Repair timeline"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-section-label"
  }, "Your repair timeline"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-promise"
  }, "Booking reserves your part and the workshop slot \u2014 these dates become a guarantee.")), /*#__PURE__*/React.createElement("ol", {
    className: "wiz-timeline-steps"
  }, buildTimeline({
    delivery,
    walkInDate,
    walkInTime,
    courierDate,
    courierWindow,
    arrivalDate,
    today,
    returnDate,
    turnaround
  }).map((step, i, arr) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "wiz-timeline-step" + (step.final ? " wiz-timeline-step-final" : ""),
    role: "listitem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-marker",
    "aria-hidden": "true"
  }, step.final ? "✓" : i + 1), /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-label"
  }, step.label), /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-date"
  }, step.date), step.note && /*#__PURE__*/React.createElement("div", {
    className: "wiz-timeline-note"
  }, step.note)))))) : null, /*#__PURE__*/React.createElement("button", {
    type: canSubmit ? "submit" : "button",
    onClick: canSubmit ? undefined : handleDisabledTap,
    disabled: false,
    className: "btn btn-lg " + (canSubmit ? "btn-dark" : "btn-prompt"),
    style: {
      width: "100%",
      marginTop: 8
    }
  }, ctaLabel), /*#__PURE__*/React.createElement("p", {
    className: "wiz-fineprint"
  }, "You'll add your details and pay securely on the next step.")), /*#__PURE__*/React.createElement("div", {
    className: "wiz-secondary-actions"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-secondary-btn" + (secondary === "email" ? " active" : ""),
    onClick: () => setSecondary(secondary === "email" ? null : "email")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-secondary-btn-icon",
    "aria-hidden": "true"
  }, "\u2709"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-secondary-btn-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Email me this quote"), /*#__PURE__*/React.createElement("span", null, "For insurance claims or to share"))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-secondary-btn" + (secondary === "chat" ? " active" : ""),
    onClick: () => setSecondary(secondary === "chat" ? null : "chat")
  }, /*#__PURE__*/React.createElement("span", {
    className: "wiz-secondary-btn-icon",
    "aria-hidden": "true"
  }, "\uD83D\uDCAC"), /*#__PURE__*/React.createElement("div", {
    className: "wiz-secondary-btn-text"
  }, /*#__PURE__*/React.createElement("strong", null, "Ask a question"), /*#__PURE__*/React.createElement("span", null, "Talk to a technician, not a chatbot")))), secondary === "email" && /*#__PURE__*/React.createElement("form", {
    className: "wiz-contact wiz-secondary-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub",
    style: {
      marginTop: 0,
      marginBottom: 12
    }
  }, "Need a formatted quote for your insurer? We'll send a PDF with your device, issue, and price \u2014 typically accepted by UK home & business policies."), /*#__PURE__*/React.createElement("input", {
    required: true,
    placeholder: "Full name",
    value: contact.name,
    onChange: e => setContact({
      ...contact,
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "email",
    placeholder: "Email",
    value: contact.email,
    onChange: e => setContact({
      ...contact,
      email: e.target.value
    })
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-dark",
    style: {
      width: "100%",
      marginTop: 4
    }
  }, "Send quote to my inbox")), secondary === "chat" && /*#__PURE__*/React.createElement("form", {
    className: "wiz-contact wiz-secondary-form",
    onSubmit: submit
  }, /*#__PURE__*/React.createElement("p", {
    className: "wiz-step-sub",
    style: {
      marginTop: 0,
      marginBottom: 12
    }
  }, "Not ready to book? A technician (not a chatbot) will reply within 2 working hours."), /*#__PURE__*/React.createElement("input", {
    required: true,
    placeholder: "Full name",
    value: contact.name,
    onChange: e => setContact({
      ...contact,
      name: e.target.value
    })
  }), /*#__PURE__*/React.createElement("input", {
    required: true,
    type: "email",
    placeholder: "Email",
    value: contact.email,
    onChange: e => setContact({
      ...contact,
      email: e.target.value
    })
  }), /*#__PURE__*/React.createElement("textarea", {
    className: "wiz-textarea",
    placeholder: "What would you like to know? (optional)",
    rows: 3
  }), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    className: "btn btn-dark",
    style: {
      width: "100%",
      marginTop: 4
    }
  }, "Start conversation")));
}
function DeliveryCard({
  id,
  active,
  onSelect,
  title,
  subtitle,
  price,
  badge,
  footer
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "wiz-delivery-card" + (active ? " active" : ""),
    onClick: onSelect
  }, badge && /*#__PURE__*/React.createElement("span", {
    className: "wiz-delivery-badge"
  }, badge), /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-radio",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-sub"
  }, subtitle), footer), /*#__PURE__*/React.createElement("div", {
    className: "wiz-delivery-price"
  }, price));
}

// ── Floating sticky mini-wizard ────────────────────────────────────────────
function FloatingWizard() {
  const w = useWizardState();
  const [visible, setVisible] = React.useState(false);
  const [expanded, setExpanded] = React.useState(false);
  React.useEffect(() => {
    const onScroll = () => {
      const wiz = document.getElementById("wizard-root");
      if (!wiz) {
        setVisible(false);
        return;
      }
      const rect = wiz.getBoundingClientRect();
      // Show once the user has fully scrolled past the bottom of the wizard
      // (with a small buffer so it doesn't flicker while scrolling near the edge)
      setVisible(rect.bottom < -120);
    };
    window.addEventListener("scroll", onScroll, {
      passive: true
    });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const requiresDiagnosis = w.issue?.diagnosis || w.model?.price == null;
  const price = requiresDiagnosis ? null : w.model?.price;
  const scrollToMain = () => {
    const wiz = document.getElementById("wizard-root");
    if (wiz) window.scrollTo({
      top: wiz.offsetTop - 80,
      behavior: "smooth"
    });
  };
  if (!visible) return null;

  // Two surfaces: compact bar (always) + expanded panel (toggled)
  return /*#__PURE__*/React.createElement(React.Fragment, null, expanded && /*#__PURE__*/React.createElement("div", {
    className: "fwiz-backdrop",
    onClick: () => setExpanded(false)
  }), /*#__PURE__*/React.createElement("div", {
    className: "fwiz" + (expanded ? " expanded" : "")
  }, expanded ? /*#__PURE__*/React.createElement(FloatingExpanded, {
    w: w,
    price: price,
    requiresDiagnosis: requiresDiagnosis,
    onClose: () => setExpanded(false),
    onJumpToFull: scrollToMain
  }) : /*#__PURE__*/React.createElement(FloatingBar, {
    w: w,
    price: price,
    requiresDiagnosis: requiresDiagnosis,
    onExpand: () => setExpanded(true),
    onJumpToFull: scrollToMain
  })));
}
function FloatingBar({
  w,
  price,
  requiresDiagnosis,
  onExpand,
  onJumpToFull
}) {
  const hasModel = !!w.model;
  const hasIssue = !!w.issue;
  const hasBoth = hasModel && hasIssue;

  // Real, action-led CTA based on state
  let ctaText, ctaAction;
  if (w.state.step === 3) {
    ctaText = requiresDiagnosis ? "Book free pre-diagnosis" : `Book repair · £${price}`;
    ctaAction = onJumpToFull;
  } else if (hasBoth) {
    ctaText = "Get my quote";
    ctaAction = onJumpToFull;
  } else if (hasModel) {
    ctaText = "Pick your issue";
    ctaAction = onExpand;
  } else if (hasIssue) {
    ctaText = "Pick your model";
    ctaAction = onExpand;
  } else {
    ctaText = "Start your quote";
    ctaAction = onExpand;
  }

  // Click a chip → scroll to main wizard and jump to that step
  const chipJump = step => {
    w.setStep(step);
    onJumpToFull();
  };

  // Turnaround copy — replaces the old price chip
  const turnaround = requiresDiagnosis ? "Pre-diagnosis first" : hasIssue ? "1–2 days" : "1–2 days typical";
  return /*#__PURE__*/React.createElement("div", {
    className: "fwiz-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fwiz-bar-main"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fwiz-bar-chips"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fwiz-chip fwiz-chip-btn" + (hasModel ? " filled" : ""),
    onClick: () => chipJump(1),
    "aria-label": hasModel ? `Change model (currently ${w.model.name})` : "Pick model"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-label"
  }, "Model"), /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-value"
  }, w.model?.name || "Not set"), hasModel && /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-edit",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1.5l3.5 3.5L4 11.5H.5V8L7 1.5z"
  })))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "fwiz-chip fwiz-chip-btn" + (hasIssue ? " filled" : ""),
    onClick: () => chipJump(2),
    "aria-label": hasIssue ? `Change issue (currently ${w.issue.label})` : "Pick issue"
  }, /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-label"
  }, "Issue"), /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-value"
  }, w.issue?.label || "Not set"), hasIssue && /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-edit",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "12",
    viewBox: "0 0 12 12",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.4",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1.5l3.5 3.5L4 11.5H.5V8L7 1.5z"
  })))), /*#__PURE__*/React.createElement("div", {
    className: "fwiz-chip fwiz-chip-turnaround filled",
    "aria-label": `Turnaround: ${turnaround}`
  }, /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-label"
  }, "Turnaround"), /*#__PURE__*/React.createElement("span", {
    className: "fwiz-chip-value"
  }, turnaround))), /*#__PURE__*/React.createElement("div", {
    className: "fwiz-bar-actions"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fwiz-btn fwiz-btn-primary fwiz-btn-cta",
    onClick: ctaAction
  }, ctaText, /*#__PURE__*/React.createElement("span", {
    className: "fwiz-btn-arrow",
    "aria-hidden": "true"
  }, "\u2192")))));
}
function FloatingExpanded({
  w,
  price,
  requiresDiagnosis,
  onClose,
  onJumpToFull
}) {
  const [isMobile, setIsMobile] = React.useState(() => window.matchMedia("(max-width: 640px)").matches);
  React.useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const h = () => setIsMobile(mq.matches);
    mq.addEventListener("change", h);
    return () => mq.removeEventListener("change", h);
  }, []);
  return /*#__PURE__*/React.createElement("div", {
    className: "fwiz-panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "fwiz-panel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "mono-label",
    style: {
      color: "#666"
    }
  }, "Quick repair picker"), /*#__PURE__*/React.createElement("div", {
    className: "fwiz-panel-title"
  }, w.state.step === 3 ? "Review your quote" : w.state.step === 2 ? "What's happening?" : "Which MacBook?")), /*#__PURE__*/React.createElement("button", {
    className: "fwiz-close",
    onClick: onClose,
    "aria-label": "Close"
  })), /*#__PURE__*/React.createElement("div", {
    className: "fwiz-panel-body"
  }, w.state.step === 1 && /*#__PURE__*/React.createElement(StepModel, {
    family: w.state.family,
    selected: w.model,
    onSelectFamily: w.setFamily,
    onSelect: w.setModel
  }), w.state.step === 2 && /*#__PURE__*/React.createElement(StepIssue, {
    issues: ISSUES,
    selected: w.issue,
    onSelect: w.setIssue,
    onBack: () => w.setStep(1)
  }), w.state.step === 3 && /*#__PURE__*/React.createElement(StepQuote, {
    model: w.model,
    issue: w.issue,
    price: price,
    requiresDiagnosis: requiresDiagnosis,
    contact: w.state.contact,
    setContact: w.setContact,
    delivery: w.state.delivery,
    setDelivery: w.setDelivery,
    address: w.state.address,
    setAddress: w.setAddress,
    onBack: () => w.setStep(2),
    onReset: w.reset
  })), /*#__PURE__*/React.createElement("div", {
    className: "fwiz-panel-foot"
  }, /*#__PURE__*/React.createElement("button", {
    className: "fwiz-btn fwiz-btn-ghost",
    onClick: onJumpToFull
  }, "Open full wizard \u2191")));
}
Object.assign(window, {
  Wizard,
  FloatingWizard,
  useWizardState,
  MAC_MODELS,
  MAC_FAMILIES,
  ISSUES,
  // Exported for UniversalWizard reuse:
  StepQuote,
  StepIssue,
  StepModel,
  WizProgress,
  DeliveryCard,
  ModelHelpCard,
  FamilyGlyph,
  isWorkingDay,
  addWorkingDays,
  nextWorkingDay,
  fmtDate,
  fmtDateRange,
  upcomingWalkInDates,
  buildTimeline,
  classifyPostcode,
  isLondonPostcode,
  COURIER_FEE,
  NEXT_DAY_COURIER_FEE,
  FAST_TURNAROUND_FEE,
  COURIER_WINDOWS,
  WALK_IN_TIMES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/Wizard.jsx", error: String((e && e.message) || e) }); }

// icorrect/diagnose-data.jsx
try { (() => {
// === Diagnose flow data ===
// Ported (compact) from icorrect-shopify-theme/icorrect-quote-wizard-final.html
// Source of truth lives there; this is a prototype mirror.

// --- Devices (Step 1) ---
const DIAG_DEVICES = [{
  id: "iphone",
  name: "iPhone",
  detail: "iPhone 11 onwards"
}, {
  id: "macbook",
  name: "MacBook",
  detail: "Pro · Air · 2018+"
}, {
  id: "ipad",
  name: "iPad",
  detail: "iPad · Air · Pro · Mini"
}, {
  id: "watch",
  name: "Watch",
  detail: "Series 5+ · SE · Ultra"
}];

// --- Models (Step 2) — abbreviated for prototype, full list lives in production ---
const DIAG_MODELS = {
  macbook: [{
    g: 'MacBook Pro 16"',
    m: [{
      n: "MacBook Pro 16\" M4 Pro/Max",
      y: "2024"
    }, {
      n: "MacBook Pro 16\" M3 Pro/Max",
      y: "2023"
    }, {
      n: "MacBook Pro 16\" M1 Pro/Max",
      y: "2021"
    }, {
      n: "MacBook Pro 16\" Intel",
      y: "2019"
    }]
  }, {
    g: 'MacBook Pro 14"',
    m: [{
      n: "MacBook Pro 14\" M4 Pro/Max",
      y: "2024"
    }, {
      n: "MacBook Pro 14\" M3 Pro/Max",
      y: "2023"
    }, {
      n: "MacBook Pro 14\" M1 Pro/Max",
      y: "2021"
    }]
  }, {
    g: 'MacBook Pro 13"',
    m: [{
      n: "MacBook Pro 13\" M2",
      y: "2022"
    }, {
      n: "MacBook Pro 13\" M1",
      y: "2020"
    }, {
      n: "MacBook Pro 13\" Intel Touch Bar",
      y: "2016–20"
    }]
  }, {
    g: 'MacBook Air 15"',
    m: [{
      n: "MacBook Air 15\" M3",
      y: "2024"
    }, {
      n: "MacBook Air 15\" M2",
      y: "2023"
    }]
  }, {
    g: 'MacBook Air 13"',
    m: [{
      n: "MacBook Air 13\" M3",
      y: "2024"
    }, {
      n: "MacBook Air 13\" M2",
      y: "2022"
    }, {
      n: "MacBook Air 13\" M1",
      y: "2020"
    }, {
      n: "MacBook Air 13\" Intel Retina",
      y: "2018–20"
    }]
  }],
  iphone: [{
    g: "iPhone 16 series",
    m: [{
      n: "iPhone 16 Pro Max",
      y: "2024"
    }, {
      n: "iPhone 16 Pro",
      y: "2024"
    }, {
      n: "iPhone 16 Plus",
      y: "2024"
    }, {
      n: "iPhone 16",
      y: "2024"
    }]
  }, {
    g: "iPhone 15 series",
    m: [{
      n: "iPhone 15 Pro Max",
      y: "2023"
    }, {
      n: "iPhone 15 Pro",
      y: "2023"
    }, {
      n: "iPhone 15 Plus",
      y: "2023"
    }, {
      n: "iPhone 15",
      y: "2023"
    }]
  }, {
    g: "iPhone 14 series",
    m: [{
      n: "iPhone 14 Pro Max",
      y: "2022"
    }, {
      n: "iPhone 14 Pro",
      y: "2022"
    }, {
      n: "iPhone 14",
      y: "2022"
    }]
  }, {
    g: "Older iPhones",
    m: [{
      n: "iPhone 13 Pro Max",
      y: "2021"
    }, {
      n: "iPhone 13 / Mini",
      y: "2021"
    }, {
      n: "iPhone 12 series",
      y: "2020"
    }, {
      n: "iPhone 11 series",
      y: "2019"
    }, {
      n: "iPhone SE 2/3",
      y: "2020/22"
    }]
  }],
  ipad: [{
    g: "iPad Pro",
    m: [{
      n: "iPad Pro 13\" M4",
      y: "2024"
    }, {
      n: "iPad Pro 11\" M4",
      y: "2024"
    }, {
      n: "iPad Pro 12.9\" M2",
      y: "2022"
    }]
  }, {
    g: "iPad Air",
    m: [{
      n: "iPad Air M3 (13\" / 11\")",
      y: "2025"
    }, {
      n: "iPad Air M2 (13\" / 11\")",
      y: "2024"
    }, {
      n: "iPad Air 5",
      y: "2022"
    }]
  }, {
    g: "iPad / Mini",
    m: [{
      n: "iPad 11",
      y: "2025"
    }, {
      n: "iPad 10",
      y: "2022"
    }, {
      n: "iPad Mini 7",
      y: "2024"
    }, {
      n: "iPad Mini 6",
      y: "2021"
    }]
  }],
  watch: [{
    g: "Apple Watch Ultra",
    m: [{
      n: "Ultra 2",
      y: "2023"
    }, {
      n: "Ultra",
      y: "2022"
    }]
  }, {
    g: "Apple Watch Series",
    m: [{
      n: "Series 10",
      y: "2024"
    }, {
      n: "Series 9",
      y: "2023"
    }, {
      n: "Series 8",
      y: "2022"
    }, {
      n: "Series 7",
      y: "2021"
    }, {
      n: "Series 6",
      y: "2020"
    }, {
      n: "Series 5",
      y: "2019"
    }]
  }, {
    g: "Apple Watch SE",
    m: [{
      n: "SE 2nd gen",
      y: "2022"
    }, {
      n: "SE 1st gen",
      y: "2020"
    }]
  }]
};

// --- Fault categories (Step 3) ---
const DIAG_FAULTS = {
  iphone: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "back",
    label: "Rear Glass",
    icon: "glass"
  }, {
    id: "camera",
    label: "Camera",
    icon: "camera"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "audio",
    label: "Audio / Mic / Speaker",
    icon: "audio"
  }, {
    id: "network",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "data",
    label: "Data Recovery",
    icon: "data"
  }, {
    id: "other",
    label: "Something else",
    icon: "other"
  }],
  macbook: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "input",
    label: "Trackpad / Keyboard",
    icon: "keyboard"
  }, {
    id: "audio",
    label: "Audio / Mic / Speaker",
    icon: "audio"
  }, {
    id: "network",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "data",
    label: "Data Recovery",
    icon: "data"
  }, {
    id: "other",
    label: "Something else",
    icon: "other"
  }],
  ipad: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "audio",
    label: "Audio / Mic / Speaker",
    icon: "audio"
  }, {
    id: "network",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "data",
    label: "Data Recovery",
    icon: "data"
  }, {
    id: "other",
    label: "Something else",
    icon: "other"
  }],
  watch: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "back",
    label: "Rear Glass",
    icon: "glass"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "network",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "other",
    label: "Something else",
    icon: "other"
  }]
};

// --- Fault icons (compact SVG strings) ---
const DIAG_ICONS = {
  screen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/></svg>',
  glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="5" y="2" width="14" height="20" rx="2"/><circle cx="12" cy="6" r="1.5"/><path d="M10 18h4"/></svg>',
  camera: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/></svg>',
  battery: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  keyboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M6 8h.01M10 8h.01M14 8h.01M18 8h.01M8 16h8"/></svg>',
  audio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"/></svg>',
  wifi: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M5 12.55a11 11 0 0114.08 0M1.42 9a16 16 0 0121.16 0M8.53 16.11a6 6 0 016.95 0M12 20h.01"/></svg>',
  water: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M12 2.69l5.66 5.66a8 8 0 11-11.31 0z"/></svg>',
  data: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',
  other: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v.01M12 8a2 2 0 012 2c0 1-2 2-2 3"/></svg>',
  // device icons
  iphone: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="1" width="12" height="22" rx="2.5"/><path d="M10 19h4"/></svg>',
  macbook: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 17h20M8 21h8M12 17v4"/></svg>',
  ipad: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M10 18h4"/></svg>',
  watch: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="6"/><path d="M9 1h6M9 23h6"/></svg>'
};
function DiagIcon({
  name,
  className
}) {
  const html = DIAG_ICONS[name] || DIAG_ICONS.other;
  return /*#__PURE__*/React.createElement("span", {
    className: "d-icon " + (className || ""),
    dangerouslySetInnerHTML: {
      __html: html
    }
  });
}
Object.assign(window, {
  DIAG_DEVICES,
  DIAG_MODELS,
  DIAG_FAULTS,
  DIAG_ICONS,
  DiagIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/diagnose-data.jsx", error: String((e && e.message) || e) }); }

// icorrect/diagnose-trees.jsx
try { (() => {
// === Diagnostic decision trees ===
//
// SHAPE: a tree of "investigations". Each investigation either asks ONE
// question with a few answer options, or it's a terminal "diagnosis" node.
//
//   InvestigationNode = {
//     id: "mbp-screen-flicker",
//     question: "When the lines appear, do they...",
//     hint?: "Tip: try gently flexing the lid back and forth.",
//     answers: [
//       { label: "Change when I flex the lid", next: "...", evidence: "Lines flex with lid → likely cable" },
//       ...
//     ],
//   }
//
//   DiagnosisNode = {
//     id: "...",
//     terminal: true,
//     confidence: "high" | "medium" | "low",
//     title: "Flexgate — display flex cable wear",
//     summary: "...",
//     repair: { name: "Display flex / cable repair", priceFrom: 280, days: "2–4 days", productHandle?: "..." },
//     // OR for "we need to see it" cases:
//     prediagnosis: true,
//     reading?: { title: "Why MacBooks get Flexgate", url: "#" },
//   }
//
// Each fault category has an entry tree. Only `mbp-screen` is fully worked
// for the prototype — everything else stubs to a 1-question pre-diagnosis path.
// Claude Code will fill the rest using TS data from the live wizard.

const DIAG_TREES = {
  /* ============================================================
     MacBook · Screen — fully worked example
     ============================================================ */
  "macbook:screen": {
    root: "mbp-screen-symptom",
    nodes: {
      "mbp-screen-symptom": {
        question: "What does the screen actually look like?",
        hint: "Pick the closest match — we'll narrow it down with a couple of follow-ups.",
        answers: [{
          label: "Cracked or shattered glass",
          detail: "Visible damage on the surface",
          next: "mbp-cracked",
          evidence: "Physical damage visible"
        }, {
          label: "Lines, bars, or artifacts",
          detail: "Vertical / horizontal lines, glitchy areas",
          next: "mbp-lines",
          evidence: "Lines or artifacts on screen"
        }, {
          label: "Black / dark with backlight on",
          detail: "You can see the Apple logo faintly with a torch",
          next: "mbp-backlight",
          evidence: "Backlight on, image dark"
        }, {
          label: "Completely dead — nothing at all",
          detail: "No image, no flicker, fan may still spin",
          next: "mbp-dead",
          evidence: "No display output at all"
        }, {
          label: "Flickering or random colours",
          detail: "Image present but unstable",
          next: "mbp-flicker",
          evidence: "Display flickers / colour-shifts"
        }]
      },
      // === Cracked branch ===
      "mbp-cracked": {
        question: "Does the touch / display still respond when it's not cracked?",
        hint: "If the cursor still moves and you can read the un-cracked area, the panel itself is probably fine.",
        answers: [{
          label: "Yes, the rest of the screen works fine",
          next: "mbp-cracked-glass-only",
          evidence: "Display still functional outside cracks"
        }, {
          label: "No, parts of it are dead",
          next: "mbp-cracked-panel",
          evidence: "Damage extends beyond glass"
        }, {
          label: "Not sure",
          next: "mbp-cracked-unsure",
          evidence: "Unsure if panel damaged"
        }]
      },
      "mbp-cracked-glass-only": {
        terminal: true,
        confidence: "high",
        title: "Display assembly replacement",
        summary: "MacBook displays are sealed assemblies — the glass isn't separable from the panel like a phone screen. Even cosmetic cracks mean a full display swap. Good news: it's a fixed-price repair, not a logic-board diagnosis.",
        repair: {
          name: "Display assembly",
          priceFrom: 339,
          days: "2–4 days"
        },
        reading: {
          title: "Why MacBook glass isn't sold separately",
          url: "#"
        }
      },
      "mbp-cracked-panel": {
        terminal: true,
        confidence: "high",
        title: "Display assembly replacement",
        summary: "Crack damage that extends into the panel (dead pixels, dark patches, ink-blot spread) means the LCD/OLED itself is compromised. Same fix — full display assembly — but the urgency is higher; ink spread can keep getting worse.",
        repair: {
          name: "Display assembly",
          priceFrom: 339,
          days: "2–4 days"
        }
      },
      "mbp-cracked-unsure": {
        terminal: true,
        confidence: "medium",
        prediagnosis: true,
        title: "Likely display assembly — book a free pre-diagnosis",
        summary: "Cracked screens are nearly always a display swap, but if the cursor / touch behaviour seems off too, we'd want to rule out a flex cable or trackpad signal issue before quoting. Free 15-minute pre-diagnosis at the workshop."
      },
      // === Lines / bars branch ===
      "mbp-lines": {
        question: "Do the lines move or change when you flex the lid?",
        hint: "Gently open and close the lid 10°. If lines come and go with the angle, it's almost certainly the flex cable, not the panel.",
        answers: [{
          label: "Yes — the lines change with lid angle",
          next: "mbp-flexgate",
          evidence: "Lines respond to lid flex"
        }, {
          label: "No — they're stable regardless",
          next: "mbp-lines-stable",
          evidence: "Lines stable, lid-independent"
        }, {
          label: "Lines disappear entirely sometimes",
          next: "mbp-flexgate",
          evidence: "Intermittent — flex cable signature"
        }]
      },
      "mbp-flexgate": {
        question: "Roughly which year is your MacBook?",
        hint: "Flexgate is most common on the 2016–2017 MacBook Pro 13\" / 15\" Touch Bar models.",
        answers: [{
          label: "2016–2018 MacBook Pro",
          next: "mbp-flexgate-confirmed",
          evidence: "Year matches Flexgate window"
        }, {
          label: "2019 onwards",
          next: "mbp-flexgate-newer",
          evidence: "Outside main Flexgate window"
        }, {
          label: "Not sure — older though",
          next: "mbp-flexgate-confirmed",
          evidence: "Likely older model, Flexgate plausible"
        }]
      },
      "mbp-flexgate-confirmed": {
        terminal: true,
        confidence: "high",
        title: "Flexgate — display flex cable wear",
        summary: "Apple's display flex cables on this generation were too short, so opening and closing the lid a few thousand times stresses them until they fail. Two fixes: (1) replace the flex cable alone — board-level repair, what we recommend; (2) full display assembly — Apple's only option and 3× the price.",
        repair: {
          name: "Flex cable repair (microsoldering)",
          priceFrom: 280,
          days: "3–4 days"
        },
        reading: {
          title: "Flexgate explained — and why we don't swap the whole screen",
          url: "#"
        }
      },
      "mbp-flexgate-newer": {
        terminal: true,
        confidence: "medium",
        prediagnosis: true,
        title: "Flex-cable behaviour on a newer MBP — let's verify",
        summary: "Newer MacBooks use redesigned flex cables, so this is unusual. Could still be flex damage from a knock or wear, but we'd want to scope it before committing to a repair."
      },
      "mbp-lines-stable": {
        question: "Do the lines appear immediately on boot, or only after the screen has been on a while?",
        hint: "This separates a panel fault from a thermal / GPU issue.",
        answers: [{
          label: "Immediately, every boot",
          next: "mbp-panel",
          evidence: "Lines from cold boot"
        }, {
          label: "After it's been on a while",
          next: "mbp-thermal",
          evidence: "Lines appear with warm-up"
        }, {
          label: "Random — sometimes fine",
          next: "mbp-prediag",
          evidence: "Intermittent without flex pattern"
        }]
      },
      "mbp-panel": {
        terminal: true,
        confidence: "high",
        title: "LCD / OLED panel failure",
        summary: "Lines that are stable from cold boot and don't change with lid movement point at the panel itself — usually a row driver or T-CON fault. The display assembly is the fix.",
        repair: {
          name: "Display assembly",
          priceFrom: 339,
          days: "2–4 days"
        }
      },
      "mbp-thermal": {
        terminal: true,
        confidence: "medium",
        title: "GPU or thermal fault — needs in-person diagnosis",
        summary: "Lines that only appear after warm-up are a classic GPU symptom — could be solder fatigue on the GPU package, thermal paste degradation, or a failing voltage rail. We'd need to scope it. Sometimes board-level repair is possible; sometimes the logic board needs replacing.",
        prediagnosis: true,
        reading: {
          title: "GPU artifacts — what we look for",
          url: "#"
        }
      },
      // === Backlight branch ===
      "mbp-backlight": {
        question: "Does an external monitor work when you connect one?",
        hint: "If you can plug in any external display (USB-C / HDMI), that tells us the GPU and main board are still alive.",
        answers: [{
          label: "Yes, external monitor is fine",
          next: "mbp-backlight-ic",
          evidence: "External display works → GPU alive"
        }, {
          label: "No — external monitor is also dark",
          next: "mbp-board",
          evidence: "External also dark → board / GPU"
        }, {
          label: "Haven't tried / no cable",
          next: "mbp-prediag",
          evidence: "External not yet tested"
        }]
      },
      "mbp-backlight-ic": {
        terminal: true,
        confidence: "high",
        title: "Backlight IC failure",
        summary: "Image present + backlight off = the LCD signal is fine but the backlight power circuit isn't. On most MacBooks this is one or two surface-mount ICs on the logic board — a microsoldering job. Apple's only fix is a £1,400+ logic-board swap. Ours is a chip replacement.",
        repair: {
          name: "Backlight IC replacement (microsoldering)",
          priceFrom: 380,
          days: "3–5 days"
        },
        reading: {
          title: "Why Apple swaps the whole board for one IC",
          url: "#"
        }
      },
      "mbp-board": {
        terminal: true,
        confidence: "medium",
        title: "Logic-board level fault — pre-diagnosis",
        summary: "External display also dark suggests the GPU or display controller side, not the panel or backlight. We'd need to scope the board to identify which rail or chip — could be repairable, could need a board.",
        prediagnosis: true
      },
      // === Dead branch ===
      "mbp-dead": {
        question: "When you press the power button, does anything happen?",
        hint: "Listen carefully — fans, the boot chime, keyboard backlight, any sign of life.",
        answers: [{
          label: "Yes — fans / chime / keyboard light",
          next: "mbp-dead-alive",
          evidence: "Boots — display side only"
        }, {
          label: "Nothing at all",
          next: "mbp-dead-power",
          evidence: "Won't power on"
        }, {
          label: "Sometimes one, sometimes the other",
          next: "mbp-prediag",
          evidence: "Intermittent power"
        }]
      },
      "mbp-dead-alive": {
        terminal: true,
        confidence: "medium",
        title: "Display or backlight — likely a board-level repair",
        summary: "If the Mac is alive but the screen is fully dead, we're looking at either a backlight circuit or a display-data signal failure. We'd want to confirm under the scope before quoting. Most fixes here are microsoldering, not a screen swap.",
        prediagnosis: true
      },
      "mbp-dead-power": {
        terminal: true,
        confidence: "medium",
        title: "Won't power on — board-level diagnosis",
        summary: "No fans, no chime, no light = a power rail issue, not a display fault. Could be the battery, a power IC, or a short. We diagnose this for free and quote before any work.",
        prediagnosis: true
      },
      // === Flicker branch ===
      "mbp-flicker": {
        question: "When does the flickering happen?",
        answers: [{
          label: "Only at certain brightness levels",
          next: "mbp-flexgate-confirmed",
          evidence: "Flicker tied to brightness — Flexgate signature"
        }, {
          label: "All the time, randomly",
          next: "mbp-prediag",
          evidence: "Continuous random flicker"
        }, {
          label: "Only when running on battery",
          next: "mbp-prediag",
          evidence: "Flicker tied to power source"
        }]
      },
      "mbp-prediag": {
        terminal: true,
        confidence: "low",
        title: "Needs in-person diagnosis",
        summary: "We've narrowed it to display-side, but the symptoms cross a few possible causes. A 15-minute scope at the workshop will tell us exactly what we're looking at — free, no commitment.",
        prediagnosis: true
      }
    }
  }

  /* ============================================================
     STUBS — every other (device, fault) combo
     1-question intro then a "book pre-diagnosis" outcome.
     Claude Code can replace each stub with a full tree using
     the TS{} data from icorrect-quote-wizard-final.html.
     ============================================================ */
};
function _stubTree(faultLabel, deviceLabel) {
  return {
    root: "stub-q1",
    nodes: {
      "stub-q1": {
        question: `Tell us a bit more about the ${faultLabel.toLowerCase()} on your ${deviceLabel}.`,
        hint: "We'll route you to the right repair or book you in for a free pre-diagnosis.",
        answers: [{
          label: "Started suddenly",
          next: "stub-end-sudden",
          evidence: "Sudden onset"
        }, {
          label: "Got worse over time",
          next: "stub-end-gradual",
          evidence: "Gradual deterioration"
        }, {
          label: "After a drop or knock",
          next: "stub-end-impact",
          evidence: "Recent impact"
        }, {
          label: "After contact with liquid",
          next: "stub-end-liquid",
          evidence: "Liquid exposure"
        }, {
          label: "Not sure",
          next: "stub-end-prediag",
          evidence: "Uncertain origin"
        }]
      },
      "stub-end-sudden": {
        terminal: true,
        confidence: "low",
        prediagnosis: true,
        title: "Sudden-onset fault — pre-diagnosis recommended",
        summary: `Sudden ${faultLabel.toLowerCase()} faults can be a single failed component (often repairable) or a deeper board issue. Quickest path to certainty: a free 15-minute scope at the workshop.`
      },
      "stub-end-gradual": {
        terminal: true,
        confidence: "medium",
        prediagnosis: true,
        title: "Gradual deterioration — likely component wear",
        summary: `${faultLabel} that's been getting worse usually points at a wearing component (battery, flex cable, sensor). We'll confirm under the scope.`
      },
      "stub-end-impact": {
        terminal: true,
        confidence: "medium",
        prediagnosis: true,
        title: "Post-impact fault — needs a look",
        summary: "A drop or knock can damage a single chip, a flex cable, or shift a connector. We open the device, scope it, and tell you what's repairable before we touch anything else."
      },
      "stub-end-liquid": {
        terminal: true,
        confidence: "low",
        prediagnosis: true,
        title: "Liquid damage — ultrasonic clean + diagnosis",
        summary: "Liquid damage doesn't follow rules — corrosion can spread for weeks. We ultrasonic-clean the board, identify failed components, and quote the repair. The pre-diagnosis is free."
      },
      "stub-end-prediag": {
        terminal: true,
        confidence: "low",
        prediagnosis: true,
        title: "Free pre-diagnosis",
        summary: "When the symptoms aren't clear-cut, our diagnosis is. Bring it in or send it to us and we'll tell you exactly what's wrong before quoting a single pound."
      }
    }
  };
}

// Fill in stubs for every (device, fault) we don't have a real tree for.
for (const dev of ["iphone", "macbook", "ipad", "watch"]) {
  const faults = DIAG_FAULTS[dev] || [];
  const devLabel = (DIAG_DEVICES.find(d => d.id === dev) || {}).name || dev;
  for (const f of faults) {
    const key = `${dev}:${f.id}`;
    if (!DIAG_TREES[key]) {
      DIAG_TREES[key] = _stubTree(f.label, devLabel);
    }
  }
}
Object.assign(window, {
  DIAG_TREES
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/diagnose-trees.jsx", error: String((e && e.message) || e) }); }

// icorrect/tweaks-panel.jsx
try { (() => {
// tweaks-panel.jsx
// Reusable Tweaks shell + form-control helpers.
//
// Owns the host protocol (listens for __activate_edit_mode / __deactivate_edit_mode,
// posts __edit_mode_available / __edit_mode_set_keys / __edit_mode_dismissed) so
// individual prototypes don't re-roll it. Ships a consistent set of controls so you
// don't hand-draw <input type="range">, segmented radios, steppers, etc.
//
// Usage (in an HTML file that loads React + Babel):
//
//   const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
//     "primaryColor": "#D97757",
//     "palette": ["#D97757", "#29261b", "#f6f4ef"],
//     "fontSize": 16,
//     "density": "regular",
//     "dark": false
//   }/*EDITMODE-END*/;
//
//   function App() {
//     const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
//     return (
//       <div style={{ fontSize: t.fontSize, color: t.primaryColor }}>
//         Hello
//         <TweaksPanel>
//           <TweakSection label="Typography" />
//           <TweakSlider label="Font size" value={t.fontSize} min={10} max={32} unit="px"
//                        onChange={(v) => setTweak('fontSize', v)} />
//           <TweakRadio  label="Density" value={t.density}
//                        options={['compact', 'regular', 'comfy']}
//                        onChange={(v) => setTweak('density', v)} />
//           <TweakSection label="Theme" />
//           <TweakColor  label="Primary" value={t.primaryColor}
//                        options={['#D97757', '#2A6FDB', '#1F8A5B', '#7A5AE0']}
//                        onChange={(v) => setTweak('primaryColor', v)} />
//           <TweakColor  label="Palette" value={t.palette}
//                        options={[['#D97757', '#29261b', '#f6f4ef'],
//                                  ['#475569', '#0f172a', '#f1f5f9']]}
//                        onChange={(v) => setTweak('palette', v)} />
//           <TweakToggle label="Dark mode" value={t.dark}
//                        onChange={(v) => setTweak('dark', v)} />
//         </TweaksPanel>
//       </div>
//     );
//   }
//
// ─────────────────────────────────────────────────────────────────────────────

const __TWEAKS_STYLE = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-track{background:transparent;margin:2px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-body::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25);
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;
    color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-val{color:rgba(41,38,27,.5);font-variant-numeric:tabular-nums}

  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}

  .twk-field{appearance:none;box-sizing:border-box;width:100%;min-width:0;height:26px;padding:0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;
    background:rgba(255,255,255,.6);color:inherit;font:inherit;outline:none}
  .twk-field:focus{border-color:rgba(0,0,0,.25);background:rgba(255,255,255,.85)}
  select.twk-field{padding-right:22px;
    background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'><path fill='rgba(0,0,0,.5)' d='M0 0h10L5 6z'/></svg>");
    background-repeat:no-repeat;background-position:right 8px center}

  .twk-slider{appearance:none;-webkit-appearance:none;width:100%;height:4px;margin:6px 0;
    border-radius:999px;background:rgba(0,0,0,.12);outline:none}
  .twk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;
    width:14px;height:14px;border-radius:50%;background:#fff;
    border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}
  .twk-slider::-moz-range-thumb{width:14px;height:14px;border-radius:50%;
    background:#fff;border:.5px solid rgba(0,0,0,.12);box-shadow:0 1px 3px rgba(0,0,0,.2);cursor:default}

  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg.dragging .twk-seg-thumb{transition:none}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2;
    overflow-wrap:anywhere}

  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}

  .twk-num{display:flex;align-items:center;box-sizing:border-box;min-width:0;height:26px;padding:0 0 0 8px;
    border:.5px solid rgba(0,0,0,.1);border-radius:7px;background:rgba(255,255,255,.6)}
  .twk-num-lbl{font-weight:500;color:rgba(41,38,27,.6);cursor:ew-resize;
    user-select:none;padding-right:8px}
  .twk-num input{flex:1;min-width:0;height:100%;border:0;background:transparent;
    font:inherit;font-variant-numeric:tabular-nums;text-align:right;padding:0 8px 0 0;
    outline:none;color:inherit;-moz-appearance:textfield}
  .twk-num input::-webkit-inner-spin-button,.twk-num input::-webkit-outer-spin-button{
    -webkit-appearance:none;margin:0}
  .twk-num-unit{padding-right:8px;color:rgba(41,38,27,.45)}

  .twk-btn{appearance:none;height:26px;padding:0 12px;border:0;border-radius:7px;
    background:rgba(0,0,0,.78);color:#fff;font:inherit;font-weight:500;cursor:default}
  .twk-btn:hover{background:rgba(0,0,0,.88)}
  .twk-btn.secondary{background:rgba(0,0,0,.06);color:inherit}
  .twk-btn.secondary:hover{background:rgba(0,0,0,.1)}

  .twk-swatch{appearance:none;-webkit-appearance:none;width:56px;height:22px;
    border:.5px solid rgba(0,0,0,.1);border-radius:6px;padding:0;cursor:default;
    background:transparent;flex-shrink:0}
  .twk-swatch::-webkit-color-swatch-wrapper{padding:0}
  .twk-swatch::-webkit-color-swatch{border:0;border-radius:5.5px}
  .twk-swatch::-moz-color-swatch{border:0;border-radius:5.5px}

  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s cubic-bezier(.3,.7,.4,1),box-shadow .12s}
  .twk-chip:hover{transform:translateY(-1px);
    box-shadow:0 0 0 .5px rgba(0,0,0,.18),0 4px 10px rgba(0,0,0,.12)}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),
    0 2px 6px rgba(0,0,0,.15)}
  .twk-chip>span{position:absolute;top:0;bottom:0;right:0;width:34%;
    display:flex;flex-direction:column;box-shadow:-1px 0 0 rgba(0,0,0,.1)}
  .twk-chip>span>i{flex:1;box-shadow:0 -1px 0 rgba(0,0,0,.1)}
  .twk-chip>span>i:first-child{box-shadow:none}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

// ── useTweaks ───────────────────────────────────────────────────────────────
// Single source of truth for tweak values. setTweak persists via the host
// (__edit_mode_set_keys → host rewrites the EDITMODE block on disk).
function useTweaks(defaults) {
  const [values, setValues] = React.useState(defaults);
  // Accepts either setTweak('key', value) or setTweak({ key: value, ... }) so a
  // useState-style call doesn't write a "[object Object]" key into the persisted
  // JSON block.
  const setTweak = React.useCallback((keyOrEdits, val) => {
    const edits = typeof keyOrEdits === 'object' && keyOrEdits !== null ? keyOrEdits : {
      [keyOrEdits]: val
    };
    setValues(prev => ({
      ...prev,
      ...edits
    }));
    window.parent.postMessage({
      type: '__edit_mode_set_keys',
      edits
    }, '*');
    // Same-window signal so in-page listeners (deck-stage rail thumbnails)
    // can react — the parent message only reaches the host, not peers.
    window.dispatchEvent(new CustomEvent('tweakchange', {
      detail: edits
    }));
  }, []);
  return [values, setTweak];
}

// ── TweaksPanel ─────────────────────────────────────────────────────────────
// Floating shell. Registers the protocol listener BEFORE announcing
// availability — if the announce ran first, the host's activate could land
// before our handler exists and the toolbar toggle would silently no-op.
// The close button posts __edit_mode_dismissed so the host's toolbar toggle
// flips off in lockstep; the host echoes __deactivate_edit_mode back which
// is what actually hides the panel.
function TweaksPanel({
  title = 'Tweaks',
  children
}) {
  const [open, setOpen] = React.useState(false);
  const dragRef = React.useRef(null);
  const offsetRef = React.useRef({
    x: 16,
    y: 16
  });
  const PAD = 16;
  const clampToViewport = React.useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth,
      h = panel.offsetHeight;
    const maxRight = Math.max(PAD, window.innerWidth - w - PAD);
    const maxBottom = Math.max(PAD, window.innerHeight - h - PAD);
    offsetRef.current = {
      x: Math.min(maxRight, Math.max(PAD, offsetRef.current.x)),
      y: Math.min(maxBottom, Math.max(PAD, offsetRef.current.y))
    };
    panel.style.right = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);
  React.useEffect(() => {
    if (!open) return;
    clampToViewport();
    if (typeof ResizeObserver === 'undefined') {
      window.addEventListener('resize', clampToViewport);
      return () => window.removeEventListener('resize', clampToViewport);
    }
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);
  React.useEffect(() => {
    const onMsg = e => {
      const t = e?.data?.type;
      if (t === '__activate_edit_mode') setOpen(true);else if (t === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({
      type: '__edit_mode_available'
    }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  const dismiss = () => {
    setOpen(false);
    window.parent.postMessage({
      type: '__edit_mode_dismissed'
    }, '*');
  };
  const onDragStart = e => {
    const panel = dragRef.current;
    if (!panel) return;
    const r = panel.getBoundingClientRect();
    const sx = e.clientX,
      sy = e.clientY;
    const startRight = window.innerWidth - r.right;
    const startBottom = window.innerHeight - r.bottom;
    const move = ev => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBottom - (ev.clientY - sy)
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup', up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup', up);
  };
  if (!open) return null;
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", null, __TWEAKS_STYLE), /*#__PURE__*/React.createElement("div", {
    ref: dragRef,
    className: "twk-panel",
    "data-omelette-chrome": "",
    style: {
      right: offsetRef.current.x,
      bottom: offsetRef.current.y
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-hd",
    onMouseDown: onDragStart
  }, /*#__PURE__*/React.createElement("b", null, title), /*#__PURE__*/React.createElement("button", {
    className: "twk-x",
    "aria-label": "Close tweaks",
    onMouseDown: e => e.stopPropagation(),
    onClick: dismiss
  }, "\u2715")), /*#__PURE__*/React.createElement("div", {
    className: "twk-body"
  }, children)));
}

// ── Layout helpers ──────────────────────────────────────────────────────────

function TweakSection({
  label,
  children
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "twk-sect"
  }, label), children);
}
function TweakRow({
  label,
  value,
  children,
  inline = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: inline ? 'twk-row twk-row-h' : 'twk-row'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label), value != null && /*#__PURE__*/React.createElement("span", {
    className: "twk-val"
  }, value)), children);
}

// ── Controls ────────────────────────────────────────────────────────────────

function TweakSlider({
  label,
  value,
  min = 0,
  max = 100,
  step = 1,
  unit = '',
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label,
    value: `${value}${unit}`
  }, /*#__PURE__*/React.createElement("input", {
    type: "range",
    className: "twk-slider",
    min: min,
    max: max,
    step: step,
    value: value,
    onChange: e => onChange(Number(e.target.value))
  }));
}
function TweakToggle({
  label,
  value,
  onChange
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-row twk-row-h"
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-lbl"
  }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "twk-toggle",
    "data-on": value ? '1' : '0',
    role: "switch",
    "aria-checked": !!value,
    onClick: () => onChange(!value)
  }, /*#__PURE__*/React.createElement("i", null)));
}
function TweakRadio({
  label,
  value,
  options,
  onChange
}) {
  const trackRef = React.useRef(null);
  const [dragging, setDragging] = React.useState(false);
  // The active value is read by pointer-move handlers attached for the lifetime
  // of a drag — ref it so a stale closure doesn't fire onChange for every move.
  const valueRef = React.useRef(value);
  valueRef.current = value;

  // Segments wrap mid-word once per-segment width runs out. The track is
  // ~248px (280 panel − 28 body pad − 4 seg pad), each button loses 12px
  // to its own padding, and 11.5px system-ui averages ~6.3px/char — so 2
  // options fit ~16 chars each, 3 fit ~10. Past that (or >3 options), fall
  // back to a dropdown rather than wrap.
  const labelLen = o => String(typeof o === 'object' ? o.label : o).length;
  const maxLen = options.reduce((m, o) => Math.max(m, labelLen(o)), 0);
  const fitsAsSegments = maxLen <= ({
    2: 16,
    3: 10
  }[options.length] ?? 0);
  if (!fitsAsSegments) {
    // <select> emits strings — map back to the original option value so the
    // fallback stays type-preserving (numbers, booleans) like the segment path.
    const resolve = s => {
      const m = options.find(o => String(typeof o === 'object' ? o.value : o) === s);
      return m === undefined ? s : typeof m === 'object' ? m.value : m;
    };
    return /*#__PURE__*/React.createElement(TweakSelect, {
      label: label,
      value: value,
      options: options,
      onChange: s => onChange(resolve(s))
    });
  }
  const opts = options.map(o => typeof o === 'object' ? o : {
    value: o,
    label: o
  });
  const idx = Math.max(0, opts.findIndex(o => o.value === value));
  const n = opts.length;
  const segAt = clientX => {
    const r = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i = Math.floor((clientX - r.left - 2) / inner * n);
    return opts[Math.max(0, Math.min(n - 1, i))].value;
  };
  const onPointerDown = e => {
    setDragging(true);
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = ev => {
      if (!trackRef.current) return;
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      setDragging(false);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    ref: trackRef,
    role: "radiogroup",
    onPointerDown: onPointerDown,
    className: dragging ? 'twk-seg dragging' : 'twk-seg'
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-seg-thumb",
    style: {
      left: `calc(2px + ${idx} * (100% - 4px) / ${n})`,
      width: `calc((100% - 4px) / ${n})`
    }
  }), opts.map(o => /*#__PURE__*/React.createElement("button", {
    key: o.value,
    type: "button",
    role: "radio",
    "aria-checked": o.value === value
  }, o.label))));
}
function TweakSelect({
  label,
  value,
  options,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("select", {
    className: "twk-field",
    value: value,
    onChange: e => onChange(e.target.value)
  }, options.map(o => {
    const v = typeof o === 'object' ? o.value : o;
    const l = typeof o === 'object' ? o.label : o;
    return /*#__PURE__*/React.createElement("option", {
      key: v,
      value: v
    }, l);
  })));
}
function TweakText({
  label,
  value,
  placeholder,
  onChange
}) {
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("input", {
    className: "twk-field",
    type: "text",
    value: value,
    placeholder: placeholder,
    onChange: e => onChange(e.target.value)
  }));
}
function TweakNumber({
  label,
  value,
  min,
  max,
  step = 1,
  unit = '',
  onChange
}) {
  const clamp = n => {
    if (min != null && n < min) return min;
    if (max != null && n > max) return max;
    return n;
  };
  const startRef = React.useRef({
    x: 0,
    val: 0
  });
  const onScrubStart = e => {
    e.preventDefault();
    startRef.current = {
      x: e.clientX,
      val: value
    };
    const decimals = (String(step).split('.')[1] || '').length;
    const move = ev => {
      const dx = ev.clientX - startRef.current.x;
      const raw = startRef.current.val + dx * step;
      const snapped = Math.round(raw / step) * step;
      onChange(clamp(Number(snapped.toFixed(decimals))));
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "twk-num"
  }, /*#__PURE__*/React.createElement("span", {
    className: "twk-num-lbl",
    onPointerDown: onScrubStart
  }, label), /*#__PURE__*/React.createElement("input", {
    type: "number",
    value: value,
    min: min,
    max: max,
    step: step,
    onChange: e => onChange(clamp(Number(e.target.value)))
  }), unit && /*#__PURE__*/React.createElement("span", {
    className: "twk-num-unit"
  }, unit));
}

// Relative-luminance contrast pick — checkmarks drawn over a swatch need to
// read on both #111 and #fafafa without per-option configuration. Hex input
// only (#rgb / #rrggbb); named or rgb()/hsl() colors fall through to "light".
function __twkIsLight(hex) {
  const h = String(hex).replace('#', '');
  const x = h.length === 3 ? h.replace(/./g, c => c + c) : h.padEnd(6, '0');
  const n = parseInt(x.slice(0, 6), 16);
  if (Number.isNaN(n)) return true;
  const r = n >> 16 & 255,
    g = n >> 8 & 255,
    b = n & 255;
  return r * 299 + g * 587 + b * 114 > 148000;
}
const __TwkCheck = ({
  light
}) => /*#__PURE__*/React.createElement("svg", {
  viewBox: "0 0 14 14",
  "aria-hidden": "true"
}, /*#__PURE__*/React.createElement("path", {
  d: "M3 7.2 5.8 10 11 4.2",
  fill: "none",
  strokeWidth: "2.2",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  stroke: light ? 'rgba(0,0,0,.78)' : '#fff'
}));

// TweakColor — curated color/palette picker. Each option is either a single
// hex string or an array of 1-5 hex strings; the card adapts — a lone color
// renders solid, a palette renders colors[0] as the hero (left ~2/3) with the
// rest stacked in a sharp column on the right. onChange emits the
// option in the shape it was passed (string stays string, array stays array).
// Without options it falls back to the native color input for back-compat.
function TweakColor({
  label,
  value,
  options,
  onChange
}) {
  if (!options || !options.length) {
    return /*#__PURE__*/React.createElement("div", {
      className: "twk-row twk-row-h"
    }, /*#__PURE__*/React.createElement("div", {
      className: "twk-lbl"
    }, /*#__PURE__*/React.createElement("span", null, label)), /*#__PURE__*/React.createElement("input", {
      type: "color",
      className: "twk-swatch",
      value: value,
      onChange: e => onChange(e.target.value)
    }));
  }
  // Native <input type=color> emits lowercase hex per the HTML spec, so
  // compare case-insensitively. String() guards JSON.stringify(undefined),
  // which returns the primitive undefined (no .toLowerCase).
  const key = o => String(JSON.stringify(o)).toLowerCase();
  const cur = key(value);
  return /*#__PURE__*/React.createElement(TweakRow, {
    label: label
  }, /*#__PURE__*/React.createElement("div", {
    className: "twk-chips",
    role: "radiogroup"
  }, options.map((o, i) => {
    const colors = Array.isArray(o) ? o : [o];
    const [hero, ...rest] = colors;
    const sup = rest.slice(0, 4);
    const on = key(o) === cur;
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "twk-chip",
      role: "radio",
      "aria-checked": on,
      "data-on": on ? '1' : '0',
      "aria-label": colors.join(', '),
      title: colors.join(' · '),
      style: {
        background: hero
      },
      onClick: () => onChange(o)
    }, sup.length > 0 && /*#__PURE__*/React.createElement("span", null, sup.map((c, j) => /*#__PURE__*/React.createElement("i", {
      key: j,
      style: {
        background: c
      }
    }))), on && /*#__PURE__*/React.createElement(__TwkCheck, {
      light: __twkIsLight(hero)
    }));
  })));
}
function TweakButton({
  label,
  onClick,
  secondary = false
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: secondary ? 'twk-btn secondary' : 'twk-btn',
    onClick: onClick
  }, label);
}
Object.assign(window, {
  useTweaks,
  TweaksPanel,
  TweakSection,
  TweakRow,
  TweakSlider,
  TweakToggle,
  TweakRadio,
  TweakSelect,
  TweakText,
  TweakNumber,
  TweakColor,
  TweakButton
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/tweaks-panel.jsx", error: String((e && e.message) || e) }); }

// icorrect/wizard-catalog.jsx
try { (() => {
// Universal wizard data catalog — devices, models, repair types, issues, pricing
// Pricing is per model × repair type. null = requires diagnosis (£49).

const DEVICE_CATALOG = [{
  id: "macbook",
  name: "MacBook",
  detail: "Pro · Air · older models",
  icon: "laptop"
}, {
  id: "iphone",
  name: "iPhone",
  detail: "All recent models",
  icon: "phone"
}, {
  id: "ipad",
  name: "iPad",
  detail: "Pro · Air · mini · standard",
  icon: "tablet"
}, {
  id: "watch",
  name: "Apple Watch",
  detail: "Series · SE · Ultra",
  icon: "watch"
}];

// ── Repair types per device ───────────────────────────────────────────────
const REPAIR_TYPES_CATALOG = {
  macbook: [{
    id: "screen",
    label: "Screen repair",
    detail: "Cracked, dead, flickering, Stage Light",
    icon: "screen"
  }, {
    id: "battery",
    label: "Battery replacement",
    detail: "Degraded, swollen, draining fast",
    icon: "battery"
  }, {
    id: "liquid",
    label: "Liquid damage",
    detail: "Spills, submersion, corrosion",
    icon: "liquid"
  }, {
    id: "power",
    label: "Power diagnostics",
    detail: "Won't turn on, won't charge, shutdowns",
    icon: "power"
  }, {
    id: "keyboard",
    label: "Keyboard repair",
    detail: "Dead keys, sticky, butterfly issues",
    icon: "keyboard"
  }, {
    id: "trackpad",
    label: "Trackpad repair",
    detail: "Phantom clicks, unresponsive",
    icon: "trackpad"
  }, {
    id: "port",
    label: "Charging port",
    detail: "USB-C fault, intermittent charging",
    icon: "port"
  }],
  iphone: [{
    id: "screen",
    label: "Screen repair",
    detail: "Cracked, dead, touch issues, OLED burn",
    icon: "screen"
  }, {
    id: "battery",
    label: "Battery replacement",
    detail: "Degraded, draining, swollen",
    icon: "battery"
  }, {
    id: "glass",
    label: "Rear glass",
    detail: "Cracked back panel",
    icon: "glass"
  }, {
    id: "camera",
    label: "Camera repair",
    detail: "Blurry, shaking, black camera",
    icon: "camera"
  }, {
    id: "port",
    label: "Charging port",
    detail: "Won't charge, loose connector",
    icon: "port"
  }, {
    id: "liquid",
    label: "Water damage",
    detail: "Submersion or liquid ingress",
    icon: "liquid"
  }],
  ipad: [{
    id: "screen",
    label: "Screen repair",
    detail: "Cracked glass, dead display, touch issues",
    icon: "screen"
  }, {
    id: "battery",
    label: "Battery replacement",
    detail: "Degraded, won't hold charge",
    icon: "battery"
  }, {
    id: "port",
    label: "Charging port",
    detail: "Won't charge, intermittent",
    icon: "port"
  }, {
    id: "liquid",
    label: "Water damage",
    detail: "Liquid ingress, corrosion",
    icon: "liquid"
  }],
  watch: [{
    id: "screen",
    label: "Screen repair",
    detail: "Cracked or shattered display",
    icon: "screen"
  }, {
    id: "battery",
    label: "Battery replacement",
    detail: "Won't last a day, swollen",
    icon: "battery"
  }, {
    id: "seal",
    label: "Water seal",
    detail: "Water resistance restoration",
    icon: "liquid"
  }]
};

// ── Model families per device ─────────────────────────────────────────────
const FAMILY_CATALOG = {
  macbook: [{
    id: "pro",
    name: "MacBook Pro",
    detail: '13" · 14" · 16"'
  }, {
    id: "air",
    name: "MacBook Air",
    detail: '13" · 15"'
  }, {
    id: "old",
    name: "Older / Unsure",
    detail: "Pre-2018 or not listed"
  }],
  iphone: [{
    id: "16",
    name: "iPhone 16 series",
    detail: "16 · 16 Pro · 16 Pro Max"
  }, {
    id: "15",
    name: "iPhone 15 series",
    detail: "15 · 15 Pro · 15 Pro Max"
  }, {
    id: "14",
    name: "iPhone 14 series",
    detail: "14 · 14 Pro · 14 Pro Max"
  }, {
    id: "old",
    name: "iPhone 13 & older",
    detail: "13 · 12 · SE · older"
  }],
  ipad: [{
    id: "pro",
    name: "iPad Pro",
    detail: '11" · 13"'
  }, {
    id: "air",
    name: "iPad Air",
    detail: '11" · 13"'
  }, {
    id: "std",
    name: "iPad / mini",
    detail: "Standard · mini"
  }],
  watch: [{
    id: "ultra",
    name: "Apple Watch Ultra",
    detail: "Ultra · Ultra 2"
  }, {
    id: "main",
    name: "Apple Watch",
    detail: "Series 7–10"
  }, {
    id: "se",
    name: "Apple Watch SE",
    detail: "SE 1st & 2nd gen"
  }]
};

// ── Models per device ─────────────────────────────────────────────────────
// Each model has a pricing object: repairType → price (null = diagnosis required)
const MODEL_CATALOG = {
  macbook: [{
    id: "mbp-14-m3",
    family: "pro",
    size: 14,
    chip: "M3",
    chipDetail: "M3 / M3 Pro / M3 Max",
    name: 'MacBook Pro 14"',
    detail: "M3 / M3 Pro / M3 Max · 2023–24",
    prices: {
      screen: 449,
      battery: 229,
      liquid: 349,
      power: null,
      keyboard: 249,
      trackpad: 179,
      port: 149
    }
  }, {
    id: "mbp-16-m3",
    family: "pro",
    size: 16,
    chip: "M3",
    chipDetail: "M3 Pro / M3 Max",
    name: 'MacBook Pro 16"',
    detail: "M3 Pro / M3 Max · 2023–24",
    prices: {
      screen: 599,
      battery: 249,
      liquid: 399,
      power: null,
      keyboard: 279,
      trackpad: 199,
      port: 149
    }
  }, {
    id: "mbp-14-m2",
    family: "pro",
    size: 14,
    chip: "M1/M2",
    chipDetail: "M1 Pro / M1 Max / M2 Pro",
    name: 'MacBook Pro 14"',
    detail: "M1 Pro / M1 Max / M2 · 2021–23",
    prices: {
      screen: 419,
      battery: 219,
      liquid: 329,
      power: null,
      keyboard: 239,
      trackpad: 169,
      port: 139
    }
  }, {
    id: "mbp-16-m2",
    family: "pro",
    size: 16,
    chip: "M1/M2",
    chipDetail: "M1 Pro / M1 Max / M2 Max",
    name: 'MacBook Pro 16"',
    detail: "M1 Pro / M1 Max / M2 · 2021–23",
    prices: {
      screen: 549,
      battery: 239,
      liquid: 379,
      power: null,
      keyboard: 269,
      trackpad: 189,
      port: 139
    }
  }, {
    id: "mbp-13",
    family: "pro",
    size: 13,
    chip: "M1/M2",
    chipDetail: "M1 / M2 / Intel Touch Bar",
    name: 'MacBook Pro 13"',
    detail: "Touch Bar · 2016–22",
    prices: {
      screen: 389,
      battery: 199,
      liquid: 299,
      power: null,
      keyboard: 219,
      trackpad: 159,
      port: 129
    }
  }, {
    id: "mba-15",
    family: "air",
    size: 15,
    chip: "M2/M3",
    chipDetail: "M2 / M3",
    name: 'MacBook Air 15"',
    detail: "M2 / M3 · 2023–24",
    prices: {
      screen: 379,
      battery: 209,
      liquid: 299,
      power: null,
      keyboard: 229,
      trackpad: 169,
      port: 129
    }
  }, {
    id: "mba-13-m",
    family: "air",
    size: 13,
    chip: "M1/M2/M3",
    chipDetail: "M1 / M2 / M3",
    name: 'MacBook Air 13"',
    detail: "M1 / M2 / M3 · 2020–24",
    prices: {
      screen: 329,
      battery: 189,
      liquid: 279,
      power: null,
      keyboard: 209,
      trackpad: 149,
      port: 119
    }
  }, {
    id: "mba-13-i",
    family: "air",
    size: 13,
    chip: "Intel",
    chipDetail: "Intel Retina",
    name: 'MacBook Air 13"',
    detail: "Intel / Retina · 2018–20",
    prices: {
      screen: 299,
      battery: 179,
      liquid: 249,
      power: null,
      keyboard: 199,
      trackpad: 139,
      port: 119
    }
  }, {
    id: "mb-older",
    family: "old",
    size: null,
    chip: "older",
    chipDetail: "Pre-2018",
    name: "Older MacBook",
    detail: "Pre-2018 · requires diagnosis",
    prices: {
      screen: null,
      battery: null,
      liquid: null,
      power: null,
      keyboard: null,
      trackpad: null,
      port: null
    }
  }],
  iphone: [{
    id: "ip-16pm",
    family: "16",
    name: "iPhone 16 Pro Max",
    detail: "2024",
    prices: {
      screen: 379,
      battery: 89,
      glass: 249,
      camera: 199,
      port: 99,
      liquid: null
    }
  }, {
    id: "ip-16p",
    family: "16",
    name: "iPhone 16 Pro",
    detail: "2024",
    prices: {
      screen: 349,
      battery: 89,
      glass: 229,
      camera: 179,
      port: 99,
      liquid: null
    }
  }, {
    id: "ip-16",
    family: "16",
    name: "iPhone 16",
    detail: "2024",
    prices: {
      screen: 279,
      battery: 79,
      glass: 199,
      camera: 149,
      port: 89,
      liquid: null
    }
  }, {
    id: "ip-15pm",
    family: "15",
    name: "iPhone 15 Pro Max",
    detail: "2023",
    prices: {
      screen: 359,
      battery: 89,
      glass: 239,
      camera: 189,
      port: 99,
      liquid: null
    }
  }, {
    id: "ip-15p",
    family: "15",
    name: "iPhone 15 Pro",
    detail: "2023",
    prices: {
      screen: 329,
      battery: 89,
      glass: 219,
      camera: 169,
      port: 89,
      liquid: null
    }
  }, {
    id: "ip-15",
    family: "15",
    name: "iPhone 15",
    detail: "2023",
    prices: {
      screen: 259,
      battery: 79,
      glass: 179,
      camera: 139,
      port: 79,
      liquid: null
    }
  }, {
    id: "ip-14p",
    family: "14",
    name: "iPhone 14 Pro",
    detail: "2022",
    prices: {
      screen: 309,
      battery: 79,
      glass: 209,
      camera: 159,
      port: 89,
      liquid: null
    }
  }, {
    id: "ip-14",
    family: "14",
    name: "iPhone 14",
    detail: "2022",
    prices: {
      screen: 239,
      battery: 69,
      glass: 169,
      camera: 129,
      port: 79,
      liquid: null
    }
  }, {
    id: "ip-se",
    family: "old",
    name: "iPhone SE",
    detail: "2nd / 3rd gen",
    prices: {
      screen: 149,
      battery: 59,
      glass: null,
      camera: 99,
      port: 69,
      liquid: null
    }
  }, {
    id: "ip-13",
    family: "old",
    name: "iPhone 13",
    detail: "2021",
    prices: {
      screen: 229,
      battery: 69,
      glass: 149,
      camera: 119,
      port: 79,
      liquid: null
    }
  }, {
    id: "ip-12",
    family: "old",
    name: "iPhone 12",
    detail: "2020",
    prices: {
      screen: 199,
      battery: 59,
      glass: 129,
      camera: 99,
      port: 69,
      liquid: null
    }
  }, {
    id: "ip-old",
    family: "old",
    name: "Older iPhone",
    detail: "11 and earlier",
    prices: {
      screen: null,
      battery: null,
      glass: null,
      camera: null,
      port: null,
      liquid: null
    }
  }],
  ipad: [{
    id: "ipd-p13",
    family: "pro",
    name: 'iPad Pro 13"',
    detail: "M4 · 2024",
    prices: {
      screen: 449,
      battery: 199,
      port: 129,
      liquid: null
    }
  }, {
    id: "ipd-p11",
    family: "pro",
    name: 'iPad Pro 11"',
    detail: "M4 · 2024",
    prices: {
      screen: 349,
      battery: 179,
      port: 129,
      liquid: null
    }
  }, {
    id: "ipd-a13",
    family: "air",
    name: 'iPad Air 13"',
    detail: "M2 · 2024",
    prices: {
      screen: 329,
      battery: 169,
      port: 119,
      liquid: null
    }
  }, {
    id: "ipd-a11",
    family: "air",
    name: 'iPad Air 11"',
    detail: "M2 · 2024",
    prices: {
      screen: 279,
      battery: 159,
      port: 109,
      liquid: null
    }
  }, {
    id: "ipd-10",
    family: "std",
    name: "iPad 10th gen",
    detail: "2022",
    prices: {
      screen: 229,
      battery: 149,
      port: 99,
      liquid: null
    }
  }, {
    id: "ipd-m6",
    family: "std",
    name: "iPad mini 6",
    detail: "2021",
    prices: {
      screen: 249,
      battery: 149,
      port: 99,
      liquid: null
    }
  }, {
    id: "ipd-old",
    family: "std",
    name: "Older iPad",
    detail: "9th gen and earlier",
    prices: {
      screen: null,
      battery: null,
      port: null,
      liquid: null
    }
  }],
  watch: [{
    id: "aw-u2",
    family: "ultra",
    name: "Apple Watch Ultra 2",
    detail: "2023",
    prices: {
      screen: 279,
      battery: 159,
      seal: 79
    }
  }, {
    id: "aw-u1",
    family: "ultra",
    name: "Apple Watch Ultra",
    detail: "2022",
    prices: {
      screen: 259,
      battery: 149,
      seal: 79
    }
  }, {
    id: "aw-s10",
    family: "main",
    name: "Apple Watch Series 10",
    detail: "2024",
    prices: {
      screen: 219,
      battery: 129,
      seal: 69
    }
  }, {
    id: "aw-s9",
    family: "main",
    name: "Apple Watch Series 9",
    detail: "2023",
    prices: {
      screen: 199,
      battery: 119,
      seal: 69
    }
  }, {
    id: "aw-s8",
    family: "main",
    name: "Apple Watch Series 8",
    detail: "2022",
    prices: {
      screen: 179,
      battery: 109,
      seal: 59
    }
  }, {
    id: "aw-s7",
    family: "main",
    name: "Apple Watch Series 7",
    detail: "2021",
    prices: {
      screen: 169,
      battery: 99,
      seal: 59
    }
  }, {
    id: "aw-se2",
    family: "se",
    name: "Apple Watch SE 2nd",
    detail: "2022",
    prices: {
      screen: 149,
      battery: 89,
      seal: 49
    }
  }, {
    id: "aw-old",
    family: "se",
    name: "Older Watch",
    detail: "Series 6 and earlier",
    prices: {
      screen: null,
      battery: null,
      seal: null
    }
  }]
};

// ── Issues per repair type (shared across devices) ────────────────────────
const ISSUE_CATALOG = {
  screen: [{
    id: "cracked",
    label: "Cracked / shattered",
    detail: "Visible cracks or breaks"
  }, {
    id: "dead",
    label: "Dead / black screen",
    detail: "No image or backlight"
  }, {
    id: "flicker",
    label: "Flickering / lines",
    detail: "Artifacts, flashing, or bands"
  }, {
    id: "touch",
    label: "Touch not responding",
    detail: "Ghost touches or dead zones"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  battery: [{
    id: "degraded",
    label: "Degraded capacity",
    detail: "Under 80%, drains fast"
  }, {
    id: "swollen",
    label: "Swollen / expanding",
    detail: "Case warped or trackpad raised"
  }, {
    id: "nocharge",
    label: "Won't charge",
    detail: "Plugged in but not charging"
  }, {
    id: "shutdowns",
    label: "Random shutdowns",
    detail: "Dies at 30%+ remaining"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  liquid: [{
    id: "recent",
    label: "Recent spill (< 48hrs)",
    detail: "Bring it in ASAP — time matters"
  }, {
    id: "old",
    label: "Older liquid damage",
    detail: "Spill happened days/weeks ago"
  }, {
    id: "submersed",
    label: "Fully submerged",
    detail: "Dropped in water or similar"
  }, {
    id: "corrosion",
    label: "Visible corrosion",
    detail: "Green/white residue on ports"
  }, {
    id: "other",
    label: "Not sure",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  power: [{
    id: "dead",
    label: "Completely dead",
    detail: "No light, no fan, no response"
  }, {
    id: "nocharge",
    label: "Won't charge",
    detail: "Cable works but no charging"
  }, {
    id: "shutdown",
    label: "Random shutdowns",
    detail: "Dies under load or randomly"
  }, {
    id: "oneport",
    label: "Only one port works",
    detail: "Charges on one side only"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  keyboard: [{
    id: "sticky",
    label: "Sticky / repeating keys",
    detail: "Butterfly or debris issue"
  }, {
    id: "dead",
    label: "Dead keys",
    detail: "Some or all keys unresponsive"
  }, {
    id: "backlight",
    label: "Backlight not working",
    detail: "Keys work but no light"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  trackpad: [{
    id: "phantom",
    label: "Phantom clicks",
    detail: "Clicking on its own"
  }, {
    id: "dead",
    label: "Not responding",
    detail: "No click or movement"
  }, {
    id: "physical",
    label: "Physical damage",
    detail: "Cracked or visibly damaged"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  port: [{
    id: "nocharge",
    label: "Won't charge",
    detail: "Cable doesn't register"
  }, {
    id: "loose",
    label: "Loose connection",
    detail: "Cable falls out or intermittent"
  }, {
    id: "nodata",
    label: "No data transfer",
    detail: "Charges but no peripherals"
  }, {
    id: "physical",
    label: "Physical damage",
    detail: "Bent or broken port"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  glass: [{
    id: "cracked",
    label: "Cracked rear glass",
    detail: "Visible cracks on back"
  }, {
    id: "shattered",
    label: "Shattered",
    detail: "Multiple breaks or missing pieces"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  camera: [{
    id: "blurry",
    label: "Blurry / out of focus",
    detail: "Can't focus properly"
  }, {
    id: "shaking",
    label: "Shaking / vibrating",
    detail: "OIS failure, rattling"
  }, {
    id: "black",
    label: "Black screen in camera",
    detail: "Camera app shows nothing"
  }, {
    id: "cracked",
    label: "Cracked lens",
    detail: "Visible damage to lens cover"
  }, {
    id: "other",
    label: "Something else",
    detail: "Diagnosis required",
    diagnosis: true
  }],
  seal: [{
    id: "failed",
    label: "Failed water resistance",
    detail: "Moisture detected inside"
  }, {
    id: "repair",
    label: "Post-repair reseal",
    detail: "Restore seal after a repair"
  }, {
    id: "other",
    label: "Not sure",
    detail: "Diagnosis required",
    diagnosis: true
  }]
};

// ── Helper: get price for a model + repair type ───────────────────────────
function getCatalogPrice(modelId, repairType, deviceId) {
  const models = MODEL_CATALOG[deviceId];
  if (!models) return null;
  const model = models.find(m => m.id === modelId);
  if (!model) return null;
  return model.prices[repairType] ?? null;
}

// ── Helper: get the "from" price for a repair type across all models ──────
function getFromPrice(deviceId, repairType) {
  const models = MODEL_CATALOG[deviceId];
  if (!models) return null;
  const prices = models.map(m => m.prices[repairType]).filter(p => p != null);
  return prices.length ? Math.min(...prices) : null;
}
Object.assign(window, {
  DEVICE_CATALOG,
  REPAIR_TYPES_CATALOG,
  FAMILY_CATALOG,
  MODEL_CATALOG,
  ISSUE_CATALOG,
  getCatalogPrice,
  getFromPrice
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "icorrect/wizard-catalog.jsx", error: String((e && e.message) || e) }); }

// image-slot.js
try { (() => {
/**
 * <image-slot> — user-fillable image placeholder.
 *
 * Drop this into a deck, mockup, or page wherever you want the user to
 * supply an image. You control the slot's shape and size; the user fills it
 * by dragging an image file onto it (or clicking to browse). The dropped
 * image persists across reloads via a .image-slots.state.json sidecar —
 * same read-via-fetch / write-via-window.omelette pattern as
 * design_canvas.jsx, so the filled slot shows on share links, downloaded
 * zips, and PPTX export. Outside the omelette runtime the slot is read-only.
 *
 * The host bridge only allows sidecar writes at the project root, so the
 * HTML that uses this component is assumed to live at the project root too
 * (same constraint as design_canvas.jsx).
 *
 * Attributes:
 *   id           Persistence key. REQUIRED for the drop to survive reload —
 *                every slot on the page needs a distinct id.
 *   shape        'rect' | 'rounded' | 'circle' | 'pill'   (default 'rounded')
 *                'circle' applies 50% border-radius; on a non-square slot
 *                that's an ellipse — set equal width and height for a true
 *                circle.
 *   radius       Corner radius in px for 'rounded'.       (default 12)
 *   mask         Any CSS clip-path value. Overrides `shape` — use this for
 *                hexagons, blobs, arbitrary polygons.
 *   fit          object-fit: cover | contain | fill.       (default 'cover')
 *                With cover (the default) double-clicking the filled slot
 *                enters a reframe mode: the whole image spills past the mask
 *                (translucent outside, opaque inside), drag to reposition,
 *                corner-drag to scale. The crop persists alongside the image
 *                in the sidecar. contain/fill stay static.
 *   position     object-position for fit=contain|fill.     (default '50% 50%')
 *   placeholder  Empty-state caption.                      (default 'Drop an image')
 *   src          Optional initial/fallback image URL. A user drop overrides
 *                it; clearing the drop reveals src again.
 *
 * Size and layout come from ordinary CSS on the element — width/height
 * inline or from a parent grid — so it composes with any layout.
 *
 * Usage:
 *   <script src="image-slot.js"></script>
 *   <image-slot id="hero"   style="width:800px;height:450px" shape="rounded" radius="20"
 *               placeholder="Drop a hero image"></image-slot>
 *   <image-slot id="avatar" style="width:120px;height:120px" shape="circle"></image-slot>
 *   <image-slot id="kite"   style="width:300px;height:300px"
 *               mask="polygon(50% 0, 100% 50%, 50% 100%, 0 50%)"></image-slot>
 */

(() => {
  const STATE_FILE = '.image-slots.state.json';
  // 2× a ~600px slot in a 1920-wide deck — retina-sharp without making the
  // sidecar enormous. A 1200px WebP at q=0.85 is ~150-300KB.
  const MAX_DIM = 1200;
  // Raster formats only. SVG is excluded (can carry script; createImageBitmap
  // on SVG blobs is inconsistent). GIF is excluded because the canvas
  // re-encode keeps only the first frame, so an animated GIF would silently
  // go still — better to reject than surprise.
  const ACCEPT = ['image/png', 'image/jpeg', 'image/webp', 'image/avif'];

  // ── Shared sidecar store ────────────────────────────────────────────────
  // One fetch + immediate write-on-change for every <image-slot> on the
  // page. Reads via fetch() so viewing works anywhere the HTML and sidecar
  // are served together; writes go through window.omelette.writeFile, which
  // the host allowlists to *.state.json basenames only.
  const subs = new Set();
  let slots = {};
  // ids explicitly cleared before the sidecar fetch resolved — otherwise
  // the merge below can't tell "never set" from "just deleted" and would
  // resurrect the sidecar's stale value.
  const tombstones = new Set();
  let loaded = false;
  let loadP = null;
  function load() {
    if (loadP) return loadP;
    loadP = fetch(STATE_FILE).then(r => r.ok ? r.json() : null).then(j => {
      // Merge: sidecar loses to any in-memory change that raced ahead of
      // the fetch (drop or clear) so neither is clobbered by hydration.
      if (j && typeof j === 'object') {
        const merged = Object.assign({}, j, slots);
        // A framing-only write that raced ahead of hydration must not
        // drop a user image that's only on disk — inherit u from the
        // sidecar for any in-memory entry that lacks one.
        for (const k in slots) {
          if (merged[k] && !merged[k].u && j[k]) {
            merged[k].u = typeof j[k] === 'string' ? j[k] : j[k].u;
          }
        }
        for (const id of tombstones) delete merged[id];
        slots = merged;
      }
      tombstones.clear();
    }).catch(() => {}).then(() => {
      loaded = true;
      subs.forEach(fn => fn());
    });
    return loadP;
  }

  // Serialize writes so two near-simultaneous drops on different slots
  // can't reorder at the backend and leave the sidecar with only the
  // first. A save requested mid-flight just marks dirty and re-fires on
  // completion with the then-current slots.
  let saving = false;
  let saveDirty = false;
  function save() {
    if (saving) {
      saveDirty = true;
      return;
    }
    const w = window.omelette && window.omelette.writeFile;
    if (!w) return;
    saving = true;
    Promise.resolve(w(STATE_FILE, JSON.stringify(slots))).catch(() => {}).then(() => {
      saving = false;
      if (saveDirty) {
        saveDirty = false;
        save();
      }
    });
  }
  const S_MAX = 5;
  const clampS = s => Math.max(1, Math.min(S_MAX, s));

  // Normalize a stored slot value. Pre-reframe sidecars stored a bare
  // data-URL string; newer ones store {u, s, x, y}. Either shape is valid.
  function getSlot(id) {
    const v = slots[id];
    if (!v) return null;
    return typeof v === 'string' ? {
      u: v,
      s: 1,
      x: 0,
      y: 0
    } : v;
  }
  function setSlot(id, val) {
    if (!id) return;
    if (val) {
      slots[id] = val;
      tombstones.delete(id);
    } else {
      delete slots[id];
      if (!loaded) tombstones.add(id);
    }
    subs.forEach(fn => fn());
    // A drop is rare + high-value — write immediately so nav-away can't lose
    // it. Gate on the initial read so we don't overwrite a sidecar we haven't
    // merged yet; the merge in load() keeps this change once the read lands.
    if (loaded) save();else load().then(save);
  }

  // ── Image downscale ─────────────────────────────────────────────────────
  // Encode through a canvas so the sidecar carries resized bytes, not the
  // raw upload. Longest side is capped at 2× the slot's rendered width
  // (retina) and at MAX_DIM. WebP keeps alpha and is ~10× smaller than PNG
  // for photos, so there's no need for per-image format picking.
  async function toDataUrl(file, targetW) {
    const bitmap = await createImageBitmap(file);
    try {
      const cap = Math.min(MAX_DIM, Math.max(1, Math.round(targetW * 2)) || MAX_DIM);
      const scale = Math.min(1, cap / Math.max(bitmap.width, bitmap.height));
      const w = Math.max(1, Math.round(bitmap.width * scale));
      const h = Math.max(1, Math.round(bitmap.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      canvas.getContext('2d').drawImage(bitmap, 0, 0, w, h);
      return canvas.toDataURL('image/webp', 0.85);
    } finally {
      bitmap.close && bitmap.close();
    }
  }

  // ── Custom element ──────────────────────────────────────────────────────
  const stylesheet = ':host{display:inline-block;position:relative;vertical-align:top;' + '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(0,0,0,.55);width:240px;height:160px}' + '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(0,0,0,.04)}' +
  // .frame img (clipped) and .spill (unclipped ghost + handles) share the
  // same left/top/width/height in frame-%, computed by _applyView(), so the
  // inside-mask crop and the outside-mask spill stay pixel-aligned.
  '.frame img{position:absolute;max-width:none;transform:translate(-50%,-50%);' + '  -webkit-user-drag:none;user-select:none;touch-action:none}' +
  // Reframe mode (double-click): the full image spills past the mask. The
  // spill layer is sized to the IMAGE bounds so its corners are where the
  // resize handles belong. The ghost <img> inside is translucent; the real
  // clipped <img> underneath shows the opaque in-mask crop.
  '.spill{position:absolute;transform:translate(-50%,-50%);display:none;z-index:1;' + '  cursor:grab;touch-action:none}' + ':host([data-panning]) .spill{cursor:grabbing}' + '.spill .ghost{position:absolute;inset:0;width:100%;height:100%;opacity:.35;' + '  pointer-events:none;-webkit-user-drag:none;user-select:none;' + '  box-shadow:0 0 0 1px rgba(0,0,0,.2),0 12px 32px rgba(0,0,0,.2)}' + '.spill .handle{position:absolute;width:12px;height:12px;border-radius:50%;' + '  background:#fff;box-shadow:0 0 0 1.5px #c96442,0 1px 3px rgba(0,0,0,.3);' + '  transform:translate(-50%,-50%)}' + '.spill .handle[data-c=nw]{left:0;top:0;cursor:nwse-resize}' + '.spill .handle[data-c=ne]{left:100%;top:0;cursor:nesw-resize}' + '.spill .handle[data-c=sw]{left:0;top:100%;cursor:nesw-resize}' + '.spill .handle[data-c=se]{left:100%;top:100%;cursor:nwse-resize}' + ':host([data-reframe]){z-index:10}' + ':host([data-reframe]) .spill{display:block}' + ':host([data-reframe]) .frame{box-shadow:0 0 0 2px #c96442}' + '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' + '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' + '  cursor:pointer;user-select:none}' + '.empty svg{opacity:.45}' + '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' + '.empty .sub{font-size:11px}' + '.empty .sub u{text-underline-offset:2px;text-decoration-color:rgba(0,0,0,.25)}' + '.empty:hover .sub u{color:rgba(0,0,0,.75);text-decoration-color:currentColor}' + ':host([data-over]) .frame{outline:2px solid #c96442;outline-offset:-2px;' + '  background:rgba(201,100,66,.10)}' + '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(0,0,0,.25);' + '  transition:border-color .12s}' + ':host([data-over]) .ring{border-color:#c96442}' + ':host([data-filled]) .ring{display:none}' +
  // Controls sit BELOW the mask (top:100%), absolutely positioned so the
  // author-declared slot height is unaffected. The gap is padding, not a
  // top offset, so the hover target stays contiguous with the frame.
  '.ctl{position:absolute;top:100%;left:50%;transform:translateX(-50%);padding-top:8px;' + '  display:flex;gap:6px;opacity:0;pointer-events:none;transition:opacity .12s;z-index:2;' + '  white-space:nowrap}' + ':host([data-filled][data-editable]:hover) .ctl,:host([data-reframe]) .ctl' + '  {opacity:1;pointer-events:auto}' + '.ctl button{appearance:none;border:0;border-radius:6px;padding:5px 10px;cursor:pointer;' + '  background:rgba(0,0,0,.65);color:#fff;font:11px/1 system-ui,-apple-system,sans-serif;' + '  backdrop-filter:blur(6px)}' + '.ctl button:hover{background:rgba(0,0,0,.8)}' + '.err{position:absolute;left:8px;bottom:8px;right:8px;color:#b3261e;font-size:11px;' + '  background:rgba(255,255,255,.85);padding:4px 6px;border-radius:5px;pointer-events:none}';
  const icon = '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' + 'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' + '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' + '<path d="m21 15-5-5L5 21"/></svg>';
  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'fit', 'position', 'placeholder', 'src', 'id'];
    }
    constructor() {
      super();
      const root = this.attachShadow({
        mode: 'open'
      });
      // .spill and .ctl sit OUTSIDE .frame so overflow:hidden + border-radius
      // on the frame (circle, pill, rounded) can't clip them.
      root.innerHTML = '<style>' + stylesheet + '</style>' + '<div class="frame" part="frame">' + '  <img part="image" alt="" draggable="false" style="display:none">' + '  <div class="empty" part="empty">' + icon + '    <div class="cap"></div>' + '    <div class="sub">or <u>browse files</u></div></div>' + '  <div class="ring" part="ring"></div>' + '</div>' + '<div class="spill">' + '  <img class="ghost" alt="" draggable="false">' + '  <div class="handle" data-c="nw"></div><div class="handle" data-c="ne"></div>' + '  <div class="handle" data-c="sw"></div><div class="handle" data-c="se"></div>' + '</div>' + '<div class="ctl"><button data-act="replace" title="Replace image">Replace</button>' + '  <button data-act="clear" title="Remove image">Remove</button></div>' + '<input type="file" accept="' + ACCEPT.join(',') + '" hidden>';
      this._frame = root.querySelector('.frame');
      this._ring = root.querySelector('.ring');
      this._img = root.querySelector('.frame img');
      this._empty = root.querySelector('.empty');
      this._cap = root.querySelector('.cap');
      this._sub = root.querySelector('.sub');
      this._spill = root.querySelector('.spill');
      this._ghost = root.querySelector('.ghost');
      this._err = null;
      this._input = root.querySelector('input');
      this._depth = 0;
      this._gen = 0;
      this._view = {
        s: 1,
        x: 0,
        y: 0
      };
      this._subFn = () => this._render();
      // Shadow-DOM listeners live with the shadow DOM — bound once here so
      // disconnect/reconnect (e.g. React remount) doesn't stack handlers.
      this._empty.addEventListener('click', () => this._input.click());
      root.addEventListener('click', e => {
        const act = e.target && e.target.getAttribute && e.target.getAttribute('data-act');
        if (act === 'replace') {
          this._exitReframe(true);
          this._input.click();
        }
        if (act === 'clear') {
          this._exitReframe(false);
          this._gen++;
          this._local = null;
          if (this.id) setSlot(this.id, null);else this._render();
        }
      });
      this._input.addEventListener('change', () => {
        const f = this._input.files && this._input.files[0];
        if (f) this._ingest(f);
        this._input.value = '';
      });
      // naturalWidth/Height aren't known until load — re-apply so the cover
      // baseline is computed from real dimensions, not the 100%×100% fallback.
      this._img.addEventListener('load', () => this._applyView());
      // Gated on editable + fit=cover so share links and contain/fill slots
      // stay static.
      this.addEventListener('dblclick', e => {
        if (!this.hasAttribute('data-editable') || !this._reframes()) return;
        e.preventDefault();
        if (this.hasAttribute('data-reframe')) this._exitReframe(true);else this._enterReframe();
      });
      // Pan + resize both originate on the spill layer. A handle pointerdown
      // drives an aspect-locked resize anchored at the opposite corner; any
      // other pointerdown on the spill pans. Offsets are frame-% so a
      // reframed slot survives responsive resize / PPTX export.
      this._spill.addEventListener('pointerdown', e => {
        if (e.button !== 0 || !this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        e.stopPropagation();
        this._spill.setPointerCapture(e.pointerId);
        const rect = this.getBoundingClientRect();
        const fw = rect.width || 1,
          fh = rect.height || 1;
        const corner = e.target.getAttribute && e.target.getAttribute('data-c');
        let move;
        if (corner) {
          // Resize about the OPPOSITE corner. Viewport-px throughout (rect
          // fw/fh, not clientWidth) so the math survives a transform:scale()
          // ancestor — deck_stage renders slides scaled-to-fit.
          const iw = this._img.naturalWidth || 1,
            ih = this._img.naturalHeight || 1;
          const base = Math.max(fw / iw, fh / ih);
          const sx = corner.includes('e') ? 1 : -1;
          const sy = corner.includes('s') ? 1 : -1;
          const s0 = this._view.s;
          const w0 = iw * base * s0,
            h0 = ih * base * s0;
          const cx0 = (50 + this._view.x) / 100 * fw;
          const cy0 = (50 + this._view.y) / 100 * fh;
          const ox = cx0 - sx * w0 / 2,
            oy = cy0 - sy * h0 / 2;
          const diag0 = Math.hypot(w0, h0);
          const ux = sx * w0 / diag0,
            uy = sy * h0 / diag0;
          move = ev => {
            const proj = (ev.clientX - rect.left - ox) * ux + (ev.clientY - rect.top - oy) * uy;
            const s = clampS(s0 * proj / diag0);
            const d = diag0 * s / s0;
            this._view.s = s;
            this._view.x = (ox + ux * d / 2) / fw * 100 - 50;
            this._view.y = (oy + uy * d / 2) / fh * 100 - 50;
            this._clampView();
            this._applyView();
          };
        } else {
          this.setAttribute('data-panning', '');
          const start = {
            px: e.clientX,
            py: e.clientY,
            x: this._view.x,
            y: this._view.y
          };
          move = ev => {
            this._view.x = start.x + (ev.clientX - start.px) / fw * 100;
            this._view.y = start.y + (ev.clientY - start.py) / fh * 100;
            this._clampView();
            this._applyView();
          };
        }
        const up = () => {
          try {
            this._spill.releasePointerCapture(e.pointerId);
          } catch {}
          this._spill.removeEventListener('pointermove', move);
          this._spill.removeEventListener('pointerup', up);
          this._spill.removeEventListener('pointercancel', up);
          this.removeAttribute('data-panning');
          this._dragUp = null;
        };
        // Stashed so _exitReframe (Escape / outside-click mid-drag) can
        // tear the capture + listeners down synchronously.
        this._dragUp = up;
        this._spill.addEventListener('pointermove', move);
        this._spill.addEventListener('pointerup', up);
        this._spill.addEventListener('pointercancel', up);
      });
      // Wheel zoom stays available inside reframe mode as a trackpad nicety —
      // zooms toward the cursor (offset' = cursor·(1-k) + offset·k).
      this.addEventListener('wheel', e => {
        if (!this.hasAttribute('data-reframe')) return;
        e.preventDefault();
        const r = this.getBoundingClientRect();
        const cx = (e.clientX - r.left) / r.width * 100 - 50;
        const cy = (e.clientY - r.top) / r.height * 100 - 50;
        const prev = this._view.s;
        const next = clampS(prev * Math.pow(1.0015, -e.deltaY));
        if (next === prev) return;
        const k = next / prev;
        this._view.s = next;
        this._view.x = cx * (1 - k) + this._view.x * k;
        this._view.y = cy * (1 - k) + this._view.y * k;
        this._clampView();
        this._applyView();
      }, {
        passive: false
      });
    }
    connectedCallback() {
      // Warn once per page — an id-less slot works for the session but
      // cannot persist, and two id-less slots would share nothing.
      if (!this.id && !ImageSlot._warned) {
        ImageSlot._warned = true;
        console.warn('<image-slot> without an id will not persist its dropped image.');
      }
      this.addEventListener('dragenter', this);
      this.addEventListener('dragover', this);
      this.addEventListener('dragleave', this);
      this.addEventListener('drop', this);
      subs.add(this._subFn);
      // width%/height% in _applyView encode the frame aspect at call time —
      // a host resize (responsive grid, pane divider) would stretch the
      // image until the next _render. Re-render on size change: _render()
      // re-seeds _view from stored before clamp/apply, so a shrink→grow
      // cycle round-trips instead of ratcheting x/y toward the narrower
      // frame's clamp range.
      this._ro = new ResizeObserver(() => this._render());
      this._ro.observe(this);
      load();
      this._render();
    }
    disconnectedCallback() {
      subs.delete(this._subFn);
      this.removeEventListener('dragenter', this);
      this.removeEventListener('dragover', this);
      this.removeEventListener('dragleave', this);
      this.removeEventListener('drop', this);
      if (this._ro) {
        this._ro.disconnect();
        this._ro = null;
      }
      this._exitReframe(false);
    }
    _enterReframe() {
      if (this.hasAttribute('data-reframe')) return;
      this.setAttribute('data-reframe', '');
      this._applyView();
      // Close on click outside (the spill handler stopPropagation()s so
      // in-image drags don't reach this) and on Escape. Listeners are held
      // on the instance so _exitReframe / disconnectedCallback can detach
      // exactly what was attached.
      this._outside = e => {
        if (e.composedPath && e.composedPath().includes(this)) return;
        this._exitReframe(true);
      };
      this._esc = e => {
        if (e.key === 'Escape') this._exitReframe(true);
      };
      document.addEventListener('pointerdown', this._outside, true);
      document.addEventListener('keydown', this._esc, true);
    }
    _exitReframe(commit) {
      if (!this.hasAttribute('data-reframe')) return;
      if (this._dragUp) this._dragUp();
      this.removeAttribute('data-reframe');
      this.removeAttribute('data-panning');
      if (this._outside) document.removeEventListener('pointerdown', this._outside, true);
      if (this._esc) document.removeEventListener('keydown', this._esc, true);
      this._outside = this._esc = null;
      if (commit) this._commitView();
    }
    attributeChangedCallback() {
      if (this.shadowRoot) this._render();
    }

    // handleEvent — one listener object for all four drag events keeps the
    // add/remove symmetric and the depth counter correct.
    handleEvent(e) {
      if (e.type === 'dragenter' || e.type === 'dragover') {
        // Without preventDefault the browser never fires 'drop'.
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy';
        if (e.type === 'dragenter') this._depth++;
        this.setAttribute('data-over', '');
      } else if (e.type === 'dragleave') {
        // dragenter/leave fire for every descendant crossing — count depth
        // so hovering the icon inside the empty state doesn't flicker.
        if (--this._depth <= 0) {
          this._depth = 0;
          this.removeAttribute('data-over');
        }
      } else if (e.type === 'drop') {
        e.preventDefault();
        e.stopPropagation();
        this._depth = 0;
        this.removeAttribute('data-over');
        const f = e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0];
        if (f) this._ingest(f);
      }
    }
    async _ingest(file) {
      this._setError(null);
      if (!file || ACCEPT.indexOf(file.type) < 0) {
        this._setError('Drop a PNG, JPEG, WebP, or AVIF image.');
        return;
      }
      // toDataUrl can take hundreds of ms on a large photo. A Clear or a
      // newer drop during that window would be clobbered when this await
      // resumes — bump + capture a generation so stale encodes bail.
      const gen = ++this._gen;
      try {
        const w = this.clientWidth || this.offsetWidth || MAX_DIM;
        const url = await toDataUrl(file, w);
        if (gen !== this._gen) return;
        // Only exit reframe once the new image is in hand — a rejected type
        // or decode failure leaves the in-progress crop untouched.
        this._exitReframe(false);
        const val = {
          u: url,
          s: 1,
          x: 0,
          y: 0
        };
        setSlot(this.id || '', val);
        // Keep a session-local copy for id-less slots so the drop still
        // shows, even though it cannot persist.
        if (!this.id) {
          this._local = val;
          this._render();
        }
      } catch (err) {
        if (gen !== this._gen) return;
        this._setError('Could not read that image.');
        console.warn('<image-slot> ingest failed:', err);
      }
    }
    _setError(msg) {
      if (this._err) {
        this._err.remove();
        this._err = null;
      }
      if (!msg) return;
      const d = document.createElement('div');
      d.className = 'err';
      d.textContent = msg;
      this.shadowRoot.appendChild(d);
      this._err = d;
      setTimeout(() => {
        if (this._err === d) {
          d.remove();
          this._err = null;
        }
      }, 3000);
    }

    // Reframing (pan/resize) is only meaningful for fit=cover — contain/fill
    // keep the old object-fit path and double-click is a no-op.
    _reframes() {
      return this.hasAttribute('data-filled') && (this.getAttribute('fit') || 'cover') === 'cover';
    }

    // Cover-baseline geometry, shared by clamp/apply/resize. Null until the
    // img has loaded (naturalWidth is 0 before that) or when the slot has no
    // layout box — ResizeObserver fires with a 0×0 rect under display:none,
    // and clamping against a degenerate 1×1 frame would silently pull the
    // stored pan toward zero.
    _geom() {
      const iw = this._img.naturalWidth,
        ih = this._img.naturalHeight;
      const fw = this.clientWidth,
        fh = this.clientHeight;
      if (!iw || !ih || !fw || !fh) return null;
      return {
        iw,
        ih,
        fw,
        fh,
        base: Math.max(fw / iw, fh / ih)
      };
    }
    _clampView() {
      // Pan range on each axis is half the overflow past the frame edge.
      const g = this._geom();
      if (!g) return;
      const mx = Math.max(0, (g.iw * g.base * this._view.s / g.fw - 1) * 50);
      const my = Math.max(0, (g.ih * g.base * this._view.s / g.fh - 1) * 50);
      this._view.x = Math.max(-mx, Math.min(mx, this._view.x));
      this._view.y = Math.max(-my, Math.min(my, this._view.y));
    }
    _applyView() {
      const g = this._geom();
      const fit = this.getAttribute('fit') || 'cover';
      if (fit !== 'cover' || !g) {
        // Non-cover, or dimensions not known yet (before img load).
        this._img.style.width = '100%';
        this._img.style.height = '100%';
        this._img.style.left = '50%';
        this._img.style.top = '50%';
        this._img.style.objectFit = fit;
        this._img.style.objectPosition = this.getAttribute('position') || '50% 50%';
        return;
      }
      // Cover baseline: img fills the frame on its tighter axis at s=1, so
      // pan works immediately on the overflowing axis without zooming first.
      // Width/height and left/top are all frame-% — depends only on the
      // frame aspect ratio, so a responsive resize keeps the same crop. The
      // spill layer mirrors the same box so its corners = image corners.
      const k = g.base * this._view.s;
      const w = g.iw * k / g.fw * 100 + '%';
      const h = g.ih * k / g.fh * 100 + '%';
      const l = 50 + this._view.x + '%';
      const t = 50 + this._view.y + '%';
      this._img.style.width = w;
      this._img.style.height = h;
      this._img.style.left = l;
      this._img.style.top = t;
      this._img.style.objectFit = '';
      this._spill.style.width = w;
      this._spill.style.height = h;
      this._spill.style.left = l;
      this._spill.style.top = t;
    }
    _commitView() {
      const v = {
        s: this._view.s,
        x: this._view.x,
        y: this._view.y
      };
      if (this._userUrl) v.u = this._userUrl;
      // Framing-only (no u) persists too so an author-src slot remembers its
      // crop; clearing the sidecar still falls through to src=.
      if (this.id) setSlot(this.id, v);else {
        this._local = v;
      }
    }
    _render() {
      // Shape / mask. Presets use border-radius so the dashed ring can
      // follow the rounded outline; clip-path is only applied for an
      // explicit `mask` (the ring is hidden there since a rectangle
      // dashed border chopped by an arbitrary polygon looks broken).
      const mask = this.getAttribute('mask');
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      let radius = '';
      if (shape === 'circle') radius = '50%';else if (shape === 'pill') radius = '9999px';else if (shape === 'rounded') {
        const n = parseFloat(this.getAttribute('radius'));
        radius = (Number.isFinite(n) ? n : 12) + 'px';
      }
      this._frame.style.borderRadius = mask ? '' : radius;
      this._frame.style.clipPath = mask || '';
      this._ring.style.borderRadius = mask ? '' : radius;
      this._ring.style.display = mask ? 'none' : '';

      // Controls and reframe entry gate on this so share links stay read-only.
      const editable = !!(window.omelette && window.omelette.writeFile);
      this.toggleAttribute('data-editable', editable);
      this._sub.style.display = editable ? '' : 'none';

      // Content. The sidecar is also writable by the agent's write_file
      // tool, so its value isn't guaranteed canvas-originated — only accept
      // data:image/ URLs from it. The `src` attribute is author-controlled
      // (Claude wrote it into the HTML) so it passes through unchanged.
      let stored = this.id ? getSlot(this.id) : this._local;
      if (stored && stored.u && !/^data:image\//i.test(stored.u)) stored = null;
      const srcAttr = this.getAttribute('src') || '';
      this._userUrl = stored && stored.u || null;
      const url = this._userUrl || srcAttr;
      // Don't clobber an in-flight reframe with a store-triggered re-render.
      if (!this.hasAttribute('data-reframe')) {
        this._view = {
          s: stored && Number.isFinite(stored.s) ? clampS(stored.s) : 1,
          x: stored && Number.isFinite(stored.x) ? stored.x : 0,
          y: stored && Number.isFinite(stored.y) ? stored.y : 0
        };
      }
      this._cap.textContent = this.getAttribute('placeholder') || 'Drop an image';
      // Toggle via style.display — the [hidden] attribute alone loses to
      // the display:flex / display:block rules in the stylesheet above.
      if (url) {
        if (this._img.getAttribute('src') !== url) {
          this._img.src = url;
          this._ghost.src = url;
        }
        this._img.style.display = 'block';
        this._empty.style.display = 'none';
        this.setAttribute('data-filled', '');
        this._clampView();
        this._applyView();
      } else {
        this._img.style.display = 'none';
        this._img.removeAttribute('src');
        this._ghost.removeAttribute('src');
        this._empty.style.display = 'flex';
        this.removeAttribute('data-filled');
      }
    }
  }
  if (!customElements.get('image-slot')) {
    customElements.define('image-slot', ImageSlot);
  }
})();
})(); } catch (e) { __ds_ns.__errors.push({ path: "image-slot.js", error: String((e && e.message) || e) }); }

// ios-frame.jsx
try { (() => {
// iOS.jsx — Simplified iOS 26 (Liquid Glass) device frame
// Based on the iOS 26 UI Kit + Figma status bar spec. No assets, no deps.
// Exports: IOSDevice, IOSStatusBar, IOSNavBar, IOSGlassPill, IOSList, IOSListRow, IOSKeyboard

// ─────────────────────────────────────────────────────────────
// Status bar
// ─────────────────────────────────────────────────────────────
function IOSStatusBar({
  dark = false,
  time = '9:41'
}) {
  const c = dark ? '#fff' : '#000';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 154,
      alignItems: 'center',
      justifyContent: 'center',
      padding: '21px 24px 19px',
      boxSizing: 'border-box',
      position: 'relative',
      zIndex: 20,
      width: '100%'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: '-apple-system, "SF Pro", system-ui',
      fontWeight: 590,
      fontSize: 17,
      lineHeight: '22px',
      color: c
    }
  }, time)), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      height: 22,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 7,
      paddingTop: 1,
      paddingRight: 1
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "19",
    height: "12",
    viewBox: "0 0 19 12"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0",
    y: "7.5",
    width: "3.2",
    height: "4.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "4.8",
    y: "5",
    width: "3.2",
    height: "7",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "9.6",
    y: "2.5",
    width: "3.2",
    height: "9.5",
    rx: "0.7",
    fill: c
  }), /*#__PURE__*/React.createElement("rect", {
    x: "14.4",
    y: "0",
    width: "3.2",
    height: "12",
    rx: "0.7",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "17",
    height: "12",
    viewBox: "0 0 17 12"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M8.5 3.2C10.8 3.2 12.9 4.1 14.4 5.6L15.5 4.5C13.7 2.7 11.2 1.5 8.5 1.5C5.8 1.5 3.3 2.7 1.5 4.5L2.6 5.6C4.1 4.1 6.2 3.2 8.5 3.2Z",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 6.8C9.9 6.8 11.1 7.3 12 8.2L13.1 7.1C11.8 5.9 10.2 5.1 8.5 5.1C6.8 5.1 5.2 5.9 3.9 7.1L5 8.2C5.9 7.3 7.1 6.8 8.5 6.8Z",
    fill: c
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "8.5",
    cy: "10.5",
    r: "1.5",
    fill: c
  })), /*#__PURE__*/React.createElement("svg", {
    width: "27",
    height: "13",
    viewBox: "0 0 27 13"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "0.5",
    y: "0.5",
    width: "23",
    height: "12",
    rx: "3.5",
    stroke: c,
    strokeOpacity: "0.35",
    fill: "none"
  }), /*#__PURE__*/React.createElement("rect", {
    x: "2",
    y: "2",
    width: "20",
    height: "9",
    rx: "2",
    fill: c
  }), /*#__PURE__*/React.createElement("path", {
    d: "M25 4.5V8.5C25.8 8.2 26.5 7.2 26.5 6.5C26.5 5.8 25.8 4.8 25 4.5Z",
    fill: c,
    fillOpacity: "0.4"
  }))));
}

// ─────────────────────────────────────────────────────────────
// Liquid glass pill — blur + tint + shine
// ─────────────────────────────────────────────────────────────
function IOSGlassPill({
  children,
  dark = false,
  style = {}
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: 44,
      minWidth: 44,
      borderRadius: 9999,
      position: 'relative',
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: dark ? '0 2px 6px rgba(0,0,0,0.35), 0 6px 16px rgba(0,0,0,0.2)' : '0 1px 3px rgba(0,0,0,0.07), 0 3px 10px rgba(0,0,0,0.06)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.28)' : 'rgba(255,255,255,0.5)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 9999,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15), inset -1px -1px 1px rgba(255,255,255,0.08)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1,
      display: 'flex',
      alignItems: 'center',
      padding: '0 4px'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Navigation bar — glass pills + large title
// ─────────────────────────────────────────────────────────────
function IOSNavBar({
  title = 'Title',
  dark = false,
  trailingIcon = true
}) {
  const muted = dark ? 'rgba(255,255,255,0.6)' : '#404040';
  const text = dark ? '#fff' : '#000';
  const pillIcon = content => /*#__PURE__*/React.createElement(IOSGlassPill, {
    dark: dark
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, content));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      paddingTop: 62,
      paddingBottom: 10,
      position: 'relative',
      zIndex: 5
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 16px'
    }
  }, pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "12",
    height: "20",
    viewBox: "0 0 12 20",
    fill: "none",
    style: {
      marginLeft: -1
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M10 2L2 10l8 8",
    stroke: muted,
    strokeWidth: "2.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }))), trailingIcon && pillIcon(/*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "6",
    viewBox: "0 0 22 6"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "3",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "11",
    cy: "3",
    r: "2.5",
    fill: muted
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "19",
    cy: "3",
    r: "2.5",
    fill: muted
  })))), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '0 16px',
      fontFamily: '-apple-system, system-ui',
      fontSize: 34,
      fontWeight: 700,
      lineHeight: '41px',
      color: text,
      letterSpacing: 0.4
    }
  }, title));
}

// ─────────────────────────────────────────────────────────────
// Grouped list (inset card, r:26) + row (52px)
// ─────────────────────────────────────────────────────────────
function IOSListRow({
  title,
  detail,
  icon,
  chevron = true,
  isLast = false,
  dark = false
}) {
  const text = dark ? '#fff' : '#000';
  const sec = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const ter = dark ? 'rgba(235,235,245,0.3)' : 'rgba(60,60,67,0.3)';
  const sep = dark ? 'rgba(84,84,88,0.65)' : 'rgba(60,60,67,0.12)';
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      minHeight: 52,
      padding: '0 16px',
      position: 'relative',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      letterSpacing: -0.43
    }
  }, icon && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 7,
      background: icon,
      marginRight: 12,
      flexShrink: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      color: text
    }
  }, title), detail && /*#__PURE__*/React.createElement("span", {
    style: {
      color: sec,
      marginRight: 6
    }
  }, detail), chevron && /*#__PURE__*/React.createElement("svg", {
    width: "8",
    height: "14",
    viewBox: "0 0 8 14",
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("path", {
    d: "M1 1l6 6-6 6",
    stroke: ter,
    strokeWidth: "2",
    fill: "none",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  })), !isLast && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      right: 0,
      left: icon ? 58 : 16,
      height: 0.5,
      background: sep
    }
  }));
}
function IOSList({
  header,
  children,
  dark = false
}) {
  const hc = dark ? 'rgba(235,235,245,0.6)' : 'rgba(60,60,67,0.6)';
  const bg = dark ? '#1C1C1E' : '#fff';
  return /*#__PURE__*/React.createElement("div", null, header && /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: '-apple-system, system-ui',
      fontSize: 13,
      color: hc,
      textTransform: 'uppercase',
      padding: '8px 36px 6px',
      letterSpacing: -0.08
    }
  }, header), /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 26,
      margin: '0 16px',
      overflow: 'hidden'
    }
  }, children));
}

// ─────────────────────────────────────────────────────────────
// Device frame
// ─────────────────────────────────────────────────────────────
function IOSDevice({
  children,
  width = 402,
  height = 874,
  dark = false,
  title,
  keyboard = false
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      width,
      height,
      borderRadius: 48,
      overflow: 'hidden',
      position: 'relative',
      background: dark ? '#000' : '#F2F2F7',
      boxShadow: '0 40px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.12)',
      fontFamily: '-apple-system, system-ui, sans-serif',
      WebkitFontSmoothing: 'antialiased'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 11,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 126,
      height: 37,
      borderRadius: 24,
      background: '#000',
      zIndex: 50
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 10
    }
  }, /*#__PURE__*/React.createElement(IOSStatusBar, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      height: '100%',
      display: 'flex',
      flexDirection: 'column'
    }
  }, title !== undefined && /*#__PURE__*/React.createElement(IOSNavBar, {
    title: title,
    dark: dark
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: 'auto'
    }
  }, children), keyboard && /*#__PURE__*/React.createElement(IOSKeyboard, {
    dark: dark
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 60,
      height: 34,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'flex-end',
      paddingBottom: 8,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 139,
      height: 5,
      borderRadius: 100,
      background: dark ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.25)'
    }
  })));
}

// ─────────────────────────────────────────────────────────────
// Keyboard — iOS 26 liquid glass
// ─────────────────────────────────────────────────────────────
function IOSKeyboard({
  dark = false
}) {
  const glyph = dark ? 'rgba(255,255,255,0.7)' : '#595959';
  const sugg = dark ? 'rgba(255,255,255,0.6)' : '#333';
  const keyBg = dark ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.85)';

  // special-key icons
  const icons = {
    shift: /*#__PURE__*/React.createElement("svg", {
      width: "19",
      height: "17",
      viewBox: "0 0 19 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M9.5 1L1 9.5h4.5V16h8V9.5H18L9.5 1z",
      fill: glyph
    })),
    del: /*#__PURE__*/React.createElement("svg", {
      width: "23",
      height: "17",
      viewBox: "0 0 23 17"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M7 1h13a2 2 0 012 2v11a2 2 0 01-2 2H7l-6-7.5L7 1z",
      fill: "none",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinejoin: "round"
    }), /*#__PURE__*/React.createElement("path", {
      d: "M10 5l7 7M17 5l-7 7",
      stroke: glyph,
      strokeWidth: "1.6",
      strokeLinecap: "round"
    })),
    ret: /*#__PURE__*/React.createElement("svg", {
      width: "20",
      height: "14",
      viewBox: "0 0 20 14"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M18 1v6H4m0 0l4-4M4 7l4 4",
      fill: "none",
      stroke: "#fff",
      strokeWidth: "1.8",
      strokeLinecap: "round",
      strokeLinejoin: "round"
    }))
  };
  const key = (content, {
    w,
    flex,
    ret,
    fs = 25,
    k
  } = {}) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      height: 42,
      borderRadius: 8.5,
      flex: flex ? 1 : undefined,
      width: w,
      minWidth: 0,
      background: ret ? '#08f' : keyBg,
      boxShadow: '0 1px 0 rgba(0,0,0,0.075)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: '-apple-system, "SF Compact", system-ui',
      fontSize: fs,
      fontWeight: 458,
      color: ret ? '#fff' : glyph
    }
  }, content);
  const row = (keys, pad = 0) => /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      justifyContent: 'center',
      padding: `0 ${pad}px`
    }
  }, keys.map(l => key(l, {
    flex: true,
    k: l
  })));
  return /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 15,
      borderRadius: 27,
      overflow: 'hidden',
      padding: '11px 0 2px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: dark ? '0 -2px 20px rgba(0,0,0,0.09)' : '0 -1px 6px rgba(0,0,0,0.018), 0 -3px 20px rgba(0,0,0,0.012)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      backdropFilter: 'blur(12px) saturate(180%)',
      WebkitBackdropFilter: 'blur(12px) saturate(180%)',
      background: dark ? 'rgba(120,120,128,0.14)' : 'rgba(255,255,255,0.25)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      inset: 0,
      borderRadius: 27,
      boxShadow: dark ? 'inset 1.5px 1.5px 1px rgba(255,255,255,0.15)' : 'inset 1.5px 1.5px 1px rgba(255,255,255,0.7), inset -1px -1px 1px rgba(255,255,255,0.4)',
      border: dark ? '0.5px solid rgba(255,255,255,0.15)' : '0.5px solid rgba(0,0,0,0.06)',
      pointerEvents: 'none'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 20,
      alignItems: 'center',
      padding: '8px 22px 13px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, ['"The"', 'the', 'to'].map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 1,
      height: 25,
      background: '#ccc',
      opacity: 0.3
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      textAlign: 'center',
      fontFamily: '-apple-system, system-ui',
      fontSize: 17,
      color: sugg,
      letterSpacing: -0.43,
      lineHeight: '22px'
    }
  }, w)))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 13,
      padding: '0 6.5px',
      width: '100%',
      boxSizing: 'border-box',
      position: 'relative'
    }
  }, row(['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p']), row(['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'], 20), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 14.25,
      alignItems: 'center'
    }
  }, key(icons.shift, {
    w: 45,
    k: 'shift'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6.5,
      flex: 1
    }
  }, ['z', 'x', 'c', 'v', 'b', 'n', 'm'].map(l => key(l, {
    flex: true,
    k: l
  }))), key(icons.del, {
    w: 45,
    k: 'del'
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6,
      alignItems: 'center'
    }
  }, key('ABC', {
    w: 92.25,
    fs: 18,
    k: 'abc'
  }), key('', {
    flex: true,
    k: 'space'
  }), key(icons.ret, {
    w: 92.25,
    ret: true,
    k: 'ret'
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 56,
      width: '100%',
      position: 'relative'
    }
  }));
}
Object.assign(window, {
  IOSDevice,
  IOSStatusBar,
  IOSNavBar,
  IOSGlassPill,
  IOSList,
  IOSListRow,
  IOSKeyboard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ios-frame.jsx", error: String((e && e.message) || e) }); }

// qw/QuoteWizard.jsx
try { (() => {
// ═══════════════════════════════════════════════════════════════════════════
//  iCorrect Quote Wizard — Main Wizard Flow
//  Step 1: Device → Step 2: Model → Step 3: Fault → Step 4: Issue → Step 5: Service
// ═══════════════════════════════════════════════════════════════════════════

const DEVICES = window.QW_DEVICES;
const MODELS = window.QW_MODELS;
const FAULTS = window.QW_FAULTS;
const ISSUES = window.QW_ISSUES;
const ICONS = window.QW_FAULT_ICONS;
function FaultIcon({
  icon,
  size = 20
}) {
  const path = ICONS[icon];
  if (!path) return null;
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: path
  }));
}
function QuoteWizard() {
  const [step, setStep] = React.useState(1);
  const [device, setDevice] = React.useState(null);
  const [modelName, setModelName] = React.useState(null);
  const [fault, setFault] = React.useState(null);
  const [issue, setIssue] = React.useState(null);
  const [submitted, setSubmitted] = React.useState(false);
  const [payload, setPayload] = React.useState(null);

  // Model accordion open state
  const [openGroup, setOpenGroup] = React.useState(null);
  const selectDevice = d => {
    setDevice(d);
    setModelName(null);
    setFault(null);
    setIssue(null);
    setOpenGroup(null);
    setStep(2);
  };
  const selectModel = name => {
    setModelName(name);
    setFault(null);
    setIssue(null);
    setStep(3);
  };
  const selectFault = f => {
    setFault(f);
    setIssue(null);
    setStep(4);
  };
  const selectIssue = iss => {
    setIssue(iss);
    setStep(5);
  };
  const handleServiceSubmit = data => {
    setPayload(data);
    setSubmitted(true);
  };
  const reset = () => {
    setStep(1);
    setDevice(null);
    setModelName(null);
    setFault(null);
    setIssue(null);
    setSubmitted(false);
    setPayload(null);
    setOpenGroup(null);
  };
  const jumpToStep = s => {
    if (s <= step) {
      if (s <= 1) {
        setDevice(null);
        setModelName(null);
        setFault(null);
        setIssue(null);
      }
      if (s <= 2) {
        setModelName(null);
        setFault(null);
        setIssue(null);
      }
      if (s <= 3) {
        setFault(null);
        setIssue(null);
      }
      if (s <= 4) {
        setIssue(null);
      }
      setStep(s);
    }
  };
  const stepLabels = ["Device", "Model", "Fault", "Issue", "Service"];
  const stepValues = [device ? DEVICES.find(d => d.id === device)?.name : null, modelName, fault?.label, issue?.label, null];
  if (submitted) {
    return /*#__PURE__*/React.createElement("div", {
      className: "qw-page",
      style: {
        textAlign: "center"
      }
    }, /*#__PURE__*/React.createElement("div", {
      className: "qw-check"
    }, "\u2713"), /*#__PURE__*/React.createElement("h2", {
      className: "qw-step-title"
    }, "Ready for checkout"), /*#__PURE__*/React.createElement("p", {
      className: "qw-step-sub",
      style: {
        maxWidth: 480,
        margin: "8px auto 24px"
      }
    }, "The wizard returned the full payload below. In production this forwards to your checkout flow."), /*#__PURE__*/React.createElement("pre", {
      className: "qw-payload-pre"
    }, JSON.stringify(payload, null, 2)), /*#__PURE__*/React.createElement("button", {
      className: "qw-btn qw-btn-dark",
      style: {
        marginTop: 20
      },
      onClick: reset
    }, "Reset wizard"));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "qw-page"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-progress"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-progress-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-mono"
  }, "Step ", step, " of 5")), /*#__PURE__*/React.createElement("div", {
    className: "qw-dots"
  }, stepLabels.map((label, i) => {
    const idx = i + 1;
    const isDone = idx < step;
    const isCurrent = idx === step;
    const canJump = idx <= step;
    return /*#__PURE__*/React.createElement("button", {
      key: label,
      type: "button",
      disabled: !canJump,
      onClick: () => canJump && jumpToStep(idx),
      className: "qw-dot" + (isDone ? " done" : "") + (isCurrent ? " current" : "")
    }, /*#__PURE__*/React.createElement("div", {
      className: "qw-dot-num"
    }, idx), /*#__PURE__*/React.createElement("div", {
      className: "qw-dot-label"
    }, label, isDone && stepValues[i] ? `: ${stepValues[i].length > 18 ? stepValues[i].slice(0, 16) + "…" : stepValues[i]}` : ""));
  }))), step === 1 && /*#__PURE__*/React.createElement("div", {
    className: "qw-step"
  }, /*#__PURE__*/React.createElement("h3", {
    className: "qw-step-title"
  }, "What needs fixing?"), /*#__PURE__*/React.createElement("p", {
    className: "qw-step-sub"
  }, "Pick your device to get started."), /*#__PURE__*/React.createElement("div", {
    className: "qw-device-grid"
  }, DEVICES.map(d => /*#__PURE__*/React.createElement("button", {
    key: d.id,
    type: "button",
    className: "qw-device-card" + (device === d.id ? " selected" : ""),
    onClick: () => selectDevice(d.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-device-icon",
    dangerouslySetInnerHTML: {
      __html: d.svg
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "qw-device-name"
  }, d.name))))), step === 2 && device && /*#__PURE__*/React.createElement("div", {
    className: "qw-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "qw-btn-back",
    type: "button",
    onClick: () => jumpToStep(1)
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "qw-step-title"
  }, "Which ", DEVICES.find(d => d.id === device)?.name, "?"), /*#__PURE__*/React.createElement("p", {
    className: "qw-step-sub"
  }, "Pick your exact model for accurate pricing."), /*#__PURE__*/React.createElement("div", {
    className: "qw-model-groups"
  }, (MODELS[device] || []).map((g, gi) => {
    const isOpen = openGroup === gi;
    return /*#__PURE__*/React.createElement("div", {
      key: gi,
      className: "qw-model-group" + (isOpen ? " open" : "")
    }, /*#__PURE__*/React.createElement("button", {
      type: "button",
      className: "qw-model-group-head",
      onClick: () => setOpenGroup(isOpen ? null : gi)
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
      className: "qw-model-group-name"
    }, g.group), /*#__PURE__*/React.createElement("div", {
      className: "qw-model-group-count"
    }, g.models.length, " model", g.models.length !== 1 ? "s" : "")), /*#__PURE__*/React.createElement("svg", {
      className: "qw-model-chev",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    }, /*#__PURE__*/React.createElement("path", {
      d: "M6 9l6 6 6-6"
    }))), isOpen && /*#__PURE__*/React.createElement("div", {
      className: "qw-model-list"
    }, g.models.map((m, mi) => /*#__PURE__*/React.createElement("button", {
      key: mi,
      type: "button",
      className: "qw-model-item" + (modelName === m.name ? " selected" : ""),
      onClick: () => selectModel(m.name)
    }, /*#__PURE__*/React.createElement("span", {
      className: "qw-model-item-name"
    }, m.name), /*#__PURE__*/React.createElement("span", {
      className: "qw-model-item-year"
    }, m.year)))));
  }))), step === 3 && device && modelName && /*#__PURE__*/React.createElement("div", {
    className: "qw-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "qw-btn-back",
    type: "button",
    onClick: () => jumpToStep(2)
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "qw-step-title"
  }, "What's the issue?"), /*#__PURE__*/React.createElement("p", {
    className: "qw-step-sub"
  }, "Pick the category that best describes the problem."), /*#__PURE__*/React.createElement("div", {
    className: "qw-fault-grid"
  }, (FAULTS[device] || []).map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    type: "button",
    className: "qw-fault-card" + (fault?.id === f.id ? " selected" : ""),
    onClick: () => selectFault(f)
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-fault-icon"
  }, /*#__PURE__*/React.createElement(FaultIcon, {
    icon: f.icon
  })), /*#__PURE__*/React.createElement("div", {
    className: "qw-fault-name"
  }, f.label))))), step === 4 && device && fault && /*#__PURE__*/React.createElement("div", {
    className: "qw-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "qw-btn-back",
    type: "button",
    onClick: () => jumpToStep(3)
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("h3", {
    className: "qw-step-title"
  }, fault.label), /*#__PURE__*/React.createElement("p", {
    className: "qw-step-sub"
  }, "Tell us a bit more so we can give you the best quote."), /*#__PURE__*/React.createElement("div", {
    className: "qw-issue-list"
  }, (ISSUES[device]?.[fault.label] || []).map((iss, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    type: "button",
    className: "qw-issue-card" + (issue?.label === iss.label ? " selected" : ""),
    onClick: () => selectIssue(iss)
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-issue-icon-wrap"
  }, /*#__PURE__*/React.createElement(FaultIcon, {
    icon: fault.icon,
    size: 18
  })), /*#__PURE__*/React.createElement("div", {
    className: "qw-issue-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-issue-label"
  }, iss.label), /*#__PURE__*/React.createElement("div", {
    className: "qw-issue-hint"
  }, iss.hint)))))), step === 5 && device && modelName && fault && issue && /*#__PURE__*/React.createElement("div", {
    className: "qw-step"
  }, /*#__PURE__*/React.createElement("button", {
    className: "qw-btn-back",
    type: "button",
    onClick: () => jumpToStep(4)
  }, "\u2190 Back"), /*#__PURE__*/React.createElement("div", {
    className: "qw-summary"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-mono"
  }, "Your repair"), /*#__PURE__*/React.createElement("div", {
    className: "qw-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Device"), /*#__PURE__*/React.createElement("span", null, modelName)), /*#__PURE__*/React.createElement("div", {
    className: "qw-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Fault"), /*#__PURE__*/React.createElement("span", null, fault.label)), /*#__PURE__*/React.createElement("div", {
    className: "qw-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Issue"), /*#__PURE__*/React.createElement("span", null, issue.label)), /*#__PURE__*/React.createElement("div", {
    className: "qw-summary-line"
  }, /*#__PURE__*/React.createElement("span", null, "Warranty"), /*#__PURE__*/React.createElement("span", null, "2 years")), /*#__PURE__*/React.createElement("div", {
    className: "qw-diagnosis-note"
  }, /*#__PURE__*/React.createElement("strong", null, "Prices are confirmed at checkout."), " You'll fill in exact amounts \u2014 the service mapper handles delivery, scheduling, and turnaround.")), /*#__PURE__*/React.createElement(ServiceMapper, {
    model: modelName,
    fault: fault,
    issue: issue,
    repairPrice: null,
    requiresDiagnosis: true,
    onSubmit: handleServiceSubmit
  })));
}
Object.assign(window, {
  QuoteWizard,
  FaultIcon
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "qw/QuoteWizard.jsx", error: String((e && e.message) || e) }); }

// qw/ServiceMapper.jsx
try { (() => {
// ═══════════════════════════════════════════════════════════════════════════
//  iCorrect Quote Wizard — Service Mapper Component (Step 5)
//  Postcode → Service → Date/Time → Turnaround → Timeline → CTA
// ═══════════════════════════════════════════════════════════════════════════

// qw/data.js sets this on window when the page loads it as a plain script.
// Fall back to an empty config so this file can also be parsed outside that page.
const CFG = window.QW_SERVICE_CONFIG || {};

// ── Helpers ───────────────────────────────────────────────────────────────
function isLondonPostcode(pc) {
  if (!pc) return false;
  const t = pc.trim().toUpperCase().replace(/\s+/g, "");
  if (t.length < 2) return false;
  return CFG.LONDON_POSTCODES.includes(t.match(/^[A-Z]+/)?.[0]);
}
function classifyPostcode(pc) {
  if (!pc || !pc.trim()) return "empty";
  const t = pc.trim().toUpperCase().replace(/\s+/g, "");
  if (!/^[A-Z]{1,2}[0-9][A-Z0-9]?/.test(t)) return "international";
  return isLondonPostcode(t) ? "london" : "uk";
}
const _holidays = new Set(CFG.UK_BANK_HOLIDAYS || []);
function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
function isWorkingDay(d) {
  const dow = d.getDay();
  return dow !== 0 && dow !== 6 && !_holidays.has(isoDate(d));
}
function addWorkingDays(d, n) {
  const o = new Date(d);
  let a = 0;
  while (a < n) {
    o.setDate(o.getDate() + 1);
    if (isWorkingDay(o)) a++;
  }
  return o;
}
function nextWorkingDay(d) {
  return addWorkingDays(d, 1);
}
function fmtDate(d) {
  const dt = d instanceof Date ? d : new Date(d);
  return isNaN(dt.getTime()) ? "" : dt.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short"
  });
}
function upcomingWorkingDates(count = 8) {
  const o = [];
  const d = new Date();
  while (o.length < count) {
    d.setDate(d.getDate() + 1);
    if (isWorkingDay(d)) o.push(new Date(d));
  }
  return o;
}
function buildTimeline({
  delivery,
  walkInDate,
  walkInTime,
  courierDate,
  courierWindow,
  arrivalDate,
  today,
  returnDate,
  turnaround
}) {
  const steps = [];
  const tl = turnaround === "fast" ? "Fast turnaround" : "Standard turnaround";
  const cwl = courierWindow ? CFG.COURIER_WINDOWS.find(w => w.id === courierWindow)?.label : null;
  if (delivery === "walkin" && walkInDate) {
    steps.push({
      label: "Drop off at our Fitzrovia workshop",
      date: fmtDate(walkInDate) + (walkInTime ? ` · ${walkInTime}` : ""),
      note: "We'll inspect with you and confirm the price."
    });
    steps.push({
      label: "We repair on-site",
      date: tl,
      note: "Genuine Apple parts, calibrated in-house."
    });
  } else if (delivery === "courier" && courierDate) {
    steps.push({
      label: "We collect by same-day courier",
      date: fmtDate(courierDate) + (cwl ? ` · ${cwl}` : ""),
      note: `Tracked door-to-door · £${CFG.COURIER_FEE} within central London.`
    });
    steps.push({
      label: "We repair at the workshop",
      date: tl,
      note: "Status updates by SMS at each stage."
    });
  } else if (delivery === "mail") {
    steps.push({
      label: "Post your device (any UK address)",
      date: `Post by ${fmtDate(today)}`,
      note: "Use our prepaid Royal Mail Special Delivery label."
    });
    steps.push({
      label: "Arrives at workshop",
      date: fmtDate(arrivalDate)
    });
    steps.push({
      label: "We repair",
      date: tl,
      note: "Status updates by SMS at each stage."
    });
  }
  if (returnDate) {
    steps.push({
      label: delivery === "walkin" ? "Ready to collect" : "Returned to you",
      date: fmtDate(returnDate),
      note: delivery === "walkin" ? "We'll text when it's ready — pop in any time before 6pm." : "Tracked return delivery, signed-for.",
      final: true
    });
  }
  return steps;
}

// ── DeliveryCard ──────────────────────────────────────────────────────────
function QWDeliveryCard({
  id,
  active,
  onSelect,
  title,
  subtitle,
  price,
  badge
}) {
  return /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qw-delivery-card" + (active ? " active" : ""),
    onClick: onSelect
  }, badge && /*#__PURE__*/React.createElement("span", {
    className: "qw-delivery-badge"
  }, badge), /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-radio"
  }, /*#__PURE__*/React.createElement("span", null)), /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-title"
  }, title), /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-sub"
  }, subtitle)), /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-price"
  }, price));
}

// ── ServiceMapper ─────────────────────────────────────────────────────────
function ServiceMapper({
  model,
  fault,
  issue,
  repairPrice,
  requiresDiagnosis,
  onSubmit
}) {
  const [postcode, setPostcode] = React.useState("");
  const [delivery, setDelivery] = React.useState(null);
  const [walkInDate, setWalkInDate] = React.useState(null);
  const [walkInTime, setWalkInTime] = React.useState(null);
  const [courierDate, setCourierDate] = React.useState(null);
  const [courierWindow, setCourierWindow] = React.useState(null);
  const [turnaround, setTurnaround] = React.useState("standard");
  const [nudgeTarget, setNudgeTarget] = React.useState(null);
  const nudgeRef = React.useRef(null);
  const zone = classifyPostcode(postcode);
  const londonOk = isLondonPostcode(postcode);
  const postcodeKnown = zone === "london" || zone === "uk";
  const availableServices = zone === "london" ? ["walkin", "courier", "mail"] : zone === "uk" ? ["walkin", "mail"] : [];
  const effectiveDelivery = delivery === "courier" && postcodeKnown && !londonOk ? "mail" : delivery;
  const courierFee = effectiveDelivery === "courier" && londonOk ? CFG.COURIER_FEE : 0;
  const mailFee = effectiveDelivery === "mail" ? CFG.NEXT_DAY_COURIER_FEE : 0;
  const fastFee = turnaround === "fast" ? CFG.FAST_TURNAROUND_FEE : 0;
  const total = repairPrice != null ? repairPrice + courierFee + mailFee + fastFee : null;
  const today = new Date();
  const collectionDate = effectiveDelivery === "courier" ? courierDate ? new Date(courierDate) : nextWorkingDay(today) : null;
  const arrivalDate = effectiveDelivery === "mail" ? addWorkingDays(today, 2) : null;
  const serviceStartDate = effectiveDelivery === "walkin" && walkInDate ? new Date(walkInDate) : effectiveDelivery === "courier" ? collectionDate : effectiveDelivery === "mail" ? arrivalDate : null;
  const computeReturn = (start, days) => start ? nextWorkingDay(addWorkingDays(start, days)) : null;
  const standardReturnDate = computeReturn(serviceStartDate, 2);
  const fastReturnDate = computeReturn(serviceStartDate, 1);
  const returnDate = turnaround === "fast" ? fastReturnDate : standardReturnDate;
  const canSubmit = !!delivery && (delivery !== "courier" || londonOk && courierDate && courierWindow) && (delivery !== "walkin" || walkInDate && walkInTime);
  const nextAction = (() => {
    if (!postcodeKnown) return {
      label: "Enter postcode to continue",
      target: "qw-postcode"
    };
    if (!delivery) return {
      label: "Pick a service to continue",
      target: "qw-delivery-section"
    };
    if (delivery === "walkin" && !walkInDate) return {
      label: "Pick a day to continue",
      target: "qw-walkin-dates"
    };
    if (delivery === "walkin" && !walkInTime) return {
      label: "Pick a time to continue",
      target: "qw-walkin-times"
    };
    if (delivery === "courier" && !courierDate) return {
      label: "Pick a collection day",
      target: "qw-courier-dates"
    };
    if (delivery === "courier" && !courierWindow) return {
      label: "Pick a collection window",
      target: "qw-courier-windows"
    };
    return null;
  })();
  const ctaLabel = nextAction ? nextAction.label : requiresDiagnosis ? "Continue to checkout · Free diagnosis" : `Continue to checkout · £${total}`;
  const handleDisabledTap = () => {
    if (canSubmit) return;
    if (nextAction?.target) {
      const el = document.getElementById(nextAction.target);
      if (el) {
        el.scrollIntoView({
          behavior: "smooth",
          block: "center"
        });
        setNudgeTarget(nextAction.target);
        clearTimeout(nudgeRef.current);
        nudgeRef.current = setTimeout(() => setNudgeTarget(null), 1600);
      }
    }
  };
  const handleSubmit = e => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit({
      model,
      fault,
      issue,
      postcode: postcode.trim().toUpperCase(),
      zone,
      delivery: effectiveDelivery,
      walkInDate: effectiveDelivery === "walkin" ? walkInDate : null,
      walkInTime: effectiveDelivery === "walkin" ? walkInTime : null,
      courierDate: effectiveDelivery === "courier" ? courierDate : null,
      courierWindow: effectiveDelivery === "courier" ? courierWindow : null,
      turnaround,
      repairPrice,
      courierFee,
      mailFee,
      fastFee,
      total,
      estimatedReturn: returnDate ? returnDate.toISOString() : null
    });
  };
  const bp = {
    postcode: postcodeKnown,
    service: !!delivery,
    dateTime: delivery === "mail" ? true : delivery === "walkin" ? !!(walkInDate && walkInTime) : delivery === "courier" ? !!(courierDate && courierWindow) : false
  };
  // Timeline shows whenever enough info is gathered — regardless of whether a price exists
  const showTimeline = postcodeKnown && returnDate && (delivery === "walkin" && walkInDate || delivery === "courier" && londonOk && courierDate || delivery === "mail");
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-bp"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-step" + (bp.postcode ? " done" : " current")
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-num"
  }, bp.postcode ? "✓" : "1"), /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-label"
  }, "Postcode")), /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-step" + (bp.service ? " done" : bp.postcode ? " current" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-num"
  }, bp.service ? "✓" : "2"), /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-label"
  }, "Service")), /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-step" + (bp.dateTime ? " done" : bp.service ? " current" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-num"
  }, bp.dateTime ? "✓" : "3"), /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-label"
  }, delivery === "mail" ? "Ready" : "Date & time")), /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-line"
  }), /*#__PURE__*/React.createElement("div", {
    className: "qw-bp-step" + (canSubmit ? " current" : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-num"
  }, "4"), /*#__PURE__*/React.createElement("span", {
    className: "qw-bp-label"
  }, "Checkout"))), /*#__PURE__*/React.createElement("div", {
    className: "qw-postcode-card" + (postcodeKnown ? " qw-postcode-card-resolved" : "")
  }, /*#__PURE__*/React.createElement("label", {
    className: "qw-postcode-label",
    htmlFor: "qw-postcode"
  }, "See when you'll get it back", /*#__PURE__*/React.createElement("span", {
    className: "qw-postcode-hint"
  }, "Enter your postcode for delivery options and a real return-by date.")), /*#__PURE__*/React.createElement("div", {
    className: "qw-postcode-row"
  }, /*#__PURE__*/React.createElement("input", {
    id: "qw-postcode",
    className: "qw-postcode-input",
    placeholder: "e.g. W1W 8JQ",
    autoComplete: "postal-code",
    value: postcode,
    onChange: e => setPostcode(e.target.value)
  })), zone === "international" && /*#__PURE__*/React.createElement("div", {
    className: "qw-postcode-warn"
  }, /*#__PURE__*/React.createElement("strong", null, "Looks like a non-UK postcode."), " We currently ship within the UK only \u2014 you can still ", /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qw-postcode-link",
    onClick: () => {
      setPostcode("");
      setDelivery("walkin");
    }
  }, "walk in to our Fitzrovia workshop"), "."), !postcodeKnown && zone !== "international" && /*#__PURE__*/React.createElement("ul", {
    className: "qw-postcode-unlocks"
  }, /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2713"), " Walk in ", /*#__PURE__*/React.createElement("span", {
    className: "qw-postcode-unlocks-meta"
  }, "(free)")), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2713"), " Same-day London courier"), /*#__PURE__*/React.createElement("li", null, /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true"
  }, "\u2713"), " Next-day UK courier"))), postcodeKnown && /*#__PURE__*/React.createElement("div", {
    id: "qw-delivery-section",
    className: "qw-delivery-grid" + (nudgeTarget === "qw-delivery-section" ? " qw-nudge" : "")
  }, /*#__PURE__*/React.createElement(QWDeliveryCard, {
    id: "walkin",
    active: delivery === "walkin",
    onSelect: () => setDelivery("walkin"),
    title: "Walk in",
    subtitle: CFG.WORKSHOP_ADDRESS,
    price: "Free"
  }), availableServices.includes("courier") && /*#__PURE__*/React.createElement(QWDeliveryCard, {
    id: "courier",
    active: delivery === "courier",
    onSelect: () => setDelivery("courier"),
    title: "Same-day courier",
    subtitle: "London only \xB7 door-to-door",
    price: "+£" + CFG.COURIER_FEE,
    badge: "Popular"
  }), /*#__PURE__*/React.createElement(QWDeliveryCard, {
    id: "mail",
    active: delivery === "mail",
    onSelect: () => setDelivery("mail"),
    title: "Next-day courier",
    subtitle: "Pre-paid kit \xB7 UK-wide",
    price: "+£" + CFG.NEXT_DAY_COURIER_FEE
  })), delivery === "walkin" && /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-section-label"
  }, "Pick a day & time"), /*#__PURE__*/React.createElement("div", {
    id: "qw-walkin-dates",
    className: "qw-date-grid" + (nudgeTarget === "qw-walkin-dates" ? " qw-nudge" : "")
  }, upcomingWorkingDates(8).map((d, i) => {
    const sel = walkInDate && d.toDateString() === new Date(walkInDate).toDateString();
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "qw-date-btn" + (sel ? " active" : ""),
      onClick: () => setWalkInDate(d.toISOString())
    }, /*#__PURE__*/React.createElement("span", {
      className: "qw-date-dow"
    }, d.toLocaleDateString("en-GB", {
      weekday: "short"
    })), /*#__PURE__*/React.createElement("span", {
      className: "qw-date-day"
    }, d.getDate()), /*#__PURE__*/React.createElement("span", {
      className: "qw-date-mon"
    }, d.toLocaleDateString("en-GB", {
      month: "short"
    })));
  })), walkInDate && /*#__PURE__*/React.createElement("div", {
    id: "qw-walkin-times",
    className: "qw-time-grid" + (nudgeTarget === "qw-walkin-times" ? " qw-nudge" : "")
  }, CFG.WALK_IN_TIMES.map(slot => /*#__PURE__*/React.createElement("button", {
    key: slot.time,
    type: "button",
    disabled: slot.full,
    className: "qw-time-btn" + (walkInTime === slot.time ? " active" : "") + (slot.full ? " full" : ""),
    onClick: () => !slot.full && setWalkInTime(slot.time)
  }, slot.time, slot.full && /*#__PURE__*/React.createElement("span", {
    className: "qw-slot-full"
  }, "Full"))))), delivery === "courier" && londonOk && /*#__PURE__*/React.createElement("div", {
    className: "qw-delivery-detail"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-courier-confirm"
  }, "\u2713 Same-day courier available for ", /*#__PURE__*/React.createElement("strong", null, postcode.toUpperCase()), " \xB7 \xA3", CFG.COURIER_FEE, " \xB7 full address at checkout."), /*#__PURE__*/React.createElement("div", {
    className: "qw-section-label"
  }, "Pick a collection day"), /*#__PURE__*/React.createElement("div", {
    id: "qw-courier-dates",
    className: "qw-date-grid" + (nudgeTarget === "qw-courier-dates" ? " qw-nudge" : "")
  }, upcomingWorkingDates(8).map((d, i) => {
    const sel = courierDate && d.toDateString() === new Date(courierDate).toDateString();
    return /*#__PURE__*/React.createElement("button", {
      key: i,
      type: "button",
      className: "qw-date-btn" + (sel ? " active" : ""),
      onClick: () => setCourierDate(d.toISOString())
    }, /*#__PURE__*/React.createElement("span", {
      className: "qw-date-dow"
    }, d.toLocaleDateString("en-GB", {
      weekday: "short"
    })), /*#__PURE__*/React.createElement("span", {
      className: "qw-date-day"
    }, d.getDate()), /*#__PURE__*/React.createElement("span", {
      className: "qw-date-mon"
    }, d.toLocaleDateString("en-GB", {
      month: "short"
    })));
  })), courierDate && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "qw-section-label qw-section-label-sub"
  }, "Pick a 3-hour collection window"), /*#__PURE__*/React.createElement("div", {
    id: "qw-courier-windows",
    className: "qw-window-grid" + (nudgeTarget === "qw-courier-windows" ? " qw-nudge" : "")
  }, CFG.COURIER_WINDOWS.map(w => /*#__PURE__*/React.createElement("button", {
    key: w.id,
    type: "button",
    className: "qw-window-btn" + (courierWindow === w.id ? " active" : ""),
    onClick: () => setCourierWindow(w.id)
  }, w.label))))), postcodeKnown && delivery && /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-section-label"
  }, "Repair turnaround"), /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-grid"
  }, /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qw-turnaround-card" + (turnaround === "standard" ? " active" : ""),
    onClick: () => setTurnaround("standard")
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-title"
  }, "Standard"), /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-meta"
  }, "1\u20132 working days"), repairPrice != null && /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-price-corner",
    style: {
      position: 'static',
      marginTop: 4,
      fontSize: 13
    }
  }, "Included"), standardReturnDate && /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-eta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-turnaround-eta-label"
  }, "Ready by"), /*#__PURE__*/React.createElement("span", {
    className: "qw-turnaround-eta-date"
  }, fmtDate(standardReturnDate)))), /*#__PURE__*/React.createElement("button", {
    type: "button",
    className: "qw-turnaround-card" + (turnaround === "fast" ? " active" : ""),
    onClick: () => setTurnaround("fast")
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-turnaround-badge"
  }, "Faster"), /*#__PURE__*/React.createElement("span", {
    className: "qw-turnaround-price-corner"
  }, "+\xA3", CFG.FAST_TURNAROUND_FEE), /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-title"
  }, "Fast"), /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-meta"
  }, "Same or next working day"), fastReturnDate && /*#__PURE__*/React.createElement("div", {
    className: "qw-turnaround-eta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "qw-turnaround-eta-label"
  }, "Ready by"), /*#__PURE__*/React.createElement("span", {
    className: "qw-turnaround-eta-date"
  }, fmtDate(fastReturnDate)))))), showTimeline && /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline",
    role: "list"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-section-label"
  }, "Your repair timeline"), /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-promise"
  }, "Booking reserves your part and the workshop slot \u2014 these dates become a guarantee.")), /*#__PURE__*/React.createElement("ol", {
    className: "qw-timeline-steps"
  }, buildTimeline({
    delivery,
    walkInDate,
    walkInTime,
    courierDate,
    courierWindow,
    arrivalDate,
    today,
    returnDate,
    turnaround
  }).map((s, i) => /*#__PURE__*/React.createElement("li", {
    key: i,
    className: "qw-timeline-step" + (s.final ? " qw-timeline-step-final" : ""),
    role: "listitem"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-marker"
  }, s.final ? "✓" : i + 1), /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-label"
  }, s.label), /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-date"
  }, s.date), s.note && /*#__PURE__*/React.createElement("div", {
    className: "qw-timeline-note"
  }, s.note)))))), /*#__PURE__*/React.createElement("button", {
    type: canSubmit ? "submit" : "button",
    onClick: canSubmit ? undefined : handleDisabledTap,
    className: "qw-btn qw-btn-lg " + (canSubmit ? "qw-btn-dark" : "qw-btn-prompt"),
    style: {
      width: "100%",
      marginTop: 12
    }
  }, ctaLabel), /*#__PURE__*/React.createElement("p", {
    className: "qw-fineprint"
  }, "You'll add your details and pay securely on the next step."));
}

// Export to window
Object.assign(window, {
  ServiceMapper,
  QWDeliveryCard
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "qw/ServiceMapper.jsx", error: String((e && e.message) || e) }); }

// qw/data.js
try { (() => {
// ═══════════════════════════════════════════════════════════════════════════
//  iCorrect Quote Wizard — Device / Model / Fault / Troubleshoot Data
//  Source: icorrect-shopify-theme repo (icorrect-quote-wizard-final.html)
// ═══════════════════════════════════════════════════════════════════════════

window.QW_DEVICES = [{
  id: "iphone",
  name: "iPhone",
  svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="1" width="12" height="22" rx="2.5"/><path d="M10 19h4"/></svg>'
}, {
  id: "macbook",
  name: "MacBook",
  svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="3" width="20" height="14" rx="2"/><path d="M2 17h20M8 21h8M12 17v4"/></svg>'
}, {
  id: "ipad",
  name: "iPad",
  svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="4" y="2" width="16" height="20" rx="2"/><path d="M10 18h4"/></svg>'
}, {
  id: "watch",
  name: "Watch",
  svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="6" y="4" width="12" height="16" rx="6"/><path d="M9 1h6M9 23h6"/></svg>'
}];

// ── MODELS: grouped by device, each group has sub-groups ──────────────────
window.QW_MODELS = {
  macbook: [{
    group: "MacBook Pro 16\"",
    models: [{
      name: "MacBook Pro 16\" M4 Pro/Max A3186/A3403 (2024)",
      year: "2024"
    }, {
      name: "MacBook Pro 16\" M3 Pro/Max A2991 (2023)",
      year: "2023"
    }, {
      name: "MacBook Pro 16\" M2 Pro/Max A2780 (2023)",
      year: "2023"
    }, {
      name: "MacBook Pro 16\" M1 Pro/Max A2485 (2021)",
      year: "2021"
    }, {
      name: "MacBook Pro 16\" A2141 (2019)",
      year: "2019"
    }, {
      name: "MacBook Pro 15\" A1990 (2018–2019)",
      year: "2018"
    }]
  }, {
    group: "MacBook Pro 14\"",
    models: [{
      name: "MacBook Pro 14\" M4 Pro/Max A3112/A3185/A3401 (2024)",
      year: "2024"
    }, {
      name: "MacBook Pro 14\" M3 Pro/Max A2918/A2992 (2023)",
      year: "2023"
    }, {
      name: "MacBook Pro 14\" M2 Pro/Max A2779 (2023)",
      year: "2023"
    }, {
      name: "MacBook Pro 14\" M1 Pro/Max A2442 (2021)",
      year: "2021"
    }]
  }, {
    group: "MacBook Pro 13\"",
    models: [{
      name: "MacBook Pro 13\" M2 A2338 (2022)",
      year: "2022"
    }, {
      name: "MacBook Pro 13\" M1 A2338 (2020)",
      year: "2020"
    }, {
      name: "MacBook Pro 13\" A2251 (2020)",
      year: "2020"
    }, {
      name: "MacBook Pro 13\" A2289 (2020)",
      year: "2020"
    }, {
      name: "MacBook Pro 13\" A2159 (2019)",
      year: "2019"
    }, {
      name: "MacBook Pro 13\" A1989 (2018–2019)",
      year: "2018"
    }]
  }, {
    group: "MacBook Air 15\"",
    models: [{
      name: "MacBook Air 15\" M4 A3241 (2025)",
      year: "2025"
    }, {
      name: "MacBook Air 15\" M3 A3114 (2024)",
      year: "2024"
    }, {
      name: "MacBook Air 15\" M2 A2941 (2023)",
      year: "2023"
    }]
  }, {
    group: "MacBook Air 13\"",
    models: [{
      name: "MacBook Air 13\" M4 A3240 (2025)",
      year: "2025"
    }, {
      name: "MacBook Air 13\" M3 A3113 (2024)",
      year: "2024"
    }, {
      name: "MacBook Air 13\" M2 A2681 (2022)",
      year: "2022"
    }, {
      name: "MacBook Air 13\" M1 A2337 (2020)",
      year: "2020"
    }, {
      name: "MacBook Air 13\" A2179 (2020)",
      year: "2020"
    }, {
      name: "MacBook Air 13\" A1932 (2018–2019)",
      year: "2018"
    }]
  }],
  iphone: [{
    group: "iPhone 16 series",
    models: [{
      name: "iPhone 16 Pro Max",
      year: "2024"
    }, {
      name: "iPhone 16 Pro",
      year: "2024"
    }, {
      name: "iPhone 16 Plus",
      year: "2024"
    }, {
      name: "iPhone 16",
      year: "2024"
    }, {
      name: "iPhone 16e",
      year: "2025"
    }]
  }, {
    group: "iPhone 15 series",
    models: [{
      name: "iPhone 15 Pro Max",
      year: "2023"
    }, {
      name: "iPhone 15 Pro",
      year: "2023"
    }, {
      name: "iPhone 15 Plus",
      year: "2023"
    }, {
      name: "iPhone 15",
      year: "2023"
    }]
  }, {
    group: "iPhone 14 series",
    models: [{
      name: "iPhone 14 Pro Max",
      year: "2022"
    }, {
      name: "iPhone 14 Pro",
      year: "2022"
    }, {
      name: "iPhone 14 Plus",
      year: "2022"
    }, {
      name: "iPhone 14",
      year: "2022"
    }]
  }, {
    group: "iPhone 13 series",
    models: [{
      name: "iPhone 13 Pro Max",
      year: "2021"
    }, {
      name: "iPhone 13 Pro",
      year: "2021"
    }, {
      name: "iPhone 13",
      year: "2021"
    }, {
      name: "iPhone 13 Mini",
      year: "2021"
    }]
  }, {
    group: "iPhone 12 & older",
    models: [{
      name: "iPhone SE 3rd Gen (2022)",
      year: "2022"
    }, {
      name: "iPhone 12 Pro Max",
      year: "2020"
    }, {
      name: "iPhone 12 Pro",
      year: "2020"
    }, {
      name: "iPhone 12",
      year: "2020"
    }, {
      name: "iPhone 12 Mini",
      year: "2020"
    }, {
      name: "iPhone SE 2nd Gen (2020)",
      year: "2020"
    }, {
      name: "iPhone 11 Pro Max",
      year: "2019"
    }, {
      name: "iPhone 11 Pro",
      year: "2019"
    }, {
      name: "iPhone 11",
      year: "2019"
    }]
  }],
  ipad: [{
    group: "iPad Pro",
    models: [{
      name: "iPad Pro 13\" M4 (2024)",
      year: "2024"
    }, {
      name: "iPad Pro 12.9\" 6th Gen M2 (2022)",
      year: "2022"
    }, {
      name: "iPad Pro 12.9\" 5th Gen M1 (2021)",
      year: "2021"
    }, {
      name: "iPad Pro 12.9\" 4th Gen (2020)",
      year: "2020"
    }, {
      name: "iPad Pro 12.9\" 3rd Gen (2018)",
      year: "2018"
    }, {
      name: "iPad Pro 11\" M4 (2024)",
      year: "2024"
    }, {
      name: "iPad Pro 11\" 4th Gen M2 (2022)",
      year: "2022"
    }, {
      name: "iPad Pro 11\" 3rd Gen M1 (2021)",
      year: "2021"
    }, {
      name: "iPad Pro 11\" 2nd Gen (2020)",
      year: "2020"
    }, {
      name: "iPad Pro 11\" 1st Gen (2018)",
      year: "2018"
    }]
  }, {
    group: "iPad Air",
    models: [{
      name: "iPad Air 13\" 7th Gen M3 (2025)",
      year: "2025"
    }, {
      name: "iPad Air 11\" 7th Gen M3 (2025)",
      year: "2025"
    }, {
      name: "iPad Air 13\" M2 (2024)",
      year: "2024"
    }, {
      name: "iPad Air 11\" M2 (2024)",
      year: "2024"
    }, {
      name: "iPad Air 5th Gen (2022)",
      year: "2022"
    }, {
      name: "iPad Air 4th Gen (2020)",
      year: "2020"
    }]
  }, {
    group: "iPad + iPad Mini",
    models: [{
      name: "iPad 11th Gen (2025)",
      year: "2025"
    }, {
      name: "iPad 10th Gen (2022)",
      year: "2022"
    }, {
      name: "iPad 9th Gen (2021)",
      year: "2021"
    }, {
      name: "iPad 8th Gen (2020)",
      year: "2020"
    }, {
      name: "iPad 7th Gen (2019)",
      year: "2019"
    }, {
      name: "iPad Mini 7 (2024)",
      year: "2024"
    }, {
      name: "iPad Mini 6 (2021)",
      year: "2021"
    }, {
      name: "iPad Mini 5 (2019)",
      year: "2019"
    }]
  }],
  watch: [{
    group: "Apple Watch Ultra",
    models: [{
      name: "Apple Watch Ultra 2",
      year: "2023"
    }, {
      name: "Apple Watch Ultra",
      year: "2022"
    }]
  }, {
    group: "Apple Watch Series",
    models: [{
      name: "Apple Watch Series 10 46mm",
      year: "2024"
    }, {
      name: "Apple Watch Series 10 42mm",
      year: "2024"
    }, {
      name: "Apple Watch Series 9 45mm",
      year: "2023"
    }, {
      name: "Apple Watch Series 9 41mm",
      year: "2023"
    }, {
      name: "Apple Watch Series 8 45mm",
      year: "2022"
    }, {
      name: "Apple Watch Series 8 41mm",
      year: "2022"
    }, {
      name: "Apple Watch Series 7 45mm",
      year: "2021"
    }, {
      name: "Apple Watch Series 7 41mm",
      year: "2021"
    }, {
      name: "Apple Watch Series 6 44mm",
      year: "2020"
    }, {
      name: "Apple Watch Series 6 40mm",
      year: "2020"
    }, {
      name: "Apple Watch Series 5 44mm",
      year: "2019"
    }, {
      name: "Apple Watch Series 5 40mm",
      year: "2019"
    }]
  }, {
    group: "Apple Watch SE",
    models: [{
      name: "Apple Watch SE 2nd Gen 44mm",
      year: "2022"
    }, {
      name: "Apple Watch SE 2nd Gen 40mm",
      year: "2022"
    }, {
      name: "Apple Watch SE 1st Gen 44mm",
      year: "2020"
    }, {
      name: "Apple Watch SE 1st Gen 40mm",
      year: "2020"
    }]
  }]
};

// ── FAULT CATEGORIES per device type ──────────────────────────────────────
window.QW_FAULTS = {
  macbook: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "keyboard",
    label: "Trackpad / Keyboard",
    icon: "keyboard"
  }, {
    id: "audio",
    label: "Audio / Mic / Speaker",
    icon: "audio"
  }, {
    id: "wifi",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "data",
    label: "Data Recovery",
    icon: "data"
  }, {
    id: "other",
    label: "Other",
    icon: "other"
  }],
  iphone: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "glass",
    label: "Rear Glass",
    icon: "glass"
  }, {
    id: "camera",
    label: "Camera",
    icon: "camera"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "audio",
    label: "Audio / Mic / Speaker",
    icon: "audio"
  }, {
    id: "wifi",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "data",
    label: "Data Recovery",
    icon: "data"
  }, {
    id: "other",
    label: "Other",
    icon: "other"
  }],
  ipad: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "audio",
    label: "Audio / Mic / Speaker",
    icon: "audio"
  }, {
    id: "wifi",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "data",
    label: "Data Recovery",
    icon: "data"
  }, {
    id: "other",
    label: "Other",
    icon: "other"
  }],
  watch: [{
    id: "screen",
    label: "Screen / Display",
    icon: "screen"
  }, {
    id: "glass",
    label: "Rear Glass",
    icon: "glass"
  }, {
    id: "battery",
    label: "Power / Battery / Charging",
    icon: "battery"
  }, {
    id: "wifi",
    label: "Connectivity",
    icon: "wifi"
  }, {
    id: "water",
    label: "Water Damage",
    icon: "water"
  }, {
    id: "other",
    label: "Other",
    icon: "other"
  }]
};

// ── TROUBLESHOOT: specific issues per device + fault ──────────────────────
window.QW_ISSUES = {
  macbook: {
    "Screen / Display": [{
      label: "Lines or artifacts",
      hint: "Display cable or LCD panel issue."
    }, {
      label: "Dead pixels",
      hint: "Pixel failure, may need panel replacement."
    }, {
      label: "Black screen",
      hint: "Could be display, GPU, or logic board."
    }, {
      label: "Backlight fading (Flexgate)",
      hint: "Known flex cable issue on certain Pro models."
    }, {
      label: "Cracked or shattered glass",
      hint: "Full display assembly replacement."
    }, {
      label: "Dust under glass",
      hint: "Delamination or debris, display replacement."
    }],
    "Power / Battery / Charging": [{
      label: "Won't turn on",
      hint: "Could be battery, logic board, or charging circuit."
    }, {
      label: "Won't charge past a certain %",
      hint: "Degraded battery, replacement needed."
    }, {
      label: "Battery swollen",
      hint: "Stop using immediately. Battery replacement."
    }, {
      label: "Random shutdowns",
      hint: "Failing battery or thermal issue."
    }, {
      label: "Charger not recognised",
      hint: "Charging port or logic board."
    }],
    "Trackpad / Keyboard": [{
      label: "Keys not responding",
      hint: "Common on butterfly keyboards, may need top case."
    }, {
      label: "Sticky or stuck keys",
      hint: "Debris or mechanism failure."
    }, {
      label: "Trackpad not clicking",
      hint: "Could be swollen battery or trackpad failure."
    }, {
      label: "Ghost typing",
      hint: "Liquid damage or flex cable."
    }],
    "Audio / Mic / Speaker": [{
      label: "No sound",
      hint: "Speaker or audio circuit."
    }, {
      label: "Crackling audio",
      hint: "Speaker cone damage or software."
    }, {
      label: "Mic not working",
      hint: "Mic module or flex cable."
    }],
    "Connectivity": [{
      label: "WiFi dropping",
      hint: "Antenna cable or WiFi module."
    }, {
      label: "Bluetooth issues",
      hint: "Module or antenna."
    }, {
      label: "USB-C ports dead",
      hint: "Port damage or logic board."
    }],
    "Water Damage": [{
      label: "Spilled liquid",
      hint: "Needs professional diagnostic."
    }, {
      label: "Won't turn on after spill",
      hint: "Corrosion likely, ultrasonic cleaning."
    }, {
      label: "Partial failure after spill",
      hint: "Diagnostic needed."
    }],
    "Data Recovery": [{
      label: "Drive not mounting",
      hint: "SSD or logic board."
    }, {
      label: "Accidental deletion",
      hint: "Recovery depends on drive type."
    }, {
      label: "Drive failing",
      hint: "Specialist recovery."
    }],
    "Other": [{
      label: "Overheating",
      hint: "Fan, thermal paste, or airflow."
    }, {
      label: "Slow performance",
      hint: "Software, RAM, or storage."
    }, {
      label: "Something else",
      hint: "Tell us more below."
    }]
  },
  iphone: {
    "Screen / Display": [{
      label: "Cracked glass (touch works)",
      hint: "Screen replacement with genuine parts."
    }, {
      label: "Touch not responding",
      hint: "Digitiser failure, screen replacement."
    }, {
      label: "Lines or discolouration",
      hint: "Panel damage, display replacement."
    }, {
      label: "Black screen (still vibrates)",
      hint: "Display connection or panel."
    }, {
      label: "Green line",
      hint: "Known OLED fault, display replacement."
    }],
    "Rear Glass": [{
      label: "Cracked back glass",
      hint: "Rear glass replacement."
    }, {
      label: "Camera lens cracked",
      hint: "Lens cover replacement."
    }],
    "Camera": [{
      label: "Blurry photos",
      hint: "OIS failure or lens damage."
    }, {
      label: "Camera black",
      hint: "Camera module or flex cable."
    }, {
      label: "Front camera / Face ID",
      hint: "Front module repair."
    }],
    "Power / Battery / Charging": [{
      label: "Drains fast",
      hint: "Battery degraded, replacement recommended."
    }, {
      label: "Won't charge",
      hint: "Port, cable, or battery."
    }, {
      label: "Random shutoffs",
      hint: "Battery or power management."
    }, {
      label: "Swollen battery",
      hint: "Stop using. Battery replacement."
    }],
    "Audio / Mic / Speaker": [{
      label: "No sound",
      hint: "Speaker module replacement."
    }, {
      label: "Mic not working",
      hint: "Mic or flex cable."
    }, {
      label: "Earpiece quiet",
      hint: "Earpiece replacement."
    }],
    "Connectivity": [{
      label: "No signal",
      hint: "Antenna or baseband."
    }, {
      label: "WiFi greyed out",
      hint: "WiFi IC or antenna."
    }, {
      label: "Bluetooth issues",
      hint: "Module or antenna."
    }],
    "Water Damage": [{
      label: "Dropped in liquid",
      hint: "Professional diagnostic needed."
    }, {
      label: "Partial failure after water",
      hint: "Diagnostic required."
    }],
    "Data Recovery": [{
      label: "Phone dead, need data",
      hint: "Board-level repair may be needed."
    }, {
      label: "Forgotten passcode",
      hint: "Limited options, we can advise."
    }],
    "Other": [{
      label: "Vibration not working",
      hint: "Taptic engine replacement."
    }, {
      label: "SIM issues",
      hint: "Tray or software."
    }, {
      label: "Something else",
      hint: "Tell us more."
    }]
  },
  ipad: {
    "Screen / Display": [{
      label: "Cracked glass",
      hint: "Digitiser or display replacement."
    }, {
      label: "Touch not responding",
      hint: "Screen replacement."
    }, {
      label: "Lines or dead areas",
      hint: "Panel damage."
    }, {
      label: "Black screen",
      hint: "Display or logic board."
    }],
    "Power / Battery / Charging": [{
      label: "Won't charge",
      hint: "Port or battery."
    }, {
      label: "Drains fast",
      hint: "Battery replacement."
    }, {
      label: "Won't turn on",
      hint: "Battery or logic board."
    }],
    "Audio / Mic / Speaker": [{
      label: "No sound",
      hint: "Speaker module."
    }, {
      label: "Mic dead",
      hint: "Flex cable or module."
    }],
    "Connectivity": [{
      label: "WiFi issues",
      hint: "Antenna or module."
    }, {
      label: "Bluetooth issues",
      hint: "Antenna or chip."
    }],
    "Water Damage": [{
      label: "Liquid exposure",
      hint: "Diagnostic required."
    }],
    "Data Recovery": [{
      label: "Need data from broken iPad",
      hint: "Diagnostic needed."
    }],
    "Other": [{
      label: "Home button / Touch ID",
      hint: "Button or flex cable."
    }, {
      label: "Something else",
      hint: "Tell us more."
    }]
  },
  watch: {
    "Screen / Display": [{
      label: "Cracked screen",
      hint: "Display replacement."
    }, {
      label: "Display dead",
      hint: "Screen or connection."
    }],
    "Rear Glass": [{
      label: "Cracked back crystal",
      hint: "Sensor crystal replacement."
    }],
    "Power / Battery / Charging": [{
      label: "Won't charge",
      hint: "Coil or battery."
    }, {
      label: "Drains fast",
      hint: "Battery replacement."
    }, {
      label: "Won't turn on",
      hint: "Battery or logic board."
    }],
    "Connectivity": [{
      label: "Bluetooth issues",
      hint: "Module or antenna."
    }, {
      label: "WiFi issues",
      hint: "Antenna."
    }],
    "Water Damage": [{
      label: "Water ingress",
      hint: "Seal failure, diagnostic needed."
    }],
    "Other": [{
      label: "Digital Crown stuck",
      hint: "Cleaning or replacement."
    }, {
      label: "Something else",
      hint: "Tell us more."
    }]
  }
};

// ── FAULT ICON SVGs ───────────────────────────────────────────────────────
window.QW_FAULT_ICONS = {
  screen: "M4 6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6zM8 21h8M12 17v4",
  glass: "M5 2h14v20H5zM5 14h14",
  camera: "M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2zM12 13a4 4 0 1 0 0-8 4 4 0 0 0 0 8z",
  battery: "M13 2L3 14h9l-1 8 10-12h-9l1-8",
  keyboard: "M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7zM8 11h0M12 11h0M16 11h0M8 15h8",
  audio: "M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3zM19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8",
  wifi: "M5 12.55a11 11 0 0 1 14.08 0M1.42 9a16 16 0 0 1 21.16 0M8.53 16.11a6 6 0 0 1 6.95 0M12 20h.01",
  water: "M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z",
  data: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  other: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"
};

// ── SERVICE CONFIG ────────────────────────────────────────────────────────
window.QW_SERVICE_CONFIG = {
  COURIER_FEE: 20,
  NEXT_DAY_COURIER_FEE: 24,
  FAST_TURNAROUND_FEE: 79,
  WORKSHOP_ADDRESS: "12 Margaret St, Fitzrovia W1W 8JQ",
  LONDON_POSTCODES: ["E", "EC", "N", "NW", "SE", "SW", "W", "WC"],
  UK_BANK_HOLIDAYS: ["2026-01-01", "2026-04-03", "2026-04-06", "2026-05-04", "2026-05-25", "2026-08-31", "2026-12-25", "2026-12-28", "2027-01-01", "2027-03-26", "2027-03-29", "2027-05-03", "2027-05-31", "2027-08-30", "2027-12-27", "2027-12-28"],
  WALK_IN_TIMES: [{
    time: "10:00",
    full: false
  }, {
    time: "11:00",
    full: false
  }, {
    time: "12:00",
    full: true
  }, {
    time: "13:00",
    full: false
  }, {
    time: "14:00",
    full: false
  }, {
    time: "15:00",
    full: true
  }, {
    time: "16:00",
    full: false
  }, {
    time: "17:00",
    full: false
  }],
  COURIER_WINDOWS: [{
    id: "morn",
    label: "9:00 – 12:00"
  }, {
    id: "mid",
    label: "12:00 – 15:00"
  }, {
    id: "aft",
    label: "15:00 – 18:00"
  }]
};
})(); } catch (e) { __ds_ns.__errors.push({ path: "qw/data.js", error: String((e && e.message) || e) }); }

// ui_kits/website/Components.jsx
try { (() => {
// iCorrect UI Kit — Primitives, Nav, Hero, Trust band.
// Near-monochrome Geist system. Icons are inline line-SVG (1.5 stroke, round joins).

/* ----------------------------------------------------------------------- */
/* Icons — hand-authored, currentColor, 22–24px box                        */
/* ----------------------------------------------------------------------- */
const Icons = {
  chip: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "6",
    y: "6",
    width: "10",
    height: "10",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8.5 4.5V2M11 4.5V2M13.5 4.5V2M8.5 20V17.5M11 20V17.5M13.5 20V17.5M4.5 8.5H2M4.5 11H2M4.5 13.5H2M20 8.5H17.5M20 11H17.5M20 13.5H17.5"
  })),
  shield: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M11 2.5l7 2.5v6c0 4.2-3 7.5-7 9-4-1.5-7-4.8-7-9v-6l7-2.5z"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 11l2.2 2.2L14.5 9"
  })),
  display: /*#__PURE__*/React.createElement("svg", {
    width: "22",
    height: "22",
    viewBox: "0 0 22 22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5",
    strokeLinejoin: "round"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2.5",
    y: "3.5",
    width: "17",
    height: "11",
    rx: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M8 18.5h6M11 14.5v4"
  })),
  walkIn: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
  })),
  courier: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "1",
    y: "6",
    width: "22",
    height: "12",
    rx: "2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2M12 12v.01"
  })),
  mail: /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    width: "22",
    height: "22",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.5"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M21 8V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2h14a2 2 0 002-2v-2"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M16 2v4M8 2v4M3 10h18"
  }))
};
function Star({
  size = 13
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 14 14",
    fill: "currentColor",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M7 1l1.8 3.8 4.2.6-3 2.9.7 4.1L7 10.5 3.3 12.4l.7-4.1-3-2.9 4.2-.6z"
  }));
}
function Stars({
  rating = 4.8,
  size = 14
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "kit-stars",
    "aria-label": `${rating} out of 5`,
    style: {
      display: "inline-flex",
      gap: 2,
      color: "var(--ic-star)"
    }
  }, [0, 1, 2, 3, 4].map(i => /*#__PURE__*/React.createElement(Star, {
    key: i,
    size: size
  })));
}

/* ----------------------------------------------------------------------- */
/* Buttons — .btn family from primitives.css                                */
/* ----------------------------------------------------------------------- */
function Button({
  variant = "dark",
  size,
  children,
  href = "#",
  arrow,
  onClick
}) {
  const cls = ["btn", `btn-${variant}`, size && `btn-${size}`].filter(Boolean).join(" ");
  return /*#__PURE__*/React.createElement("a", {
    className: cls,
    href: href,
    onClick: onClick
  }, children, arrow && /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)"
    }
  }, "\u2192"));
}

/* ----------------------------------------------------------------------- */
/* Status pill — the "Open · Fitzrovia" indicator                           */
/* ----------------------------------------------------------------------- */
function StatusPill({
  children = "Open · Fitzrovia"
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "hp-status"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " ", children);
}

/* ----------------------------------------------------------------------- */
/* Nav                                                                      */
/* ----------------------------------------------------------------------- */
function Nav() {
  return /*#__PURE__*/React.createElement("nav", {
    className: "hp-nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-nav-inner"
  }, /*#__PURE__*/React.createElement("a", {
    className: "hp-logo",
    href: "#"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo-mark"
  }, "iC"), "iCorrect"), /*#__PURE__*/React.createElement("div", {
    className: "hp-nav-links"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Diagnostic"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Specialist"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "How it works"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Workshop")), /*#__PURE__*/React.createElement(StatusPill, null), /*#__PURE__*/React.createElement("a", {
    href: "#wizard",
    className: "hp-nav-cta"
  }, "Get a quote \u2192")));
}

/* ----------------------------------------------------------------------- */
/* Hero — proof-forward variant (the flagship)                              */
/* ----------------------------------------------------------------------- */
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-hero hp-hero-v2"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-hero-grid"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-eyebrow"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot"
  }), " Real case \xB7 April 2026"), /*#__PURE__*/React.createElement("h1", null, "We repair what they can't."), /*#__PURE__*/React.createElement("p", {
    className: "hp-hero-sub"
  }, "When Apple says \"logic board, \xA31,400\" we say \"backlight IC, \xA3380.\" Microsoldering is what we do \u2014 it's why other repair shops send their tough jobs to us."), /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-cta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#wizard",
    className: "hp-cta hp-cta-primary"
  }, "Get a quote ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "hp-cta hp-cta-secondary"
  }, "Help me diagnose ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192"))), /*#__PURE__*/React.createElement("div", {
    className: "hp-hero-trust"
  }, /*#__PURE__*/React.createElement(Stars, {
    rating: 4.9,
    size: 13
  }), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "4.9"), " \xB7 719 Google reviews"), /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "\xB7"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("strong", null, "2-year"), " warranty"))), /*#__PURE__*/React.createElement("div", {
    className: "proof-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-card-image"
  }, /*#__PURE__*/React.createElement("img", {
    className: "proof-photo",
    src: "../../assets/backlight-repair.jpg",
    alt: "The MacBook backlight circuit we repaired \u2014 driver IC and coils"
  }), /*#__PURE__*/React.createElement("span", {
    className: "proof-card-tag success"
  }, "Fixed \xB7 4 days")), /*#__PURE__*/React.createElement("div", {
    className: "proof-card-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "proof-card-quote"
  }, "\"Apple quoted \xA31,400 for a full logic-board swap. We microsoldered the failed backlight IC and returned it in four days.\""), /*#__PURE__*/React.createElement("div", {
    className: "proof-card-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-card-stat strike"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-label"
  }, "Apple quote"), /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-value"
  }, "\xA31,400")), /*#__PURE__*/React.createElement("div", {
    className: "proof-card-stat fix"
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-label"
  }, "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "proof-card-stat-value"
  }, "\xA3380")))))));
}

/* ----------------------------------------------------------------------- */
/* Trust band — 4-up #fafafa card with icon tiles                           */
/* ----------------------------------------------------------------------- */
function TrustItem({
  icon,
  title,
  sub
}) {
  return /*#__PURE__*/React.createElement("li", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: "8px 14px",
      position: "relative"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: "absolute",
      left: 0,
      top: "14%",
      bottom: "14%",
      width: 1,
      background: "rgba(0,0,0,0.08)"
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      width: 36,
      height: 36,
      borderRadius: 8,
      background: "#fff",
      boxShadow: "0 0 0 1px rgba(0,0,0,0.08)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#171717",
      flexShrink: 0
    }
  }, icon), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 2,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      font: "600 13px var(--font-sans)",
      letterSpacing: "-0.2px",
      color: "#171717",
      lineHeight: 1.25
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px/1.35 var(--font-sans)",
      color: "#666"
    }
  }, sub)));
}
function TrustBand({
  reviewCount = 719,
  rating = 4.9
}) {
  return /*#__PURE__*/React.createElement("section", {
    className: "trust-band",
    style: {
      padding: "20px 0 28px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("ul", {
    className: "trust-band-inner",
    role: "list",
    style: {
      listStyle: "none",
      margin: 0,
      padding: 18,
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: 8,
      background: "#fafafa",
      borderRadius: 14,
      boxShadow: "0 0 0 1px rgba(0,0,0,0.06)",
      alignItems: "stretch"
    }
  }, /*#__PURE__*/React.createElement("li", {
    style: {
      display: "flex",
      gap: 12,
      alignItems: "center",
      padding: "8px 14px 8px 6px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      font: "600 30px var(--font-sans)",
      letterSpacing: "-1.2px",
      color: "#171717",
      fontFeatureSettings: '"tnum"',
      lineHeight: 1
    }
  }, rating), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 4,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Stars, {
    rating: rating
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      font: "400 12px var(--font-sans)",
      color: "#666",
      whiteSpace: "nowrap"
    }
  }, reviewCount, " Google reviews"))), /*#__PURE__*/React.createElement(TrustItem, {
    icon: Icons.display,
    title: "Apple parts",
    sub: "Calibrated in-house"
  }), /*#__PURE__*/React.createElement(TrustItem, {
    icon: Icons.chip,
    title: "Microsoldering",
    sub: "Board-level repairs"
  }), /*#__PURE__*/React.createElement(TrustItem, {
    icon: Icons.shield,
    title: "2-yr warranty",
    sub: "Double the standard"
  }))));
}
Object.assign(window, {
  Icons,
  Star,
  Stars,
  Button,
  StatusPill,
  Nav,
  Hero,
  TrustItem,
  TrustBand
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Components.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Sections.jsx
try { (() => {
// iCorrect UI Kit — Page sections. All classes come from homepage.css.

/* ===== Proof cases — real bench photography, before/after pricing ===== */
const PROOF_CASES = [{
  img: "../../assets/repair-scope.jpg",
  tag: "Apple: write-off",
  swatch: "var(--ic-orange)",
  meta: 'MBP 14" · A2442 · 4 days',
  quote: '"Backlight IC failure — exactly the chip Apple\'s logic-board swap covers up. We replaced it under the scope. Same Mac. Different bill."',
  nums: [["Apple quote", "£1,400", "strike"], ["iCorrect", "£380", "win"], ["Saving", "73%", ""]],
  caseNo: "Case #2026-0418"
}, {
  img: "../../assets/repair-boardview.jpg",
  tag: "Two weeks in rice",
  swatch: "var(--ic-orange)",
  meta: 'MBA 13" · liquid · 6 days',
  quote: '"Coffee, then a fortnight of denial. We pulled the board, ultrasonic\'d it, recovered the data, and reflowed three corroded IC pads."',
  nums: [["Recovered", "100%", "win"], ["Repair", "£420", ""]],
  caseNo: "Case #2026-0331"
}, {
  img: "../../assets/repair-teardown.jpg",
  tag: '"Unfixable" elsewhere',
  swatch: "var(--ic-blue)",
  meta: 'MBP 13" · Touch ID · 2 days',
  quote: '"Touch ID dead after a third-party screen swap. Two shops gave up. We repaired the T2 pairing trace — back to fingerprint unlock."',
  nums: [["Functional", "Yes", "win"], ["Repair", "£190", ""]],
  caseNo: "Case #2026-0402"
}];
function ProofSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-proof",
    id: "proof"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-proof-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Proof \xB7 what Apple won't touch"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "The repairs other shops send to us.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "Real cases from the bench, last 90 days. Boards, not stock photos. Prices, not promises.")), /*#__PURE__*/React.createElement("div", {
    className: "proof-grid"
  }, PROOF_CASES.map((c, i) => /*#__PURE__*/React.createElement("article", {
    key: i,
    className: "proof-case" + (i ? ` hp-reveal hp-reveal-d${i}` : "")
  }, /*#__PURE__*/React.createElement("div", {
    className: "proof-case-img"
  }, /*#__PURE__*/React.createElement("img", {
    className: "proof-photo",
    src: c.img,
    alt: c.meta
  }), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-tag"
  }, c.tag), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "swatch",
    style: {
      background: c.swatch
    }
  }), c.meta)), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-body"
  }, /*#__PURE__*/React.createElement("p", {
    className: "proof-case-quote"
  }, c.quote), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-numbers"
  }, c.nums.map(([label, val, mod], j) => /*#__PURE__*/React.createElement("div", {
    key: j,
    className: "proof-case-num" + (mod ? " " + mod : "")
  }, /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-label"
  }, label), /*#__PURE__*/React.createElement("span", {
    className: "proof-case-num-value"
  }, val)))), /*#__PURE__*/React.createElement("div", {
    className: "proof-case-foot"
  }, /*#__PURE__*/React.createElement("span", null, c.caseNo), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Read repair log \u2192"))))))));
}

/* ===== Pricing confidence — fixed list + dark Apple comparison ===== */
function PricingSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-priceconf"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Pricing"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "The quote is the price. No surprises.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "We don't lowball to get you through the door and then discover \"additional damage.\" If diagnosis reveals something unexpected, we call you before touching anything.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-card hp-priceconf-card-main"
  }, [["Fixed-price repairs", "Screen, battery, rear glass — priced by model, not by mood."], ["Free pre-diagnosis", "15 minutes on the scope. Written quote before any work. Walk away for free."], ["No hidden fees", "Parts, labour, calibration, QA, and a 2-year warranty included."]].map(([l, v], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-priceconf-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-label"
  }, l), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-value"
  }, v)))), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare-head"
  }, /*#__PURE__*/React.createElement("span", null, "Why we're different from Apple")), [["Backlight IC failure", "Apple: £1,400 (full board swap)", "iCorrect: £380 (chip replacement)"], ['MacBook Pro 14" screen', "Apple: £669", "iCorrect: £449"]].map(([label, theirs, ours], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-priceconf-row-compare"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-label"
  }, label), /*#__PURE__*/React.createElement("div", {
    className: "hp-priceconf-compare-prices"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-theirs"
  }, theirs), /*#__PURE__*/React.createElement("span", {
    className: "hp-priceconf-compare-ours"
  }, ours))))))));
}

/* ===== London access — three routes in ===== */
function AccessSection() {
  const paths = [{
    icon: Icons.walkIn,
    title: "Walk in",
    detail: "12 Margaret Street, Fitzrovia W1W 8JQ",
    meta: "Free · Mon–Fri · No appointment",
    body: "Opposite The London Palladium. Free diagnosis while you wait. Most repairs same- or next-day."
  }, {
    icon: Icons.courier,
    title: "Same-day courier",
    detail: "London postcodes only",
    meta: "+ £20 · Collected within 3 hours",
    body: "We send a tracked courier to your door. On the bench the same day, returned as soon as it's done."
  }, {
    icon: Icons.mail,
    title: "UK-wide mail-in",
    detail: "Pre-paid tracked shipping",
    meta: "+ £24 · Next-day collection kit",
    body: "We send a pre-paid, insured kit. Post it, we repair it, we courier it back. Same warranty, same quality."
  }];
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-access"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Getting your device to us"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "Three ways in. One standard of repair.")), /*#__PURE__*/React.createElement("p", {
    className: "hp-section-lede"
  }, "Walk in from Oxford Circus, send a London courier, or post it from anywhere in the UK. Same bench, same parts, same warranty.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-access-grid"
  }, paths.map((p, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-access-card hp-reveal hp-reveal-d" + (i + 1)
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-access-icon"
  }, p.icon), /*#__PURE__*/React.createElement("h3", {
    className: "hp-access-title"
  }, p.title), /*#__PURE__*/React.createElement("div", {
    className: "hp-access-detail"
  }, p.detail), /*#__PURE__*/React.createElement("div", {
    className: "hp-access-meta"
  }, p.meta), /*#__PURE__*/React.createElement("p", {
    className: "hp-access-body"
  }, p.body))))));
}

/* ===== Corporate — the dark band ===== */
function CorporateSection() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-corporate"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-corporate-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-text"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow",
    style: {
      color: "#a3a3a3"
    }
  }, "Specialist & Corporate"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-corporate-title"
  }, "When it's business-critical,", /*#__PURE__*/React.createElement("br", null), "skip the queue."), /*#__PURE__*/React.createElement("p", {
    className: "hp-corporate-body"
  }, "Time-sensitive data recovery. Fleet repairs on retainer. The device Apple said was a write-off that your board presentation lives on. We handle the cases other shops won't touch."), /*#__PURE__*/React.createElement("ul", {
    className: "hp-corporate-list"
  }, /*#__PURE__*/React.createElement("li", null, "Priority bench slot \u2014 same-day or next-day turnaround"), /*#__PURE__*/React.createElement("li", null, "Dedicated technician, not a call centre"), /*#__PURE__*/React.createElement("li", null, "NDA, audit trail, GDPR-compliant handling"), /*#__PURE__*/React.createElement("li", null, "Fleet pricing for 5+ devices")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "hp-corporate-cta"
  }, "Talk to a specialist \u2192")), /*#__PURE__*/React.createElement("div", {
    className: "hp-corporate-aside"
  }, [["94%", 'Data recovered from "dead" Macs in 2025'], ["4 h", "Average turnaround on priority bench repairs"], ["NDA", "Signed on request for every corporate job"]].map(([num, label], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-corporate-stat hp-reveal hp-reveal-d" + (i + 1)
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-num"
  }, num), /*#__PURE__*/React.createElement("span", {
    className: "hp-corporate-stat-label"
  }, label))))));
}

/* ===== FAQ accordion ===== */
const FAQ_ITEMS = [["How long does a repair take?", "Most screen and battery repairs are done in 1–2 working days. Walk in before 11am with a common repair and same-day is usually possible. Board-level work takes 3–5 days."], ["Are the parts genuine Apple?", "Yes. Original Apple displays and batteries — not aftermarket \"compatible\" parts. Every screen is True Tone calibrated in-house. That's why we warrant them for two years."], ["Is my data safe?", "Completely. Screen and battery repairs don't touch your storage. For board-level work your device stays on an isolated bench — it never connects to our network. NDAs on request."], ["What does the 2-year warranty cover?", "Every part we fit and the labour to install it. If anything we touched fails inside 24 months, we fix it free — no diagnostic fee, no negotiation."], ["What if Apple says it's unfixable?", "That's what we specialise in. \"Unfixable\" usually means a full logic-board replacement they won't do at chip level. We do. Bring it in or send it over — we'll scope it for free."]];
function FAQ() {
  const [open, setOpen] = React.useState(0);
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-section hp-faq",
    id: "faq"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-faq-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-faq-left"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-section-eyebrow"
  }, "Frequently asked"), /*#__PURE__*/React.createElement("h2", {
    className: "hp-section-title"
  }, "Questions, answered honestly."), /*#__PURE__*/React.createElement("p", {
    style: {
      font: "400 16px/1.55 var(--font-sans)",
      color: "#4d4d4d",
      marginTop: 16,
      textWrap: "pretty"
    }
  }, "If your question isn't here, call ", /*#__PURE__*/React.createElement("a", {
    href: "tel:+442070998517",
    style: {
      color: "#171717",
      fontWeight: 500
    }
  }, "+44 (0)207 099 8517"), " or drop in.")), /*#__PURE__*/React.createElement("div", {
    className: "hp-faq-right"
  }, FAQ_ITEMS.map(([q, a], i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    className: "hp-faq-item" + (open === i ? " is-open" : "")
  }, /*#__PURE__*/React.createElement("button", {
    className: "hp-faq-q",
    onClick: () => setOpen(open === i ? -1 : i)
  }, /*#__PURE__*/React.createElement("span", null, q), /*#__PURE__*/React.createElement("span", {
    className: "hp-faq-icon",
    "aria-hidden": "true"
  }, "+")), open === i && /*#__PURE__*/React.createElement("div", {
    className: "hp-faq-a"
  }, a))))));
}

/* ===== Final CTA + Footer ===== */
function FinalCTA() {
  return /*#__PURE__*/React.createElement("section", {
    className: "hp-finalcta"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-finalcta-inner"
  }, /*#__PURE__*/React.createElement("h2", null, "Ready to get it fixed?"), /*#__PURE__*/React.createElement("p", null, "Tell us your device and the symptom. See your price in 60 seconds \u2014 or let us diagnose it for free."), /*#__PURE__*/React.createElement("div", {
    className: "hp-finalcta-row"
  }, /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "hp-cta hp-cta-primary hp-cta-lg"
  }, "Get a quote ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")), /*#__PURE__*/React.createElement("a", {
    href: "#",
    className: "hp-cta hp-cta-secondary hp-cta-lg"
  }, "Help me diagnose ", /*#__PURE__*/React.createElement("span", {
    className: "arrow"
  }, "\u2192")))));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    className: "hp-footer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "container hp-footer-inner"
  }, /*#__PURE__*/React.createElement("div", {
    className: "hp-footer-brand"
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo",
    style: {
      color: "#fff",
      pointerEvents: "none"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "hp-logo-mark",
    style: {
      background: "#fff",
      color: "#171717"
    }
  }, "iC"), "iCorrect"), /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-tag"
  }, "Apple repair specialists \xB7 Fitzrovia, London")), /*#__PURE__*/React.createElement("div", {
    className: "hp-footer-cols"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-col-title"
  }, "Repairs"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "iPhone"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "MacBook"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "iPad"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Apple Watch")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-col-title"
  }, "Company"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Why us"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Corporate"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "How it works"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Contact")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("span", {
    className: "hp-footer-col-title"
  }, "Legal"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Warranty"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Privacy"), /*#__PURE__*/React.createElement("a", {
    href: "#"
  }, "Terms")))), /*#__PURE__*/React.createElement("div", {
    className: "container hp-footer-base"
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 2026 iCorrect Ltd. Not affiliated with Apple Inc."), /*#__PURE__*/React.createElement("span", null, "Company No. 09392844 \xB7 VAT GB 203495788")));
}
Object.assign(window, {
  ProofSection,
  PricingSection,
  AccessSection,
  CorporateSection,
  FAQ,
  FinalCTA,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Sections.jsx", error: String((e && e.message) || e) }); }

// ui_kits/workshop-os/QueueBoard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// WorkshopOS — Repair Queue Control Room. Composed from the design system's app components.
// Resolved lazily at render time: the design-system bundle may still be compiling
// on a first load, and a top-level destructure would capture undefined.
const DS = () => window.ICorrectDesignSystem_ddcb23 || {};
const TECHS = ["Safan", "Andres", "Misha", "Priya"];
const SEED = {
  unallocated: [{
    id: "IC-4815",
    customer: "M. Whitfield",
    device: "MacBook Pro 15in",
    model: "A2681",
    type: "Board diagnostic",
    due: "Thu 4pm",
    std: "1:08"
  }, {
    id: "IC-4816",
    customer: "R. Okonkwo",
    device: "iPhone 13",
    model: "A2482",
    type: "Screen",
    due: "Wed 6pm",
    std: "0:25"
  }, {
    id: "IC-4817",
    customer: "P. Grieve",
    device: "MacBook Air 13in",
    model: "A2337",
    type: "Battery",
    due: "Fri 1pm",
    std: "0:50"
  }],
  Safan: [{
    id: "IC-4802",
    customer: "A. Perreault",
    device: "MacBook Pro 15in",
    model: "A2681",
    type: "Board diagnostic",
    state: "active",
    elapsed: "0:42",
    std: "1:08",
    progress: 62,
    eta: "11:10",
    flags: ["Express"]
  }, {
    id: "IC-4806",
    customer: "J. Aldridge",
    device: "iPad Pro 11in",
    model: "A2759",
    type: "Glass",
    state: "ready",
    std: "1:20"
  }, {
    id: "IC-4809",
    customer: "T. Bhatti",
    device: "iPhone 14",
    model: "A2882",
    type: "Screen",
    state: "ready",
    std: "0:25"
  }],
  Andres: [{
    id: "IC-4804",
    customer: "H. Lindqvist",
    device: "iPhone 13",
    model: "A2482",
    type: "Screen",
    state: "active",
    elapsed: "0:11",
    std: "0:25",
    progress: 44,
    eta: "10:05"
  }, {
    id: "IC-4808",
    customer: "C. Nwosu",
    device: "MacBook Air 13in",
    model: "A2337",
    type: "Battery",
    state: "ready",
    std: "0:50"
  }],
  Priya: [],
  Misha: [{
    id: "IC-4801",
    customer: "D. Farrow",
    device: "MacBook Pro 15in",
    model: "A2141",
    type: "Board diagnostic",
    state: "blocked",
    reason: "awaiting part",
    std: "2:10"
  }, {
    id: "IC-4811",
    customer: "S. Vance",
    device: "iMac 24in",
    model: "A2438",
    type: "Diagnostic",
    state: "atRisk",
    due: "Wed 5pm",
    std: "1:40"
  }]
};

// Hands-on hours scheduled today. Misha carries 2 jobs but only 1.7h counts —
// her blocked board diagnostic is excluded from capacity, per the spec.
// Priya is off today: no jobs, no hours.
const HOURS = {
  Safan: 6.2,
  Andres: 7.4,
  Misha: 1.7,
  Priya: 0
};
const INITIALS = {
  Safan: "SF",
  Andres: "AN",
  Misha: "MI",
  Priya: "PR"
};
function TechColumn({
  name,
  jobs,
  editable,
  onDrop,
  onDragOver,
  onPick,
  dragging
}) {
  const {
    JobCard
  } = DS();
  const ready = jobs.filter(j => j.state === "ready").length;
  const low = ready < 2;
  const off = jobs.length === 0;
  return /*#__PURE__*/React.createElement("div", {
    onDragOver: onDragOver,
    onDrop: onDrop,
    style: {
      flex: "1 0 214px",
      minWidth: 214,
      background: off ? "transparent" : "#fff",
      boxShadow: dragging ? "#0072f5 0 0 0 2px" : off ? "rgba(0,0,0,0.06) 0 0 0 1px" : "rgba(0,0,0,0.08) 0 0 0 1px",
      borderRadius: 12,
      padding: 12,
      display: "flex",
      flexDirection: "column",
      gap: 8,
      minHeight: 220,
      transition: "box-shadow 140ms"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "2px 2px 10px",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 8,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 22,
      height: 22,
      borderRadius: 9999,
      background: off ? "#f1f1f1" : "#171717",
      color: off ? "#a3a3a3" : "#fff",
      fontFamily: "var(--font-mono)",
      fontSize: 9,
      fontWeight: 700,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0
    }
  }, INITIALS[name]), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13.5,
      fontWeight: 600,
      letterSpacing: "-0.2px",
      color: off ? "#a3a3a3" : "#171717"
    }
  }, name)), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      whiteSpace: "nowrap",
      color: off ? "#a3a3a3" : low ? "#a96a00" : "#666"
    }
  }, off ? "off today" : `ready ${ready}/2${low ? " \u26A0" : ""}`)), off ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "#a3a3a3",
      textAlign: "center",
      padding: "24px 0",
      lineHeight: 1.5
    }
  }, "Off today.", /*#__PURE__*/React.createElement("br", null), "Any jobs here need reassigning.") : jobs.map((j, i) => /*#__PURE__*/React.createElement(JobCard, _extends({
    key: j.id
  }, j, {
    queueNo: i + 1,
    standard: j.std,
    tech: INITIALS[name],
    draggable: editable,
    onDragStart: e => onPick(e, j, name)
  }))));
}
function QueueBoard() {
  const {
    NavRail,
    AppTopBar,
    Segmented,
    JobCard,
    DockPanel,
    CapacityMeter
  } = DS();
  const [cols, setCols] = React.useState(SEED);
  const [mode, setMode] = React.useState("Edit");
  const [lens, setLens] = React.useState("Board");
  const [over, setOver] = React.useState(null);
  const [clock, setClock] = React.useState("10:42");
  const held = React.useRef(null);
  const editable = mode === "Edit";
  React.useEffect(() => {
    const t = setInterval(() => {
      const d = new Date();
      setClock(`${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`);
    }, 15000);
    return () => clearInterval(t);
  }, []);
  const pick = (e, job, from) => {
    held.current = {
      job,
      from
    };
    e.dataTransfer.effectAllowed = "move";
  };
  const allow = key => e => {
    if (editable && held.current) {
      e.preventDefault();
      setOver(key);
    }
  };
  const drop = to => e => {
    e.preventDefault();
    setOver(null);
    const h = held.current;
    if (!h || h.from === to) return;
    setCols(c => {
      const next = {
        ...c
      };
      next[h.from] = c[h.from].filter(j => j.id !== h.job.id);
      const moved = {
        ...h.job
      };
      if (to !== "unallocated") {
        delete moved.due;
        moved.state = moved.state || "ready";
      } else {
        delete moved.state;
        delete moved.elapsed;
        delete moved.progress;
        delete moved.eta;
      }
      next[to] = [...c[to], moved];
      return next;
    });
    held.current = null;
  };
  const blocked = TECHS.flatMap(t => cols[t].filter(j => j.state === "blocked" || j.state === "atRisk").map(j => ({
    ...j,
    tech: t
  })));
  if (!NavRail) {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 40,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        color: "#4d4d4d"
      }
    }, "Design-system bundle not loaded yet \u2014 reload once ", /*#__PURE__*/React.createElement("code", null, "_ds_bundle.js"), " has compiled.");
  }
  return /*#__PURE__*/React.createElement("div", {
    style: {
      height: "100vh",
      display: "flex",
      overflow: "hidden",
      background: "#fafafa",
      color: "#171717"
    }
  }, /*#__PURE__*/React.createElement(NavRail, {
    active: "queue",
    user: "RN"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden"
    }
  }, /*#__PURE__*/React.createElement(AppTopBar, {
    eyebrow: "Lane M \xB7 Repair queue",
    title: "Wed 18 June",
    onPrev: () => {},
    onNext: () => {},
    clock: clock
  }, /*#__PURE__*/React.createElement(Segmented, {
    options: ["Day", "Week"],
    value: "Day",
    onChange: () => {}
  }), /*#__PURE__*/React.createElement(Segmented, {
    options: ["Board", "Timeline"],
    value: lens,
    onChange: setLens
  }), /*#__PURE__*/React.createElement(Segmented, {
    options: ["Edit", "Wallboard", "My queue"],
    value: mode,
    onChange: setMode,
    tone: "dark"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      overflow: "auto",
      padding: "18px 22px"
    }
  }, lens === "Timeline" ? /*#__PURE__*/React.createElement("div", {
    style: {
      background: "#fff",
      boxShadow: "rgba(0,0,0,0.08) 0 0 0 1px",
      borderRadius: 12,
      padding: 40,
      textAlign: "center",
      color: "#a3a3a3",
      fontSize: 13
    }
  }, "Timeline lens \u2014 not designed yet. The spec fixes it as tech lanes across the day with a now-line and deadline markers.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
      minHeight: "100%"
    }
  }, editable ? /*#__PURE__*/React.createElement("div", {
    style: {
      width: 248,
      flexShrink: 0,
      display: "flex",
      flexDirection: "column",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(DockPanel, {
    title: "Unallocated",
    dot: "#0072f5",
    count: `${cols.unallocated.length} waiting`,
    note: "Needs assigning to a tech \u2014 drag onto a column",
    onDragOver: allow("unallocated"),
    onDrop: drop("unallocated")
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, cols.unallocated.map(j => /*#__PURE__*/React.createElement(JobCard, _extends({
    key: j.id
  }, j, {
    standard: j.std,
    draggable: true,
    onDragStart: e => pick(e, j, "unallocated")
  }))), cols.unallocated.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "#a3a3a3",
      textAlign: "center",
      padding: "6px 0"
    }
  }, "Everything placed.") : null)), /*#__PURE__*/React.createElement(DockPanel, {
    title: "Blocked \xB7 at-risk",
    dot: "#C73838"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, blocked.map(j => /*#__PURE__*/React.createElement("div", {
    key: j.id,
    style: {
      background: "#fafafa",
      borderRadius: 8,
      padding: "9px 10px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 500
    }
  }, j.device), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 10,
      color: j.state === "blocked" ? "#C73838" : "#a96a00",
      whiteSpace: "nowrap"
    }
  }, j.state === "blocked" ? "blocked" : "at risk")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "#666",
      marginTop: 2
    }
  }, j.reason || `Promise ${j.due}`, " \xB7 ", j.tech))), blocked.length === 0 ? /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "#a3a3a3",
      textAlign: "center",
      padding: "6px 0"
    }
  }, "Nothing blocked. Floor is clear.") : null)), /*#__PURE__*/React.createElement(DockPanel, {
    title: "Today \xB7 hands-on load",
    tone: "dark"
  }, /*#__PURE__*/React.createElement(CapacityMeter, {
    techs: TECHS.map(t => ({
      name: t,
      hours: HOURS[t]
    }))
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--font-mono)",
      fontSize: 9.5,
      lineHeight: 1.5,
      color: "#666",
      marginTop: 2
    }
  }, "Blocked jobs excluded"))) : null, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 0,
      display: "flex",
      gap: 14,
      alignItems: "flex-start",
      overflowX: "auto",
      paddingBottom: 6
    }
  }, (mode === "My queue" ? ["Safan"] : TECHS).map(t => /*#__PURE__*/React.createElement(TechColumn, {
    key: t,
    name: t,
    jobs: cols[t],
    editable: editable,
    dragging: over === t,
    onPick: pick,
    onDragOver: allow(t),
    onDrop: drop(t)
  })))))));
}
Object.assign(window, {
  QueueBoard,
  TechColumn
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/workshop-os/QueueBoard.jsx", error: String((e && e.message) || e) }); }

__ds_ns.AppTopBar = __ds_scope.AppTopBar;

__ds_ns.CapacityMeter = __ds_scope.CapacityMeter;

__ds_ns.DockPanel = __ds_scope.DockPanel;

__ds_ns.JobCard = __ds_scope.JobCard;

__ds_ns.NavRail = __ds_scope.NavRail;

__ds_ns.Segmented = __ds_scope.Segmented;

__ds_ns.StatePill = __ds_scope.StatePill;

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Logo = __ds_scope.Logo;

__ds_ns.MonoLabel = __ds_scope.MonoLabel;

__ds_ns.Stars = __ds_scope.Stars;

__ds_ns.StatusPill = __ds_scope.StatusPill;

__ds_ns.FaqItem = __ds_scope.FaqItem;

__ds_ns.ProductTile = __ds_scope.ProductTile;

__ds_ns.ProofCard = __ds_scope.ProofCard;

__ds_ns.SectionHead = __ds_scope.SectionHead;

__ds_ns.StickyCta = __ds_scope.StickyCta;

__ds_ns.TrustBand = __ds_scope.TrustBand;

__ds_ns.Breadcrumbs = __ds_scope.Breadcrumbs;

__ds_ns.Nav = __ds_scope.Nav;

})();
