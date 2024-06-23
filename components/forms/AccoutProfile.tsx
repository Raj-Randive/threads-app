"use client"

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUser } from "@/lib/actions/user.actions";
import { useUploadThing } from "@/lib/uploadthing";
import { isBase64Image } from "@/lib/utils";
import { UserValidations } from "@/lib/validations/user";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

interface Props {
    user: {
        id: string;
        objectId: string;
        username: string;
        name: string;
        bio: string;
        image: string;
    };
    btnTitle: string;
}

const AccoutProfile = ({ user, btnTitle }: Props) => {

    const pathName = usePathname();
    const router = useRouter();

    // ********************* HOOKS *********************************
    const [files, setFiles] = useState<File[]>([])
    const { startUpload } = useUploadThing("media")

    // *************************************************************

    const form = useForm({
        // Pass our own Validation
        resolver: zodResolver(UserValidations),
        defaultValues: {
            profile_photo: user?.image || "",
            name: user?.name || "",
            username: user?.username || "",
            bio: user?.bio || "",
        }
    })


    // Handle Image Photo when we upload
    const handleImageFunction = (e: ChangeEvent<HTMLInputElement>, fieldChange: (value: string) => void) => {
        e.preventDefault()
        const fileReader = new FileReader();

        if ((e.target.files != null) && (e.target.files.length > 0)) {
            const file = e.target.files[0];

            setFiles(Array.from(e.target.files));

            if (!file.type.includes('image')) return;

            fileReader.onload = async (event) => {
                const imageDataUrl = event.target?.result?.toString() || "";

                // Update the field!
                fieldChange(imageDataUrl);
            }

            // Allow us to change the Image
            fileReader.readAsDataURL(file);
        }
    }

    // Submit handler.
    const onSubmit = async (values: z.infer<typeof UserValidations>) => {
        // Do something with the form values.
        // This will be type-safe and validated.
        console.log(values)

        // Binary Large Objects. Here our image file in known as Blob.
        const blob = values.profile_photo;

        const hasImageChanged = isBase64Image(blob);

        // If image is changed then take that image and upload on database using uploadthing.
        if (hasImageChanged) {
            const imgRes = await startUpload(files)

            if (imgRes && imgRes[0].fileUrl) {
                values.profile_photo = imgRes[0].fileUrl;
            }
        }


        // TODO: Update-User Profile (Backend)
        await updateUser({
            username: values.username,
            name: values.name,
            bio: values.bio,
            image: values.profile_photo,
            userId: user.id,
            path: pathName
        })

        if (pathName === '/profile/edit') {
            router.back();
        }
        else {
            router.push('/');
        }
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="flex flex-col justify-start gap-10"
            >
                <FormField
                    control={form.control}
                    name="profile_photo"
                    render={({ field }) => (
                        <FormItem className="flex items-center w-full gap-4">
                            <FormLabel className="account-form_image-label">
                                {field.value ? (
                                    <div className="h-[96px] w-[96px] overflow-hidden flex justify-center items-center rounded-full relative">
                                        <Image
                                            src={field.value}
                                            alt="profile photo"
                                            // width={96}
                                            // height={96}
                                            priority
                                            layout="fill"
                                            className="rounded-full object-cover h-auto absolute"
                                        />
                                    </div>
                                ) : (
                                    <Image
                                        src="/assets/profile.svg"
                                        alt="profile photo"
                                        width={24}
                                        height={24}
                                        className="object-contain"
                                    />
                                )}
                            </FormLabel>
                            <FormControl className="flex-1 text-base-semibold text-gray-200">
                                <Input
                                    type="file"
                                    accept="image/*"
                                    placeholder="Upload a photo"
                                    className="account-form_image-input"
                                    onChange={(e) => handleImageFunction(e, field.onChange)}
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

                {/* **************************************************************************************     */}
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your Name"
                                    className="account-form_input no-focus"
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

                {/* **************************************************************************************     */}
                <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Username
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type="text"
                                    placeholder="Enter your Name"
                                    className="account-form_input no-focus"
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

                {/* **************************************************************************************     */}
                <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                        <FormItem className="flex flex-col gap-3 w-full">
                            <FormLabel className="text-base-semibold text-light-2">
                                Bio
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={10}
                                    className="account-form_input no-focus"
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

                <Button type="submit">Submit</Button>

            </form>
        </Form>
    )

}
export default AccoutProfile;