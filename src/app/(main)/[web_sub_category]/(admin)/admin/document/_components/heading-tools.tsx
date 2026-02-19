import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getGeneral } from '@/lib/fetch-helper/fetch-helper';
import { cn } from '@/lib/utils';
import { Filter, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useProvider } from '../provider';

export default function HeadingTools() {
  const {
    setShowAddDocument,
    setFilter,
    filter,
    setFilterDocument,
    filterDocument,
  } = useProvider();

  const [showFilter, setShowFilter] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const [category, setCategory] = useState<{ name: string; id: string; total: number }[]>([]);
  useEffect(() => {
    getGeneral('/category/getAllCategories', { setData: setCategory });
  }, []);

  // Live search
  useEffect(() => {
    setFilterDocument((prev) => {
      const base = prev ?? { filter: '', filterValue: '', search: '' };
      return { ...base, search: searchValue };
    });
  }, [searchValue, setFilterDocument]);

  const handleApplyFilter = () => {
    if (!filter || filter.value === '') return;
    setFilterDocument((prev) => ({
      filter: filter.filter,
      filterValue: filter.value,
      search: prev?.search || '',
    }));
    setShowFilter(false);
  };

  const handleClearFilter = () => {
    setFilter(null);
    setFilterDocument((prev) =>
      prev ? { ...prev, filter: '', filterValue: '' } : null,
    );
    setShowFilter(false);
  };

  const isFiltered =
    !!filterDocument?.filter && filterDocument.filterValue !== '';

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full items-start sm:items-center justify-between">
      {/* Left: search + filter */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Cari dokumen..."
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-gray-200 bg-white text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent transition"
            style={{ '--tw-ring-color': 'var(--color-main, #0091FF)' } as React.CSSProperties}
          />
          {searchValue && (
            <button
              type="button"
              onClick={() => setSearchValue('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter */}
        <div className="relative">
          {/* Backdrop — closes popup but sits BELOW Select portal so Select still works */}
          {showFilter && (
            <div
              className="fixed inset-0 z-40"
              onClick={() => setShowFilter(false)}
            />
          )}

          <button
            type="button"
            onClick={() => setShowFilter((v) => !v)}
            className={cn(
              'relative z-50 flex items-center gap-1.5 px-3 py-2 rounded-xl border text-sm font-medium transition',
              isFiltered
                ? 'bg-main border-main text-white'
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50',
            )}
          >
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{isFiltered ? 'Filtered' : 'Filter'}</span>
            {isFiltered && (
              <Badge className="bg-white/20 text-white text-[10px] px-1 py-0 h-4">
                1
              </Badge>
            )}
          </button>

          {showFilter && (
            <div className="absolute left-0 top-[calc(100%+6px)] z-50 w-72 rounded-2xl bg-white border border-gray-200 shadow-xl p-4 space-y-3">
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wide">Filter Dokumen</p>

              <div className="space-y-2">
                <label className="text-xs font-medium text-gray-500">Filter by</label>
                <Select
                  value={filter?.filter || ''}
                  onValueChange={(v) =>
                    setFilter({ type: 'option', filter: v, value: '' })
                  }
                >
                  <SelectTrigger className="rounded-xl h-9 text-sm">
                    <SelectValue placeholder="Pilih filter..." />
                  </SelectTrigger>
                  <SelectContent className="z-[200]">
                    <SelectItem value="category">Kategori</SelectItem>
                    <SelectItem value="status">Status</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {filter?.type === 'option' && filter.filter !== '' && (
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-500">
                    {filter.filter === 'category' ? 'Pilih kategori' : 'Pilih status'}
                  </label>
                  <Select
                    value={filter.value}
                    onValueChange={(v) =>
                      setFilter((prev) => (prev ? { ...prev, value: v } : null))
                    }
                  >
                    <SelectTrigger className="rounded-xl h-9 text-sm">
                      <SelectValue placeholder="Pilih nilai..." />
                    </SelectTrigger>
                    <SelectContent className="z-[200]">
                      {filter.filter === 'category' &&
                        category.map((c) => (
                          <SelectItem key={c.id} value={`${c.id}`}>
                            {c.name}
                          </SelectItem>
                        ))}
                      {filter.filter === 'status' && (
                        <>
                          <SelectItem value="premium">Premium</SelectItem>
                          <SelectItem value="free">Free</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleClearFilter}
                  className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleApplyFilter}
                  disabled={!filter || filter.value === ''}
                  className="flex-1 text-xs font-semibold py-1.5 rounded-xl bg-main text-white disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-90 transition"
                >
                  Terapkan
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Active filter chip */}
        {isFiltered && (
          <div className="flex items-center gap-1.5 text-xs bg-blue-50 border border-blue-200 text-blue-700 rounded-xl px-2.5 py-1.5 font-medium">
            <span>{filterDocument?.filter}: {filterDocument?.filterValue}</span>
            <button onClick={handleClearFilter}>
              <X className="w-3 h-3" />
            </button>
          </div>
        )}
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 shrink-0">
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl text-gray-600 border-gray-200 hover:border-gray-300 text-sm font-medium"
          onClick={() => setShowAddDocument(true)}
        >
          Export CSV
        </Button>
        <Button
          size="sm"
          className="rounded-xl bg-main hover:opacity-90 text-white text-sm font-semibold gap-1.5"
          onClick={() => setShowAddDocument(true)}
        >
          <Plus className="w-4 h-4" />
          Tambah Dokumen
        </Button>
      </div>
    </div>
  );
}
