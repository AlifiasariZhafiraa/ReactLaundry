//response privilege frontend

const getRole = () => {
  if (localStorage.getItem("role")) {
    const role = localStorage.getItem("role")
    return role
  }
  return undefined
}

export default getRole