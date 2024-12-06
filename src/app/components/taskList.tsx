import TaskItem from "./taskItem";
import styled from "styled-components";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type TaskType = {
  taskId: number;
  userId: string;
  taskName: string;
  isComplete: boolean;
  dueDate: string | null;
};

type TaskListProps = {
  completeTasks: TaskType[];
  incompleteTasks: TaskType[];
  toggleTaskCompletion: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  userId: string;
};

const TaskTitle = styled.h2`
  margin-bottom: 15px;
  cursor: pointer;
`;

const UlStyle = styled(motion.ul)`
  margin-bottom: 50px;
  overflow: hidden;
`;

const EmptyMessage = styled(motion.p)`
  text-align: left;
  margin-left: 20px;
  margin-bottom: 50px;
  font-size: 20px;
  color: #555;
`;

const Arrow = styled(motion.span)`
  display: inline-block;
  font-size: 1.3em;
  margin-right: 6px;
  color: darkblue;
`;

const TaskList = ({ completeTasks, incompleteTasks, toggleTaskCompletion, onDelete, userId }: TaskListProps) => {
  const [showIncomplete, setShowIncomplete] = useState<boolean>(true);
  const [showComplete, setShowComplete] = useState<boolean>(false);

  return (
    <>
      <TaskTitle onClick={() => setShowIncomplete(!showIncomplete)}>
        <Arrow animate={{ rotate: showIncomplete ? 0 : -90 }} initial={{ rotate: 0 }} transition={{ duration: 0.2 }}>
          ▼
        </Arrow>
        未完了タスク
      </TaskTitle>

      <AnimatePresence>
        {showIncomplete &&
          (incompleteTasks.length > 0 ? (
            <UlStyle initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              {incompleteTasks.map((task) => (
                <TaskItem key={task.taskId} taskId={task.taskId} taskName={task.taskName} $isComplete={task.isComplete} onToggle={toggleTaskCompletion} onDelete={onDelete} userId={userId} />
              ))}
            </UlStyle>
          ) : (
            <EmptyMessage initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              未完了のタスクはありません。
            </EmptyMessage>
          ))}
      </AnimatePresence>

      <TaskTitle onClick={() => setShowComplete(!showComplete)}>
        <Arrow animate={{ rotate: showComplete ? 0 : -90 }} initial={{ rotate: 0 }} transition={{ duration: 0.2 }}>
          ▼
        </Arrow>
        完了タスク
      </TaskTitle>

      <AnimatePresence initial={false}>
        {showComplete &&
          (completeTasks.length > 0 ? (
            <UlStyle initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              {completeTasks.map((task) => (
                <TaskItem key={task.taskId} taskId={task.taskId} taskName={task.taskName} $isComplete={task.isComplete} onToggle={toggleTaskCompletion} onDelete={onDelete} userId={userId} />
              ))}
            </UlStyle>
          ) : (
            <EmptyMessage initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
              完了済みのタスクはありません。
            </EmptyMessage>
          ))}
      </AnimatePresence>
    </>
  );
};

export default TaskList;
