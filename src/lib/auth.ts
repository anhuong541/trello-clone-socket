import { firestoreDB } from "../firebase";
import crypto from "crypto";
import { collection, doc, DocumentData, getDoc, getDocs } from "firebase/firestore";

export const checkUserIsAllowJoiningProject = async (userId: string, projectId: string) => {
  return (await getDoc(doc(firestoreDB, `users`, userId, "projects", projectId))).exists();
};

export const generateUidByString = (inputString: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(inputString);
  const uid = hash.digest("hex");
  return uid.slice(0, 35);
};

export const viewTasksProject = async (projectId: string) => {
  return (await getDocs(collection(firestoreDB, "projects", projectId, "tasks"))).docs.map((item: DocumentData) =>
    item.data()
  );
};
