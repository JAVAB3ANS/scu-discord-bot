async function getUserInfo() {
    console.log("Getting user info.")
    let response = await fetch("/identity", {
        method: "POST"
    })
    if (response.redirected) {
        redirectBrowser(response.url)
    }
    if (response.status !== 200) {
        // Show message as a Bootstrap alert, redirect in __ seconds.
        console.error("Failed to retrieve user info!")
        redirectBrowser("/")
    }
    return await response.json()
}

async function getRoles() {
    console.log("Getting role info.")
    let response = await fetch("/roles", {
        method: "POST"
    })

    if (response.status === 401) {
        // Show message as a Bootstrap alert, redirect in __ seconds.
        redirectBrowser("/login")
    }
    return await response.json()
}

// getUserRoles(userID: string): string[]
async function getUserRoles(userID) {
    console.log("Getting user roles.")
    let response = await fetch(`/userroles/${userID}`)  // todo check for identity
    return (await response.json())["roles"]
}

async function getUserAvatar(userID, avatarID) {
    console.log("Getting user avatar.")
    let path = `avatars/${userID}/${avatarID}.png`
    let image = await fetch(`/images/${path}`)
    return await image.text()
} 

function redirectBrowser(location) {
    window.location.replace(location)
}

function decimalToRGB(number) {
    const r = (number & 0xff0000) >> 16
    const g = (number & 0x00ff00) >> 8
    const b = (number & 0x0000ff)

    let normalizedColor
    if (r === 0 && g === 0 && b === 0) {
        normalizedColor = [80, 80, 80]
    } else {
        normalizedColor = [r-10, g-10, b-10]
    }

    return normalizedColor
}

/**
 *
 * @param role
 * @param endChar
 * @param restricted
 * @param current
 * @return {string}
 */
function generateRoleTemplate(role, endChar="", restricted=false, current=false) {
    const colorArray = decimalToRGB(role.color)
    const color = `rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`

    return `
        <div
            class="role ${restricted ? "restricted" : ""} ${current ? "current" : "assignable"}"
            style="border-color: ${color}; background-color: ${color}; cursor:pointer;"
            id="${role.id}"
        >
            ${role.name} <strong>${endChar}</strong>
        </div>
    `
}
 
function generateAndRenderAssignableRoles(assignableRoles) {
    const categoryArray = ["member", "concentration", "rlc", "location", "identity", "tags"]

    let categoryCollection = ""
    categoryArray.forEach(category => {
        // Uppercase the first character, add a space for every underscore
        const normalizedHeader = category.charAt(0).toUpperCase() + category.replace("_", " ").slice(1)

        let roleCollection = ""
        assignableRoles.filter(role => role.category === category).map(role => {
            roleCollection += generateRoleTemplate(role, "+")
        })

        const categoryTemplate = `
            <details open>
                <summary id="${category}-roles-header">
                    ${normalizedHeader} Roles
                </summary>
                <div id="${category}-roles-container" style="margin-top: 1em">
                    ${roleCollection}
                </div>
            </details>
            `
        categoryCollection += categoryTemplate
    })

    document.getElementById("assignable-roles-accordion").innerHTML = categoryCollection
}

/**
 * Searches for a Role in an array of Role objects by ID
 * @param roles: Role[]
 * @param roleID: string
 * @return Role
 */
function lookupRole(roles, roleID) {
    return roles.find(role => role.id === roleID)
}

// generateCurrentRoles(userRoles: string[])     // this is only used when roles are given as strings
function generateCurrentRoles(userRoles) {
    let matchingRoles = userRoles.map(roleID => lookupRole(globalRoleMap.allRoles, roleID))
    let orderedRoles = matchingRoles.sort((a, b) => b.priority - a.priority)

    globalRoleMap.currentRoles = orderedRoles   // globalRoleMap.currentRoles: Role[]
    renderCurrentRoles(orderedRoles)
}

// renderCurrentRoles(currentRoles: Role[])
function renderCurrentRoles(currentRoles) {
    let roleCollection = ""

    currentRoles.map(role => {
        if (globalRoleMap.allRoles.find(anyRole => anyRole.category === "restricted" && anyRole.id === role.id)) {
            roleCollection += generateRoleTemplate(role, "", true, true)
        } else {
            roleCollection += generateRoleTemplate(role, "x", false, true)
        }
    })

    document.getElementById("current-roles-container").innerHTML = roleCollection
}

