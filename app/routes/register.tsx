import {Input} from "@nextui-org/input";
import {Button} from "@nextui-org/react";
import {HeadphonesIcon} from "@nextui-org/shared-icons";
import {Form} from "@remix-run/react";

export default function Register() {
   return ( <div className="container flex flex-col gap-4 m-auto">
        <Form method="post" className="flex flex-col w-full max-w-96 flex-wrap m-auto gap-4">
            <Input
                type="text"
                label="Phone"
                name="phone"
                placeholder="Your phone"
                labelPlacement="outside"
                startContent={
                    <HeadphonesIcon className="text-2xl text-default-400 pointer-events-none flex-shrink-0"/>
                }
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
            />
            <Button type="submit">Submit</Button>
        </Form>
    </div>
   )
}
