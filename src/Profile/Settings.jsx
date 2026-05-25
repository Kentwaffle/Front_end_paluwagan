import React from "react";
import { useEffect, useState } from "react";
import { Sun, Moon, ChevronLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";

function Settings() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(() => {
    const savedTheme = localStorage.getItem("theme");
    return savedTheme === "dark";
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <div className="min-h-screen">
      <button
        className="p-2 bg-white dark:bg-slate-900 shadow-sm rounded-xl text-slate-600"
        onClick={() => navigate("/profile")}
      >
        <ChevronLeft />
      </button>
      <div className="my-3 flex flex-col bg-white shadow-sm rounded-2xl p-5 dark:bg-slate-900">
        <span className="text-xl font-extrabold mb-3 text-slate-800 dark:text-slate-100">
          Settings
        </span>
        <div className="flex items-center justify-between p-4  bg-white dark:bg-slate-800 rounded-2xl border border-sky-100 dark:border-slate-800 shadow-sm shadow-sky-100/50 dark:shadow-none transition-all">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sky-50 dark:bg-slate-700 rounded-lg text-sky-500">
              {isDark ? <Moon size={18} /> : <Sun size={18} />}
            </div>
            <div className="flex flex-col">
              <span className="text-slate-800 dark:text-slate-100 font-bold text-sm tracking-tight">
                Dark Mode
              </span>
              <span className="text-[10px] uppercase tracking-widest text-sky-400 font-semibold">
                Appearance
              </span>
            </div>
          </div>

          <input
            type="checkbox"
            className="toggle border-sky-400 bg-white checked:bg-sky-500 checked:border-sky-500 [--tglbg:theme(colors.sky.100)] checked:[--tglbg:theme(colors.white)]"
            checked={isDark}
            onChange={() => setIsDark(!isDark)}
          />
        </div>
      </div>
    </div>
  );
}

export default Settings;
