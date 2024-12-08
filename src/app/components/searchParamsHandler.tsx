"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

type SearchParamsHandlerProps = {
  setNotification: React.Dispatch<React.SetStateAction<string>>;
  router: AppRouterInstance;
  onLogout?: boolean;
  onRegistered?: boolean;
  onUpdated?: boolean;
  redirectPath?: string;
};

const SearchParamsHandler = ({ setNotification, router, onLogout = false, onRegistered = false, onUpdated = false, redirectPath = "/" }: SearchParamsHandlerProps) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get("action");
    if (onLogout && action === "logout") {
      setNotification("ログアウトしました");
      router.replace(redirectPath);
    } else if (onRegistered && action === "registered") {
      setNotification("ユーザー情報を登録しました");
      router.replace(redirectPath);
    } else if (onUpdated && action === "updated") {
      setNotification("ユーザー情報を更新しました");
      router.replace(redirectPath);
    }
  }, [searchParams, router, setNotification, onLogout, onRegistered, onUpdated, redirectPath]);

  return null;
};

export default SearchParamsHandler;
