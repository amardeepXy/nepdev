import { account, database, avatar, ID, appwriteConfig, storage} from "./config.appwrite";
import { Query } from 'appwrite';

const {databaseId, usersCollectionID, postsCollectionID, bucketID, savesCollectionID, commentsCollectionID} = appwriteConfig;

export async function createUserAccount ( data ){
    const { name, username, email, password } = data;
    if(!name || !username || !email || !password) throw new Error('Name, username, email and password are required');
    try {
        const newAccount =  await account.create(ID.unique(), email, password, name);

        if(!newAccount) throw new Error('Failed to create account');

        const avatarUrl = avatar.getInitials(name);

        const newUser =  await saveUserToDb({
            name,
            username,
            email,
            accountId: newAccount.$id,
            imageUrl: avatarUrl,
            bio: ''
        });

        return newUser;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || 'Failed to create account');
    }
}

export async function saveUserToDb ( data ){
    try {
        const newUser = await database.createDocument(databaseId, usersCollectionID, ID.unique(), data);
        return newUser;
    } catch (error) {
         console.log(error);
         account.deleteIdentity(data.accountId);
         throw new Error(error.message || 'Failed to save user to db');
    }
}

export async function signInUser ( data= { email: '', password: '' }){
    const { email, password } = data;
    if(!email || !password) throw new Error('Email and password are required');
    try {
        const session = await account.createEmailPasswordSession(email, password);
        if(!session) throw new Error('Sign in failed');
        return session;
    } catch (error) {
        throw new Error(error.message || 'Sign in failed');
    }
}

export async function getAccount () {
    try {
        const currentAccount = await account.get('current');
        return currentAccount;
    } catch (error) {
        throw new Error(error?.message);
    }
}

export async function getUserFromDb (userId){
    if(!userId) throw new Error('User ID is required');
    console.log('Gettting current user from db');
    try {
        if(!userId){
         const userId = await getAccount().$id;
         return await database.listDocuments(databaseId, usersCollectionID, [Query.equal('accountId', userId)]);   
        }
        const currentUser = await database.listDocuments(databaseId, usersCollectionID, [Query.equal('accountId', userId)]);
        return currentUser;
    } catch (error) {
        throw new Error(error.message || 'Failed to get current user');
    }
}

export async function logout (){
    try {
       return await account.deleteSession("current");
    } catch (error) {
        throw new Error(error?.message);
    }
}

export async function createPost(post){
    // check if there is a post
    if(!post) throw new Error('Post is required');
    if(!post.accountId) throw new Error('user ID is required: -client code error');
    console.log(post.files.length);
    let newPost;
    let fileId;
    try {
        if(post.files.length > 0) {
            // upload the file and get 
               fileId = await uploadFile(post.files[0]);
               fileId = fileId.$id;
        }
    //  get the file link of the uploaded file  
       const fileLink = post.files.length > 0 ? getFilePreview(fileId): null;
    //  check for a file link, If not link then delete the uploaded file
       if(!fileLink && fileId) {
           await deleteFile(fileId);
           throw new Error('failed to get file link');
       }
    
    //  convert the tags to an array
    const tags = post.tags?.replace(/ /g, '').split(',') || [];

    // creation of post when there is file
       if(post.files.length > 0) {
        console.log('choosing with image one');
           newPost = await database.createDocument(databaseId, postsCollectionID, ID.unique(), {
               caption: post.caption,
               imageId: fileId,
               imageURL: fileLink,
               tags: tags || [],
               location: post.location || '',
               postedBy: post.accountId
           });
       }else if(post.files.length === 0) {
        console.log('choosing without image one');
           newPost = await database.createDocument(databaseId, postsCollectionID, ID.unique(), {
               caption: post.caption,
               tags: tags || [],
               location: post.location || '',
               postedBy: post.accountId
           });
       }

    //  delete the uploaded file if failed to create post
       if(!newPost) {
        if(fileId) await deleteFile(fileId);
        throw new Error('Failed to create post');
       }
       return newPost;
    } catch (error) {
        throw new Error(error.message || 'Failed to create post');
    }
}

export async function uploadFile(file){
    
    console.log('uploading file', file);
    try {
        const newFile = await storage.createFile(bucketID, ID.unique(), file);
        console.log(newFile);
        return newFile;
    } catch (error) {
        console.log(error);
        throw new Error(error.message || 'Failed to upload file');
    }
}

export function getFilePreview(fileId){
    console.log('getting file preview');
    try {
        const fileUrl = storage.getFilePreview(bucketID, fileId, 1000, 1000, 'top', 100);
        return fileUrl;
    } catch (error) {
        throw new Error(error.message || 'Failed to get file preview');
    }
}

export async function deleteFile(fileId){
    try {
        await storage.deleteFile(bucketID, fileId);
        return {status: true};
    } catch (error) {
        throw new Error(error.message || 'Failed to delete file');
    }
}

export async function getRecentPost(){
    try {
        const recentPosts = database.listDocuments(databaseId, postsCollectionID, [Query.orderDesc('$createdAt'), Query.limit(20)]);
        if(!recentPosts) throw new Error('No post found, Please try reloading the page');
        return recentPosts;
    } catch (error) {
        throw new Error(error.message || 'No post found, Please try reloading the page');
    }
}

