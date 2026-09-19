"use client";

const categories = ["همه", "طراحی ناخن", "ژل پولیش", "کاشت ناخن", "مانیکور", "پیشرفته"];

type Props = { activeCategory: string; setActiveCategory: (category: string) => void };

export default function CourseFilters({ activeCategory, setActiveCategory }: Props) {
  return (
    <div className="flex gap-2.5 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
      {categories.map((category) => {
        const active = activeCategory === category;
        return (
          <button
            key={category}
            type="button"
            onClick={() => setActiveCategory(category)}
            className={`whitespace-nowrap rounded-full border px-5 py-2.5 text-xs font-bold transition-all duration-300 ${
              active
                ? "border-[#b78b72] bg-[#b78b72] text-white shadow-[0_8px_22px_rgba(183,139,114,.20)]"
                : "border-[#e6dcd4] bg-white/75 text-[#6f625a] hover:border-[#c9ab97] hover:bg-[#f7f0eb] hover:text-[#8d6a55]"
            }`}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
}
