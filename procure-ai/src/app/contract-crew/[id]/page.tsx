import ContractCrewClient from "./ContractCrewClient";

export default function ContractCrewPage({ params }: { params: { id: string } }) {
  return <ContractCrewClient id={params.id} />;
}
