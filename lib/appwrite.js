import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';
export const appwriteConfing = {
    endpoint: 'https://cloud.appwrite.io/v1',
    platform: 'com.ram.aora',
    projectId: '66dd730400367850e8b1',
    databaseId: '66dd75dd003968685f37',
    userCollectionId: '66dd760c0008462cf177',
    videoCollectionId: '66dde425003a1bd3a9e0',
    storageId: '66dd789c003239e51d15',

}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(appwriteConfing.endpoint) // Your Appwrite Endpoint
    .setProject(appwriteConfing.projectId) // Your project ID
    .setPlatform(appwriteConfing.platform) // Your application ID or bundle ID.
;
const account = new Account(client);
const avatars = new Avatars(client);
const databases = new Databases(client);

export const createUser = async (email, password, username)=> {
    // Register User
    try {
        const newAccount = await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username)

        await signIn(email, password)

        const newUser = await databases.createDocument(
            appwriteConfing.databaseId,
            appwriteConfing.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }

}

export async function signIn(email, password){
    try {
        const currentSession = await account.get().catch(() => null);

        if (currentSession) {
            console.log('Session already active:', currentSession);
            return currentSession; // Return the existing session
        }
        
        const session = await account.createEmailPasswordSession(email, password)

        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export const getCurrentUser = async () => {
    try {
        const currentAccount = await account.get();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            appwriteConfing.databaseId,
            appwriteConfing.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;
        return currentUser.documents[0];
    } catch (error) {
        console.log(error);
    }
}

export const getAllPosts = async () => {
    // console.log(appwriteConfing.databaseId);
    // console.log(appwriteConfing.videoCollectionId);
    
    
    try {
        const posts = await databases.listDocuments(
            appwriteConfing.databaseId,
            appwriteConfing.videoCollectionId,
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}

export const geLatestPosts = async () => {
    
    try {
        const posts = await databases.listDocuments(
            appwriteConfing.databaseId,
            appwriteConfing.videoCollectionId,
            [Query.orderDesc('$createdAt'), Query.limit(7)]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}


export const searchPosts = async (query) => {
    
    try {
        const posts = await databases.listDocuments(
            appwriteConfing.databaseId,
            appwriteConfing.videoCollectionId,
            [Query.search('title'), query]
        )
        return posts.documents;
    } catch (error) {
        throw new Error(error);
    }
}
