import { Application, Router, Response, Cookies, send, Status } from "./deps.ts"  

const jsonFile = await Deno.readFile("./config.json");
const config = JSON.parse(new TextDecoder().decode(jsonFile));

const { bot_id, token, discord_token, oauth_red, oauth_red_url, verification } = config;

// Access nested properties separately
const { guildID, guildIcon } = verification;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const app = new Application();
const router = new Router();

const DEBUG = false;  // set to true to enable debug mode

const DISCORD_API = "https://discord.com/api/";
const DISCORD_CDN = "https://cdn.discordapp.com/";

const OAUTH_REDIRECT_URL = DEBUG ? "http://localhost:8000/auth" : `${oauth_red}`;
const OAUTH_REDIRECT = DEBUG ? "http%3A%2F%2Flocalhost%3A8000%2Fauth" : `${oauth_red_url}`;
const OAUTH_AUTH = `oauth2/authorize?client_id=${bot_id}&redirect_uri=${OAUTH_REDIRECT}&response_type=code&scope=identify%20guilds`
const OAUTH_TOKEN = "oauth2/token";

const GUILD_INFO = {
    id: guildID,
    icon: guildIcon
};

const digitRegex = /^\d+$/;
const restrictedRegex = /(server|student|scu faculty\/staff|@everyone|\*|admin|moderator|bots|scu bot > &help|prospective student|----)/i;
const identityRegex = /^(he\/him|she\/her|they\/them|any pronouns|ask for pronouns)/i;
const memberRegex = /^(alumni|grad|freshman|sophomore|junior|senior)/i;
const concentrationRegex = /^(aimes|asian sts|african american sts|pre-health sci|pre-law|pre-teaching|pastoral ministries|musical theatre|urban edu|catholic sts|med & ren sts|latin american sts|latina\/o\/x sts|actg|actg\/is|aero eng|ancient sts|anth|arabic|applied math|arth|biochem|bioe|biol|coen|busn anlyts|chem|chst|chinese|civil eng|clas|comms|csci|couns|couns psyc|econ \(lsb\)|econ \(cas\)|ecen|educ ldrsp|elen|eng mgmt|eng mgmt & ldrsp|eng phys|english|envr sci|envr sts|entr|ethn|fnce|fnc & anlyts|french|gen eng|german|greek lang\/lit|indv sts|info sys|ital|japn|j\.d\.|j\.d\.\/mba|j\.d\.\/msis|latin\/greek|latin lang\/lit|ll\.m\. u\.s\. law|mgmt|mgmt\/entr|hist|ll\.m\. intel property|ll\.m\. intl & comp law|mis|mktg|math|mech eng|mba|mils|music|neur|online mktg|phil|phys|poli sci|power sys & sust nrg|psyc|phsc|real estate|rels|retail|soci|spanish|studio art|sust food sys|teaching cred \(mattc\)|theatre\/dance|und busn|und arts|und eng|wde|wgst)$/i;
const rlcRegex = /^(alpha|campisi|cura|cyphi|da vinci|modern perspectives|loyola|neighborhood units|nobili|sanfilippo|unity|university villas)/i;
const locationRegex = /^(bay area|rocky mountains|northeast|southeast|midwest|southwest|pacific|international)/i;
const othertagsRegex = /^(commuter|residential|community facilitator|club leader|orientation leader|peer advisor|school employee|ukraine)/i; 

const regexArray = [restrictedRegex, memberRegex, concentrationRegex, rlcRegex, locationRegex, identityRegex, othertagsRegex];

const categoryArray = ["restricted", "member", "concentration", "rlc", "location", "identity", "tags"];

interface AccessToken {
    access_token: string,
    token_type: string,
    expires_in: number,
    refresh_token: string,
    scope: string
};

interface User {
    id: string,
    username: string,
    avatar: string,
    discriminator: string,
    inCorrectGuild: boolean
};

interface Role {
    id: string,
    name: string,
    color: number,
    priority: number,
    category: string | undefined
};

interface Guild {
    id: string,
    name: string,
    icon: string,
    owner: false,
    permissions: number,
    features: string[],
    permissionsNew: string
};

function determineRoleCategory(name: string): string {
    for (const index in regexArray) {
        if (regexArray[index].test(name)) {
            return categoryArray[index]
        }
    };
    return "";   // returns an empty string if there is no role
};

