import { Account, Avatars, Client, Databases, ID, Query ,Storage} from 'react-native-appwrite';
import {endpoint,platform,projectId,databaseId,userCollectionId,videoCollectionId,storageId} from '@env'
export const appwriteConfig = {
    endpoint: endpoint,
    platform,
    projectId,
    databaseId,
    userCollectionId,
    videoCollectionId,
    storageId
}

// Init your react-native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfig.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfig.projectId) // Your project ID
    .setPlatform(appwriteConfig.platform) // Your application ID or bundle ID.
    ;

const account = new Account(client);
const avatars = new Avatars(client)
const databases = new Databases(client)
const storage = new Storage(client)

export const createUser = async ({ email, password, username }) => {
    try {
        const newAccount = await account.create(ID.unique(), email, password, username)
        if (!newAccount) {
            throw Error
        }
        const avatarUrl = avatars.getInitials(username)
        await signIn({email, password})

        const newUser = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                password,
                username,
                avatar: avatarUrl
            }
        )
        return newUser;
    } catch (error) {
        throw new Error(error)
    }

}
export const signIn = async ({ email, password }) => {
    try {
        const session = await account.createEmailSession(email, password)
        return session;
    } catch (error) {
        throw new Error(error)
    }

}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get()

        if (!currentAccount) {
            throw Error
        }

        const currentUser =await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )
        if (!currentUser) {
            throw Error
        }
        return currentUser.documents[0]
    } catch (error) {
        throw new Error(error)
    }
}

export const getAllPost = async ()=>{
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,[Query.orderDesc('$createdAt')])
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getAllLatestPost = async ()=>{
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,[Query.orderDesc('$createdAt',Query.limit(7))])
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const searchPost = async (query)=>{
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,[Query.search('title',query)])
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}

export const getUserPost = async (userId)=>{
    try {
        const posts = await databases.listDocuments(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,[Query.equal('users',userId)])
        return posts.documents
    } catch (error) {
        throw new Error(error)
    }
}
export const signout = async ()=>{
    try {
       const session = await account.deleteSession('current')
       return session;
    } catch (error) { 
        throw new Error(error)
    }
}


// Create Video Post
export async function createVideoPost(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.thumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        appwriteConfig.databaseId,
        appwriteConfig.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          thumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          users: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }
  export async function uploadFile(file, type) {
    if (!file) return;
  
    let assets = {
        name: file.fileName,
        type: file.mimeType,
        size: file.fileSize,
        uri: file.uri,
    }
  
    try {
      const uploadedFile = await storage.createFile(
        appwriteConfig.storageId,
        ID.unique(),
        assets
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

// Get File Preview
export async function getFilePreview(fileId, type) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(appwriteConfig.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          appwriteConfig.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }
  


  export const deletePost = async(postId)=>{
    try {
        const posts = await databases.deleteDocument(appwriteConfig.databaseId,appwriteConfig.videoCollectionId,postId)
        return posts
    } catch (error) {
        throw new Error(error)
    }
   
  }