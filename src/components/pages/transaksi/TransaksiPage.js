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
import transaksi from './TransaksiAPI';
import user from '../user/UserAPI';
import member from '../member/MemberAPI';
import paket from '../paket/PaketAPI';
import outlet from '../outlet/OutletAPI';
import Pdf from "react-to-pdf";

import { MenuItem, Grid } from '@mui/material';
import getRole from '../../../utils/access';

// icon
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';

function getSafe(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

const styleModal = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  textAlign: 'center',
  boxShadow: 24,
  p: 4,
  borderRadius: 4
};

const styleModalAdd = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '70vw',
  bgcolor: 'background.paper',
  textAlign: 'center',
  boxShadow: 24,
  p: 4,
  borderRadius: 4
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: '#BDBDBD',
    color: '#000000'
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


const createPayload = (id_transaksi, id_user, id_member, id_outlet) => {
  return { id_transaksi, id_user, id_member, id_outlet }
}

const ref = React.createRef();

export default function TransaksiPage() {
  React.useEffect(() => {
    const User = getRole()
    if (User !== 'admin' && User !== 'kasir') {
      window.location = '/denied'
    }

    const fetchData = async () => {
      const result = await transaksi.show()
      setRows(result)

      const rawMembers = await member.show()
      setMembers(rawMembers)

      const rawPakets = await paket.show()
      setPakets(rawPakets)

      const rawOutlets = await outlet.show()
      setOutlets(rawOutlets)
    }

    fetchData()
    setPayload(createPayload(0, 0, 0, 0, []))
  }, [])

  const [rows, setRows] = React.useState([])
  const [openAdd, setOpenAdd] = React.useState(false);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [openStatus, setOpenStatus] = React.useState(false);
  const [showButton, setShowButton] = React.useState("none");
  const [payload, setPayload] = React.useState({});
  const [bill, setBill] = React.useState({});
  const [detail, setDetail] = React.useState([]);
  const [members, setMembers] = React.useState([]);
  const [pakets, setPakets] = React.useState([]);
  const [outlets, setOutlets] = React.useState([]);
  const [lists, setLists] = React.useState([
    { id_paket: 0, qty: 0 },
    { id_paket: 0, qty: 0 },
    { id_paket: 0, qty: 0 }
  ]);



  // handler modal
  const handleOpenAdd = () => setOpenAdd(true);
  const handleCloseAdd = () => setOpenAdd(false);
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);
  const handleOpenStatus = () => setOpenStatus(true);
  const handleCloseStatus = () => setOpenStatus(false);


  // handler button bayar
  const handleShowButton = () => setShowButton("block");
  const handleHideButton = () => setShowButton("none");

  const handleInfo = async (item) => {
    setBill(item)

    const dataDetail = item.detail
    let total = 0
    dataDetail.map((item) => {
      let price = item.qty * item.paket.harga
      total += price
    })

    dataDetail.total = total
    setDetail(dataDetail)

    if (item.dibayar === "belum_dibayar") {
      handleShowButton()
    }

    handleOpenInfo()
  }

  const handleAdd = async () => {
    const userId = localStorage.getItem("userId")
    setPayload(createPayload(0, userId, members[0].id_member, outlets[0].id_outlet, []))
    setLists([
      { id_paket: pakets[0].id_paket, qty: 0 },
      { id_paket: pakets[0].id_paket, qty: 0 },
      { id_paket: pakets[0].id_paket, qty: 0 }
    ])
    handleOpenAdd()
  }

  const handleBayar = async () => {
    // window.alert("bayar")
    const result = await transaksi.bayar(bill)
    if (!result.success) {
      window.alert("failed to bayar transaksi")
    } else {
      window.alert("success to bayar transaksi")

      // fetching new data
      const newFetch = await transaksi.show()
      setRows(newFetch)
    }
    handleHideButton()
    handleCloseInfo()
  }

  const handleUpdateStatus = async (event) => {
    event.preventDefault();

    const result = await transaksi.updateStatus(bill)
    if (!result.success) {
      window.alert("failed to update status transaksi")
    } else {
      window.alert("success to update status transaksi")

      // fetching new data
      const newFetch = await transaksi.show()
      setRows(newFetch)
    }


    handleCloseStatus()
    handleCloseInfo()
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const customPayload = {
      ...payload,
      list_paket: lists
    }

    const result = await transaksi.add(customPayload)
    if (!result.success) {
      window.alert("failed add transaksi")
    } else {
      window.alert("success add transaksi")

      // fetching new data
      const newFetch = await transaksi.show()
      setRows(newFetch)
    }

    handleCloseAdd() //close modal
  };

  const templateDetail = [
    createForm("Jenis Paket", "id_paket", false, true, true, null,
      (
        pakets.map((owner) => {
          return (
            <MenuItem key={owner.id_paket} value={owner.id_paket} >
              {owner.jenis}
            </MenuItem>
          )
        }
        )
      )
    ),
    createForm("Jumlah", "qty", false, true, false, null)
  ]

  const formsAddDetailTransaksi = [
    templateDetail, templateDetail, templateDetail
  ]

  const formsAddTransaksi = [
    createForm("ID Transaksi", "id_transaksi", true, false, false, payload.id_transaksi),
    createForm("ID Petugas", "id_user", true, false, false, payload.id_user),
    createForm("Nama Member", "id_member", false, true, true, payload.id_member,
      (
        members.map((owner) => {
          return (
            <MenuItem key={owner.id_member} value={owner.id_member} >
              {owner.nama_member}
            </MenuItem>
          )
        }
        )
      )
    ),
    createForm("Outlet", "id_outlet", false, true, true, payload.id_outlet,
      (
        outlets.map((owner) => {
          return (
            <MenuItem key={owner.id_outlet} value={owner.id_outlet} >
              {owner.alamat}
            </MenuItem>
          )
        }
        )
      )
    )
  ]


  const status = ['baru', 'diproses', 'selesai', 'diambil']

  const formStatus = [
    createForm("Status", "status", false, true, true, bill.status,
      (
        status.map((item) => {
          return (
            <MenuItem key={item} value={item} >
              {item}
            </MenuItem>
          )
        }
        )
      )
    ),
  ]

  const handleList = (i, id, e) => {
    e.preventDefault();
    let list = [...lists]
    list[i] = { ...list[i], [id]: e.target.value }

    setLists(list)
  }

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
            <b>Transaksi</b>
          </Typography>
          <Button
            elevation={5}
            sx={{ borderRadius: 2 }}
            onClick={() => handleAdd()}
            color="light"
            variant="contained" startIcon={<AddBoxIcon />}
          >
            Tambah Transaksi
          </Button>
        </Box>
      </Box>
      <Box component={Paper} elevation={5} sx={{ borderRadius: 3, padding: 2, width: '100%' }}>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>#</StyledTableCell>
              <StyledTableCell>ID</StyledTableCell>
              <StyledTableCell>Nama Petugas</StyledTableCell>
              <StyledTableCell>Nama Member</StyledTableCell>
              <StyledTableCell>Tgl Diterima</StyledTableCell>
              <StyledTableCell>Batas Waktu</StyledTableCell>
              <StyledTableCell>Status</StyledTableCell>
              <StyledTableCell>Dibayar</StyledTableCell>
              <StyledTableCell>Action</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, i) => (
              <StyledTableRow key={row.id_transaksi}>
                <StyledTableCell>{i + 1}</StyledTableCell>
                <StyledTableCell>{row.id_transaksi}</StyledTableCell>
                <StyledTableCell>{row.user.nama_user}</StyledTableCell>
                <StyledTableCell>{row.member.nama_member}</StyledTableCell>
                <StyledTableCell>{row.tgl_diterima}</StyledTableCell>
                <StyledTableCell>{row.batas_waktu}</StyledTableCell>
                <StyledTableCell>{row.status}</StyledTableCell>
                <StyledTableCell>{row.dibayar}</StyledTableCell>
                <StyledTableCell>
                  <IconButton aria-label="edit" onClick={() => handleInfo(row)}>
                    <EditIcon />
                  </IconButton>
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>



      <div>
        {/* Modal Add */}
        <Modal
          open={openAdd}
          onClose={handleCloseAdd}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModalAdd}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Tambah Transaksi
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
              <Grid container spacing={5}>
                <Grid item xs={6}>
                  <Typography sx={{ borderBottom: 'dashed black 2px', textAlign: 'left', paddingY: '1rem' }} variant='p' component='h4'>
                    Informasi Transaksi
                  </Typography>
                  {formsAddTransaksi.map((form, i) => (
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
                </Grid>

                {/* List Barang */}
                <Grid item xs={6}>
                  <Typography sx={{ borderBottom: 'dashed black 2px', textAlign: 'left', paddingY: '1rem' }} variant='p' component='h4'>
                    List Paket Laundry
                  </Typography>
                  <>
                    {
                      formsAddDetailTransaksi.map((item, i) => (
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                          <Typography sx={{ textAlign: 'left', paddingY: '1rem' }} variant='p' component='h3'>
                            {i + 1}
                          </Typography>
                          {item.map(form => (
                            <TextField
                              onChange={(e) => handleList(i, form.id, e)}
                              disabled={form.disabled}
                              required={form.required}
                              select={form.select}
                              value={lists[i][form.id]}
                              margin="normal"
                              fullWidth
                              id={form.id}
                              label={form.label}
                              name={form.id}
                              size='small'
                              InputLabelProps={{ shrink: true }}
                              sx={{ textAlign: "left", ml: '0.7rem' }}
                              color="light"

                            >
                              {form.nested}
                            </TextField>
                          ))}
                        </Box>
                      ))
                    }
                  </>
                </Grid>
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                color="light"
              >
                Submit
              </Button>
            </Box>
          </Box>
        </Modal>


        {/* Modal Info */}
        <Modal
          open={openInfo}
          onClose={handleCloseInfo}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <div ref={ref}>
              <Box sx={{ borderBottom: 'dashed black 2px' }}>
                <Typography id="modal-modal-title" sx={{ fontWeight: "bold" }} variant="h5" component="h2">
                  Struk Transaksi Laundry
                </Typography>
                <Typography variant='p' component='h3'>{getSafe(() => bill.outlet.alamat)}</Typography>
              </Box>
              <Box sx={{ borderBottom: 'dashed black 2px', textAlign: 'left', paddingY: '1rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h4'>ID Transaksi</Typography>
                  <Typography variant='p' component='h4'>{bill.id_transaksi}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h4'>Tanggal Diterima</Typography>
                  <Typography variant='p' component='h4'>{bill.tgl_diterima}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h4'>Tanggal Batas</Typography>
                  <Typography variant='p' component='h4'>{bill.batas_waktu}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h4'>Tanggal Dibayar</Typography>
                  <Typography variant='p' component='h4'>{bill.tgl_bayar}</Typography>
                </Box>
              </Box>
              <Box sx={{ borderBottom: 'dashed black 2px', textAlign: 'left', paddingY: '1rem' }}>
                {
                  detail.map(item => (
                    <Box sx={{ paddingY: '0.2rem' }}>
                      <Typography sx={{ fontWeight: "bold" }} variant='p' component='h3'>{item.paket.jenis}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                        <Typography variant='p' component='h5'>{item.qty}x{item.paket.harga}</Typography>
                        <Typography variant='p' component='h4'>{item.qty * item.paket.harga}</Typography>
                      </Box>
                    </Box>
                  ))
                }
              </Box>
              <Box sx={{ textAlign: 'left', paddingTop: '2rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h2'>Total</Typography>
                  <Typography variant='p' component='h2'>{detail.total}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h4'>Status Pengerjaan</Typography>
                  <Typography variant='p' component='h4'>{bill.status}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'row' }}>
                  <Typography variant='p' component='h4'>Status Bayar</Typography>
                  <Typography variant='p' component='h4'>{bill.dibayar}</Typography>
                </Box>
              </Box>
              </div>
              <div>
              <Box sx={{ textAlign: 'left', paddingTop: '1.5rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button type="submit" variant="contained" color='success' onClick={handleOpenStatus}>
                    Status
                  </Button>
                  <Button type="submit" variant="contained" sx={{ display: showButton, ml: '3px' }} onClick={() => handleBayar()}>
                    Bayar
                  </Button>
                  <Pdf targetRef={ref} filename="struk-pembayaran.pdf" x={.5} y={.5} scale={0.8}>
                    {({ toPdf }) =>
                      <Button variant="contained" sx={{ ml: '3px' }} color='secondary' onClick={toPdf}>
                        Download
                      </Button>
                    }
                  </Pdf>
                </Box>
              </Box>
              </div>
          </Box>
        </Modal>


        {/* Modal Update Status */}
        <Modal
          open={openStatus}
          onClose={handleCloseStatus}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Update Status Transaksi
            </Typography>
            <Box component="form" noValidate onSubmit={handleUpdateStatus} sx={{ mt: 1 }}>
              {formStatus.map((form, i) => (
                <TextField
                  onChange={(e) => setBill({ ...bill, [form.id]: e.target.value })}
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

                >
                  {form.nested}
                </TextField>
              ))}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
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