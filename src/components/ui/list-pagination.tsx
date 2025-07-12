import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';
import { Input } from './input';

export default function ListPagination({
  onPageChange,
  onSizeChange,
  totalPage,
  pageSize,
  currentPage,
  className,
}: {
  totalPage: number;
  pageSize: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  onSizeChange?: (size: number) => void;
  className?: string;
}) {
  const [page, setPage] = useState<number>(1);
  const handleChange = (parameter: 'next' | 'prev') => {
    if (parameter === 'next') {
      console.log({ totalPage });
      if (page < totalPage) {
        setPage(page + 1);
        if (onPageChange) {
          onPageChange(page + 1);
        }
      }
    }
    if (parameter === 'prev') {
      if (page > 1) {
        setPage(page - 1);
        if (onPageChange) {
          onPageChange(page - 1);
        }
      }
    }
  };

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
    }
  }, [currentPage]);

  return (
    <div className={cn('flex w-full justify-between py-2', className)}>
      {/* <Select>
        <SelectTrigger className="w-fit">
          <SelectValue placeholder="" />
        </SelectTrigger>
        <SelectContent>
          {Array.from({ length: 11 }).map((_, index) => {
            const value = ((index + 1) * 10).toString();
            return <SelectItem value={value}>{value}</SelectItem>;
          })}
        </SelectContent>
      </Select> */}
      <Input
        type="number"
        placeholder="10"
        className="w-[80px]"
        value={pageSize}
        max={100}
        onChange={(e) => {
          const rawValue = e.target.value;
          const value = parseInt(rawValue);
          if (rawValue.length === 0) {
            if (onSizeChange) {
              onSizeChange(1);
              if (onPageChange) onPageChange(1);
            }
            return;
          }
          if (onSizeChange && value > -1) {
            onSizeChange(value);
            if (onPageChange) onPageChange(1);
          }
        }}
      />
      <Pagination className="w-fit mx-0">
        <PaginationContent>
          <PaginationItem
            onClick={() => handleChange('prev')}
            className="cursor-pointer"
          >
            <PaginationPrevious />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink className="cursor-pointer">{page}</PaginationLink>
          </PaginationItem>
          <PaginationItem
            onClick={() => handleChange('next')}
            className="cursor-pointer"
          >
            <PaginationNext />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
