const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export async function compileTenderDNA(file: File) {
  const formData = new FormData();
  // Ensure the field name matches what FastAPI expects.
  formData.append('file', file);
  
  const response = await fetch(`${API_BASE_URL}/dna-compiler/compile-tender-dna`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
    throw new Error('DNA Compilation failed');
  }
  
  return response.json();
}

export async function executeLogicGate(tenderId: string, bidderFiles: File[]) {
  const formData = new FormData();
  formData.append('tender_id', tenderId);
  bidderFiles.forEach(file => {
    formData.append('bidder_documents', file);
  });
  
  const response = await fetch(`${API_BASE_URL}/logic-gate/execute-logic-gate`, {
    method: 'POST',
    body: formData,
  });
  
  if (!response.ok) {
     throw new Error('Logic-gate execution failed');
  }
  
  return response.json();
}
