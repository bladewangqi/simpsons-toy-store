import { cn } from '@/lib/utils';
import categoriesData from '../../data/categories.json';
import { Category } from '../../types';

interface CategoryNavigationProps {
  activeCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

export function CategoryNavigation({ activeCategory, onCategoryChange }: CategoryNavigationProps) {
  const categories = categoriesData as Category[];

  return (
    <section className="bg-gradient-to-r from-yellow-400 via-yellow-300 to-orange-400 dark:bg-slate-800 py-8 border-b-4 border-blue-900 dark:border-yellow-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'px-6 py-3 rounded-full font-bold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 border-2',
                activeCategory === category.id
                  ? 'bg-blue-900 text-yellow-400 border-yellow-400 scale-110'
                  : 'bg-white text-blue-900 border-blue-900 hover:bg-yellow-100 hover:scale-105'
              )}
            >
              <i className={cn(category.icon, 'mr-2')} />
              {category.name}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
