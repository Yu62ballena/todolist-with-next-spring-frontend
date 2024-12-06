import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import useClickOutside from "../hooks/useClickOutside";
import axios from "axios";
import { media } from "../constants/breakpoints";

type TaskItemProps = {
  taskId: number;
  taskName: string;
  $isComplete: boolean;
  onToggle: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  userId: string;
};

const TaskLi = styled.li<{ $isComplete: boolean }>`
  list-style: none;
  width: 95%;
  margin: 0 auto;
  padding: 18px;
  border: 1px solid #888;
  margin-bottom: 10px;
  box-shadow: 4px 4px 4px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ $isComplete }) => ($isComplete ? "gray" : "black")};
  opacity: ${({ $isComplete }) => ($isComplete ? 0.6 : 1)};
  transition: opacity 0.25s;
  position: relative;

  ${media.tablet} {
    width: 100%;
    font-size: 18px;
  }

  ${media.mobile} {
    width: 100%; 
    font-size: 15px;
    padding: 8px 10px;
  }

  & div {
    display: flex;
    align-items: center;
  }

  }
`;

const AnimatedCheckbox = styled(motion.input)`
  width: 25px;
  height: 25px;
  margin-right: 10px;

  ${media.mobile} {
    width: 20px;
    height: 20px;
  }
`;

const ThreePointLeader = styled.div`
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  justify-content: center;
`;

const PopupWrapper = styled(motion.div)`
  position: absolute;
  right: 0px;
  top: 40px;
  width: 80px;
  font-size: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 8px 16px;
  z-index: 10;
  display: flex;
  justify-content: center;
`;

const TaskItem = ({ taskId, taskName, $isComplete, onToggle, onDelete, userId }: TaskItemProps) => {
  const [isChecked, setIsChecked] = useState<boolean>($isComplete);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsChecked($isComplete);
  }, [$isComplete]);

  const handleChange = async (e?: React.MouseEvent | React.ChangeEvent) => {
    if (e) {
      e.stopPropagation();
    }

    const currentChecked = isChecked;

    try {
      const token = localStorage.getItem("token");

      setIsChecked(!currentChecked);

      const response = await axios.patch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${taskId}/toggle`, null, {
        params: { userId },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.status === 200) {
        onToggle(taskId);
      }
    } catch (e) {
      console.error("isCompleteの更新に失敗しました：", e);
      setIsChecked(currentChecked);
    }
  };

  const togglePopup = () => setIsOpen((prev) => !prev);

  useClickOutside([popupRef, btnRef], () => setIsOpen(false));

  const handleDelete = async (taskId: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/tasks/${taskId}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      onDelete(taskId);
      setIsOpen(false);

      console.log("Task deleted successfully", response.data);
      console.log("Status:", response.status);
    } catch (e) {
      console.error("タスクの削除に失敗：", e);
    }
  };

  return (
    <TaskLi key={taskId} $isComplete={$isComplete}>
      <div>
        <AnimatedCheckbox
          type="checkbox"
          checked={isChecked}
          onChange={handleChange}
          initial={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale: $isComplete ? [1, 1.2, 1] : 1,
            transition: { duration: 0.12 },
          }}
        />
        {taskName}
      </div>
      <ThreePointLeader ref={btnRef} onClick={togglePopup}>
        ⋮
      </ThreePointLeader>
      <AnimatePresence>
        {isOpen && (
          <PopupWrapper ref={popupRef} initial={{ opacity: 0, scale: 0.8, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.8, y: 10 }} transition={{ duration: 0.1 }} onClick={(e) => e.stopPropagation()}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete(taskId);
              }}
            >
              削除
            </button>
          </PopupWrapper>
        )}
      </AnimatePresence>
    </TaskLi>
  );
};

export default TaskItem;
