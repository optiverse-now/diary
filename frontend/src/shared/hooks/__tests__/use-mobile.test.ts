import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useIsMobile } from '../use-mobile';

describe('useIsMobile', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('デスクトップ画面幅で false を返すこと', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('モバイル画面幅で true を返すこと', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('画面幅の変更を検知すること', () => {
    const addEventListener = vi.spyOn(window, 'addEventListener');

    renderHook(() => useIsMobile());
    expect(addEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('アンマウント時にイベントリスナーが削除されること', () => {
    const removeEventListener = vi.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useIsMobile());
    unmount();
    expect(removeEventListener).toHaveBeenCalledWith('resize', expect.any(Function));
  });
}); 