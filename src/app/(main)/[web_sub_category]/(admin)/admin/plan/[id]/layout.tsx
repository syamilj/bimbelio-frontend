import Provider from '../_form_submit/_provider/provider';

export default function Layout({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
