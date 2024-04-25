import type {LoaderFunction, MetaFunction} from "@remix-run/node";
import {useLoaderData} from "@remix-run/react";
import {jwtDecode} from "jwt-decode";
import authenticator from "~/services/auth.server";

export const meta: MetaFunction = () => {
    return [
        {title: "New Remix App"},
        {name: "description", content: "Welcome to Remix!"},
    ];
};

export let loader: LoaderFunction = async ({request}) => {
    const token = await authenticator.isAuthenticated(request, {
        failureRedirect: "/login",
    });
    const user = jwtDecode(token.accessToken);
    const req = await fetch('http://localhost:3001/api/places', {
        method: "GET",
        headers: {"content-type": "application/json", authorization: `Bearer ${token.accessToken}`}
    });
    const places = await req.json()
    return {user: user, places: places};
};

export default function Index() {
    const data = useLoaderData<any>();
    const {user, places} = data;
    console.log('index',user);
    return (
        <>
            <div> Hi, {user.name} {user.lastname} </div>
            <ul>
                {places?.map((place, index) => (<li key={index}>{place.name}</li>))}
            </ul>
        </>
    );
}
