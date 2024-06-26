"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
// import { createThread } from "@/lib/actions/thread.actions";
import { addCommentToThread } from "@/lib/actions/thread.actions";
import { CommentValidation } from "@/lib/validations/thread";
import Image from "next/image";


interface Props {
    threadId: string;
    currentUserImg: string;
    currentUserId: string;
}

const Comment = ({ threadId, currentUserImg, currentUserId }: Props) => {
    const pathName = usePathname();
    const router = useRouter();

    // ****************************************************
    const form = useForm({
        // Pass our own Validation
        resolver: zodResolver(CommentValidation),
        defaultValues: {
            thread: "",
        }
    })

    const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
        // Logic to create a reply to a specific Thread

        await addCommentToThread(
            threadId,
            values.thread,
            JSON.parse(currentUserId),
            pathName
        );  // A backend action

        form.reset();
    }


    return (
        <Form {...form}>

            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="comment-form"
            >
                <FormField
                    control={form.control}
                    name="thread"
                    render={({ field }) => (
                        <FormItem className="flex gap-3 w-full items-center">
                            <FormLabel>
                                <Image
                                    src={currentUserImg}
                                    alt="Profile Image"
                                    width={48}
                                    height={48}
                                    className="rounded-full object-cover"
                                />
                            </FormLabel>
                            <FormControl className="border-none bg-transparent">
                                <Input
                                    type="text"
                                    placeholder="Comment..."
                                    className="no-focus text-light-1 outline-none"
                                    {...field}
                                />
                            </FormControl>

                        </FormItem>
                    )}
                />

                <Button type="submit" className="comment-form_btn">
                    Reply
                </Button>

            </form>
        </Form>
    )
}

export default Comment;