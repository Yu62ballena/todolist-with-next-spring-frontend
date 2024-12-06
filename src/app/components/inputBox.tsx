import { Dispatch, SetStateAction, useState } from "react";
import styled from "styled-components";
import axios from "axios";
import { media } from "../constants/breakpoints";

type InputTaskProps = {
  taskInput?: boolean;
  addTask?: (newTask: TaskType) => void;
  setSearchKeyword?: Dispatch<SetStateAction<string>>;
  userId: string;
};

type TaskType = {
  taskId: number;
  userId: string;
  taskName: string;
  isComplete: boolean;
  dueDate: string | null;
};

const Form = styled.form`
  width: 90%;
  display: flex;
  justify-content: center;

  ${media.mobile} {
    width: 100%;
    margin-left: 10%;
  }
`;

const InputTask = styled.input`
  border: 1px solid #000;
  width: 100%;
  height: 50px;
  padding: 5px;

  ${media.tablet} {
    width: 90%;
    transform: translateX(-3%);
  }
`;

const SearchWrapper = styled.div`
  position: relative;
  width: 50%;
  height: 50%;

  ${media.tablet} {
    width: 70%;
  }

  ${media.mobile} {
    width: 71%;
  }

  & span {
    position: absolute;
    top: 25%;
    right: 30px;
    cursor: pointer;

    ${media.mobile} {
      top: 14%;
    }
  }
`;

const SearchBox = styled.input`
  border: 1px solid #000;
  width: 100%;
  height: 100%;
  padding: 5px 20px;
  border-radius: 40px;
`;

const InputBox = ({ taskInput = false, addTask, setSearchKeyword, userId }: InputTaskProps) => {
  // nullチェック
  function isHTMLInputElement(element: Element | null): element is HTMLInputElement {
    return element !== null && element instanceof HTMLInputElement;
  }

  // 新タスクの追加
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const input = form.elements.namedItem("newTask") as HTMLInputElement;

    const token = localStorage.getItem("token");
    console.log(token);

    if (isHTMLInputElement(input) && input.value.trim() !== "") {
      try {
        const response = await axios.post(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks`,
          { taskName: input.value.trim() },
          {
            params: {
              userId: userId,
            },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        addTask?.(response.data);

        input.value = "";
      } catch (e) {
        console.error("タスクの作成に失敗：", e);
      }
    }
  };

  // 検索キーワードの取得
  const [searchValue, setSearchValue] = useState<string>("");

  const getSearchKeyword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchValue(newValue);
    setSearchKeyword?.(newValue);
  };

  // 検索ウインドウのリセット
  const clearInput = () => {
    setSearchValue("");
    setSearchKeyword?.("");
  };

  return taskInput ? (
    <Form onSubmit={handleSubmit}>
      <InputTask type="text" id="newTask" name="newTask" placeholder="タスクを入力" />
    </Form>
  ) : (
    <SearchWrapper>
      <SearchBox type="text" id="keyword" name="keyword" placeholder="検索" value={searchValue} onChange={getSearchKeyword} />
      <span onClick={clearInput}>✕</span>
    </SearchWrapper>
  );
};

export default InputBox;
