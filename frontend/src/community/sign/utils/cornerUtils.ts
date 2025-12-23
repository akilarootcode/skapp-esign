import { CornerType } from "../enums/CommonEnums";
import { PageCorners } from "../hooks/useRenderPages";

export const isNearCorner = (
  x: number,
  y: number,
  corners: PageCorners,
  threshold: number = 20
): CornerType => {
  if (!corners) return CornerType.NONE;

  const distances = {
    [CornerType.TOP_LEFT]: Math.hypot(
      x - corners.topLeft.x,
      y - corners.topLeft.y
    ),
    [CornerType.TOP_RIGHT]: Math.hypot(
      x - corners.topRight.x,
      y - corners.topRight.y
    ),
    [CornerType.BOTTOM_LEFT]: Math.hypot(
      x - corners.bottomLeft.x,
      y - corners.bottomLeft.y
    ),
    [CornerType.BOTTOM_RIGHT]: Math.hypot(
      x - corners.bottomRight.x,
      y - corners.bottomRight.y
    )
  };

  const nearestCorner = Object.entries(distances).reduce(
    (nearest, [corner, distance]) =>
      distance < nearest.distance
        ? { corner: corner as CornerType, distance }
        : nearest,
    { corner: CornerType.NONE, distance: Infinity }
  );

  return nearestCorner.distance <= threshold
    ? nearestCorner.corner
    : CornerType.NONE;
};

export const ensureFieldFitsPage = (
  x: number,
  y: number,
  width: number,
  height: number,
  pageCorner: PageCorners
): { x: number; y: number } => {
  if (!pageCorner) return { x, y };

  const pageWidth = pageCorner.topRight.x;
  const pageHeight = pageCorner.bottomLeft.y;

  const adjustedX = Math.min(x, Math.max(0, pageWidth - width));

  const adjustedY = Math.min(y, Math.max(0, pageHeight - height));

  return { x: adjustedX, y: adjustedY };
};

export const getCenteredFieldPosition = (
  width: number,
  height: number,
  pageCorner: PageCorners
): { x: number; y: number } => {
  if (!pageCorner) return { x: 0, y: 0 };

  const pageWidth = pageCorner.topRight.x;
  const pageHeight = pageCorner.bottomLeft.y;

  const x = (pageWidth - width) / 2;
  const y = (pageHeight - height) / 2;

  return { x, y };
};
