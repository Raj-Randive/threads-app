"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

// import { updateUser } from "@/lib/actions/user.actions";
import { createThread } from "@/lib/actions/thread.actions";
import { ThreadValidations } from "@/lib/validations/thread";


function PostThread({ userId }: { userId: string }) {
    const pathName = usePathname();
    const router = useRouter();

    // ****************************************************
    const form = useForm({
        // Pass our own Validation
        resolver: zodResolver(ThreadValidations),
        defaultValues: {
            thread: "",
            accountId: userId,
        }
    })

    const onSubmit = async (values: z.infer<typeof ThreadValidations>) => {
        // Logic to create a Thread-Post

        await createThread({
            text: values.thread,
            author: userId,
            communityId: null,
            path: pathName,
        });  // A backend action

        router.push("/")
    }

    return (
        <>
            <Form {...form}>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="mt-10 flex flex-col justify-start gap-10"
                >
                    <FormField
                        control={form.control}
                        name="thread"
                        render={({ field }) => (
                            <FormItem className="flex flex-col gap-3 w-full">
                                <FormLabel className="text-base-semibold text-light-2">
                                    Content
                                </FormLabel>
                                <FormControl>
                                    <Textarea
                                        rows={15}
                                        className="no-focus border border-dark-4 bg-dark-3 text-light-1"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                                {/* <FormDescription>
                                This is your public display name.
                            </FormDescription> */}
                                {/* <FormMessage /> */}
                            </FormItem>
                        )}
                    />

                    <Button type="submit" className="bg-primary-500">
                        Post Thread
                    </Button>

                </form>
            </Form>
        </>
    )
}

export default PostThread;