import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import outlet from './OutletAPI';
import user from '../user/UserAPI';
import { MenuItem } from '@mui/material';

import getRole from '../../../utils/access';

//style outlet

// icon
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import AddBoxIcon from '@mui/icons-material/AddBox';


const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  // border: '2px solid #000',
  textAlign: 'center',
  boxShadow: 24,
  p: 4,
  borderRadius: 4

};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#BDBDBD',
    color: '#000000',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: '#F2F2F2',
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const createForm = (label, id, disabled, required, select, value, nested) => {
  return { label, id, disabled, required, select, value, nested }
}

const createPayload = (id_outlet, id_user, alamat, user) => {
  return { id_outlet, id_user, alamat, user }
}

export default function OutletPage() {
  React.useEffect(() => {
    const User = getRole()
    if (User !== 'admin') {
      window.location = '/denied'
    }

    const fetchData = async () => {
      const result = await outlet.show()
      setRows(result)
    }

    const fetchOwner = async () => {
      const rawUsers = await user.showOwners()
      setOwners(rawUsers)
    }

    fetchData()
    fetchOwner()
    setPayload(createPayload(0, "", "", ""))
  }, [])

  const [rows, setRows] = React.useState([])
  const [open, setOpen] = React.useState(false);
  const [action, setAction] = React.useState("");
  const [payload, setPayload] = React.useState({});
  const [owners, setOwners] = React.useState([]);




  // handler modal
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // handler button
  const handleDelete = async (item) => {
    const result = await outlet.destroy(item)
    if (!result.success) {
      window.alert("failed delete outlet")
    } else {
      window.alert("success delete outlet")

      // fetching new data
      const newFetch = await outlet.show()
      setRows(newFetch)
    }
  }

  const handleUpdate = async (item) => {
    handleOpen()
    setAction("update")
    const customPayload = createPayload(
      item.id_outlet,
      item.id_user,
      item.alamat,
      item.user
    )
    setPayload(customPayload)
  }

  const handleAdd = async () => {
    // setPayload(createPayload(0, "", "", ""))
    handleOpen()
    // setAction("add")
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (action === "update") {
      const result = await outlet.update(payload)
      if (!result.success) {
        window.alert("failed update outlet")
      } else {
        window.alert("success update outlet")
        handleClose() //close modal

        // fetching new data
        const newFetch = await outlet.show()
        setRows(newFetch)
      }
    } else {
      const result = await outlet.add(payload)
      if (!result.success) {
        window.alert("failed add outlet")
      } else {
        window.alert("success add outlet")
        handleClose() //close modal

        // fetching new data
        const newFetch = await outlet.show()
        setRows(newFetch)
      }
    }
  };

  const forms = [
    createForm("ID Outlet", "id_outlet", true, false, false, payload.id_outlet),
    createForm("Nama Owner", "id_user", false, true, true, payload.id_user,
      (
        owners.map((owner) => {
          return (
            <MenuItem key={owner.id_user} value={owner.id_user} >
              {owner.nama_user}
            </MenuItem>
          )
        }
        )
      )
    ),
    createForm("Alamat", "alamat", false, true, false, payload.alamat)
  ]

  return (
    <>
      <Box component={Paper} elevation={5} sx={{
        display: 'flex', flexDirection: 'row',
        width: '100%', borderRadius: 1.5, padding: 2, my: 2
      }}>
        <Box component={Paper} elevation={0} sx={{
          display: 'flex', flexDirection: 'row',
          justifyContent: 'space-between', width: '100%', borderRadius: 1.5, padding: 2, backgroundColor: '#F2F2F2', border: 'solid #BDBDBD 1px'
        }}>
          <Typography noWrap sx={{ textAlign: 'center', color: '#000000' }} variant='h5' component='h5'>
            <b>Outlet</b>
          </Typography>
          <Button
            elevation={5}
            sx={{ borderRadius: 2 }}
            onClick={() => handleAdd()}
            color="light"
            variant="contained" startIcon={<AddBoxIcon />}
          >
            Tambah Outlet
          </Button>
        </Box>
      </Box>
      <Box component={Paper} elevation={5} sx={{ borderRadius: 3, padding: 2, width: '100%' }}>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table" >
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nama Owner</StyledTableCell>
              <StyledTableCell>Alamat</StyledTableCell>
              <StyledTableCell>Aksi</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <StyledTableRow key={row.id_outlet}>
                <StyledTableCell>{i + 1}</StyledTableCell>
                <StyledTableCell>{row.id_outlet}</StyledTableCell>
                <StyledTableCell>{row.user.nama_user}</StyledTableCell>
                <StyledTableCell>{row.alamat}</StyledTableCell>
                <StyledTableCell>
                  <IconButton aria-label="edit" onClick={() => handleUpdate(row)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton aria-label="delete" onClick={() => handleDelete(row)}>
                    <DeleteIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>


      {/* modal start */}
      <div>
        {/* <Button onClick={handleOpen}>Open modal</Button> */}
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              <b>MODAL OUTLET</b>
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              {forms.map((form, i) => (
                <TextField
                  onChange={(e) => setPayload({ ...payload, [form.id]: e.target.value })}
                  disabled={form.disabled}
                  required={form.required}
                  select={form.select}
                  value={form.value}
                  margin="normal"
                  fullWidth
                  id={form.id}
                  label={form.label}
                  name={form.id}
                  size='small'
                  InputLabelProps={{ shrink: true }}
                  sx={{ textAlign: "left" }}
                  color="light"

                >
                  {form.nested}
                </TextField>
              ))}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, borderRadius: 5 }}
                color="light"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>
      </div>
    </>
  );
}