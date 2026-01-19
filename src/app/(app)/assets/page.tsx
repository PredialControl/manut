import { getAssetStructure } from "./_actions/get-asset-structure";
import { AssetTree } from "./_components/asset-tree";
import { CreateHierarchyDialog } from "./_components/create-hierarchy-dialog";

interface AssetPageProps {
  searchParams: {
    contractId?: string;
  };
}

export default async function AssetPage({ searchParams }: AssetPageProps) {
  const { contractId } = searchParams;

  if (!contractId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] bg-background">
        <p className="text-muted-foreground">Selecione um contrato para visualizar os ativos.</p>
      </div>
    );
  }

  const structure = await getAssetStructure(contractId);

  return (
    <div className="flex-1 p-6 bg-background min-h-screen custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-end">
          <CreateHierarchyDialog contractId={contractId} />
        </div>
        <AssetTree initialData={structure} contractId={contractId} />
      </div>
    </div>
  );
}
