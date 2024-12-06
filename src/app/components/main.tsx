"use client";

// import Container from "../components/container";
import InputBox from "./inputBox";
import TaskList from "./taskList";
import styled from "styled-components";
import { media } from "../constants/breakpoints";

type TaskType = {
  taskId: number;
  userId: string;
  taskName: string;
  isComplete: boolean;
  dueDate: string | null;
};

type MainProps = {
  addTask: (newTask: TaskType) => void;
  completeTasks: TaskType[];
  incompleteTasks: TaskType[];
  toggleTaskCompletion: (taskId: number) => void;
  userId: string;
  onDelete: (taskId: number) => void;
};

const MainStyle = styled.main`
  background: linear-gradient(29deg, rgba(2, 0, 36, 1) 0%, rgba(199, 106, 177, 0.9472382703081232) 33%, rgba(39, 176, 236, 1) 71%, rgba(51, 0, 255, 1) 94%);
  overflow-x: hidden;
  overflow-y: auto;

  ${media.mobile} {
    width: 100%;
  }
`;

const ContentsContainer = styled.div`
  background-color: rgba(255, 255, 255, 0.2);
  height: calc(100vh - 100px);
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin: 0 auto;
  width: 80%;

  ${media.tablet} {
    width: 96%;
    height: calc(100vh - 70px);
  }

  ${media.mobile} {
    width: 96%;
    height: calc(100vh - 70px);
  }
`;

const InputContainer = styled.div`
  height: auto;
  background-color: transparent;
  margin-bottom: 30px;
  width: 80%;
  padding: 0;
  display: flex;
  justify-content: center;
  margin: 0 auto 30px;

  ${media.tablet} {
    width: 100%;
    margin-left: 3%;
  }

  ${media.mobile} {
    width: 300px;
  }
`;

const TaskContainer = styled.div`
  height: auto;
  background-color: transparent;
  display: flex;
  flex-direction: column;
  width: 90%;
  margin: 0 auto;
  justify-content: space-between;

  ${media.mobile} {
    width: 100%;
  }
`;

const Main = ({ addTask, completeTasks, incompleteTasks, toggleTaskCompletion, userId, onDelete }: MainProps) => {
  return (
    <MainStyle>
      <ContentsContainer>
        {/* 新規タスク入力 */}
        <InputContainer>
          <InputBox taskInput addTask={addTask} userId={userId} />
        </InputContainer>

        {/* タスクリストの表示 */}
        <TaskContainer>
          <TaskList completeTasks={completeTasks} incompleteTasks={incompleteTasks} toggleTaskCompletion={toggleTaskCompletion} onDelete={onDelete} userId={userId} />
        </TaskContainer>
      </ContentsContainer>
    </MainStyle>
  );
};

export default Main;
