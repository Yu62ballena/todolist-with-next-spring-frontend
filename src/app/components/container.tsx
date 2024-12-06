"use client";

import { ReactNode } from "react";
import styled from "styled-components";
import { media } from "../constants/breakpoints";

type ContainerProps = {
  children: ReactNode;
  $backColor?: string;
  $height?: string;
  $alignItems?: string;
  $padding?: string;
  $large?: boolean;
  $direction?: string;
  $justify?: string;
  $marginBottom?: string;
  $width?: string;
};

const ContainerStyle = styled.div<{ $backColor?: string; $height?: string; $alignItems?: string; $padding?: string; $large?: boolean; $direction?: string; $justify?: string; $marginBottom?: string }>`
  width: ${({ $large }) => ($large ? "90%" : "80%")};
  min-width: 800px;
  margin: 0 auto;
  margin-bottom: ${({ $marginBottom }) => $marginBottom || "0"};
  padding: ${({ $padding }) => $padding || "0"};
  height: ${({ $height }) => $height || "100px"};
  background-color: ${({ $backColor }) => $backColor || "white"};
  display: flex;
  justify-content: ${({ $justify }) => $justify || "space-between"};
  flex-direction: ${({ $direction }) => $direction || "default"};
  align-items: ${({ $alignItems }) => $alignItems || "default"};

  ${media.tablet} {
  
  }

  ${media.mobile} {
    width: 100%;
  }
`;

const Container = ({ children, $backColor, $height, $alignItems, $padding, $large, $direction, $justify, $marginBottom }: ContainerProps) => {
  return (
    <ContainerStyle $backColor={$backColor} $height={$height} $alignItems={$alignItems} $padding={$padding} $large={$large} $direction={$direction} $justify={$justify} $marginBottom={$marginBottom}>
      {children}
    </ContainerStyle>
  );
};

export default Container;
