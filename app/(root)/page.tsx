import ThreadCard from "@/components/cards/ThreadCard";
import { fetchPosts } from "@/lib/actions/thread.actions";
import { UserButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Home() {
  // Fetch the threads
  const result = await fetchPosts(1, 30);
  // console.log(result);
  const user = await currentUser();

  return (
    <div>
      {/* <UserButton afterSignOutUrl="/"/> */}
      <h1 className="head-text text-left">

        {/* Fetching the threads */}
        <section className="mt-9 flex flex-col gap-10">
          {
            result.posts.length === 0 ? (
              <p className="no-result">No threads found</p>

            ) : (
              <>
                {result.posts.map((eachPost) => (
                  <ThreadCard
                    key={eachPost._id}
                    id={eachPost._id}
                    currentUserId={user?.id || ""}
                    parentId={eachPost.parentId}
                    content={eachPost.text}
                    author={eachPost.author}
                    community={eachPost.community}
                    createdAt={eachPost.createdAt}
                    comments={eachPost.children}
                  />
                ))}
              </>
            )
          }

        </section>


      </h1>
    </div>
  );
}
