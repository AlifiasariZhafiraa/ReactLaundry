import axios from "axios"
const base_url = "http://localhost:8000/api/member"

//crud member + endpoint

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
      let member = result.data.data
      return member
    }
  } catch (error) {
    console.log(error)
  }
}

const update = async (payload) => {
  let url = base_url + '/' + payload.id_member
  try {
    let result = await axios.put(url, payload, headerConfig())
    if (result.status === 200) {
      return {success: true}
    }
  } catch (error) {
    console.log(error)
    return {success:false}
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
  let url = base_url + '/' + payload.id_member
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

export default {show, update, destroy, add, count}

