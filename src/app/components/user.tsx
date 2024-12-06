"user client";

import Image from "next/image";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import useClickOutside from "../hooks/useClickOutside";
import { media } from "../constants/breakpoints";

// 型情報
type UserType = {
  user_id: string;
  username: string;
  email: string;
  // password: string;
  thumbnail_path: string;
};

type UserProps = {
  user: UserType;
};

// 各スタイル用コンポーネント
const UserWrapper = styled.div`
  position: relative;
`;

const UserImage = styled(Image)`
  cursor: pointer;
  width: 80px;
  height: 80px;

  ${media.mobile} {
    width: 60px;
    height: 60px;
  }
`;

const PopupWrapper = styled(motion.div)`
  position: absolute;
  right: 10px;
  margin-top: 8px;
  width: 200px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 16px;
  z-index: 10;
`;

const Username = styled.h3`
  font-weight: bold;
  margin-bottom: 8px;
`;

const Email = styled.p`
  font-size: 14px;
  color: #666;
  margin-bottom: 20px;
`;

const defaultImage = "/images/user-dummy.png";

const User = ({ user }: UserProps) => {

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const togglePopup = () => setIsOpen((prev) => !prev);

  useClickOutside([popupRef, imageRef], () => setIsOpen(false));

  const router = useRouter();

  const handleUpdateClick = () => {
    const queryParams = new URLSearchParams({
      username: user.username,
      email: user.email,
      thumbnail_path: user.thumbnail_path || "",
    }).toString();

    router.push(`/userUpdate/${user.user_id}?${queryParams}`);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    router.push("/?action=logout");
  };

  return (
    <UserWrapper>
      <UserImage src={user.thumbnail_path ? user.thumbnail_path : defaultImage} alt="ユーザーロゴ" width={80} height={80} onClick={togglePopup} ref={imageRef} />
      <AnimatePresence>
        {isOpen && (
          <PopupWrapper ref={popupRef} initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ duration: 0.1 }}>
            <Username>{user.username}</Username>
            <Email>{user.email}</Email>
            <button onClick={handleUpdateClick}>ユーザー情報更新</button>
            <button onClick={handleLogout}>ログアウト</button>
          </PopupWrapper>
        )}
      </AnimatePresence>
    </UserWrapper>
  );
};

export default User;
