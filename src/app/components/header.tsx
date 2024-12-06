"use client";

import { Dispatch, SetStateAction } from "react";
// import Container from "./container";
import Logo from "./logo";
import InputBox from "./inputBox";
import User from "./user";
import styled from "styled-components";
import { media } from "../constants/breakpoints";

type UserType = {
  user_id: string;
  username: string;
  email: string;
  // password: string;
  thumbnail_path: string;
};

type HeaderProps = {
  user: UserType;
  setSearchKeyword: Dispatch<SetStateAction<string>>;
};

const HeaderStyle = styled.header`
  width: 100%;
  height: 100px;

  ${media.mobile} {
    height: 70px;
  }
`;

const HeaderContainer = styled.div`
  margin: 0 auto;
  height: 100%;
  max-width: 1300px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;


const Header = ({ user, setSearchKeyword }: HeaderProps) => {
  return (
    <HeaderStyle>
      <HeaderContainer>
        <Logo />
        <InputBox setSearchKeyword={setSearchKeyword} userId={user.user_id} />
        <User user={user} />
      </HeaderContainer>
    </HeaderStyle>
  );
};

export default Header;
