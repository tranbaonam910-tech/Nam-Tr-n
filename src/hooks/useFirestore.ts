import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

export function useFirestore<T = any>(collectionName: string) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      collection(db, collectionName),
      (snapshot) => {
        const result = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as T[];
        setData(result);
        setLoading(false);
      },
      (err) => {
        console.error(`Error fetching collection ${collectionName}:`, err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [collectionName]);

  return { data, loading, error };
}
