import { useEffect, useRef, useState } from 'react';

/**
 * Touch Gesture Utilities for Mobile
 * Supports swipe, pinch, long-press gestures
 */

export interface GestureState {
  startX: number;
  startY: number;
  startTime: number;
  isGesturing: boolean;
}

/**
 * Hook for handling swipe gestures
 */
export function useSwipe(
  onSwipeLeft?: () => void,
  onSwipeRight?: () => void,
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  threshold: number = 50
) {
  const [gestureState, setGestureState] = useState<GestureState>({
    startX: 0,
    startY: 0,
    startTime: 0,
    isGesturing: false,
  });

  const handleTouchStart = (e: TouchEvent) => {
    const touch = e.touches[0];
    setGestureState({
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
      isGesturing: true,
    });
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!gestureState.isGesturing) return;

    const touch = e.changedTouches[0];
    const deltaX = touch.clientX - gestureState.startX;
    const deltaY = touch.clientY - gestureState.startY;
    const duration = Date.now() - gestureState.startTime;

    // Must be fast (less than 500ms)
    if (duration > 500) {
      setGestureState((s) => ({ ...s, isGesturing: false }));
      return;
    }

    // Horizontal swipe
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX > 0 && onSwipeRight) onSwipeRight();
        if (deltaX < 0 && onSwipeLeft) onSwipeLeft();
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        if (deltaY > 0 && onSwipeDown) onSwipeDown();
        if (deltaY < 0 && onSwipeUp) onSwipeUp();
      }
    }

    setGestureState((s) => ({ ...s, isGesturing: false }));
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gestureState]);
}

/**
 * Hook for handling pinch-to-zoom
 */
export function usePinch(onPinch?: (scale: number) => void) {
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  const getDistance = (touches: TouchList): number => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.hypot(dx, dy);
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (e.touches.length === 2) {
      setInitialDistance(getDistance(e.touches));
    }
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 2 && initialDistance) {
      const currentDistance = getDistance(e.touches);
      const scale = currentDistance / initialDistance;
      onPinch?.(scale);
    }
  };

  const handleTouchEnd = () => {
    setInitialDistance(null);
  };

  useEffect(() => {
    document.addEventListener('touchstart', handleTouchStart);
    document.addEventListener('touchmove', handleTouchMove);
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [initialDistance]);
}

/**
 * Hook for long press gesture
 */
export function useLongPress(onLongPress?: () => void, duration: number = 500) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isPressed, setIsPressed] = useState(false);

  const handleMouseDown = () => {
    setIsPressed(true);
    timeoutRef.current = setTimeout(() => {
      onLongPress?.();
    }, duration);
  };

  const handleMouseUp = () => {
    setIsPressed(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { onMouseDown: handleMouseDown, onMouseUp: handleMouseUp, isPressed };
}

/**
 * Optimize touch targets for mobile
 * Returns CSS classes that improve mobile touch experience
 */
export function getMobileTouchClasses(): string {
  return 'active:scale-95 transition-transform';
}

/**
 * Detect if device is mobile
 */
export function isMobileDevice(): boolean {
  return (
    typeof window !== 'undefined' &&
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  );
}

/**
 * Prevent iOS zoom-on-double-tap
 */
export function disableIOSZoom() {
  if (typeof document !== 'undefined') {
    document.addEventListener('touchstart', (e) => {
      if (e.touches.length > 1) {
        e.preventDefault();
      }
    });

    let lastTapTime = 0;
    document.addEventListener('touchend', (e) => {
      const currentTime = new Date().getTime();
      const tapLength = currentTime - lastTapTime;

      if (tapLength < 300 && tapLength > 0) {
        e.preventDefault();
      }

      lastTapTime = currentTime;
    });
  }
}
