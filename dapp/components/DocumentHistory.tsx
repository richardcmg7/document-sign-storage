import React, { useEffect, useState } from 'react';
import { useContract } from '../hooks/useContract';

export default function DocumentHistory() {
  const { getDocumentCount, getDocumentHashByIndex, getDocumentInfo } = useContract();
  const [documents, setDocuments] = useState<any[]>([]);

  const [error, setError] = useState<string>('');
  useEffect(() => {
    const fetchDocs = async () => {
      try {
        const count = await getDocumentCount();
        const docs = [];
        for (let i = 0; i < count; i++) {
          const hash = await getDocumentHashByIndex(i);
          const info = await getDocumentInfo(hash);
          console.log('Hash:', hash, 'Info:', info);
          docs.push({ hash, info });
        }
        setDocuments(docs);
      } catch (err: any) {
        setError('Error al cargar historial: ' + (err?.message || err));
        console.error('Error al cargar historial:', err);
      }
    };
    fetchDocs();
  }, []);

  return (
    <div className="overflow-x-auto">
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full text-xs">
        <thead>
          <tr>
            <th>Hash</th>
            <th>Signer</th>
            <th>Timestamp</th>
            <th>Signature</th>
          </tr>
        </thead>
        <tbody>
          {documents.map((doc, i) => (
            <tr key={i}>
              <td className="break-all">{doc.hash}</td>
              <td>
                <span>{doc.info[2]}</span>
                <button
                  className="ml-2 text-xs text-blue-600 underline"
                  onClick={() => {
                    navigator.clipboard.writeText(doc.info[2]);
                  }}
                  title="Copiar dirección"
                >
                  Copiar
                </button>
              </td>
              <td>{new Date(Number(doc.info[1])).toLocaleString()}</td>
              <td className="break-all">{doc.info[3]?.slice(0, 10)}...{doc.info[3]?.slice(-10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