async function submitRoleChanges(userID, roleIDsToAdd, roleIDsToRemove) {
    console.log("Submitting role changes.")

    $("#time").text(roleIDsToAdd.length + roleIDsToRemove.length)
    $("#submit-alert").show()

    let response = await fetch("/save", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            userID: userID,
            rolesToAdd: roleIDsToAdd,
            rolesToRemove: roleIDsToRemove
        })
    })
    if (response.redirected) {
        redirectBrowser(response.url)
    } else if (response.status !== 200) {
        alert("There was an issue saving your role changes. Please try again.\n\n" + response.status + ": " + response.statusText)
    } else {
        location.reload()   // refreshes the webpage
    }
}

let globalRoleMap = {
    currentRoles: [],
    allRoles: [],
    rolesToAdd: [],
    rolesToRemove: []
}

window.onload = async function() {  
    $("#submit-alert").hide()

    let userInfo = await getUserInfo()
    let userImageURL = await getUserAvatar(userInfo.id, userInfo.avatar)    

    // Populate global role map
    globalRoleMap.allRoles = (await getRoles()).sort((roleA, roleB) => roleA.name > roleB.name ? 1 : -1)
    globalRoleMap.currentRoles = await getUserRoles(userInfo.id)

    // Here, figure out how to remove "unverified" role from user to replace with "student" role  

    // Set identity details
    document.getElementById("username").innerText = userInfo.username + "#" + userInfo.discriminator
    document.getElementById("avatar-icon").setAttribute("src", userImageURL !== "null" ? userImageURL : "./discord-small.webp")
    document.getElementById("guild-icon").setAttribute("src", "./discord-small.webp")

    // Render roles
    generateCurrentRoles(globalRoleMap.currentRoles)
    generateAndRenderAssignableRoles(globalRoleMap.allRoles.filter(role => !globalRoleMap.currentRoles.includes(role)))

    document.getElementById("submit-changes").addEventListener("click", () => {
        console.log("Submitting changes!")
        submitRoleChanges(userInfo.id, globalRoleMap.rolesToAdd, globalRoleMap.rolesToRemove)
    })

    document.getElementById("reset").addEventListener("click", () => {
        console.log("Resetting changes!")
        location.reload()
    })

    // click listener for each role element

    function reassignRoleEventListeners() {
        Array.from(document.getElementsByClassName("role")).forEach(role => {
            if (!role.classList.contains("restricted")) {
                role.addEventListener("click", () => {
                    console.log("clicked! ID: " + role.id)

                    // remove a current role
                    if (role.classList.contains("current")) {
                        // remove the Role from currentRoles
                        let currentRoleIndex = globalRoleMap.currentRoles.findIndex(r => r.id === role.id)
                        globalRoleMap.currentRoles.splice(currentRoleIndex, 1)

                        // add to rolesToRemove
                        globalRoleMap.rolesToRemove.push(role.id)

                        // remove from rolesToAdd
                        let index = globalRoleMap.rolesToAdd.indexOf(role.id)
                        if (index !== -1) {
                            globalRoleMap.rolesToAdd.splice(index, 1)
                        }

                    } else if (role.classList.contains("assignable")) {
                        // add an assignable role
                        // add the Role to currentRoles
                        globalRoleMap.currentRoles.push(lookupRole(globalRoleMap.allRoles, role.id))

                        // add the ID to rolesToAdd
                        globalRoleMap.rolesToAdd.push(role.id) 

                        // remove the ID from rolesToRemove
                        let index = globalRoleMap.rolesToRemove.indexOf(role.id)
                        if (index !== -1) {
                            globalRoleMap.rolesToRemove.splice(index, 1)
                        }
                    }

                    // re-render current and assignable roles
                    renderCurrentRoles(globalRoleMap.currentRoles)
                    generateAndRenderAssignableRoles(globalRoleMap.allRoles.filter(r => !globalRoleMap.currentRoles.includes(r)))
                    reassignRoleEventListeners()
                })
            }
        })
    }

    reassignRoleEventListeners()
} 