export async function likePost(postId, newLikesArray){
   if(!postId) throw new Error('Post ID is required');
   console.log(newLikesArray);
   try {
    return await database.updateDocument(databaseId, postsCollectionID, postId, {
        likes: newLikesArray})
   } catch (error) {
    throw new Error(error.message || 'Failed to like post');
   }
}

export async function savePost(postId, userId, operation) {
    console.log(postId, userId);
    if(!postId) throw new Error('Post ID is required');
    if(!operation) throw new Error('Operation is required');
    try {
        if(operation === 'ADD') {
            return await database.createDocument(databaseId, savesCollectionID, ID.unique(), {
                savedBy: userId,
                post: postId
            });
        }else if(operation === 'DELETE'){
            return await database.deleteDocument(databaseId, savesCollectionID, postId);
        }else{
            throw new Error('Invalid operation');
        }
    } catch (error) {
        console.log(error);
        throw new Error(error.message || 'Failed to save post');
    }
}

export async function getPostById(postId){
    if(!postId) throw new Error('Post ID is required');
    try{
        return await database.getDocument(databaseId, postsCollectionID, postId);
    }catch(err){
        throw new Error(err.message || 'Error in getting post by post id');
    }
}

export async function updatePostById(postId, updatedData, prevData){
    if(!postId && !updatedData) throw new Error('Please provide post\'s id and post data');

    try{

        const tags = updatedData.tags?.replace(/ /g, '').split(',') || []
       
        //  update document without altering imageId and imageURL of previous post
        if(updatedData.files.length === 0 || prevData.imageURL === updatedData.files ){

            //  Delete previos image if it has (expect same imageUrl and files)
            if(prevData.imageId && prevData.imageURL !== updatedData.files) await deleteFile(prevData.imageId);
            
            return await database.updateDocument(databaseId, postsCollectionID, prevData.$id, {
                caption: updatedData.caption,
                tags,
                location: updatedData.location || ''
            });
        
        }else if(updatedData.files.length > 0 && updatedData.files !== prevData.imageURL){

            // 1. upload image in bucket
            const newImageId = (await uploadFile(updatedData.files[0])).$id;
            if(!newImageId) throw new Error('Unable to upload image on server');

            // 2. delete old image
            if(prevData.imageId) await deleteFile(prevData.imageId);
            
            // 3. obtain URL of new image
            const newImageUrl = getFilePreview(newImageId);
            if(!newImageUrl) throw new Error('Unable to get imageUrl from server');

            // 4. Update document
            const updatedPost = await database.updateDocument(databaseId, postsCollectionID, prevData.$id, {
                caption: updatedData.caption,
                tags,
                location: updatedData.location || '',
                imageId: newImageId,
                imageURL: newImageUrl
            });

            // 5. If post update request fails delete uploaded image -Final
            if(!updatedPost) await deleteFile(newImageId);
            return updatedPost;
        }
       
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function getPopularPost({pageParam}){
    const queries = [Query.orderDesc('$updatedAt'), Query.limit(10)];
    if(typeof pageParam !== 'number'){
        console.log(pageParam);
        queries.push(Query.cursorAfter(pageParam.toString()));
    }
    
    try {
        return await database.listDocuments(databaseId, postsCollectionID, queries);
    } catch (error) {
        throw new Error(error.message || 'Error in getting infinite post' );
    }
}

export async function searchPosts(pageParam, searchTerm){

    const queries = [Query.search('caption', searchTerm), Query.limit(15)]
    console.log(searchTerm, pageParam);
    if(pageParam){
        console.log('i am also runnig')
        queries.push(Query.cursorAfter(pageParam));
    }
    
    try {
        return await database.listDocuments(databaseId, postsCollectionID, queries);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export async function getSavedPost(userId){
    if(!userId) throw new Error('must need user id to get saved post -Client error');
    try {
        return await database.listDocuments(databaseId, savesCollectionID, [Query.equal('savedBy', userId)]);
    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

export async function getAllUsers(){
    try {
        return await database.listDocuments(databaseId, usersCollectionID);
    } catch (error) {
        throw new Error(error.message);
    }
}

export async function getUserById(userId){
    if(!userId) throw new Error('Need user id to get user account -api.js');

    try {
        return await database.listDocuments(databaseId, usersCollectionID, [Query.equal('$id', userId)]);
    } catch (error) {
        throw new Error(error.message || 'Uknown error');
    }
}

// export async function getAllPostOfUser(userId){
//     if(!userId) throw new Error('Must need user id to get user\'s all post ');
//     try {
//         database.listDocuments
//     } catch (error) {
        
//     }
// }

export async function getCommentsByPostId(postId, offSet){
    if(!postId || !offSet) throw new Error("Unknown post, -application error");
    const query = [ Query.and([Query.equal("post", postId), Query.isNull("parentCommentId")])];
    return await database.listDocuments(databaseId, commentsCollectionID, query);
}