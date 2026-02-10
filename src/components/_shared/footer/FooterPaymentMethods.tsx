import { paymentGroups } from './footer-config';

export const FooterPaymentMethods: React.FC = () => (
  <div>
    <p className="text-sm font-bold text-gray-700 mb-6 uppercase tracking-wider text-center">
      Metode Pembayaran
    </p>

    <div className="flex flex-wrap justify-center gap-5">
      {paymentGroups.map((group) => (
        <div
          key={group.label}
          className="flex flex-col items-center px-6 py-5 bg-gray-50 rounded-3xl border border-gray-100"
        >
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-4">
            {group.label}
          </span>
          <div
            className={
              group.cols
                ? `grid grid-cols-${group.cols} gap-3 place-items-center`
                : 'flex items-center justify-center gap-4 h-10'
            }
          >
            {group.items.map((item) => (
              <img
                key={item.alt}
                src={item.src}
                alt={item.alt}
                className={`${item.height} object-contain`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  </div>
);
