
export const googleConfig = {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    redirectUriPaths: [
        "/api/auth/google-callback"
    ],
    scopes: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email"
    ]
};

console.assert(googleConfig.clientId);
console.assert(googleConfig.clientSecret);
