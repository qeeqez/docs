import fs from "node:fs/promises";
import {ImageResponse} from 'next/og';
import type {ImageResponseOptions} from "next/server";
import type {ReactElement, ReactNode} from 'react';

interface GenerateProps {
  title: string;
  description?: string;
  icon?: ReactNode;
  primaryColor?: string;
  secondaryColor?: string;
  primaryTextColor?: string;
  site?: ReactNode;
}

const font = fs.readFile('./lib/og/Inter-Regular.ttf');
const fontBold = fs.readFile('./lib/og/Inter-SemiBold.ttf');

export async function getImageResponseOptions(): Promise<ImageResponseOptions> {
  return {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Inter',
        data: await font,
        weight: 400,
      },
      {
        name: 'Inter',
        data: await fontBold,
        weight: 600,
      },
    ],
  };
}

export async function generateOGImage(
  options: GenerateProps,
): Promise<ImageResponse> {
  const {
    title,
    description,
    icon,
    site,
    primaryColor,
    secondaryColor,
    primaryTextColor,
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
    await getImageResponseOptions(),
  );
}

const getTruncatedText = (maxLength: number, text?: string) => {
  if (!text) return '';
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, maxLength)}...`;
};

export function generate({
                           primaryColor = '#FFA41C',
                           secondaryColor = '#D33F49',
                           primaryTextColor = '#FFFFFF',
                           ...props
                         }: GenerateProps): ReactElement {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: "space-between",
        width: '100%',
        height: '100%',
        color: 'white',
        padding: '4rem',
        // backgroundImage: `linear-gradient(to top left, ${primaryColor}, ${secondaryColor})`,
        backgroundImage: `radial-gradient(at top right, ${primaryColor}, ${secondaryColor});`,
      }}
    >
      <div style={{display: "flex"}}>{props.icon}</div>
      <div style={{
        display: "flex",
        flexDirection: "column",
        maxWidth: '80%'
      }}>
        <p
          style={{
            fontWeight: 600,
            fontSize: '82px',
            marginTop: 0,
            marginBottom: 0,
          }}
        >
          {props.title}
        </p>
        <p
          style={{
            fontWeight: 400,
            fontSize: '36px',
            marginBottom: 0,
            color: 'rgba(240,240,240,0.8)',
          }}
        >
          {getTruncatedText(80, props.description)}
        </p>
      </div>
    </div>
  );
}