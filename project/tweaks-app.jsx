const NMSRC_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "#2f4a6b",
  "paper": "#f4f1ea",
  "displayFont": "Source Serif 4",
  "baseSize": 17,
  "heroStyle": "field"
}/*EDITMODE-END*/;

const ACCENT_INK = {
  "#2f4a6b": "#21384f",  // academic blue
  "#7a2e2a": "#5e211e",  // brick red
  "#2f5a44": "#214031",  // forest green
  "#3b3a36": "#211f1c",  // graphite mono
  "#6b4a86": "#4f3563"   // plum
};

const PAPER_2 = {
  "#f4f1ea": "#ebe7dd",  // warm
  "#f2f1ee": "#e7e5df",  // cool grey
  "#faf7f0": "#efe9dc",  // ivory
  "#ffffff": "#f0efeb"   // bright
};

function NmsrcTweaks() {
  const [t, setTweak] = useTweaks(NMSRC_DEFAULTS);

  React.useEffect(() => {
    const r = document.documentElement.style;
    r.setProperty("--accent", t.accent);
    r.setProperty("--accent-ink", ACCENT_INK[t.accent] || t.accent);
    r.setProperty("--paper", t.paper);
    r.setProperty("--paper-2", PAPER_2[t.paper] || t.paper);
    r.setProperty("--serif", `"${t.displayFont}", Georgia, "Times New Roman", serif`);
    document.body.style.fontSize = t.baseSize + "px";
    const hero = document.querySelector(".hero");
    if (hero) hero.setAttribute("data-hero", t.heroStyle);
  }, [t.accent, t.paper, t.displayFont, t.baseSize, t.heroStyle]);

  return (
    <TweaksPanel title="Tweaks">
      <TweakSection label="Homepage" />
      <TweakRadio label="Hero emphasis" value={t.heroStyle}
        options={["field", "accent", "unified"]}
        onChange={(v) => setTweak("heroStyle", v)} />

      <TweakSection label="Color" />
      <TweakColor label="Accent" value={t.accent}
        options={Object.keys(ACCENT_INK)}
        onChange={(v) => setTweak("accent", v)} />
      <TweakColor label="Paper" value={t.paper}
        options={Object.keys(PAPER_2)}
        onChange={(v) => setTweak("paper", v)} />

      <TweakSection label="Typography" />
      <TweakRadio label="Display font" value={t.displayFont}
        options={["Source Serif 4", "Source Sans 3"]}
        onChange={(v) => setTweak("displayFont", v)} />
      <TweakSlider label="Base text size" value={t.baseSize}
        min={15} max={20} step={1} unit="px"
        onChange={(v) => setTweak("baseSize", v)} />
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<NmsrcTweaks />);
