import {useForm} from "@conform-to/react";
import {parseWithZod} from "@conform-to/zod";
import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import {HeadphonesIcon} from "@nextui-org/shared-icons";
import {ActionFunctionArgs, json, LoaderFunction, MetaFunction} from "@remix-run/node";
import {useActionData} from "@remix-run/react";

import {z, ZodError} from "zod";
import authenticator from "~/services/auth.server";
import {sessionStorage} from "~/services/session.server";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App Login"},
        {name: "description", content: "Log in!"},
    ];
};

const schema = z.object({
    phone: z.string(),
    password: z.string(),
});

export const loader: LoaderFunction = async ({request}) => {

    await authenticator.isAuthenticated(request, {
        successRedirect: "/"
    });

    const session = await sessionStorage.getSession(
        request.headers.get("Cookie")
    );

    const error = session.get("sessionErrorKey");
    return json<unknown>({error});
};

export async function action({request}: ActionFunctionArgs) {
    const formData = await request.formData();
    const submission = parseWithZod(formData, {schema});
    if (submission.status !== 'success') {
        return submission.reply();
    }
    try {
        return await authenticator.authenticate("user-pass", request, {
            successRedirect: '/',
            context: {formData},
            throwOnError: true,
        });

    } catch (error) {
        return submission.reply({
            formErrors: ['Incorrect username or password'],
        });
    }
}


export default function LoginPage() {
    const lastResult = useActionData<typeof action>()
    const [form, fields] = useForm({
        lastResult,
        shouldValidate: 'onInput',
        onValidate({formData}) {
            return parseWithZod(formData, {schema});
        },

    });

    console.log(form.errors);

    return (
        <div className="container flex flex-col gap-4 m-auto">
            <form onSubmit={form.onSubmit} id={form.id} method="post"
                  className="flex flex-col w-full max-w-96 flex-wrap m-auto gap-4">
                <div>{form.errors}</div>
                <Input
                    type="text"
                    label="Phone"
                    name="phone"
                    placeholder="Your phone"
                    labelPlacement="outside"
                    startContent={
                        <HeadphonesIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                    }
                    isInvalid={!fields.phone.valid}
                    errorMessage={fields.phone.errors}
                />
                <Input
                    type="password"
                    label="Password"
                    name="password"
                    placeholder="User password"
                    labelPlacement="outside"
                    startContent={
                        <HeadphonesIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                    }
                    isInvalid={!fields.password.valid}
                    errorMessage={fields.password.errors}
                />
                <Button type="submit">Submit</Button>
            </form>
        </div>
    );
}

