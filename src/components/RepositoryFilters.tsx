import { motion } from "framer-motion";
import type { FilterOption, SortOption } from "@/types/github";

interface RepositoryFiltersProps {
  filter: FilterOption;
  setFilter: (f: FilterOption) => void;
  sort: SortOption;
  setSort: (s: SortOption) => void;
  language: string;
  setLanguage: (l: string) => void;
  availableLanguages: string[];
}

export function RepositoryFilters({
  filter,
  setFilter,
  sort,
  setSort,
  language,
  setLanguage,
  availableLanguages,
}: RepositoryFiltersProps) {
  const filters: { label: string; value: FilterOption }[] = [
    { label: "All", value: "all" },
    { label: "Public", value: "public" },
    { label: "Private", value: "private" },
    { label: "Forked", value: "forked" },
  ];

  const sorts: { label: string; value: SortOption }[] = [
    { label: "Recently Updated", value: "updated" },
    { label: "Stars", value: "stars" },
    { label: "Alphabetical", value: "name" },
    { label: "Size", value: "size" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col md:flex-row gap-4 mt-4 mb-6"
    >
      {/* Type Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`whitespace-nowrap px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
              filter === f.value
                ? "bg-primary text-white shadow-[0_0_15px_rgba(124,58,237,0.4)]"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap md:ml-auto gap-3">
        {/* Sort Select */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10 transition-colors cursor-pointer appearance-none outline-none"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value} className="bg-[#09090B]">
              Sort by: {s.label}
            </option>
          ))}
        </select>

        {/* Language Select */}
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="bg-white/5 border border-white/10 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary hover:bg-white/10 transition-colors cursor-pointer appearance-none outline-none"
        >
          <option value="all" className="bg-[#09090B]">
            All Languages
          </option>
          {availableLanguages.map((lang) => (
            <option key={lang} value={lang} className="bg-[#09090B]">
              {lang}
            </option>
          ))}
        </select>
      </div>
    </motion.div>
  );
}
