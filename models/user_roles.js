let user_roles = [{
    id: 1,
    role: "admin",
    permissions: ["weather_analytics", "user_management"] // TODO: should be a separate table of permissions itself
},
{
    id: 2,
    role: "user",
    permissions: ["weather_analytics"]
}
]

// TODO: should be a DB schema instead of a in-memory variable
module.exports = user_roles