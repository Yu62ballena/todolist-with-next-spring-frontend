"use client";

import axios from "axios";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styled from "styled-components";
import Notification from "./components/notification";
import { media } from "./constants/breakpoints";
import { Suspense } from "react";
import SearchParamsHandler from "./components/searchParamsHandler";

// スタイル
const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: mintcream;

  & h1 {
    font-size: 30px;
    margin-bottom: 30px;
  }
`;

const Form = styled.form`
  padding: 60px 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  border-radius: 30px;

  background-color: white;

  ${media.tablet} {
    width: 80%;
  }

  ${media.mobile} {
    max-width: 96%;
    padding: 60px 20px;
  }

  & label {
    color: #555;
    font-size: 14px;
  }

  & input {
    margin-bottom: 20px;
    border: 1px solid #555;
    height: 32px;
    padding: 3px 5px;
    font-size: 16px;
    width: 80%;

    ${media.tablet} {
    }

    ${media.mobile} {
      width: 90%;
    }

    &:nth-child(4) {
      margin-bottom: 50px;
    }
  }

  & div {
    display: flex;
    justify-content: space-between;
    gap: 50px;
  }
`;

const Button = styled(motion.button)`
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  color: #000;
  background-color: lightgray;
  transition: background-color 0.3s ease;

  ${media.tablet} {
  }

  ${media.mobile} {
  }
`;

const StyledLink = styled(Link)`
  text-decoration: none;
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 20px;
  font-size: 14px;
  text-align: center;
`;

const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    backgroundColor: "#f0f0f0",
  },
};

export default function Home() {
  const router = useRouter();

  // フォームの入力を管理
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // エラーメッセージの管理
  const [error, setError] = useState("");

  const [notification, setNotification] = useState("");

  // 入力値が変更されたときの処理
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // フォーム送信時の処理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
    console.log("Submitting Data:", formData);

    try {
      // spring boot側にリクエストを送信
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const { success, token, userId, username, email, thumbnailPath } = response.data;
      if (success) {
        localStorage.setItem("token", token);
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const userInfo = {
          user_id: userId,
          username: username,
          email: email,
          thumbnail_path: thumbnailPath,
        };

        localStorage.setItem("user", JSON.stringify(userInfo));

        console.log("Login successful:", response.data);
        router.push("/todo");
      } else {
        setError("ログインに失敗しました。");
      }
    } catch (error) {
      // axiosのエラーハンドリング
      if (axios.isAxiosError(error)) {
        if (error.response) {
          //サーバーからのエラーレスポンス
          switch (error.response.status) {
            case 401:
              setError("メールアドレスまたはパスワードが違っています");
              break;
            case 404:
              setError("メールアドレスが見つかりません");
              break;
            default:
              setError("ログインに失敗しました");
          }
        } else if (error.request) {
          setError("サーバーとの通信に失敗しました");
        } else {
          setError("エラーが発生しました");
        }

        console.error("ログインエラー：" + error);
      }
    }
  };

  return (
    <Container>
      <h1>My Todo</h1>
      <Form onSubmit={handleSubmit}>
        <label>メールアドレス</label>
        <input name="email" type="email" value={formData.email} onChange={handleChange} required />

        <label>パスワード</label>
        <input name="password" type="password" value={formData.password} onChange={handleChange} required />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <div>
          <StyledLink href="/userRegister">
            <Button type="button" variants={buttonVariants} initial="initial" whileHover="hover">
              新規ユーザー登録
            </Button>
          </StyledLink>
          <Button type="submit" variants={buttonVariants} initial="initial" whileHover="hover">
            ログイン
          </Button>
        </div>
      </Form>

      {/* 登録・ログアウト通知 */}
      <Suspense fallback={null}>
        <SearchParamsHandler setNotification={setNotification} router={router} onLogout={true} onRegistered={true} />
      </Suspense>

      {notification && <Notification message={notification} onComplete={() => setNotification("")} />}
    </Container>
  );
}
