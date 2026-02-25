import { motion } from "framer-motion";

interface CategoryChipsProps {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
}

const CategoryChips = ({ categories, selected, onSelect }: CategoryChipsProps) => {
  return (
    <div className="flex gap-2 overflow-x-auto hide-scrollbar py-1">
      {categories.map((cat) => (
        <motion.button
          key={cat}
          whileTap={{ scale: 0.95 }}
          onClick={() => onSelect(cat)}
          className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
            selected === cat
              ? "gradient-primary text-primary-foreground shadow-lg shadow-primary/30"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          {cat}
        </motion.button>
      ))}
    </div>
  );
};

export default CategoryChips;
