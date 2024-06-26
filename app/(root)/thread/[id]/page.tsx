import ThreadCard from "@/components/cards/ThreadCard";
import Comment from "@/components/forms/Comment";
import { fetchThreadById } from "@/lib/actions/thread.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

const Page = async ({ params }: { params: { id: string } }) => {

    if (!params.id) return null;

    // We have an id then we need a "User".
    const user = await currentUser();
    if (!user) return null;

    // fetch data from our own database
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding');

    // Fetch the thread by Id
    const thread = await fetchThreadById(params.id)

    return (
        <section className="relative">
            <div>
                <ThreadCard
                    key={thread._id}
                    id={thread._id}
                    currentUserId={user?.id || ""}
                    parentId={thread.parentId}
                    content={thread.text}
                    author={thread.author}
                    community={thread.community}
                    createdAt={thread.createdAt}
                    comments={thread.children}
                />
            </div>

            {/* Replying functionality */}
            <div className="mt-7">
                <Comment
                    threadId={thread.id}
                    currentUserImg={userInfo.image}
                    currentUserId={JSON.stringify(userInfo._id)}
                />
            </div>

            {/* Showing all the comments to a Thread */}
            <div className="mt-10">
                {thread.children.map((eachcomment: any) => (
                    <ThreadCard
                        key={eachcomment._id}
                        id={eachcomment._id}
                        currentUserId={user?.id || ""}
                        parentId={eachcomment.parentId}
                        content={eachcomment.text}
                        author={eachcomment.author}
                        community={eachcomment.community}
                        createdAt={eachcomment.createdAt}
                        comments={eachcomment.children}
                        isComment
                    />
                ))}
            </div>

        </section>
    )
}

export default Page;