"use client";

import { useParams, useSearchParams } from "next/navigation";
import UserForm from "@/app/components/userForm";

const UserUpdatePage = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const userData = {
    userId: params.id.toString(),
    username: searchParams.get("username") || "",
    email: searchParams.get("email") || "",
    thumbnail_path: searchParams.get("thumbnail_path") || "",
  };

  console.log(userData);

  // return <UserForm update />;
  return <UserForm update userData={userData} />;
};

export default UserUpdatePage;
