import React from "react";

import { DEFAULT_SCROLL_AMOUNT_PX } from "~community/common/constants/commonConstants";
import { KeyboardKeys } from "~community/common/enums/KeyboardEnums";

export const handleActivationKeyDown = (
  event: React.KeyboardEvent,
  onClick: () => void
): void => {
  if (event.key === KeyboardKeys.ENTER || event.key === KeyboardKeys.SPACE) {
    event.preventDefault();
    onClick();
  }
};

export const createActivationKeyDownHandler = (onClick: () => void) => {
  return (event: React.KeyboardEvent) => {
    handleActivationKeyDown(event, onClick);
  };
};

export const handleActivationKeyDownWithData = <T>(
  event: React.KeyboardEvent,
  onActivate: (data: T) => void,
  data: T
): void => {
  if (event.key === KeyboardKeys.ENTER || event.key === KeyboardKeys.SPACE) {
    event.preventDefault();
    onActivate(data);
  }
};

export const handleScrollKeyboard = (
  event: React.KeyboardEvent,
  scrollContainer: HTMLElement
) => {
  switch (event.key) {
    case KeyboardKeys.ARROW_DOWN:
      scrollContainer.scrollBy({
        top: DEFAULT_SCROLL_AMOUNT_PX,
        behavior: "smooth"
      });
      event.preventDefault();
      break;
    case KeyboardKeys.ARROW_UP:
      scrollContainer.scrollBy({
        top: -DEFAULT_SCROLL_AMOUNT_PX,
        behavior: "smooth"
      });
      event.preventDefault();
      break;
    case KeyboardKeys.PAGE_DOWN:
      scrollContainer.scrollBy({
        top: scrollContainer.clientHeight,
        behavior: "smooth"
      });
      event.preventDefault();
      break;
    case KeyboardKeys.PAGE_UP:
      scrollContainer.scrollBy({
        top: -scrollContainer.clientHeight,
        behavior: "smooth"
      });
      event.preventDefault();
      break;
    case KeyboardKeys.HOME:
      scrollContainer.scrollTo({ top: 0, behavior: "smooth" });
      event.preventDefault();
      break;
    case KeyboardKeys.END:
      scrollContainer.scrollTo({
        top: scrollContainer.scrollHeight,
        behavior: "smooth"
      });
      event.preventDefault();
      break;
  }
};

export const handleListNavigation = (
  event: React.KeyboardEvent,
  containerRef: React.RefObject<HTMLElement>,
  selector: string = '[role="button"]'
) => {
  const activeElement = document.activeElement as HTMLElement;
  const focusableElements = Array.from(
    containerRef.current?.querySelectorAll(selector) || []
  ) as HTMLElement[];

  const currentIndex = focusableElements.indexOf(activeElement);

  switch (event.key) {
    case KeyboardKeys.ARROW_UP:
      event.preventDefault();
      if (currentIndex > 0) {
        focusableElements[currentIndex - 1].focus();
      }
      break;
    case KeyboardKeys.ARROW_DOWN:
      event.preventDefault();
      if (currentIndex < focusableElements.length - 1) {
        focusableElements[currentIndex + 1].focus();
      }
      break;
    case KeyboardKeys.HOME:
      event.preventDefault();
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
      break;
    case KeyboardKeys.END:
      event.preventDefault();
      if (focusableElements.length > 0) {
        focusableElements[focusableElements.length - 1].focus();
      }
      break;
  }
};
