const themeScript = `(function(){try{const theme=localStorage.getItem("school.theme");const shouldUseDark=theme==="dark"||(!theme&&window.matchMedia("(prefers-color-scheme: dark)").matches);document.documentElement.classList.toggle("dark",shouldUseDark);}catch(error){}})();`;

export function ThemeScript() {
  return (
    <script
      id="theme-script"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: themeScript }}
    />
  );
}
