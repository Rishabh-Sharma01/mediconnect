import firestoreDatabase from "../firebaseConfig";
import { collection, addDoc,query, where, getDocs, getDoc, doc } from "firebase/firestore";
import CryptoJS from "crypto-js";
import { async } from "@firebase/util";

export const CreateUser = async (payload) => {
  try {

    // check if users already exist using mail
    const qry = query(collection(firestoreDatabase,"users"),where("email","==",payload.email))
    const querySnapshot = await getDocs(qry);
    if(querySnapshot.size>0){
      throw new Error("User already exists");
    }

    // hash password
    const hashpassword  = CryptoJS.AES.encrypt(
      payload.password,
      "MediConnect"
    ).toString();
      payload.password= hashpassword;

    const docRef = collection(firestoreDatabase, "users");
    await addDoc(docRef, payload);
    return {
      success: true,
      message: "User created successfully",
    };
  } catch (error) {
    return error;
  }
};

export const LoginUser = async(payload) =>{
  try{
    // check if user is registered or not
    const qry = query(
      collection(firestoreDatabase,"users"),
    where("email","==",payload.email)
      );
    const userSnapshots = await getDocs(qry);
    if (userSnapshots.size ===0){
      throw new Error("User does not Exist");
    }

    //decrypt password
    const user = userSnapshots.docs[0].data();
    user.id = userSnapshots.docs[0].id;
    const bytes = CryptoJS.AES.decrypt(user.password,"MediConnect");
    const orignalPassword = bytes.toString(CryptoJS.enc.Utf8);

    if (orignalPassword !==payload.password){
      throw new Error("Incorrect Password");
    }

    return{
      success : true,
      message : "User Logged in successfully",
      data : user,
    };
}catch(error){
  return error;
}
};

export const GetAllUsers = async () =>{
  try {
    const users = await getDocs(collection(firestoreDatabase,"users"));
    return{
      success:true,
      data: users.docs.map((doc) =>{
        return{
          ...doc.data(),
          id:doc.id,
        };
      }),
    };
  } catch (error) {
    return error;
  }
}

export const GetUserByID = async (id) => {
  try{
    const user = await getDoc(doc(firestoreDatabase,"users",id));
    return{
      success:true,
      data:{
        ...user.data(),
        id:user.id,
      },
    };
  }catch(error){
    return error;
  }
}