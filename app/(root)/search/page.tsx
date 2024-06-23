import UserCard from '@/components/cards/UserCard';
import { fetchUser, fetchUsers } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';


const Page = async () => {

    // If the user is onboarded then only show this page else redirect the user to "/onboarding"
    const user = await currentUser();
    if (!user) return null;

    // fetchUser is another user-actions we have to create
    const userInfo = await fetchUser(user.id);
    if (!userInfo?.onboarded) redirect('/onboarding')

    // Fetch all the users for search functionality

    const result = await fetchUsers({
        userId: user.id,
        searchString: "",
        pageNumber: 1,
        pageSize: 25,

    })
    // console.log(result);

    return (
        <section>
            <h1 className="head-text mb-10">Search</h1>

            {/* Search Bar */}
            <div className="mt-14 flex flex-col gap-9">
                {result.users.length === 0 ? (
                    <p className='no-result'>No Users</p>
                ) : (
                    <>
                        {result.users.map((eachPerson) => (
                            <UserCard
                                key={eachPerson.id}
                                id={eachPerson.id}
                                name={eachPerson.name}
                                username={eachPerson.username}
                                imgUrl={eachPerson.image}
                                personType="User"
                            />
                        ))}
                    </>
                )}
            </div>
        </section>
    )
}

export default Page