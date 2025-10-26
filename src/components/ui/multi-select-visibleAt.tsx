import { useWebsiteSubCategory } from '../provider/provider-website-category';
import { Label } from './label';
import { MultiSelectWebsub } from './multi-select-websub';

export const MultiSelectVisibleAt = ({
  value,
  onValuesChange,
}: {
  value?: string[];
  onValuesChange?: (values: string[]) => void;
}) => {
  const {
    type: { isCore },
  } = useWebsiteSubCategory();

  if (!isCore) return null;

  return (
    <div className="mt-4 flex flex-col gap-2">
      <Label>Tampilkan pada website sub kategori apa saja?</Label>
      <MultiSelectWebsub
        value={value}
        onValuesChange={onValuesChange}
        isCoreOption
        placeholder={
          value && value.length === 0
            ? 'Ditampilkan pada semua sharing website'
            : 'Pilih web sub category...'
        }
      />
      <p className="text-xs text-gray-500 ml-4">
        * Jika kosong maka ditampilkan di semua sharing website pada core ini.
      </p>
    </div>
  );
};
