"use client";

import { useState } from "react";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { FormattedPlan } from "../page";
import { EditPlanDialog } from "./edit-plan-dialog";

interface PlansClientProps {
  data: FormattedPlan[];
}

export function PlansClient({ data }: PlansClientProps) {
  const [editingPlan, setEditingPlan] = useState<FormattedPlan | null>(null);

  const handleEdit = (plan: FormattedPlan) => {
    console.log("Editando plano:", plan);
    setEditingPlan(plan);
  };

  return (
    <>
      <EditPlanDialog 
        plan={editingPlan}
        onClose={() => setEditingPlan(null)}
      />
      <DataTable
        columns={columns}
        data={data}
        meta={{
            onEdit: handleEdit
        }}
      />
    </>
  );
} 