async function getRoles() {
    // requires Bot authorization
    const response = await fetch(DISCORD_API + "guilds/" + GUILD_INFO.id + "/roles", {
        headers: {
            "Authorization": "Bot " + `${token}`
        }
    });

    // remove unnecessary role metadata
    const json = await response.json();
    return json.map((item: any) => {
        return {
            id: item.id,
            name: item.name,
            color: item.color,
            priority: item.position,
            category: determineRoleCategory(item.name)
        };
    });
};

/**
 *
 * @return string
 * @param cookies
 * @param response
 */
async function getIdentity(cookies: Cookies, response: Response) {
    const accessToken = await cookies.get("discord-access-token") ?? "";

    const identityResponse = await fetch(DISCORD_API + "users/@me", {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    });
    if (!identityResponse.ok) {
        if (identityResponse.status === 401) {
            response.status = Status.Unauthorized;
            response.redirect("/bad-auth.html?error=invalid_token");
        } else {
            response.status = Status.InternalServerError;
            response.redirect("/bad-auth.html?error=server_error");
        }
        return "";
    };

    const guildsResponse  = await fetch(DISCORD_API + "users/@me/guilds", {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    });
    if ( !guildsResponse.ok && guildsResponse.status === 401) {
        response.status = Status.Unauthorized
        response.redirect("/bad-auth.html?error=invalid_token");
        return "";
    };

    const userInfo = await identityResponse.json();
    const guildInfo: Guild[] = await guildsResponse.json();

    const inCorrectGuild = (guildsArray: Guild[], guildID: string) => {
        return guildsArray.filter((guild) => guild["id"] === guildID).length > 0
    };

    const user: User = {
        id: userInfo.id,
        username: userInfo.username,
        avatar: userInfo.avatar,
        discriminator: userInfo.discriminator,
        inCorrectGuild: inCorrectGuild(guildInfo, GUILD_INFO.id)
    } ;
 
    return JSON.stringify(user);
};

