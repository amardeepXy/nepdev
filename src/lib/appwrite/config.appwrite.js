import { Client, Account, Storage, Databases, Avatars, ID } from "appwrite";

const appwriteConfig = {
    projectID: String(import.meta.env.VITE_APPWRITE_PROJECT_ID),
    endpoint: String(import.meta.env.VITE_APPWRITE_ENDPOINT),
    bucketID: String(import.meta.env.VITE_APPWRITE_BUCKET_ID),
    databaseId: String(import.meta.env.VITE_APPWRITE_DATABASE_ID),

    // //* IMPORTING COLLECTIONS
    usersCollectionID: String(import.meta.env.VITE_APPWRITE_USERS_COLLECTION_ID),
    postsCollectionID: String(import.meta.env.VITE_APPWRITE_POSTS_COLLECTION_ID),
    savesCollectionID: String(import.meta.env.VITE_APPWRITE_SAVES_COLLECTION_ID),
    commentsCollectionID: String(import.meta.env.VITE_APPWRITE_COMMENTS_COLLECTION_ID)
}

const client = new Client()
.setEndpoint(appwriteConfig.endpoint)
.setProject(appwriteConfig.projectID);

export const account = new Account(client);
export const storage = new Storage(client);
export const database = new Databases(client);
export const avatar = new Avatars(client); 

export {appwriteConfig, ID};