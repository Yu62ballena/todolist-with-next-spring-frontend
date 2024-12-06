"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import Link from "next/link";
import styled from "styled-components";
import axios from "axios";
import { useRouter } from "next/navigation";

// import { span } from "framer-motion/client";

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
    margin-bottom: 30px;
  }
`;

const InputForm = styled.form`
  padding: 60px 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #000;
  border-radius: 30px;

  background-color: white;

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

    &:nth-child(6) {
      margin-bottom: 50px;
    }
  }

  & div {
    display: flex;
    justify-content: space-between;
    gap: 50px;
  }
`;

const AnimatedButton = styled(motion.button)`
  font-size: 16px;
  border: 1px solid #000;
  border-radius: 8px;
  cursor: pointer;
  padding: 4px 8px;
  color: #000;
  background-color: lightgray;
  transition: background-color 0.3s ease;
`;

const UserDeleteButton = styled.a`
  margin-top: 150px;
`;

const buttonVariants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    backgroundColor: "#f0f0f0",
  },
};

type UserFormProps = {
  update?: boolean;
  userData?: {
    userId: string;
    username: string;
    email: string;
    thumbnail_path: string;
  };
};

const createUserSchema = z.object({
  username: z.string().min(3, "ユーザー名は3文字以上で入力してください。").max(20, "ユーザー名は20文字以下で入力してください"),
  email: z.string().email("正しいメールアドレスを入力してください。"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください。"),
  thumbnail: z.any().optional(),
});

const updateUserSchema = z.object({
  username: z.string().min(3, "ユーザー名は3文字以上で入力してください。").max(20, "ユーザー名は20文字以下で入力してください。"),
  email: z.string().email("正しいメールアドレスを入力してください"),
  password: z.string().min(6, "パスワードは6文字以上で入力してください").optional().or(z.literal("")),
  thumbnail: z.any().optional(),
});

// フォームデータの型定義
type UserFormData = z.infer<typeof createUserSchema>;

const deleteUser = () => {};

const UserForm = ({ update, userData }: UserFormProps) => {
  const router = useRouter();

  // useFormの設定
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<UserFormData>({
    resolver: zodResolver(update ? updateUserSchema : createUserSchema),
    defaultValues: update
      ? {
          username: userData?.username,
          email: userData?.email,
          password: "",
          thumbnail: userData?.thumbnail_path,
        }
      : undefined,
  });

  // フォーム送信時の処理
  const onSubmit = async (data: UserFormData) => {
    const token = localStorage.getItem("token");

    try {
      const updateData = {
        username: data.username,
        email: data.email,
        ...(data.password ? { password: data.password } : {}),
        ...(selectedFileName ? { thumbnail_path: uploadedImagePath } : {}),
      };

      const endpoint = update ? `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users/${userData?.userId}` : `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/users`;
      const successMessage = update ? "更新成功しました" : "登録成功しました";

      // const response = update ? await axios.put(endpoint, updateData) : await axios.post(endpoint, updateData);

      // リクエスト前のデバッグ情報
      console.log("API URL:", process.env.NEXT_PUBLIC_API_BASE_URL);
      console.log("Full Endpoint:", endpoint);
      console.log("Request Method:", update ? "PUT" : "POST");
      console.log("Request Data:", updateData);

      console.log("successMessage", successMessage);
      // console.log(response);

      const config = {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = update ? await axios.put(endpoint, updateData, config) : await axios.post(endpoint, updateData, config);

      console.log("Response:", response);

      router.push(update ? "/todo?action=updated" : "/?action=registered");
    } catch (e) {
      console.error("フォーム送信エラー：", e);
    }
  };

  // サムネ画像選択
  const [selectedFileName, setSelectedFileName] = useState<string>(update && userData?.thumbnail_path ? userData.thumbnail_path : "選択されていません");

  useEffect(() => {
    if (update && userData?.thumbnail_path) {
      setSelectedFileName(userData.thumbnail_path);
      setValue("thumbnail", userData.thumbnail_path);
    }
  }, [update, userData, setValue]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      try {
        setSelectedFileName(file.name);
        const imagePath = await uploadImage(file);
        setUploadedImagePath(imagePath);
        setValue("thumbnail", imagePath);
      } catch (error) {
        console.error("ファイル処理エラー：", error);
        setSelectedFileName("画像のアップロードに失敗しました。");
      }
    }
  };

  // 画像のアップロード処理（next上に保存)
  const [uploadedImagePath, setUploadedImagePath] = useState<string>("");

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("画像のアップロードに失敗しました。");
      }

      const data = await response.json();
      return data.path;
    } catch (error) {
      console.error("画像アップロードエラー（next）", error);
      throw error;
    }
  };

  return (
    <Container>
      <h1>{update ? "ユーザー情報更新" : "ユーザー登録"}</h1>

      <InputForm onSubmit={handleSubmit(onSubmit)}>
        <label>ユーザー名</label>
        <input {...register("username")} />
        {errors.username && <span style={{ color: "red", fontSize: "12px" }}>{errors.username.message}</span>}

        <label>メールアドレス</label>
        <input {...register("email")} />
        {errors.email && <span style={{ color: "red", fontSize: "12px" }}>{errors.email.message}</span>}

        <label>パスワード</label>
        <input type="password" placeholder={update ? "変更する場合のみ入力" : "パスワードを入力してください"} {...register("password")} />
        {errors.password && <span style={{ color: "red", fontSize: "12px" }}>{errors.password.message}</span>}

        <label>プロフィール画像</label>
        <input type="file" accept="image/*" onChange={handleFileChange} style={{ border: "none" }} />

        <div>
          <AnimatedButton type="submit" disabled={isSubmitting} variants={buttonVariants} initial="initial" whileHover="hover">
            {isSubmitting ? "送信中…" : update ? "更新" : "登録"}
          </AnimatedButton>

          <Link href="/todo">
            <AnimatedButton variants={buttonVariants} initial="initial" whileHover="hover">
              戻る
            </AnimatedButton>
          </Link>
        </div>
      </InputForm>

      {update && (
        <UserDeleteButton href="#" onClick={deleteUser}>
          ユーザー情報削除
        </UserDeleteButton>
      )}
    </Container>
  );
};

export default UserForm;
