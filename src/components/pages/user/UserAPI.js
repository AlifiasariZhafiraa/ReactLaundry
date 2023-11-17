import axios from "axios"
const base_url = "http://localhost:8000/api/user"

//crud user + endpoint

const headerConfig = () => {
  const token = localStorage.getItem("token")
  let header = {
    headers: { Authorization: `Bearer ${token}` }
  }
  return header
}

// api 
const show = async () => {
  let url = base_url
  try {
    let result = await axios.get(url, headerConfig())
    if (result.status === 200) {
      let user = result.data.data
      return user
    }
  } catch (error) {
    console.log(error)
  }
}

const update = async (payload) => {
  let url = base_url + '/' + payload.id_user
  try {
    let result = await axios.put(url, payload, headerConfig())
    if (result.status === 200) {
      return { success: true }
    }
  } catch (error) {
    console.log(error)
    return { success: false }
  }
}

const add = async (payload) => {
  let url = base_url
  try {
    let result = await axios.post(url, payload, headerConfig())
    if (result.status === 200) {
      return { success: true }
    }
  } catch (error) {
    console.log(error)
    return { success: false }
  }
}

const destroy = async (payload) => {
  let url = base_url + '/' + payload.id_user
  try {
    let result = await axios.delete(url, headerConfig())
    if (result.status === 200) {
      return { success: true }
    }
  } catch (error) {
    console.log(error)
    return { success: false }
  }
}

const showOwners = async () => {
  try {
    const owners = []
    const result = await show()
    result.forEach((owner) => {
      if (owner.role === "owner") {
        owners.push(owner)
      }
    })

    return owners
  } catch (err) {
    console.log(err)
  }

}

const showKasirAdmin = async () => {
  try {
    const owners = []
    const result = await show()
    result.forEach((owner) => {
      if (owner.role === "kasir" || owner.role === "admin") {
        owners.push(owner)
      }
    })

    return owners
  } catch (err) {
    console.log(err)
  }

}

const count = async () => {
  try {
    let result = await show()
    if (result !== null) {
      let count = result.length
      return count
    }
  } catch (error) {
    console.log(error)
    return null
  }
}

export default { show, update, destroy, add, showOwners, showKasirAdmin, count }

