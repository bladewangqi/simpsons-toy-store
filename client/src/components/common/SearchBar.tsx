import { useState, useCallback, useEffect } from 'react';
import { debounce } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string) => void;
  placeholder?: string;
  className?: string;
  value?: string;
}

export function SearchBar({ onSearch, placeholder = "Search for Bart, Homer, Lisa toys...", className, value = '' }: SearchBarProps) {
  const [query, setQuery] = useState(value);

  // Sync internal state with external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const debouncedSearch = useCallback(
    debounce((searchQuery: string) => {
      onSearch(searchQuery);
    }, 300),
    [onSearch]
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    debouncedSearch(newQuery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="relative w-full">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-2 border-2 border-blue-900 dark:border-yellow-400 rounded-lg focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 bg-white dark:bg-slate-700 text-blue-900 dark:text-white placeholder-blue-600 dark:placeholder-gray-400 font-semibold"
        />
        <i className="fas fa-search absolute left-3 top-3 text-blue-900 dark:text-yellow-400" />
      </div>
    </form>
  );
}
