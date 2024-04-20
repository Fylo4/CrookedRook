import { getFirestore } from "firebase-admin/firestore";

export const getBoardByCode = async (req: any, res: any) => {
    let ret = await getFirestore()
      .collection("Boards")
      .doc(req.params.code)
      .get();
    return res.send(ret.data());
  }