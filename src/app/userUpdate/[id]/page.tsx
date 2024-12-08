"use client";

import { useParams, useSearchParams } from "next/navigation";
import UserForm from "@/app/components/userForm";
import { Suspense, useState } from "react";

// URLパラメーターを処理するコンポーネント
const UserDataLoader = ({ onLoadData }: { onLoadData: (data: { userId: string; username: string; email: string; thumbnail_path: string }) => void }) => {
  const params = useParams();
  const searchParams = useSearchParams();

  const userData = {
    userId: params.id.toString(),
    username: searchParams.get("username") || "",
    email: searchParams.get("email") || "",
    thumbnail_path: searchParams.get("thumbnail_path") || "",
  };

  onLoadData(userData);
  return null;
};

const UserUpdatePage = () => {
  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    email: "",
    thumbnail_path: "",
  });

  // return <UserForm update />;
  return (
    <>
      <Suspense fallback={null}>
        <UserDataLoader onLoadData={setUserData} />
      </Suspense>
      <UserForm update userData={userData} />
    </>
  );
};

export default UserUpdatePage;
