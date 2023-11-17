import axios from "axios"
const base_url = "http://localhost:8000/api/transaksi"


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
      let transaksi = result.data.data
      return transaksi
    }
  } catch (error) {
    console.log(error)
  }
}

const createPayload = (id_transaksi, id_user, id_member, tgl_diterima, batas_waktu, status, dibayar, member, user, outlet, detail, total) => {
  return { id_transaksi, id_user, id_member, tgl_diterima, batas_waktu, status, dibayar, member, user, outlet, detail, total }
}


// api 
const showOne = async (payload) => {
  let url = base_url + '/' + payload.id_transaksi
  try {
    let result = await axios.get(url, headerConfig())
    if (result.status === 200) {
      let transaksi = result.data.data
      const payload = createPayload(...transaksi)
      return payload
    }
  } catch (error) {
    console.log(error)
  }
}




const bayar = async (payload) => {
  let url = base_url + '/bayar/' + payload.id_transaksi
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

const updateStatus = async (payload) => {
  let url = base_url + '/status/' + payload.id_transaksi
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

const filterOwner = async (payload) => {
  try {
    let result = await show()
    if (result !== null) {
      let filterData = []
      result.map((item)=>{
        if(item.outlet.id_user == payload){
          filterData.push(item)
        }
      })

      return filterData
    }
  } catch (error) {
    console.log(error)
    return null
  }
}



export default {show, add, showOne, bayar, updateStatus, count, filterOwner}