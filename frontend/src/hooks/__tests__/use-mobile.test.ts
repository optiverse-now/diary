import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../use-mobile';
import { vi } from 'vitest';

describe('useIsMobile', () => {
  const originalMatchMedia = window.matchMedia;

  const createMatchMedia = (matches: boolean) => (query: string) => ({
    matches,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  });

  beforeEach(() => {
    window.matchMedia = vi.fn();
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
  });

  it('デスクトップ画面幅で false を返すこと', () => {
    window.matchMedia = vi.fn().mockImplementation(createMatchMedia(false));
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);
  });

  it('モバイル画面幅で true を返すこと', () => {
    window.matchMedia = vi.fn().mockImplementation(createMatchMedia(true));
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('画面幅の変更��検知すること', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener,
      removeEventListener,
      dispatchEvent: vi.fn(),
    }));

    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    const [eventName, handler] = addEventListener.mock.calls[0];
    expect(eventName).toBe('change');

    act(() => {
      handler({ matches: true } as MediaQueryListEvent);
    });

    expect(result.current).toBe(true);
  });

  it('アンマウント時にイベントリスナーが削除されること', () => {
    const addEventListener = vi.fn();
    const removeEventListener = vi.fn();
    window.matchMedia = vi.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener,
      removeEventListener,
      dispatchEvent: vi.fn(),
    }));

    const { unmount } = renderHook(() => useIsMobile());
    const [eventName, handler] = addEventListener.mock.calls[0];
    unmount();

    expect(removeEventListener).toHaveBeenCalledWith(eventName, handler);
  });
}); 