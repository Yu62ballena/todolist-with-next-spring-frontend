import { useEffect, useState } from "react";

type ListProps = {
  taskId: number;
  userId: string;
  taskName: string;
  isComplete: boolean;
  dueDate: string | null;
};

type SearchListProps = {
  lists: ListProps[];
  keyword: string;
};

const useSearchList = ({ lists, keyword }: SearchListProps) => {
  const [result, setResult] = useState<ListProps[]>([]);

  useEffect(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    const searchResult = lists.filter((list) => list.taskName.toLowerCase().includes(trimmedKeyword));
    setResult(searchResult);
  },[lists, keyword]);

  return result;
};

export default useSearchList;
