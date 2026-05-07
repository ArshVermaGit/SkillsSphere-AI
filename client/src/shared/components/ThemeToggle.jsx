import { useEffect, useState } from "react";

const ThemeToggle = () => {
  const [darkMode, setDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem("skillssphere.theme") || "dark";

    const isDark = savedTheme === "dark";

    setDarkMode(isDark);

    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = darkMode ? "light" : "dark";

    setDarkMode(!darkMode);

    localStorage.setItem("skillssphere.theme", newTheme);

    if (newTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="
        fixed top-4 right-4 z-50
        px-4 py-2 rounded-lg
        bg-surface text-text-main
        dark:bg-surface dark:text-text-main
        bg-white text-black
        border border-gray-300
        shadow-md
        transition-all duration-300
      "
    >
      {darkMode ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
};

export default ThemeToggle;