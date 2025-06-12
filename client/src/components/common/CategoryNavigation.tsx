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
    <section className="bg-white dark:bg-slate-800 py-8 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap justify-center gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                'px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300',
                activeCategory === category.id
                  ? 'bg-yellow-400 text-blue-900'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-600'
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
