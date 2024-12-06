import Image from "next/image";
import styled from "styled-components";

import logoImage from "/public/images/logo.png";
import { media } from "../constants/breakpoints";

const ImageStyle = styled(Image)`
  width: 80px;
  height: 80px;

  ${media.mobile} {
    width: 50px;
    height: 50px;
  }
`;

const Logo = () => {
  return (
    <>
      <ImageStyle src={logoImage} alt="ロゴ画像" priority />
    </>
  );
};

export default Logo;
