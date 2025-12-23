import NextImage, { ImageProps as NextImageProps } from "next/image";
import { JSX } from "react";

import { ImageName } from "~enterprise/common/types/ImageTypes";

import { ImageMapping } from "./ImageMapping";

interface Props extends Omit<NextImageProps, "src" | "alt"> {
  name: ImageName;
  alt?: string;
  dataTestId?: string;
}

const LocalImage = ({
  name,
  alt,
  dataTestId,
  priority,
  fill,
  width,
  height,
  sizes,
  quality,
  style,
  className,
  onClick,
  onError,
  ...rest
}: Props): JSX.Element | null => {
  const imageData = ImageMapping[name];

  const imageProps = {
    ...(fill ? {} : { width: width ?? imageData.width }),
    ...(fill ? {} : { height: height ?? imageData.height }),
    ...rest
  };

  return (
    <NextImage
      src={imageData}
      alt={alt ?? name}
      data-testid={dataTestId}
      priority={priority}
      fill={fill}
      sizes={sizes}
      quality={quality}
      style={style}
      className={className}
      onClick={onClick}
      onError={onError}
      {...imageProps}
    />
  );
};

export default LocalImage;
