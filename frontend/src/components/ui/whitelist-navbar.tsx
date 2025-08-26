"use client";

import { cn } from "@/lib/utils";

const WhitelistNavigationBar = ({
  activeView,
  onSelectView,
}: {
  activeView: string;
  onSelectView: (view: string) => void;
}) => {
  const views = ["Form", "Whitelist"];

  return (
    <nav className="w-full max-w-3xl px-6 py-3">
      <ul className="flex gap-6 list-none m-0 p-0">
        {views.map((view) => (
          <li key={view}>
            <button
              onClick={() => onSelectView(view)}
              className={cn(
                "relative pb-1 text-base min-w-[110px] text-center transition-colors",
                activeView === view
                  ? "text-blue-500 font-semibold border-b-2 border-blue-500"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {view}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default WhitelistNavigationBar;
