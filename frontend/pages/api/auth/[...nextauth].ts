import NextAuth from "next-auth";

import { communityAuthOptions } from "./communityAuthOptions";

const authOptions = communityAuthOptions;

export default NextAuth(authOptions);
