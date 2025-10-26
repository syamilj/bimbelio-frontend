import { website_sub_category_id_params } from '@/hooks/use-web-sub-category-id';
import { cn } from '@/lib/utils';
import { WebsiteSubCategory } from '@/types/database';
import { useWebsiteSubCategory } from '../provider/provider-website-category';
import {
  MultiSelect,
  MultiSelectContent,
  MultiSelectGroup,
  MultiSelectItem,
  MultiSelectTrigger,
  MultiSelectValue,
} from './multi-select';

export const MultiSelectWebsub = ({
  value,
  onValuesChange,
  optionsData,
  className,
  isCoreOption,
  placeholder,
}: {
  value?: string[];
  onValuesChange?: (values: string[]) => void;
  optionsData?: WebsiteSubCategory[];
  className?: string;
  isCoreOption?: boolean;
  placeholder?: string;
}) => {
  const { webCategoryData, websiteSubCategory } = useWebsiteSubCategory();

  const options = optionsData
    ? optionsData
    : webCategoryData[0].WebsiteSubCategory.filter((sub) => {
        if (!isCoreOption) return true;
        if (websiteSubCategory) {
          return websiteSubCategory?.sharing_website_sub_category_ids.includes(
            sub.id,
          );
        }
        return false;
      }) || [];
  return (
    <MultiSelect
      values={value}
      onValuesChange={onValuesChange}
    >
      <MultiSelectTrigger className={cn('w-full', className)}>
        <MultiSelectValue
          placeholder={cn(
            placeholder ? placeholder : 'Pilih web sub category...',
          )}
        />
      </MultiSelectTrigger>
      <MultiSelectContent>
        <MultiSelectGroup>
          {options.map((webSub) => (
            <MultiSelectItem
              key={webSub.id}
              value={webSub.id}
              disabled={webSub.id === website_sub_category_id_params}
            >
              {webSub.name}
            </MultiSelectItem>
          ))}
        </MultiSelectGroup>
      </MultiSelectContent>
    </MultiSelect>
  );
};
