import ProfileHeader from '@/components/shared/ProfileHeader';
import ThreadsTab from '@/components/shared/ThreadsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { profileTabs } from '@/constants';
import { fetchUser } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import Image from 'next/image';
import { redirect } from 'next/navigation';
import React from 'react';


const Page = async ({ params }: { params: { id: string } }) => {

    // If the user is onboarded then only show this page else redirect the user to "/onboarding"
    const user = await currentUser();
    if (!user) return null;

    // fetchUser is another user-actions we have to create
    const userInfo = await fetchUser(params.id);
    if (!userInfo?.onboarded) redirect('/onboarding')


    return (
        <section>
            <ProfileHeader
                accountId={userInfo.id}
                authUserId={user.id}
                name={userInfo.name}
                username={userInfo.username}
                imgUrl={userInfo.image}
                bio={userInfo.bio}
            />

            <div className='mt-9'>
                <Tabs defaultValue="threads" className="w-full">
                    <TabsList className="tab">
                        {profileTabs.map((eachTab) => (
                            <TabsTrigger key={eachTab.label} value={eachTab.value} className="tab">
                                <Image
                                    src={eachTab.icon}
                                    alt={eachTab.label}
                                    width={24}
                                    height={24}
                                    className='object-contain'
                                />
                                <p className="max-sm:hidden">{eachTab.label}</p>

                                {eachTab.label === "Threads" && (
                                    <p className='ml-1 rounded-lg bg-light-4 px-2 py-1 !text-tiny-medium text-light-2'>
                                        {userInfo?.threads?.length}
                                    </p>
                                )}

                            </TabsTrigger>
                        ))}
                    </TabsList>

                    {profileTabs.map((eachTab) => (
                        <TabsContent key={`content-${eachTab.label}`} value={eachTab.value} className="w-full text-light-1">

                            <ThreadsTab
                                currentUserId={user.id}
                                accountId={userInfo.id}
                                accountType="User"
                            />

                        </TabsContent>
                    ))}


                </Tabs>
            </div>

        </section>
    )
}

export default Page;