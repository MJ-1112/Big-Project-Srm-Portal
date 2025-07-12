import {getDocs, collection, getFirestore} from 'firebase/firestore';
import app from './firebaseconfig';

const db = getFirestore(app);

export async function fetchData(){
    const querySelcetor = await getDocs(collection(db,"PendingUpdates"));
    const result ={};
    
    querySelcetor.forEach(doc => {
        const data = doc.data();
    result[doc.id] = {
      updates: data.updates || {} 
    };
  });

  return result; 
}