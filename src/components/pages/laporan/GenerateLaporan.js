import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import transaksi from "../transaksi/TransaksiAPI";
import { Grid } from "@mui/material";
import getRole from "../../../utils/access";


import EditIcon from "@mui/icons-material/Edit";

import Pdf from "react-to-pdf";
const ref = React.createRef();

function getSafe(fn, defaultVal) {
  try {
    return fn();
  } catch (e) {
    return defaultVal;
  }
}

const styleModal = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: '2px solid #000',
  textAlign: "center",
  boxShadow: 24,
  p: 4,
};

const styleModalAdd = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "70vw",
  bgcolor: "background.paper",
  // border: '2px solid #000',
  textAlign: "center",
  boxShadow: "none",
  p: 4,
  borderRadius: "8px",
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
  "&:nth-of-type(odd)": {
    backgroundColor: '#F2F2F2',
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function GenerateLaporan() {
  React.useEffect(() => {
    const User = getRole();
    if (User !== "admin" && User !== "owner") {
      window.location = "/denied";
    }

    const userId = localStorage.getItem("userId")

    const fetchData = async () => {
      if(User === 'owner'){
        const resultOwner = await transaksi.filterOwner(userId)
        setRows(resultOwner);
      }else{
        const result = await transaksi.show();
        setRows(result);
      }
    };

    fetchData();

  }, []);

  const [rows, setRows] = React.useState([]);
  const [openInfo, setOpenInfo] = React.useState(false);
  const [bill, setBill] = React.useState({});
  const [detail, setDetail] = React.useState([]);

  // handler modal
  const handleOpenInfo = () => setOpenInfo(true);
  const handleCloseInfo = () => setOpenInfo(false);

  const handleInfo = async (item) => {
    setBill(item);

    const dataDetail = item.detail;
    let total = 0;
    dataDetail.map((item) => {
      let price = item.qty * item.paket.harga;
      total += price;
    });

    dataDetail.total = total;
    setDetail(dataDetail);

    handleOpenInfo();
  };

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
            <b>Laporan</b>
          </Typography>          
        </Box>
      </Box>


      <Paper
        sx={{
          width: "100%",
          overflow: "hidden",
          boxShadow: "0px 10px 20px #3030300D",
          p: 2,
          borderRadius: 3,
        }}
      >
        <div ref={ref}>          
        <Box component={Paper} elevation={5} sx={{ borderRadius: 3, padding: 2, width: '100%' }}>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3 }}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
              <TableHead>
                <TableRow>
                  <StyledTableCell align="center" width={60}>
                    #
                  </StyledTableCell>
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
                      <EditIcon
                        fontSize="small"
                        onClick={() => handleInfo(row)}
                        sx={{
                          color: "#868974",
                          cursor: "pointer",
                          margin: "0px 8px",
                          "&:hover": {
                            color: "#A27741",
                          },
                        }}
                      />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ display: 'flex', width: "100%", justifyContent: "flex-end" }}>
             <Pdf targetRef={ref} filename="struk-pembayaran.pdf" x={.5} y={.5} scale={0.8}>
               {({ toPdf }) =>
                 <Button variant="contained"
                   sx={{
                     backgroundColor: "#83AB81",
                     color: "#000000",
                     padding: "6px 20px",
                     "&:hover": {
                       backgroundColor: "#BDBDBD",
                       color: "#000000",
                     },
                   }}
                   color='light' onClick={toPdf}>
                   Download
                 </Button>
               }
             </Pdf>
           </Box>
          </Box>
        </div>
      </Paper>


      <div>
        {/* Modal Info */}
        <Modal
          open={openInfo}
          onClose={handleCloseInfo}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={styleModal}>
            <div ref={ref}>
              <Box sx={{ borderBottom: "dashed black 2px" }} >
                <Typography
                  id="modal-modal-title"
                  sx={{ fontWeight: "bold" }}
                  variant="h5"
                  component="h2"
                >
                  Struk Transaksi Laundry
                </Typography>
                <Typography variant="p" component="h3">
                  {getSafe(() => bill.outlet.alamat)}
                </Typography>
              </Box>
              <Box
                sx={{
                  borderBottom: "dashed black 2px",
                  textAlign: "left",
                  paddingY: "1rem",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h4">
                    ID Transaksi
                  </Typography>
                  <Typography variant="p" component="h4">
                    {bill.id_transaksi}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h4">
                    Tanggal Diterima
                  </Typography>
                  <Typography variant="p" component="h4">
                    {bill.tgl_diterima}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h4">
                    Tanggal Batas
                  </Typography>
                  <Typography variant="p" component="h4">
                    {bill.batas_waktu}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h4">
                    Tanggal Dibayar
                  </Typography>
                  <Typography variant="p" component="h4">
                    {bill.tgl_bayar}
                  </Typography>
                </Box>
              </Box>
              <Box
                sx={{
                  borderBottom: "dashed black 2px",
                  textAlign: "left",
                  paddingY: "1rem",
                }}
              >
                {detail.map((item) => (
                  <Box sx={{ paddingY: "0.2rem" }}>
                    <Typography
                      sx={{ fontWeight: "bold" }}
                      variant="p"
                      component="h3"
                    >
                      {item.paket.jenis}
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        flexDirection: "row",
                      }}
                    >
                      <Typography variant="p" component="h5">
                        {item.qty}x{item.paket.harga}
                      </Typography>
                      <Typography variant="p" component="h4">
                        {item.qty * item.paket.harga}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
              <Box sx={{ textAlign: "left", paddingTop: "2rem" }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h2">
                    Total
                  </Typography>
                  <Typography variant="p" component="h2">
                    {detail.total}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h4">
                    Status Pengerjaan
                  </Typography>
                  <Typography variant="p" component="h4">
                    {bill.status}
                  </Typography>
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: "row",
                  }}
                >
                  <Typography variant="p" component="h4">
                    Status Bayar
                  </Typography>
                  <Typography variant="p" component="h4">
                    {bill.dibayar}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ textAlign: "left", paddingTop: "1.5rem" }}>
                <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
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


      </div>
    </>
  );
}