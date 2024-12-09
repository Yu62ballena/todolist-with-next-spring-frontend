"use client";

import { useCallback, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import UserForm from "@/app/components/userForm";
import { Suspense, useState } from "react";

// URLパラメーターを処理するコンポーネント
const UserDataLoader = ({ onLoadData }: { onLoadData: (data: { userId: string; username: string; email: string; thumbnail_path: string }) => void }) => {
  const params = useParams();
  const searchParams = useSearchParams();

  const username = searchParams.get("username") || "";
  const email = searchParams.get("email") || "";
  const thumbnailPath = searchParams.get("thumbnail_path") || "";

  useEffect(() => {
    if (params.id) {
      console.log("Loading user data for ID:", params.id);

      const userData = {
        userId: params.id.toString(),
        username,
        email,
        thumbnail_path: thumbnailPath,
      };
      onLoadData(userData);
    } else {
      console.error("User ID not found in params");
    }
  }, [params.id, onLoadData, username, email, thumbnailPath]);

  return null;
};

const UserUpdatePage = () => {
  const [userData, setUserData] = useState({
    userId: "",
    username: "",
    email: "",
    thumbnail_path: "",
  });

  const [isLoading, setIsLoading] = useState(true);

  const handleLoadData = useCallback((data: typeof userData) => {
    setUserData(data);
    setIsLoading(false);
  }, []);


  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <UserDataLoader onLoadData={handleLoadData} />
      </Suspense>
      {!isLoading && <UserForm update userData={userData} />}
    </>
  );
};

export default UserUpdatePage;
