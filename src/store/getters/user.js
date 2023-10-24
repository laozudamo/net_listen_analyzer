const user = {
    token: state => state.user.token,
    username: state => state.user.username,
    id: state => state.user.id,
    role: state => state.user.role,
    description: state => state.user.description
}

export default user