router
    .get("/login", (ctx) => {
        ctx.response.redirect(DISCORD_API + OAUTH_AUTH)
    })
    .get("/auth", async (ctx) => {
    // parse response from Discord API authorization (30 char alphanumerical)
    const regex = /^[A-Za-z0-9]{30}$/
    const code = ctx.request.url.searchParams.get("code");

    console.log("Received authorization code:", code);

    const check = regex.test(code) 

    // authorization code is bad
    if (!check) {
        console.log("Invalid authorization code. Redirecting to /bad-auth.html");
        ctx.response.redirect("/bad-auth.html")
        return
    }

    const data = new URLSearchParams({
        client_id: `${bot_id}`,
        client_secret: `${discord_token}`,
        grant_type: "authorization_code",
        code: code,
        redirect_uri: OAUTH_REDIRECT_URL,
        scope: "identify email guilds"
    })

    const headers = {
        "Content-Type": "application/x-www-form-urlencoded"
    };

    // exchange authorization grant for access token
    try {
        const result = await fetch(DISCORD_API + OAUTH_TOKEN, {
            method: "POST",
            body: data,
            headers: headers
        }); 

        const accessToken: AccessToken = await result.json(); 

        console.log("Access Token: " + accessToken.access_token + " " + accessToken.expires_in)

        if (regex.test(accessToken.access_token)) {
            await ctx.cookies.set("discord-access-token", accessToken.access_token);
            await ctx.cookies.set("discord-token-expiration", Date.now().toString())  // todo cookie math
            console.log("User authenticated successfully. Redirecting to dashboard.html...");
            ctx.response.redirect("/dashboard.html");
        } else {
            console.log("Invalid access token received. Redirecting to /bad-auth.html");
            ctx.response.status = Status.BadRequest
            ctx.response.redirect("/bad-auth.html")
            return
        }
    } catch (error) {
        console.error("Error fetching access token:", error);
        console.log("Redirecting to /bad-auth.html due to an error.");
        ctx.response.status = Status.InternalServerError;
        ctx.response.redirect("/bad-auth.html");
        return;
    }
})

    .post("/identity", async (ctx) => {
        ctx.response.body = await getIdentity(ctx.cookies, ctx.response)
    })
    .get("/images/:path*", (ctx) => {
        if (ctx.params && ctx.params.path) { 
            ctx.response.body = DISCORD_CDN + ctx.params.path;
        };
    })
    .get("/userroles/:userid", async (ctx) => {
        if (ctx.params && ctx.params.userid) { 
            // verify that the userid is a number
            if (!digitRegex.test(ctx.params.userid)) {
                ctx.response.status = Status.BadRequest
                return
            }

            console.log("Fetching user roles: " + ctx.params.userid)

            const response = await fetch(DISCORD_API + "guilds/" + GUILD_INFO.id + "/members/" + ctx.params.userid, {
                headers: {
                    "Authorization": "Bot " + `${token}`
                }
            });

            // todo need to verify identity?

            ctx.response.body = await response.json();
        }
    })
    .post("/roles", async (ctx) => {
        ctx.response.body = await getRoles();
    })
    .post("/save", async ctx => {
        interface SavePayload {
            userID: string,
            rolesToAdd: string[],
            rolesToRemove: string[]
        };

        // Grab latest copy of all roles
        const roles = await getRoles();

        const payload = ctx.request.body()
        if (payload.type === "json") {
            const savePayload: SavePayload = await payload.value;

                // verify identity (make sure user is properly authenticated)
            const identityResponse = await getIdentity(ctx.cookies, ctx.response);
            if (identityResponse === "") {
                ctx.response.status = Status.Unauthorized
                ctx.response.redirect("/bad-auth.html")
                return
            };

            const identity = JSON.parse(identityResponse).id;

            if (identity !== savePayload.userID) {
                ctx.response.status = Status.Unauthorized
                return
            };

            // sanitize roles (remove restricted roles)
            savePayload.rolesToAdd = savePayload.rolesToAdd.filter((roleID) => {
                return digitRegex.test(roleID) && !roles.some((role: Role) => role.category === "restricted" && role.id === roleID)
            });

            savePayload.rolesToRemove = savePayload.rolesToRemove.filter((roleID) => {
                return digitRegex.test(roleID) && !roles.some((role: Role) => role.category === "restricted" && role.id === roleID)
            }); 

            if (savePayload.rolesToAdd.length === 0 && savePayload.rolesToRemove.length === 0) {
                ctx.response.status = Status.UnprocessableEntity
                return
            };

            const roleAPI = `guilds/${GUILD_INFO.id}/members/${savePayload.userID}/roles/`; // /{role.id} 

            // assign roles
            for (const roleID of savePayload.rolesToAdd) { 
                await wait(1000); 

                const options = {
                    headers: {
                        "Authorization": "Bot " + `${token}`,
                        "Content-Length": "0"
                    },
                    method: "PUT",
                    body: null
                };

                fetch(DISCORD_API + roleAPI + roleID, options)
                    .then((res) => {
                        console.log(res.status)
                        res.text().then(console.log)
                        if (res.status === 429) {
                            // rate limited
                        };
                    })
                    .catch((err) => {
                        console.error(err)
                        ctx.response.status = Status.ServiceUnavailable
                        return
                    })
            }

            // remove roles
            for (const roleID of savePayload.rolesToRemove) {
                await wait(1000)
                fetch(DISCORD_API + roleAPI + roleID, {
                    headers: {
                        "Authorization": "Bot " + `${token}`
                    },
                    method: "DELETE"
                }).then((res) => {
                    console.log(res.status)
                            console.log(res.body)
                    if (res.status === 429) {
                        // rate limited
                    }
                }).catch((err) => {
                    console.error(err)
                    ctx.response.status = Status.ServiceUnavailable
                    return
                })
            }

            // console.log("SAVE: " + payload)
            ctx.response.status = Status.OK;
        } else {
            console.error("Bad payload received. " + payload.type)
            ctx.response.status = Status.UnprocessableEntity
        };
    })
    .get("/logout", (ctx) => {
        ctx.cookies.delete("discord-access-token")
        ctx.response.redirect("/")
    });

app.use(router.routes());
app.use(router.allowedMethods());

app.use(async (ctx) => {
    ctx.response.headers.set("Cache-Control", "max-age=604800")
    await send(ctx, ctx.request.url.pathname, {
        root: DEBUG ? `${Deno.cwd()}/static` : "/home/scu-discord-bot/static",
        index: "index.html",
    });
});

console.log(`🦕 Deno server running at http://localhost:8000/ 🦕`)
await app.listen({ port: 8000 });