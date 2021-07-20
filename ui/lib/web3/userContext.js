console.log("Initialising");
const setUser = (user) => {
    context.user = user
    console.log("User is", user);
}

const context = {user:{}, setUser};
export default context;