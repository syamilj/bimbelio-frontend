import { screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderWithProviders } from '../../../test/utils/render';
import { Button } from './button';

describe('Button', () => {
  it('menjalankan onClick', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(
      <Button onClick={onClick}>Simpan</Button>,
    );
    await user.click(screen.getByRole('button', { name: 'Simpan' }));
    expect(onClick).toHaveBeenCalledOnce();
  });

  it('loading menonaktifkan tombol dan menandai aria-busy', async () => {
    const onClick = vi.fn();
    const { user } = renderWithProviders(
      <Button
        loading
        onClick={onClick}
      >
        Simpan
      </Button>,
    );
    const button = screen.getByRole('button', { name: 'Simpan' });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute('aria-busy', 'true');
    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('asChild merender elemen anak (mis. tautan)', () => {
    renderWithProviders(
      <Button asChild>
        <a href="/price">Lihat paket</a>
      </Button>,
    );
    expect(screen.getByRole('link', { name: 'Lihat paket' })).toHaveAttribute(
      'href',
      '/price',
    );
  });
});
