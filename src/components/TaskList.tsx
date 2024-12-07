import React from 'react';
import { Editor } from '@tiptap/react';
import { Node } from 'prosemirror-model';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

interface TaskListProps {
  editor: Editor | null;
}

const TaskList: React.FC<TaskListProps> = ({ editor }) => {
  if (!editor) return null;

  const toggleTask = (index: number) => {
    editor.commands.command(({ tr, dispatch }) => {
      const taskItems: Node[] = [];
      tr.doc.descendants((node, pos) => {
        if (node.type.name === 'taskItem') {
          taskItems.push(node);
          if (taskItems.length - 1 === index) {
            if (dispatch) {
              tr.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                checked: !node.attrs.checked,
              });
            }
            return false;
          }
        }
        return true;
      });
      return true;
    });
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 dark:bg-red-900/20';
      case 'medium':
        return 'bg-yellow-100 dark:bg-yellow-900/20';
      case 'low':
        return 'bg-green-100 dark:bg-green-900/20';
      default:
        return 'bg-gray-100 dark:bg-gray-900/20';
    }
  };

  const getTasks = (): Task[] => {
    const tasks: Task[] = [];
    editor.state.doc.descendants((node, pos) => {
      if (node.type.name === 'taskItem') {
        tasks.push({
          id: `task-${pos}`,
          text: node.textContent,
          completed: !!node.attrs.checked,
          priority: node.attrs.priority || 'medium',
        });
      }
      return true;
    });
    return tasks;
  };

  const renderTaskItem = (task: Task, index: number) => (
    <div
      key={task.id}
      className={`group flex items-center gap-3 p-2 rounded-lg transition-all ${
        getPriorityColor(task.priority)
      } ${task.completed ? 'opacity-70' : ''}`}
    >
      <button
        onClick={() => toggleTask(index)}
        className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all ${
          task.completed
            ? 'bg-light-accent dark:bg-dark-accent border-light-accent dark:border-dark-accent'
            : 'border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-accent'
        }`}
      >
        {task.completed && (
          <svg
            className="w-full h-full text-white p-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        )}
      </button>
      <span
        className={`flex-grow text-light-text-primary dark:text-dark-text-primary ${
          task.completed ? 'line-through' : ''
        }`}
      >
        {task.text}
      </span>
      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          className="p-1 rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
          title="Move up"
          onClick={() => editor.commands.liftListItem('taskItem')}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 15l7-7 7 7"
            />
          </svg>
        </button>
        <button
          className="p-1 rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
          title="Move down"
          onClick={() => editor.commands.sinkListItem('taskItem')}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
        <button
          className="p-1 rounded hover:bg-light-accent/20 dark:hover:bg-dark-accent/20"
          title="Set priority"
          onClick={() => {
            const priorities = ['low', 'medium', 'high'];
            const currentIndex = priorities.indexOf(task.priority);
            const nextPriority = priorities[(currentIndex + 1) % priorities.length];
            editor.commands.updateAttributes('taskItem', { priority: nextPriority });
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
            />
          </svg>
        </button>
      </div>
    </div>
  );

  const tasks = getTasks();
  const completedTasks = tasks.filter(task => task.completed).length;
  const progressPercentage = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

  return (
    <div className="space-y-2">
      {/* Progress Bar */}
      <div className="h-2 bg-light-border/30 dark:bg-dark-border/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-light-accent dark:bg-dark-accent transition-all"
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      {/* Task Items */}
      <div className="space-y-2">
        {tasks.map((task, index) => renderTaskItem(task, index))}
      </div>

      {/* Add Task Button */}
      <button
        onClick={() => editor.commands.toggleTaskList()}
        className="w-full mt-2 p-2 rounded-lg border-2 border-dashed border-light-border dark:border-dark-border hover:border-light-accent dark:hover:border-dark-accent text-light-text-secondary dark:text-dark-text-secondary hover:text-light-text-primary dark:hover:text-dark-text-primary transition-all"
      >
        + Add Task
      </button>
    </div>
  );
};

export default TaskList;
