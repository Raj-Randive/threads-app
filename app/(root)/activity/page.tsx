import { fetchUser, getActivity } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';


const Page = async () => {

    // If the user is onboarded then only show this page else redirect the user to "/onboarding"
    const user = await currentUser();
    if (!user) return null;

    // fetchUser is another user-actions we have to create
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding')

    // Get Activity (Notifications)
    const activity = await getActivity(userInfo._id);


    return (
        <section>
            <h1 className="head-text mb-10">Activity</h1>

            <section className='mt-10 flex flex-col gap-5'>

                {activity.length > 0 ? (
                    <>
                        {activity.map((eachActivity) => (
                            <Link key={eachActivity._id} href={`/thread/${eachActivity.parentId}`}>
                                <article className='activity-card'>
                                    <div className='h-[40px] w-[40px] overflow-hidden flex justify-center items-center rounded-full relative'>
                                        <Image
                                            src={eachActivity.author.image}
                                            alt='Profile Picture'
                                            // width={20}
                                            // height={20}
                                            layout='fill'
                                            className='rounded-full object-cover h-auto absolute'
                                        />

                                    </div>
                                    <p className='!text-small-regular text-light-1'>
                                        <span className='mr-1 text-primary-500'>{eachActivity.author.name}</span> replied to your thread
                                    </p>
                                </article>
                            </Link>
                        ))}
                    </>
                ) : (
                    <p className='!text-base-regular text-light-3'>No Activity yet</p>
                )}

            </section>

        </section>
    )
}

export default Page