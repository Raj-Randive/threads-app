import { fetchUserPosts } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import ThreadCard from "../cards/ThreadCard";

interface Props {
    currentUserId: string;
    accountId: string;
    accountType: string;
}

const ThreadsTab = async ({ currentUserId, accountId, accountType }: Props) => {

    //TODO: Fetch Profile threads
    let result = await fetchUserPosts(accountId);
    if (!result) redirect('/')

    return (
        <section className="mt-9 flex flex-col gap-10">
            {result.threads.map((eachRes: any) => (
                <ThreadCard
                    key={eachRes._id}
                    id={eachRes._id}
                    currentUserId={currentUserId}
                    parentId={eachRes.parentId}
                    content={eachRes.text}
                    author={
                        accountType === 'User'
                            ? { name: result.name, image: result.image, id: result.id }
                            : { name: eachRes.author.name, image: eachRes.author.image, id: eachRes.author.id }
                    }
                    community={eachRes.community} // TODO:
                    createdAt={eachRes.createdAt}
                    comments={eachRes.children}
                />
            ))}
        </section>
    )
}

export default ThreadsTab;