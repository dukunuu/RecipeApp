import { createStore } from "vuex";
import { doc, getFirestore } from "firebase/firestore";
import { auth,db } from "../firebase/index";
import { getDoc, getDocs, query, where, collection, updateDoc, deleteDoc  } from "firebase/firestore";

const store = createStore({
  state: {
    passthroughEmail: "",
    passthroughSearch: "",

    user: null,
    profileEmail: null,
    profileUserName: null,
    profileFirstName: null,
    profileLastName: null,
    profileID: null,
    profilePhotoURL: null,
    profilePhoneNumber: null,

    recipes:[],
    recipeUsername:null,
    recipe: null,
    recipeID: null,
    recipeTitle: null,
    recipeDescription:null,
    recipePhotoURL: null,
    recipeIngredients: [],
    recipePreparation: [],
    recipeServings: null,
    recipePreparationTime: null,
    recipeYoutubeLink: null,
    recipeOwnerID: null,
    recipeDate: null,
  },
  mutations: {
    updatePassthroughEmail(state, email) {
      state.passthroughEmail = email;
    },
    updateSearch(state, search) {
      state.passthroughSearch=search;
    },
    setProfileInfo(state, profileInfo) {
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;
      state.profileEmail = profileInfo.email;
      state.profileFirstName = profileInfo.firstName;
      state.profileLastName = profileInfo.lastName;
      state.profileUserName = profileInfo.username;
      state.profileID = uid;
      state.profilePhotoURL = profileInfo.photoURL;
      state.profilePhoneNumber = profileInfo.phoneNumber;
    },
    updateUser(state, user) {
      state.user = user;
    },
    setRecipeInfo(state, recipeInfo) {
      state.recipeTitle = recipeInfo.title;
      state.recipePhotoURL = recipeInfo.photo;
      state.recipeIngredients = recipeInfo.ingredients;
      state.recipePreparation = recipeInfo.preparation;
      state.recipeServings = recipeInfo.servings;
      state.recipeDate = recipeInfo.date;
      state.recipePreparationTime = recipeInfo.preparationTime;
      state.recipeYoutubeLink = recipeInfo.youtubeLink;
      state.recipeOwnerID = recipeInfo.ownerID;
    },
    changeFirstName(state, firstName) {
      state.profileFirstName = firstName;
    },
    changeLastName(state, lastName) {
      state.profileLastName = lastName;
    },
    changeUserName(state, userName) {
      state.profileUserName = userName;
    },
    changePhotoURL(state, photoURL) {
      state.profilePhotoURL = photoURL;
    },
    changeUserPhoneNumber(state, phoneNumber) {
      state.profilePhoneNumber = phoneNumber;
    },
    setRecipeOwner(state, username){
      state.recipeUsername = username;
    },
    setRecipeValues(state, recipe){
      state.recipeID=recipe.id;
      state.recipeDescription=recipe.description;
      state.recipeTitle=recipe.title;
      state.recipePhotoURL=recipe.imageURL;
      state.recipeIngredients=recipe.ingredients;
      state.recipePreparation=recipe.steps;
      state.recipeServings=recipe.servings;
      state.recipePreparationTime=recipe.timeToPrepare;
      state.recipeYoutubeLink=recipe.youTubeURL;
    },
    setRecipeTitle(state, title){
      state.recipeTitle=title;
    },
    setRecipeDescription(state, description){
      state.recipeDescription=description;
    },
    setRecipeServings(state,servings){
      state.recipeServings=servings;
    },
    setRecipeDescription(state, description){
      state.recipeDescription=description;
    },
    setRecipePreparationTime(state, time){
      state.recipePreparationTime=time;
    },
    setRecipeYoutubeLink(state, link){
      state.recipeYoutubeLink=link;
    }
  },
  actions: {
    async getCurrentUser({ commit, dispatch }) {
      const db = getFirestore();
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;
      const userRef = doc(db, "users", uid);
      const userSnap = await getDoc(userRef);
      commit("setProfileInfo", userSnap.data());
      dispatch("getRecipes");
    },
    async updateUserSettings({ state }) {
      const db = getFirestore();
      const updatedData = {
        firstName: state.profileFirstName,
        lastName: state.profileLastName,
        username: state.profileUserName,
        photoURL: state.profilePhotoURL,
        phoneNumber: state.profilePhoneNumber,
      };
      const currentUser = auth.currentUser;
      const uid = currentUser.uid;
      const documentRef = doc(db, "users", uid);
      try {
        await updateDoc(documentRef, updatedData);
        console.log("Document updated successfully!");
      } catch (error) {
        console.error("Error updating document:", error);
      }
    },
    async getUserName({commit},userID){
      const users=doc(db,"users",userID);
      try {
        const userSnapshot = await getDoc(users);
        const userData = userSnapshot.data();
        const userName = userData.username;    
        commit("setRecipeOwner",userName);
      } catch (error) {
        console.error("Error retrieving user name:", error);
        return null;
      }
    },
    deleteDocument({ dispatch }, documentId) {
      const collectionRef = doc(db, 'recipes', documentId);
  
      deleteDoc(collectionRef)
        .then(() => {
          console.log('Document successfully deleted!');
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          throw error;
        });
      dispatch("getRecipes");
      
    },
    async getRecipes({state}) {
      try {
        const recipesQuery = query(
          collection(db, "recipes"),
          where("userID", "==", state.profileID)
        );
        const recipesSnapshot = await getDocs(recipesQuery);
        const recipes = recipesSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        state.recipes = recipes;
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    },
  },
});

export default store;
