import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cva } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { Badge } from "./ui/badge";
import { formatarData } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Defendant } from "./Defendant";
import { apiClient } from "@/services/api";
import { Task } from "./KanbanBoard";

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
}

export type TaskType = "Task";

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay }: TaskCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [responseCase, setResponseCase] = useState<any>([]);

  const fetchData = async () => {
    try {
      const response = await apiClient().get(
        `responses?request_id=${task.request_id}`
      );

      setResponseCase(response.data.page_data[0].response_data);
    } catch (error) {
      console.error("Erro ao obter dados:", error);
    }
  };

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task._id,
    data: {
      type: "Task",
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: "Task",
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva("", {
    variants: {
      dragging: {
        over: "ring-2 opacity-30",
        overlay: "ring-2 ring-primary",
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? "overlay" : isDragging ? "over" : undefined,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        <Button
          variant={"ghost"}
          {...attributes}
          {...listeners}
          className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
        >
          <span className="sr-only">Move task</span>
          <GripVertical />
        </Button>
        <Badge variant={"outline"} className="ml-auto font-semibold">
          {task.status}
        </Badge>
      </CardHeader>
      <CardContent
        className="px-3 pt-3 pb-6 text-left whitespace-pre-wrap"
        onClick={async () => {
          await fetchData();
          setIsOpen(true);
        }}
      >
        <p>
          <strong>Code:</strong> {task.search.search_key}
        </p>
        <small>
          <strong>Created At:</strong> {formatarData(task.created_at)}
        </small>
      </CardContent>

      {isOpen && (
        <Dialog
          open={isOpen}
          modal={false}
          onOpenChange={(show) => {
            setIsOpen(show);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Informações sobre a consulta</DialogTitle>
              <DialogDescription>
                Você consegue acompanhar todas as informações do processo aqui
                no nosso sistema, a Judit trás a melhor time-line das
                informações mais importantes
                <Defendant {...responseCase} />
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
}
