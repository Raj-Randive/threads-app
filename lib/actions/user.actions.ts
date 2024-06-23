"use server"

import { FilterQuery, SortOrder } from "mongoose";
import { revalidatePath } from "next/cache";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectToDB } from "../mongoose";

interface Params{
    userId :string,  
    username :string,
    name :string,
    bio :string,
    image :string,
    path:string,
}

export async function updateUser({userId, username, name, bio, image, path,}: Params ): Promise<void>{
    connectToDB();

    try {
        await User.findOneAndUpdate(
            {id: userId}, 
            {
                username: username.toLowerCase(),
                name,
                bio,
                image,
                path,
                onboarded: true,
    
            },
            {upsert: true}
        )
        if (path === '/profile/edit') {
            revalidatePath(path);
        }
        
    } catch (error: any) {
        throw new Error(`Failed to create/update user: ${error.message}`)
    }

}

export async function fetchUser(userId:string){
    try {
        // connect to database first
        connectToDB();

        return await User
        .findOne({id: userId})
        // .populate({
        //     path: 'communities',
        //     model: Community
        // })

    } catch (error: any) {
        throw new Error(`Failed to fetch user: ${error.message}`)
    }
}

export async function fetchUserPosts(userId: string){
    try {
        connectToDB();

        // TODO: Populate community

        // Find all the threads authored by user with the given userId
        const threads = await User.findOne({id: userId})
            .populate({
                path: "threads",
                model: Thread,
                populate: {
                    path: 'children',
                    model: Thread,
                    populate:{
                        path: "author",
                        model: User,
                        select: "name image id"
                    }

                }

            })
        return threads;
    } catch (error: any) {
        throw new Error(`Failed to fetch user posts: ${error.message}`)
    }
}

export async function fetchUsers({ 
    userId,
    searchString = "",
    pageNumber = 1,
    pageSize = 20,
    sortBy = "desc"
 } : {
    userId: string;
    searchString?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: SortOrder;
 }){
    try {
        connectToDB();
        // Implement Pagination Functionality

        // STEP-1: Calculate the numeber of skips based on page number and size.
        const skipAmount = (pageNumber - 1) * pageSize;

        const regex = new RegExp(searchString, "i")

        // Query to get the Users
        const query: FilterQuery<typeof User> = {
            id: { $ne: userId }
        }

        if(searchString.trim() !== ''){
            query.$or = [
                {username: {$regex: regex}},
                {name: {$regex: regex}},
            ]
        }

        // Sorting
        const sortOptions = {createdAt: sortBy};

        // Get the Users based on all above criteria and sorting
        const userQuery = User.find(query)
            .sort(sortOptions)
            .skip(skipAmount)
            .limit(pageSize);
        

        const totalUsersCount = await User.countDocuments(query);

        const users = await userQuery.exec();

        const isNext = totalUsersCount > skipAmount + users.length;

        return {users, isNext};

    } catch (error: any) {
        throw new Error(`Failed to fetch users: ${error.message}`)
    }
    
}

export async function getActivity(userId: string){
    try {
        connectToDB();

        // STEP-1 Find all the threads created by the users
        const userThreads = await Thread.find({author: userId});
        
        // Collect all the child thread ids (replies) from the 'children' field
        const childThreadIds = userThreads.reduce((accumulator, userThread) => {
            return accumulator.concat(userThread.children)
        }, [])
        
        // console.log(childThreadIds);

        // Access to all the replies excluding the ones created by the User.
        const replies  = await Thread.find({
            _id: {$in: childThreadIds},
            author: {$ne: userId}

        }).populate({
            path: "author",
            model: User,
            select: "name image _id"
        })

        return replies;   

    } catch (error: any) {
        throw new Error(`Failed to fetch activity :${error.message}`)
    }
}