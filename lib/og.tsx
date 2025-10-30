import type {ImageResponseOptions} from 'next/dist/compiled/@vercel/og/types';
import {ImageResponse} from 'next/og';
import type {ReactElement, ReactNode} from 'react';

interface GenerateProps {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  primaryTextColor?: string;
  site?: ReactNode;
}

export function generateOGImage(
  options: GenerateProps & ImageResponseOptions,
): ImageResponse {
  const {
    title,
    description,
    icon,
    site,
    primaryColor,
    secondaryColor,
    primaryTextColor,
    ...rest
  } = options;

  return new ImageResponse(
    generate({
      title,
      description,
      icon,
      site,
      primaryTextColor,
      primaryColor,
      secondaryColor,
    }),
    {
      width: 1200,
      height: 630,
      ...rest,
    },
  );
}

export function generate({
                           primaryColor = '#D33F49',
                           secondaryColor = '#FFA41C',
                           primaryTextColor = '#FFFFFF',
                           ...props
                         }: GenerateProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        color: 'white',
        padding: '4rem',
        backgroundImage: `linear-gradient(to top right, ${primaryColor}, ${secondaryColor})`,
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '16px',
          marginBottom: '12px',
          color: primaryTextColor,
        }}
      >
        {props.icon}
        <p
          style={{
            fontSize: '56px',
            fontWeight: 600,
          }}
        >
          {props.site}
        </p>
      </div>

      <p
        style={{
          fontWeight: 800,
          fontSize: '82px',
        }}
      >
        {props.title}
      </p>
      <p
        style={{
          fontSize: '52px',
          color: 'rgba(240,240,240,0.8)',
        }}
      >
        {props.description}
      </p>
    </div>
  );
}