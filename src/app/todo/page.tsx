"use client";

import axios from "axios";

import { useEffect, useState, useCallback } from "react";
import useSearchList from "../hooks/useSearchList";
import Header from "../components/header";
import Main from "../components/main";
import { useRouter, useSearchParams } from "next/navigation";
import Notification from "../components/notification";

type UserType = {
  user_id: string;
  username: string;
  email: string;
  // password: string;
  thumbnail_path: string;
};

type TaskType = {
  taskId: number;
  userId: string;
  taskName: string;
  isComplete: boolean;
  dueDate: string | null;
};

const Todo = () => {
  const router = useRouter();

  // ログイン中のユーザー情報
  const [user, setUser] = useState<UserType | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      router.push("/");
      return;
    }

    try {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    } catch (e) {
      console.error("ユーザー情報の解析に失敗しました：", e);
      router.push("/");
    }
  }, [router]);

  // タスクリスト全取得
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          router.push("/");
          return;
        }

        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks`, {
          params: {
            userId: user?.user_id,
          },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTasks(response.data);
      } catch (e) {
        console.error("エラーが発生しました：", e);
        if (axios.isAxiosError(e) && e.response?.status === 403) {
          router.push("/");
        }
      }
    };

    fetchData();
  }, [user, router]);

  // 検索キーワードの取得
  const [searchKeyword, setSearchKeyword] = useState<string>("");

  // 検索の実施
  const [displayedTasks, setDisplayedTasks] = useState<TaskType[]>([]);
  const searchResults = useSearchList({ lists: tasks, keyword: searchKeyword });

  useEffect(() => {
    setDisplayedTasks(searchKeyword.length > 0 ? searchResults : tasks);
  }, [searchKeyword, searchResults, tasks]);

  // 音声再生
  const playSound = () => {
    const audio = new Audio("/sound/complete.mp3");
    audio.play().catch((error) => console.error("音声の再生に失敗しました。：", error));
  };

  // タスクの完了・未完了切り替えロジック
  const toggleTaskCompletion = useCallback((taskId: number) => {
    setTasks((prevTasks) => prevTasks.map((task) => (task.taskId === taskId ? { ...task, isComplete: !task.isComplete } : task)));
    playSound();
  }, []);

  // タスクの新規登録ロジック
  const addTask = (newTask: TaskType) => {
    setTasks((prevTasks) => [...prevTasks, newTask]);
  };

  // タスク削除のロジック
  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.taskId !== taskId));
  };

  // 完了・未完了ごとのタスク抽出
  const incompleteTasks = displayedTasks.filter((task) => !task.isComplete);
  const completeTasks = displayedTasks.filter((task) => task.isComplete);

  // ユーザー情報アップデート時の通知処理
  const searchParams = useSearchParams();
  const [notification, setNotification] = useState<string>("");

  useEffect(() => {
    const action = searchParams.get("action");
    if (action === "updated") {
      setNotification("ユーザー情報を更新しました");
      router.replace("/todo");
    }
  }, [searchParams]);

  // console.log("NEXT_PUBLIC_API_BASE_URL",process.env.NEXT_PUBLIC_API_BASE_URL);

  return (
    <>
      {user && (
        <>
          <Header user={user} setSearchKeyword={setSearchKeyword} />

          <Main addTask={addTask} completeTasks={completeTasks} incompleteTasks={incompleteTasks} toggleTaskCompletion={toggleTaskCompletion} userId={user.user_id} onDelete={deleteTask} />

          {notification && <Notification message={notification} onComplete={() => setNotification("")} />}
        </>
      )}
    </>
  );
};

export default Todo;
