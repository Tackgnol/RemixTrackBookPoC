import {Authenticator} from "remix-auth";
import {FormStrategy} from "remix-auth-form";
import {sessionStorage} from "~/services/session.server";

export interface User {
    accessToken: string;
}

// Create an instance of the authenticator, pass a generic with what
// strategies will return and will store in the session
const authenticator = new Authenticator<User>(sessionStorage);

const login = async (phone: string, password: string):Promise<User> => {
    const response = await fetch("http://localhost:3001/api/auth/login", {method: "POST", body: JSON.stringify({phone, password}), headers: {"Content-Type": "application/json"}});

    if (response.ok) {
        return await response.json() as User
    }
    throw new Error("Unable to log in");
}

authenticator.use(
    new FormStrategy<User>(async ({form}: { form: FormData }) => {
        const phone = form.get("phone") as string;
        const password = form.get("password") as string;
        const user = await login(phone, password);
        console.log(user);
        if(!user) {
            throw new Error("Unable to log in");
        }
        return user;
    }),
    // each strategy has a name and can be changed to use another one
    // same strategy multiple times, especially useful for the OAuth2 strategy.
    "user-pass"
);


export default authenticator;
